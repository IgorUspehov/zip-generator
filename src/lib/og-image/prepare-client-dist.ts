import fs from "fs";
import os from "os";
import path from "path";

import {
  ensureImageLibraryInDist,
  getOgImagePath,
} from "@/lib/image-library";
import { buildFactoryBootstrap } from "@/lib/factory-crm/mapToFactoryManifest";

const RAILWAY_FRAME_ANCESTOR = "https://saas-mvp-funnel-production.up.railway.app";

/** Cloudflare Pages _headers — allow Live Preview iframe from Railway only. */
export const CLIENT_DIST_HEADERS = `/*
  ! X-Frame-Options
  Content-Security-Policy: frame-ancestors 'self' ${RAILWAY_FRAME_ANCESTOR}
`;

type ManifestLike = {
  businessName?: unknown;
  businessType?: unknown;
  [key: string]: unknown;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBusinessTypeLabel(businessType: string): string {
  return String(businessType || "business")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function writeClientDistHeaders(stagingDir: string): void {
  const headersPath = path.join(stagingDir, "_headers");
  fs.writeFileSync(headersPath, `${CLIENT_DIST_HEADERS.trim()}\n`, "utf8");
  console.log("[og-image] wrote _headers for Railway iframe embedding", {
    headersPath,
    frameAncestor: RAILWAY_FRAME_ANCESTOR,
  });
}

function writeSpaRedirects(stagingDir: string): void {
  const redirectsPath = path.join(stagingDir, "_redirects");
  if (!fs.existsSync(redirectsPath)) {
    fs.writeFileSync(redirectsPath, "/*    /index.html   200\n", "utf8");
  }
}

function patchClientIndexHtml(
  stagingDir: string,
  manifest: ManifestLike,
  siteUrl?: string,
  clientId?: string,
): void {
  const indexPath = path.join(stagingDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("[og-image] index.html not found in staging dist:", indexPath);
    return;
  }

  const businessName = String(manifest.businessName ?? "CRM Demo");
  const businessType = String(manifest.businessType ?? "generic");
  const typeLabel = formatBusinessTypeLabel(businessType);
  const title = `${businessName} — ${typeLabel}`;
  const ogTitle = businessName;
  const ogDescription = `Website + CRM for ${businessName} — ready in minutes`;
  const ogImageRelative = getOgImagePath(businessType);
  const ogImageUrl = siteUrl ? `${siteUrl}${ogImageRelative}` : ogImageRelative;

  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  const upsertMeta = (property: string, content: string, attr: "property" | "name" = "property") => {
    const pattern = new RegExp(
      `<meta\\s+${attr}="${property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`,
      "i",
    );
    const tag = `<meta ${attr}="${property}" content="${escapeHtml(content)}" />`;
    if (pattern.test(html)) {
      html = html.replace(pattern, tag);
      return;
    }
    const titleClose = html.indexOf("</title>");
    if (titleClose !== -1) {
      const insertAt = titleClose + "</title>".length;
      html = `${html.slice(0, insertAt)}\n    ${tag}${html.slice(insertAt)}`;
    }
  };

  upsertMeta("og:title", ogTitle);
  upsertMeta("og:description", ogDescription);
  upsertMeta("og:image", ogImageUrl);
  upsertMeta("og:image:width", "1200");
  upsertMeta("og:image:height", "630");
  upsertMeta("og:image:type", "image/jpeg");
  upsertMeta("og:type", "website");
  upsertMeta("twitter:card", "summary_large_image", "name");
  upsertMeta("twitter:image", ogImageUrl, "name");

  if (clientId) {
    const bootstrap = buildFactoryBootstrap(manifest, clientId, siteUrl);
    const bootstrapScript = [
      `<script>window.__CRM_DEMO_CLIENT_ID__=${JSON.stringify(clientId)};</script>`,
      `<script>window.__FACTORY_BOOTSTRAP__=${JSON.stringify(bootstrap)};</script>`,
    ].join("\n    ");
    const rootDiv = html.indexOf('<div id="root">');
    if (rootDiv !== -1) {
      html = `${html.slice(0, rootDiv)}${bootstrapScript}\n    ${html.slice(rootDiv)}`;
    }
    console.log("[og-image] injected __FACTORY_BOOTSTRAP__", {
      clientId,
      sector: bootstrap.manifest.business.sector,
      vocabularyKey: bootstrap.manifest.crm.vocabularyKey,
    });
  }

  fs.writeFileSync(indexPath, html, "utf8");
}

export async function prepareClientDistWithOgImage(
  clientId: string,
  sourceDistPath: string,
  manifest: ManifestLike,
  siteUrl?: string,
): Promise<string> {
  const stagingDir = path.join(os.tmpdir(), "mvp-deploy", clientId);
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(stagingDir), { recursive: true });
  fs.cpSync(sourceDistPath, stagingDir, { recursive: true });

  const businessType = String(manifest.businessType ?? "generic");
  const businessName = String(manifest.businessName ?? "CRM Demo");

  ensureImageLibraryInDist(stagingDir);

  const ogImageUrl = getOgImagePath(businessType);
  const ogFilePath = path.join(stagingDir, ogImageUrl.replace(/^\//, ""));
  if (!fs.existsSync(ogFilePath)) {
    throw new Error(`[og-image] Missing OG asset: ${ogFilePath}`);
  }

  const ogBytes = fs.statSync(ogFilePath).size;
  console.log("[image-library] using image-library og.jpg for social preview", {
    clientId,
    businessName,
    businessType,
    ogImageUrl,
    bytes: ogBytes,
  });

  writeClientDistHeaders(stagingDir);
  writeSpaRedirects(stagingDir);
  patchClientIndexHtml(stagingDir, manifest, siteUrl, clientId);
  return stagingDir;
}

export function cleanupClientDist(stagingDir: string): void {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
