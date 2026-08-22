import fs from "fs";
import os from "os";
import path from "path";

import { slugifyProjectSegment } from "@/lib/cloudflare/deploy";
import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { loadClientManifest } from "@/lib/manifest/storage";
import { buildClientDistZipBuffer } from "@/lib/mvp-pro/zip-stream";
import {
  clientDistExists,
  resolveClientDistPath,
  resolveClientDistsRoot,
} from "@/lib/site-delivery/dist-store";

import { buildDeployableZipReadme } from "@/lib/deployable-zip/readme";
import { resolvePublicAppOrigin } from "@/lib/cloudflare/shared-project";
import {
  collectClientIdMentions,
  sanitizeManifestForZip,
  sanitizeStagingDist,
} from "@/lib/deployable-zip/sanitize";
import {
  findRemainingPaywallMarkers,
  stripDemoPaywallFromDist,
} from "@/lib/deployable-zip/strip-demo-paywall";
import type {
  BuildDeployableZipInput,
  DeployableZipBuildResult,
  DeployableZipIsolationReport,
  DeployableZipSecurityReport,
} from "@/lib/deployable-zip/types";

export class DeployableZipError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DeployableZipError";
    this.code = code;
  }
}

function assertSafeClientId(clientId: string): string {
  const id = String(clientId || "").trim();
  if (!id) {
    throw new DeployableZipError("INVALID_CLIENT_ID", "clientId is required");
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new DeployableZipError("INVALID_CLIENT_ID", "clientId has invalid characters");
  }
  return id;
}

/**
 * Ensure distPath resolves under this client's client-dists folder (data isolation).
 */
export function assertDistBelongsToClient(clientId: string, distPath: string): string {
  const resolvedDist = path.resolve(distPath);
  const expectedRoot = path.resolve(resolveClientDistPath(clientId));
  const clientRoot = path.resolve(path.join(resolveClientDistsRoot(), clientId));

  if (resolvedDist !== expectedRoot && !resolvedDist.startsWith(`${clientRoot}${path.sep}`)) {
    throw new DeployableZipError(
      "DIST_ISOLATION",
      `distPath must be under client-dists/${clientId}; got ${resolvedDist}`,
    );
  }

  if (!fs.existsSync(path.join(resolvedDist, "index.html"))) {
    throw new DeployableZipError("DIST_MISSING", `index.html not found in ${resolvedDist}`);
  }

  return resolvedDist;
}

export function resolveDeployableDistPath(clientId: string, distPath?: string): string {
  const id = assertSafeClientId(clientId);
  if (distPath?.trim()) {
    return assertDistBelongsToClient(id, distPath.trim());
  }
  if (!clientDistExists(id)) {
    throw new DeployableZipError(
      "DIST_MISSING",
      `No client-dists snapshot for clientId=${id}`,
    );
  }
  return assertDistBelongsToClient(id, resolveClientDistPath(id));
}

export function buildDeployableZipFilename(
  clientId: string,
  _mode: string,
  businessName?: string,
): string {
  const nameSlug = slugifyProjectSegment(businessName || "").slice(0, 72);
  if (nameSlug) {
    return `${nameSlug}.zip`;
  }
  const safeId = clientId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 12) || "site";
  return `site-${safeId}.zip`;
}

/** Buyer-facing public fields for Netlify self-host packages. */
export function enrichPublicManifestForBuyer(
  manifest: Record<string, unknown>,
  clientId: string,
): Record<string, unknown> {
  const businessName =
    pickString(manifest.businessName) ||
    pickString(manifest.business_name) ||
    "My Business";
  const niche =
    pickString(manifest.niche) ||
    pickString(manifest.businessType) ||
    pickString(manifest.business_type) ||
    "business";
  const language = pickString(manifest.language) || pickString(manifest.lang) || "en";

  return {
    ...manifest,
    clientId,
    client_id: clientId,
    businessName,
    business_name: businessName,
    niche,
    businessType: pickString(manifest.businessType) || niche,
    business_type: pickString(manifest.business_type) || niche,
    language,
    paid: true,
    deployablePaid: true,
    _editHint:
      "Change businessName and niche, save this file, re-upload the folder to Netlify.",
  };
}

