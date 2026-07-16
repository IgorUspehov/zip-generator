import fs from "fs";
import path from "path";

import { resolveMvpDistPath } from "@/lib/cloudflare/deploy";

export function resolveClientDistPath(clientId: string): string {
  const perClientDist = path.join(process.cwd(), "artifacts", clientId, "dist");
  if (fs.existsSync(path.join(perClientDist, "index.html"))) {
    return perClientDist;
  }

  return resolveMvpDistPath();
}

export function snapshotClientDist(clientId: string): string {
  const sourceDir = resolveMvpDistPath();
  const targetDir = path.join(process.cwd(), "artifacts", clientId, "dist");

  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  return targetDir;
}
