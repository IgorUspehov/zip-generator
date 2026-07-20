/**
 * Robust local evidence (API + Playwright screenshots).
 * Dynamic catalog: mutate via CRM iframe when possible; always verify via shared catalog API + /site HTML.
 */
import { chromium, type Page, type Frame } from "playwright";
import fs from "fs";
import path from "path";
import { resolvePersistentDataDir } from "../src/lib/site-delivery/data-dir";

const BASE = "http://127.0.0.1:3000";
const DATA = resolvePersistentDataDir();
const OUT = path.join(process.cwd(), "docs/local-evidence-screenshots");
const REPORT = path.join(process.cwd(), "docs/local-evidence-report.json");
fs.mkdirSync(OUT, { recursive: true });

const tenants = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "docs/local-evidence-tenants.json"), "utf8"),
) as Array<{
  sectorId: string;
  clientId: string;
  slug: string;
  site: string;
  crm: string;
  mode: string;
}>;

function secretFor(clientId: string) {
  const m = JSON.parse(fs.readFileSync(path.join(DATA, "manifests", `${clientId}.json`), "utf8")) as {
    leadsReadSecret?: string;
  };
  return m.leadsReadSecret || "";
}

async function catalogNames(clientId: string, lang = "ru") {
  const res = await fetch(`${BASE}/api/crm/catalog/${clientId}?lang=${lang}`);
  const j = (await res.json()) as { names?: string[] };
  return j.names || [];
}

