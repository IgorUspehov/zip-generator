/**
 * Prod isolation + locale-preserve smoke (screenshots).
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "https://saas-mvp-funnel-production.up.railway.app";
const OUT = path.join(process.cwd(), "docs/locale-preserve-screenshots");
fs.mkdirSync(OUT, { recursive: true });

const dental = {
  slug: "klinika-zub-bolit-fab4",
  clientId: "fab4b137-0341-43da-9a5d-099297fcd92c",
  expectName: /Зуб|Dental|Zahn/i,
  expectNot: /Калинка|Малинка|Local Wash|Автомойка/i,
};
const cafe = {
  slug: "kalinka-malinka-klnk",
  clientId: "37a66e67-5ed3-4a83-99c4-e0508f8c77fe",
  expectName: /Калинка|Малинка|Kalinka/i,
  expectNot: /Зуб болит|Dental Check|Local Wash|Автомойка/i,
};

async function openDemo(page: import("playwright").Page, t: typeof dental) {
  await page.goto(`${BASE}/demo/${t.slug}?clientId=${t.clientId}&lang=de`, {
    waitUntil: "commit",
    timeout: 90000,
  });
  await page.waitForSelector("iframe", { timeout: 45000 });
  await page.waitForTimeout(8000);
  const fr = page.frames().find((f) => f.url().includes("crm-demo-sites.pages.dev"));
  if (!fr) throw new Error(`no CRM iframe for ${t.slug}: ${page.frames().map((f) => f.url()).join(" | ")}`);
  await fr.waitForSelector("aside, .app-shell", { timeout: 45000 });
  await page.waitForTimeout(1500);
  const text = await fr.locator("body").innerText();
  return { fr, text, iframeUrl: fr.url() };
}

async function catalogApi(clientId: string, lang: string) {
  const res = await fetch(`${BASE}/api/crm/catalog/${clientId}?lang=${lang}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as {
    names?: string[];
    items?: Array<{ name: { en?: string; de?: string; ru?: string } }>;
  };
  return data;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report: Record<string, unknown> = {};

  // --- 1) Isolation: two contexts (separate tabs/sessions) ---
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  const a = await openDemo(pageA, dental);
  const b = await openDemo(pageB, cafe);

  report.dentalIframe = a.iframeUrl;
  report.cafeIframe = b.iframeUrl;
  report.dentalHasOwnName = dental.expectName.test(a.text);
  report.cafeHasOwnName = cafe.expectName.test(b.text);
  report.dentalNoCafeLeak = !dental.expectNot.test(a.text);
  report.cafeNoDentalLeak = !cafe.expectNot.test(b.text);

  await pageA.screenshot({
    path: path.join(OUT, "prod-isolation-dental.png"),
    fullPage: true,
  });
  await pageB.screenshot({
    path: path.join(OUT, "prod-isolation-cafe.png"),
    fullPage: true,
  });

  // Same browser origin, different clientId in URL — also open cafe in pageA's sibling tab
  const pageA2 = await ctxA.newPage();
  const a2 = await openDemo(pageA2, cafe);
  report.sameOriginSecondTabOwnName = cafe.expectName.test(a2.text);
  report.sameOriginSecondTabNoDental = !cafe.expectNot.test(a2.text);
  await pageA2.screenshot({
    path: path.join(OUT, "prod-isolation-cafe-same-origin-tab.png"),
    fullPage: true,
  });

  // --- 2) Locale preserve on prod: restore already done; open CRM DE then re-check ---
  // Clear stale collapsed CRM services in the shared Pages origin, then reload.
  await pageA.goto(`${BASE}/demo/${dental.slug}?clientId=${dental.clientId}&lang=de`, {
    waitUntil: "commit",
    timeout: 90000,
  });
  await pageA.waitForSelector("iframe", { timeout: 45000 });
  await pageA.waitForTimeout(5000);
  let frDental = pageA.frames().find((f) => f.url().includes("crm-demo-sites.pages.dev"));
  if (!frDental) throw new Error("no dental CRM frame before locale check");
  await frDental.evaluate((clientId) => {
    try {
      localStorage.removeItem(`mvp_crm:${clientId}:services`);
    } catch {
      /* ignore */
    }
    location.reload();
  }, dental.clientId);
  await pageA.waitForTimeout(8000);
  frDental = pageA.frames().find((f) => f.url().includes("crm-demo-sites.pages.dev"));
  if (frDental) {
    await frDental.waitForSelector("aside button", { timeout: 30000 }).catch(() => undefined);
    const tab = frDental.locator("aside button").filter({ hasText: /Leistungen|Services|Услуги/i }).first();
    if (await tab.count()) {
      await tab.click();
      await pageA.waitForTimeout(3000);
    }
  }
  await pageA.screenshot({
    path: path.join(OUT, "prod-locale-dental-crm-de-services.png"),
    fullPage: true,
  });
  await pageA.waitForTimeout(2500);

  // Re-seed server catalog in case prior sync wiped it, then CRM open again after clean storage.
  // (API check below is the source of truth after the DE services visit.)
  const dentalCatalog = await catalogApi(dental.clientId, "en");
  const dentalRu = await catalogApi(dental.clientId, "ru");
  const dentalDe = await catalogApi(dental.clientId, "de");
  report.dentalCatalog = {
    en: dentalCatalog.names,
    de: dentalDe.names,
    ru: dentalRu.names,
    first: dentalCatalog.items?.[0]?.name,
  };
  const enOk = (dentalCatalog.names || []).some((n) => /Dental|Check|Cleaning|Root/i.test(n));
  const ruOk = (dentalRu.names || []).some((n) => /Осмотр|Чистка|канал/i.test(n));
  const deOk = (dentalDe.names || []).some((n) => /Zahn|Wurzel/i.test(n));
  const notCollapsed =
    JSON.stringify(dentalCatalog.names) !== JSON.stringify(dentalDe.names) &&
    JSON.stringify(dentalRu.names) !== JSON.stringify(dentalDe.names);
  report.localeApiPass = enOk && ruOk && deOk && notCollapsed;

  // Site EN select after CRM-capable catalog
  await pageA.goto(`${BASE}/site/${dental.slug}?lang=en`, {
    waitUntil: "commit",
    timeout: 90000,
  });
  await pageA.waitForTimeout(1500);
  await pageA.locator("section.mt-10 button").first().click({ timeout: 20000 });
  await pageA.waitForSelector("section.mt-10 select", { timeout: 15000 });
  await pageA.locator("section.mt-10 select").evaluate((el: HTMLSelectElement) => {
    el.size = Math.min(el.options.length, 12);
  });
  const siteEnOpts = (await pageA.locator("section.mt-10 select option").allTextContents())
    .map((x) => x.trim())
    .filter((x) => x && !/Select|Выберите|Auswählen/i.test(x));
  report.siteEnOpts = siteEnOpts;
  report.siteEnHasEnglish = siteEnOpts.some((n) => /Dental|Cleaning|Root/i.test(n));
  report.siteEnNotGermanOnly = !siteEnOpts.every((n) => /Zahn|Wurzel|Reinigung/i.test(n));
  await pageA.screenshot({
    path: path.join(OUT, "prod-locale-dental-site-en.png"),
    fullPage: true,
  });

  await pageB.goto(`${BASE}/site/${cafe.slug}?lang=ru`, {
    waitUntil: "commit",
    timeout: 90000,
  });
  await pageB.waitForTimeout(1500);
  await pageB.locator("section.mt-10 button").first().click({ timeout: 20000 });
  await pageB.waitForSelector("section.mt-10 select", { timeout: 15000 });
  await pageB.locator("section.mt-10 select").evaluate((el: HTMLSelectElement) => {
    el.size = Math.min(el.options.length, 12);
  });
  const siteRuOpts = (await pageB.locator("section.mt-10 select option").allTextContents())
    .map((x) => x.trim())
    .filter((x) => x && !/Select|Выберите|Auswählen/i.test(x));
  report.siteRuCafeOpts = siteRuOpts;
  await pageB.screenshot({
    path: path.join(OUT, "prod-locale-cafe-site-ru.png"),
    fullPage: true,
  });

  report.isolationPass =
    report.dentalHasOwnName === true &&
    report.cafeHasOwnName === true &&
    report.dentalNoCafeLeak === true &&
    report.cafeNoDentalLeak === true &&
    report.sameOriginSecondTabOwnName === true &&
    report.sameOriginSecondTabNoDental === true;

  report.pass = report.isolationPass === true && report.localeApiPass === true && report.siteEnHasEnglish === true;

  await browser.close();
  const outPath = path.join(OUT, "prod-isolation-locale-report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
