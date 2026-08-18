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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readUuidFromMetadata(order: Record<string, unknown>): string | null {
  const bags = [order.metadata, (order.checkout as Record<string, unknown> | undefined)?.metadata];
  for (const bag of bags) {
    if (!bag || typeof bag !== "object") continue;
    for (const value of Object.values(bag as Record<string, unknown>)) {
      const text = pickString(value);
      if (UUID_RE.test(text)) return text;
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

  const fromMetadataUuid = readUuidFromMetadata(order);
  if (fromMetadataUuid) {
    return fromMetadataUuid;
  }

  const checkoutId = pickString(order.checkoutId ?? order.checkout_id);
  if (checkoutId) {
    return getCheckoutReference(checkoutId);
  }

  return null;
}

export function isPolarCheckoutSucceeded(checkout: Record<string, unknown>): boolean {
  const status = pickString(checkout.status).toLowerCase();
  return status === "succeeded" || status === "confirmed" || status === "complete" || status === "completed";
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
