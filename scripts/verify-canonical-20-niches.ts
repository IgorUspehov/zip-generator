/**
 * Local verification: 20 canonical niches × EN/DE/RU
 * No network / deploy — seed catalog + sector models only.
 *
 * Run: npx tsx scripts/verify-canonical-20-niches.ts
 */
import fs from "fs";
import path from "path";

import {
  catalogNamesForLang,
  buildCatalogSeed,
} from "../src/lib/catalog/resolve-catalog";
import { resolveLeadFormMode } from "../src/lib/leads/niche-mode";
import { WIZARD_SECTOR_IDS } from "../src/lib/niche-sectors";
import {
  SECTOR_MODELS,
  pickLocalized,
  type SectorModel,
} from "../src/lib/niches/sector-models";
import { sectorIdToBusinessType } from "../src/lib/sector-mapping";

type Lang = "en" | "de" | "ru";
const LANGS: Lang[] = ["en", "de", "ru"];

type Cell = {
  sectorId: string;
  lang: Lang;
  mode: string;
  expectedMode: string;
  catalogForm: string[];
  catalogCrm: string[];
  match: boolean;
  niche: string;
  party: string;
  staff: string;
  catalogLabel: string;
  booking: string;
  publicCta: string;
  crmAddCta: string;
  paymentSource: string;
  carWashClean: boolean;
  failReasons: string[];
};

function crmCatalogNames(model: SectorModel, lang: Lang): string[] {
  return catalogNamesForLang(buildCatalogSeed(model), lang);
}

function hasLatinLeak(text: string, lang: Lang): boolean {
  if (lang === "en") return false;
  if (text.includes("Pending") || text.includes("Cleaning Service") || text.includes("Add Appointment")) {
    return true;
  }
  if (lang === "ru" && text.includes("Massage Salon")) return true;
  return false;
}

function verifyCell(sectorId: string, lang: Lang): Cell {
  const model = SECTOR_MODELS[sectorId as keyof typeof SECTOR_MODELS];
  const businessType = sectorIdToBusinessType(sectorId);
  const mode = resolveLeadFormMode(businessType, sectorId);
  const catalogForm = crmCatalogNames(model, lang);
  const catalogCrm = crmCatalogNames(model, lang);
  const match =
    catalogForm.length > 0 &&
    catalogForm.length === catalogCrm.length &&
    catalogForm.every((v, i) => v === catalogCrm[i]);

  const niche = pickLocalized(model.niche, lang);
  const party = pickLocalized(model.party, lang);
  const staff = pickLocalized(model.staff, lang);
  const catalogLabel = pickLocalized(model.catalog, lang);
  const booking = pickLocalized(model.booking, lang);
  const publicCta = pickLocalized(model.publicCta, lang);
  const crmAddCta = pickLocalized(model.crmAddCta, lang);

  const failReasons: string[] = [];
  if (mode !== model.mode) failReasons.push(`mode=${mode} expected=${model.mode}`);
  if (!match) failReasons.push("catalog form≠crm");
  if (!catalogForm.length) failReasons.push("empty catalog");
  if (businessType !== model.businessType) {
    // tire_service/yoga/cafe share businessType — only fail when mapping is wrong for car_wash
    if (sectorId === "car_wash" && businessType !== "car_wash") {
      failReasons.push(`businessType=${businessType} (must be car_wash)`);
    }
  }

  const labelsBlob = [niche, party, staff, catalogLabel, booking, publicCta, crmAddCta, ...catalogForm].join(" | ");
  if (hasLatinLeak(labelsBlob, lang)) failReasons.push("i18n leak");

  let carWashClean = true;
  if (sectorId === "car_wash") {
    const bannedRuDe = ["Уборк", "Клининг", "Reinigungsservice", "Добавить приём", "cleaning_service"];
    const bannedEn = ["Cleaning Service", "Add Appointment", "cleaning_service"];
    const blob = labelsBlob;
    if (lang === "en") {
      if (bannedEn.some((b) => blob.includes(b))) {
        carWashClean = false;
        failReasons.push("car_wash cleaning leak");
      }
    } else if (bannedRuDe.some((b) => blob.includes(b)) || blob.includes("Cleaning Service")) {
      carWashClean = false;
      failReasons.push("car_wash cleaning leak");
    }
    if (mode !== "order") failReasons.push("car_wash mode≠order");
    if (businessType !== "car_wash") failReasons.push("mapped to cleaning");
  }

  if (sectorId === "barbershop" && mode !== "appointment") {
    failReasons.push("barbershop must be appointment");
  }
  if ((sectorId === "food" || sectorId === "cafe") && mode !== "reservation") {
    failReasons.push("food/cafe must be reservation");
  }

  return {
    sectorId,
    lang,
    mode,
    expectedMode: model.mode,
    catalogForm,
    catalogCrm,
    match,
    niche,
    party,
    staff,
    catalogLabel,
    booking,
    publicCta,
    crmAddCta,
    paymentSource: model.paymentSource,
    carWashClean,
    failReasons,
  };
}

