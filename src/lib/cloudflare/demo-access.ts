import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { findPendingByClientId } from "@/lib/cloudflare/scheduler";
import { POLAR_CHECKOUT_CRM_DEMO } from "@/lib/polar/constants";

export type DemoAccessStatus = {
  clientId: string;
  paid: boolean;
  found: boolean;
  checkoutUrl: string;
};

export function buildCrmDemoCheckoutUrl(clientId: string): string {
  const url = new URL(POLAR_CHECKOUT_CRM_DEMO);
  if (clientId) {
    url.searchParams.set("reference_id", clientId);
  }
  return url.toString();
}

/**
 * Payment gate for CRM demos.
 * `paid` is true only when registry or pending-deletion record is marked paid
 * (Polar/LemonSqueezy webhook via cancelDeletion / markDemoPaid).
 * Unknown clientId → unpaid (fail closed).
 */
export function resolveDemoAccess(clientId: string): DemoAccessStatus {
  const id = String(clientId ?? "").trim();
  const checkoutUrl = buildCrmDemoCheckoutUrl(id);

  if (!id) {
    return { clientId: "", paid: false, found: false, checkoutUrl };
  }

  const demo = findDemoByClientId(id);
  const pending = findPendingByClientId(id);
  const found = Boolean(demo || pending);
  const paid = demo?.paid === true || pending?.paid === true;

  return { clientId: id, paid, found, checkoutUrl };
}
