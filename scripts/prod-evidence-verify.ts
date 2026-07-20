/**
 * Production verification for dental / cafe / car_wash on Railway.
 * Usage: npx tsx scripts/prod-evidence-verify.ts
 */
import fs from "fs";
import path from "path";
import { chromium, type Frame, type Page } from "playwright";

const BASE = "https://saas-mvp-funnel-production.up.railway.app";
const OUT = path.join(process.cwd(), "docs/prod-evidence-screenshots");
const REPORT = path.join(process.cwd(), "docs/prod-evidence-report.json");

const TENANTS = [
  {
    sectorId: "dental",
    clientId: "fab4b137-0341-43da-9a5d-099297fcd92c",
    slug: "klinika-zub-bolit-fab4",
    site: `${BASE}/site/klinika-zub-bolit-fab4?lang=ru`,
    crm: `${BASE}/demo/klinika-zub-bolit-fab4?clientId=fab4b137-0341-43da-9a5d-099297fcd92c`,
    catalogTab: /Услуги|Services|Leistungen/i,
    addService: /Добавить услугу|Add Service|Leistung hinzufügen/i,
  },
  {
    sectorId: "cafe",
    clientId: "37a66e67-5ed3-4a83-99c4-e0508f8c77fe",
    slug: "kalinka-malinka-klnk",
    site: `${BASE}/site/kalinka-malinka-klnk?lang=ru`,
    crm: `${BASE}/demo/kalinka-malinka-klnk?clientId=37a66e67-5ed3-4a83-99c4-e0508f8c77fe`,
    catalogTab: /Меню|Menu|Speisekarte/i,
    addService: /Добавить|Add|Hinzufügen/i,
  },
  {
    sectorId: "car_wash",
    clientId: "404db994-66e1-4795-b419-d8e8e72bba38",
    slug: "avtomoyka-local-wash",
    site: `${BASE}/site/avtomoyka-local-wash?lang=ru`,
    crm: `${BASE}/demo/avtomoyka-local-wash?clientId=404db994-66e1-4795-b419-d8e8e72bba38`,
    catalogTab: /Услуги мойки|Wash Services|Waschleistungen/i,
    addService: /Добавить услугу|Add Service|Leistung hinzufügen/i,
  },
] as const;

const BANNED = ["Cleaning", "Уборка", "Клининг", "appointment", "Добавить приём"];

