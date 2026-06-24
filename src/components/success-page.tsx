"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const COPY = {
  ru: {
    title: "Оплата прошла успешно!",
    subtitleDemo: "Ваш сайт сохранён навсегда",
    subtitlePro: "Ваш MVP Pro готов к скачиванию",
    emailHint: "В течение 5 минут вы получите письмо со ссылкой.",
    download: "Скачать ZIP",
    home: "Вернуться на главную",
    waiting: "Подготавливаем ваш ZIP...",
  },
  de: {
    title: "Zahlung erfolgreich!",
    subtitleDemo: "Ihre Website ist dauerhaft gespeichert",
    subtitlePro: "Ihr MVP Pro ist zum Download bereit",
    emailHint: "Sie erhalten innerhalb von 5 Minuten eine E-Mail.",
    download: "ZIP herunterladen",
    home: "Zur Startseite",
    waiting: "ZIP wird vorbereitet...",
  },
  en: {
    title: "Payment successful!",
    subtitleDemo: "Your site is saved forever",
    subtitlePro: "Your MVP Pro package is ready",
    emailHint: "You will receive an email within 5 minutes.",
    download: "Download ZIP",
    home: "Back to home",
    waiting: "Preparing your ZIP...",
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