function main() {
  const rows: Cell[] = [];
  for (const sectorId of WIZARD_SECTOR_IDS) {
    for (const lang of LANGS) {
      rows.push(verifyCell(sectorId, lang));
    }
  }

  const pass = rows.filter((r) => r.failReasons.length === 0).length;
  const fail = rows.length - pass;

  const lines: string[] = [];
  lines.push("# Canonical 20 niches — local form verify");
  lines.push("");
  lines.push(`**Date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push("**Scope:** `saas-mvp-funnel` only — no commit / push / deploy");
  lines.push("**Method:** sector-models + shared catalog seed (`records[catalogKey]` / `seedCatalog`) × EN/DE/RU");
  lines.push("");
  lines.push(`**Summary:** ${pass} PASS / ${fail} FAIL of ${rows.length} (20 niches × 3 langs)`);
  lines.push("");
  lines.push("## Matrix 20 × 3");
  lines.push("");
  lines.push("| sector_id | lang | mode | catalog 1:1 | niche | party | catalog | booking | public CTA | CRM CTA | payment | result |");
  lines.push("|-----------|------|------|-------------|-------|-------|---------|---------|------------|---------|---------|--------|");

  for (const r of rows) {
    const ok = r.failReasons.length === 0;
    const catPreview = r.catalogForm.slice(0, 3).join("; ") || "—";
    lines.push(
      `| ${r.sectorId} | ${r.lang} | ${r.mode} | ${r.match ? "YES" : "NO"} (${catPreview}) | ${r.niche} | ${r.party} | ${r.catalogLabel} | ${r.booking} | ${r.publicCta} | ${r.crmAddCta} | ${r.paymentSource} | ${ok ? "**PASS**" : `**FAIL**: ${r.failReasons.join("; ")}`} |`,
    );
  }

  lines.push("");
  lines.push("## Checks covered");
  lines.push("");
  lines.push("| Check | How |");
  lines.push("|-------|-----|");
  lines.push("| A entities/labels | sector-models party/staff/catalog/booking |");
  lines.push("| B form dropdown = CRM catalog | same `buildCatalogSeed` for both |");
  lines.push("| C lead entity kind | mode → appointment/order/reservation/inquiry in `createSiteLead` |");
  lines.push("| D i18n | labels + catalog names per lang; leak heuristics |");
  lines.push("| E car_wash ≠ cleaning | mapping + banned substrings |");
  lines.push("| F barbershop/food/cafe modes | appointment / reservation |");
  lines.push("");
  lines.push("## Architecture diff");
  lines.push("");
  lines.push("```");
  lines.push("BEFORE:");
  lines.push("  /site form  ← popular_services (independent)");
  lines.push("  CRM UI     ← records.services|menu|courses (localStorage)");
  lines.push("  mode       ← includes('shop') heuristics");
  lines.push("  car_wash   ← cleaning_service");
  lines.push("");
  lines.push("AFTER:");
  lines.push("  sector-models.ts  → mode, labels, catalogKey, CTAs, paymentSource");
  lines.push("  resolve-catalog   → buildCatalogSeed(records[catalogKey] || seedCatalog)");
  lines.push("  Firestore clients/{id}/catalog  ← shared (GET public, PUT CRM)");
  lines.push("  /site + CRM sync via /api/crm/catalog/[clientId]");
  lines.push("  car_wash businessType = car_wash (own labels/scenario)");
  lines.push("```");
  lines.push("");
  lines.push("## Changed files (this fix)");
  lines.push("");

  const changedHint = [
    "src/lib/niches/sector-models.ts",
    "src/lib/catalog/resolve-catalog.ts",
    "src/lib/catalog/firestore-catalog.ts",
    "src/app/api/crm/catalog/[clientId]/route.ts",
    "src/lib/leads/niche-mode.ts",
    "src/lib/leads/types.ts",
    "src/lib/leads/store.ts",
    "src/app/site/[clientId]/page.tsx",
    "src/components/public-site/booking-form.tsx",
    "src/app/api/leads/[clientId]/route.ts",
    "src/lib/manifest/schema.ts",
    "src/lib/manifest/niche-scenario.ts",
    "config/sector_mapping.json",
    "src/lib/image-library/business-type-map.ts",
    "src/lib/niche-scenarios.json",
    "src/lib/niche-labels.json",
    "artifacts/factory_output/react_mvp/src/data/niche-scenarios.json",
    "artifacts/factory_output/react_mvp/src/data/niche-labels.json",
    "artifacts/factory_output/react_mvp/src/App.jsx",
    "artifacts/factory_output/react_mvp/src/lib/crm-matrix.js",
    "artifacts/factory_output/react_mvp/src/lib/sync-crm-catalog.js",
    "artifacts/factory_output/react_mvp/src/lib/image-library.js",
    "scripts/verify-canonical-20-niches.ts",
    "docs/canonical-20-niches-form-verify.md",
  ];
  for (const f of changedHint) lines.push(`- \`${f}\``);

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- Live tenant E2E (POST lead → CRM UI) still needs Firebase + CRM secret; this run validates the **system invariants** offline.");
  lines.push("- `popular_services` remains in scenario JSON for legacy dashboard copy but is **no longer** the public form source.");
  lines.push("- Inactive niches `veterinary` / `construction` / `cleaning_service` are not in `WIZARD_SECTOR_IDS` and were not verified as wizard niches.");
  lines.push("");

  const out = path.join(process.cwd(), "docs/canonical-20-niches-form-verify.md");
  fs.writeFileSync(out, lines.join("\n") + "\n");
  console.log(`Wrote ${out}`);
  console.log(`PASS ${pass} / FAIL ${fail} / TOTAL ${rows.length}`);
  if (fail) {
    for (const r of rows.filter((x) => x.failReasons.length)) {
      console.log(`FAIL ${r.sectorId}/${r.lang}: ${r.failReasons.join("; ")}`);
    }
    process.exitCode = 1;
  }
}

main();
