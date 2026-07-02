"use client";

declare global {
  interface Window {
    Paddle: any;
  }
}

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const PROMO_CODE = "serafim01";

type PayLang = "en" | "de" | "ru";

const translations = {
  de: {
    demoReady: "Ihre Demo ist fertig!",
    buyButton: "€999 zahlen",
    freeButton: "Kostenlos erhalten →",
    redirecting: "Weiterleitung…",
    missingParams: "Geben Sie demo_url, email und name in der URL an.",
    missingDemoUrl: "Fügen Sie den Parameter demo_url zur URL hinzu, um die Vorschau zu sehen.",
    example: "Beispiel: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    promoLabel: "Promo-Code eingeben",
    promoPlaceholder: "Promo-Code (optional)",
    promoInvalid: "Ungültiger Promo-Code",
  },
  en: {
    demoReady: "Your demo is ready!",
    buyButton: "Pay €999",
    freeButton: "Get for free →",
    redirecting: "Redirecting…",
    missingParams: "Add demo_url, email and name to the URL.",
    missingDemoUrl: "Add the demo_url parameter to the link to see the preview.",
    example: "Example: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    promoLabel: "Enter promo code",
    promoPlaceholder: "Promo code (optional)",
    promoInvalid: "Invalid promo code",
  },
  ru: {
    demoReady: "Ваш демо-сайт готов!",
    buyButton: "Оплатить €999",
    freeButton: "Получить бесплатно →",
    redirecting: "Перенаправляем…",
    missingParams: "Укажите demo_url, email и name в ссылке.",
    missingDemoUrl: "Добавьте параметр demo_url в ссылку, чтобы увидеть превью.",
    example: "Пример: /pay?demo_url=https://example.com&email=anna@example.com&name=Anna",
    promoLabel: "Введите промокод",
    promoPlaceholder: "Промо-код (необязательно)",
    promoInvalid: "Неверный промо-код",
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
  return (
    <div
      className="fixed right-4 top-4 z-50 flex items-center rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm sm:right-6 sm:top-6"
      role="group"
      aria-label="Language"
    >
      {(["en", "de", "ru"] as PayLang[]).map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 ? <span className="mx-2 text-slate-400">|</span> : null}
          <button
            type="button"
            onClick={() => onChange(code)}
            className={`uppercase tracking-wide transition ${
              lang === code ? "text-violet-600" : "text-slate-500 hover:text-slate-800"
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
  const paid = searchParams?.get("paid")?.trim() === "true";



  const [lang, setLang] = useState<PayLang>("de");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");

  const t = translations[lang];
  const hasValidDemoUrl = isValidHttpUrl(demoUrl);
  const canCheckout = hasValidDemoUrl && email && name;
  const promoApplied = promoInput.trim().toLowerCase() === PROMO_CODE;

  function handleCheckout() {
    if (!canCheckout) {
      setError(t.missingParams);
      return;
    }

    setLoading(true);
    setError(null);

    if (promoApplied) {
      window.location.href = demoUrl;
      return;
    }

    const polarUrl = new URL("https://buy.polar.sh/polar_cl_qVHaJpa4Zon7ZJjZNAI6UNDt7vkLdV0enAUZc085fTu");
    if (email) polarUrl.searchParams.set("prefilled_email", email);
    window.location.href = polarUrl.toString();
  }

  return (
    <main className="min-h-svh bg-white text-slate-900">
      <LanguageSwitcher lang={lang} onChange={setLang} />

      <div className="mx-auto flex min-h-svh max-w-3xl flex-col px-6 py-12">
        {/* Header */}
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

        {paid ? (
          <>
            {/* Unlocked preview */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              {hasValidDemoUrl ? (
                <iframe
                  title="Demo preview"
                  src={demoUrl}
                  className="h-[420px] w-full border-0 bg-white sm:h-[520px]"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <div className="px-6 py-16 text-center text-slate-600">{t.missingDemoUrl}</div>
              )}
            </div>

            {hasValidDemoUrl ? (
              <div className="mt-6 text-center">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700"
                >
                  {demoUrl}
                </a>
              </div>
            ) : null}
          </>
        ) : (
          /* Paywall */
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => handleCheckout()}
              disabled={!canCheckout || loading}
              className={`inline-flex w-full max-w-xl items-center justify-center rounded-2xl px-8 py-5 text-xl font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                promoApplied
                  ? "bg-green-600 shadow-green-200 hover:bg-green-700"
                  : "bg-violet-600 shadow-violet-200 hover:bg-violet-700"
              }`}
            >
              {loading ? t.redirecting : promoApplied ? t.freeButton : t.buyButton}
            </button>

            <div className="mx-auto mt-6 max-w-xl">
              <p className="mb-2 text-sm font-medium text-slate-600">{t.promoLabel}</p>
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t.promoPlaceholder}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  promoInput && !promoApplied
                    ? "border-red-300 focus:ring-red-200"
                    : promoApplied
                      ? "border-green-400 bg-green-50 text-green-800 focus:ring-green-200"
                      : "border-slate-200 focus:ring-violet-200"
                }`}
              />
              {promoInput && !promoApplied ? (
                <p className="mt-1 text-xs text-red-500">{t.promoInvalid}</p>
              ) : null}
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

            {!canCheckout && !error ? (
              <p className="mt-4 text-sm text-slate-500">{t.example}</p>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
