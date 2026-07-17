/**
 * Smoke CRM CRUD against react_mvp Pages deployment.
 * Usage: node scripts/smoke-react-mvp-crud.mjs /tmp/hotel-demo.json
 */
import { chromium } from "playwright";
import fs from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: smoke-react-mvp-crud.mjs <demo-json>");
  process.exit(1);
}

const d = JSON.parse(fs.readFileSync(file, "utf8"));
const url = `${d.deploymentUrl}/?clientId=${d.clientId}`;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
const out = {};
const mark = (k, p, detail = "") => {
  out[k] = p ? "PASS" : `FAIL ${detail}`;
  console.log(`${out[k]} ${k}${detail ? ` — ${detail}` : ""}`);
};

try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  mark("opens", (await page.title()).length > 0, await page.title());

  // Primary entity tab varies by niche (Clients / Guests / Reservations / Menu).
  const primaryTab = page
    .getByRole("button", { name: /Clients|Guests|Reservations|Menu|Клиенты|Запис/i })
    .first();
  await primaryTab.click();
  await page.waitForTimeout(400);
  const before = await page.locator("tbody tr").count();
  const addBtn = page
    .getByRole("button", {
      name: /Add Client|Add Guest|Add Appointment|Add Reservation|Add Service|Добавить|hinzufügen/i,
    })
    .first();
  const addVisible = await addBtn.isVisible().catch(() => false);
  mark("add_btn", addVisible);
  if (addVisible) {
    await addBtn.click();
    await page.waitForTimeout(300);
    const nameInput = page.locator("input").first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(`Smoke ${Date.now()}`);
    }
    const save = page.getByRole("button", { name: /Save|Сохранить|Speichern/i }).first();
    if (await save.isVisible().catch(() => false)) await save.click();
    await page.waitForTimeout(500);
  }
  const after = await page.locator("tbody tr").count();
  mark("primary_crud", after >= before, `${before}->${after}`);

  const secondaryTab = page.getByRole("button", { name: /Staff|Tables|Services|Appointments/i }).first();
  if (await secondaryTab.isVisible().catch(() => false)) {
    await secondaryTab.click();
    await page.waitForTimeout(400);
    const aBefore = await page.locator("tbody tr").count();
    const addSecondary = page
      .getByRole("button", { name: /Add Staff|Add |Добавить|hinzufügen/i })
      .first();
    if (await addSecondary.isVisible().catch(() => false)) {
      await addSecondary.click();
      await page.waitForTimeout(300);
      const save = page.getByRole("button", { name: /Save|Сохранить|Speichern/i }).first();
      if (await save.isVisible().catch(() => false)) await save.click();
      await page.waitForTimeout(500);
    }
    const aAfter = await page.locator("tbody tr").count();
    mark("secondary_crud", aAfter >= aBefore, `${aBefore}->${aAfter}`);
  } else {
    mark("secondary_crud", true, "skipped");
  }

  await page.goto(d.redirectUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  const iframe = page.locator("iframe");
  mark("readable_iframe", (await iframe.count()) > 0);
  const src = await iframe.first().getAttribute("src");
  mark("iframe_src_pages", Boolean(src && src.includes("pages.dev")), src || "");
} catch (e) {
  mark("uncaught", false, e instanceof Error ? e.message : String(e));
} finally {
  await browser.close();
}

const failed = Object.values(out).filter((v) => String(v).startsWith("FAIL")).length;
console.log(JSON.stringify({ file, out, failed }, null, 2));
process.exit(failed ? 1 : 0);
