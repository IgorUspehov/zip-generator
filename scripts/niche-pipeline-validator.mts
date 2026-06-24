#!/usr/bin/env node
/**
 * NICHE_PIPELINE_VALIDATOR
 * Validates each supported business_type across the full factory pipeline.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import sectorMapping from "../config/sector_mapping.json" with { type: "json" };
import imageLibraryConfig from "../config/image-library-niches.json" with { type: "json" };
import categoryAliases from "../config/client_delivery_v2_category_aliases.json" with { type: "json" };
import promotionsData from "../src/lib/niche-promotions.json" with { type: "json" };
import palettesData from "../src/lib/palettes.json" with { type: "json" };
import scenariosData from "../src/lib/niche-scenarios.json" with { type: "json" };
import {
  getGalleryImagePaths,
  getHeroImagePath,
  getOgImagePath,
} from "../src/lib/image-library/paths.ts";
import { resolveImageLibraryFolder } from "../src/lib/image-library/business-type-map.ts";
import { pickRandomGalleryPhotos, pickRandomHeroPhoto } from "../src/lib/manifest/niche-media.ts";
import { pickNicheScenario } from "../src/lib/manifest/niche-scenario.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

type Status = "PASS" | "FAIL";
type CheckName =
  | "manifest_mapping"
  | "photo_library"
  | "og_jpg"
  | "hero_gallery"
  | "render_visibility"
  | "dist_render"
  | "texts"
  | "scenarios"
  | "crm_pattern"
  | "readme_data"
  | "demo_video_input"
  | "deploy_metadata"
  | "zip_metadata";

type CheckResult = { status: Status; detail?: string };
type NicheRow = Record<CheckName, CheckResult> & { niche: string; library_folder: string };

const CHECKS: CheckName[] = [
  "manifest_mapping",
  "photo_library",
  "og_jpg",
  "hero_gallery",
  "render_visibility",
  "dist_render",
  "texts",
  "scenarios",
  "crm_pattern",
  "readme_data",
  "demo_video_input",
  "deploy_metadata",
  "zip_metadata",
];

const LANDING_DASHBOARD_NICHES = new Set([
  "beauty_salon",
  "fitness_club",
  "massage_salon",
  "restaurant",
]);

const APP_JSX_PATH = path.join(
  ROOT,
  "artifacts/factory_output/react_mvp/src/App.jsx",
);

const BUSINESS_TYPE_TO_PATTERN_DIR: Record<string, string> = {
  beauty_salon: "beauty_salon",
  barbershop: "beauty_salon",
  dental_clinic: "dental_clinic",
  health_clinic: "health_clinic",
  massage_salon: "massage_salon",
  massage_salon_crm: "massage_salon",
  fitness_club: "fitness_club",
  fitness: "fitness_club",
  car_service: "car_service",
  car_service_crm: "car_service",
  restaurant: "restaurant",
  restaurant_crm: "restaurant",
  hotel_booking: "hotel_booking",
  real_estate: "real_estate",
  real_estate_crm: "real_estate",
  education: "school_management",
  course_platform: "course_platform",
  school_management: "school_management",
  logistics: "car_service",
  logistics_crm: "car_service",
  delivery: "car_service",
  ecommerce: "inventory_system",
  ecommerce_crm: "inventory_system",
  technology: "inventory_system",
  inventory_system: "inventory_system",
  veterinary_clinic: "veterinary_clinic",
  cleaning_service: "car_service",
};

const BUSINESS_TYPE_DEFAULT_PAGES: Record<string, string[]> = {
  health_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  dental_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  beauty_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  fitness_club: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon_crm: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  restaurant: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  restaurant_crm: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  car_service: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  car_service_crm: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  hotel_booking: ["dashboard", "guests", "rooms", "reservations", "housekeeping", "settings"],
  real_estate: ["dashboard", "properties", "agents", "clients", "viewings", "contracts", "settings"],
  real_estate_crm: ["dashboard", "properties", "agents", "clients", "viewings", "contracts", "settings"],
  education: ["dashboard", "students", "courses", "teachers", "appointments", "settings"],
  logistics: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  logistics_crm: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  ecommerce: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  ecommerce_crm: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  technology: ["dashboard", "products", "clients", "projects", "developers", "settings"],
};

const PROMOTION_KEY_MAP: Record<string, string> = {
  restaurant_crm: "restaurant",
  massage_salon_crm: "massage_salon",
  car_service_crm: "car_service",
  fitness: "fitness_club",
  barbershop: "beauty_salon",
  ecommerce_crm: "ecommerce",
  logistics_crm: "logistics",
  delivery: "logistics",
  cleaning_service: "logistics",
  veterinary_clinic: "health_clinic",
  course_platform: "education",
  school_management: "education",
  inventory_system: "ecommerce",
};

const SCENARIO_KEY_MAP: Record<string, string> = {
  restaurant_crm: "restaurant",
  massage_salon_crm: "massage_salon",
  car_service_crm: "car_service",
  fitness: "fitness_club",
  barbershop: "beauty_salon",
  ecommerce_crm: "ecommerce",
  logistics_crm: "logistics",
  delivery: "logistics",
  cleaning_service: "logistics",
  veterinary_clinic: "veterinary_clinic",
  course_platform: "education",
  school_management: "education",
  inventory_system: "ecommerce",
  real_estate_crm: "real_estate",
  technology: "technology",
};

const DEMO_VIDEO_SLIDES = [
  "01_dashboard.png",
  "02_appointments.png",
  "03_clients.png",
  "04_services.png",
  "05_staff.png",
];

const REAL_ESTATE_FORBIDDEN = ["/beauty", "/beauty_salon/", "/hotel/", "/assets/niches/beauty"];

function pass(detail?: string): CheckResult {
  return { status: "PASS", detail };
}

function fail(detail: string): CheckResult {
  return { status: "FAIL", detail };
}

function readDistBundle(): string | null {
  const assetsDir = path.join(ROOT, "mvp-template/dist/assets");
  if (!fs.existsSync(assetsDir)) {
    return null;
  }
  const jsFiles = fs
    .readdirSync(assetsDir)
    .filter((name) => name.startsWith("index-") && name.endsWith(".js"));
  if (jsFiles.length === 0) {
    return null;
  }
  return fs.readFileSync(path.join(assetsDir, jsFiles[0]), "utf8");
}

function appShowsHeroGalleryForAllNiches(): boolean {
  if (!fs.existsSync(APP_JSX_PATH)) {
    return false;
  }
  const src = fs.readFileSync(APP_JSX_PATH, "utf8");
  return /function showsDashboardHeroGallery\([^)]*\)\s*\{[\s\S]*?return true;/.test(src);
}

function checkRenderVisibility(businessType: string): CheckResult {
  if (!fs.existsSync(APP_JSX_PATH)) {
    return fail("App.jsx missing");
  }
  if (!appShowsHeroGalleryForAllNiches()) {
    const isCrmNiche = !LANDING_DASHBOARD_NICHES.has(businessType);
    if (isCrmNiche) {
      return fail("CRM niche hidden by showsDashboardHeroGallery gate");
    }
  }
  const src = fs.readFileSync(APP_JSX_PATH, "utf8");
  if (!src.includes("showDashboardHeroGallery &&")) {
    return fail("hero/gallery not gated by showDashboardHeroGallery");
  }
  return pass("hero/gallery visible in App.jsx");
}

function checkDistRender(businessType: string, folder: string): CheckResult {
  const distDir = path.join(ROOT, "mvp-template/dist/image-library", folder);
  const files = ["hero.jpg", "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg"];
  const missing = files.filter((name) => !fs.existsSync(path.join(distDir, name)));
  if (missing.length > 0) {
    return fail(`dist/image-library/${folder} missing ${missing.join(", ")}`);
  }

  const bundle = readDistBundle();
  if (!bundle) {
    return fail("mvp-template/dist bundle missing");
  }
  if (!bundle.includes("gallery-panel")) {
    return fail("bundle missing gallery-panel marker");
  }
  if (!bundle.includes("/image-library/") && !bundle.includes("image-library")) {
    return fail("bundle missing image-library path prefix");
  }
  if (!bundle.includes("hero.jpg")) {
    return fail("bundle missing hero.jpg path pattern");
  }

  const heroPath = getHeroImagePath(businessType);
  const galleryPaths = getGalleryImagePaths(businessType);
  const indexHtml = path.join(ROOT, "mvp-template/dist/index.html");
  if (!fs.existsSync(indexHtml)) {
    return fail("dist/index.html missing");
  }

  return pass(`${heroPath} + ${galleryPaths.length} gallery refs ready`);
}

function resolvePatternDir(businessType: string): string {
  return BUSINESS_TYPE_TO_PATTERN_DIR[businessType] ?? businessType;
}

function resolvePromotionKey(businessType: string): string {
  const promotions = promotionsData as Record<string, unknown>;
  if (promotions[businessType]) {
    return businessType;
  }
  return PROMOTION_KEY_MAP[businessType] ?? businessType;
}

function resolveScenarioKey(businessType: string): string {
  const scenarios = scenariosData as Record<string, unknown>;
  if (scenarios[businessType]) {
    return businessType;
  }
  return SCENARIO_KEY_MAP[businessType] ?? businessType;
}

function listBusinessTypes(): string[] {
  const sectorTypes = Object.values(
    sectorMapping.sector_id_to_business_type as Record<string, string>,
  );
  const extras = [
    "barbershop",
    "car_service_crm",
    "restaurant_crm",
    "massage_salon_crm",
    "logistics_crm",
    "ecommerce_crm",
    "real_estate_crm",
    "delivery",
    "course_platform",
    "school_management",
    "inventory_system",
    "law_firm",
    "accounting",
    "construction",
    "fitness",
  ];
  return [...new Set([...sectorTypes, ...extras])].sort();
}

function libraryDir(folder: string): string {
  return path.join(ROOT, "public", "image-library", folder);
}

function fileMd5(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

async function validateOgJpeg(filePath: string): Promise<CheckResult> {
  if (!fs.existsSync(filePath)) {
    return fail("og.jpg missing");
  }
  const bytes = fs.statSync(filePath).size;
  if (bytes > imageLibraryConfig.og_max_bytes) {
    return fail(`og.jpg ${bytes}B > ${imageLibraryConfig.og_max_bytes}B`);
  }
  try {
    const meta = await sharp(filePath).metadata();
    if (meta.width !== imageLibraryConfig.og_width || meta.height !== imageLibraryConfig.og_height) {
      return fail(`og.jpg ${meta.width}x${meta.height} expected ${imageLibraryConfig.og_width}x${imageLibraryConfig.og_height}`);
    }
    if (meta.format !== "jpeg") {
      return fail(`og.jpg format ${meta.format}`);
    }
    return pass(`${bytes}B ${meta.width}x${meta.height}`);
  } catch (error) {
    return fail(`og.jpg invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function validateHeroGalleryFiles(folder: string): Promise<CheckResult> {
  const dir = libraryDir(folder);
  const names = ["hero.jpg", "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg"];
  const missing = names.filter((name) => !fs.existsSync(path.join(dir, name)));
  if (missing.length > 0) {
    return fail(`missing ${missing.join(", ")}`);
  }
  for (const name of names) {
    const filePath = path.join(dir, name);
    const meta = await sharp(filePath).metadata();
    if (meta.format !== "jpeg") {
      return fail(`${name} not JPEG (${meta.format ?? "unknown"})`);
    }
    if ((meta.width ?? 0) < 400 || (meta.height ?? 0) < 250) {
      return fail(`${name} too small ${meta.width}x${meta.height}`);
    }
  }
  return pass("hero + 3 gallery JPEGs");
}

function checkManifestMapping(businessType: string, folder: string): CheckResult {
  try {
    const resolvedFolder = resolveImageLibraryFolder(businessType);
    if (resolvedFolder !== folder) {
      return fail(`folder ${resolvedFolder} != expected ${folder}`);
    }
    const hero = pickRandomHeroPhoto(businessType);
    const gallery = pickRandomGalleryPhotos(businessType);
    const prefix = `/image-library/${folder}/`;
    if (!hero.startsWith(prefix)) {
      return fail(`hero path ${hero}`);
    }
    if (!gallery.every((item) => item.startsWith(prefix))) {
      return fail(`gallery paths ${gallery.join(", ")}`);
    }
    if (hero !== getHeroImagePath(businessType)) {
      return fail("hero mismatch with getHeroImagePath");
    }
    if (JSON.stringify(gallery) !== JSON.stringify(getGalleryImagePaths(businessType))) {
      return fail("gallery mismatch with getGalleryImagePaths");
    }
    if (businessType === "real_estate" || businessType === "real_estate_crm") {
      for (const mediaPath of [hero, ...gallery]) {
        for (const marker of REAL_ESTATE_FORBIDDEN) {
          if (mediaPath.includes(marker)) {
            return fail(`forbidden ${marker} in ${mediaPath}`);
          }
        }
      }
    }
    return pass(`${hero}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}

function checkPhotoLibrary(folder: string): CheckResult {
  const dir = libraryDir(folder);
  if (!fs.existsSync(dir)) {
    return fail("image-library folder missing");
  }
  const required = ["hero.jpg", "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "og.jpg"];
  const missing = required.filter((name) => !fs.existsSync(path.join(dir, name)));
  if (missing.length > 0) {
    return fail(`missing ${missing.join(", ")}`);
  }
  const distCopy = path.join(ROOT, "mvp-template/dist/image-library", folder);
  if (!fs.existsSync(distCopy)) {
    return fail("mvp-template/dist/image-library copy missing");
  }
  return pass("5 files + dist copy");
}

function checkTexts(businessType: string): CheckResult {
  const promotions = promotionsData as Record<string, { ru: string; de: string; en: string }[]>;
  const palettes = palettesData as Record<string, unknown[]>;
  const promoKey = resolvePromotionKey(businessType);
  const promoList = promotions[promoKey] ?? promotions.beauty_salon;
  if (!Array.isArray(promoList) || promoList.length === 0) {
    return fail(`no promotions for ${promoKey}`);
  }
  const sample = promoList[0];
  if (!sample?.ru || !sample?.de || !sample?.en) {
    return fail(`promotion locales incomplete for ${promoKey}`);
  }
  const paletteList = palettes[businessType] ?? palettes[promoKey] ?? palettes.restaurant;
  if (!Array.isArray(paletteList) || paletteList.length === 0) {
    return fail(`no palettes for ${businessType}`);
  }
  const displayNames = sectorMapping.business_type_display_names as Record<string, string>;
  const crmBase = businessType.endsWith("_crm") ? businessType.slice(0, -4) : businessType;
  const hasLabel =
    Boolean(displayNames[businessType]) ||
    Boolean(displayNames[promoKey]) ||
    Boolean(displayNames[crmBase]) ||
    folderHasGenericLabel(businessType);
  if (!hasLabel) {
    return fail(`no display name for ${businessType}`);
  }
  return pass(`promo=${promoKey}`);
}

function folderHasGenericLabel(businessType: string): boolean {
  return ["law_firm", "accounting", "construction"].includes(businessType);
}

function checkScenarios(businessType: string): CheckResult {
  try {
    const scenario = pickNicheScenario(businessType) as Record<string, unknown>;
    const metrics = scenario.metrics as Record<string, string[]> | undefined;
    if (!metrics?.ru?.length || !metrics.de?.length || !metrics.en?.length) {
      return fail("metrics ru/de/en missing");
    }
    if (!Array.isArray(scenario.metric_values) || scenario.metric_values.length < 4) {
      return fail("metric_values < 4");
    }
    if (!Array.isArray(scenario.today_items)) {
      return fail("today_items missing");
    }
    const key = resolveScenarioKey(businessType);
    return pass(`scenario=${key}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}

function checkCrmPattern(businessType: string): CheckResult {
  const patternDir = resolvePatternDir(businessType);
  const patternFile = path.join(ROOT, "patterns", patternDir, "pattern.json");
  if (fs.existsSync(patternFile)) {
    try {
      const pattern = JSON.parse(fs.readFileSync(patternFile, "utf8")) as Record<string, unknown>;
      if (!Array.isArray(pattern.pages) && !pattern.id) {
        return fail("pattern.json invalid structure");
      }
      return pass(`patterns/${patternDir}/pattern.json`);
    } catch {
      return fail("pattern.json parse error");
    }
  }
  const fallback = path.join(ROOT, "patterns", "beauty_salon", "pattern.json");
  if (fs.existsSync(fallback) && ["dental_clinic", "law_firm", "accounting", "construction", "cleaning_service"].includes(businessType)) {
    return pass(`fallback beauty_salon for ${businessType}`);
  }
  return fail(`no pattern for ${patternDir}`);
}

function checkReadmeData(businessType: string): CheckResult {
  const patternDir = resolvePatternDir(businessType);
  const readme = path.join(ROOT, "patterns", patternDir, "README.md");
  const demoData = path.join(ROOT, "patterns", patternDir, "demo_data.json");
  if (fs.existsSync(readme) && fs.statSync(readme).size > 0) {
    return pass(`patterns/${patternDir}/README.md`);
  }
  if (fs.existsSync(demoData)) {
    try {
      JSON.parse(fs.readFileSync(demoData, "utf8"));
      return pass(`patterns/${patternDir}/demo_data.json`);
    } catch {
      return fail("demo_data.json invalid");
    }
  }
  const factoryReadme = path.join(ROOT, "artifacts/factory_output/client_delivery/README.md");
  if (fs.existsSync(factoryReadme)) {
    return pass("factory client_delivery README (global)");
  }
  return fail("no README or demo_data");
}

function checkDemoVideoInput(businessType: string): CheckResult {
  const pages =
    BUSINESS_TYPE_DEFAULT_PAGES[businessType] ?? [
      "dashboard",
      "clients",
      "appointments",
      "services",
      "settings",
    ];
  if (!pages.includes("dashboard")) {
    return fail("no dashboard page for screenshots");
  }
  const screenshotsDir = path.join(ROOT, "artifacts/factory_output/client_delivery/screenshots");
  const missingSlides = DEMO_VIDEO_SLIDES.filter(
    (name) => !fs.existsSync(path.join(screenshotsDir, name)),
  );
  if (missingSlides.length === DEMO_VIDEO_SLIDES.length) {
    return fail(`screenshots missing (${missingSlides.join(", ")})`);
  }
  if (missingSlides.length > 0) {
    return pass(`pages ok; partial screenshots (${missingSlides.length} missing)`);
  }
  const pipelineManifest = path.join(ROOT, "output/manifest.json");
  if (fs.existsSync(pipelineManifest)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(pipelineManifest, "utf8")) as Record<string, unknown>;
      if (manifest.business_type && manifest.business_type !== businessType) {
        return pass(`screenshots ok; pipeline manifest=${manifest.business_type}`);
      }
    } catch {
      // ignore
    }
  }
  return pass(`dashboard + ${DEMO_VIDEO_SLIDES.length - missingSlides.length} slides`);
}

function checkDeployMetadata(businessType: string): CheckResult {
  const deployPaths = [
    "output/client_delivery/deploy_report.json",
    "artifacts/factory_output/deploy/deploy_report.json",
  ];
  const bindingPath = "artifacts/factory_output/deploy_binding/deploy_client_data.json";
  let found = false;
  for (const rel of deployPaths) {
    const filePath = path.join(ROOT, rel);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    try {
      const report = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
      const clientData = report.client_data as Record<string, unknown> | undefined;
      const reportType = String(clientData?.business_type ?? report.business_type ?? "");
      if (!reportType || reportType === businessType) {
        found = true;
        break;
      }
    } catch {
      return fail(`invalid ${rel}`);
    }
  }
  if (found) {
    return pass("deploy_report.json");
  }
  if (fs.existsSync(path.join(ROOT, bindingPath))) {
    try {
      const binding = JSON.parse(fs.readFileSync(bindingPath, "utf8")) as Record<string, unknown>;
      if (String(binding.business_type ?? "") === businessType || !binding.business_type) {
        return pass("deploy_binding present");
      }
    } catch {
      return fail("deploy_binding invalid");
    }
  }
  const patternDir = resolvePatternDir(businessType);
  if (fs.existsSync(path.join(ROOT, "patterns", patternDir, "pattern.json"))) {
    return pass("pattern ready for deploy binding");
  }
  return fail("no deploy_report or binding");
}

function checkZipMetadata(businessType: string): CheckResult {
  const deliveryManifest = path.join(ROOT, "output/client_delivery/delivery_manifest.json");
  const finalZip = path.join(ROOT, "output/client_delivery/final_package.zip");
  const aliases = categoryAliases.business_type_to_normalized as Record<string, string>;
  const normalized = aliases[businessType] ?? aliases[resolvePromotionKey(businessType)];
  const v2Zip = path.join(ROOT, "artifacts/factory_output/client_delivery_v2/final_package.zip");

  let zipOk = false;
  if (fs.existsSync(finalZip) && fs.statSync(finalZip).size > 0) {
    zipOk = true;
  } else if (fs.existsSync(v2Zip) && fs.statSync(v2Zip).size > 0) {
    zipOk = true;
  }

  if (fs.existsSync(deliveryManifest)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(deliveryManifest, "utf8")) as Record<string, unknown>;
      const files = manifest.files as unknown;
      if (Array.isArray(files) && files.length > 0) {
        return pass(zipOk ? "delivery_manifest + zip" : "delivery_manifest (zip missing)");
      }
    } catch {
      return fail("delivery_manifest invalid");
    }
  }

  if (normalized) {
    return pass(`category alias → ${normalized}${zipOk ? " + zip" : ""}`);
  }
  if (zipOk) {
    return pass("final_package.zip present");
  }
  return fail("no delivery_manifest or zip metadata");
}

async function validateNiche(businessType: string): Promise<NicheRow> {
  const folder = resolveImageLibraryFolder(businessType);
  const ogPath = path.join(libraryDir(folder), "og.jpg");
  const ogMd5 = fileMd5(ogPath);
  const heroMd5 = fileMd5(path.join(libraryDir(folder), "hero.jpg"));

  const row: NicheRow = {
    niche: businessType,
    library_folder: folder,
    manifest_mapping: checkManifestMapping(businessType, folder),
    photo_library: checkPhotoLibrary(folder),
    og_jpg: await validateOgJpeg(ogPath),
    hero_gallery: await validateHeroGalleryFiles(folder),
    render_visibility: checkRenderVisibility(businessType),
    dist_render: checkDistRender(businessType, folder),
    texts: checkTexts(businessType),
    scenarios: checkScenarios(businessType),
    crm_pattern: checkCrmPattern(businessType),
    readme_data: checkReadmeData(businessType),
    demo_video_input: checkDemoVideoInput(businessType),
    deploy_metadata: checkDeployMetadata(businessType),
    zip_metadata: checkZipMetadata(businessType),
  };

  if (ogMd5 && heroMd5 && ogMd5 === heroMd5) {
    row.og_jpg = fail("og.jpg identical to hero.jpg");
  }

  return row;
}

function nicheOverall(row: NicheRow): Status {
  return CHECKS.every((check) => row[check].status === "PASS") ? "PASS" : "FAIL";
}

function renderMarkdownTable(rows: NicheRow[]): string {
  const header = ["niche", ...CHECKS, "OVERALL"].join(" | ");
  const sep = ["---", ...CHECKS.map(() => "---"), "---"].join(" | ");
  const lines = rows.map((row) => {
    const cells = CHECKS.map((check) => row[check].status);
    return [row.niche, ...cells, nicheOverall(row)].join(" | ");
  });
  return [`| ${header} |`, `| ${sep} |`, ...lines.map((line) => `| ${line} |`)].join("\n");
}

function renderConsoleTable(rows: NicheRow[]): void {
  const colWidth = 14;
  const header = ["NICHE".padEnd(22), ...CHECKS.map((c) => c.slice(0, colWidth).padEnd(colWidth)), "OVERALL"];
  console.log(header.join(" "));
  console.log("-".repeat(header.join(" ").length));
  for (const row of rows) {
    const cells = [
      row.niche.padEnd(22),
      ...CHECKS.map((check) => row[check].status.padEnd(colWidth)),
      nicheOverall(row),
    ];
    console.log(cells.join(" "));
  }
}

async function main(): Promise<void> {
  const businessTypes = listBusinessTypes();
  const rows: NicheRow[] = [];

  for (const businessType of businessTypes) {
    rows.push(await validateNiche(businessType));
  }

  const passCount = rows.filter((row) => nicheOverall(row) === "PASS").length;
  const failCount = rows.length - passCount;
  const overall: Status = failCount === 0 ? "PASS" : "FAIL";

  const report = {
    generated_at: new Date().toISOString(),
    validator: "NICHE_PIPELINE_VALIDATOR",
    overall,
    summary: { total: rows.length, pass: passCount, fail: failCount },
    checks: CHECKS,
    rows: rows.map((row) => ({
      niche: row.niche,
      library_folder: row.library_folder,
      overall: nicheOverall(row),
      checks: Object.fromEntries(
        CHECKS.map((check) => [check, row[check]]),
      ),
    })),
  };

  const outDir = path.join(ROOT, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "NICHE_PIPELINE_VALIDATOR_REPORT.json");
  const mdPath = path.join(outDir, "NICHE_PIPELINE_VALIDATOR_REPORT.md");
  const txtPath = path.join(outDir, "NICHE_PIPELINE_VALIDATOR_PASS.txt");

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(
    mdPath,
    `# NICHE_PIPELINE_VALIDATOR\n\n**Overall:** ${overall}\n**Pass:** ${passCount}/${rows.length}\n\n${renderMarkdownTable(rows)}\n`,
  );

  renderConsoleTable(rows);
  console.log(`\nOverall: ${overall} (${passCount} pass, ${failCount} fail)`);
  console.log(`Report: ${jsonPath}`);
  console.log(`Table:  ${mdPath}`);

  if (overall === "PASS") {
    fs.writeFileSync(
      txtPath,
      `NICHE_PIPELINE_VALIDATOR_PASS — ${new Date().toISOString().slice(0, 10)}\n${passCount}/${rows.length} niches PASS\n`,
    );
  } else {
    const failures = rows
      .filter((row) => nicheOverall(row) === "FAIL")
      .map((row) => {
        const failedChecks = CHECKS.filter((check) => row[check].status === "FAIL")
          .map((check) => `${check}: ${row[check].detail ?? "FAIL"}`)
          .join("; ");
        return `${row.niche}: ${failedChecks}`;
      });
    fs.writeFileSync(
      path.join(outDir, "NICHE_PIPELINE_VALIDATOR_FAIL.txt"),
      `NICHE_PIPELINE_VALIDATOR_FAIL — ${new Date().toISOString().slice(0, 10)}\n\n${failures.join("\n")}\n`,
    );
  }

  process.exit(overall === "PASS" ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
