#!/usr/bin/env node
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const config = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "config/image-library-niches.json"), "utf8"),
);
const OG_MAX_BYTES = config.og_max_bytes;
const REQUIRED_WIDTH = config.og_width;
const REQUIRED_HEIGHT = config.og_height;

const md5Index = new Map();
const rows = [];
let failCount = 0;

function md5File(filePath) {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

function getDimensions(filePath) {
  try {
    return execSync(`identify -format "%wx%h" "${filePath}"`, { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

for (const niche of config.folders) {
  const ogPath = path.join(projectRoot, "public/image-library", niche, "og.jpg");
  const exists = fs.existsSync(ogPath);
  if (!exists) {
    rows.push({ niche, exists: false, size: "-", resolution: "-", status: "FAIL" });
    failCount += 1;
    continue;
  }

  const size = fs.statSync(ogPath).size;
  const resolution = getDimensions(ogPath);
  const md5 = md5File(ogPath);
  const duplicateOf = [...md5Index.entries()].find(([, hash]) => hash === md5)?.[0] ?? null;
  md5Index.set(niche, md5);

  const heroPath = path.join(projectRoot, "public/image-library", niche, "hero.jpg");
  const sameAsHero = fs.existsSync(heroPath) && md5File(heroPath) === md5;

  let status = "PASS";
  if (resolution !== `${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}`) {
    status = "FAIL";
    failCount += 1;
  } else if (size > OG_MAX_BYTES) {
    status = "FAIL";
    failCount += 1;
  } else if (duplicateOf) {
    status = "FAIL";
    failCount += 1;
  } else if (sameAsHero) {
    status = "FAIL";
    failCount += 1;
  }

  rows.push({
    niche,
    exists: true,
    size,
    resolution,
    status,
    duplicateOf,
    sameAsHero,
  });
}

console.log("OG LIBRARY AUDIT");
console.log("NICHE | OG EXISTS | SIZE | RESOLUTION | PASS/FAIL");
for (const row of rows) {
  const sizeLabel = row.exists ? `${row.size} B` : "-";
  console.log(`${row.niche} | ${row.exists ? "yes" : "no"} | ${sizeLabel} | ${row.resolution} | ${row.status}`);
}

const placeholders = fs.existsSync(path.join(projectRoot, "output/OG_LIBRARY_PLACEHOLDERS.json"))
  ? JSON.parse(fs.readFileSync(path.join(projectRoot, "output/OG_LIBRARY_PLACEHOLDERS.json"), "utf8"))
  : [];

if (placeholders.length > 0) {
  console.log("\nPLACEHOLDER OG IMAGES:");
  for (const item of placeholders) {
    console.log(`- ${item.folder} → ${item.ogPath}`);
  }
}

const prepareSrc = fs.readFileSync(
  path.join(projectRoot, "src/lib/og-image/prepare-client-dist.ts"),
  "utf8",
);
const ogPipelineOk =
  prepareSrc.includes("getOgImagePath") &&
  !prepareSrc.includes("og-preview.png") &&
  !prepareSrc.includes("hero.jpg") &&
  !prepareSrc.includes("gallery-");

console.log(`\nprepareClientDistWithOgImage uses getOgImagePath only: ${ogPipelineOk ? "PASS" : "FAIL"}`);
if (!ogPipelineOk) {
  failCount += 1;
}

console.log(`\nOG_LIBRARY_AUDIT: ${failCount === 0 ? "PASS" : "FAIL"} (${failCount} failures)`);
process.exit(failCount === 0 ? 0 : 1);
