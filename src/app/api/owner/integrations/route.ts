import { NextResponse } from "next/server";

import { AdminUnauthorizedError, requireAdminSession, unauthorizedResponse } from "@/lib/admin/authorize";
import { clientDistExists } from "@/lib/site-delivery/dist-store";
import { resolveOwnerIntegrations } from "@/lib/owner/integrations";

export const runtime = "nodejs";

/**
 * OWNER Integrations status for the authenticated admin session's clientId.
 */
export async function GET(request: Request) {
  try {
    const session = requireAdminSession(request);
    const integrations = resolveOwnerIntegrations();
    return NextResponse.json({
      ok: true,
      clientId: session.clientId,
      distReady: clientDistExists(session.clientId),
      integrations,
    });
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) return unauthorizedResponse();
    const message = error instanceof Error ? error.message : "Failed to load integrations";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
