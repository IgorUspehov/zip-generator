#!/usr/bin/env node
/**
 * Smoke: tariff chooser EN/DE/RU + €99 Polar vs Factory bridge for €499/€999.
 */
import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3010";
const outDir = new URL("../docs/ui-review-screenshots/", import.meta.url);

const EXPECT = {
  en: { title: "Choose your plan", c99: "Pay €99 · CRM Demo", c499: "Continue to Factory · €499", c999: "Continue to Factory · €999" },
  de: { title: "Plan wählen", c99: "€99 zahlen · CRM Demo", c499: "Weiter zu Factory · €499", c999: "Weiter zu Factory · €999" },
  ru: { title: "Выберите тариф", c99: "Оплатить €99 · CRM Demo", c499: "Перейти в Factory · €499", c999: "Перейти в Factory · €999" },
};

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/usr/bin/chromium",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const qs =
    "clientId=tariff-smoke&businessName=Smoke%20Studio&ownerName=Igor&niche=fitness&city=Berlin&email=igor%40example.com&phone=%2B49111&lang=";

  for (const lang of ["en", "de", "ru"]) {
    await page.goto(`${BASE}/tariffs?${qs}${lang}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(400);
    const body = await page.evaluate(() => document.body.innerText);
    const exp = EXPECT[lang];
    assert.ok(body.includes(exp.title), `${lang} title`);
    assert.ok(body.includes(exp.c99), `${lang} €99`);
    assert.ok(body.includes(exp.c499), `${lang} €499`);
    assert.ok(body.includes(exp.c999), `${lang} €999`);
    assert.ok(!/remove limits|keep your site|сохранить сайт|Website zu behalten/i.test(body), `${lang} old promise`);
    await page.screenshot({ path: new URL(`07-tariffs-${lang}.png`, outDir).pathname });
    console.log("PASS", lang);
  }

  // €99 should navigate toward Polar
  await page.goto(`${BASE}/tariffs?${qs}en`, { waitUntil: "networkidle" });
  const [polarNav] = await Promise.all([
    page.waitForURL(/buy\.polar\.sh|polar/i, { timeout: 15000 }).catch(() => null),
    page.getByRole("button", { name: /Pay €99/i }).click(),
  ]);
  const polarOk = Boolean(polarNav) || /polar/i.test(page.url());
  console.log(polarOk ? "PASS polar-99" : "FAIL polar-99", page.url());

  // €499 → factory bridge / handoff
  await page.goto(`${BASE}/tariffs?${qs}en`, { waitUntil: "networkidle" });
  await Promise.all([
    page.waitForURL(/factory-bridge|factory-handoff|FACTORY/i, { timeout: 15000 }).catch(() => null),
    page.getByRole("button", { name: /€499/i }).click(),
  ]);
  const factoryOk =
    /factory-bridge|factory-handoff/i.test(page.url()) ||
    (await page.evaluate(() => /Factory Website\+CRM bridge|businessName|tier/i.test(document.body.innerText)));
  console.log(factoryOk ? "PASS factory-499" : "FAIL factory-499", page.url());
  await page.screenshot({ path: new URL("08-factory-handoff.png", outDir).pathname });

  await browser.close();
  if (!polarOk || !factoryOk) process.exit(1);
  console.log("ALL TARIFF SMOKES PASS");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
