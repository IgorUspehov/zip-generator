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

const checks = [];
const OG_MAX_BYTES = config.og_max_bytes;

function fail(message) {
  checks.push({ ok: false, message });
}

function pass(message) {
  checks.push({ ok: true, message });
}

function assertExists(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing: ${relativePath}`);
    return false;
  }
  pass(`exists: ${relativePath}`);
  return true;
}

function assertOgJpeg(relativePath, maxBytes = OG_MAX_BYTES) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing: ${relativePath}`);
    return;
  }
  const bytes = fs.statSync(absolutePath).size;
  if (bytes > maxBytes) {
    fail(`${relativePath} is ${bytes} bytes (> ${maxBytes})`);
    return;
  }
  let dim = "";
  try {
    dim = execSync(`identify -format "%wx%h" "${absolutePath}"`, { encoding: "utf8" }).trim();
  } catch {
    fail(`${relativePath} invalid image`);
    return;
  }
  if (dim !== `${config.og_width}x${config.og_height}`) {
    fail(`${relativePath} resolution ${dim} (expected ${config.og_width}x${config.og_height})`);
    return;
  }
  pass(`og ok: ${relativePath} (${bytes} bytes, ${dim})`);
}

function readDistBundle() {
  const assetsDir = path.join(projectRoot, "mvp-template/dist/assets");
  if (!fs.existsSync(assetsDir)) {
    fail("missing: mvp-template/dist/assets");
    return null;
  }
  const jsFiles = fs
    .readdirSync(assetsDir)
    .filter((name) => name.startsWith("index-") && name.endsWith(".js"));
  if (jsFiles.length === 0) {
    fail("missing: mvp-template/dist/assets/index-*.js");
    return null;
  }
  const bundlePath = path.join(assetsDir, jsFiles[0]);
  pass(`bundle: mvp-template/dist/assets/${jsFiles[0]}`);
  return fs.readFileSync(bundlePath, "utf8");
}

function findNextChunkWithOgPipeline() {
  const chunksDir = path.join(projectRoot, ".next/server/chunks");
  if (!fs.existsSync(chunksDir)) {
    fail("missing: .next/server/chunks");
    return null;
  }
  const files = fs.readdirSync(chunksDir).filter((name) => name.endsWith(".js"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(chunksDir, file), "utf8");
    if (content.includes("getOgImagePath") && content.includes("/image-library/")) {
      pass(`next chunk uses image-library og.jpg: .next/server/chunks/${file}`);
      return content;
    }
  }
  fail("missing getOgImagePath image-library OG pipeline in .next/server/chunks");
  return null;
}

const md5Seen = new Map();
for (const niche of config.folders) {
  const rel = `public/image-library/${niche}/og.jpg`;
  assertOgJpeg(rel);
  const abs = path.join(projectRoot, rel);
  if (fs.existsSync(abs)) {
    const hash = crypto.createHash("md5").update(fs.readFileSync(abs)).digest("hex");
    if (md5Seen.has(hash)) {
      fail(`duplicate og.jpg: ${niche} same as ${md5Seen.get(hash)}`);
    } else {
      md5Seen.set(hash, niche);
    }
    const heroAbs = path.join(projectRoot, `public/image-library/${niche}/hero.jpg`);
    if (fs.existsSync(heroAbs)) {
      const heroHash = crypto.createHash("md5").update(fs.readFileSync(heroAbs)).digest("hex");
      if (heroHash === hash) {
        fail(`og.jpg equals hero.jpg for ${niche}`);
      } else {
        pass(`og distinct from hero: ${niche}`);
      }
    }
    assertExists(`mvp-template/dist/image-library/${niche}/og.jpg`);
  }
}

const prepareSrc = fs.readFileSync(path.join(projectRoot, "src/lib/og-image/prepare-client-dist.ts"), "utf8");
if (prepareSrc.includes("getOgImagePath") && !prepareSrc.includes("og-preview.png")) {
  pass("prepare-client-dist uses getOgImagePath (not hero/gallery/png)");
} else {
  fail("prepare-client-dist OG pipeline regression");
}

const bundle = readDistBundle();
if (bundle) {
  if (bundle.includes("Test Klinik München") || bundle.includes("Test Klinik")) {
    fail("bundle contains baked clinic title");
  } else {
    pass("bundle has no Test Klinik title");
  }

  if (bundle.includes('"business_type":"health_clinic"') || bundle.includes('business_type:"health_clinic"')) {
    fail("bundle contains baked health_clinic client_data default");
  } else {
    pass("bundle has no baked health_clinic client_data default");
  }
}

findNextChunkWithOgPipeline();

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(item.ok ? `[PASS] ${item.message}` : `[FAIL] ${item.message}`);
}

if (failed.length > 0) {
  process.exit(1);
}

console.log("\nverify:production-assets — all checks passed");
