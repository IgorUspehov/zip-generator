"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "ru" | "de" | "en";

const translations = {
  en: {
    hero_title: "MVP in 3 Minutes",
    hero_subtitle: "Ready MVP for your business. €99 one-time, no subscription.",
    hero_button: "Get free demo →",
    process_label: "PROCESS",
    process_title: "How it works",
    step1_title: "Fill out the form",
    step1_desc: "3 questions about your business",
    step2_title: "System builds your MVP",
    step2_desc: "Automatically for your niche",
    step3_title: "Get your link",
    step3_desc: "Unique URL on Netlify",
    features_label: "FEATURES",
    features_title: "What's included",
    feature1: "Business management panel",
    feature2: "Clients, bookings, services",
    feature3: "Photo gallery for your niche",
    feature4: "Language switch EN/DE/RU",
    feature5: "Unique URL on Netlify",
    niches_label: "NICHES",
    niches_title: "Industries",
    price_label: "PRICE",
    price_title: "Price",
    price_period: "one-time",
    price_demo: "Free demo 48 hours",
    price_button: "Try for free →",
    footer_location: "München, Germany",
    footer_agb: "Terms",
    footer_privacy: "Privacy",
  },
  de: {
    hero_title: "MVP in 3 Minuten",
    hero_subtitle: "Fertiges MVP für Ihr Unternehmen. €99 einmalig, kein Abo.",
    hero_button: "Kostenlose Demo →",
    process_label: "PROZESS",
    process_title: "So funktioniert es",
    step1_title: "Fragebogen ausfüllen",
    step1_desc: "3 Fragen zu Ihrem Unternehmen",
    step2_title: "System erstellt Ihr MVP",
    step2_desc: "Automatisch für Ihre Branche",
    step3_title: "Link erhalten",
    step3_desc: "Einzigartige URL auf Netlify",
    features_label: "LEISTUNGEN",
    features_title: "Was enthalten ist",
    feature1: "Business-Management-Panel",
    feature2: "Kunden, Termine, Dienstleistungen",
    feature3: "Fotogalerie für Ihre Branche",
    feature4: "Sprachwechsel EN/DE/RU",
    feature5: "Einzigartige URL auf Netlify",
    niches_label: "BRANCHEN",
    niches_title: "Branchen",
    price_label: "PREIS",
    price_title: "Preis",
    price_period: "einmalig",
    price_demo: "Demo kostenlos 48 Stunden",
    price_button: "Kostenlos testen →",
    footer_location: "München, Deutschland",
    footer_agb: "AGB",
    footer_privacy: "Datenschutz",
  },
  ru: {
    hero_title: "MVP за 3 минуты",
    hero_subtitle: "Готовый MVP для вашего бизнеса. €99 разово, без подписки.",
    hero_button: "Попробовать бесплатно →",
    process_label: "ПРОЦЕСС",
    process_title: "Как работает",
    step1_title: "Заполните анкету",
    step1_desc: "3 вопроса о вашем бизнесе",
    step2_title: "Система собирает ваш MVP",
    step2_desc: "Автоматически под вашу нишу",
    step3_title: "Получаете ссылку",
    step3_desc: "Уникальный URL на Netlify",
    features_label: "ВОЗМОЖНОСТИ",
    features_title: "Что входит в MVP",
    feature1: "Панель управления бизнесом",
    feature2: "Клиенты, записи, услуги",
    feature3: "Галерея с фото вашей ниши",
    feature4: "Переключение языков EN/DE/RU",
    feature5: "Уникальный URL на Netlify",
    niches_label: "НИШИ",
    niches_title: "Ниши",
    price_label: "ЦЕНА",
    price_title: "Цена",
    price_period: "разово",
    price_demo: "Демо бесплатно 48 часов",
    price_button: "Попробовать бесплатно →",
    footer_location: "Мюнхен, Германия",
    footer_agb: "Условия",
    footer_privacy: "Конфиденциальность",
  },
} as const;

const NICHE_ICONS = [
  "💇",
  "🍽️",
  "💪",
  "🦷",
  "💆",
  "🚗",
  "🏨",
  "📚",
  "🚛",
  "🛒",
  "💻",
] as const;

