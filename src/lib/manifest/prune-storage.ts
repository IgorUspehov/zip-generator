import fs from "fs";
import path from "path";

import { resolveClientDistsRoot } from "@/lib/site-delivery/dist-store";

function resolveManifestsDir(): string {
  const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  if (volumePath) {
    return path.join(volumePath, "manifests");
  }
  return path.join(process.cwd(), "data/manifests");
}

function pruneFilesByAge(dir: string, maxAgeMs: number, extension?: string): number {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const cutoff = Date.now() - maxAgeMs;
  let removed = 0;

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (!stat.isFile()) {
      continue;
    }
    if (extension && !entry.endsWith(extension)) {
      continue;
    }
    if (stat.mtimeMs >= cutoff) {
      continue;
    }

    try {
      fs.unlinkSync(fullPath);
      removed += 1;
    } catch {
      /* best effort */
    }
  }

  return removed;
}

function pruneDirectoriesByAge(dir: string, maxAgeMs: number): number {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const cutoff = Date.now() - maxAgeMs;
  let removed = 0;

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (!stat.isDirectory()) {
      continue;
    }
    if (stat.mtimeMs >= cutoff) {
      continue;
    }

    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      removed += 1;
    } catch {
      /* best effort */
    }
  }

  return removed;
}

function pruneNewestOverflow(dir: string, keepCount: number, extension?: string): number {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const files = fs
    .readdirSync(dir)
    .map((name) => {
      const fullPath = path.join(dir, name);
      try {
        const stat = fs.statSync(fullPath);
        if (!stat.isFile()) {
          return null;
        }
        if (extension && !name.endsWith(extension)) {
          return null;
        }
        return { fullPath, mtimeMs: stat.mtimeMs };
      } catch {
        return null;
      }
    })
    .filter((item): item is { fullPath: string; mtimeMs: number } => item !== null)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  let removed = 0;
  for (const file of files.slice(keepCount)) {
    try {
      fs.unlinkSync(file.fullPath);
      removed += 1;
    } catch {
      /* best effort */
    }
  }

  return removed;
}

function pruneDirectoryOverflow(dir: string, keepCount: number): number {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const directories = fs
    .readdirSync(dir)
    .map((name) => {
      const fullPath = path.join(dir, name);
      try {
        const stat = fs.statSync(fullPath);
        if (!stat.isDirectory()) {
          return null;
        }
        return { fullPath, mtimeMs: stat.mtimeMs };
      } catch {
        return null;
      }
    })
    .filter((item): item is { fullPath: string; mtimeMs: number } => item !== null)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  let removed = 0;
  for (const directory of directories.slice(keepCount)) {
    try {
      fs.rmSync(directory.fullPath, { recursive: true, force: true });
      removed += 1;
    } catch {
      /* best effort */
    }
  }

  return removed;
}

export function prunePersistentStorage(options?: {
  maxManifests?: number;
  maxClientDists?: number;
  maxAgeDays?: number;
}): { manifestsRemoved: number; clientDistsRemoved: number } {
  const maxManifests = options?.maxManifests ?? 120;
  const maxClientDists = options?.maxClientDists ?? 25;
  const maxAgeMs = (options?.maxAgeDays ?? 14) * 24 * 60 * 60 * 1000;

  const manifestsDir = resolveManifestsDir();
  const clientDistsDir = resolveClientDistsRoot();

  const manifestsRemoved =
    pruneFilesByAge(manifestsDir, maxAgeMs, ".json") +
    pruneNewestOverflow(manifestsDir, maxManifests, ".json");
  const clientDistsRemoved =
    pruneDirectoriesByAge(clientDistsDir, maxAgeMs) +
    pruneDirectoryOverflow(clientDistsDir, maxClientDists);

  if (manifestsRemoved > 0 || clientDistsRemoved > 0) {
    console.log("[storage-prune] removed:", { manifestsRemoved, clientDistsRemoved });
  }

  return { manifestsRemoved, clientDistsRemoved };
}

export function isEnospcError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOSPC"
  );
}
