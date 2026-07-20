/**
 * Verify CRM UI + sync no longer collapses LocalizedLabel {en,de,ru} into one language.
 * Local only — no deploy.
 *
 * Run:
 *   RAILWAY_VOLUME_MOUNT_PATH=/tmp/crm-redeploy-data CATALOG_BACKEND=file \
 *     npx tsx scripts/verify-crm-locale-preserve.ts
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

import { upsertDemoRecord } from "../src/lib/cloudflare/demo-registry";
import { replaceFileCatalogItems, listFileCatalogItems } from "../src/lib/catalog/file-catalog";
import { buildCatalogSeed } from "../src/lib/catalog/resolve-catalog";
import { ensureLeadsReadSecret } from "../src/lib/leads/read-secret";
import { saveClientManifest } from "../src/lib/manifest/storage";
import { SECTOR_MODELS, pickLocalized } from "../src/lib/niches/sector-models";
import { resolvePersistentDataDir } from "../src/lib/site-delivery/data-dir";

const BASE = "http://127.0.0.1:3000";
const CRM_ORIGIN = "http://127.0.0.1:4173";
const DATA = resolvePersistentDataDir();
const OUT = path.join(process.cwd(), "docs/locale-preserve-screenshots");

const TENANTS = [
  {
    sectorId: "realestate" as const,
    clientId: "realty10-0000-4000-8000-0000estate01",
    slug: "agentstvo-local-realty",
    businessName: "Local Realty",
    catalogTab: /Leistungen|Services|Услуги/i,
  },
  {
    sectorId: "dental" as const,
    clientId: "denta100-0000-4000-8000-00000000fab4",
    slug: "klinika-zub-bolit-fab4",
    businessName: "Клиника Зуб Болит",
    catalogTab: /Leistungen|Services|Услуги|Процедур/i,
  },
  {
    sectorId: "car_wash" as const,
    clientId: "wash1000-0000-4000-8000-000carwash01",
    slug: "avtomoyka-local-wash",
    businessName: "Автомойка Local Wash",
    catalogTab: /Waschleistungen|Wash Services|Услуги мойки|Услуги/i,
  },
];

function secret(id: string) {
  try {
    return (
      JSON.parse(fs.readFileSync(path.join(DATA, "manifests", `${id}.json`), "utf8")) as {
        leadsReadSecret?: string;
      }
    ).leadsReadSecret;
  } catch {
    return "";
  }
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function catalogPayload(clientId: string) {
  // Prefer file backend read — stable while Next restarts under memory pressure.
  try {
    const items = listFileCatalogItems(clientId);
    if (items.length) {
      return { items, names: items.map((i) => i.name.en) };
    }
  } catch {
    /* fall through to API */
  }
  let lastErr: unknown;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch(`${BASE}/api/crm/catalog/${clientId}?lang=en`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`catalog GET ${res.status}`);
      return (await res.json()) as {
        items?: Array<{ id: string; name: { en?: string; de?: string; ru?: string } }>;
        names?: string[];
      };
    } catch (err) {
      lastErr = err;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function putItems(
  clientId: string,
  items: Array<{ id: string; name: { en: string; de: string; ru: string }; price?: string; duration?: unknown }>,
) {
  // Direct file write — avoids Next memory restarts mid-evidence run.
  replaceFileCatalogItems(clientId, items);
}

function ensureTenant(t: (typeof TENANTS)[number]) {
  const model = SECTOR_MODELS[t.sectorId];
  if (!model) throw new Error(`missing model ${t.sectorId}`);
  const manifest = {
    businessName: t.businessName,
    ownerName: "Locale Preserve",
    businessType: model.businessType,
    niche: pickLocalized(model.niche, "de"),
    language: "de",
    city: "Berlin",
    phone: "+49 30 1234567",
    email: "locale@local.test",
    address: "Locale Str. 1",
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
    promotion: { ru: "Тест", de: "Test", en: "Test" },
    pages: ["dashboard", "clients", "appointments", "services", "staff", "payments", "settings"],
  };
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
    paid: false,
  });
  return model;
}

function expectedNames(sectorId: (typeof TENANTS)[number]["sectorId"]) {
  const model = SECTOR_MODELS[sectorId];
  const seed = buildCatalogSeed(model);
  return {
    en: seed.map((i) => i.name.en),
    de: seed.map((i) => i.name.de),
    ru: seed.map((i) => i.name.ru),
    items: seed,
  };
}

/** Old CRM bug: fan DE UI string into all locales. */
function collapseToDe(items: ReturnType<typeof buildCatalogSeed>) {
  return items.map((item, index) => ({
    id: item.id || `seed-${index}`,
    name: { en: item.name.de, de: item.name.de, ru: item.name.de },
    price: item.price,
    duration: item.duration,
  }));
}

