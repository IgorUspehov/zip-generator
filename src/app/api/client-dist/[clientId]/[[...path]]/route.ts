import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";

import { FRAME_ANCESTORS_CSP_VALUE } from "@/lib/cloudflare/iframe-ready";
import { resolveClientDistPath } from "@/lib/site-delivery/dist-store";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".toml": "text/plain; charset=utf-8",
  ".map": "application/json",
};

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] || "application/octet-stream";
}

/**
 * Serve personalized client-dists/{clientId}/dist for local CRM iframe
 * when Cloudflare Pages is not configured.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ clientId: string; path?: string[] }> },
) {
  const { clientId: rawId, path: segments } = await context.params;
  const clientId = decodeURIComponent(rawId || "").trim();
  if (!clientId || !/^[a-zA-Z0-9_-]+$/.test(clientId)) {
    return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
  }

  const distRoot = path.resolve(resolveClientDistPath(clientId));
  const rel = (segments && segments.length > 0 ? segments.join("/") : "index.html").replace(
    /^\/+/,
    "",
  );
  const candidate = path.resolve(distRoot, rel);
  if (candidate !== distRoot && !candidate.startsWith(`${distRoot}${path.sep}`)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let filePath = candidate;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = fs.readFileSync(filePath);
  const headers: Record<string, string> = {
    "Content-Type": contentTypeFor(filePath),
    "Cache-Control": "no-store",
  };
  // HTML must be embeddable from demo parents (same list as Cloudflare Pages _headers).
  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    headers["Content-Security-Policy"] =
      `frame-ancestors 'self' ${FRAME_ANCESTORS_CSP_VALUE}`;
  }
  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers,
  });
}