export function buildDeployableZipEnvExample(manifest: Record<string, unknown>): string {
  const businessName = pickString(manifest.businessName) || "My Business";
  const niche =
    pickString(manifest.niche) ||
    pickString(manifest.businessType) ||
    "business";
  const language = pickString(manifest.language) || "en";
  const city = pickString(manifest.city) || "";
  const phone = pickString(manifest.phone) || "";
  const email = pickString(manifest.email) || "";

  return [
    "# Optional local overrides for documentation / tooling.",
    "# The live static site reads client-manifest.json — edit that file to change branding.",
    "",
    `BUSINESS_NAME=${businessName}`,
    `NICHE=${niche}`,
    `BUSINESS_TYPE=${niche}`,
    `LANGUAGE=${language}`,
    city ? `CITY=${city}` : "CITY=",
    phone ? `PHONE=${phone}` : "PHONE=",
    email ? `EMAIL=${email}` : "EMAIL=",
    "",
  ].join("\n");
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveReadmeContext(
  input: BuildDeployableZipInput,
  manifest: Record<string, unknown>,
  clientId: string,
): BuildDeployableZipInput["readme"] {
  const languageRaw = pickString(input.readme?.language) || pickString(manifest.language);
  const language =
    languageRaw === "ru" || languageRaw === "de" || languageRaw === "en" ? languageRaw : "en";

  let demoSlug = "";
  try {
    demoSlug = pickString(findDemoByClientId(clientId)?.slug);
  } catch {
    demoSlug = "";
  }

  const slug =
    pickString(input.readme?.slug) ||
    pickString(manifest.slug) ||
    pickString(manifest.demoSlug) ||
    pickString(manifest.publicSlug) ||
    demoSlug;

  const publicOrigin =
    pickString(input.readme?.publicOrigin) ||
    pickString(manifest.publicOrigin) ||
    (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "") ||
    undefined;

  return {
    businessName:
      input.readme?.businessName ||
      pickString(manifest.businessName) ||
      pickString(manifest.business_name) ||
      "Website + CRM",
    businessType:
      input.readme?.businessType ||
      pickString(manifest.businessType) ||
      pickString(manifest.business_type) ||
      "business",
    language,
    supportNote: input.readme?.supportNote,
    slug: slug || undefined,
    publicOrigin,
  };
}

function writeStagingFromDist(distPath: string, clientId: string): string {
  const stagingPath = fs.mkdtempSync(path.join(os.tmpdir(), `deployable-zip-${clientId}-`));
  fs.cpSync(distPath, stagingPath, { recursive: true });
  return stagingPath;
}


/**
 * Drop shared demo bulk that is not needed for this client's static host package.
 * Keeps hashed JS/CSS, this client's niche assets, and image-library.
 */
function slimStagingForClient(stagingPath: string, manifest: Record<string, unknown>): string[] {
  const removed: string[] = [];
  const niche = String(manifest.niche || manifest.businessType || manifest.business_type || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const nichesRoot = path.join(stagingPath, "assets", "niches");
  if (niche && fs.existsSync(nichesRoot)) {
    for (const entry of fs.readdirSync(nichesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.toLowerCase() === niche) continue;
      const full = path.join(nichesRoot, entry.name);
      fs.rmSync(full, { recursive: true, force: true });
      removed.push(`assets/niches/${entry.name}`);
    }
  }

  const assetsRoot = path.join(stagingPath, "assets");
  if (fs.existsSync(assetsRoot)) {
    for (const entry of fs.readdirSync(assetsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (name === "niches" || name === "images") continue;
      // Keep sector demo folder only when it matches this niche (e.g. real_estate_crm).
      const keep =
        Boolean(niche) &&
        (name.toLowerCase() === niche ||
          name.toLowerCase() === `${niche}_crm` ||
          name.toLowerCase().startsWith(`${niche}_`));
      if (keep) continue;
      // Demo GIF packs for other verticals — safe to drop for a single-client ZIP.
      const full = path.join(assetsRoot, name);
      const hasOnlyMedia =
        fs.existsSync(path.join(full, "gif")) ||
        /_crm$/i.test(name) ||
        /_salon$|_clinic$|_booking$|_platform$|_system$|_management$/i.test(name);
      if (!hasOnlyMedia) continue;
      fs.rmSync(full, { recursive: true, force: true });
      removed.push(`assets/${name}`);
    }
  }

  // Netlify SPA fallback (harmless for single-page shell).
  const redirects = "/*    /index.html   200\n";
  fs.writeFileSync(path.join(stagingPath, "_redirects"), redirects, "utf8");
  const netlifyToml = `[build]\n  publish = "."\n\n[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n`;
  fs.writeFileSync(path.join(stagingPath, "netlify.toml"), netlifyToml, "utf8");

  return removed;
}

function cleanupStaging(stagingPath: string): void {
  try {
    fs.rmSync(stagingPath, { recursive: true, force: true });
  } catch (error) {
    console.warn("[deployable-zip] failed to cleanup staging", {
      stagingPath,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Canonical Deployable ZIP Builder V2.
 * Packs only `client-dists/{clientId}` (or an explicitly validated path under that root).
 * Reuses `buildClientDistZipBuffer` / `createMvpProZipStream` for archive creation.
 */
export async function buildDeployableZip(
  input: BuildDeployableZipInput,
): Promise<DeployableZipBuildResult> {
  const clientId = assertSafeClientId(input.clientId);
  const distPath = resolveDeployableDistPath(clientId, input.distPath);

  const rawManifest =
    input.manifest && typeof input.manifest === "object"
      ? input.manifest
      : loadClientManifest(clientId) || {};

  const {
    manifest: sanitizedManifest,
    findings: manifestFindings,
    strippedKeys,
  } = sanitizeManifestForZip(rawManifest, clientId);

  const publicManifest = enrichPublicManifestForBuyer(sanitizedManifest, clientId);
  const saasOrigin = resolvePublicAppOrigin();
  if (!pickString(publicManifest.publicSiteUrl)) {
    publicManifest.publicSiteUrl = `${saasOrigin}/site/${encodeURIComponent(clientId)}`;
  }
  if (!pickString(publicManifest.siteUrl)) {
    publicManifest.siteUrl = String(publicManifest.publicSiteUrl);
  }

  const stagingPath = writeStagingFromDist(distPath, clientId);

  try {
    fs.writeFileSync(
      path.join(stagingPath, "client-manifest.json"),
      `${JSON.stringify(publicManifest, null, 2)}\n`,
      "utf8",
    );

    fs.writeFileSync(
      path.join(stagingPath, ".env.example"),
      buildDeployableZipEnvExample(publicManifest),
      "utf8",
    );

    const stagingSanitize = sanitizeStagingDist(stagingPath);
    const paywallStripped = stripDemoPaywallFromDist(stagingPath, saasOrigin);
    const paywallLeftovers = findRemainingPaywallMarkers(stagingPath);
    if (!paywallStripped.length) {
      console.warn("[deployable-zip] demo paywall strip touched 0 files", { clientId });
    }
    if (paywallLeftovers.length) {
      throw new DeployableZipError(
        "PAYWALL_STRIP_FAILED",
        `Deployable ZIP still contains demo paywall UI after unlock: ${paywallLeftovers.slice(0, 3).join("; ")}`,
      );
    }

    const RU_DEMO_BANNER = "Демо-версия. Выберите тариф, чтобы продолжить.";
    const jsHits: string[] = [];
    const walkJs = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkJs(full);
          continue;
        }
        if (!/\.(js|mjs|cjs)$/i.test(entry.name)) continue;
        const text = fs.readFileSync(full, "utf8");
        if (text.includes(RU_DEMO_BANNER)) {
          jsHits.push(path.relative(stagingPath, full).replace(/\\/g, "/"));
        }
      }
    };
    walkJs(stagingPath);
    if (jsHits.length) {
      throw new DeployableZipError(
        "PAYWALL_STRIP_FAILED",
        `RU demo banner still present after stripDemoPaywallFromDist: ${jsHits.join(", ")}`,
      );
    }

    const slimRemoved = slimStagingForClient(stagingPath, publicManifest);
    if (slimRemoved.length) {
      console.info("[deployable-zip] slimmed staging", { clientId, removed: slimRemoved.length });
    }
    const mentions = collectClientIdMentions(stagingPath, clientId);

    const isolation: DeployableZipIsolationReport = {
      expectedClientId: clientId,
      foreignClientIds: mentions.foreignClientIds,
      manifestClientId: mentions.manifestClientId,
      bakedClientId: mentions.bakedClientId,
      ok: mentions.foreignClientIds.length === 0,
    };

    if (!isolation.ok) {
      console.warn("[deployable-zip] foreign clientId mentions detected in staging", {
        clientId,
        foreignClientIds: isolation.foreignClientIds,
        bakedClientId: isolation.bakedClientId,
        manifestClientId: isolation.manifestClientId,
      });
    }

    const security: DeployableZipSecurityReport = {
      findings: [...manifestFindings, ...stagingSanitize.findings],
      excludedFiles: stagingSanitize.excludedFiles,
      redactedFiles: stagingSanitize.redactedFiles,
      strippedManifestKeys: strippedKeys,
    };

    const readmeContext = resolveReadmeContext(input, publicManifest, clientId);
    const readmeContent = buildDeployableZipReadme({
      clientId,
      mode: input.mode,
      context: readmeContext,
    });

    const manifestJson = `${JSON.stringify(publicManifest, null, 2)}\n`;
    const buffer = await buildClientDistZipBuffer({
      distPath: stagingPath,
      readmeContent,
    });

    const businessName =
      pickString(publicManifest.businessName) || pickString(publicManifest.business_name);
    const filename = buildDeployableZipFilename(clientId, input.mode, businessName);

    console.info("[deployable-zip] built", {
      clientId,
      mode: input.mode,
      businessName: businessName || null,
      filename,
      bytes: buffer.length,
      securityFindings: security.findings.length,
      isolationOk: isolation.ok,
      paywallStripped: paywallStripped.length,
    });

    return {
      clientId,
      mode: input.mode,
      filename,
      distPath,
      stagingPath: "",
      readmeContent,
      manifestJson,
      security,
      isolation,
      buffer,
    };
  } finally {
    cleanupStaging(stagingPath);
  }
}

/** Stream-friendly helper: build buffer then expose metadata without keeping staging. */
export async function buildDeployableZipBuffer(
  input: BuildDeployableZipInput,
): Promise<{ buffer: Buffer; filename: string; result: Omit<DeployableZipBuildResult, "buffer"> }> {
  const result = await buildDeployableZip(input);
  const { buffer, ...meta } = result;
  return { buffer, filename: result.filename, result: meta };
}
