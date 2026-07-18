#!/usr/bin/env node
/**
 * Manual-style UI smoke: one niche per major type × language switch EN→DE→RU.
 * Types: beauty, dental, food, logistics, shop, tech
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

const CASES = [
  { sectorId: "beauty", type: "beauty", catalog: /Services|Leistungen|Услуги/i },
  { sectorId: "dental", type: "health", catalog: /Services|Leistungen|Услуги/i },
  { sectorId: "food", type: "restaurant", catalog: /Menu|Speisekarte|Меню/i },
  { sectorId: "logistics", type: "logistics", catalog: /Dashboard|Дашборд/i },
  { sectorId: "shop", type: "shop", catalog: /Products|Produkte|Товары|Продукты/i },
  { sectorId: "tech", type: "tech", catalog: /Products|Produkte|Товары|Продукты/i },
];

const BANNER = {
  en: "Demo version. Choose a plan",
  de: "Demo-Version. Wählen Sie einen Plan",
  ru: "Демо-версия. Выберите тариф",
};

function mime(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

async function main() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    let filePath = path.normalize(
      path.join(dist, url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname)),
    );
    if (!filePath.startsWith(dist)) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dist, "index.html");
    }
    res.writeHead(200, { "Content-Type": mime(filePath) });
    res.end(fs.readFileSync(filePath));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    headless: true,
  });
  const manifestPath = path.join(dist, "client-manifest.json");
  const rows = [];

  try {
    for (const c of CASES) {
      const businessType = sectorMapping[c.sectorId];
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({
          businessName: `Smoke ${c.sectorId}`,
          businessType,
          sectorId: c.sectorId,
          sector_id: c.sectorId,
          language: "en",
          city: "Berlin",
          phone: "+491701234567",
          email: "smoke@example.com",
        }),
      );
      const page = await browser.newPage();
      page.on("pageerror", (e) => {
        rows.push({ niche: c.sectorId, status: "FAIL", note: `pageerror ${e.message}` });
      });
      await page.goto(`http://127.0.0.1:${port}/?clientId=smoke-${c.sectorId}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(500);

      const fails = [];
      for (const lang of ["en", "de", "ru"]) {
        await page.locator("button").filter({ hasText: new RegExp(`^${lang.toUpperCase()}$`) }).click();
        await page.waitForTimeout(450);
        const body = await page.evaluate(() => document.body.innerText);
        if (!body.includes(BANNER[lang])) fails.push(`${lang}:banner`);
        // wrong banner language
        for (const other of ["en", "de", "ru"]) {
          if (other === lang) continue;
          if (body.includes(BANNER[other]) && !body.includes(BANNER[lang])) {
            fails.push(`${lang}:wrong-banner-${other}`);
          }
        }
      }

      await page.locator("button").filter({ hasText: /^DE$/ }).click();
      await page.waitForTimeout(300);
      const settingsBtn = page.locator("aside button").filter({ hasText: /Einstellungen|Settings|Настройки/i }).first();
      if (await settingsBtn.count()) {
        await settingsBtn.click();
        await page.waitForTimeout(300);
        const body = await page.evaluate(() => document.body.innerText);
        if (!body.includes("Branche")) fails.push("settings:Branche");
      }

      const cat = page.locator("aside button").filter({ hasText: c.catalog }).first();
      if (await cat.count()) {
        await cat.click();
        await page.waitForTimeout(400);
      }

      const status = fails.length ? "FAIL" : "PASS";
      rows.push({ niche: c.sectorId, type: c.type, status, note: fails.join("; ") });
      console.log(`${c.sectorId}: ${status}${fails.length ? " — " + fails.join("; ") : ""}`);
      await page.close();
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

  const failed = rows.filter((r) => r.status === "FAIL").length;
  console.log(`\nSMOKE: ${rows.length - failed} PASS / ${failed} FAIL`);
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
