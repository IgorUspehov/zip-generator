import { blake3 } from "@noble/hashes/blake3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import fs from "fs";
import path from "path";

const CF_API = "https://api.cloudflare.com/client/v4";
const MAX_BUCKET_BYTES = 50 * 1024 * 1024;
const MAX_BUCKET_FILES = 100;

export type CloudflareDeployResult = {
  projectName: string;
  siteUrl: string;
  deploymentId: string;
};

type CloudflareConfig = {
  accountId: string;
  token: string;
};

type DistFile = {
  relativePath: string;
  absolutePath: string;
  contentType: string;
  sizeInBytes: number;
  hash: string;
  buffer: Buffer;
};

type DeploymentApiResult = {
  id?: string;
  url?: string;
  latest_stage?: { name?: string; status?: string };
  stages?: Array<{ name?: string; status?: string }>;
};

function getCloudflareConfig(): CloudflareConfig {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !token) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not configured");
  }
  return { accountId, token };
}

/** Temporary diagnostic — never logs secret values. */
export function logCloudflareEnvPresence(context = "cloudflare-env"): void {
  console.log(`[${context}]`, {
    cloudflareAccountIdPresent: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID?.trim()),
    cloudflareApiTokenPresent: Boolean(process.env.CLOUDFLARE_API_TOKEN?.trim()),
    cloudflareAccountIdLength: process.env.CLOUDFLARE_ACCOUNT_ID?.trim().length ?? 0,
    cloudflareApiTokenLength: process.env.CLOUDFLARE_API_TOKEN?.trim().length ?? 0,
  });
}

export function isCloudflareDeployConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID?.trim() && process.env.CLOUDFLARE_API_TOKEN?.trim());
}

function sanitizeProjectName(clientId: string, timestamp: number): string {
  return `mvp-${clientId}-${timestamp}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 58);
}

/** Matches wrangler pages hashFile: blake3(base64(contents) + extension).hex.slice(0, 32) */
function hashPagesAsset(buffer: Buffer, relativePath: string): string {
  const base64Contents = buffer.toString("base64");
  const extension = path.extname(relativePath).substring(1);
  return bytesToHex(blake3(new TextEncoder().encode(base64Contents + extension))).slice(0, 32);
}

function getContentType(relativePath: string): string {
  const ext = path.extname(relativePath).toLowerCase();
  const map: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
    ".map": "application/json",
    ".xml": "application/xml",
  };
  return map[ext] ?? "application/octet-stream";
}

function walkDistFiles(distPath: string, base = distPath): DistFile[] {
  const entries: DistFile[] = [];
  for (const entry of fs.readdirSync(distPath, { withFileTypes: true })) {
    const absolutePath = path.join(distPath, entry.name);
    const relativePath = path.relative(base, absolutePath).split(path.sep).join("/");
    if (entry.isDirectory()) {
      entries.push(...walkDistFiles(absolutePath, base));
      continue;
    }
    const buffer = fs.readFileSync(absolutePath);
    entries.push({
      relativePath,
      absolutePath,
      contentType: getContentType(relativePath),
      sizeInBytes: buffer.length,
      hash: hashPagesAsset(buffer, relativePath),
      buffer,
    });
  }
  return entries;
}

function resolveSiteUrl(subdomain: string | undefined, projectName: string): string {
  if (!subdomain) {
    return `https://${projectName}.pages.dev`;
  }
  if (subdomain.startsWith("http://") || subdomain.startsWith("https://")) {
    return subdomain;
  }
  if (subdomain.includes(".")) {
    return `https://${subdomain}`;
  }
  return `https://${subdomain}.pages.dev`;
}

function maskAccountId(accountId: string): string {
  if (accountId.length <= 8) return "***";
  return `${accountId.slice(0, 4)}…${accountId.slice(-4)}`;
}

async function readJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text.slice(0, 2000) };
  }
}

