import { loadMvpProEntitlement } from "@/lib/mvp-pro/entitlement-store";

/**
 * Who may download Deployable ZIP without a fresh Polar €999 payment:
 * - env DEPLOYABLE_ZIP_OWNER_BYPASS=1 (operator testing)
 * - existing MVP Pro / Deployable ZIP entitlement for this clientId
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
  return { allowed: false, reason: "payment_required" };
}