async function goto(page: import("playwright").Page, url: string) {
  await page.goto(url, { waitUntil: "commit", timeout: 60000 });
  await page.waitForLoadState("domcontentloaded").catch(() => undefined);
  await page.waitForTimeout(800);
}

async function openSiteSelect(page: import("playwright").Page, slug: string, lang: string) {
  await goto(page, `${BASE}/site/${slug}?lang=${lang}`);
  const btn = page.locator("section.mt-10 button").first();
  await btn.waitFor({ timeout: 20000 });
  await btn.click();
  await page.waitForSelector("section.mt-10 select", { timeout: 15000 });
  await page.locator("section.mt-10 select").evaluate((el: HTMLSelectElement) => {
    el.size = Math.min(el.options.length, 12);
  });
  await page.waitForTimeout(300);
}

async function siteOptions(page: import("playwright").Page) {
  return (await page.locator("section.mt-10 select option").allTextContents())
    .map((x) => x.trim())
    .filter((x) => x && !/Выберите|Select|Auswählen/i.test(x));
}

async function openCrmServices(
  page: import("playwright").Page,
  t: (typeof TENANTS)[number],
) {
  const url = `${BASE}/demo/${t.slug}?clientId=${t.clientId}&lang=de`;
  await goto(page, url);
  await page.waitForSelector("iframe", { timeout: 30000 });
  await page.waitForTimeout(7000);
  let fr = page.frames().find((f) => f.url().includes("127.0.0.1:4173"));
  if (!fr) throw new Error(`no CRM frame for ${t.sectorId}`);
  await fr.waitForSelector("aside button", { timeout: 30000 });
  // Drop any previously collapsed services so seeds/hydrate reload as LocalizedLabel.
  await fr.evaluate((clientId) => {
    try {
      localStorage.removeItem(`mvp_crm:${clientId}:services`);
    } catch {
      /* ignore */
    }
    location.reload();
  }, t.clientId);
  await page.waitForTimeout(7000);
  fr = page.frames().find((f) => f.url().includes("127.0.0.1:4173"));
  if (!fr) throw new Error(`no CRM frame after reload ${t.sectorId}`);
  await fr.waitForSelector("aside button", { timeout: 30000 });
  const tab = fr.locator("aside button").filter({ hasText: t.catalogTab }).first();
  await tab.click({ timeout: 15000 });
  await page.waitForTimeout(2500);
  return fr;
}

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const report: Record<string, unknown>[] = [];

  for (const t of TENANTS) {
    ensureTenant(t);
  }

  const browser = await chromium.launch({ headless: true });

  for (const t of TENANTS) {
    const expected = expectedNames(t.sectorId);
    const row: Record<string, unknown> = { sectorId: t.sectorId, clientId: t.clientId };
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    try {
    // --- BEFORE: simulate old CRM sync collapse (DE UI string → all locales) ---
    await putItems(t.clientId, collapseToDe(expected.items));
    const beforeApi = await catalogPayload(t.clientId);
    row.beforeApiEn = (beforeApi.items || []).map((i) => i.name?.en);
    row.beforeApiRu = (beforeApi.items || []).map((i) => i.name?.ru);
    row.beforeCollapsed =
      arraysEqual(row.beforeApiEn as string[], expected.de) &&
      arraysEqual(row.beforeApiRu as string[], expected.de);

    await openSiteSelect(page, t.slug, "en");
    const beforeEnOpts = await siteOptions(page);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-BEFORE-site-en.png`),
      fullPage: true,
    });
    await openSiteSelect(page, t.slug, "ru");
    const beforeRuOpts = await siteOptions(page);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-BEFORE-site-ru.png`),
      fullPage: true,
    });
    row.beforeSiteEn = beforeEnOpts;
    row.beforeSiteRu = beforeRuOpts;
    row.beforeBugVisible =
      beforeEnOpts.some((n) => expected.de.includes(n)) &&
      !beforeEnOpts.some((n) => expected.en.includes(n));

    // Restore multilingual seed
    replaceFileCatalogItems(t.clientId, expected.items);

    // --- AFTER: open CRM on DE, visit Services (triggers sync), no edits ---
    const fr = await openCrmServices(page, t);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-AFTER-crm-de-services.png`),
      fullPage: true,
    });
    // Give bridge time to PUT
    await page.waitForTimeout(2500);

    const afterOpenApi = await catalogPayload(t.clientId);
    row.afterOpenApiEn = (afterOpenApi.items || []).map((i) => i.name?.en);
    row.afterOpenApiDe = (afterOpenApi.items || []).map((i) => i.name?.de);
    row.afterOpenApiRu = (afterOpenApi.items || []).map((i) => i.name?.ru);
    row.afterOpenPreserved =
      arraysEqual(row.afterOpenApiEn as string[], expected.en) &&
      arraysEqual(row.afterOpenApiRu as string[], expected.ru);

    await openSiteSelect(page, t.slug, "en");
    const afterEnOpts = await siteOptions(page);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-AFTER-site-en.png`),
      fullPage: true,
    });
    await openSiteSelect(page, t.slug, "ru");
    const afterRuOpts = await siteOptions(page);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-AFTER-site-ru.png`),
      fullPage: true,
    });
    row.afterSiteEn = afterEnOpts;
    row.afterSiteRu = afterRuOpts;
    row.afterSitePreserved =
      afterEnOpts.some((n) => expected.en.includes(n)) &&
      afterRuOpts.some((n) => expected.ru.includes(n)) &&
      !afterEnOpts.every((n) => expected.de.includes(n));

    // --- Edit one service name on DE only; other locales must survive ---
    await goto(page, `${BASE}/demo/${t.slug}?clientId=${t.clientId}&lang=de`);
    await page.waitForTimeout(7000);
    const frEdit = page.frames().find((f) => f.url().includes("127.0.0.1:4173"));
    if (!frEdit) throw new Error(`no frame for edit ${t.sectorId}`);
    await frEdit.waitForSelector("aside button", { timeout: 30000 });
    const tab = frEdit.locator("aside button").filter({ hasText: t.catalogTab }).first();
    await tab.click();
    await page.waitForTimeout(1000);
    const editBtn = frEdit.locator("button").filter({ hasText: /Bearbeiten|Edit|Изменить/i }).first();
    await editBtn.waitFor({ timeout: 15000 });
    await editBtn.click();
    await page.waitForTimeout(400);
    const nameInput = frEdit.locator("article input").first();
    const editedDe = `${expected.de[0]} (DE-edit)`;
    await nameInput.fill(editedDe);
    await frEdit.locator("button").filter({ hasText: /Speichern|Save|Сохранить/i }).first().click();
    // Poll shared catalog until DE patch lands (CRM bridge PUT).
    let first: { en?: string; de?: string; ru?: string } | undefined;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      const afterEditApi = await catalogPayload(t.clientId);
      const editedRow = (afterEditApi.items || []).find(
        (it) => it.name?.de === editedDe || String(it.name?.de || "").includes("DE-edit"),
      );
      first = editedRow?.name || afterEditApi.items?.[0]?.name;
      if (first && String(first.de || "").includes("DE-edit")) break;
    }
    row.editedDe = editedDe;
    row.afterEditName = first;
    row.afterEditPreserved =
      Boolean(first) &&
      first!.en === expected.en[0] &&
      first!.ru === expected.ru[0] &&
      String(first!.de).includes("DE-edit");

    await openSiteSelect(page, t.slug, "en");
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-AFTER-edit-site-en.png`),
      fullPage: true,
    });
    await openSiteSelect(page, t.slug, "ru");
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-AFTER-edit-site-ru.png`),
      fullPage: true,
    });

    row.pass =
      row.beforeBugVisible === true &&
      row.afterOpenPreserved === true &&
      row.afterSitePreserved === true &&
      row.afterEditPreserved === true;
    } catch (err) {
      row.pass = false;
      row.error = err instanceof Error ? err.message : String(err);
      await page.screenshot({
        path: path.join(OUT, `${t.sectorId}-ERROR.png`),
        fullPage: true,
      }).catch(() => undefined);
      console.error("ERROR", t.sectorId, row.error);
    } finally {
      await context.close();
    }

    report.push(row);
    console.log(
      JSON.stringify(
        {
          sectorId: t.sectorId,
          pass: row.pass,
          beforeBugVisible: row.beforeBugVisible,
          afterOpenPreserved: row.afterOpenPreserved,
          afterSitePreserved: row.afterSitePreserved,
          afterEditPreserved: row.afterEditPreserved,
          afterEditName: row.afterEditName,
          error: row.error,
        },
        null,
        2,
      ),
    );
  }

  await browser.close();
  const reportPath = path.join(process.cwd(), "docs/locale-preserve-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log("Wrote", reportPath, "screenshots →", OUT);
  const failed = report.filter((r) => !r.pass);
  if (failed.length) {
    console.error("FAILED", failed.map((r) => r.sectorId));
    process.exit(1);
  }
  console.log("ALL PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
