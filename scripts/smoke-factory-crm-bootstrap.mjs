/**
 * Local smoke: map funnel → Factory bootstrap + prepareClientDist inject.
 * Does NOT call Cloudflare API.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { buildFactoryBootstrap, mapToFactoryManifest } from "../src/lib/factory-crm/mapToFactoryManifest.ts";
import { prepareClientDistWithOgImage, cleanupClientDist } from "../src/lib/og-image/prepare-client-dist.ts";
import { resolveMvpDistPath } from "../src/lib/cloudflare/deploy.ts";

const niches = ["restaurant", "hotel_booking", "beauty_salon", "dental_clinic"];

for (const businessType of niches) {
  const m = mapToFactoryManifest(
    {
      businessName: `Test ${businessType}`,
      businessType,
      language: "en",
      phone: "+49 170 1111111",
      email: "test@example.com",
      city: "Berlin",
    },
    `smoke-${businessType}`,
  );
  console.log("OK map", businessType, "→", m.business.sector, m.crm.vocabularyKey);
  if (!m.crm.vocabularyKey) throw new Error("missing vocabularyKey");
}

const dist = resolveMvpDistPath();
console.log("dist", dist);

const staging = await prepareClientDistWithOgImage(
  "smoke-client-001",
  dist,
  {
    businessName: "Smoke Restaurant",
    businessType: "restaurant",
    language: "en",
    phone: "+49 170 1111111",
    email: "smoke@example.com",
    city: "Berlin",
  },
  "https://smoke-test.pages.dev",
);

const html = fs.readFileSync(path.join(staging, "index.html"), "utf8");
if (!html.includes("__FACTORY_BOOTSTRAP__")) {
  throw new Error("bootstrap not injected");
}
if (!html.includes('"mode":"product"')) {
  throw new Error("product mode missing");
}
if (!html.includes("restaurant")) {
  throw new Error("sector missing in bootstrap");
}
console.log("OK prepareClientDist inject + staging", staging);
cleanupClientDist(staging);
console.log("SMOKE_PASS");
