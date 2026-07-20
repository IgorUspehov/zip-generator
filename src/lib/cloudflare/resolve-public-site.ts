import { buildDemoSlug } from "@/lib/cloudflare/deploy";
import {
  findDemoByClientId,
  findDemoBySlug,
  type DemoSiteRecord,
} from "@/lib/cloudflare/demo-registry";
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

/**
 * Resolve /site/{param} where param is either a demo slug or a client UUID.
 * Prefer the registry slug (same as /demo/{slug}) for public share links.
 */
export function resolvePublicSiteParam(rawParam: string): ResolvedPublicSite | null {
  const param = decodeURIComponent(String(rawParam || "").trim());
  if (!param) return null;

  if (isClientIdParam(param)) {
    const demo = findDemoByClientId(param);
    const manifest = loadClientManifest(param);
    if (!demo && !manifest) return null;
    const siteSlug =
      demo?.slug ||
      buildDemoSlug({
        clientId: param,
        businessName: String(manifest?.businessName ?? manifest?.business_name ?? ""),
        businessType: String(manifest?.businessType ?? manifest?.business_type ?? ""),
      });
    return {
      clientId: param,
      siteSlug,
      demo,
      shouldRedirectToSlug: Boolean(demo?.slug && demo.slug !== param),
    };
  }

  const demo = findDemoBySlug(param);
  if (demo) {
    return {
      clientId: demo.clientId,
      siteSlug: demo.slug,
      demo,
      shouldRedirectToSlug: false,
    };
  }

  return null;
}

export function buildPublicSitePath(siteSlug: string, lang?: string): string {
  const base = `/site/${encodeURIComponent(siteSlug)}`;
  if (!lang) return base;
  return `${base}?lang=${encodeURIComponent(lang)}`;
}
