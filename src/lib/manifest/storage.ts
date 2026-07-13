import fs from "fs";
import path from "path";

import { isEnospcError, prunePersistentStorage } from "@/lib/manifest/prune-storage";

export function resolveManifestsDir(): string {
  const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  if (volumePath) {
    return path.join(volumePath, "manifests");
  }
  return path.join(process.cwd(), "data/manifests");
}

function writeClientManifestFile(clientId: string, manifest: Record<string, unknown>): void {
  const dir = resolveManifestsDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${clientId}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

export function saveClientManifest(clientId: string, manifest: Record<string, unknown>): void {
  prunePersistentStorage();

  try {
    writeClientManifestFile(clientId, manifest);
  } catch (error) {
    if (!isEnospcError(error)) {
      throw error;
    }

    console.warn("[manifest-storage] ENOSPC while saving manifest, pruning and retrying once");
    prunePersistentStorage({ maxManifests: 60, maxClientDists: 10, maxAgeDays: 3 });
    writeClientManifestFile(clientId, manifest);
  }
}

export function loadClientManifest(clientId: string): Record<string, unknown> | null {
  const filePath = path.join(resolveManifestsDir(), `${clientId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

export function buildMvpRedirectUrl(baseUrl: string, clientId: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("clientId", clientId);
  return url.toString();
}
