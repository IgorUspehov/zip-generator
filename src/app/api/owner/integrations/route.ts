import { NextResponse } from "next/server";

import { AdminUnauthorizedError, requireAdminSession, unauthorizedResponse } from "@/lib/admin/authorize";
import { loadClientManifest } from "@/lib/manifest/storage";
import { canDownloadDeployableZip } from "@/lib/mvp-pro/zip-access";
import { resolveOwnerIntegrations } from "@/lib/owner/integrations";
import { clientDistExists } from "@/lib/site-delivery/dist-store";

export const runtime = "nodejs";

function pickEmail(manifest: Record<string, unknown> | null): string {
  const raw = manifest?.email ?? manifest?.contactEmail ?? manifest?.ownerEmail;
  return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Integrations status for the authenticated admin session's clientId.
 * Exposes whether Deployable ZIP (€999) is unlocked.
 */
export async function GET(request: Request) {
  try {
    const session = requireAdminSession(request);
    const clientId = session.clientId;
    const zipAccess = canDownloadDeployableZip(clientId);
    const manifest = loadClientManifest(clientId);
    const integrations = resolveOwnerIntegrations().map((item) => {
      if (item.id !== "zip") return item;
      return {
        ...item,
        status: "ready" as const,
        actionable: true,
        note:
          zipAccess.reason === "bypass"
            ? "Owner bypass (DEPLOYABLE_ZIP_OWNER_BYPASS=1)"
            : zipAccess.allowed
              ? "Unlocked after €999 Deployable ZIP payment"
              : "Deployable ZIP download (Polar checkout disabled)",
      };
    });

    return NextResponse.json({
      ok: true,
      clientId,
      distReady: clientDistExists(clientId),
      // Polar €999 checkout removed — UI always offers free download; API still honors bypass/entitlement.
      zipUnlocked: true,
      zipUnlockReason: zipAccess.allowed ? zipAccess.reason : "bypass",
      email: pickEmail(manifest),
      checkoutConfigured: false,
      integrations,
    });
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) return unauthorizedResponse();
    const message = error instanceof Error ? error.message : "Failed to load integrations";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
