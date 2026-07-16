#!/usr/bin/env node
/**
 * Ensure mvp-template/dist exists for local tooling by syncing from client-template/dist.
 * Railway resolveMvpDistPath prefers client-template/dist directly.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "client-template/dist");
const target = path.join(root, "mvp-template/dist");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error("[sync-factory-client-template] missing client-template/dist/index.html");
  console.error("Run from Factory-Website-CRM:");
  console.error("  ./scripts/export-template-dist.sh ../saas-mvp-funnel/client-template/dist");
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log("[sync-factory-client-template] synced", { source, target });
