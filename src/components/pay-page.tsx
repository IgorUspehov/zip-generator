"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type PayLang = "en" | "de" | "ru";

const translations = {
  de: {
    demoReady: "Ihre Demo ist fertig!",
    openDemo: "Demo in neuem Tab öffnen",
    buyButton: "€99 kaufen — für immer behalten",
    redirecting: "Weiterleitung zur Zahlung…",
    missingParams: "Geben Sie demo_url, email und name in der URL an.",
    checkoutError: "Zahlung konnte nicht erstellt werden",
    missingDemoUrl:
      "Fügen Sie den Parameter demo_url zur URL hinzu, um die Vorschau zu sehen.",
    example: "Beispiel: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    loading: "Laden…",
  },
  en: {
    demoReady: "Your demo is ready!",
    openDemo: "Open demo in new tab",
    buyButton: "Buy for €99 — keep forever",
    redirecting: "Redirecting to checkout…",
    missingParams: "Add demo_url, email and name to the URL.",
    checkoutError: "Could not create checkout",
    missingDemoUrl: "Add the demo_url parameter to the link to see the preview.",
    example: "Example: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    loading: "Loading…",
  },
  ru: {
    demoReady: "Ваш демо-сайт готов!",
    openDemo: "Открыть демо в новой вкладке",
    buyButton: "Купить за €99 — сохранить навсегда",
    redirecting: "Перенаправляем на оплату…",
    missingParams: "Укажите demo_url, email и name в ссылке.",
    checkoutError: "Не удалось создать оплату",
    missingDemoUrl:
      "Добавьте параметр demo_url в ссылку, чтобы увидеть превью.",
    example: "Пример: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    loading: "Загрузка…",
  },
} as const;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: PayLang;
  onChange: (lang: PayLang) => void;
}) {
  const langs: PayLang[] = ["en", "de", "ru"];

  return (
    <div
      className="fixed right-4 top-4 z-50 flex items-center rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm sm:right-6 sm:top-6"
      role="group"
      aria-label="Language"
    >
      {langs.map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 ? <span className="mx-2 text-slate-400">|</span> : null}
          <button
            type="button"
            onClick={() => onChange(code)}
            className={`uppercase tracking-wide transition ${
              lang === code
                ? "text-violet-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}

export function PayPageContent() {
  const searchParams = useSearchParams();
  const demoUrl = searchParams?.get("demo_url")?.trim() ?? "";
  const email = searchParams?.get("email")?.trim() ?? "";
  const name = searchParams?.get("name")?.trim() ?? "";
  const siteId = searchParams?.get("site_id")?.trim() ?? "";
  const clientId = searchParams?.get("client_id")?.trim() ?? "";

  const [lang, setLang] = useState<PayLang>("de");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];
  const hasValidDemoUrl = isValidHttpUrl(demoUrl);
  const canCheckout = hasValidDemoUrl && email && name;

  async function handleCheckout() {
    if (!canCheckout) {
      setError(t.missingParams);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_email: email,
          client_name: name,
          demo_url: demoUrl,
          ...(siteId ? { site_id: siteId } : {}),
          ...(clientId ? { client_id: clientId } : {}),
        }),
      });

      const data = (await response.json()) as { checkout_url?: string; error?: string };

      if (!response.ok || !data.checkout_url) {
        throw new Error(data.error ?? t.checkoutError);
      }

      window.location.href = data.checkout_url;
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error ? checkoutError.message : t.checkoutError;
      setError(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <LanguageSwitcher lang={lang} onChange={setLang} />

      <div className="mx-auto flex min-h-svh max-w-3xl flex-col px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
            MVP Factory
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t.demoReady}
          </h1>
          {name ? (
            <p className="mt-3 text-lg text-slate-600">
              {name}
              {email ? ` · ${email}` : ""}
            </p>
          ) : null}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          {hasValidDemoUrl ? (
            <>
              <iframe
                title="Demo preview"
                src={demoUrl}
                className="h-[420px] w-full border-0 bg-white sm:h-[520px]"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
              <div className="border-t border-slate-200 bg-white px-4 py-3 text-center">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-violet-700 hover:text-violet-800"
                >
                  {t.openDemo} →
                </a>
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center text-slate-600">{t.missingDemoUrl}</div>
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={!canCheckout || loading}
            className="inline-flex w-full max-w-xl items-center justify-center rounded-2xl bg-violet-600 px-8 py-5 text-xl font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t.redirecting : t.buyButton}
          </button>

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

          {!canCheckout && !error ? (
            <p className="mt-4 text-sm text-slate-500">{t.example}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