async function fetchUploadJwt(accountId: string, token: string, projectName: string): Promise<string> {
  const response = await fetch(
    `${CF_API}/accounts/${accountId}/pages/projects/${projectName}/upload-token`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] upload-token response", {
    status: response.status,
    ok: response.ok,
    success:
      typeof body === "object" && body && "success" in body
        ? (body as { success?: boolean }).success
        : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed to get Cloudflare upload token: ${JSON.stringify(body)}`);
  }
  const jwt = (body as { result?: { jwt?: string } })?.result?.jwt;
  if (!jwt) {
    throw new Error("Cloudflare upload-token response missing jwt");
  }
  return jwt;
}

async function checkMissingHashes(jwt: string, hashes: string[]): Promise<string[]> {
  const response = await fetch(`${CF_API}/pages/assets/check-missing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ hashes }),
  });
  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] check-missing response", {
    status: response.status,
    ok: response.ok,
    missingCount: Array.isArray((body as { result?: unknown })?.result)
      ? (body as { result: string[] }).result.length
      : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed check-missing: ${JSON.stringify(body)}`);
  }
  const missing = (body as { result?: string[] })?.result;
  return Array.isArray(missing) ? missing : hashes;
}

function buildUploadBuckets(files: DistFile[]): DistFile[][] {
  const buckets: DistFile[][] = [[]];
  let currentSize = 0;

  for (const file of files) {
    const bucket = buckets[buckets.length - 1];
    const wouldExceed =
      bucket.length >= MAX_BUCKET_FILES ||
      (bucket.length > 0 && currentSize + file.sizeInBytes > MAX_BUCKET_BYTES);
    if (wouldExceed) {
      buckets.push([file]);
      currentSize = file.sizeInBytes;
      continue;
    }
    bucket.push(file);
    currentSize += file.sizeInBytes;
  }

  return buckets.filter((bucket) => bucket.length > 0);
}

async function uploadAssetBuckets(jwt: string, files: DistFile[]): Promise<void> {
  const buckets = buildUploadBuckets(files);
  console.log("[cloudflare/deploy] uploading asset buckets", {
    buckets: buckets.length,
    files: files.length,
  });

  for (const [index, bucket] of buckets.entries()) {
    const payload = bucket.map((file) => ({
      key: file.hash,
      value: file.buffer.toString("base64"),
      metadata: { contentType: file.contentType },
      base64: true,
    }));

    const response = await fetch(`${CF_API}/pages/assets/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await readJsonSafe(response);
    console.log("[cloudflare/deploy] assets/upload response", {
      bucket: index + 1,
      of: buckets.length,
      status: response.status,
      ok: response.ok,
      fileCount: bucket.length,
    });
    if (!response.ok) {
      throw new Error(`Failed pages assets upload: ${JSON.stringify(body)}`);
    }
  }
}

async function upsertHashes(jwt: string, hashes: string[]): Promise<void> {
  const response = await fetch(`${CF_API}/pages/assets/upsert-hashes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ hashes }),
  });
  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] upsert-hashes response", {
    status: response.status,
    ok: response.ok,
  });
  if (!response.ok) {
    console.warn("[cloudflare/deploy] upsert-hashes failed (non-fatal)", {
      body: typeof body === "object" ? body : String(body).slice(0, 500),
    });
  }
}

async function getDeployment(
  accountId: string,
  token: string,
  projectName: string,
  deploymentId: string,
): Promise<DeploymentApiResult> {
  const response = await fetch(
    `${CF_API}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] get deployment response", {
    status: response.status,
    ok: response.ok,
    deploymentId,
    latest_stage: (body as { result?: DeploymentApiResult })?.result?.latest_stage,
    url: (body as { result?: DeploymentApiResult })?.result?.url,
  });
  if (!response.ok) {
    throw new Error(`Failed to get Cloudflare deployment: ${JSON.stringify(body)}`);
  }
  return (body as { result?: DeploymentApiResult })?.result ?? {};
}

async function waitForDeploymentReady(
  accountId: string,
  token: string,
  projectName: string,
  deploymentId: string,
  timeoutMs = 180_000,
): Promise<DeploymentApiResult> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const result = await getDeployment(accountId, token, projectName, deploymentId);
    const status = result.latest_stage?.status;

    if (status === "success") {
      return result;
    }

    if (status === "failure" || status === "canceled") {
      throw new Error(
        `Cloudflare deployment ${status}: stage=${result.latest_stage?.name ?? "unknown"}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Cloudflare deployment timed out waiting for ready state");
}

export function resolveMvpDistPath(): string {
  const candidates = [
    process.env.MVP_DIST_PATH,
    path.join(process.cwd(), "mvp-template/dist"),
    path.join(process.cwd(), "artifacts/factory_output/react_mvp/dist"),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }

  throw new Error("MVP dist folder not found. Build or copy react_mvp/dist to mvp-template/dist.");
}

export async function createPagesProject(
  clientId: string,
): Promise<{ projectName: string; siteUrl: string }> {
  const { accountId, token } = getCloudflareConfig();
  const projectName = sanitizeProjectName(clientId, Date.now());

  console.log("[cloudflare/deploy] creating project", {
    projectName,
    accountIdMasked: maskAccountId(accountId),
  });
  const response = await fetch(`${CF_API}/accounts/${accountId}/pages/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      production_branch: "main",
    }),
  });

  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] create project response", {
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(`Failed to create Cloudflare Pages project: ${JSON.stringify(body)}`);
  }

  const payload = body as { result?: { name?: string; subdomain?: string } };
  const resultName = payload.result?.name ?? projectName;
  const siteUrl = resolveSiteUrl(payload.result?.subdomain, resultName);
  console.log("[cloudflare/deploy] project created", { projectName: resultName, siteUrl });
  return { projectName: resultName, siteUrl };
}

