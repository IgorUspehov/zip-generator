import { loadMvpProEntitlement } from "@/lib/mvp-pro/entitlement-store";

/**
 * Who may download Deployable ZIP without a fresh Polar €999 payment:
 * - env DEPLOYABLE_ZIP_OWNER_BYPASS=1 (operator / zip-generator free download)
 * - existing MVP Pro / Deployable ZIP entitlement for this clientId
 *
 * Polar checkout routes are removed on zip-generator; bypass should be set in production.
 */
export function canDownloadDeployableZip(clientId: string): {
  allowed: boolean;
  reason: "bypass" | "entitlement" | "payment_required";
} {
  if (process.env.DEPLOYABLE_ZIP_OWNER_BYPASS?.trim() === "1") {
    return { allowed: true, reason: "bypass" };
  }
  const entitlement = loadMvpProEntitlement(clientId);
  if (entitlement?.downloadToken) {
    return { allowed: true, reason: "entitlement" };
  }
  // Polar €999 checkout disabled — allow download so Admin Integrations is not a dead end.
  return { allowed: true, reason: "bypass" };
}
