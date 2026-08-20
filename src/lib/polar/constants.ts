/**
 * Polar product / checkout constants.
 *
 * CRM Demo (€99) must be a monthly subscription. Override via env after creating
 * the recurring product + checkout link in Polar (or via scripts/setup-polar-crm-demo-monthly.mjs):
 *   POLAR_PRODUCT_CRM_DEMO / NEXT_PUBLIC_POLAR_PRODUCT_CRM_DEMO
 *   POLAR_CHECKOUT_CRM_DEMO / NEXT_PUBLIC_POLAR_CHECKOUT_CRM_DEMO
 */

const env = (key: string) =>
  (typeof process !== "undefined" && process.env?.[key]?.trim()) || "";

/** One-time legacy product — replaced by monthly when env override is set. */
const LEGACY_PRODUCT_CRM_DEMO_ONETIME = "e8ca446a-5956-4add-bfc7-42c2401625e0";
const LEGACY_CHECKOUT_CRM_DEMO_ONETIME =
  "https://buy.polar.sh/polar_cl_uUpNQRXBAVubDpDO3zwLa5SAswkU0Jkr2835A04UF1F";

export const POLAR_PRODUCT_CRM_DEMO =
  env("NEXT_PUBLIC_POLAR_PRODUCT_CRM_DEMO") ||
  env("POLAR_PRODUCT_CRM_DEMO") ||
  LEGACY_PRODUCT_CRM_DEMO_ONETIME;

export const POLAR_PRODUCT_RECURRING = "118dc1ba-7c1d-4f2e-bf3a-278cfa5b8164";
/** CRM Full — €999 one-time (already in Polar catalogue). */
export const POLAR_PRODUCT_CRM_FULL = "3aefa6b9-720b-47da-9d66-07d4bc0cb757";

/**
 * Deployable ZIP checkout uses CRM Full (€999) by default.
 * Override with POLAR_PRODUCT_DEPLOYABLE_ZIP only if you create a separate product.
 */
export const POLAR_PRODUCT_DEPLOYABLE_ZIP =
  env("NEXT_PUBLIC_POLAR_PRODUCT_DEPLOYABLE_ZIP") ||
  env("POLAR_PRODUCT_DEPLOYABLE_ZIP") ||
  POLAR_PRODUCT_CRM_FULL;

export const POLAR_CHECKOUT_CRM_DEMO =
  env("NEXT_PUBLIC_POLAR_CHECKOUT_CRM_DEMO") ||
  env("POLAR_CHECKOUT_CRM_DEMO") ||
  LEGACY_CHECKOUT_CRM_DEMO_ONETIME;

/** Alias used in wizard and /pay */
export const POLAR_CHECKOUT_99 = POLAR_CHECKOUT_CRM_DEMO;

/** Web Studio €199/month recurring — primary public checkout. */
export const POLAR_CHECKOUT_WEBSTUDIO_199 =
  "https://buy.polar.sh/polar_cl_BJ6Vl6ueOpNfWgBJ2hdqsaSK9PPrbdEpEzoTW3FvzEX";

export const POLAR_CHECKOUT_RECURRING =
  "https://buy.polar.sh/polar_cl_LgroIdJNay4kFrrasqJMxAgL0jKrhngvgFzsU083GHe";

export const POLAR_CHECKOUT_CRM_FULL =
  "https://buy.polar.sh/polar_cl_qVHaJpa4Zon7ZJjZNAI6UNDt7vkLdV0enAUZc085fTu";

/** Same as CRM Full checkout — Admin “Buy ZIP €999” uses this. */
export const POLAR_CHECKOUT_DEPLOYABLE_ZIP =
  env("NEXT_PUBLIC_POLAR_CHECKOUT_DEPLOYABLE_ZIP") ||
  env("POLAR_CHECKOUT_DEPLOYABLE_ZIP") ||
  POLAR_CHECKOUT_CRM_FULL;

export const POLAR_WEBHOOK_PATH = "/api/webhooks/polar";

/** True when checkout still points at the legacy one-time CRM Demo product. */
export function isLegacyCrmDemoOneTimeCheckout(): boolean {
  return POLAR_CHECKOUT_CRM_DEMO === LEGACY_CHECKOUT_CRM_DEMO_ONETIME;
}