/**
 * Official Pages Direct Upload flow (same as wrangler pages deploy):
 * 1) upload-token JWT
 * 2) blake3 asset hashes + check-missing
 * 3) POST /pages/assets/upload for missing files
 * 4) upsert-hashes
 * 5) POST .../deployments with manifest only (no file bodies)
 */
export async function deployDistToPages(
  projectName: string,
  distPath: string,
): Promise<{ deploymentId: string; deploymentUrl?: string }> {
  if (!fs.existsSync(distPath)) {
    throw new Error(`Dist path does not exist: ${distPath}`);
  }

  const { accountId, token } = getCloudflareConfig();
  const files = walkDistFiles(distPath);
  if (files.length === 0) {
    throw new Error(`Dist path is empty: ${distPath}`);
  }

  const indexFile = files.find((file) => file.relativePath === "index.html");
  if (!indexFile) {
    throw new Error(`Missing index.html in dist: ${distPath}`);
  }

  // Manifest keys MUST include leading slash (wrangler format).
  const manifest: Record<string, string> = {};
  for (const file of files) {
    manifest[`/${file.relativePath}`] = file.hash;
  }

  console.log("[cloudflare/deploy] preparing upload", {
    projectName,
    fileCount: files.length,
    hasIndexHtml: true,
    indexHtmlBytes: indexFile.sizeInBytes,
    indexHtmlHash: indexFile.hash,
    accountIdMasked: maskAccountId(accountId),
  });

  const jwt = await fetchUploadJwt(accountId, token, projectName);
  const allHashes = files.map((file) => file.hash);
  const missingHashes = await checkMissingHashes(jwt, allHashes);
  const missingSet = new Set(missingHashes);
  const filesToUpload = files.filter((file) => missingSet.has(file.hash));

  console.log("[cloudflare/deploy] missing assets", {
    total: files.length,
    missing: filesToUpload.length,
    cached: files.length - filesToUpload.length,
  });

  if (filesToUpload.length > 0) {
    await uploadAssetBuckets(jwt, filesToUpload);
  }

  await upsertHashes(jwt, allHashes);

  const form = new FormData();
  form.append("manifest", JSON.stringify(manifest));

  console.log("[cloudflare/deploy] creating deployment with manifest", {
    projectName,
    manifestEntries: Object.keys(manifest).length,
  });

  const response = await fetch(
    `${CF_API}/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    },
  );

  const body = await readJsonSafe(response);
  console.log("[cloudflare/deploy] create deployment response", {
    status: response.status,
    ok: response.ok,
    deploymentId: (body as { result?: DeploymentApiResult })?.result?.id,
    deploymentUrl: (body as { result?: DeploymentApiResult })?.result?.url,
    latest_stage: (body as { result?: DeploymentApiResult })?.result?.latest_stage,
  });

  if (!response.ok) {
    throw new Error(`Failed to deploy to Cloudflare Pages: ${JSON.stringify(body)}`);
  }

  const deployment = (body as { result?: DeploymentApiResult })?.result;
  const deploymentId = deployment?.id;
  if (!deploymentId) {
    throw new Error("Cloudflare deployment created but no deployment id was returned");
  }

  const ready = await waitForDeploymentReady(accountId, token, projectName, deploymentId);
  console.log("[cloudflare/deploy] deployment ready", {
    deploymentId,
    deploymentUrl: ready.url ?? deployment?.url,
    latest_stage: ready.latest_stage,
  });

  return { deploymentId, deploymentUrl: ready.url ?? deployment?.url };
}

export async function deployToCloudflarePages(
  clientId: string,
  distPath: string,
): Promise<CloudflareDeployResult> {
  console.log("[cloudflare/deploy] start", { clientId, distPath });
  let createdProjectName: string | null = null;

  try {
    const { projectName, siteUrl } = await createPagesProject(clientId);
    createdProjectName = projectName;
    const { deploymentId, deploymentUrl } = await deployDistToPages(projectName, distPath);
    const result = {
      projectName,
      siteUrl: deploymentUrl ?? siteUrl,
      deploymentId,
    };
    console.log("[cloudflare/deploy] success", result);
    return result;
  } catch (error) {
    if (createdProjectName) {
      console.error("[cloudflare/deploy] cleaning up failed project", {
        projectName: createdProjectName,
      });
      await deletePagesProject(createdProjectName).catch((deleteError) => {
        console.error("[cloudflare/deploy] failed to delete orphaned project:", deleteError);
      });
    }
    throw error;
  }
}

export async function deletePagesProject(projectName: string): Promise<void> {
  const { accountId, token } = getCloudflareConfig();
  const response = await fetch(`${CF_API}/accounts/${accountId}/pages/projects/${projectName}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete Cloudflare Pages project ${projectName}: ${await response.text()}`);
  }
}
