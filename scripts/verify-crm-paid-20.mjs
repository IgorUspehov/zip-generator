#!/usr/bin/env node
/**
 * Paid CRM matrix verification: 20 niches × empty start + CRUD + payments + no seeds.
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

const KEY_MAP = {
  barbershop: "beauty_salon",
  yoga: "fitness_club",
  cafe: "restaurant",
  tire_service: "car_service",
  car_wash: "cleaning_service",
};

function scenarioKey(sectorId) {
  const bt = sectorMapping[sectorId];
  return scenarios[bt] ? bt : KEY_MAP[sectorId] || bt;
}

function firstSeedName(businessType) {
  const records = scenarios[businessType]?.records || {};
  for (const key of ["clients", "patients", "members", "guests", "students", "products", "services"]) {
    const item = records[key]?.[0];
    if (item?.name?.en) return item.name.en;
    if (item?.title?.en) return item.title.en;
  }
  return null;
}

function mime(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    let filePath = path.normalize(path.join(dist, rel));
    if (!filePath.startsWith(dist)) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dist, "index.html");
    }
    res.writeHead(200, { "Content-Type": mime(filePath) });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

async function main() {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("Build react_mvp first");
    process.exit(1);
  }
  const { server, port } = await startServer();
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    headless: true,
  });
  const manifestPath = path.join(dist, "client-manifest.json");
  const rows = [];

  try {
    for (const sectorId of WIZARD_SECTORS) {
      const businessType = sectorMapping[sectorId];
      const scKey = scenarioKey(sectorId);
      const seedName = firstSeedName(scKey);
      const clientId = `paid20-${sectorId}`;
      const fails = [];

      fs.writeFileSync(
        manifestPath,
        JSON.stringify({
          businessName: `Paid Co ${sectorId}`,
          ownerName: "Owner Test",
          businessType,
          sectorId,
          sector_id: sectorId,
          language: "en",
          city: "Berlin",
          phone: "+49170",
          email: "paid@example.com",
          paid: true,
        }),
      );

      const page = await browser.newPage();
      page.on("pageerror", (e) => fails.push(`pageerror:${e.message.slice(0, 80)}`));

      try {
        await page.goto(`http://127.0.0.1:${port}/?clientId=${clientId}&paid=1`, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        await page.waitForTimeout(700);

        // Clear any leftover storage then reload paid empty
        await page.evaluate((id) => {
          Object.keys(localStorage)
            .filter((k) => k.startsWith(`mvp_crm:${id}:`))
            .forEach((k) => localStorage.removeItem(k));
        }, clientId);
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForTimeout(600);
        await page.locator("button").filter({ hasText: /^EN$/ }).click().catch(() => {});
        await page.waitForTimeout(300);

        let body = await page.evaluate(() => document.body.innerText);
        if (seedName && body.includes(seedName)) {
          fails.push(`seed-leak "${seedName}"`);
        }
        if (/Demo version\\. Choose a plan/.test(body)) {
          fails.push("paywall-shown-on-paid");
        }

        // Open clients-like tab
        const partyBtn = page
          .locator("aside button")
          .filter({ hasText: /Clients|Patients|Members|Guests|Students|Customers/i })
          .first();
        if (await partyBtn.count()) {
          await partyBtn.click();
          await page.waitForTimeout(300);
          const addParty = page.locator("button").filter({ hasText: /Add Client|Add/i }).first();
          if (await addParty.count()) {
            await addParty.click();
            await page.waitForTimeout(200);
            const inputs = page.locator('input[placeholder]');
            if ((await inputs.count()) > 0) {
              await inputs.nth(0).fill(`Party ${sectorId}`);
              if ((await inputs.count()) > 1) await inputs.nth(1).fill("note");
            }
            await page.locator("button").filter({ hasText: /^Save$/ }).first().click();
            await page.waitForTimeout(300);
          }
        }

        // Catalog
        const catalogBtn = page
          .locator("aside button")
          .filter({ hasText: /Services|Products|Menu|Courses|Subscriptions/i })
          .first();
        if (await catalogBtn.count()) {
          await catalogBtn.click();
          await page.waitForTimeout(250);
          const addSvc = page.locator("button").filter({ hasText: /Add Service|Add/i }).first();
          if (await addSvc.count()) {
            await addSvc.click();
            await page.waitForTimeout(150);
            const inputs = page.locator('input[placeholder]');
            if ((await inputs.count()) > 0) {
              await inputs.nth(0).fill(`Catalog ${sectorId}`);
              if ((await inputs.count()) > 1) await inputs.nth(1).fill("€50");
            }
            await page.locator("button").filter({ hasText: /^Save$/ }).first().click();
            await page.waitForTimeout(250);
          }
        }

        // Booking
        const bookBtn = page
          .locator("aside button")
          .filter({
            hasText: /Appointments|Reservations|Viewings|Work Orders|Orders|Deliveries|Projects|Matters|Contracts/i,
          })
          .first();
        if (await bookBtn.count()) {
          await bookBtn.click();
          await page.waitForTimeout(250);
          const addBook = page.locator("button").filter({ hasText: /Add Appointment|Add/i }).first();
          if (await addBook.count()) {
            await addBook.click();
            await page.waitForTimeout(150);
            const inputs = page.locator('input[placeholder]');
            const n = await inputs.count();
            if (n > 0) await inputs.nth(0).fill(`Party ${sectorId}`);
            if (n > 1) await inputs.nth(1).fill(`Catalog ${sectorId}`);
            if (n > 2) await inputs.nth(2).fill("10:00");
            await page.locator("button").filter({ hasText: /^Save$/ }).first().click();
            await page.waitForTimeout(350);
          }
        }

        // Payments
        const payBtn = page.locator("aside button").filter({ hasText: /Payments|Invoices/i }).first();
        if (!(await payBtn.count())) {
          fails.push("payments-nav-missing");
        } else {
          await payBtn.click();
          await page.waitForTimeout(350);
          body = await page.evaluate(() => document.body.innerText);
          // Booking should have created pending payment
          const hasPending = /Pending|Ausstehend|Ожидает/i.test(body);
          const hasParty = body.includes(`Party ${sectorId}`);
          if (!hasParty && !/Add Payment/i.test(body)) {
            fails.push("payments-empty-ui");
          }
          // Must not show Paid without user action on newly created rows — allow empty table
          if (/€89|Anna Petrova|John Smith/i.test(body)) {
            fails.push("demo-payment-seed");
          }
          // Mark paid if pending row exists
          const markBtn = page.locator("button").filter({ hasText: /Mark paid/i }).first();
          if (await markBtn.count()) {
            await markBtn.click();
            await page.waitForTimeout(200);
            body = await page.evaluate(() => document.body.innerText);
            if (!/Paid|Bezahlt|Оплачено/i.test(body)) fails.push("mark-paid-failed");
          } else if (hasPending === false && hasParty === false) {
            // create manual payment
            const addPay = page.locator("button").filter({ hasText: /Add Payment/i }).first();
            if (await addPay.count()) {
              await addPay.click();
              await page.waitForTimeout(150);
              const inputs = page.locator('input[placeholder]');
              if ((await inputs.count()) > 0) await inputs.nth(0).fill(`Party ${sectorId}`);
              if ((await inputs.count()) > 1) await inputs.nth(1).fill("€42");
              await page.locator("button").filter({ hasText: /^Save$/ }).first().click();
              await page.waitForTimeout(250);
              body = await page.evaluate(() => document.body.innerText);
              if (!/Pending/i.test(body)) fails.push("manual-payment-not-pending");
            }
          }
        }

        // Reload persistence
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForTimeout(500);
        body = await page.evaluate(() => document.body.innerText);
        if (seedName && body.includes(seedName)) fails.push(`seed-after-reload "${seedName}"`);

        // Dashboard live counts — open dashboard
        const dash = page.locator("aside button").filter({ hasText: /Dashboard/i }).first();
        if (await dash.count()) {
          await dash.click();
          await page.waitForTimeout(300);
          body = await page.evaluate(() => document.body.innerText);
          // Should show numeric counters (live), not only scenario strings
          if (!/\b[0-9]+\b/.test(body)) fails.push("dashboard-no-counts");
        }

        const status = fails.length ? "FAIL" : "PASS";
        rows.push({ sector: sectorId, status, note: fails.join("; ") });
        console.log(`${sectorId}: ${status}${fails.length ? " — " + fails.join("; ") : ""}`);
      } catch (err) {
        rows.push({ sector: sectorId, status: "FAIL", note: String(err.message || err).slice(0, 120) });
        console.log(`${sectorId}: FAIL — ${err.message || err}`);
      } finally {
        await page.close();
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

  console.log("\n| # | niche | result | note |");
  console.log("|---|---|---|---|");
  rows.forEach((r, i) => {
    console.log(`| ${i + 1} | ${r.sector} | ${r.status} | ${(r.note || "").replace(/\|/g, "/")} |`);
  });
  const passed = rows.filter((r) => r.status === "PASS").length;
  const failed = rows.filter((r) => r.status === "FAIL").length;
  console.log(`\nTOTAL: ${passed} PASS / ${failed} FAIL / ${rows.length}`);
  fs.writeFileSync(
    path.join(root, "artifacts/crm-paid-20-results.json"),
    JSON.stringify({ passed, failed, rows }, null, 2),
  );
  if (failed > 0 || rows.length !== 20) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
