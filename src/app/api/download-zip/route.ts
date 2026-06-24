import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { verifyMvpProDownloadAccess } from "@/lib/mvp-pro/entitlement-store";
import { resolveClientDistPath } from "@/lib/mvp-pro/dist-resolver";
import { buildMvpProReadme } from "@/lib/mvp-pro/readme";
import { buildZipFilename, createMvpProZipStream, readManifestJson } from "@/lib/mvp-pro/zip-stream";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim() ?? "";
  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? undefined;

  if (!clientId || !token) {
    return NextResponse.json({ error: "clientId and token are required" }, { status: 400 });
  }

  const access = verifyMvpProDownloadAccess({ clientId, token, email });
  if (!access.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const distPath = resolveClientDistPath(clientId);
    const readmeContent = buildMvpProReadme(access.entitlement);
    const manifestJson = readManifestJson(clientId);
    const zipStream = createMvpProZipStream({ distPath, readmeContent, manifestJson });
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
