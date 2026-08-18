import type { Metadata } from "next";

import { DEFAULT_PUBLIC_ORIGIN } from "@/lib/cloudflare/iframe-ready";
import { resolvePublicSiteParam } from "@/lib/cloudflare/resolve-public-site";
import { resolveClientHeroSrc } from "@/lib/image-library/paths";
import {
  normalizeLeadLang,
  resolveSectorModelForLead,
} from "@/lib/leads/niche-mode";
import type { LeadLang } from "@/lib/leads/types";
import { loadClientManifest } from "@/lib/manifest/storage";
import { pickLocalized } from "@/lib/niches/sector-models";
import { DEFAULT_BUSINESS_TYPE } from "@/lib/sector-mapping";

export type PublicSiteOgPage = "site" | "job" | "booking";

const PAGE_LABELS: Record<PublicSiteOgPage, Record<LeadLang, string>> = {
  site: { en: "", de: "", ru: "" },
  job: { en: "Jobs", de: "Stellen", ru: "Вакансии" },
  booking: { en: "Booking", de: "Termin buchen", ru: "Бронирование" },
};

function publicOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    DEFAULT_PUBLIC_ORIGIN
  );
}

function isUsableOgSrc(src: string): boolean {
  const trimmed = src.trim();
  return Boolean(trimmed) && !/^data:/i.test(trimmed) && !/^blob:/i.test(trimmed);
}

export function toAbsoluteMediaUrl(src: string, origin = publicOrigin()): string {
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const pathname = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${origin}${pathname}`;
}

/** First photo the public site shows: client hero, else gallery[0], else niche library. */
export function resolvePublicSiteFirstImage(manifest: Record<string, unknown>): string {
  const businessType = String(
    (manifest.businessType as string) ||
      (manifest.business_type as string) ||
      DEFAULT_BUSINESS_TYPE,
  );
  const sectorId =
    String(
      (manifest.sectorId as string) || (manifest.sector_id as string) || "",
    ).trim() || null;
  const model = resolveSectorModelForLead(businessType, sectorId);
  const heroFolder = (model?.businessType || businessType).replace(/_crm$/, "");
  const gallery = Array.isArray(manifest.galleryPhotos)
    ? (manifest.galleryPhotos as unknown[])
        .filter((item): item is string => typeof item === "string" && isUsableOgSrc(item))
        .slice(0, 3)
    : [];
  const heroPhoto =
    typeof manifest.heroPhoto === "string" && isUsableOgSrc(manifest.heroPhoto)
      ? manifest.heroPhoto
      : undefined;

  return resolveClientHeroSrc({
    heroPhoto,
    galleryPhotos: gallery,
    businessType: heroFolder,
  });
}

function guessImageType(url: string): string {
  if (/\.png(?:$|\?)/i.test(url)) return "image/png";
  if (/\.webp(?:$|\?)/i.test(url)) return "image/webp";
  return "image/jpeg";
}

export function buildPublicSiteMetadata(
  rawParam: string,
  page: PublicSiteOgPage,
  langHint?: string,
): Metadata {
  const origin = publicOrigin();
  const resolved = resolvePublicSiteParam(rawParam);
  if (!resolved) {
    return { title: "Site not found" };
  }

  const manifest = loadClientManifest(resolved.clientId) || {};
  const businessName = String(
    (manifest.businessName as string) ||
      (manifest.business_name as string) ||
      "Business",
  );
  const city = String((manifest.city as string) || "");
  const businessType = String(
    (manifest.businessType as string) ||
      (manifest.business_type as string) ||
      DEFAULT_BUSINESS_TYPE,
  );
  const sectorId =
    String(
      (manifest.sectorId as string) || (manifest.sector_id as string) || "",
    ).trim() || null;
  const lang = normalizeLeadLang(
    langHint || String(manifest.language || manifest.lang || "de"),
  );
  const model = resolveSectorModelForLead(businessType, sectorId);
  const nicheLabel = model
    ? pickLocalized(model.niche, lang)
    : businessType.replace(/_/g, " ");

  const pageLabel = PAGE_LABELS[page][lang];
  const title = pageLabel ? `${businessName} — ${pageLabel}` : businessName;
  const description = city ? `${nicheLabel} · ${city}` : nicheLabel;
  const image = toAbsoluteMediaUrl(resolvePublicSiteFirstImage(manifest), origin);
  const pathSuffix = page === "site" ? "" : `/${page}`;
  const pathname = `/site/${encodeURIComponent(resolved.siteSlug)}${pathSuffix}`;
  const url = `${origin}${pathname}`;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: businessName,
      images: [
        {
          url: image,
          width: 1920,
          height: 1080,
          alt: businessName,
          type: guessImageType(image),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
