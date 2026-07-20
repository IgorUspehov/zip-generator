/**
 * One-shot: reseed 2 collapsed prod catalogs from sector seed.
 * Usage: SECRET_CAFE=… SECRET_DENTAL_B8C1=… npx tsx scripts/migrate-two-collapsed-catalogs.ts
 */
import { buildCatalogSeed } from "../src/lib/catalog/resolve-catalog";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";

const BASE = "https://saas-mvp-funnel-production.up.railway.app";

const TARGETS = [
  {
    slug: "kalinka-malinka-klnk",
    clientId: "37a66e67-5ed3-4a83-99c4-e0508f8c77fe",
    sector: "cafe" as const,
    secret: process.env.SECRET_CAFE || "",
  },
  {
    slug: "klinika-zub-bolit-b8c1",
    clientId: "b8c13d15-86e4-4b3a-afb2-62cf78d07bfe",
    sector: "dental" as const,
    secret: process.env.SECRET_DENTAL_B8C1 || "",
  },
];

async function main() {
  for (const t of TARGETS) {
    if (!t.secret) throw new Error(`missing secret for ${t.slug}`);
    const items = buildCatalogSeed(SECTOR_MODELS[t.sector]).map((item) => ({
      ...item,
      // Current prod Firestore rejects missing/undefined duration — send empty string.
      duration: item.duration ?? "",
    }));
    const before = await (
      await fetch(`${BASE}/api/crm/catalog/${t.clientId}?lang=en`, { cache: "no-store" })
    ).json();
    const res = await fetch(`${BASE}/api/crm/catalog/${t.clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CRM-Secret": t.secret,
      },
      body: JSON.stringify({ items }),
    });
    const after = await res.json();
    console.log(
      JSON.stringify(
        {
          slug: t.slug,
          clientId: t.clientId,
          status: res.status,
          beforeFirst: before.items?.[0]?.name,
          afterFirst: after.items?.[0]?.name,
          afterNamesEn: (after.items || []).map(
            (i: { name: { en: string } }) => i.name.en,
          ),
          afterNamesRu: (after.items || []).map(
            (i: { name: { ru: string } }) => i.name.ru,
          ),
        },
        null,
        2,
      ),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
