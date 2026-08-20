"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TenantReadyLinks, type TenantReadyLinksCopy } from "@/components/tenant-ready-links";

const COPY = {
  ru: {
    title: "Оплата прошла успешно!",
    subtitleDemo: "Ваш Сайт + CRM + Бронирование сохранён навсегда",
    subtitlePro: "Ваш Deployable ZIP (€999) готов к скачиванию",
    emailHint: "Сохраните ссылки ниже — сайт для клиентов, вакансии и бронирование.",
    download: "Скачать ZIP",
    home: "Вернуться на главную",
    waiting: "Подготавливаем ваш ZIP...",
    links: {
      publicSiteLabel: "Ваш сайт для клиентов",
      publicSiteHint: "Эту ссылку размещайте в Google Maps, Instagram или на визитке.",
      jobsLabel: "Страница вакансий",
      jobsHint: "Отправьте эту ссылку соискателям",
      bookingLabel: "Страница бронирования",
      bookingHint: "Отправьте эту ссылку вашим клиентам",
      copyLink: "Копировать ссылку",
      copied: "Скопировано!",
    } satisfies TenantReadyLinksCopy,
  },
  de: {
    title: "Zahlung erfolgreich!",
    subtitleDemo: "Ihr Website + CRM + Buchung ist dauerhaft gespeichert",
    subtitlePro: "Ihr Deployable ZIP (€999) ist zum Download bereit",
    emailHint: "Speichern Sie die Links unten — Kundenwebsite, Stellen und Buchung.",
    download: "ZIP herunterladen",
    home: "Zur Startseite",
    waiting: "ZIP wird vorbereitet...",
    links: {
      publicSiteLabel: "Ihre Website für Kunden",
      publicSiteHint: "Diesen Link in Google Maps, Instagram oder auf Ihre Visitenkarte setzen.",
      jobsLabel: "Stellenangebote-Seite",
      jobsHint: "Senden Sie diesen Link an Bewerber",
      bookingLabel: "Buchungsseite",
      bookingHint: "Senden Sie diesen Link an Ihre Kunden",
      copyLink: "Link kopieren",
      copied: "Kopiert!",
    } satisfies TenantReadyLinksCopy,
  },
  en: {
    title: "Payment successful!",
    subtitleDemo: "Your Website + CRM + Booking is saved forever",
    subtitlePro: "Your Deployable ZIP (€999) package is ready",
    emailHint: "Save the links below — customer site, jobs, and booking.",
    download: "Download ZIP",
    home: "Back to home",
    waiting: "Preparing your ZIP...",
    links: {
      publicSiteLabel: "Your site for customers",
      publicSiteHint: "Put this link on Google Maps, Instagram, or your business card.",
      jobsLabel: "Jobs page",
      jobsHint: "Send this link to applicants",
      bookingLabel: "Booking page",
      bookingHint: "Send this link to your customers",
      copyLink: "Copy link",
      copied: "Copied!",
    } satisfies TenantReadyLinksCopy,
  },
} as const;

export function SuccessPageContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams?.get("clientId")?.trim() ?? "";
  const email = searchParams?.get("email")?.trim() ?? "";
  const tier = searchParams?.get("tier")?.trim() ?? "";
  const isMvpPro = tier === "mvp_pro";
  const langParam = searchParams?.get("lang")?.trim() ?? "ru";
  const lang = (["ru", "de", "en"].includes(langParam) ? langParam : "ru") as keyof typeof COPY;
  const t = COPY[lang];

  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [publicSiteUrl, setPublicSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/demo-access/${encodeURIComponent(clientId)}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          publicSiteUrl?: string | null;
        };
        if (cancelled) return;
        if (typeof data.publicSiteUrl === "string" && data.publicSiteUrl) {
          setPublicSiteUrl(data.publicSiteUrl);
        }
      } catch {
        /* ignore */
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  useEffect(() => {
    if (!isMvpPro || !clientId || !email) {
      return;
    }

    let cancelled = false;

    const poll = async () => {
      const params = new URLSearchParams({ clientId, email });
      const response = await fetch(`/api/mvp-pro/status?${params.toString()}`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { ready?: boolean; downloadToken?: string };
      if (!cancelled && data.ready && data.downloadToken) {
        setDownloadToken(data.downloadToken);
      }
    };

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isMvpPro, clientId, email]);

  const handleDownload = () => {
    if (!clientId || !downloadToken) {
      return;
    }
    const params = new URLSearchParams({ clientId, token: downloadToken });
    window.open(`/api/download-zip?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 text-6xl" aria-hidden>
          🎉
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t.title}
        </h1>

        <p className="mt-4 text-2xl font-semibold text-violet-700">
          {isMvpPro ? t.subtitlePro : t.subtitleDemo}
        </p>

        {!isMvpPro ? (
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">{t.emailHint}</p>
        ) : null}

        {publicSiteUrl ? (
          <div className="mt-8 w-full text-left [&_.tenant-ready-link-block]:border-slate-200 [&_.tenant-ready-link-block]:bg-slate-50 [&_.tenant-ready-link-label]:text-slate-900 [&_.tenant-ready-link-hint]:text-slate-500 [&_.wizard-ready-url]:border-slate-200 [&_.wizard-ready-url]:bg-white [&_.wizard-ready-url]:text-slate-800 [&_.wizard-ready-copy]:border [&_.wizard-ready-copy]:border-slate-200 [&_.wizard-ready-copy]:bg-white [&_.wizard-ready-copy]:text-slate-800">
            <TenantReadyLinks publicSiteUrl={publicSiteUrl} copy={t.links} />
          </div>
        ) : null}

        {isMvpPro ? (
          <div className="mt-10">
            {downloadToken ? (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                {t.download}
              </button>
            ) : (
              <p className="text-slate-600">{t.waiting}</p>
            )}
          </div>
        ) : null}

        <Link
          href="/"
          className="mt-12 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          {t.home}
        </Link>
      </div>
    </main>
  );
}
