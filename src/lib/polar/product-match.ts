import {
  POLAR_PRODUCT_CRM_DEMO,
  POLAR_PRODUCT_CRM_FULL,
  POLAR_PRODUCT_DEPLOYABLE_ZIP,
  POLAR_PRODUCT_RECURRING,
} from "@/lib/polar/constants";

export type PolarProductKind =
  | "crm_demo"
  | "crm_full"
  | "recurring"
  | "deployable_zip"
  | "unknown";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function matchesDeployableZipName(nameLower: string): boolean {
  if (!nameLower) return false;
  if (nameLower.includes("deployable") && nameLower.includes("zip")) return true;
  if (nameLower.includes("mvp pro")) return true;
  if (nameLower.includes("website export")) return true;
  if (nameLower.includes("site export") && nameLower.includes("999")) return true;
  if (nameLower.includes("999") && nameLower.includes("zip")) return true;
  return false;
}

export function resolvePolarProductKind(order: Record<string, unknown>): {
  kind: PolarProductKind;
  productId: string;
  productName: string;
} {
  const product = order.product as { id?: string; name?: string } | undefined;
  const productId = pickString(order.productId ?? order.product_id ?? product?.id);
  const productName = pickString(product?.name);
  const nameLower = productName.toLowerCase();

  if (POLAR_PRODUCT_DEPLOYABLE_ZIP && productId === POLAR_PRODUCT_DEPLOYABLE_ZIP) {
    // Same id as CRM Full by default → treat as ZIP unlock
    return { kind: "crm_full", productId, productName };
  }
  if (productId === POLAR_PRODUCT_CRM_DEMO) {
    return { kind: "crm_demo", productId, productName };
  }
  if (productId === POLAR_PRODUCT_CRM_FULL) {
    return { kind: "crm_full", productId, productName };
  }
  if (productId === POLAR_PRODUCT_RECURRING) {
    return { kind: "recurring", productId, productName };
  }

  if (matchesDeployableZipName(nameLower)) {
    return { kind: "deployable_zip", productId, productName };
  }
  if (
    nameLower.includes("crm demo") ||
    nameLower === "crm demo monthly" ||
    (nameLower.includes("crm") && nameLower.includes("demo") && nameLower.includes("month")) ||
    (nameLower.includes("web studio") && nameLower.includes("199")) ||
    (nameLower.includes("website") && nameLower.includes("199"))
  ) {
    return { kind: "crm_demo", productId, productName };
  }
  if (nameLower.includes("crm full")) {
    return { kind: "crm_full", productId, productName };
  }
  if (productName === "Recurring" || nameLower.includes("recurring")) {
    return { kind: "recurring", productId, productName };
  }

  return { kind: "unknown", productId, productName };
}
