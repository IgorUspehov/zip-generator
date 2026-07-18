#!/usr/bin/env node
/**
 * Verify Settings Branche/Niche for already-created demos (or create them).
 *
 * Usage:
 *   node scripts/verify-niche-settings-branche.mjs [--create] [baseUrl]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sectorMapping = JSON.parse(
  fs.readFileSync(path.join(root, "config/sector_mapping.json"), "utf8"),
);

const WIZARD_SECTORS = [
  "beauty",
  "barbershop",
  "massage",
  "fitness",
  "yoga",
  "dental",
  "health",
  "food",
  "cafe",
  "hotel",
  "car_service",
  "tire_service",
  "car_wash",
  "realestate",
  "law_firm",
  "accounting",
  "education",
  "logistics",
  "shop",
  "tech",
];

const EXPECTED_LABELS = {
  beauty: { ru: "Салон красоты", de: "Beauty-Salon", en: "Beauty Salon" },
  barbershop: { ru: "Барбершоп", de: "Barbershop", en: "Barbershop" },
  massage: { ru: "Массажный салон", de: "Massagestudio", en: "Massage Studio" },
  fitness: { ru: "Фитнес-клуб", de: "Fitnessstudio", en: "Fitness Club" },
  yoga: { ru: "Йога-студия", de: "Yoga-Studio", en: "Yoga Studio" },
  dental: { ru: "Стоматология", de: "Zahnarztpraxis", en: "Dentistry" },
  health: { ru: "Медицинская клиника", de: "Medizinische Klinik", en: "Medical Clinic" },
  food: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  cafe: { ru: "Кафе", de: "Café", en: "Café" },
  hotel: { ru: "Отель", de: "Hotel", en: "Hotel" },
  car_service: { ru: "Автосервис", de: "Autowerkstatt", en: "Auto Repair" },
  tire_service: { ru: "Шиномонтаж", de: "Reifendienst", en: "Tire Service" },
  car_wash: { ru: "Автомойка", de: "Autowäsche", en: "Car Wash" },
  realestate: { ru: "Агентство недвижимости", de: "Immobilienagentur", en: "Real Estate Agency" },
  law_firm: { ru: "Юридическая фирма", de: "Anwaltskanzlei", en: "Law Firm" },
  accounting: { ru: "Бухгалтерские услуги", de: "Buchhaltungsservice", en: "Accounting Services" },
  education: { ru: "Образовательный центр", de: "Bildungszentrum", en: "Education Center" },
  logistics: { ru: "Логистика и транспорт", de: "Logistik & Transport", en: "Logistics & Transport" },
  shop: { ru: "Интернет-магазин", de: "Online-Shop", en: "Online Store" },
  tech: { ru: "IT и технологии", de: "IT & Technologie", en: "IT & Technology" },
};

const LANG_PLAN = {
  beauty: "de",
  barbershop: "de",
  massage: "de",
  fitness: "de",
  yoga: "de",
  dental: "de",
  health: "de",
  food: "de",
  cafe: "de",
  hotel: "de",
  car_service: "de",
  tire_service: "de",
  car_wash: "de",
  realestate: "de",
  law_firm: "de",
  accounting: "de",
  education: "en",
  logistics: "de",
  shop: "ru",
  tech: "en",
};

const args = process.argv.slice(2);
const doCreate = args.includes("--create");
const baseUrl = (
  args.find((a) => a.startsWith("http")) ||
  process.env.VERIFY_BASE_URL ||
  "https://saas-mvp-funnel-production.up.railway.app"
).replace(/\/$/, "");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseCreatedFromLog(logPath) {
  if (!fs.existsSync(logPath)) return [];
  const text = fs.readFileSync(logPath, "utf8");
  const rows = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^create (\w+) \((\w+)\)… (https:\/\/\S+)/);
    if (!m) continue;
    const sectorId = m[1];
    const language = m[2];
    const url = m[3];
    const clientId = new URL(url).searchParams.get("clientId");
    rows.push({
      sectorId,
      language,
      url,
      clientId,
      expected: EXPECTED_LABELS[sectorId]?.[language],
      businessType: sectorMapping.sector_id_to_business_type[sectorId],
    });
  }
  return rows;
}

async function createDemo(sectorId, language) {
  const businessType = sectorMapping.sector_id_to_business_type[sectorId];
  const payload = {
    name: `Verify ${sectorId}`,
    business_name: `Verify ${sectorId} GmbH`,
    email: `verify-${sectorId}-${Date.now()}@example.com`,
    business_type: businessType,
    sector_id: sectorId,
    language,
    phone: "+491701234567",
    telegram: "@verify",
    whatsapp: "+491701234567",
    postal_code: "80331",
    address: "Maximilianstraße 1",
    website: "",
    logo: "assets/logo.png",
    currency: "EUR",
    plan_id: "free",
    plan: "Free",
    amount: 0,
    payment_status: "FREE",
    terms_accepted: true,
    privacy_accepted: true,
    accepted_at: new Date().toISOString(),
    working_hours: {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-18:00",
      saturday: "10:00-15:00",
      sunday: "closed",
    },
    social_links: { instagram: "", facebook: "", tiktok: "", website: "" },
    business_questions: {},
  };

  const response = await fetch(`${baseUrl}/api/client-questionnaire`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok || !data.redirectUrl) {
    throw new Error(`create ${sectorId}: HTTP ${response.status} ${JSON.stringify(data)}`);
  }
  const crmUrl = data.deploymentUrl
    ? `${String(data.deploymentUrl).replace(/\/$/, "")}/?clientId=${encodeURIComponent(data.clientId)}`
    : null;
  return {
    sectorId,
    language,
    businessType,
    clientId: data.clientId,
    url: data.redirectUrl,
    crmUrl,
    expected: EXPECTED_LABELS[sectorId][language],
  };
}

async function resolveCrmUrl(page, row) {
  if (row.crmUrl) {
    return row.crmUrl;
  }
  await page.goto(row.url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForTimeout(1500);
  const iframeSrc = await page.evaluate(() => {
    const iframe = document.querySelector("iframe");
    return iframe?.src || null;
  });
  if (iframeSrc) {
    return iframeSrc;
  }
  if (page.url().includes("pages.dev")) {
    return page.url();
  }
  throw new Error(`No CRM iframe on ${row.url}`);
}

async function readSettingsNiche(page, crmUrl, language) {
  await page.goto(crmUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.evaluate(() => {
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.includes(":company")) localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector("aside button, .mvp-sidebar button, button", { timeout: 60_000 });
  await page.waitForTimeout(800);

  const langBtn = page.locator("button").filter({ hasText: new RegExp(`^${language.toUpperCase()}$`) });
  if (await langBtn.count()) {
    await langBtn.first().click();
    await page.waitForTimeout(300);
  }

  const settingsBtn = page.locator("button").filter({
    hasText: /Einstellungen|Settings|Настройки/i,
  });
  await settingsBtn.first().waitFor({ timeout: 60_000 });
  await settingsBtn.first().click();
  await page.waitForTimeout(400);

  return page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll("section.panel label"));
    for (const label of labels) {
      const span = label.querySelector("span");
      const input = label.querySelector("input");
      if (!span || !input) continue;
      const text = (span.textContent || "").trim().toLowerCase();
      if (text === "niche" || text === "branche" || text === "ниша") {
        return input.value;
      }
    }
    const inputs = Array.from(document.querySelectorAll("section.panel input"));
    return inputs[1]?.value ?? "";
  });
}

async function main() {
  console.log(`[verify-niche] base=${baseUrl} create=${doCreate}`);
  let results = [];

  if (doCreate) {
    let created = 0;
    for (const sectorId of WIZARD_SECTORS) {
      const language = LANG_PLAN[sectorId] || "de";
      process.stdout.write(`create ${sectorId} (${language})… `);
      try {
        const demo = await createDemo(sectorId, language);
        console.log(demo.url, demo.crmUrl || "");
        results.push({ ...demo, nicheValue: null, status: "CREATED" });
        created += 1;
        if (created % 5 === 0) {
          // Keep volume headroom between Cloudflare snapshot persists.
          try {
            await fetch(`${baseUrl}/api/storage/cleanup?aggressive=1`, { method: "POST" });
          } catch {
            /* ignore */
          }
        }
        await sleep(1200);
      } catch (error) {
        console.log("FAIL", error instanceof Error ? error.message : error);
        results.push({
          sectorId,
          language,
          url: "",
          expected: EXPECTED_LABELS[sectorId][language],
          nicheValue: "",
          status: "FAIL",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  } else {
    results = parseCreatedFromLog(path.join(root, "artifacts/niche-settings-verify.log"));
    if (!results.length) {
      throw new Error("No demos in log. Re-run with --create");
    }
    console.log(`Loaded ${results.length} demos from log`);
  }

  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
  });

  for (const row of results) {
    if (!row.url && !row.crmUrl) {
      row.status = "FAIL";
      continue;
    }
    process.stdout.write(`check Settings ${row.sectorId}… `);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      const crmUrl = await resolveCrmUrl(page, row);
      row.crmUrl = crmUrl;
      const nicheValue = await readSettingsNiche(page, crmUrl, row.language);
      row.nicheValue = nicheValue;
      row.status = nicheValue === row.expected ? "PASS" : "FAIL";
      console.log(`${nicheValue} → ${row.status}`);
    } catch (error) {
      row.status = "FAIL";
      row.error = error instanceof Error ? error.message : String(error);
      console.log("FAIL", row.error);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n=== REPORT ===");
  console.log("| niche | lang | demo URL | Branche/Niche | status |");
  console.log("|---|---|---|---|---|");
  for (const row of results) {
    console.log(
      `| ${row.sectorId} | ${row.language} | ${row.url || "—"} | ${row.nicheValue ?? "—"} (expected: ${row.expected}) | ${row.status} |`,
    );
  }

  const failed = results.filter((r) => r.status !== "PASS");
  const outPath = path.join(root, "artifacts", "niche-settings-verify.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`\nWrote ${outPath}`);
  console.log(`PASS ${results.length - failed.length}/${results.length}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
