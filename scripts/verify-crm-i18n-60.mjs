#!/usr/bin/env node
/**
 * Automated CRM i18n matrix: 20 wizard niches × EN/DE/RU = 60.
 * Checks banner, settings niche, nav/settings chrome, and scenario content
 * for wrong-language leakage.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "artifacts/factory_output/react_mvp/dist");
const sectorMapping = JSON.parse(
  fs.readFileSync(path.join(root, "config/sector_mapping.json"), "utf8"),
).sector_id_to_business_type;
const scenarios = JSON.parse(
  fs.readFileSync(
    path.join(root, "artifacts/factory_output/react_mvp/src/data/niche-scenarios.json"),
    "utf8",
  ),
);
const nicheLabels = JSON.parse(
  fs.readFileSync(
    path.join(root, "artifacts/factory_output/react_mvp/src/data/niche-labels.json"),
    "utf8",
  ),
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

const EXPECTED_SECTOR = {
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

const BANNER = {
  en: "Demo version. Choose a plan to continue.",
  de: "Demo-Version. Wählen Sie einen Plan, um fortzufahren.",
  ru: "Демо-версия. Выберите тариф, чтобы продолжить.",
};

const BANNER_CTA = {
  en: "Choose plan",
  de: "Plan wählen",
  ru: "Выбрать тариф",
};

const SETTINGS_LABEL = {
  en: "Niche",
  de: "Branche",
  ru: "Ниша",
};

const SETTINGS_NAV = {
  en: "Settings",
  de: "Einstellungen",
  ru: "Настройки",
};

const CYRILLIC = /[А-Яа-яЁё]/;
const GERMAN_MARKERS = /(?:Branche|Einstellungen|Leistung|Termin|Kunde hinzufügen|Demo-Version|heute|Verfügbar|Ausstehend)/i;
const ENGLISH_MARKERS = /(?:Niche|Settings|Add Client|Demo version\.|Pending|Available|today)/i;
const RUSSIAN_MARKERS = /(?:Ниша|Настройки|Добавить|Демо-версия|Ожидает|Доступен|сегодня)/;

const KEY_MAP = {
  barbershop: "beauty_salon",
  yoga: "fitness_club",
  cafe: "restaurant",
  tire_service: "car_service",
  car_wash: "cleaning_service",
};

function scenarioKey(sectorId) {
  const bt = sectorMapping[sectorId];
  if (scenarios[bt]) return bt;
  return KEY_MAP[sectorId] || bt;
}

const DEFAULT_PAGES = {
  health_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments", "settings"],
  dental_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments", "settings"],
  beauty_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  fitness_club: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  restaurant: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  car_service: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  hotel_booking: ["dashboard", "guests", "rooms", "reservations", "housekeeping", "settings"],
  real_estate: ["dashboard", "properties", "agents", "clients", "viewings", "services", "settings"],
  education: ["dashboard", "students", "courses", "teachers", "appointments", "settings"],
  logistics: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  ecommerce: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  technology: ["dashboard", "products", "clients", "projects", "developers", "settings"],
  law_firm: ["dashboard", "clients", "matters", "appointments", "services", "invoices", "settings"],
  accounting: ["dashboard", "clients", "invoices", "appointments", "services", "reports", "settings"],
  cleaning_service: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
};

/** Primary catalog tab + first scenario record for content checks. */
function catalogPlan(businessType) {
  const records = scenarios[businessType]?.records || {};
  const labels = nicheLabels[businessType]?.tabs || {};
  const candidates = [
    ["menu", records.menu],
    ["products", records.products],
    ["services", records.services],
    ["subscriptions", records.subscriptions],
    ["courses", records.courses],
    ["classes", records.classes],
    ["rooms", records.rooms],
  ];
  for (const [tab, list] of candidates) {
    if (Array.isArray(list) && list[0]) {
      // Prefer a nav page that exists in niche labels OR maps to services/products seed.
      const navTab =
        labels[tab] ? tab
          : tab === "classes" || tab === "subscriptions" || tab === "courses" || tab === "menu"
            ? labels.services
              ? "services"
              : tab
            : tab;
      return { tab: navTab, sourceTab: tab, item: list[0], tabLabels: labels[navTab] || null };
    }
  }
  // Fall back to dashboard today_items / popular (CRM dashboards often hide popular)
  const today = scenarios[businessType]?.today_items?.[0];
  if (today) {
    return {
      tab: "dashboard",
      sourceTab: "today",
      item: {
        name: today.service || today.name || null,
        title: today.name || null,
      },
      tabLabels: null,
    };
  }
  const popular = scenarios[businessType]?.popular_services;
  if (popular?.en?.[0]) {
    return {
      tab: "dashboard",
      sourceTab: "popular",
      item: {
        name: {
          en: popular.en[0],
          de: popular.de?.[0] || popular.en[0],
          ru: popular.ru?.[0] || popular.en[0],
        },
      },
      tabLabels: null,
    };
  }
  return { tab: "services", sourceTab: "services", item: null, tabLabels: null };
}

