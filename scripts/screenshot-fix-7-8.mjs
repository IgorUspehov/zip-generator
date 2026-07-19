#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs/ui-review-screenshots/fix-7-8");
fs.mkdirSync(out, { recursive: true });

const client = process.env.CLIENT_ID || "ac005a6d-9df5-44fc-a21e-a1d99fb631b9";
const demo =
  process.env.DEMO_URL ||
  `https://saas-mvp-funnel-production.up.railway.app/demo/fix78-logistics-gmbh-ac00?clientId=${client}`;
const crm =
  process.env.CRM_URL ||
  `https://788cd7f5.crm-demo-sites.pages.dev/?clientId=${client}`;
const base = "https://saas-mvp-funnel-production.up.railway.app";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(demo, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(4000);
const bannerInfo = await page.evaluate(() => {
  const fixedBars = [...document.querySelectorAll("div")].filter((d) => {
    const s = getComputedStyle(d);
    return (
      s.position === "fixed" &&
      s.top === "0px" &&
      /демо|demo|тариф|plan|wählen|choose/i.test(d.innerText || "")
    );
  });
  return {
    fixedBarCount: fixedBars.length,
    fixedTexts: fixedBars.map((b) => b.innerText.replace(/\s+/g, " ").slice(0, 160)),
  };
});
fs.writeFileSync(path.join(out, "banner-count.json"), JSON.stringify(bannerInfo, null, 2));
await page.screenshot({ path: path.join(out, "01-single-banner-demo-wrapper.png") });

await page.goto(crm, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(5000);
const dash = await page.evaluate(() => {
  const body = document.body.innerText;
  return {
    hasHans: /Водитель Ганс|Fahrer Hans|Driver Hans/.test(body),
    hasZeroOnlyMetrics: /\b0\b/.test(body) && !/[1-9]/.test(body.match(/\n(\d+)\n/g)?.join("") || "x"),
    metricSnippet: body.slice(0, 800),
    hasWatermarkHint: /DEMO/i.test(document.body.innerHTML),
  };
});
fs.writeFileSync(path.join(out, "unpaid-dashboard.json"), JSON.stringify(dash, null, 2));
await page.screenshot({ path: path.join(out, "03-unpaid-dashboard-scenario.png") });

for (const lang of ["en", "de", "ru"]) {
  await page.goto(`${base}/tariffs?lang=${lang}&clientId=${client}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, `04-tariffs-${lang}.png`) });
}

await page.goto(
  `https://buy.polar.sh/polar_cl_uUpNQRXBAVubDpDO3zwLa5SAswkU0Jkr2835A04UF1F?reference_id=${client}&locale=en`,
  { waitUntil: "domcontentloaded", timeout: 60000 },
);
await page.waitForTimeout(3500);
const polarText = await page.locator("body").innerText();
fs.writeFileSync(path.join(out, "polar-checkout.txt"), polarText.slice(0, 2500));
await page.screenshot({ path: path.join(out, "05-polar-checkout-current.png") });

console.log(JSON.stringify({ bannerInfo, dash, polarOneTime: /one-time/i.test(polarText) }, null, 2));
await browser.close();
