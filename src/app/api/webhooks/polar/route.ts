import { Webhooks } from "@polar-sh/nextjs";

import { fulfillCrmDemoOrder } from "@/lib/crm-demo/fulfillment";
import { fulfillCrmFullOrder } from "@/lib/crm-full/fulfillment";
import { fulfillMvpProOrder } from "@/lib/mvp-pro/fulfillment";
import {
  resolveOrderClientId,
  resolveOrderEmail,
  resolveOrderId,
} from "@/lib/polar/order-context";
import { resolvePolarProductKind } from "@/lib/polar/product-match";
import { cancelDeletion, findPendingByClientId } from "@/lib/cloudflare/scheduler";
import { markClientDistPaid } from "@/lib/site-delivery/dist-protection";
import { fulfillPaidSiteDelivery } from "@/lib/site-delivery/post-payment-email";
import { saveCheckoutReference } from "@/lib/polar/checkout-reference-store";

function extractSiteId(clientId: string | null): string | null {
  if (!clientId) return null;
  return findPendingByClientId(clientId)?.siteId ?? null;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCheckoutUpdated: async (payload) => {
    const checkout = payload.data as Record<string, unknown>;
    const checkoutId = typeof checkout.id === "string" ? checkout.id : null;
    const clientId = resolveOrderClientId(checkout);

    if (checkoutId && clientId) {
      saveCheckoutReference(checkoutId, clientId);
      console.log("[polar] checkout.updated reference saved", { checkoutId, clientId });
    }
  },
  onOrderPaid: async (payload) => {
    const order = payload.data as Record<string, unknown>;
    const { kind, productId, productName } = resolvePolarProductKind(order);
    const clientId = resolveOrderClientId(order);
    const email = resolveOrderEmail(order);
    const orderId = resolveOrderId(order);
    const checkoutId =
      typeof order.checkoutId === "string"
        ? order.checkoutId
        : typeof order.checkout_id === "string"
          ? order.checkout_id
          : null;

    console.log("[polar] order.paid received", {
      orderId,
      checkoutId,
      clientId,
      email: email || null,
      productId: productId || null,
      productName: productName || null,
      productKind: kind,
    });

    if (checkoutId && clientId) {
      saveCheckoutReference(checkoutId, clientId);
    }

    const siteId = extractSiteId(clientId);
    if (siteId) {
      cancelDeletion(siteId);
    }

    if (!clientId) {
      console.error("[polar] order.paid missing clientId/reference_id", {
        orderId,
        checkoutId,
        productId,
        productName,
        productKind: kind,
      });
      return;
    }

    try {
      if (kind === "recurring") {
        await fulfillMvpProOrder({
          clientId,
          email: email || "",
          orderId,
          variantId: "polar_recurring",
        });
        return;
      }

      if (kind === "crm_full") {
        await fulfillCrmFullOrder({ clientId, email, orderId, variantId: "polar_crm_full" });
        await fulfillPaidSiteDelivery({ clientId, email, orderId, productName });
        return;
      }

      if (kind === "crm_demo") {
        console.log("[polar] routing to fulfillCrmDemoOrder", { clientId, email, orderId });
        markClientDistPaid(clientId);
        const delivery = await fulfillCrmDemoOrder({ clientId, email, orderId });
        console.log("[polar] fulfillCrmDemoOrder result", { clientId, orderId, ...delivery });
        return;
      }

      console.error("[polar] unknown product on order.paid", {
        productName,
        productId,
        clientId,
        orderId,
      });
      await fulfillPaidSiteDelivery({ clientId, email, orderId, productName });
    } catch (error) {
      console.error("[polar] order.paid handler failed", {
        clientId,
        orderId,
        productName,
        productId,
        productKind: kind,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  },
});
