import { NextRequest, NextResponse } from "next/server";

import { findPendingByClientId } from "@/lib/netlify/scheduler";
import { getCheckoutReference } from "@/lib/polar/checkout-reference-store";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://saas-mvp-funnel-production.up.railway.app";

const CACHE_LOOKUP_RETRIES = 6;
const CACHE_LOOKUP_DELAY_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveClientIdFromCache(checkoutId: string): Promise<string | null> {
  for (let attempt = 0; attempt < CACHE_LOOKUP_RETRIES; attempt++) {
    const clientId = getCheckoutReference(checkoutId);
    if (clientId) {
      return clientId;
    }

    if (attempt < CACHE_LOOKUP_RETRIES - 1) {
      await sleep(CACHE_LOOKUP_DELAY_MS);
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const checkoutId = request.nextUrl.searchParams.get("checkout_id");

  if (!checkoutId) {
    return NextResponse.redirect(new URL("/client", SITE_URL));
  }

  const clientId = await resolveClientIdFromCache(checkoutId);

  if (!clientId) {
    console.warn("[checkout-lookup] no cached clientId for checkout", { checkoutId });
    return NextResponse.redirect(
      new URL(`/client?payment=processing&checkout_id=${encodeURIComponent(checkoutId)}`, SITE_URL),
    );
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
}
