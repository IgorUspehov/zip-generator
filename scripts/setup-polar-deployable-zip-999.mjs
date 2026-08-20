#!/usr/bin/env node
/**
 * Create Polar one-time €999 Deployable ZIP product + checkout link.
 *
 * Requires POLAR_ACCESS_TOKEN with scopes:
 *   products:read products:write checkout_links:read checkout_links:write
 *
 * Usage:
 *   POLAR_ACCESS_TOKEN=polar_oat_… node scripts/setup-polar-deployable-zip-999.mjs
 *
 * Prints env vars to set on Render:
 *   POLAR_PRODUCT_DEPLOYABLE_ZIP / NEXT_PUBLIC_POLAR_PRODUCT_DEPLOYABLE_ZIP
 *   POLAR_CHECKOUT_DEPLOYABLE_ZIP / NEXT_PUBLIC_POLAR_CHECKOUT_DEPLOYABLE_ZIP
 */

import { Polar } from "@polar-sh/sdk";

const ORG_ID = "50ba1a64-2d7b-4ec6-b882-73d4bc110554";
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webstudio-muenchen.com";

const token = process.env.POLAR_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("Missing POLAR_ACCESS_TOKEN");
  process.exit(1);
}

const polar = new Polar({ accessToken: token });

async function main() {
  console.log("Creating Deployable ZIP (€999 one-time) product…");
  const product = await polar.products.create({
    name: "Deployable ZIP",
    description:
      "One-time export of your personalized Website + CRM static package (€999). Download ZIP after payment.",
    organizationId: ORG_ID,
    // One-time: omit recurringInterval
    prices: [
      {
        amountType: "fixed",
        priceAmount: 99900,
        priceCurrency: "eur",
      },
    ],
  });

  console.log("Product:", {
    id: product.id,
    name: product.name,
    isRecurring: product.isRecurring,
  });

  const priceId = product.prices?.[0]?.id;
  if (!priceId) {
    throw new Error("Product created but no price id returned");
  }

  console.log("Creating checkout link…");
  const link = await polar.checkoutLinks.create({
    paymentProcessor: "stripe",
    products: [product.id],
    successUrl: `${SITE}/success?tier=mvp_pro&checkout_id={CHECKOUT_ID}`,
    allowDiscountCodes: true,
  });

  const checkoutUrl = link.url || `https://buy.polar.sh/${link.id}`;
  console.log("\n=== Set these on Render ===");
  console.log(`POLAR_PRODUCT_DEPLOYABLE_ZIP=${product.id}`);
  console.log(`NEXT_PUBLIC_POLAR_PRODUCT_DEPLOYABLE_ZIP=${product.id}`);
  console.log(`POLAR_CHECKOUT_DEPLOYABLE_ZIP=${checkoutUrl}`);
  console.log(`NEXT_PUBLIC_POLAR_CHECKOUT_DEPLOYABLE_ZIP=${checkoutUrl}`);
  console.log("\nWebhook: product name 'Deployable ZIP' or product id → fulfillMvpProOrder (ZIP email).");
}

main().catch((err) => {
  console.error("FAILED:", err?.statusCode || "", err?.message || err);
  if (err?.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
