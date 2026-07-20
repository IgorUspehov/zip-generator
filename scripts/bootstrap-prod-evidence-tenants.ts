/**
 * Bootstrap 3 production evidence tenants on Railway volume + CF Pages CRM.
 * Run: railway run -- npx tsx scripts/bootstrap-prod-evidence-tenants.ts
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { deployDistToPages } from "../src/lib/cloudflare/deploy";
import {
  findDemoByClientId,
  upsertDemoRecord,
} from "../src/lib/cloudflare/demo-registry";
import { getSharedPagesProjectName } from "../src/lib/cloudflare/shared-project";
import { resolvePersistentDataDir } from "../src/lib/site-delivery/data-dir";
import {
  cleanupClientDist,
  prepareClientDistWithOgImage,
} from "../src/lib/og-image/prepare-client-dist";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";

const TENANTS = [
  {
    sectorId: "dental" as const,
    clientId: "fab4b137-0341-43da-9a5d-099297fcd92c",
    slug: "klinika-zub-bolit-fab4",
    businessName: 'Клиника "Зуб болит"',
    language: "ru",
    pages: [
      "dashboard",
      "patients",
      "doctors",
      "appointments",
      "services",
      "payments",
      "settings",
    ],
  },
  {
    sectorId: "cafe" as const,
    clientId: "37a66e67-5ed3-4a83-99c4-e0508f8c77fe",
    slug: "kalinka-malinka-klnk",
    businessName: 'Кафе "Калинка/Малинка"',
    language: "ru",
    pages: [
      "dashboard",
      "reservations",
      "tables",
      "menu",
      "staff",
      "payments",
      "settings",
    ],
  },
  {
    sectorId: "car_wash" as const,
    clientId: "404db994-66e1-4795-b419-d8e8e72bba38",
    slug: "avtomoyka-local-wash",
    businessName: "Автомойка Local Wash",
    language: "ru",
    pages: [
      "dashboard",
      "clients",
      "appointments",
      "services",
      "staff",
      "payments",
      "settings",
    ],
  },
];

function manifestsDir() {
  return path.join(resolvePersistentDataDir(), "manifests");
}

function ensureManifest(t: (typeof TENANTS)[number]) {
  const model = SECTOR_MODELS[t.sectorId];
  const file = path.join(manifestsDir(), `${t.clientId}.json`);
  let existing: Record<string, unknown> = {};
  if (fs.existsSync(file)) {
    existing = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  }
  const secret =
    typeof existing.leadsReadSecret === "string" && existing.leadsReadSecret
      ? existing.leadsReadSecret
      : crypto.randomBytes(32).toString("hex");

  const next = {
    ...existing,
    clientId: t.clientId,
    sectorId: t.sectorId,
    businessType: model.businessType,
    business_type: model.businessType,
    businessName: t.businessName,
    business_name: t.businessName,
    language: t.language,
    lang: t.language,
    city: existing.city || "Berlin",
    phone: existing.phone || "+49 30 1234567",
    email: existing.email || "evidence@prod.test",
    pages: t.pages,
    leadsReadSecret: secret,
  };
  fs.mkdirSync(manifestsDir(), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

async function main() {
  const source = path.join(process.cwd(), "artifacts/factory_output/react_mvp/dist");
  if (!fs.existsSync(path.join(source, "index.html"))) {
    throw new Error(`Missing CRM dist at ${source} — run npm run react-mvp:build`);
  }
  const project = getSharedPagesProjectName();

  // Prepare manifests first (car_wash must be businessType=car_wash).
  for (const t of TENANTS) {
    const m = ensureManifest(t);
    console.log("manifest", t.sectorId, t.clientId, m.businessType);
  }

  // One CF deploy of current CRM; reuse URL for all three tenants.
  const primary = TENANTS[0];
  const staging = await prepareClientDistWithOgImage(
    primary.clientId,
    source,
    ensureManifest(primary) as Record<string, unknown>,
  );
  let deploymentUrl = "";
  let deploymentId = "";
  try {
    const result = await deployDistToPages(project, staging, {
      previewBranch: "prod-evidence-canonical",
    });
    deploymentUrl = result.deploymentUrl;
    deploymentId = result.deploymentId;
    console.log("crm deployed", deploymentUrl, deploymentId);
  } finally {
    cleanupClientDist(staging);
  }

  const now = new Date().toISOString();
  const deleteAt = new Date(Date.now() + 365 * 864e5).toISOString();
  const out = [];
  for (const t of TENANTS) {
    const existing = findDemoByClientId(t.clientId);
    upsertDemoRecord({
      slug: t.slug,
      clientId: t.clientId,
      deploymentId: deploymentId || existing?.deploymentId || `prod-${t.slug}`,
      deploymentUrl: deploymentUrl || existing?.deploymentUrl || "",
      projectName: project,
      deployedAt: now,
      deleteAt,
      paid: true,
    });
    out.push({
      sectorId: t.sectorId,
      clientId: t.clientId,
      slug: t.slug,
      site: `https://saas-mvp-funnel-production.up.railway.app/site/${t.slug}?lang=ru`,
      crm: `https://saas-mvp-funnel-production.up.railway.app/demo/${t.slug}?clientId=${t.clientId}`,
      crmDirect: `${deploymentUrl}?clientId=${t.clientId}`,
    });
  }

  const reportPath = path.join(process.cwd(), "docs/prod-evidence-tenants.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(out, null, 2));
  console.log("Wrote", reportPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