const nicheLabels: Record<Lang, readonly string[]> = {
  en: [
    "Beauty Salon",
    "Restaurant",
    "Fitness",
    "Dentistry",
    "Massage",
    "Car Service",
    "Hotel",
    "Education",
    "Logistics",
    "Online Shop",
    "Technology",
  ],
  de: [
    "Schönheitssalon",
    "Restaurant",
    "Fitnessstudio",
    "Zahnarzt",
    "Massagesalon",
    "Autowerkstatt",
    "Hotel",
    "Bildung",
    "Logistik",
    "Online-Shop",
    "Technologie",
  ],
  ru: [
    "Салон красоты",
    "Ресторан",
    "Фитнес",
    "Стоматология",
    "Массаж",
    "Автосервис",
    "Отель",
    "Образование",
    "Логистика",
    "Интернет-магазин",
    "Технологии",
  ],
};

const STEP_ICONS = ["📝", "⚙️", "🚀"] as const;

function SectionTitle({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function CtaButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:px-10 sm:py-5 sm:text-xl"
    >
      {children}
    </Link>
  );
}

function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  const langs: Lang[] = ["en", "de", "ru"];

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
                ? "text-amber-600"
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

export default function Page() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = translations[lang];

  const steps = [
    { number: "1", icon: STEP_ICONS[0], title: t.step1_title, description: t.step1_desc },
    { number: "2", icon: STEP_ICONS[1], title: t.step2_title, description: t.step2_desc },
    { number: "3", icon: STEP_ICONS[2], title: t.step3_title, description: t.step3_desc },
  ];

  const features = [t.feature1, t.feature2, t.feature3, t.feature4, t.feature5];

  const niches = NICHE_ICONS.map((icon, index) => ({
    icon,
    label: nicheLabels[lang][index],
  }));

  return (
    <div className="min-h-svh bg-white text-slate-900">
      <LanguageSwitcher lang={lang} onChange={setLang} />

      {/* Hero */}
      <section
        className="relative flex min-h-[72vh] items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/og-image.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            MVP Factory
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            {t.hero_title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {t.hero_subtitle}
          </p>
          <div className="mt-10">
            <CtaButton href="/client">{t.hero_button}</CtaButton>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow={t.process_label}>{t.process_title}</SectionTitle>
          <ol className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/60 transition hover:shadow-xl"
              >
                <span aria-hidden className="text-5xl">
                  {step.icon}
                </span>
                <span className="mt-4 flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionTitle eyebrow={t.features_label}>{t.features_title}</SectionTitle>
          <ul className="mt-12 space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4 text-base font-medium text-slate-800 shadow-md shadow-slate-100 sm:text-lg"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Niches */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle eyebrow={t.niches_label}>{t.niches_title}</SectionTitle>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {niches.map((niche) => (
              <div
                key={niche.label}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-lg shadow-slate-200/60 transition hover:border-slate-300 hover:shadow-xl"
              >
                <span aria-hidden className="text-4xl">
                  {niche.icon}
                </span>
                <span className="text-sm font-semibold text-slate-800 sm:text-base">
                  {niche.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-lg px-6">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/80">
            <SectionTitle eyebrow={t.price_label}>{t.price_title}</SectionTitle>
            <p className="mt-8 text-6xl font-extrabold tracking-tight text-slate-900">
              €99
            </p>
            <p className="mt-2 text-lg font-medium text-slate-500">{t.price_period}</p>
            <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-base font-semibold text-amber-900">
              {t.price_demo}
            </p>
            <div className="mt-10">
              <CtaButton href="https://buy.paddle.com/product/pri_01kvwhkc64zgmfmedgdgvdpz2g">{t.price_button}</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-12 text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
          <p>
            <span className="font-semibold text-white">MVP Factory</span>
            {" | "}
            {t.footer_location}
            {" | "}
            <a
              href="mailto:contact@mvpfactory.de"
              className="text-amber-400 underline-offset-4 hover:underline"
            >
              contact@mvpfactory.de
            </a>
          </p>
          <nav className="flex gap-8">
            <Link
              href="/agb"
              className="text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              {t.footer_agb}
            </Link>
            <Link
              href="/datenschutz"
              className="text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              {t.footer_privacy}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
