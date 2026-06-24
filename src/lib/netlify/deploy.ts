import type { Archiver } from "archiver";
import { createRequire } from "node:module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const createArchiver = require("archiver") as (
  format: string,
  options?: { zlib?: { level?: number } },
) => Archiver;

const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

export type NetlifyDeployResult = {
  siteId: string;
  siteUrl: string;
  deployId: string;
};

function getNetlifyToken(): string {
  const token = process.env.NETLIFY_API_TOKEN ?? process.env.NETLIFY_AUTH_TOKEN;
  if (!token) {
    throw new Error("NETLIFY_API_TOKEN is not configured");
  }
  return token;
}

function sanitizeSiteName(clientId: string, timestamp: number): string {
  return `mvp-${clientId}-${timestamp}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 63);
}

async function createZipBuffer(distPath: string): Promise<Buffer> {
  if (!fs.existsSync(distPath)) {
    throw new Error(`Dist path does not exist: ${distPath}`);
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = createArchiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("warning", (warning) => {
      if (warning.code === "ENOENT") {
        console.warn("[netlify/deploy] zip warning:", warning);
        return;
      }
      reject(warning);
    });
    archive.on("error", reject);
    archive.on("end", () => resolve(Buffer.concat(chunks)));

    archive.directory(distPath, false);
    void archive.finalize();
  });
}

async function waitForDeployReady(
  deployId: string,
  token: string,
  timeoutMs = 180_000,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(`${NETLIFY_API_BASE}/deploys/${deployId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to poll Netlify deploy status: ${errorText}`);
    }

    const deploy = (await response.json()) as {
      state?: string;
      error_message?: string;
    };

    console.log("[netlify/deploy] deploy state", { deployId, state: deploy.state });

    if (deploy.state === "ready") {
      return;
    }

    if (deploy.state === "error") {
      throw new Error(`Netlify deploy processing failed: ${deploy.error_message || "unknown error"}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Netlify deploy timed out waiting for ready state");
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

export async function createNetlifySite(clientId: string): Promise<{ siteId: string; siteUrl: string }> {
  const token = getNetlifyToken();
  const timestamp = Date.now();
  const siteName = sanitizeSiteName(clientId, timestamp);

  console.log("[netlify/deploy] creating site", { siteName });
  const createResponse = await fetch(`${NETLIFY_API_BASE}/sites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: siteName }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("[netlify/deploy] create site failed", { status: createResponse.status, errorText });
    throw new Error(`Failed to create Netlify site: ${errorText}`);
  }

  const site = (await createResponse.json()) as {
    id: string;
    ssl_url?: string;
    url?: string;
    subdomain?: string;
  };
  console.log("[netlify/deploy] site created", { siteId: site.id, ssl_url: site.ssl_url, url: site.url });

  const siteUrl =
    site.ssl_url || site.url || (site.subdomain ? `https://${site.subdomain}.netlify.app` : "");
  if (!siteUrl) {
    console.error("[netlify/deploy] missing site URL in response", site);
    throw new Error("Netlify site created but no public URL was returned");
  }

  return { siteId: site.id, siteUrl };
}

export async function uploadAndDeploy(siteId: string, distPath: string): Promise<{ deployId: string }> {
  const token = getNetlifyToken();

  console.log("[netlify/deploy] zipping dist with archiver");
  const zipBuffer = await createZipBuffer(distPath);
  console.log("[netlify/deploy] zip ready", { bytes: zipBuffer.length });

  console.log("[netlify/deploy] uploading deploy");
  const deployResponse = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/zip",
      Accept: "application/json",
    },
    body: new Uint8Array(zipBuffer),
  });

  if (!deployResponse.ok) {
    const errorText = await deployResponse.text();
    console.error("[netlify/deploy] upload failed", { status: deployResponse.status, errorText });
    throw new Error(`Failed to deploy to Netlify: ${errorText}`);
  }

  const deploy = (await deployResponse.json()) as {
    id: string;
    state?: string;
    error_message?: string;
  };

  if (deploy.state === "error") {
    throw new Error(`Netlify deploy failed: ${deploy.error_message || "unknown error"}`);
  }

  console.log("[netlify/deploy] upload accepted", { deployId: deploy.id, state: deploy.state });

  await waitForDeployReady(deploy.id, token);

  return { deployId: deploy.id };
}

export async function deployToNetlify(
  clientId: string,
  distPath: string,
): Promise<NetlifyDeployResult> {
  console.log("[netlify/deploy] start", { clientId, distPath });
  let createdSiteId: string | null = null;
  try {
    const { siteId, siteUrl } = await createNetlifySite(clientId);
    createdSiteId = siteId;
    const { deployId } = await uploadAndDeploy(siteId, distPath);
    const result = { siteId, siteUrl, deployId };
    console.log("[netlify/deploy] success", result);
    return result;
  } catch (error) {
    if (createdSiteId) {
      console.error("[netlify/deploy] cleaning up failed site", { siteId: createdSiteId });
      await deleteNetlifySite(createdSiteId).catch((deleteError) => {
        console.error("[netlify/deploy] failed to delete orphaned site:", deleteError);
      });
    }
    throw error;
  }
}

export function monitorDeployInBackground(deployId: string, siteId: string): void {
  setImmediate(() => {
    void (async () => {
      try {
        const token = getNetlifyToken();
        await waitForDeployReady(deployId, token);
        console.log("[netlify/deploy] background deploy ready", { deployId, siteId });
      } catch (error) {
        console.error("[netlify/deploy] background deploy failed", {
          deployId,
          siteId,
          error,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    })();
  });
}

export async function deleteNetlifySite(siteId: string): Promise<void> {
  const token = getNetlifyToken();
  const response = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete Netlify site ${siteId}: ${await response.text()}`);
  }
}
