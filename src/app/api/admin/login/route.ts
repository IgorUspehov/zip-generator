import { NextResponse } from "next/server";

import { findClientIdsByOwnerEmail, hydrateClientManifest } from "@/lib/admin/lookup";
import { createMagicLink, ADMIN_MAGIC_LINK_FROM } from "@/lib/admin/magic-link";
import { sendResendEmail } from "@/lib/email/resend";
import { getPublicSiteOrigin } from "@/lib/cloudflare/shared-project";

export const runtime = "nodejs";

function originFromRequest(request: Request): string {
  try {
    return new URL(request.url).origin;
  } catch {
    return getPublicSiteOrigin();
  }
}

export async function POST(request: Request) {
  let email = "";
  let clientIdHint = "";
  try {
    const body = (await request.json()) as { email?: unknown; clientId?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    clientIdHint = typeof body.clientId === "string" ? body.clientId.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }

  const clientIds = await findClientIdsByOwnerEmail(email, clientIdHint);
  console.log("[admin/login] lookup", {
    email,
    clientIdHint: clientIdHint || null,
    matchCount: clientIds.length,
  });
  const origin = originFromRequest(request);
  const links: { clientId: string; url: string; businessName: string }[] = [];

  for (const clientId of clientIds) {
    const { token } = createMagicLink({ clientId, email });
    const manifest = (await hydrateClientManifest(clientId)) || {};
    links.push({
      clientId,
      url: `${origin}/api/admin/callback?token=${encodeURIComponent(token)}`,
      businessName: String(manifest.businessName || manifest.business_name || "Website"),
    });
  }

  if (links.length) {
    const lines = links
      .map((item) => `${item.businessName}\n${item.url}`)
      .join("\n\n");
    const sendResult = await sendResendEmail({
      to: email,
      from: ADMIN_MAGIC_LINK_FROM,
      subject: "Your site admin login",
      text: `Open this link to edit your website. It expires in 30 minutes and can be used once.\n\n${lines}\n`,
      logPrefix: "[admin/login] resend",
    });
    if (!sendResult.ok) {
      console.error("[admin/login] resend failed", sendResult.error);
      return NextResponse.json(
        { ok: false, error: "E-Mail konnte nicht gesendet werden. Bitte später erneut versuchen." },
        { status: 502 },
      );
    }
  }

  const payload: Record<string, unknown> = { ok: true };
  if (process.env.NODE_ENV !== "production") {
    payload.devLinks = links;
  }
  return NextResponse.json(payload);
}
