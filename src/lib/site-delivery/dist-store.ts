import fs from "fs";
import path from "path";

import { resolvePersistentDataDir } from "@/lib/site-delivery/data-dir";

export function resolveClientDistsRoot(): string {
  return path.join(resolvePersistentDataDir(), "client-dists");
}

export function resolveClientDistPath(clientId: string): string {
  return path.join(resolveClientDistsRoot(), clientId, "dist");
}

export function persistClientDistSnapshot(clientId: string, stagingDir: string): string {
  const targetDir = resolveClientDistPath(clientId);
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.cpSync(stagingDir, targetDir, { recursive: true });
  return targetDir;
}

export function clientDistExists(clientId: string): boolean {
  return fs.existsSync(path.join(resolveClientDistPath(clientId), "index.html"));
}
