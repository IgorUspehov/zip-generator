/**
 * Bootstrap 3 local evidence tenants (no deploy/push).
 * Run: npx tsx scripts/bootstrap-local-evidence-tenants.ts
 */
import fs from "fs";
import path from "path";

import { upsertDemoRecord } from "../src/lib/cloudflare/demo-registry";
import { ensureLeadsReadSecret } from "../src/lib/leads/read-secret";
import { saveClientManifest } from "../src/lib/manifest/storage";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";
import { replaceFileCatalogItems } from "../src/lib/catalog/file-catalog";
import { buildCatalogSeed } from "../src/lib/catalog/resolve-catalog";

const CRM_ORIGIN = process.env.LOCAL_CRM_ORIGIN || "http://127.0.0.1:4173";
const APP_ORIGIN = process.env.LOCAL_APP_ORIGIN || "http://127.0.0.1:3000";

const TENANTS = [
  {
    clientId: "denta100-0000-4000-8000-00000000fab4",
    slug: "klinika-zub-bolit-fab4",
    sectorId: "dental" as const,
    businessName: "Клиника Зуб Болит",
    language: "ru",
  },
  {
    clientId: "cafe1000-0000-4000-8000-000kalinka01",
    slug: "kalinka-malinka-klnk",
    sectorId: "cafe" as const,
    businessName: "Калинка-Малинка",
    language: "ru",
  },
  {
    clientId: "wash1000-0000-4000-8000-000carwash01",
    slug: "avtomoyka-local-wash",
    sectorId: "car_wash" as const,
    businessName: "Автомойка Local Wash",
    language: "ru",
  },
];

function baseManifest(t: (typeof TENANTS)[number]) {
  const model = SECTOR_MODELS[t.sectorId];
  return {
    businessName: t.businessName,
    ownerName: "Local Evidence",
    businessType: model.businessType,
    niche: model.niche.ru,
    language: t.language,
    city: "Berlin",
    phone: "+49 30 1234567",
    email: "evidence@local.test",
    address: "Evidence Str. 1",
    whatsapp: "",
    postalCode: "10115",
    sectorId: t.sectorId,
    sector_id: t.sectorId,
    primaryColor: "#ea580c",
    theme: {
      primary: "#9a3412",
      secondary: "#c2410c",
      accent: "#ea580c",
      hero_bg: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
      text: "#1c1917",
      border: "#e7e5e4",
    },
    promotion: {
      ru: "Локальная проверка",
      de: "Lokaler Test",
      en: "Local evidence",
    },
    pages: ["dashboard", "clients", "appointments", "services", "staff", "payments", "settings"],
    galleryPhotos: [],
  };
}

function main() {
  const out = [];
  for (const t of TENANTS) {
    const model = SECTOR_MODELS[t.sectorId];
    const manifest = baseManifest(t);
    // Cafe/restaurant pages from matrix
    if (t.sectorId === "cafe") {
      manifest.pages = [
        "dashboard",
        "reservations",
        "tables",
        "menu",
        "staff",
        "payments",
        "settings",
      ];
    }
    if (t.sectorId === "dental") {
      manifest.pages = [
        "dashboard",
        "patients",
        "doctors",
        "appointments",
        "services",
        "payments",
        "settings",
      ];
    }
    if (t.sectorId === "car_wash") {
      manifest.pages = [
        "dashboard",
        "clients",
        "appointments",
        "services",
        "staff",
        "payments",
        "settings",
      ];
    }

    saveClientManifest(t.clientId, manifest);
    ensureLeadsReadSecret(t.clientId);
    replaceFileCatalogItems(t.clientId, buildCatalogSeed(model));

    upsertDemoRecord({
      slug: t.slug,
      clientId: t.clientId,
      deploymentId: `local-${t.slug}`,
      deploymentUrl: `${CRM_ORIGIN}/?clientId=${encodeURIComponent(t.clientId)}`,
      projectName: `local-${t.slug}`,
      deployedAt: new Date().toISOString(),
      deleteAt: new Date(Date.now() + 30 * 864e5).toISOString(),
      paid: true,
    });

    out.push({
      sectorId: t.sectorId,
      clientId: t.clientId,
      slug: t.slug,
      businessName: t.businessName,
      site: `${APP_ORIGIN}/site/${t.slug}?lang=ru`,
      crm: `${APP_ORIGIN}/demo/${t.slug}?clientId=${t.clientId}`,
      mode: model.mode,
      catalogKey: model.catalogKey,
    });
  }

  const reportPath = path.join(process.cwd(), "docs/local-evidence-tenants.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(out, null, 2)}\n`);
  console.log(JSON.stringify(out, null, 2));
  console.log("Wrote", reportPath);
}

main();
