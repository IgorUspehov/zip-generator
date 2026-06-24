#!/usr/bin/env node
/**
 * NICHE VALIDATOR — generic contract for any niche.
 * Discovers niches by scanning public/image-library/ subfolders; no hardcoded niche list.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import imageLibraryConfig from "../config/image-library-niches.json" with { type: "json" };
import sectorMapping from "../config/sector_mapping.json" with { type: "json" };
import nicheLabelsData from "../artifacts/factory_output/react_mvp/src/data/niche-labels.json" with { type: "json" };
import {
  getGalleryImagePaths,
  getHeroImagePath,
  getOgImagePath,
} from "../src/lib/image-library/paths.ts";
import {
  IMAGE_LIBRARY_FOLDERS,
  resolveImageLibraryFolder,
} from "../src/lib/image-library/business-type-map.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LOCALES = ["ru", "de", "en"] as const;
type Locale = (typeof LOCALES)[number];
type Status = "PASS" | "FAIL" | "WARN";

type CheckName =
  | "manifest_mapping"
  | "photo_library"
  | "og_preview"
  | "texts"
  | "render_visibility"
  | "dist_render";

type CheckResult = { status: Status; detail?: string };
type NicheTarget = { businessType: string; folder: string };
type NicheRow = {
  niche: string;
  folder: string;
} & Record<CheckName, CheckResult>;

const CHECKS: CheckName[] = [
  "manifest_mapping",
  "photo_library",
  "og_preview",
  "texts",
  "render_visibility",
  "dist_render",
];

const REQUIRED_PHOTO_FILES = ["hero.jpg", "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "og.jpg"] as const;
const OG_MAX_BYTES = 300 * 1024;
const OG_SIZE_TOLERANCE = 2;
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);
const CYRILLIC_RE = /[\u0400-\u04FF]/;
const APP_JSX_PATH = path.join(ROOT, "artifacts/factory_output/react_mvp/src/App.jsx");
const LIBRARY_ROOT = path.join(ROOT, "public/image-library");
const DIST_ROOT = path.join(ROOT, "mvp-template/dist");
const DIST_LIBRARY_ROOT = path.join(DIST_ROOT, "image-library");
const VALIDATOR_OG_SITE = "https://validator.example.netlify.app";
/** Fallback image-library folder — not a standalone niche to validate. */
const SKIP_LIBRARY_FOLDERS = new Set(["generic"]);

const nicheLabels = nicheLabelsData as Record<
  string,
  {
    panel_title?: Record<string, string>;
    tabs?: Record<string, Record<string, string>>;
    panel_tagline?: Record<string, string>;
  }
>;

function getDisplayName(businessType: string, locale: Locale): string | null {
  const combined = (sectorMapping.business_type_display_names as Record<string, string>)[businessType];
  if (combined?.trim()) {
    const parts = combined.split("/").map((part) => part.trim());
    if (locale === "ru") {
      return parts[0] ?? null;
    }
    return parts[1] ?? parts[0] ?? null;
  }
  const labelsKey = resolveNicheLabelsKey(businessType);
  const panelTitle = nicheLabels[labelsKey]?.panel_title?.[locale];
  return panelTitle?.trim() || null;
}

function pass(detail?: string): CheckResult {
  return { status: "PASS", detail };
}

function fail(detail: string): CheckResult {
  return { status: "FAIL", detail };
}

function warn(detail: string): CheckResult {
  return { status: "WARN", detail };
}

function isJpegFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const head = fs.readFileSync(filePath).subarray(0, 3);
  return head.equals(JPEG_MAGIC);
}

function readDistBundle(): string | null {
  const assetsDir = path.join(DIST_ROOT, "assets");
  if (!fs.existsSync(assetsDir)) {
    return null;
  }
  const jsFile = fs
    .readdirSync(assetsDir)
    .find((name) => name.startsWith("index-") && name.endsWith(".js"));
  return jsFile ? fs.readFileSync(path.join(assetsDir, jsFile), "utf8") : null;
}