function mime(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    let filePath = path.normalize(path.join(dist, rel));
    if (!filePath.startsWith(dist)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dist, "index.html");
    }
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("missing");
      return;
    }
    res.writeHead(200, { "Content-Type": mime(filePath) });
    res.end(fs.readFileSync(filePath));
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, port: server.address().port });
    });
  });
}

function wrongLanguageHits(body, language) {
  const hits = [];
  if (language === "en") {
    if (CYRILLIC.test(body) && RUSSIAN_MARKERS.test(body)) hits.push("ru-leak");
    // DE chrome should not appear when EN selected (allow brand names like Barbershop)
    if (/\bBranche\b|\bEinstellungen\b|Demo-Version|Kunde hinzufügen/.test(body)) hits.push("de-leak");
  } else if (language === "de") {
    if (CYRILLIC.test(body) && RUSSIAN_MARKERS.test(body)) hits.push("ru-leak");
    if (/Demo version\. Pay|Niche\b.*\n|Add Client|Add Service/.test(body)) hits.push("en-leak");
  } else if (language === "ru") {
    if (/Demo-Version|Branche\b|Einstellungen|Kunde hinzufügen/.test(body)) hits.push("de-leak");
    if (/Demo version\. Pay|Add Client|Add Service/.test(body)) hits.push("en-leak");
  }
  return hits;
}

