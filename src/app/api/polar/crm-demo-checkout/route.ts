import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";

import { POLAR_PRODUCT_CRM_DEMO } from "@/lib/polar/constants";

export const runtime = "nodejs";

/**
 * Create a Polar checkout session for CRM Demo (€99/month product).
 * Prefers dynamic session so locale + reference_id are applied server-side.
 * Falls back to static checkout link is not needed — callers use buildCrmDemoPolarUrl.
 */
export async function POST(request: Request) {
  const token = process.env.POLAR_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ error: "POLAR_ACCESS_TOKEN not configured" }, { status: 500 });
  }

  let body: { clientId?: string; email?: string; locale?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const clientId = String(body.clientId ?? "").trim();
  const email = String(body.email ?? "").trim();
  const localeRaw = String(body.locale ?? "en").toLowerCase();
  const locale = localeRaw.startsWith("ru")
    ? "ru"
    : localeRaw.startsWith("de")
      ? "de"
      : "en";

  const productId =
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_CRM_DEMO?.trim() ||
    process.env.POLAR_PRODUCT_CRM_DEMO?.trim() ||
    POLAR_PRODUCT_CRM_DEMO;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://webstudio-muenchen.com";

  try {
    const polar = new Polar({ accessToken: token });
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${site}/api/checkout-lookup?checkout_id={CHECKOUT_ID}`,
      externalCustomerId: clientId || undefined,
      customerEmail: email || undefined,
      metadata: clientId ? { reference_id: clientId, client_id: clientId } : undefined,
    });

    const url = checkout.url;
    if (!url) {
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 502 });
    }

    // Append locale hint for Polar hosted UI when supported
    const out = new URL(url);
    out.searchParams.set("locale", locale);
    if (clientId) out.searchParams.set("reference_id", clientId);

    return NextResponse.json({
      checkout_url: out.toString(),
      product_id: productId,
      is_recurring: checkout.product?.isRecurring ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Polar checkout failed";
    console.error("[polar/crm-demo-checkout]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
