import fs from "fs";
import path from "path";

import { isEnospcError, runStorageCleanup } from "@/lib/manifest/storage-manager";
import { resolveManifestsDir } from "@/lib/manifest/storage-paths";
import {
  cacheClientManifest,
  readCachedClientManifest,
} from "@/lib/runtime-session-store";

export { resolveManifestsDir };

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
  // Always keep an in-process copy so demos work on ephemeral Render disks.
  cacheClientManifest(clientId, manifest);

  runStorageCleanup();

  try {
    writeClientManifestFile(clientId, manifest);
  } catch (error) {
    if (isEnospcError(error)) {
      console.warn("[manifest-storage] ENOSPC while saving manifest, pruning and retrying once");
      try {
        runStorageCleanup({ aggressive: true, maxManifests: 30, maxClientDists: 8 });
        writeClientManifestFile(clientId, manifest);
        return;
      } catch (retryError) {
        console.warn("[manifest-storage] disk write failed after prune — using memory only", {
          clientId,
          message: retryError instanceof Error ? retryError.message : String(retryError),
        });
        return;
      }
    }

    console.warn("[manifest-storage] disk write failed — using memory only", {
      clientId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export function loadClientManifest(clientId: string): Record<string, unknown> | null {
  const cached = readCachedClientManifest(clientId);
  if (cached) {
    return cached;
  }

  const filePath = path.join(resolveManifestsDir(), `${clientId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    cacheClientManifest(clientId, manifest);
    return manifest;
  } catch {
    return null;
  }
}

export function buildMvpRedirectUrl(baseUrl: string, clientId: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("clientId", clientId);
  return url.toString();
}
