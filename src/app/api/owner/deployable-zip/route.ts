import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { AdminUnauthorizedError, requireAdminSession, unauthorizedResponse } from "@/lib/admin/authorize";
import { buildDeployableZip, DeployableZipError } from "@/lib/deployable-zip";

export const runtime = "nodejs";

/**
 * OWNER Deployable ZIP download.
 *
 * Auth: existing admin session cookie (`site_admin_client`).
 * clientId is taken ONLY from the signed session — query/body clientId is ignored
 * so callers cannot download another tenant's ZIP by changing URL params.
 *
 * Does not use /api/download-site, /api/download-zip, or /api/admin/download-zip.
 */
export async function GET(request: Request) {
  try {
    const session = requireAdminSession(request);
    const clientId = session.clientId;

    // Explicitly ignore any clientId in the URL (defense in depth).
    const url = new URL(request.url);
    const queried = url.searchParams.get("clientId")?.trim();
    if (queried && queried !== clientId) {
      console.warn("[owner/deployable-zip] ignored foreign clientId query param", {
        sessionClientId: clientId,
        queriedClientId: queried,
      });
    }

    const result = await buildDeployableZip({
      clientId,
      mode: "owner",
    });

    if (result.clientId !== clientId) {
      console.error("[owner/deployable-zip] builder clientId mismatch", {
        sessionClientId: clientId,
        resultClientId: result.clientId,
      });
      return NextResponse.json({ ok: false, error: "Isolation failure" }, { status: 500 });
    }

    const webStream = Readable.toWeb(Readable.from(result.buffer)) as ReadableStream;
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-store",
        "X-Deployable-Zip-Client-Id": result.clientId,
        "X-Deployable-Zip-Mode": "owner",
        "X-Deployable-Zip-Isolation-Ok": result.isolation.ok ? "1" : "0",
      },
    });
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) return unauthorizedResponse();
    if (error instanceof DeployableZipError) {
      const status = error.code === "DIST_MISSING" ? 404 : 400;
      return NextResponse.json(
        { ok: false, error: error.message, code: error.code },
        { status },
      );
    }
    const message = error instanceof Error ? error.message : "Failed to build owner ZIP";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
