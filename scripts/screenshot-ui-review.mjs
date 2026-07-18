#!/usr/bin/env node
/**
 * Capture 1920×1080 UI screenshots for contrast/typography review.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "artifacts", "ui-review-screenshots");
mkdirSync(outDir, { recursive: true });

const BASE = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3000";
const VIEWPORT = { width: 1920, height: 1080 };

async function shot(page, name, url, options = {}) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  if (options.waitMs) await page.waitForTimeout(options.waitMs);
  if (options.clickLang) {
    await page.getByRole("button", { name: options.clickLang }).click().catch(() => {});
    await page.waitForTimeout(400);
  }
  const path = join(outDir, name);
  await page.screenshot({ path, fullPage: options.fullPage ?? false });
  console.log("saved", path);
}

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/usr/bin/chromium",
    headless: true,
  });
  const page = await browser.newPage({ viewport: VIEWPORT });

  await shot(page, "01-landing-hero-ru.png", `${BASE}/?lang=ru`);
  // Force RU via lang buttons if query ignored
  await page.getByRole("button", { name: "RU" }).click().catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outDir, "01b-landing-hero-ru-forced.png") });

  // Scroll to niches
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, "02-landing-niches-ru.png") });

  // Check badge text is not "3 3"
  const badgeText = await page.locator("text=/минут|minutes|Minuten/i").first().textContent().catch(() => "");
  console.log("sample duration text:", JSON.stringify(badgeText));

  // CRM preview (public demo shell if available)
  const crmCandidates = [
    `${BASE}/artifacts/factory_output/react_mvp/dist/index.html?paid=1`,
    `${BASE}/mvp/?paid=1`,
    `${BASE}/demo/crm?paid=1`,
  ];

  for (const url of crmCandidates) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      if (res && res.ok()) {
        await page.waitForTimeout(1500);
        await page.screenshot({ path: join(outDir, "03-crm-preview.png") });
        console.log("CRM shot from", url);
        break;
      }
    } catch (e) {
      console.log("skip", url, e.message);
    }
  }

  // Also open file:// CRM dist directly
  const dist = join(__dirname, "..", "artifacts", "factory_output", "react_mvp", "dist", "index.html");
  await page.goto(`file://${dist}?paid=1`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(outDir, "03b-crm-dist-file.png") });

  await browser.close();
  console.log("done →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
