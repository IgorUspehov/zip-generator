import type { Archiver } from "archiver";
import { createRequire } from "node:module";
import { PassThrough, type Readable } from "node:stream";

import fs from "fs";
import path from "path";

import { resolveManifestsDir } from "@/lib/manifest/storage";

const require = createRequire(import.meta.url);
const createArchiver = require("archiver") as (
  format: string,
  options?: { zlib?: { level?: number } },
) => Archiver;

export function createMvpProZipStream(input: {
  distPath: string;
  readmeContent: string;
  manifestJson?: string;
}): Readable {
  const archive = createArchiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();

  archive.on("error", (error) => {
    stream.destroy(error);
  });

  archive.pipe(stream);

  if (fs.existsSync(input.distPath)) {
    archive.directory(input.distPath, false);
  }

  archive.append(input.readmeContent, { name: "README.md" });

  if (input.manifestJson) {
    archive.append(input.manifestJson, { name: "client-manifest.json" });
  }

  void archive.finalize();

  return stream;
}

export function buildZipFilename(clientId: string): string {
  const safeId = clientId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `mvp-pro-${safeId || "site"}.zip`;
}

export function readManifestJson(clientId: string): string | undefined {
  const manifestPath = path.join(resolveManifestsDir(), `${clientId}.json`);
  if (!fs.existsSync(manifestPath)) {
    return undefined;
  }

  return fs.readFileSync(manifestPath, "utf8");
}
