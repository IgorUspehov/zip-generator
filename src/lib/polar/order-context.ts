import {
  getCheckoutReference,
  pickReferenceId,
} from "@/lib/polar/checkout-reference-store";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readCustomFieldClientId(order: Record<string, unknown>): string | null {
  const customFieldData = order.customFieldData ?? order.custom_field_data;
  if (!customFieldData || typeof customFieldData !== "object") {
    return null;
  }

  const data = customFieldData as Record<string, unknown>;
  for (const key of ["client_id", "clientId", "reference_id", "referenceId"]) {
    const value = pickString(data[key]);
    if (value) {
      return value;
    }
  }

  return null;
}

export function resolveOrderClientId(order: Record<string, unknown>): string | null {
  const fromReference = pickReferenceId(order);
  if (fromReference) {
    return fromReference;
  }

  const fromCustomFields = readCustomFieldClientId(order);
  if (fromCustomFields) {
    return fromCustomFields;
  }

  const checkoutId = pickString(order.checkoutId ?? order.checkout_id);
  if (checkoutId) {
    return getCheckoutReference(checkoutId);
  }

  return null;
}

export function resolveOrderEmail(order: Record<string, unknown>): string {
  const customer = order.customer as { email?: string } | undefined;
  const fromCustomer = pickString(customer?.email);
  if (fromCustomer) {
    return fromCustomer;
  }

  return pickString(order.customerEmail ?? order.customer_email);
}

export function resolveOrderId(order: Record<string, unknown>): string | undefined {
  const orderId = pickString(order.id);
  return orderId || undefined;
}
