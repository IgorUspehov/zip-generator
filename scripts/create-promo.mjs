#!/usr/bin/env node
import { FieldValue } from "firebase-admin/firestore";

import { getFirestoreDb } from "../src/lib/firebase/admin.ts";

const label = process.argv.slice(2).join(" ").trim();

if (!label) {
  console.error('Usage: npm run promo:create -- "Agency Name"');
  process.exit(1);
}

function generatePromoCode(inputLabel) {
  const prefix =
    inputLabel.match(/[A-Za-z0-9]+/g)?.join("").slice(0, 6).toUpperCase() || "AGENCY";
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}

async function main() {
  const db = getFirestoreDb();
  let code = "";
  let attempts = 0;

  while (attempts < 12) {
    code = generatePromoCode(label);
    const existing = await db.collection("promoCodes").doc(code).get();
    if (!existing.exists) break;
    attempts += 1;
  }

  if (!code) {
    throw new Error("Failed to generate a unique promo code");
  }

  await db.collection("promoCodes").doc(code).set({
    code,
    label,
    used: false,
    maxUses: 1,
    createdAt: FieldValue.serverTimestamp(),
  });

  console.log("");
  console.log("✓ Promo code created");
  console.log(`  Label: ${label}`);
  console.log(`  Code:  ${code}`);
  console.log("");
  console.log("Share this code with the client (one-time use).");
  console.log("");
}

main().catch((err) => {
  console.error("Failed to create promo code:", err.message ?? err);
  process.exit(1);
});
