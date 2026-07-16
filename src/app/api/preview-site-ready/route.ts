import { NextRequest, NextResponse } from "next/server";

import { findPendingByClientId } from "@/lib/cloudflare/scheduler";

const ALLOWED_PREVIEW_HOST = /\.(pages\.dev|netlify\.app)$/i;
const PROBE_TIMEOUT_MS = 5_000;

function parsePreviewUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || !ALLOWED_PREVIEW_HOST.test(parsed.hostname)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function probePreviewSite(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    // Prefer GET — some Pages edge paths mishandle HEAD for brand-new deployments.
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html",
        Range: "bytes=0-0",
      },
    });
    return response.ok || response.status === 206;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url")?.trim();
  const clientId = request.nextUrl.searchParams.get("clientId")?.trim();

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const previewUrl = parsePreviewUrl(urlParam);
  if (!previewUrl) {
    return NextResponse.json({ error: "Invalid preview url" }, { status: 400 });
  }

  if (clientId) {
    const pending = findPendingByClientId(clientId);
    if (pending?.siteUrl) {
      const pendingOrigin = parsePreviewUrl(pending.siteUrl)?.origin;
      if (pendingOrigin && previewUrl.origin !== pendingOrigin) {
        return NextResponse.json({ error: "Url mismatch" }, { status: 403 });
      }
    }
  }

  const ready = await probePreviewSite(previewUrl.toString());
  return NextResponse.json({ ready });
}
