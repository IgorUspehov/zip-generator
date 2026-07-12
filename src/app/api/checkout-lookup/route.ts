import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

import { findPendingByClientId } from "@/lib/netlify/scheduler";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export async function GET(request: NextRequest) {
  const checkoutId = request.nextUrl.searchParams.get("checkout_id");

  if (!checkoutId) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    const clientId =
      (checkout.metadata?.reference_id as string | undefined) ??
      (checkout as { referenceId?: string }).referenceId ??
      null;

    if (!clientId) {
      console.warn("[checkout-lookup] no clientId on checkout", { checkoutId });
      return NextResponse.redirect(new URL("/client?payment=pending", request.url));
    }

    const pending = findPendingByClientId(clientId);

    if (pending?.siteUrl) {
      const finalUrl = new URL(pending.siteUrl);
      finalUrl.searchParams.set("clientId", clientId);
      return NextResponse.redirect(finalUrl.toString());
    }

    return NextResponse.redirect(
      new URL(`/client?payment=processing&clientId=${encodeURIComponent(clientId)}`, request.url),
    );
  } catch (error) {
    console.error("[checkout-lookup] error", error);
    return NextResponse.redirect(new URL("/client?payment=error", request.url));
  }
}