function normalizeList(items: string[]) {
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

async function catalogApi(clientId: string, lang: string) {
  const res = await fetch(
    `${BASE}/api/crm/catalog/${encodeURIComponent(clientId)}?lang=${lang}`,
    { cache: "no-store" },
  );
  const data = (await res.json()) as { names?: string[]; ok?: boolean };
  return {
    ok: res.ok && data.ok === true,
    names: Array.isArray(data.names) ? data.names : [],
  };
}

async function waitCrmFrame(page: Page): Promise<Frame> {
  await page.waitForSelector("iframe", { timeout: 60000 });
  for (let i = 0; i < 40; i++) {
    const fr = page.frames().find((f) => f !== page.mainFrame() && /pages\.dev|4173/.test(f.url()));
    if (fr) {
      try {
        await fr.waitForSelector("body", { timeout: 5000 });
        const text = await fr.locator("body").innerText({ timeout: 5000 });
        if (text && !/Loading CRM Demo/i.test(text) && text.length > 40) return fr;
      } catch {
        /* keep waiting */
      }
    }
    await page.waitForTimeout(1500);
  }
  throw new Error("CRM iframe not ready");
}

async function openSiteForm(page: Page) {
  await page.goto(page.url().includes("/site/") ? page.url() : page.url(), {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
}

async function ensureFormOpen(page: Page) {
  const select = page.locator("select");
  if ((await select.count()) > 0) return;
  const btn = page.getByRole("button").filter({
    hasText: /Записаться|Забронировать|Заказать мойку|Book|Reserve|buchen|reservieren/i,
  });
  if ((await btn.count()) > 0) {
    await btn.first().click();
  } else {
    await page.getByRole("button").first().click();
  }
  await page.waitForSelector("select", { timeout: 20000 });
}

async function formOptions(page: Page) {
  await ensureFormOpen(page);
  const opts = await page.locator("select option").allInnerTexts();
  return opts.filter((o) => o && !/^Select|Выбер|Auswählen|…|\.\.\./i.test(o.trim()));
}

async function crmCatalogNames(fr: Frame, tabRe: RegExp) {
  const tab = fr.getByRole("button", { name: tabRe });
  if ((await tab.count()) > 0) await tab.first().click();
  await fr.waitForTimeout(1200);
  const text = await fr.locator("body").innerText();
  // Prefer card titles under services/menu — fall back to API later for matching.
  return text;
}

function listsEqual(a: string[], b: string[]) {
  const aa = normalizeList(a);
  const bb = normalizeList(b);
  return aa.length === bb.length && aa.every((v, i) => v === bb[i]);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const report: Record<string, unknown> = {
    startedAt: new Date().toISOString(),
    base: BASE,
    tenants: {},
  };

  // 1–2: site+CRM + catalog 1:1 for each niche
  for (const t of TENANTS) {
    const row: Record<string, unknown> = {
      site: t.site,
      crm: t.crm,
    };
    const site = await context.newPage();
    await site.goto(t.site, { waitUntil: "domcontentloaded", timeout: 90000 });
    await site.waitForTimeout(2500);
    const formNames = await formOptions(site);
    await site.locator("select").screenshot({ path: path.join(OUT, `${t.sectorId}-site-select.png`) }).catch(async () => {
      await site.screenshot({ path: path.join(OUT, `${t.sectorId}-site-select.png`), fullPage: true });
    });
    await site.screenshot({ path: path.join(OUT, `${t.sectorId}-site.png`), fullPage: true });

    const api = await catalogApi(t.clientId, "ru");
    row.formNames = formNames;
    row.apiNames = api.names;
    row.formMatchesApi = listsEqual(formNames, api.names);

    const crmPage = await context.newPage();
    await crmPage.goto(t.crm, { waitUntil: "domcontentloaded", timeout: 90000 });
    await crmPage.waitForTimeout(3000);
    const fr = await waitCrmFrame(crmPage);
    await fr.getByRole("button", { name: "RU", exact: true }).click().catch(() => undefined);
    await crmPage.waitForTimeout(1000);
    await fr.getByRole("button", { name: t.catalogTab }).first().click().catch(() => undefined);
    await crmPage.waitForTimeout(1500);
    await crmPage.screenshot({ path: path.join(OUT, `${t.sectorId}-crm-catalog.png`), fullPage: true });
    const crmBody = await fr.locator("body").innerText();
    const crmHasAll = formNames.every((n) => crmBody.includes(n));
    row.crmHasAllFormItems = crmHasAll;
    row.catalog1to1 = row.formMatchesApi === true && crmHasAll === true;
    row.siteOk = true;
    row.crmOk = true;
    (report.tenants as Record<string, unknown>)[t.sectorId] = row;
    await site.close();
    await crmPage.close();
  }

  // 3: car_wash EN/DE/RU banned + labels
  const wash = TENANTS.find((t) => t.sectorId === "car_wash")!;
  const i18n: Record<string, unknown> = {};
  const crmPage = await context.newPage();
  await crmPage.goto(wash.crm, { waitUntil: "domcontentloaded", timeout: 90000 });
  const fr = await waitCrmFrame(crmPage);
  for (const lang of ["en", "de", "ru"] as const) {
    await fr.getByRole("button", { name: lang.toUpperCase(), exact: true }).click();
    await crmPage.waitForTimeout(1200);
    if (lang === "en") {
      await fr.getByRole("button", { name: /Wash Orders/i }).click().catch(() => undefined);
    } else if (lang === "de") {
      await fr.getByRole("button", { name: /Waschaufträge/i }).click().catch(() => undefined);
    } else {
      await fr.getByRole("button", { name: /Заказы на мойку/i }).click().catch(() => undefined);
    }
    await crmPage.waitForTimeout(1200);
    // Ensure add CTA is rendered on orders page
    await fr.getByRole("button", { name: /Add Wash Order|Waschauftrag hinzufügen|Добавить заказ на мойку/i }).first().waitFor({ timeout: 8000 }).catch(() => undefined);
    const body = await fr.locator("body").innerText();
    await crmPage.screenshot({
      path: path.join(OUT, `car_wash-crm-${lang}.png`),
      fullPage: true,
    });

    const site = await context.newPage();
    await site.goto(`${BASE}/site/${wash.slug}?lang=${lang}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await site.waitForTimeout(2000);
    const siteBody = await site.locator("body").innerText();
    await site.screenshot({ path: path.join(OUT, `car_wash-site-${lang}.png`), fullPage: true });
    await site.close();

    const expect =
      lang === "en"
        ? {
            niche: /Car Wash/i,
            orders: /Wash Orders/i,
            services: /Wash Services/i,
            cta: /Add Wash Order/i,
          }
        : lang === "de"
          ? {
              niche: /Autowäsche/i,
              orders: /Waschaufträge/i,
              services: /Waschleistungen/i,
              cta: /Waschauftrag hinzufügen/i,
            }
          : {
              niche: /Автомойка/i,
              orders: /Заказы на мойку/i,
              services: /Услуги мойки/i,
              cta: /Добавить заказ на мойку/i,
            };

    const bannedHits = BANNED.filter((b) => body.includes(b) || siteBody.includes(b));
    i18n[lang] = {
      crmExpect: {
        niche: expect.niche.test(body),
        orders: expect.orders.test(body),
        services: expect.services.test(body),
        cta: expect.cta.test(body),
      },
      siteHasNiche: expect.niche.test(siteBody),
      bannedHits,
      pass:
        expect.niche.test(body) &&
        expect.orders.test(body) &&
        expect.services.test(body) &&
        expect.cta.test(body) &&
        expect.niche.test(siteBody) &&
        bannedHits.length === 0,
    };
  }
  report.car_wash_i18n = i18n;

  // 4: real CRM UI Add Service → open site form without reload
  const unique = `PROD-UI-CW-${Date.now().toString().slice(-5)}`;
  await fr.getByRole("button", { name: "EN", exact: true }).click();
  await crmPage.waitForTimeout(800);
  await fr.getByRole("button", { name: /Wash Services/i }).click();
  await crmPage.waitForTimeout(1000);
  await crmPage.screenshot({ path: path.join(OUT, "car_wash-crm-ui-before-add.png"), fullPage: true });

  const siteLive = await context.newPage();
  await siteLive.goto(`${BASE}/site/${wash.slug}?lang=en`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await siteLive.waitForTimeout(2500);
  await ensureFormOpen(siteLive);
  const before = await formOptions(siteLive);
  await siteLive.screenshot({ path: path.join(OUT, "car_wash-site-live-before.png"), fullPage: true });

  // Real UI path: Add Service → fill → Save (inside CRM iframe)
  await fr.getByRole("button", { name: /Add Service/i }).click();
  await crmPage.waitForTimeout(800);
  const inputs = fr.locator("input");
  await inputs.nth(0).fill(unique);
  if ((await inputs.count()) > 1) await inputs.nth(1).fill("€77");
  if ((await inputs.count()) > 2) await inputs.nth(2).fill("17 min");
  await fr.getByRole("button", { name: /^Save$|Сохранить|Speichern/i }).first().click();
  await crmPage.waitForTimeout(2500);
  await crmPage.screenshot({ path: path.join(OUT, "car_wash-crm-ui-after-add.png"), fullPage: true });

  let after: string[] = before;
  let appeared = false;
  for (let i = 0; i < 15; i++) {
    after = await formOptions(siteLive);
    if (after.includes(unique)) {
      appeared = true;
      break;
    }
    await siteLive.waitForTimeout(2000);
  }
  if (appeared) {
    await siteLive.locator("select").selectOption({ label: unique }).catch(async () => {
      await siteLive.locator("select").selectOption(unique);
    });
  }
  await siteLive.screenshot({ path: path.join(OUT, "car_wash-site-live-after-add.png"), fullPage: true });

  const apiAfter = await catalogApi(wash.clientId, "en");
  report.uiSync = {
    unique,
    before,
    after,
    appearedInOpenForm: appeared,
    appearedInApi: apiAfter.names.includes(unique),
    via: "crm_ui_add_service_button",
    pass: appeared === true && apiAfter.names.includes(unique),
  };

  // Summary table
  const tenants = report.tenants as Record<string, Record<string, unknown>>;
  report.summary = {
    dental_site_crm: tenants.dental?.siteOk && tenants.dental?.crmOk ? "PASS" : "FAIL",
    cafe_site_crm: tenants.cafe?.siteOk && tenants.cafe?.crmOk ? "PASS" : "FAIL",
    car_wash_site_crm: tenants.car_wash?.siteOk && tenants.car_wash?.crmOk ? "PASS" : "FAIL",
    dental_catalog_1to1: tenants.dental?.catalog1to1 ? "PASS" : "FAIL",
    cafe_catalog_1to1: tenants.cafe?.catalog1to1 ? "PASS" : "FAIL",
    car_wash_catalog_1to1: tenants.car_wash?.catalog1to1 ? "PASS" : "FAIL",
    car_wash_i18n_en: (i18n.en as { pass?: boolean })?.pass ? "PASS" : "FAIL",
    car_wash_i18n_de: (i18n.de as { pass?: boolean })?.pass ? "PASS" : "FAIL",
    car_wash_i18n_ru: (i18n.ru as { pass?: boolean })?.pass ? "PASS" : "FAIL",
    ui_sync_no_reload: (report.uiSync as { pass?: boolean })?.pass ? "PASS" : "FAIL",
  };
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary, null, 2));
  console.log("uiSync", JSON.stringify(report.uiSync, null, 2));
  console.log("Wrote", REPORT);
  await browser.close();

  const fails = Object.values(report.summary as Record<string, string>).filter((v) => v === "FAIL");
  if (fails.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
