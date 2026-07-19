import { NextResponse } from "next/server";

import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { findPendingByClientId } from "@/lib/cloudflare/scheduler";
import { resolveLeadFormMode, normalizeLeadLang } from "@/lib/leads/niche-mode";
import { notifyNewLead } from "@/lib/leads/notify-site-lead";
import { assertLeadRateLimit } from "@/lib/leads/rate-limit";
import {
  createSiteLead,
  listSiteLeads,
  loadNicheServiceOptions,
} from "@/lib/leads/store";
import { validateLeadPayload } from "@/lib/leads/validate";
import { loadClientManifest } from "@/lib/manifest/storage";
import { DEFAULT_BUSINESS_TYPE } from "@/lib/sector-mapping";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function clientIdExists(clientId: string): boolean {
  if (loadClientManifest(clientId)) return true;
  if (findDemoByClientId(clientId)) return true;
  if (findPendingByClientId(clientId)) return true;
  return false;
}

function resolveBusinessMeta(clientId: string): {
  businessType: string;
  businessName: string;
  language: string;
} {
  const manifest = loadClientManifest(clientId) || {};
  const businessType = String(
    manifest.businessType ?? manifest.business_type ?? DEFAULT_BUSINESS_TYPE,
  );
  const businessName = String(
    manifest.businessName ?? manifest.business_name ?? "Business",
  );
  const language = String(manifest.language ?? manifest.lang ?? "de");
  return { businessType, businessName, language };
}

function readClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ clientId: string }> },
) {
  const { clientId: raw } = await context.params;
  const clientId = decodeURIComponent(raw || "").trim();
  if (!clientId || !clientIdExists(clientId)) {
    return NextResponse.json(
      { error: "clientId not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  const url = new URL(request.url);
  const lang = normalizeLeadLang(url.searchParams.get("lang") || undefined);
  const meta = resolveBusinessMeta(clientId);
  const mode = resolveLeadFormMode(meta.businessType);

  try {
    const leads = await listSiteLeads(clientId);
    const services = loadNicheServiceOptions(meta.businessType, lang);
    return NextResponse.json(
      {
        clientId,
        mode,
        businessType: meta.businessType,
        businessName: meta.businessName,
        services,
        ...leads,
      },
      { headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list leads";
    console.error("[leads] GET failed", { clientId, message });
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ clientId: string }> },
) {
  const { clientId: raw } = await context.params;
  const clientId = decodeURIComponent(raw || "").trim();

  if (!clientId) {
    return NextResponse.json(
      { error: "clientId required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  if (!clientIdExists(clientId)) {
    return NextResponse.json(
      { error: "clientId not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const validated = validateLeadPayload(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: validated.status, headers: CORS_HEADERS },
    );
  }

  const ip = readClientIp(request);
  try {
    const limited = await assertLeadRateLimit({ clientId, ip });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "rate_limit_exceeded", retryAfterSec: limited.retryAfterSec },
        {
          status: 429,
          headers: {
            ...CORS_HEADERS,
            "Retry-After": String(limited.retryAfterSec),
          },
        },
      );
    }
  } catch (error) {
    console.error("[leads] rate limit error", error);
    return NextResponse.json(
      { error: "rate limit unavailable" },
      { status: 503, headers: CORS_HEADERS },
    );
  }

  const meta = resolveBusinessMeta(clientId);
  const mode = resolveLeadFormMode(meta.businessType);
  const payload = {
    ...validated.data,
    language: validated.data.language || meta.language,
  };

  try {
    const result = await createSiteLead({
      clientId,
      businessType: meta.businessType,
      payload,
      mode,
    });

    await notifyNewLead({
      clientId,
      businessName: meta.businessName,
      businessType: meta.businessType,
      name: payload.name,
      phone: payload.phone,
      service: payload.service,
      mode,
      bookingId: result.booking?.id,
      orderId: result.order?.id,
    });

    return NextResponse.json(
      {
        ok: true,
        clientId,
        mode,
        createdClient: result.createdClient,
        client: result.client,
        booking: result.booking || null,
        order: result.order || null,
      },
      { status: 201, headers: CORS_HEADERS },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create lead";
    console.error("[leads] POST failed", { clientId, message });
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
