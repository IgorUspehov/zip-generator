/**
 * Niche smoke: bootstrap sector + expected CRM tab labels.
 * Usage: npx tsx scripts/smoke-factory-niche.mjs <siteUrl> <clientId> <expectedSector> <tab1,tab2,...>
 */
import { chromium } from "playwright";

const [siteUrlRaw, clientId, expectedSector, tabsCsv] = process.argv.slice(2);
const siteUrl = (siteUrlRaw || "").replace(/\?.*$/, "").replace(/\/$/, "");
const tabs = (tabsCsv || "").split(",").filter(Boolean);
if (!siteUrl || !clientId || !expectedSector || tabs.length === 0) {
  console.error("Usage: smoke-factory-niche.mjs <siteUrl> <clientId> <sector> <Tab1,Tab2,...>");
  process.exit(1);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
const results = {};
const mark = (k, p, d = "") => {
  results[k] = p ? "PASS" : `FAIL ${d}`;
  console.log(`${p ? "PASS" : "FAIL"} ${k}${d ? ` — ${d}` : ""}`);
};

try {
  await page.goto(`${siteUrl}/?clientId=${clientId}`, { waitUntil: "networkidle", timeout: 90000 });
  const boot = await page.evaluate(() => window.__FACTORY_BOOTSTRAP__);
  mark("bootstrap", Boolean(boot));
  mark("sector", boot?.manifest?.business?.sector === expectedSector, String(boot?.manifest?.business?.sector));
  mark("vocab", boot?.manifest?.crm?.vocabularyKey === expectedSector || Boolean(boot?.manifest?.crm?.vocabularyKey), String(boot?.manifest?.crm?.vocabularyKey));
  mark("factory_bundle", await page.evaluate(() => !!document.querySelector('script[src*="DNeDQEXX"]')));
  await page.getByRole("link", { name: /Open CRM/i }).click({ timeout: 15000 });
  await page.waitForURL(/\/crm/, { timeout: 15000 });
  for (const tab of tabs) {
    const visible = await page.getByRole("button", { name: new RegExp(`^${tab}$`, "i") }).first().isVisible().catch(() => false);
    mark(`tab_${tab}`, visible);
  }
  await page.getByRole("button", { name: new RegExp(tabs[0], "i") }).first().click();
  await page.waitForTimeout(400);
  const rows = await page.locator("tbody tr").count();
  mark("seed_rows", rows >= 1, `rows=${rows}`);
  const key = `factory_crm_${clientId}`;
  const stored = await page.evaluate((k) => localStorage.getItem(k), key);
  mark("storage_key", Boolean(stored), key);
} catch (e) {
  mark("uncaught", false, e instanceof Error ? e.message : String(e));
} finally {
  await browser.close();
}

const failed = Object.values(results).filter((v) => String(v).startsWith("FAIL")).length;
console.log(JSON.stringify({ niche: expectedSector, results, failed }, null, 2));
process.exit(failed ? 1 : 0);
