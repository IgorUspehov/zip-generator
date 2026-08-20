import { buildDemoSlug } from "@/lib/cloudflare/deploy";
import {
  findDemoByClientId,
  findDemoByShortId,
  findDemoBySlug,
  hydrateDemoRecord,
  type DemoSiteRecord,
} from "@/lib/cloudflare/demo-registry";
import { restoreDemoByClientId, restoreDemoBySlug } from "@/lib/billing/paid-tenant";
import { hydrateClientManifest } from "@/lib/admin/lookup";
import { loadClientManifest } from "@/lib/manifest/storage";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isClientIdParam(value: string): boolean {
  return UUID_RE.test(String(value || "").trim());
}

export type ResolvedPublicSite = {
  clientId: string;
  siteSlug: string;
  demo: DemoSiteRecord | undefined;
  /** True when the URL used a raw UUID and a slug exists — callers should redirect. */
  shouldRedirectToSlug: boolean;
};

function shortIdFromSlug(slug: string): string {
  const parts = String(slug || "").split("-").filter(Boolean);
  return parts.length ? parts[parts.length - 1]! : "";
}

function buildResolved(
  clientId: string,
  demo: DemoSiteRecord | undefined,
  param: string,
): ResolvedPublicSite | null {
  const manifest = loadClientManifest(clientId);
  // Public site content comes from the manifest. Without it we would render a
  // misleading default ("Medizinische Klinik") after Render /tmp wipes.
  if (!manifest) return null;

  const siteSlug =
    demo?.slug ||
    buildDemoSlug({
      clientId,
      businessName: String(manifest.businessName ?? manifest.business_name ?? ""),
      businessType: String(manifest.businessType ?? manifest.business_type ?? ""),
    });

  return {
    clientId,
    siteSlug,
    demo,
    shouldRedirectToSlug: isClientIdParam(param) && Boolean(demo?.slug && demo.slug !== param),
  };
}

/**
 * Resolve /site/{param} where param is either a demo slug or a client UUID.
 * Prefer the registry slug (same as /demo/{slug}) for public share links.
 *
 * Sync only — callers that may run on a cold Render disk must use
 * `ensurePublicSiteResolved` so demo-registry + manifests are rehydrated
 * from Firestore (they live in /tmp and vanish on every deploy).
 */
export function resolvePublicSiteParam(rawParam: string): ResolvedPublicSite | null {
  const param = decodeURIComponent(String(rawParam || "").trim());
  if (!param) return null;

  if (isClientIdParam(param)) {
    return buildResolved(param, findDemoByClientId(param), param);
  }

  const demo =
    findDemoBySlug(param) ||
    (() => {
      const shortId = shortIdFromSlug(param);
      return shortId ? findDemoByShortId(shortId) : undefined;
    })();

  if (!demo) return null;
  const resolved = buildResolved(demo.clientId, demo, param);
  if (!resolved) return null;
  return {
    ...resolved,
    // Wrong/old slug in the URL → redirect to the canonical registry slug.
    shouldRedirectToSlug: Boolean(demo.slug && demo.slug !== param),
  };
}

/**
 * Cold-start safe resolver for /site, /site/.../booking, /site/.../job.
 * Never deletes anything — only restores demo-registry + manifest from Firestore.
 */
export async function ensurePublicSiteResolved(
  rawParam: string,
): Promise<ResolvedPublicSite | null> {
  const param = decodeURIComponent(String(rawParam || "").trim());
  if (!param) return null;

  if (isClientIdParam(param)) {
    await hydrateDemoRecord({ clientId: param });
    await hydrateClientManifest(param);
    let resolved = resolvePublicSiteParam(param);
    if (!resolved) {
      await restoreDemoByClientId(param);
      await hydrateClientManifest(param);
      resolved = resolvePublicSiteParam(param);
    }
    return resolved;
  }

  const hydrated = await hydrateDemoRecord({ slug: param });
  if (hydrated?.clientId) {
    await hydrateClientManifest(hydrated.clientId);
  }

  let resolved = resolvePublicSiteParam(param);
  if (!resolved) {
    const restored = await restoreDemoBySlug(param);
    if (restored?.clientId) {
      await hydrateClientManifest(restored.clientId);
    }
    resolved = resolvePublicSiteParam(param);
  }

  // Suffix fallback: /site/…-8997 after registry wipe when exact slug hydrate failed
  // but a later hydrate (e.g. /demo?clientId=) already repopulated memory.
  if (!resolved) {
    const shortId = shortIdFromSlug(param);
    const byShort = shortId ? findDemoByShortId(shortId) : undefined;
    if (byShort?.clientId) {
      await hydrateClientManifest(byShort.clientId);
      const viaShort = buildResolved(byShort.clientId, byShort, param);
      if (viaShort) {
        return { ...viaShort, shouldRedirectToSlug: byShort.slug !== param };
      }
    }
  }

  return resolved;
}

export function buildPublicSitePath(siteSlug: string, lang?: string): string {
  const base = `/site/${encodeURIComponent(siteSlug)}`;
  if (!lang) return base;
  return `${base}?lang=${encodeURIComponent(lang)}`;
}
