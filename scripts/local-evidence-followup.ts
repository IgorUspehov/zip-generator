/**
 * Follow-up evidence: clean catalogs, CRM service tabs, dynamic shared store, leads, car_wash i18n.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { resolvePersistentDataDir } from "../src/lib/site-delivery/data-dir";
import { buildCatalogSeed } from "../src/lib/catalog/resolve-catalog";
import { replaceFileCatalogItems } from "../src/lib/catalog/file-catalog";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";

const BASE = "http://127.0.0.1:3000";
const DATA = resolvePersistentDataDir();
const OUT = path.join(process.cwd(), "docs/local-evidence-screenshots");
const tenants = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "docs/local-evidence-tenants.json"), "utf8"),
) as Array<{
  sectorId: keyof typeof SECTOR_MODELS;
  clientId: string;
  slug: string;
  crm: string;
}>;

function secret(id: string) {
  return (
    JSON.parse(fs.readFileSync(path.join(DATA, "manifests", `${id}.json`), "utf8")) as {
      leadsReadSecret?: string;
    }
  ).leadsReadSecret;
}

async function names(id: string) {
  return (
    ((await (await fetch(`${BASE}/api/crm/catalog/${id}?lang=ru`)).json()) as { names?: string[] })
      .names || []
  );
}

async function put(id: string, list: string[]) {
  const items = list.map((name, i) => ({
    id: `rec-${Date.now()}-${i}`,
    name: { en: name, de: name, ru: name },
  }));
  await fetch(`${BASE}/api/crm/catalog/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-CRM-Secret": secret(id) || "" },
    body: JSON.stringify({ items }),
  });
}

async function goto(page: import("playwright").Page, url: string) {
  await page.goto(url, { waitUntil: "commit", timeout: 60000 });
  await page.waitForLoadState("domcontentloaded").catch(() => undefined);
  await page.waitForTimeout(1000);
}

async function openForm(page: import("playwright").Page) {
  await page.waitForSelector("section.mt-10 button", { timeout: 20000 });
  await page.locator("section.mt-10 button").first().click();
  await page.waitForSelector("section.mt-10 select");
  await page.locator("section.mt-10 select").evaluate((el: HTMLSelectElement) => {
    el.size = Math.min(el.options.length, 12);
  });
}

async function opts(page: import("playwright").Page) {
  return (await page.locator("section.mt-10 select option").allTextContents())
    .map((x) => x.trim())
    .filter((x) => x && !/Выберите|Select|Auswählen/i.test(x));
}

async function frame(page: import("playwright").Page) {
  await page.waitForSelector("iframe", { timeout: 30000 });
  await page.waitForTimeout(4000);
  const f = page.frames().find((fr) => /4173|clientId=/.test(fr.url()));
  if (!f) throw new Error("no frame");
  return f;
}

async function clickText(fr: import("playwright").Frame, re: RegExp) {
  const nodes = fr.locator("button, a, [role=button], li, span, div");
  const n = await nodes.count();
  for (let i = 0; i < n; i++) {
    const t = ((await nodes.nth(i).textContent()) || "").trim();
    if (re.test(t) && t.length < 40) {
      await nodes.nth(i).click({ timeout: 2000 }).catch(() => undefined);
      await fr.page().waitForTimeout(1000);
      return t;
    }
  }
  return "";
}

async function main() {
  const report: Record<string, unknown> = {
    startedAt: new Date().toISOString(),
    dataDir: DATA,
    steps: {},
  };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

  for (const t of tenants) {
    const model = SECTOR_MODELS[t.sectorId];
    replaceFileCatalogItems(t.clientId, buildCatalogSeed(model));
    const seed = await names(t.clientId);
    console.log("reset", t.sectorId, seed);

    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    const form1 = await opts(page);
    await page
      .locator("section.mt-10")
      .screenshot({ path: path.join(OUT, `${t.sectorId}-site-select-ru.png`) });

    await goto(page, t.crm);
    const fr = await frame(page);
    await clickText(fr, /RU|^ru$/i);
    const tabRe =
      t.sectorId === "cafe"
        ? /Меню|Menu|Speisekarte/i
        : t.sectorId === "car_wash"
          ? /Услуги мойки|Wash Services|Waschleistungen|^Услуги$|Services|Leistungen/i
          : /^Услуги$|Services|Leistungen/i;
    const tab = await clickText(fr, tabRe);
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-crm-catalog-ru.png`),
      fullPage: false,
    });
    const crmBody = await fr.locator("body").innerText();
    const crmHasAll = seed.every((n) => crmBody.includes(n));

    const unique = `LIVE-${String(t.sectorId).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    let via = "ui";
    try {
      const addBtn = fr
        .locator("button")
        .filter({ hasText: /Добавить услугу|Add Service|Leistung hinzufügen|Добавить/i });
      await addBtn.first().click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await fr.locator("input").nth(0).fill(unique);
      await fr
        .locator("button")
        .filter({ hasText: /Сохранить|Save|Speichern|Добавить/i })
        .last()
        .click();
      await page.waitForTimeout(3000);
      const after = await names(t.clientId);
      if (!after.includes(unique)) throw new Error(`not synced: ${JSON.stringify(after)}`);
    } catch (e) {
      via = "api_same_store";
      (report as { uiErrors?: Record<string, string> }).uiErrors = {
        ...((report as { uiErrors?: Record<string, string> }).uiErrors || {}),
        [t.sectorId]: String(e),
      };
      await put(t.clientId, [...seed, unique]);
    }

    const afterAdd = await names(t.clientId);
    const afterAddAt = new Date().toISOString();
    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    const formAdd = await opts(page);
    await page
      .locator("section.mt-10")
      .screenshot({ path: path.join(OUT, `${t.sectorId}-site-after-add.png`) });

    await put(
      t.clientId,
      afterAdd.filter((n) => n !== unique),
    );
    const afterDelAt = new Date().toISOString();
    const afterDel = await names(t.clientId);
    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    const formDel = await opts(page);
    await page
      .locator("section.mt-10")
      .screenshot({ path: path.join(OUT, `${t.sectorId}-site-after-del.png`) });

    const leadName = `Lead ${t.sectorId} ${Date.now().toString().slice(-4)}`;
    const phone = `+49172${String(Date.now()).slice(-8)}`;
    await goto(page, `${BASE}/site/${t.slug}?lang=ru`);
    await openForm(page);
    await page.locator("section.mt-10 input").nth(0).fill(leadName);
    await page.locator("section.mt-10 input").nth(1).fill(phone);
    if (formDel.length) {
      await page.locator("section.mt-10 select").selectOption({ index: 1 }).catch(() => undefined);
    }
    await page.locator("section.mt-10 button[type=submit]").click();
    await page.waitForTimeout(3000);
    const formText = await page.locator("section.mt-10").innerText();
    const leadsPath = path.join(DATA, "leads", `${t.clientId}.json`);
    let store: Record<string, unknown> | null = null;
    if (fs.existsSync(leadsPath)) {
      const L = JSON.parse(fs.readFileSync(leadsPath, "utf8")) as {
        clients?: Array<{ name: string }>;
        appointments?: Array<{ client: string; kind?: string }>;
        orders?: Array<{ client: string }>;
      };
      store = {
        client: (L.clients || []).find((c) => c.name === leadName) || null,
        appointment: (L.appointments || []).find((a) => a.client === leadName) || null,
        order: (L.orders || []).find((o) => o.client === leadName) || null,
      };
    }

    await goto(page, t.crm);
    const fr2 = await frame(page);
    await clickText(
      fr2,
      t.sectorId === "dental" ? /Пациент|Patient/i : /Клиент|Customer|Гост|Guest/i,
    );
    await page.waitForTimeout(1500);
    await clickText(
      fr2,
      t.sectorId === "cafe"
        ? /Бронирован|Reserv/i
        : t.sectorId === "car_wash"
          ? /Заказы на мойку|Wash Orders|Waschaufträge|Приём|Appoint|Записи/i
          : /Приём|Appoint|Termin/i,
    );
    await page.waitForTimeout(4000);
    const body2 = await fr2.locator("body").innerText();
    await page.screenshot({
      path: path.join(OUT, `${t.sectorId}-crm-after-lead.png`),
      fullPage: false,
    });

    (report.steps as Record<string, unknown>)[t.sectorId] = {
      seed,
      form1,
      matchSeed: JSON.stringify(form1) === JSON.stringify(seed),
      crmTab: tab,
      crmHasAll,
      unique,
      via,
      afterAdd,
      formAdd,
      addedInForm: formAdd.includes(unique),
      afterAddAt,
      afterDel,
      formDel,
      removedFromForm: !formDel.includes(unique),
      afterDelAt,
      lead: {
        name: leadName,
        phone,
        uiSuccess: /Спасибо|получена|Thank you|Danke/i.test(formText),
        store,
        inCrmUi: body2.includes(leadName),
      },
      urls: { site: `${BASE}/site/${t.slug}?lang=ru`, crm: t.crm },
    };
    console.log(
      JSON.stringify({
        sector: t.sectorId,
        match: form1.join("|") === seed.join("|"),
        crmHasAll,
        via,
        added: formAdd.includes(unique),
        removed: !formDel.includes(unique),
        lead: /Спасибо|получена/i.test(formText),
        kind:
          (store?.appointment as { kind?: string } | null)?.kind ||
          (store?.order ? "order" : null),
      }),
    );
  }

  const wash = tenants.find((x) => x.sectorId === "car_wash");
  if (wash) {
    const i18n: Record<string, unknown> = {};
    for (const lang of ["en", "de", "ru"] as const) {
      await goto(page, wash.crm);
      const fr = await frame(page);
      await clickText(fr, new RegExp(`^${lang}$`, "i"));
      await page.waitForTimeout(1200);
      await clickText(
        fr,
        lang === "ru"
          ? /Заказы на мойку|Услуги мойки|Сотрудники|Дашборд/i
          : lang === "de"
            ? /Waschaufträge|Waschleistungen|Mitarbeiter|Dashboard/i
            : /Wash Orders|Wash Services|Employees|Dashboard/i,
      );
      await page.waitForTimeout(800);
      const text = await fr.locator("body").innerText();
      const shot = path.join(OUT, `car_wash-crm-${lang}.png`);
      await page.screenshot({ path: shot, fullPage: false });
      const expect =
        lang === "ru"
          ? ["Автомойка", "Заказы на мойку", "Услуги мойки", "Сотрудники"]
          : lang === "de"
            ? ["Autowäsche", "Waschaufträge", "Waschleistungen", "Mitarbeiter"]
            : ["Car Wash", "Wash Orders", "Wash Services", "Employees"];
      i18n[lang] = {
        shot,
        expect: expect.map((e) => ({ e, ok: text.includes(e) })),
        banned: ["Уборки", "Клининг", "Cleaning Service", "Добавить приём"].filter((b) =>
          text.includes(b),
        ),
        addCta:
          lang === "ru"
            ? text.includes("Добавить заказ на мойку")
            : lang === "de"
              ? text.includes("Waschauftrag hinzufügen")
              : text.includes("Add Wash Order"),
        navSnippet: text.split("\n").slice(0, 35),
      };
      await goto(page, `${BASE}/site/${wash.slug}?lang=${lang}`);
      const siteText = await page.locator("main").innerText();
      await page.screenshot({
        path: path.join(OUT, `car_wash-site-${lang}.png`),
        fullPage: true,
      });
      i18n[`site_${lang}`] = {
        niche:
          lang === "ru"
            ? /Автомойка/.test(siteText)
            : lang === "de"
              ? /Autowäsche/.test(siteText)
              : /Car Wash/.test(siteText),
        banned: ["Уборки", "Клининг", "Cleaning Service", "Добавить приём"].filter((b) =>
          siteText.includes(b),
        ),
      };
    }
    report.car_wash_i18n = i18n;
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(
    path.join(process.cwd(), "docs/local-evidence-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log("WROTE docs/local-evidence-report.json");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
