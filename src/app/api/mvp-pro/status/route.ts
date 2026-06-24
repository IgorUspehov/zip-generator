import { NextResponse } from "next/server";

import { verifyMvpProStatusAccess } from "@/lib/mvp-pro/entitlement-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";

  if (!clientId || !email) {
    return NextResponse.json({ error: "clientId and email are required" }, { status: 400 });
  }

  const access = verifyMvpProStatusAccess({ clientId, email });
  if (!access.ok) {
    return NextResponse.json({ ready: false }, { status: 404 });
  }

  return NextResponse.json({
    ready: true,
    status: access.entitlement.status,
    downloadToken: access.entitlement.downloadToken,
    paidAt: access.entitlement.paidAt,
    language: access.entitlement.language,
  });
}