function discoverFromFilesystem(): NicheTarget[] {
  if (!fs.existsSync(LIBRARY_ROOT)) {
    return [];
  }
  return fs
    .readdirSync(LIBRARY_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_LIBRARY_FOLDERS.has(entry.name))
    .map((entry) => entry.name)
    .sort()
    .map((folder) => ({
      folder,
      businessType: resolvePrimaryBusinessType(folder),
    }));
}

function resolvePrimaryBusinessType(folder: string): string {
  const sectorHit = Object.values(sectorMapping.sector_id_to_business_type as Record<string, string>).find(
    (businessType) => resolveImageLibraryFolder(businessType) === folder,
  );
  if (sectorHit) {
    return sectorHit;
  }
  const displayHit = Object.keys(sectorMapping.business_type_display_names as Record<string, string>).find(
    (businessType) => resolveImageLibraryFolder(businessType) === folder,
  );
  if (displayHit) {
    return displayHit;
  }
  if ((IMAGE_LIBRARY_FOLDERS as readonly string[]).includes(folder) && resolveImageLibraryFolder(folder) === folder) {
    return folder;
  }
  return folder;
}

function resolveNicheLabelsKey(businessType: string): string {
  const normalized = String(businessType || "").trim();
  if (nicheLabels[normalized]) {
    return normalized;
  }
  const folder = resolveImageLibraryFolder(normalized);
  if (nicheLabels[folder]) {
    return folder;
  }
  if (normalized.endsWith("_crm")) {
    const withoutCrm = normalized.slice(0, -4);
    if (nicheLabels[withoutCrm]) {
      return withoutCrm;
    }
    const crmFolder = resolveImageLibraryFolder(withoutCrm);
    if (nicheLabels[crmFolder]) {
      return crmFolder;
    }
  }
  return normalized;
}

function localeLooksWrong(text: string, locale: Locale): string | null {
  const value = text.trim();
  if (!value) {
    return "empty";
  }
  if (locale === "en" && CYRILLIC_RE.test(value)) {
    return "cyrillic in en";
  }
  if (locale === "ru" && !CYRILLIC_RE.test(value) && /[A-Za-z]{4,}/.test(value)) {
    return "latin-only in ru";
  }
  if (locale === "de" && CYRILLIC_RE.test(value)) {
    return "cyrillic in de";
  }
  return null;
}

function checkManifestMapping(target: NicheTarget): CheckResult {
  const resolved = resolveImageLibraryFolder(target.businessType);
  if (resolved === "generic" && target.businessType !== "generic") {
    return fail(`business_type "${target.businessType}" fell back to generic`);
  }
  if (resolved !== target.folder) {
    return fail(`resolveImageLibraryFolder → "${resolved}", expected "${target.folder}"`);
  }
  const hero = getHeroImagePath(target.businessType);
  const gallery = getGalleryImagePaths(target.businessType);
  const prefix = `/image-library/${target.folder}/`;
  if (!hero.startsWith(prefix) || !gallery.every((item) => item.startsWith(prefix))) {
    return fail(`manifest paths do not use ${prefix}`);
  }
  return pass(`${target.businessType} → ${target.folder}`);
}

function checkPhotoLibrary(target: NicheTarget): CheckResult {
  const dir = path.join(LIBRARY_ROOT, target.folder);
  if (!fs.existsSync(dir)) {
    return fail(`missing ${dir}`);
  }
  const bad: string[] = [];
  for (const fileName of REQUIRED_PHOTO_FILES) {
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) {
      bad.push(`${fileName} missing`);
      continue;
    }
    if (!isJpegFile(filePath)) {
      bad.push(`${fileName} not JPEG (magic bytes)`);
    }
  }
  if (bad.length > 0) {
    return fail(bad.join("; "));
  }
  return pass("hero + 3 gallery + og JPEG");
}

