#!/usr/bin/env node
/**
 * Final release smoke (#8): tariffs + paid CRM + i18n banner matrix.
 * Writes docs/final-smoke-results.json
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3010";

const steps = [
  { id: "tariffs", cmd: ["node", "scripts/smoke-tariffs.mjs"], env: { SCREENSHOT_BASE_URL: base } },
  { id: "paid-20", cmd: ["node", "scripts/verify-crm-paid-20.mjs"] },
  { id: "i18n-60", cmd: ["node", "scripts/verify-crm-i18n-60.mjs"] },
];

const rows = [];
for (const step of steps) {
  console.log("\n===", step.id, "===");
  const r = spawnSync(step.cmd[0], step.cmd.slice(1), {
    cwd: root,
    env: { ...process.env, ...(step.env || {}) },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 900_000,
  });
  const out = `${r.stdout || ""}\n${r.stderr || ""}`.trim();
  const pass = r.status === 0;
  console.log(out.slice(-2000));
  rows.push({ id: step.id, status: pass ? "PASS" : "FAIL", exit: r.status ?? 1 });
  if (!pass) {
    console.error("FAIL step", step.id);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  base,
  passed: rows.filter((r) => r.status === "PASS").length,
  failed: rows.filter((r) => r.status === "FAIL").length,
  rows,
};

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(
  path.join(root, "docs/final-smoke-results.json"),
  JSON.stringify(summary, null, 2),
);

console.log("\n| step | status |");
console.log("|---|---|");
for (const r of rows) console.log(`| ${r.id} | ${r.status} |`);
console.log(`\n${summary.passed} PASS / ${summary.failed} FAIL`);
process.exit(summary.failed ? 1 : 0);
