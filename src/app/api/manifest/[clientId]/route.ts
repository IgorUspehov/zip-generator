import { NextResponse } from "next/server";

import { normalizeManifestMedia } from "@/lib/manifest/normalize-manifest-media";
import { loadClientManifest } from "@/lib/manifest/storage";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ clientId: string }> },
) {
  const { clientId } = await context.params;
  const manifest = loadClientManifest(clientId);

  if (!manifest) {
    return NextResponse.json(
      { error: "Manifest not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  return NextResponse.json(normalizeManifestMedia(manifest), { headers: CORS_HEADERS });
}
