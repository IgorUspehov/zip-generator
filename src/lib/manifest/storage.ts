import fs from "fs";
import path from "path";

import { isEnospcError, runStorageCleanup } from "@/lib/manifest/storage-manager";
import { resolveManifestsDir } from "@/lib/manifest/storage-paths";

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
  runStorageCleanup();

  try {
    writeClientManifestFile(clientId, manifest);
  } catch (error) {
    if (!isEnospcError(error)) {
      throw error;
    }

    console.warn("[manifest-storage] ENOSPC while saving manifest, pruning and retrying once");
    runStorageCleanup({ aggressive: true, maxManifests: 30, maxClientDists: 8 });
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
