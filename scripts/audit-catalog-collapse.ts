/**
 * Audit prod catalogs for collapsed LocalizedLabel (read-only).
 * Does NOT mutate anything.
 */
import fs from "fs";
import path from "path";

import { buildCatalogSeed } from "../src/lib/catalog/resolve-catalog";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";

const BASE = "https://saas-mvp-funnel-production.up.railway.app";

const TENANTS = [
  { slug: "fishkin-ntli-71fa", clientId: "71fa5ae0-5c2e-4516-b84e-5cccef92337a" },
  { slug: "xerox12345-021c", clientId: "021cd3f9-bdcd-4e4f-9dfd-a5ced2c8777a" },
  { slug: "polimernye-materialy-2f73", clientId: "2f7347db-504e-4b47-9613-f462ca4f0d5d" },
  { slug: "polimernye-materialy-f2b6", clientId: "f2b6607d-b83b-4ce6-b0ee-8648b8b88904" },
  { slug: "ihor-kriazhev-it-b475", clientId: "b475392b-3c84-4dca-82b4-b6cf780f1e31" },
  { slug: "fishkin-ntli-03de", clientId: "03de11de-f488-45e1-a967-550beaca73dc" },
  { slug: "meditsinskaya-klinika-pobolit-i-perestanet-f8dc", clientId: "f8dc41fa-23f4-4ad5-9962-2a489d85a868" },
  { slug: "klinika-zub-bolit-fab4", clientId: "fab4b137-0341-43da-9a5d-099297fcd92c" },
  { slug: "kalinka-malinka-klnk", clientId: "37a66e67-5ed3-4a83-99c4-e0508f8c77fe" },
  { slug: "avtomoyka-local-wash", clientId: "404db994-66e1-4795-b419-d8e8e72bba38" },
  { slug: "klinika-zub-bolit-b8c1", clientId: "b8c13d15-86e4-4b3a-afb2-62cf78d07bfe" },
  { slug: "fitness-studio-best-1260", clientId: "12601a73-faa9-4c0b-aa43-43ba9377bb58" },
];

type Name = { en?: string; de?: string; ru?: string };

function isCollapsedName(name: Name | undefined): boolean {
  if (!name || typeof name !== "object") return true;
  const en = String(name.en ?? "").trim();
  const de = String(name.de ?? "").trim();
  const ru = String(name.ru ?? "").trim();
  if (!en && !de && !ru) return true;
  // All filled locales identical → collapsed fan-out
  const vals = [en, de, ru].filter(Boolean);
  if (vals.length >= 2 && vals.every((v) => v === vals[0])) return true;
  return false;
}

function resolveSectorKey(businessType: string | undefined): keyof typeof SECTOR_MODELS | null {
  if (!businessType) return null;
  const bt = businessType.trim();
  for (const [key, model] of Object.entries(SECTOR_MODELS)) {
    if (model.businessType === bt || model.scenarioKey === bt || key === bt) {
      return key as keyof typeof SECTOR_MODELS;
    }
  }
  // common aliases
  const aliases: Record<string, keyof typeof SECTOR_MODELS> = {
    dental_clinic: "dental",
    health_clinic: "dental",
    restaurant: "cafe",
    cafe: "cafe",
    car_wash: "car_wash",
    fitness_club: "fitness",
    beauty_salon: "beauty",
    real_estate: "realestate",
    tech: "tech",
    it: "tech",
  };
  return aliases[bt] || null;
}

async function main() {
  const rows = [];
  for (const t of TENANTS) {
    const manRes = await fetch(`${BASE}/api/manifest/${t.clientId}`, { cache: "no-store" });
    const manifest = manRes.ok ? await manRes.json() : null;
    const businessType = String(manifest?.businessType || manifest?.business_type || "");
    const businessName = String(manifest?.businessName || manifest?.business_name || "");
    const sectorKey = resolveSectorKey(businessType);
    const seed = sectorKey ? buildCatalogSeed(SECTOR_MODELS[sectorKey]) : [];

    const catRes = await fetch(`${BASE}/api/crm/catalog/${t.clientId}?lang=en`, {
      cache: "no-store",
    });
    const cat = catRes.ok
      ? ((await catRes.json()) as { items?: Array<{ id: string; name: Name }>; names?: string[] })
      : { items: [], names: [] };
    const items = Array.isArray(cat.items) ? cat.items : [];
    const collapsedItems = items.filter((it) => isCollapsedName(it.name));
    const collapsed = items.length > 0 && collapsedItems.length === items.length;
    const partial = collapsedItems.length > 0 && collapsedItems.length < items.length;
    const empty = items.length === 0;

    let recommendation: "ok" | "reseed_from_sector" | "inspect_manual" | "empty";
    if (empty) recommendation = "empty";
    else if (collapsed && seed.length) recommendation = "reseed_from_sector";
    else if (collapsed || partial) recommendation = "inspect_manual";
    else recommendation = "ok";

    rows.push({
      slug: t.slug,
      clientId: t.clientId,
      businessName,
      businessType,
      sectorKey,
      itemCount: items.length,
      collapsedCount: collapsedItems.length,
      status: empty ? "empty" : collapsed ? "fully_collapsed" : partial ? "partial_collapsed" : "ok",
      recommendation,
      sampleName: items[0]?.name || null,
      seedSample: seed[0]?.name || null,
      wouldReplaceWith:
        recommendation === "reseed_from_sector"
          ? seed.map((s) => ({ id: s.id, name: s.name, price: s.price }))
          : null,
    });
  }

  const summary = {
    total: rows.length,
    ok: rows.filter((r) => r.status === "ok").length,
    fully_collapsed: rows.filter((r) => r.status === "fully_collapsed").length,
    partial_collapsed: rows.filter((r) => r.status === "partial_collapsed").length,
    empty: rows.filter((r) => r.status === "empty").length,
    wouldReseed: rows.filter((r) => r.recommendation === "reseed_from_sector").map((r) => r.clientId),
  };

  const out = { auditedAt: new Date().toISOString(), summary, tenants: rows };
  const outPath = path.join(process.cwd(), "docs/catalog-collapse-audit.json");
  fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  console.log("\nAffected (fully_collapsed):");
  for (const r of rows.filter((r) => r.status === "fully_collapsed")) {
    console.log(
      `- ${r.slug} (${r.clientId}) type=${r.businessType} sample=${JSON.stringify(r.sampleName)} → seed=${JSON.stringify(r.seedSample)}`,
    );
  }
  console.log("\nOK:");
  for (const r of rows.filter((r) => r.status === "ok")) {
    console.log(`- ${r.slug} sample=${JSON.stringify(r.sampleName)}`);
  }
  console.log("\nWrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
