import { NextRequest, NextResponse } from "next/server";

import { findPendingByClientId } from "@/lib/netlify/scheduler";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId")?.trim();

  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  }

  const pending = findPendingByClientId(clientId);

  if (pending?.siteUrl) {
    return NextResponse.json({ ready: true, siteUrl: pending.siteUrl });
  }

  return NextResponse.json({ ready: false });
}
