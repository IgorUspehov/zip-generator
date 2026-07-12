import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

import { findPendingByClientId } from "@/lib/netlify/scheduler";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://saas-mvp-funnel-production.up.railway.app";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

function pickReferenceId(data: Record<string, unknown>): string | null {
  const metadata = data.metadata as Record<string, unknown> | undefined;
  const checkout = data.checkout as Record<string, unknown> | undefined;
  const checkoutMetadata = checkout?.metadata as Record<string, unknown> | undefined;

  const candidates = [
    metadata?.reference_id,
    metadata?.referenceId,
    data.referenceId,
    data.reference_id,
    checkout?.referenceId,
    checkout?.reference_id,
    checkoutMetadata?.reference_id,
    checkoutMetadata?.referenceId,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const checkoutId = request.nextUrl.searchParams.get("checkout_id");

  if (!checkoutId) {
    return NextResponse.redirect(new URL("/client", SITE_URL));
  }

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    const clientId = pickReferenceId(checkout as unknown as Record<string, unknown>);

    if (!clientId) {
      console.warn("[checkout-lookup] no clientId on checkout", { checkoutId });
      return NextResponse.redirect(new URL("/client?payment=pending", SITE_URL));
    }

    const pending = findPendingByClientId(clientId);

    if (pending?.siteUrl) {
      const finalUrl = new URL(pending.siteUrl);
      finalUrl.searchParams.set("clientId", clientId);
      return NextResponse.redirect(finalUrl.toString());
    }

    return NextResponse.redirect(
      new URL(`/client?payment=processing&clientId=${encodeURIComponent(clientId)}`, SITE_URL),
    );
  } catch (error) {
    console.error("[checkout-lookup] error", error);
    return NextResponse.redirect(new URL("/client?payment=error", SITE_URL));
  }
}
