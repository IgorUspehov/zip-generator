#!/usr/bin/env node
/**
 * Create Polar CRM Demo as €99/month subscription + checkout link.
 *
 * Requires POLAR_ACCESS_TOKEN with scopes:
 *   products:read products:write checkout_links:read checkout_links:write
 *
 * Usage:
 *   POLAR_ACCESS_TOKEN=polar_oat_… node scripts/setup-polar-crm-demo-monthly.mjs
 *
 * Prints product id + checkout URL to set on Railway:
 *   POLAR_PRODUCT_CRM_DEMO / NEXT_PUBLIC_POLAR_PRODUCT_CRM_DEMO
 *   POLAR_CHECKOUT_CRM_DEMO / NEXT_PUBLIC_POLAR_CHECKOUT_CRM_DEMO
 */

import { Polar } from "@polar-sh/sdk";

const ORG_ID = "50ba1a64-2d7b-4ec6-b882-73d4bc110554";
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://saas-mvp-funnel-production.up.railway.app";

const token = process.env.POLAR_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("Missing POLAR_ACCESS_TOKEN");
  process.exit(1);
}

const polar = new Polar({ accessToken: token });

async function main() {
  console.log("Creating CRM Demo Monthly product…");
  const product = await polar.products.create({
    name: "CRM Demo",
    description: "CRM Demo access — €99 per month",
    organizationId: ORG_ID,
    recurringInterval: "month",
    recurringIntervalCount: 1,
    prices: [
      {
        amountType: "fixed",
        priceAmount: 9900,
        priceCurrency: "eur",
      },
    ],
  });

  console.log("Product:", {
    id: product.id,
    name: product.name,
    isRecurring: product.isRecurring,
    recurringInterval: product.recurringInterval,
  });

  const priceId = product.prices?.[0]?.id;
  if (!priceId) {
    throw new Error("Product created but no price id returned");
  }

  console.log("Creating checkout link…");
  const link = await polar.checkoutLinks.create({
    paymentProcessor: "stripe",
    products: [product.id],
    successUrl: `${SITE}/api/checkout-lookup?checkout_id={CHECKOUT_ID}`,
    allowDiscountCodes: true,
  });

  const checkoutUrl = link.url || `https://buy.polar.sh/${link.id}`;
  console.log("\n=== Set these on Railway ===");
  console.log(`POLAR_PRODUCT_CRM_DEMO=${product.id}`);
  console.log(`NEXT_PUBLIC_POLAR_PRODUCT_CRM_DEMO=${product.id}`);
  console.log(`POLAR_CHECKOUT_CRM_DEMO=${checkoutUrl}`);
  console.log(`NEXT_PUBLIC_POLAR_CHECKOUT_CRM_DEMO=${checkoutUrl}`);
  console.log("\nWebhook product match: name contains 'CRM Demo' → crm_demo fulfill.");
}

main().catch((err) => {
  console.error("FAILED:", err?.statusCode || "", err?.message || err);
  if (err?.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
