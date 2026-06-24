#!/usr/bin/env node
/**
 * Local test helper: grant MVP Pro download entitlement without real payment.
 *
 * Usage:
 *   node scripts/grant-mvp-pro.mjs <clientId> <email> [language]
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function resolveDistPath() {
  const candidates = [
    path.join(root, "mvp-template/dist"),
    path.join(root, "artifacts/factory_output/react_mvp/dist"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }
  throw new Error("MVP dist not found. Build mvp-template/dist first.");
}

function main() {
  const [clientId, email, language = "ru"] = process.argv.slice(2);
  if (!clientId || !email) {
    console.error("Usage: node scripts/grant-mvp-pro.mjs <clientId> <email> [language]");
    process.exit(1);
  }

  const manifestPath = path.join(root, "data/manifests", `${clientId}.json`);
  let businessName = "MVP Pro Client";
  let businessType = "business";
  let resolvedLanguage = ["ru", "de", "en"].includes(language) ? language : "en";

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    businessName = manifest.business_name ?? businessName;
    businessType = manifest.business_type ?? businessType;
    resolvedLanguage = ["ru", "de", "en"].includes(manifest.language) ? manifest.language : resolvedLanguage;
  }

  const sourceDist = resolveDistPath();
  const targetDist = path.join(root, "artifacts", clientId, "dist");
  fs.mkdirSync(path.dirname(targetDist), { recursive: true });
  fs.cpSync(sourceDist, targetDist, { recursive: true });

  const downloadToken = randomUUID();
  const entitlement = {
    clientId,
    email: email.trim().toLowerCase(),
    variantId: "1807661",
    status: "ready_to_download",
    downloadToken,
    paidAt: new Date().toISOString(),
    language: resolvedLanguage,
    businessName,
    businessType,
    orderId: `TEST-${Date.now()}`,
  };

  const entitlementsDir = path.join(root, "data/mvp-pro-entitlements");
  fs.mkdirSync(entitlementsDir, { recursive: true });
  fs.writeFileSync(
    path.join(entitlementsDir, `${clientId}.json`),
    `${JSON.stringify(entitlement, null, 2)}\n`,
    "utf8",
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const statusUrl = `${siteUrl}/api/mvp-pro/status?clientId=${encodeURIComponent(clientId)}&email=${encodeURIComponent(email)}`;
  const downloadUrl = `${siteUrl}/api/download-zip?clientId=${encodeURIComponent(clientId)}&token=${encodeURIComponent(downloadToken)}`;

  console.log("MVP Pro entitlement granted:");
  console.log(JSON.stringify(entitlement, null, 2));
  console.log("\nStatus URL:");
  console.log(statusUrl);
  console.log("\nDownload URL:");
  console.log(downloadUrl);
}

main();
