import Link from "next/link";
import { redirect } from "next/navigation";

import { PublicBookingForm } from "@/components/public-site/booking-form";
import {
  catalogNamesForLang,
  resolveCatalogSeedForClient,
} from "@/lib/catalog/resolve-catalog";
import { listCatalogItems } from "@/lib/catalog/firestore-catalog";
import {
  buildPublicSitePath,
  resolvePublicSiteParam,
} from "@/lib/cloudflare/resolve-public-site";
import {
  normalizeLeadLang,
  resolveLeadFormMode,
  resolveSectorModelForLead,
} from "@/lib/leads/niche-mode";
import { loadClientManifest } from "@/lib/manifest/storage";
import { pickLocalized } from "@/lib/niches/sector-models";
import { DEFAULT_BUSINESS_TYPE } from "@/lib/sector-mapping";
import type { LeadLang } from "@/lib/leads/types";

type BookingPageProps = {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ lang?: string }>;
};

async function loadSharedCatalogNames(
  clientId: string,
  lang: LeadLang,
): Promise<string[]> {
  try {
    const items = await listCatalogItems(clientId);
    return catalogNamesForLang(items, lang);
  } catch {
    const { items } = resolveCatalogSeedForClient(clientId);
    return catalogNamesForLang(items, lang);
  }
}

export default async function PublicBookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { clientId: raw } = await params;
  const query = await searchParams;
  const resolved = resolvePublicSiteParam(raw || "");

  if (!resolved) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
        <div>
          <h1 className="text-2xl font-bold">Site not found</h1>
          <p className="mt-2 text-slate-400">Unknown or expired site link.</p>
        </div>
      </main>
    );
  }

  const langHint = query.lang ? normalizeLeadLang(query.lang) : undefined;
  if (resolved.shouldRedirectToSlug) {
    const qs = langHint ? `?lang=${encodeURIComponent(langHint)}` : "";
    redirect(`/site/${encodeURIComponent(resolved.siteSlug)}/booking${qs}`);
  }

  const { clientId } = resolved;
  const manifest = loadClientManifest(clientId) || {};

  const businessType = String(
    (manifest.businessType as string) ||
      (manifest.business_type as string) ||
      DEFAULT_BUSINESS_TYPE,
  );
  const sectorId = String(
    (manifest.sectorId as string) || (manifest.sector_id as string) || "",
  ).trim() || null;
  const businessName = String(
    (manifest.businessName as string) ||
      (manifest.business_name as string) ||
      "Business",
  );
  const lang = normalizeLeadLang(
    query.lang || String(manifest.language || manifest.lang || "de"),
  );
  const model = resolveSectorModelForLead(businessType, sectorId);
  const mode = resolveLeadFormMode(businessType, sectorId);
  const services = await loadSharedCatalogNames(clientId, lang);
  const formCta = model ? pickLocalized(model.publicCta, lang) : undefined;
  const catalogLabel = model ? pickLocalized(model.catalog, lang) : undefined;
  const heroFolder = (model?.businessType || businessType).replace(/_crm$/, "");
  const gallery = Array.isArray(manifest.galleryPhotos)
    ? (manifest.galleryPhotos as string[]).slice(0, 3)
    : [];
  const hero =
    typeof manifest.heroPhoto === "string"
      ? manifest.heroPhoto
      : gallery[0] || `/image-library/${heroFolder}/hero.jpg`;

  const backHref = buildPublicSitePath(resolved.siteSlug, langHint);
  const backLabel =
    lang === "ru" ? "← Назад" : lang === "de" ? "← Zurück" : "← Back";

  return (
    <main className="min-h-svh bg-gradient-to-b from-slate-950 via-slate-900 to-stone-900 text-white">
      <div
        className="relative min-h-[40vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.82), rgba(68,64,60,0.55)), url(${hero})`,
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col px-6 pb-12 pt-10">
          <Link
            href={backHref}
            className="mb-6 w-fit text-sm font-semibold text-orange-200/90 hover:text-orange-100"
          >
            {backLabel}
          </Link>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {businessName}
          </h1>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <PublicBookingForm
          clientId={clientId}
          mode={mode}
          language={lang}
          services={services}
          accent="#ea580c"
          ctaLabel={formCta}
          titleLabel={formCta}
          serviceLabel={catalogLabel}
        />
      </section>
    </main>
  );
}
