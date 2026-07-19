import Link from "next/link";

import { PublicBookingForm } from "@/components/public-site/booking-form";
import { findDemoByClientId } from "@/lib/cloudflare/demo-registry";
import { resolveSiteCrmHref } from "@/lib/cloudflare/resolve-site-crm-href";
import {
  leadFormCopy,
  normalizeLeadLang,
  resolveLeadFormMode,
} from "@/lib/leads/niche-mode";
import { loadNicheServiceOptions } from "@/lib/leads/store";
import { loadClientManifest } from "@/lib/manifest/storage";
import { DEFAULT_BUSINESS_TYPE, getBusinessTypeDisplayName } from "@/lib/sector-mapping";

type SitePageProps = {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function PublicSitePage({ params, searchParams }: SitePageProps) {
  const { clientId: raw } = await params;
  const query = await searchParams;
  const clientId = decodeURIComponent(raw || "").trim();
  const manifest = clientId ? loadClientManifest(clientId) : null;
  const demo = clientId ? findDemoByClientId(clientId) : undefined;

  if (!clientId || (!manifest && !demo)) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
        <div>
          <h1 className="text-2xl font-bold">Site not found</h1>
          <p className="mt-2 text-slate-400">Unknown or expired client ID.</p>
        </div>
      </main>
    );
  }

  const businessType = String(
    (manifest?.businessType as string) ||
      (manifest?.business_type as string) ||
      DEFAULT_BUSINESS_TYPE,
  );
  const businessName = String(
    (manifest?.businessName as string) ||
      (manifest?.business_name as string) ||
      "Business",
  );
  const city = String((manifest?.city as string) || "");
  const phone = String((manifest?.phone as string) || "");
  const lang = normalizeLeadLang(
    query.lang || String(manifest?.language || manifest?.lang || "de"),
  );
  const mode = resolveLeadFormMode(businessType);
  const services = loadNicheServiceOptions(businessType, lang);
  const nicheLabel = getBusinessTypeDisplayName(businessType);
  const t = leadFormCopy[lang];
  const crmHref = resolveSiteCrmHref({
    clientId,
    demo,
    businessName,
    businessType,
  });
  const gallery = Array.isArray(manifest?.galleryPhotos)
    ? (manifest?.galleryPhotos as string[]).slice(0, 3)
    : [];
  const heroFolder = businessType.replace(/_crm$/, "");
  const hero =
    typeof manifest?.heroPhoto === "string"
      ? manifest.heroPhoto
      : gallery[0] || `/image-library/${heroFolder}/hero.jpg`;

  return (
    <main className="min-h-svh bg-gradient-to-b from-slate-950 via-slate-900 to-stone-900 text-white">
      <div
        className="relative min-h-[52vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.82), rgba(68,64,60,0.55)), url(${hero})`,
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col px-6 pb-16 pt-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/90">
              {nicheLabel}
            </p>
            <div className="flex gap-1 rounded-full border border-white/15 bg-black/25 p-1">
              {(["en", "de", "ru"] as const).map((code) => (
                <Link
                  key={code}
                  href={`/site/${encodeURIComponent(clientId)}?lang=${code}`}
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    lang === code ? "bg-orange-500 text-white" : "text-slate-200"
                  }`}
                >
                  {code}
                </Link>
              ))}
            </div>
          </div>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">{businessName}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            {city ? `${nicheLabel} · ${city}` : nicheLabel}
            {phone ? ` · ${phone}` : ""}
          </p>
          <PublicBookingForm
            clientId={clientId}
            mode={mode}
            language={lang}
            services={services}
            accent="#ea580c"
          />
        </div>
      </div>

      {gallery.length > 1 ? (
        <section className="mx-auto grid max-w-5xl gap-4 px-6 py-12 sm:grid-cols-3">
          {gallery.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-48 w-full rounded-2xl object-cover"
            />
          ))}
        </section>
      ) : null}

      {crmHref ? (
        <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
          <Link href={crmHref} className="font-semibold text-orange-300 hover:text-orange-200">
            {t.openCrm}
          </Link>
        </footer>
      ) : null}
    </main>
  );
}
