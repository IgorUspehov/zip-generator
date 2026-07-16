import { createHash } from "node:crypto";
import fs from "fs";
import path from "path";

const CF_API = "https://api.cloudflare.com/client/v4";

export type CloudflareDeployResult = {
  projectName: string;
  siteUrl: string;
  deploymentId: string;
};

type CloudflareConfig = {
  accountId: string;
  token: string;
};

function getCloudflareConfig(): CloudflareConfig {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !token) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not configured");
  }
  return { accountId, token };
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

function hashBuffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function walkDistFiles(distPath: string, base = distPath): { relativePath: string; absolutePath: string }[] {
  const entries: { relativePath: string; absolutePath: string }[] = [];
  for (const entry of fs.readdirSync(distPath, { withFileTypes: true })) {
    const absolutePath = path.join(distPath, entry.name);
    const relativePath = path.relative(base, absolutePath).split(path.sep).join("/");
    if (entry.isDirectory()) {
      entries.push(...walkDistFiles(absolutePath, base));
      continue;
    }
    entries.push({ relativePath, absolutePath });
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

async function waitForDeploymentReady(
  accountId: string,
  token: string,
  projectName: string,
  deploymentId: string,
  timeoutMs = 180_000,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(
      `${CF_API}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to poll Cloudflare deployment status: ${errorText}`);
    }

    const payload = (await response.json()) as {
      result?: {
        latest_stage?: { status?: string; name?: string };
      };
    };

    const status = payload.result?.latest_stage?.status;
    console.log("[cloudflare/deploy] deployment stage", {
      deploymentId,
      stage: payload.result?.latest_stage?.name,
      status,
    });

    if (status === "success") {
      return;
    }

    if (status === "failure") {
      throw new Error("Cloudflare deployment failed");
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

  console.log("[cloudflare/deploy] creating project", { projectName });
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[cloudflare/deploy] create project failed", {
      status: response.status,
      errorText,
    });
    throw new Error(`Failed to create Cloudflare Pages project: ${errorText}`);
  }

  const payload = (await response.json()) as {
    result?: { name?: string; subdomain?: string };
  };
  const resultName = payload.result?.name ?? projectName;
  const siteUrl = resolveSiteUrl(payload.result?.subdomain, resultName);
  console.log("[cloudflare/deploy] project created", { projectName: resultName, siteUrl });
  return { projectName: resultName, siteUrl };
}

export async function deployDistToPages(
  projectName: string,
  distPath: string,
): Promise<{ deploymentId: string }> {
  if (!fs.existsSync(distPath)) {
    throw new Error(`Dist path does not exist: ${distPath}`);
  }

  const { accountId, token } = getCloudflareConfig();
  const files = walkDistFiles(distPath);
  if (files.length === 0) {
    throw new Error(`Dist path is empty: ${distPath}`);
  }

  const manifest: Record<string, string> = {};
  const form = new FormData();

  for (const file of files) {
    const manifestKey = `/${file.relativePath}`;
    const buffer = await fs.promises.readFile(file.absolutePath);
    manifest[manifestKey] = hashBuffer(buffer);
    form.append(file.relativePath, new Blob([buffer]), file.relativePath);
  }

  form.append("manifest", JSON.stringify(manifest));

  console.log("[cloudflare/deploy] uploading deployment", {
    projectName,
    files: files.length,
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[cloudflare/deploy] upload failed", { status: response.status, errorText });
    throw new Error(`Failed to deploy to Cloudflare Pages: ${errorText}`);
  }

  const payload = (await response.json()) as { result?: { id?: string } };
  const deploymentId = payload.result?.id;
  if (!deploymentId) {
    throw new Error("Cloudflare deployment created but no deployment id was returned");
  }

  console.log("[cloudflare/deploy] upload accepted", { deploymentId });
  await waitForDeploymentReady(accountId, token, projectName, deploymentId);
  return { deploymentId };
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
    const { deploymentId } = await deployDistToPages(projectName, distPath);
    const result = { projectName, siteUrl, deploymentId };
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