async function putCatalog(clientId: string, names: string[]) {
  const items = names.map((name, index) => ({
    id: `rec-ev-${Date.now()}-${index}`,
    name: { en: name, de: name, ru: name },
  }));
  const res = await fetch(`${BASE}/api/crm/catalog/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CRM-Secret": secretFor(clientId),
    },
    body: JSON.stringify({ items }),
  });
  return res.status;
}

async function goto(page: Page, url: string) {
  await page.goto(url, { waitUntil: "commit", timeout: 60000 });
  await page.waitForLoadState("domcontentloaded", { timeout: 60000 }).catch(() => undefined);
  await page.waitForTimeout(800);
}

async function openForm(page: Page) {
  await page.waitForSelector("section.mt-10 button", { timeout: 20000 });
  await page.locator("section.mt-10 button").first().click();
  await page.waitForSelector("section.mt-10 select", { timeout: 15000 });
}

async function formOptions(page: Page) {
  const opts = await page.locator("section.mt-10 select option").allTextContents();
  return opts.map((o) => o.trim()).filter((o) => o && !/Выберите|Select|Auswählen/i.test(o));
}

async function expandSelect(page: Page) {
  await page.locator("section.mt-10 select").evaluate((el: HTMLSelectElement) => {
    el.size = Math.min(Math.max(el.options.length, 3), 12);
  });
}

async function crmFrame(page: Page): Promise<Frame> {
  await page.waitForSelector("iframe", { timeout: 30000 });
  await page.waitForTimeout(3500);
  const fr = page.frames().find((f) => /4173|clientId=/.test(f.url()));
  if (!fr) throw new Error("no crm frame");
  return fr;
}

async function clickTab(frame: Frame, re: RegExp) {
  const nodes = frame.locator("button, a, [role='button'], .nav-item, li, span");
  const n = await nodes.count();
  for (let i = 0; i < n; i++) {
    const t = ((await nodes.nth(i).textContent()) || "").trim();
    if (re.test(t) && t.length < 48) {
      await nodes.nth(i).click({ timeout: 3000 }).catch(() => undefined);
      await frame.page().waitForTimeout(900);
      return t;
    }
  }
  return "";
}

async function addServiceUi(frame: Frame, name: string) {
  const add = frame.locator("button").filter({ hasText: /Добавить услугу|Add Service|Leistung hinzufügen|Добавить/i });
  await add.first().click({ timeout: 5000 });
  await frame.page().waitForTimeout(600);
  const inputs = frame.locator("input");
  await inputs.nth(0).fill(name);
  const save = frame.locator("button").filter({ hasText: /Сохранить|Save|Speichern|Добавить/i });
  await save.last().click();
  await frame.page().waitForTimeout(2000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const report: Record<string, unknown> = {
    startedAt: new Date().toISOString(),
    dataDir: DATA,
    base: BASE,
    tenants: {},
  };

  for (const t of tenants) {
    console.log("===", t.sectorId);
    const row: Record<string, unknown> = {
      ...t,
      checks: {},
    };

    // 1) Site select screenshot + list
    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    await expandSelect(page);
    const formRu = await formOptions(page);
    const sharedRu = await catalogNames(t.clientId, "ru");
    row.formOptionsRu = formRu;
    row.sharedCatalogRu = sharedRu;
    row.matchFormShared = JSON.stringify(formRu) === JSON.stringify(sharedRu);
    const siteShot = path.join(OUT, `${t.sectorId}-site-select-ru.png`);
    await page.locator("section.mt-10").screenshot({ path: siteShot });
    row.shotSiteSelectRu = siteShot;

    // 2) CRM catalog screenshot
    await goto(page, t.crm);
    let frame: Frame | null = null;
    try {
      frame = await crmFrame(page);
    } catch (e) {
      row.crmFrameError = String(e);
    }
    const tabRe =
      t.sectorId === "cafe"
        ? /Меню|Menu|Speisekarte/i
        : t.sectorId === "car_wash"
          ? /Услуги мойки|Wash Services|Waschleistungen|Услуги|Services|Leistungen/i
          : /Услуги|Services|Leistungen/i;
    if (frame) {
      row.crmTab = await clickTab(frame, tabRe);
      await page.waitForTimeout(1500);
    }
    const crmShot = path.join(OUT, `${t.sectorId}-crm-catalog-ru.png`);
    await page.screenshot({ path: crmShot, fullPage: false });
    row.shotCrmCatalogRu = crmShot;
    // Extract visible names from CRM body intersecting shared catalog
    if (frame) {
      const body = await frame.locator("body").innerText();
      row.crmVisibleSharedIntersection = sharedRu.filter((n) => body.includes(n));
      row.crmShowsAllShared = sharedRu.every((n) => body.includes(n));
    }

    // 3) car_wash i18n
    if (t.sectorId === "car_wash") {
      const i18n: Record<string, unknown> = {};
      for (const lang of ["en", "de", "ru"] as const) {
        await goto(page, `${BASE}/site/${t.slug}?lang=${lang}`);
        const text = await page.locator("main").innerText();
        const shot = path.join(OUT, `car_wash-site-${lang}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        const banned = ["Уборки", "Клининг", "Cleaning Service", "Добавить приём", "Reinigungsservice"];
        i18n[`site_${lang}`] = {
          shot,
          niche:
            lang === "ru" ? /Автомойка/.test(text) : lang === "de" ? /Autowäsche/.test(text) : /Car Wash/.test(text),
          cta:
            lang === "ru"
              ? /Заказать мойку|Записаться/.test(text)
              : lang === "de"
                ? /Wäsche buchen|Termin/.test(text)
                : /Book a wash|Book now/.test(text),
          bannedHits: banned.filter((b) => text.includes(b)),
          snippet: text.replace(/\s+/g, " ").slice(0, 240),
        };
      }
      for (const lang of ["en", "de", "ru"] as const) {
        await goto(page, `${t.crm}`);
        frame = await crmFrame(page);
        await clickTab(frame, new RegExp(`^${lang}$`, "i"));
        // also try settings language if present
        const switcher = frame.locator("button, select").filter({ hasText: new RegExp(`^${lang}$`, "i") });
        if (await switcher.count()) await switcher.first().click().catch(() => undefined);
        await page.waitForTimeout(1200);
        const crmText = await frame.locator("body").innerText();
        const shot = path.join(OUT, `car_wash-crm-${lang}.png`);
        await page.screenshot({ path: shot, fullPage: false });
        const expect =
          lang === "ru"
            ? ["Автомойка", "Заказы на мойку", "Услуги мойки", "Сотрудники"]
            : lang === "de"
              ? ["Autowäsche", "Waschaufträge", "Waschleistungen", "Mitarbeiter"]
              : ["Car Wash", "Wash Orders", "Wash Services", "Employees"];
        i18n[`crm_${lang}`] = {
          shot,
          expect: expect.map((e) => ({ e, ok: crmText.includes(e) })),
          bannedHits: ["Уборки", "Клининг", "Cleaning Service", "Добавить приём"].filter((b) =>
            crmText.includes(b),
          ),
          addCta:
            lang === "ru"
              ? crmText.includes("Добавить заказ на мойку")
              : lang === "de"
                ? crmText.includes("Waschauftrag hinzufügen")
                : crmText.includes("Add Wash Order"),
        };
      }
      row.i18n = i18n;
    }

    // 4) Dynamic catalog — prefer CRM UI; fallback authenticated API (same shared store the site reads)
    const unique = `EVIDENCE-${t.sectorId.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const before = await catalogNames(t.clientId, "ru");
    const dyn: Record<string, unknown> = {
      unique,
      before,
      beforeAt: new Date().toISOString(),
    };

    await goto(page, t.crm);
    frame = await crmFrame(page);
    await clickTab(frame, tabRe);
    await page.screenshot({ path: path.join(OUT, `${t.sectorId}-crm-before-add.png`), fullPage: false });
    dyn.shotCrmBefore = path.join(OUT, `${t.sectorId}-crm-before-add.png`);

    let via = "ui";
    try {
      await addServiceUi(frame, unique);
      await page.waitForTimeout(2500);
      const afterUi = await catalogNames(t.clientId, "ru");
      if (!afterUi.includes(unique)) throw new Error("UI add did not sync to shared catalog");
      dyn.afterAddShared = afterUi;
    } catch (e) {
      via = "api_fallback_same_store";
      dyn.uiError = String(e);
      // Simulate CRM→bridge PUT using the same endpoint CRM parent uses
      await putCatalog(t.clientId, [...before, unique]);
      dyn.afterAddShared = await catalogNames(t.clientId, "ru");
    }
    dyn.via = via;
    dyn.addedInShared = (dyn.afterAddShared as string[]).includes(unique);
    dyn.afterAddAt = new Date().toISOString();

    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    await expandSelect(page);
    const afterForm = await formOptions(page);
    dyn.afterAddForm = afterForm;
    dyn.addedInForm = afterForm.includes(unique);
    dyn.afterAddSiteUrl = `${BASE}/site/${t.slug}?lang=ru`;
    await page.locator("section.mt-10").screenshot({
      path: path.join(OUT, `${t.sectorId}-site-after-add.png`),
    });
    dyn.shotSiteAfterAdd = path.join(OUT, `${t.sectorId}-site-after-add.png`);

    // delete
    const afterAdd = dyn.afterAddShared as string[];
    await putCatalog(
      t.clientId,
      afterAdd.filter((n) => n !== unique),
    );
    // Also try UI delete path when CRM still open
    dyn.afterDelAt = new Date().toISOString();
    const afterDelShared = await catalogNames(t.clientId, "ru");
    dyn.afterDelShared = afterDelShared;
    dyn.removedFromShared = !afterDelShared.includes(unique);

    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    await expandSelect(page);
    const afterDelForm = await formOptions(page);
    dyn.afterDelForm = afterDelForm;
    dyn.removedFromForm = !afterDelForm.includes(unique);
    await page.locator("section.mt-10").screenshot({
      path: path.join(OUT, `${t.sectorId}-site-after-del.png`),
    });
    dyn.shotSiteAfterDel = path.join(OUT, `${t.sectorId}-site-after-del.png`);
    row.dynamic = dyn;

    // 5) Lead submit
    const leadName = `Evidence Lead ${t.sectorId} ${Date.now().toString().slice(-4)}`;
    const leadPhone = `+49171${String(Date.now()).slice(-8)}`;
    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    await page.locator("section.mt-10 input").nth(0).fill(leadName);
    await page.locator("section.mt-10 input").nth(1).fill(leadPhone);
    if (afterDelForm.length) await page.locator("section.mt-10 select").selectOption({ index: 1 }).catch(() => undefined);
    await page.locator('section.mt-10 button[type="submit"]').click();
    await page.waitForTimeout(2500);
    const formText = await page.locator("section.mt-10").innerText();
    const leadsFile = path.join(DATA, "leads", `${t.clientId}.json`);
    let leadStore: Record<string, unknown> | null = null;
    if (fs.existsSync(leadsFile)) {
      const leads = JSON.parse(fs.readFileSync(leadsFile, "utf8")) as {
        clients?: Array<{ name: string }>;
        appointments?: Array<{ client: string; kind?: string; service?: string }>;
        orders?: Array<{ client: string; item?: string }>;
      };
      leadStore = {
        clientFound: (leads.clients || []).some((c) => c.name === leadName),
        appointment: (leads.appointments || []).find((a) => a.client === leadName) || null,
        order: (leads.orders || []).find((o) => o.client === leadName) || null,
      };
    }
    row.lead = {
      name: leadName,
      phone: leadPhone,
      uiSuccess: /Спасибо|получена|Thank you|Danke/i.test(formText),
      expectedMode: t.mode,
      store: leadStore,
    };

    await goto(page, t.crm);
    frame = await crmFrame(page);
    const bookingRe =
      t.sectorId === "cafe"
        ? /Бронирован|Reserv/i
        : t.sectorId === "car_wash"
          ? /Заказы на мойку|Wash Orders|Waschaufträge|Записи|Appoint|Приём/i
          : /Приём|Appoint|Termin|Записи/i;
    await clickTab(frame, bookingRe);
    await page.waitForTimeout(2000);
    // patients/clients tab too
    await clickTab(frame, t.sectorId === "dental" ? /Пациент|Patient/i : /Клиент|Customer|Guest|Гост/i);
    await page.waitForTimeout(1000);
    const crmText = await frame.locator("body").innerText();
    row.leadInCrmUi = crmText.includes(leadName);
    await page.screenshot({ path: path.join(OUT, `${t.sectorId}-crm-after-lead.png`), fullPage: false });
    row.shotCrmAfterLead = path.join(OUT, `${t.sectorId}-crm-after-lead.png`);

    (report.tenants as Record<string, unknown>)[t.sectorId] = row;
    fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
    console.log(
      JSON.stringify({
        sector: t.sectorId,
        match: row.matchFormShared,
        crmShows: row.crmShowsAllShared,
        added: dyn.addedInForm,
        removed: dyn.removedFromForm,
        via: dyn.via,
        lead: (row.lead as { uiSuccess?: boolean }).uiSuccess,
        leadStore,
      }),
    );
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log("WROTE", REPORT);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
