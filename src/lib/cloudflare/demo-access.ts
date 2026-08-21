import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { findPendingByClientId } from "@/lib/cloudflare/scheduler";
import {
  buildReadableDemoUrl,
  buildReadablePublicSiteUrl,
} from "@/lib/cloudflare/shared-project";
import { buildTariffsPagePath } from "@/lib/tariffs/urls";

export type DemoAccessStatus = {
  clientId: string;
  paid: boolean;
  found: boolean;
  /** Localized tariff chooser path. */
  checkoutUrl: string;
  /** Canonical CRM entry for this tenant (never a foreign pages.dev bake). */
  crmUrl: string | null;
  /** Public visitor site for Maps/Instagram — /site/{slug}, no query params. */
  publicSiteUrl: string | null;
  slug: string | null;
};

/**
 * Access status for CRM demos.
 * `paid` is true when registry or pending-deletion record is marked paid.
 * Unknown clientId → unpaid (fail closed).
 */
export function resolveDemoAccess(clientId: string): DemoAccessStatus {
  const id = String(clientId ?? "").trim();
  const checkoutUrl = buildTariffsPagePath({ clientId: id });

  if (!id) {
    return {
      clientId: "",
      paid: false,
      found: false,
      checkoutUrl,
      crmUrl: null,
      publicSiteUrl: null,
      slug: null,
    };
  }

  const demo = findDemoByClientId(id);
  const pending = findPendingByClientId(id);
  const found = Boolean(demo || pending);
  const paid = demo?.paid === true || pending?.paid === true;
  const slug = demo?.slug || pending?.slug || null;
  const crmUrl = slug ? buildReadableDemoUrl(slug, id) : null;
  const publicSiteUrl = slug ? buildReadablePublicSiteUrl(slug) : null;

  return {
    clientId: id,
    paid,
    found,
    checkoutUrl,
    crmUrl,
    publicSiteUrl,
    slug,
  };
}
