import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { createMvpProZipStream, readManifestJson } from "@/lib/mvp-pro/zip-stream";
import { verifySiteDownloadAccess } from "@/lib/site-delivery/download-access";
import { resolveClientDistPath } from "@/lib/site-delivery/dist-store";

export const runtime = "nodejs";

function buildZipFilename(clientId: string): string {
  const safeId = clientId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `site-${safeId || "mvp"}.zip`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim() ?? "";
  const token = searchParams.get("token")?.trim() ?? "";

  if (!clientId || !token) {
    return NextResponse.json({ error: "clientId and token are required" }, { status: 400 });
  }

  if (!verifySiteDownloadAccess(clientId, token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const distPath = resolveClientDistPath(clientId);
    const manifestJson = readManifestJson(clientId);
    const zipStream = createMvpProZipStream({
      distPath,
      readmeContent: "MVP Factory — exported site files\n",
      manifestJson,
    });
    const webStream = Readable.toWeb(zipStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${buildZipFilename(clientId)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to build ZIP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
