#!/usr/bin/env node
import { getFirestoreDb } from "../src/lib/firebase/admin.ts";

const DELETE_LABEL = "test200";

async function listAllPromoCodes(db) {
  const snapshot = await db.collection("promoCodes").get();
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code ?? doc.id,
        label: data.label ?? "",
        used: Boolean(data.used),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));
}

async function main() {
  const db = getFirestoreDb();
  const snapshot = await db.collection("promoCodes").get();

  const toDelete = snapshot.docs.filter((doc) => {
    const label = String(doc.data().label ?? "").trim();
    return label === DELETE_LABEL;
  });

  if (toDelete.length === 0) {
    console.log("");
    console.log(`No promo code found with label "${DELETE_LABEL}". Nothing deleted.`);
  } else {
    for (const doc of toDelete) {
      const data = doc.data();
      const code = data.code ?? doc.id;
      const label = data.label ?? "";
      const used = Boolean(data.used);

      console.log("");
      console.log(`Deleting promo code:`);
      console.log(`  code: ${code}`);
      console.log(`  label: ${label}`);
      console.log(`  used: ${used}`);

      await doc.ref.delete();

      console.log("");
      console.log(`✓ Deleted document for label "${DELETE_LABEL}" (code: ${code})`);
    }
  }

  const remaining = await listAllPromoCodes(db);

  console.log("");
  console.log(`All promo codes in Firestore (${remaining.length}):`);
  console.log("");

  if (remaining.length === 0) {
    console.log("  (none)");
  } else {
    for (const row of remaining) {
      console.log(`  code: ${row.code}`);
      console.log(`  label: ${row.label}`);
      console.log(`  used: ${row.used}`);
      console.log("");
    }
  }
}

main().catch((err) => {
  console.error("Failed to delete test promo code:", err.message ?? err);
  process.exit(1);
});