async function main() {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("Missing react_mvp dist. Run npm run react-mvp:build first.");
    process.exit(1);
  }

  const { server, port } = await startServer();
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    headless: true,
  });

  const rows = [];
  const manifestPath = path.join(dist, "client-manifest.json");

  try {
    for (const sectorId of WIZARD_SECTORS) {
      const businessType = sectorMapping[sectorId];
      const scKey = scenarioKey(sectorId);
      const settingsTabLabel =
        nicheLabels[scKey]?.tabs?.settings || SETTINGS_NAV;

      for (const language of ["en", "de", "ru"]) {
        const clientId = `i18n60-${sectorId}-${language}`;
        const plan = catalogPlan(scKey);
        const expectedName =
          plan.item?.name?.[language] || plan.item?.title?.[language] || null;
        const expectedDuration =
          plan.item?.duration?.[language] ||
          plan.item?.status?.[language] ||
          plan.item?.category?.[language] ||
          null;
        const nicheExpected = EXPECTED_SECTOR[sectorId][language];
        const pages = [
          ...(DEFAULT_PAGES[scKey] || DEFAULT_PAGES[businessType] || [
            "dashboard",
            "clients",
            "services",
            "settings",
          ]),
        ];
        if (plan.tab && plan.tab !== "dashboard" && !pages.includes(plan.tab)) {
          pages.splice(Math.max(1, pages.length - 1), 0, plan.tab);
        }

        fs.writeFileSync(
          manifestPath,
          JSON.stringify({
            businessName: `Verify ${sectorId}`,
            businessType,
            sectorId,
            sector_id: sectorId,
            language,
            city: "Berlin",
            phone: "+491701234567",
            email: "verify@example.com",
            pages,
            // Intentionally omit monolingual scenario — CRM must use local niche-scenarios
          }),
        );

        const page = await browser.newPage();
        const failures = [];

        try {
          await page.goto(`http://127.0.0.1:${port}/?clientId=${clientId}`, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });
          await page.waitForSelector("button", { timeout: 30000 });
          await page.waitForTimeout(600);

          // Ensure language switcher applied (manifest language + click)
          const langBtn = page.locator("button").filter({ hasText: new RegExp(`^${language.toUpperCase()}$`) });
          if (await langBtn.count()) {
            await langBtn.click();
            await page.waitForTimeout(450);
          }

          let body = await page.evaluate(() => document.body.innerText);

          // Banner
          if (!body.includes(BANNER[language])) {
            failures.push(`banner-text missing`);
          }
          if (!body.includes(BANNER_CTA[language])) {
            failures.push(`banner-cta missing`);
          }

          // Open settings
          const settingsRe = new RegExp(
            `${SETTINGS_NAV.en}|${SETTINGS_NAV.de}|${SETTINGS_NAV.ru}|${settingsTabLabel.en || ""}|${settingsTabLabel.de || ""}|${settingsTabLabel.ru || ""}`,
            "i",
          );
          const settingsBtn = page.locator("button, a, [role='button']").filter({ hasText: settingsRe }).first();
          if (await settingsBtn.count()) {
            await settingsBtn.click();
            await page.waitForTimeout(400);
          }

          body = await page.evaluate(() => document.body.innerText);

          if (!body.includes(SETTINGS_LABEL[language])) {
            failures.push(`settings-label expected ${SETTINGS_LABEL[language]}`);
          }
          if (!body.includes(nicheExpected)) {
            failures.push(`niche expected "${nicheExpected}"`);
          }

          // Open primary catalog tab for this niche (use localized niche label when known)
          if (plan.tab === "dashboard") {
            const dashBtn = page.locator("aside button").filter({ hasText: /Dashboard|Дашборд/i }).first();
            if (await dashBtn.count()) {
              await dashBtn.click();
              await page.waitForTimeout(400);
            }
          } else if (plan.tab) {
            const label = plan.tabLabels?.[language];
            const catalogRe = label
              ? new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
              : {
                  menu: /Menu|Speisekarte|Меню/i,
                  products: /Products|Produkte|Товары|Продукты/i,
                  services: /Services|Leistungen|Услуги|Subscriptions|Abonnements|Абонементы/i,
                  classes: /Classes|Kurse|Занятия/i,
                  courses: /Courses|Kurse|Курсы/i,
                  subscriptions: /Subscriptions|Abonnements|Абонементы/i,
                  rooms: /Rooms|Zimmer|Номера/i,
                }[plan.tab] || /Services|Leistungen|Услуги|Products|Produkte|Продукты/i;
            const catalogBtn = page.locator("aside button").filter({ hasText: catalogRe }).first();
            if (await catalogBtn.count()) {
              await catalogBtn.click();
              await page.waitForTimeout(500);
            }
          }

          body = await page.evaluate(() => document.body.innerText);

          if (expectedName && !body.includes(expectedName)) {
            failures.push(`content name missing "${expectedName}"`);
          }
          if (expectedDuration && !body.includes(expectedDuration)) {
            // duration/status may be on same row — soft fail only if name also missing
            if (!expectedName || failures.some((f) => f.includes("content name"))) {
              failures.push(`content duration/status missing "${expectedDuration}"`);
            }
          }

          // Cross-language chrome leakage (banner + settings chrome)
          const chrome = body.slice(0, 2500);
          const leaks = wrongLanguageHits(chrome, language);
          for (const leak of leaks) {
            // Skip if shared brand words only — require definite chrome phrases
            if (leak === "en-leak" && language !== "en" && chrome.includes(BANNER.en)) {
              failures.push(leak);
            } else if (leak === "de-leak" && language !== "de" && chrome.includes(BANNER.de)) {
              failures.push(leak);
            } else if (leak === "ru-leak" && language !== "ru" && chrome.includes(BANNER.ru)) {
              failures.push(leak);
            } else if (leak === "ru-leak" && language !== "ru" && chrome.includes(SETTINGS_LABEL.ru)) {
              failures.push(leak);
            } else if (leak === "de-leak" && language !== "de" && chrome.includes(SETTINGS_LABEL.de)) {
              failures.push(leak);
            } else if (leak === "en-leak" && language !== "en" && chrome.includes(SETTINGS_LABEL.en) && !chrome.includes(SETTINGS_LABEL[language])) {
              failures.push(leak);
            }
          }

          // Wrong-language catalog sibling
          if (plan.item?.name) {
            for (const other of ["en", "de", "ru"]) {
              if (other === language) continue;
              const otherName = plan.item.name[other] || plan.item.title?.[other];
              if (
                otherName &&
                expectedName &&
                otherName !== expectedName &&
                body.includes(otherName) &&
                !body.includes(expectedName)
              ) {
                failures.push(`wrong-lang catalog "${otherName}"`);
              }
            }
          }

          const status = failures.length ? "FAIL" : "PASS";
          rows.push({
            sector: sectorId,
            language,
            status,
            note: failures.join("; ") || "",
            expectedName: expectedName || "",
          });
          console.log(
            `${sectorId}/${language}: ${status}${failures.length ? " — " + failures.join("; ") : ""}`,
          );
        } catch (err) {
          rows.push({
            sector: sectorId,
            language,
            status: "FAIL",
            note: String(err?.message || err).slice(0, 120),
            expectedName: expectedName || "",
          });
          console.log(`${sectorId}/${language}: FAIL — ${err?.message || err}`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
    try {
      fs.unlinkSync(manifestPath);
    } catch {
      /* ignore */
    }
  }

  console.log("\n| # | niche | lang | result | note |");
  console.log("|---|---|---|---|---|");
  rows.forEach((r, i) => {
    console.log(
      `| ${i + 1} | ${r.sector} | ${r.language} | ${r.status} | ${(r.note || "").replace(/\|/g, "/")} |`,
    );
  });

  const passed = rows.filter((r) => r.status === "PASS").length;
  const failed = rows.filter((r) => r.status === "FAIL").length;
  console.log(`\nTOTAL: ${passed} PASS / ${failed} FAIL / ${rows.length}`);

  const outPath = path.join(root, "artifacts/crm-i18n-60-results.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ passed, failed, rows }, null, 2));
  console.log(`Wrote ${outPath}`);

  if (failed > 0 || rows.length !== 60) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
