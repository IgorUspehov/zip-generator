import type { Archiver } from "archiver";
import { createRequire } from "node:module";
import { PassThrough, type Readable } from "node:stream";

import fs from "fs";
import path from "path";

import { resolveManifestsDir } from "@/lib/manifest/storage-paths";

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

export function buildCrmDemoZipFilename(clientId: string): string {
  const safeId = clientId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `crm-demo-${safeId || "site"}.zip`;
}

export async function buildClientDistZipBuffer(input: {
  distPath: string;
  readmeContent: string;
  manifestJson?: string;
}): Promise<Buffer> {
  const stream = createMvpProZipStream(input);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

const CRM_DEMO_README = `Website + CRM + Booking

This archive contains your published site files:
- index.html
- assets/
- images/ (if present)
- manifest.json

Deploy the contents to any static hosting provider.
`;

export function createCrmDemoZipStream(input: {
  distPath: string;
  manifestJson?: string;
  readmeContent?: string;
  forEmail?: boolean;
}): Readable {
  const archive = createArchiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();

  archive.on("error", (error) => {
    stream.destroy(error);
  });

  archive.pipe(stream);

  if (fs.existsSync(input.distPath)) {
    if (input.forEmail) {
      appendDistFilesForEmailZip(archive, input.distPath);
    } else {
      archive.directory(input.distPath, false);
    }
  }

  archive.append(input.readmeContent ?? CRM_DEMO_README, { name: "README.txt" });

  if (input.manifestJson) {
    archive.append(input.manifestJson, { name: "manifest.json" });
  }

  void archive.finalize();

  return stream;
}

function shouldExcludeFromEmailZip(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");
  return /\/gif\//i.test(normalized) || /\.gif$/i.test(normalized);
}

function appendDistFilesForEmailZip(archive: Archiver, distPath: string, basePath = ""): void {
  for (const entry of fs.readdirSync(distPath, { withFileTypes: true })) {
    const fullPath = path.join(distPath, entry.name);
    const relativePath = path.posix.join(basePath, entry.name);
    if (shouldExcludeFromEmailZip(relativePath)) {
      continue;
    }
    if (entry.isDirectory()) {
      appendDistFilesForEmailZip(archive, fullPath, relativePath);
      continue;
    }
    archive.file(fullPath, { name: relativePath });
  }
}

export async function buildCrmDemoZipBuffer(input: {
  distPath: string;
  manifestJson?: string;
  readmeContent?: string;
  forEmail?: boolean;
}): Promise<Buffer> {
  const stream = createCrmDemoZipStream(input);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export function readManifestJson(clientId: string): string | undefined {
  const manifestPath = path.join(resolveManifestsDir(), `${clientId}.json`);
  if (!fs.existsSync(manifestPath)) {
    return undefined;
  }

  return fs.readFileSync(manifestPath, "utf8");
}
