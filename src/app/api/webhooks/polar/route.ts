import { Webhooks } from "@polar-sh/nextjs";

import { fulfillCrmFullOrder } from "@/lib/crm-full/fulfillment";
import { fulfillMvpProOrder } from "@/lib/mvp-pro/fulfillment";
import { cancelDeletion, findPendingByClientId } from "@/lib/netlify/scheduler";

function pickReferenceId(data: Record<string, unknown>): string | null {
  const metadata = data.metadata as Record<string, unknown> | undefined;
  const checkout = data.checkout as Record<string, unknown> | undefined;
  const checkoutMetadata = checkout?.metadata as Record<string, unknown> | undefined;

  const candidates = [
    metadata?.reference_id,
    metadata?.referenceId,
    data.referenceId,
    data.reference_id,
    checkout?.referenceId,
    checkout?.reference_id,
    checkoutMetadata?.reference_id,
    checkoutMetadata?.referenceId,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function extractSiteId(clientId: string | null): string | null {
  if (!clientId) return null;
  return findPendingByClientId(clientId)?.siteId ?? null;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    const order = payload.data as Record<string, unknown>;
    const product = order.product as { name?: string } | undefined;
    const productName = String(product?.name ?? "").trim();
    const clientId = pickReferenceId(order);
    const customer = order.customer as { email?: string } | undefined;
    const email = customer?.email;
    const orderId = order.id as string | undefined;

    const siteId = extractSiteId(clientId);
    if (siteId) {
      cancelDeletion(siteId);
    }

    if (!clientId) {
      console.warn("[polar-webhook] order.paid without clientId/reference_id", { orderId, productName });
      return;
    }

    if (productName === "Recurring") {
      await fulfillMvpProOrder({ clientId, email: email ?? "", orderId, variantId: "polar_recurring" });
    } else if (productName === "CRM Full") {
      await fulfillCrmFullOrder({ clientId, email, orderId, variantId: "polar_crm_full" });
    } else if (productName === "CRM Demo") {
      console.log("[polar-webhook] CRM Demo paid", { clientId, email, orderId });
    } else {
      console.warn("[polar-webhook] unknown product on order.paid", { productName, clientId, orderId });
    }
  },
});
