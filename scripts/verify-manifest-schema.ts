#!/usr/bin/env node
/**
 * Validate local data/manifests/*.json against the client manifest Zod schema.
 *
 *   npx tsx scripts/verify-manifest-schema.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateClientManifest } from "../src/lib/manifest/schema";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data", "manifests");

const files = fs
  .readdirSync(dir)
  .filter((name) => name.endsWith(".json"))
  .sort();

const report = [];

for (const file of files) {
  const full = path.join(dir, file);
  const raw = JSON.parse(fs.readFileSync(full, "utf8"));
  const result = validateClientManifest(raw);
  report.push({
    file,
    businessType: raw.businessType ?? null,
    niche: raw.niche ?? null,
    language: raw.language ?? null,
    ok: result.ok,
    issues: result.ok ? [] : result.issues,
  });
}

const passed = report.filter((r) => r.ok);
const failed = report.filter((r) => !r.ok);

console.log(
  JSON.stringify(
    {
      total: report.length,
      passed: passed.length,
      failed: failed.length,
      failures: failed.map((f) => ({
        file: f.file,
        businessType: f.businessType,
        niche: f.niche,
        issues: f.issues,
      })),
      samplePass: passed.slice(0, 5).map((p) => ({
        file: p.file,
        businessType: p.businessType,
        niche: p.niche,
        language: p.language,
      })),
    },
    null,
    2,
  ),
);

// Also prove a deterministic build-shaped object passes.
const synthetic = {
  businessName: "Test Beauty",
  ownerName: "Anna",
  niche: "beauty",
  businessType: "beauty_salon",
  sectorId: "beauty",
  sector_id: "beauty",
  language: "de",
  city: "Berlin",
  phone: "+491701234567",
  email: "anna@example.com",
  address: "Hauptstr. 1",
  whatsapp: "",
  postalCode: "10115",
  primaryColor: "#c2410c",
  theme: {
    primary: "#1e293b",
    secondary: "#64748b",
    accent: "#c2410c",
    hero_bg: "linear-gradient(#000,#333)",
    text: "#0f172a",
    border: "#e2e8f0",
  },
  promotion: { ru: "Акция", de: "Aktion", en: "Promo" },
  pages: ["dashboard", "clients", "appointments", "settings"],
  features: ["booking"],
};

const synth = validateClientManifest(synthetic);
if (!synth.ok) {
  console.error("synthetic build-shaped manifest FAILED", synth.issues);
  process.exit(1);
}
console.log("synthetic_ok", true);
