import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";

import {
  POLAR_CHECKOUT_DEPLOYABLE_ZIP,
  POLAR_PRODUCT_DEPLOYABLE_ZIP,
} from "@/lib/polar/constants";

export const runtime = "nodejs";

/**
 * Create a Polar checkout for Deployable ZIP (€999 one-time).
 * Requires POLAR_PRODUCT_DEPLOYABLE_ZIP (or NEXT_PUBLIC_…) on the server.
 */
export async function POST(request: Request) {
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

  if (!clientId) {
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }

  const productId =
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_DEPLOYABLE_ZIP?.trim() ||
    process.env.POLAR_PRODUCT_DEPLOYABLE_ZIP?.trim() ||
    POLAR_PRODUCT_DEPLOYABLE_ZIP;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://webstudio-muenchen.com";

  const successUrl = `${site}/success?clientId=${encodeURIComponent(clientId)}&tier=mvp_pro${
    email ? `&email=${encodeURIComponent(email)}` : ""
  }&lang=${locale}`;

  const token = process.env.POLAR_ACCESS_TOKEN?.trim();
  if (token && productId) {
    try {
      const polar = new Polar({ accessToken: token });
      const checkout = await polar.checkouts.create({
        products: [productId],
        successUrl,
        externalCustomerId: clientId,
        customerEmail: email || undefined,
        metadata: {
          reference_id: clientId,
          client_id: clientId,
          product_kind: "deployable_zip",
        },
      });

      const url = checkout.url;
      if (!url) {
        return NextResponse.json({ error: "No checkout URL returned" }, { status: 502 });
      }

      const out = new URL(url);
      out.searchParams.set("locale", locale);
      out.searchParams.set("reference_id", clientId);

      return NextResponse.json({
        checkout_url: out.toString(),
        product_id: productId,
        is_recurring: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Polar checkout failed";
      console.error("[polar/deployable-zip-checkout]", message);
      // Fall through to static checkout link if configured
    }
  }

  const staticCheckout =
    process.env.NEXT_PUBLIC_POLAR_CHECKOUT_DEPLOYABLE_ZIP?.trim() ||
    process.env.POLAR_CHECKOUT_DEPLOYABLE_ZIP?.trim() ||
    POLAR_CHECKOUT_DEPLOYABLE_ZIP;

  if (staticCheckout) {
    const out = new URL(staticCheckout);
    out.searchParams.set("reference_id", clientId);
    out.searchParams.set("metadata[client_id]", clientId);
    out.searchParams.set("metadata[reference_id]", clientId);
    out.searchParams.set("metadata[product_kind]", "deployable_zip");
    if (email) {
      out.searchParams.set("customer_email", email);
      out.searchParams.set("prefilled_email", email);
    }
    out.searchParams.set("locale", locale);
    return NextResponse.json({
      checkout_url: out.toString(),
      product_id: productId || null,
      is_recurring: false,
      static: true,
    });
  }

  return NextResponse.json(
    {
      error:
        "Deployable ZIP Polar product is not configured. Set POLAR_PRODUCT_DEPLOYABLE_ZIP (run scripts/setup-polar-deployable-zip-999.mjs).",
    },
    { status: 503 },
  );
}
