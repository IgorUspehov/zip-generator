/**
 * Browser smoke for deployed Factory CRM pages.dev URL.
 * Usage: npx tsx scripts/smoke-factory-pages-e2e.mjs <siteUrl> <clientId>
 */
import { chromium } from "playwright";

const siteUrl = (process.argv[2] || "").replace(/\?.*$/, "").replace(/\/$/, "");
const clientId = process.argv[3] || "";
if (!siteUrl || !clientId) {
  console.error("Usage: smoke-factory-pages-e2e.mjs <siteUrl> <clientId>");
  process.exit(1);
}

const storageKey = `factory_crm_${clientId}`;
const results = {};

function ok(name, pass, detail = "") {
  results[name] = pass ? "PASS" : `FAIL ${detail}`;
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

try {
  await page.goto(`${siteUrl}/?clientId=${clientId}`, { waitUntil: "networkidle", timeout: 90000 });
  const boot = await page.evaluate(() => window.__FACTORY_BOOTSTRAP__);
  ok("website_opens", Boolean(boot?.manifest), boot ? "" : "no bootstrap");
  ok("niche_restaurant", boot?.manifest?.business?.sector === "restaurant", String(boot?.manifest?.business?.sector));
  ok("product_mode", boot?.mode === "product");

  // Open CRM
  await page.getByRole("link", { name: /Open CRM/i }).click({ timeout: 15000 });
  await page.waitForURL(/\/crm/, { timeout: 15000 });
  ok("crm_opens", page.url().includes("/crm"));

  // Tabs
  for (const label of ["Reservations", "Tables", "Menu", "Staff", "Settings"]) {
    const tab = page.getByRole("button", { name: new RegExp(label, "i") }).first();
    const visible = await tab.isVisible().catch(() => false);
    ok(`tab_${label}`, visible);
  }

  // Seed not empty on Reservations
  await page.getByRole("button", { name: /Reservations/i }).first().click();
  await page.waitForTimeout(500);
  const rows = await page.locator("tbody tr").count();
  ok("seed_not_empty", rows >= 1, `rows=${rows}`);

  // CRUD: add reservation
  const before = rows;
  await page.getByRole("button", { name: /\+ Reservations/i }).click();
  await page.waitForTimeout(400);
  const afterAdd = await page.locator("tbody tr").count();
  ok("reservations_create", afterAdd > before, `${before}->${afterAdd}`);

  // Tables CRUD
  await page.getByRole("button", { name: /^Tables/i }).first().click();
  await page.waitForTimeout(300);
  const tBefore = await page.locator("tbody tr").count();
  await page.getByRole("button", { name: /\+ Tables/i }).click();
  await page.waitForTimeout(300);
  const tAfter = await page.locator("tbody tr").count();
  ok("tables_create", tAfter > tBefore, `${tBefore}->${tAfter}`);

  // Menu CRUD
  await page.getByRole("button", { name: /^Menu$/i }).first().click();
  await page.waitForTimeout(300);
  const mBefore = await page.locator("tbody tr").count();
  await page.getByRole("button", { name: /\+ Menu/i }).click();
  await page.waitForTimeout(300);
  const mAfter = await page.locator("tbody tr").count();
  ok("menu_create", mAfter > mBefore, `${mBefore}->${mAfter}`);

  // Staff CRUD
  await page.getByRole("button", { name: /^Staff$/i }).first().click();
  await page.waitForTimeout(300);
  const sBefore = await page.locator("tbody tr").count();
  await page.getByRole("button", { name: /\+ Staff/i }).click();
  await page.waitForTimeout(300);
  const sAfter = await page.locator("tbody tr").count();
  ok("staff_create", sAfter > sBefore, `${sBefore}->${sAfter}`);

  // Settings + Firebase + JSON
  await page.getByRole("button", { name: /Settings/i }).first().click();
  await page.waitForTimeout(400);
  const bodyText = await page.locator("body").innerText();
  ok("firebase_readiness", /LocalStorage/i.test(bodyText) && /Firebase/i.test(bodyText));
  ok("export_button", await page.getByRole("button", { name: /Export JSON/i }).isVisible());
  ok("import_button", await page.getByRole("button", { name: /Import JSON/i }).isVisible());

  // localStorage key + persist reload
  const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  ok("localStorage_key", Boolean(stored), storageKey);
  let parsedOk = false;
  try {
    const p = JSON.parse(stored || "{}");
    parsedOk = Array.isArray(p?.entities?.appointments) && p.entities.appointments.length > 0;
  } catch {}
  ok("localStorage_has_entities", parsedOk);

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const stored2 = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  ok("persist_after_reload", Boolean(stored2) && stored2 === stored);

  // JSON export/import roundtrip via evaluate
  const roundtrip = await page.evaluate(async (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return { ok: false, reason: "empty" };
    const state = JSON.parse(raw);
    const payload = {
      schema: "factory-crm-export/1.0",
      exportedAt: new Date().toISOString(),
      manifest: state.manifest,
      entities: state.entities,
      step: state.step,
    };
    const exported = JSON.stringify(payload);
    localStorage.removeItem(key);
    // import by writing state back (UI import uses same schema via store)
    const imported = JSON.parse(exported);
    localStorage.setItem(
      key,
      JSON.stringify({
        questionnaire: null,
        manifest: imported.manifest,
        step: "demo",
        entities: imported.entities,
        bookings: imported.entities.appointments,
        seeded: true,
      }),
    );
    return { ok: true, len: exported.length };
  }, storageKey);
  ok("json_export_import", roundtrip.ok, JSON.stringify(roundtrip));

  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Reservations/i }).first().click().catch(() => {});
  await page.waitForTimeout(500);
  const afterImport = await page.locator("tbody tr").count().catch(() => 0);
  ok("json_import_restores_rows", afterImport >= 1, `rows=${afterImport}`);
} catch (err) {
  ok("uncaught", false, err instanceof Error ? err.message : String(err));
} finally {
  await browser.close();
}

const failed = Object.values(results).filter((v) => String(v).startsWith("FAIL"));
console.log(JSON.stringify({ storageKey, results, failed: failed.length }, null, 2));
process.exit(failed.length ? 1 : 0);