async function checkOgPreview(target: NicheTarget): Promise<CheckResult> {
  const ogPath = path.join(LIBRARY_ROOT, target.folder, "og.jpg");
  const heroPath = path.join(LIBRARY_ROOT, target.folder, "hero.jpg");
  if (!fs.existsSync(ogPath)) {
    return fail("og.jpg missing");
  }
  if (!isJpegFile(ogPath)) {
    return fail("og.jpg not JPEG");
  }
  const bytes = fs.statSync(ogPath).size;
  if (bytes > OG_MAX_BYTES) {
    return fail(`og.jpg ${bytes}B > ${OG_MAX_BYTES}B`);
  }
  if (fs.existsSync(heroPath)) {
    const ogBuf = fs.readFileSync(ogPath);
    const heroBuf = fs.readFileSync(heroPath);
    if (ogBuf.equals(heroBuf)) {
      return fail("og.jpg identical to hero.jpg");
    }
  }
  try {
    const meta = await sharp(ogPath).metadata();
    const widthOk = Math.abs((meta.width ?? 0) - imageLibraryConfig.og_width) <= OG_SIZE_TOLERANCE;
    const heightOk = Math.abs((meta.height ?? 0) - imageLibraryConfig.og_height) <= OG_SIZE_TOLERANCE;
    if (!widthOk || !heightOk) {
      return fail(`og.jpg ${meta.width}x${meta.height}, expected ~${imageLibraryConfig.og_width}x${imageLibraryConfig.og_height}`);
    }
    if (meta.format !== "jpeg") {
      return fail(`og format ${meta.format}`);
    }
    return pass(`${meta.width}x${meta.height}, ${bytes}B`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}

function checkTexts(target: NicheTarget): CheckResult {
  const labelsKey = resolveNicheLabelsKey(target.businessType);
  const config = nicheLabels[labelsKey];
  const issues: string[] = [];

  for (const locale of LOCALES) {
    const displayName = getDisplayName(target.businessType, locale);
    if (!displayName) {
      issues.push(`display name missing (${locale})`);
      continue;
    }
    const displayIssue = localeLooksWrong(displayName, locale);
    if (displayIssue) {
      issues.push(`display ${locale}: ${displayIssue}`);
    }
  }

  if (!config?.tabs || Object.keys(config.tabs).length === 0) {
    issues.push(`menu labels missing for key "${labelsKey}"`);
  } else {
    const dashboard = config.tabs.dashboard ?? config.tabs[Object.keys(config.tabs)[0]];
    for (const locale of LOCALES) {
      const label = dashboard?.[locale]?.trim();
      if (!label) {
        issues.push(`tab label missing (${locale})`);
        continue;
      }
      const tabIssue = localeLooksWrong(label, locale);
      if (tabIssue) {
        issues.push(`tab ${locale}: ${tabIssue}`);
      }
    }
    const panelTitle = config.panel_title;
    if (panelTitle) {
      for (const locale of LOCALES) {
        const title = panelTitle[locale]?.trim();
        if (!title) {
          issues.push(`panel_title empty (${locale})`);
        }
      }
    }
  }

  if (issues.length > 0) {
    return fail(issues.join("; "));
  }
  return pass(`labels key=${labelsKey}`);
}

function checkRenderVisibility(): CheckResult {
  if (!fs.existsSync(APP_JSX_PATH)) {
    return fail("App.jsx missing");
  }
  const src = fs.readFileSync(APP_JSX_PATH, "utf8");

  if (!/function showsDashboardHeroGallery\([^)]*\)\s*\{[\s\S]*?return true;/.test(src)) {
    return fail("showsDashboardHeroGallery must return true for all niches");
  }
  if (/showsDashboardHeroGallery\([^)]*\)[\s\S]{0,200}!isCrmDashboardNiche/.test(src)) {
    return fail("hero/gallery visibility tied to isCrmDashboardNiche");
  }
  if (/REAL_ESTATE_DASHBOARD_MEDIA_NICHES|PHOTO_DENY_NICHES|HIDDEN_GALLERY_NICHES/.test(src)) {
    return fail("niche-specific photo allow/deny list detected");
  }
  const heroGate = src.match(/\{showDashboardHeroGallery\s*&&\s*\([\s\S]{0,400}?heroPhotoSrc/)?.[0];
  if (!heroGate) {
    return fail("hero block not gated by showDashboardHeroGallery");
  }
  if (heroGate.includes("isCrmDashboardNiche") || /\.has\(/.test(heroGate)) {
    return fail("hero block uses niche deny/allow list");
  }
  const galleryGate = src.match(/\{showDashboardHeroGallery\s*&&\s*\([\s\S]{0,400}?gallery-panel/)?.[0];
  if (!galleryGate) {
    return fail("gallery block not gated by showDashboardHeroGallery");
  }
  if (galleryGate.includes("isCrmDashboardNiche") || /\.has\(/.test(galleryGate)) {
    return fail("gallery block uses niche deny/allow list");
  }
  return pass("universal hero/gallery visibility");
}

function patchOgMetaLikeDeploy(html: string, businessType: string, siteUrl: string): string {
  const ogImageUrl = `${siteUrl}${getOgImagePath(businessType)}`;
  const upsert = (input: string, attr: "property" | "name", key: string, content: string) => {
    const pattern = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, "i");
    const tag = `<meta ${attr}="${key}" content="${content}" />`;
    return pattern.test(input) ? input.replace(pattern, tag) : input.replace("</title>", `</title>\n    ${tag}`);
  };
  let next = html;
  next = upsert(next, "property", "og:image", ogImageUrl);
  next = upsert(next, "name", "twitter:image", ogImageUrl);
  return next;
}

function extractMetaContent(html: string, attr: "property" | "name", key: string): string | null {
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, "i");
  const match = html.match(pattern);
  return match?.[1] ?? null;
}

function checkDistRender(target: NicheTarget): CheckResult {
  const issues: string[] = [];
  const distDir = path.join(DIST_LIBRARY_ROOT, target.folder);

  for (const fileName of ["hero.jpg", "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg"]) {
    if (!fs.existsSync(path.join(distDir, fileName))) {
      issues.push(`dist missing ${fileName}`);
    }
  }

  const heroRef = getHeroImagePath(target.businessType);
  const bundle = readDistBundle();
  if (!bundle) {
    issues.push("dist JS bundle missing");
  } else {
    if (!bundle.includes("gallery-panel")) {
      issues.push("bundle missing gallery-panel marker");
    }
    if (!bundle.includes("image-library")) {
      issues.push("bundle missing image-library path prefix");
    }
    if (!bundle.includes("hero.jpg")) {
      issues.push("bundle missing hero.jpg path pattern");
    }
    if (!bundle.includes("gallery-")) {
      issues.push("bundle missing gallery path pattern");
    }
  }

  const indexPath = path.join(DIST_ROOT, "index.html");
  if (!fs.existsSync(indexPath)) {
    issues.push("dist/index.html missing");
  } else {
    const patched = patchOgMetaLikeDeploy(
      fs.readFileSync(indexPath, "utf8"),
      target.businessType,
      VALIDATOR_OG_SITE,
    );
    const ogImage = extractMetaContent(patched, "property", "og:image");
    const twitterImage = extractMetaContent(patched, "name", "twitter:image");
    if (!ogImage?.startsWith("https://")) {
      issues.push(`og:image not absolute URL (got ${ogImage ?? "null"})`);
    }
    if (!twitterImage?.startsWith("https://")) {
      issues.push(`twitter:image not absolute URL (got ${twitterImage ?? "null"})`);
    }
    const expectedSuffix = getOgImagePath(target.businessType);
    if (ogImage && !ogImage.endsWith(expectedSuffix)) {
      issues.push(`og:image path mismatch (expected *${expectedSuffix})`);
    }
  }

  if (issues.length > 0) {
    return fail(issues.join("; "));
  }
  return pass(`${heroRef} + OG https URLs`);
}

function rowOverall(row: NicheRow): Status {
  return CHECKS.every((check) => row[check].status === "PASS") ? "PASS" : "FAIL";
}

function shortCheck(row: NicheRow, check: CheckName): string {
  return row[check].status;
}

function renderMarkdownTable(rows: NicheRow[], mode: string): string {
  const header = ["NICHE", "manifest", "photos", "og", "texts", "render", "dist", "OVERALL"];
  const lines = [
    "# NICHE_VALIDATOR_REPORT",
    "",
    `**Mode:** ${mode}`,
    `**Generated:** ${new Date().toISOString()}`,
    `**Overall:** ${rows.every((row) => rowOverall(row) === "PASS") ? "PASS" : "FAIL"} (${rows.filter((row) => rowOverall(row) === "PASS").length}/${rows.length})`,
    "",
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) =>
      [
        row.niche,
        shortCheck(row, "manifest_mapping"),
        shortCheck(row, "photo_library"),
        shortCheck(row, "og_preview"),
        shortCheck(row, "texts"),
        shortCheck(row, "render_visibility"),
        shortCheck(row, "dist_render"),
        rowOverall(row),
      ].join(" | "),
    ).map((line) => `| ${line} |`),
    "",
    "## Failures",
    "",
  ];

  const failures = rows.filter((row) => rowOverall(row) === "FAIL");
  if (failures.length === 0) {
    lines.push("_None_");
  } else {
    for (const row of failures) {
      lines.push(`### ${row.niche} (${row.folder})`);
      for (const check of CHECKS) {
        if (row[check].status !== "PASS") {
          lines.push(`- **${check}**: ${row[check].detail ?? row[check].status}`);
        }
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

function printConsoleTable(rows: NicheRow[]): void {
  const header = [
    "NICHE".padEnd(22),
    "manifest".padEnd(10),
    "photos".padEnd(10),
    "og".padEnd(10),
    "texts".padEnd(10),
    "render".padEnd(10),
    "dist".padEnd(10),
    "OVERALL",
  ];
  console.log(header.join(" "));
  console.log("-".repeat(header.join(" ").length));
  for (const row of rows) {
    console.log(
      [
        row.niche.padEnd(22),
        shortCheck(row, "manifest_mapping").padEnd(10),
        shortCheck(row, "photo_library").padEnd(10),
        shortCheck(row, "og_preview").padEnd(10),
        shortCheck(row, "texts").padEnd(10),
        shortCheck(row, "render_visibility").padEnd(10),
        shortCheck(row, "dist_render").padEnd(10),
        rowOverall(row),
      ].join(" "),
    );
  }
}

async function validateNiche(target: NicheTarget): Promise<NicheRow> {
  const render = checkRenderVisibility();
  return {
    niche: target.businessType,
    folder: target.folder,
    manifest_mapping: checkManifestMapping(target),
    photo_library: checkPhotoLibrary(target),
    og_preview: await checkOgPreview(target),
    texts: checkTexts(target),
    render_visibility: render,
    dist_render: checkDistRender(target),
  };
}

async function main(): Promise<void> {
  const targets = discoverFromFilesystem();
  const mode = `filesystem scan (${LIBRARY_ROOT}, skip: ${[...SKIP_LIBRARY_FOLDERS].join(", ")})`;

  const rows: NicheRow[] = [];
  for (const target of targets) {
    rows.push(await validateNiche(target));
  }

  const passCount = rows.filter((row) => rowOverall(row) === "PASS").length;
  const overall: Status = passCount === rows.length ? "PASS" : "FAIL";

  printConsoleTable(rows);
  console.log(`\nOverall: ${overall} (${passCount}/${rows.length} niches PASS) [${mode}]`);

  const outDir = path.join(ROOT, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const mdPath = path.join(outDir, "NICHE_VALIDATOR_REPORT.md");
  fs.writeFileSync(mdPath, `${renderMarkdownTable(rows, mode)}\n`);
  console.log(`Report: ${mdPath}`);

  process.exit(overall === "PASS" ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
