import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { findPendingByClientId } from "@/lib/cloudflare/scheduler";
import { buildReadableDemoUrl } from "@/lib/cloudflare/shared-project";
import { POLAR_CHECKOUT_CRM_DEMO } from "@/lib/polar/constants";
import { buildTariffsPageUrl } from "@/lib/tariffs/urls";

export type DemoAccessStatus = {
  clientId: string;
  paid: boolean;
  found: boolean;
  /** Localized tariff chooser (not Polar directly). */
  checkoutUrl: string;
  /** Direct Polar CRM Demo checkout (€99). */
  polarCheckoutUrl: string;
  /** Canonical Railway CRM entry for this tenant (never a foreign pages.dev bake). */
  crmUrl: string | null;
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
 * Banner CTA opens the tariff chooser; €99 still uses Polar.
 */
export function resolveDemoAccess(clientId: string): DemoAccessStatus {
  const id = String(clientId ?? "").trim();
  const polarCheckoutUrl = buildCrmDemoCheckoutUrl(id);
  const checkoutUrl = buildTariffsPageUrl({ clientId: id });

  if (!id) {
    return {
      clientId: "",
      paid: false,
      found: false,
      checkoutUrl,
      polarCheckoutUrl,
      crmUrl: null,
    };
  }

  const demo = findDemoByClientId(id);
  const pending = findPendingByClientId(id);
  const found = Boolean(demo || pending);
  const paid = demo?.paid === true || pending?.paid === true;
  const crmUrl = demo?.slug ? buildReadableDemoUrl(demo.slug, id) : null;

  return { clientId: id, paid, found, checkoutUrl, polarCheckoutUrl, crmUrl };
}
