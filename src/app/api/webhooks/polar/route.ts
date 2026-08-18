import { Webhooks } from "@polar-sh/nextjs";

import { markTenantPaid, persistTenantPaid } from "@/lib/billing/paid-tenant";
import { fulfillCrmDemoOrder } from "@/lib/crm-demo/fulfillment";
import { fulfillCrmFullOrder } from "@/lib/crm-full/fulfillment";
import { fulfillMvpProOrder } from "@/lib/mvp-pro/fulfillment";
import {
  isPolarCheckoutSucceeded,
  resolveOrderClientId,
  resolveOrderEmail,
  resolveOrderId,
} from "@/lib/polar/order-context";
import { resolvePolarProductKind } from "@/lib/polar/product-match";
import { fulfillPaidSiteDelivery } from "@/lib/site-delivery/post-payment-email";
import { saveCheckoutReference } from "@/lib/polar/checkout-reference-store";

async function applyPolarPaid(input: {
  clientId: string;
  email?: string;
  orderId?: string;
  source: string;
}): Promise<void> {
  markTenantPaid(input.clientId);
  await persistTenantPaid({
    clientId: input.clientId,
    email: input.email,
    orderId: input.orderId,
    source: input.source,
  });
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCheckoutUpdated: async (payload) => {
    const checkout = payload.data as Record<string, unknown>;
    const checkoutId = typeof checkout.id === "string" ? checkout.id : null;
    const clientId = resolveOrderClientId(checkout);
    const email = resolveOrderEmail(checkout);

    if (checkoutId && clientId) {
      saveCheckoutReference(checkoutId, clientId);
      console.log("[polar] checkout.updated reference saved", {
        checkoutId,
        clientId,
        status: checkout.status ?? null,
      });
    }

    // 100% Polar discounts succeed the checkout immediately. Do not wait for a
    // later order.paid if clientId is already known — otherwise TTL deletes the site.
    if (clientId && isPolarCheckoutSucceeded(checkout)) {
      console.log("[polar] checkout succeeded — marking tenant paid", { checkoutId, clientId });
      await applyPolarPaid({
        clientId,
        email,
        orderId: checkoutId || undefined,
        source: "polar_checkout",
      });
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

    if (!clientId) {
      console.error("[polar] order.paid missing clientId/reference_id", {
        orderId,
        checkoutId,
        productId,
        productName,
        productKind: kind,
        metadata: order.metadata ?? null,
      });
      return;
    }

    await applyPolarPaid({
      clientId,
      email,
      orderId,
      source: "polar_order",
    });

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
