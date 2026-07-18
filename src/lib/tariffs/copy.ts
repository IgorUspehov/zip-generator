export type TariffLang = "en" | "de" | "ru";

export function normalizeTariffLang(value: string | null | undefined): TariffLang {
  const lang = (value || "de").toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("en")) return "en";
  return "de";
}

export const tariffCopy = {
  en: {
    title: "Choose your plan",
    subtitle: "Pick the option that fits your business. You can change language anytime.",
    back: "Back",
    popular: "Popular",
    crmDemo: {
      name: "CRM Demo",
      price: "€99",
      period: "/ month",
      description: "Live CRM Demo for your niche — continue with Polar checkout.",
      cta: "Pay €99 · CRM Demo",
      bullets: [
        "Working CRM Demo for your niche",
        "Monthly CRM Demo access",
        "Managed in this product (not Factory)",
      ],
    },
    factoryReady: {
      name: "Factory Website + CRM",
      price: "€499",
      period: "",
      description: "Ready live website + CRM, ZIP delivered by email via Factory Website+CRM.",
      cta: "Continue to Factory · €499",
      bullets: [
        "Ready live site + CRM",
        "ZIP by email",
        "Built in Factory Website+CRM",
      ],
    },
    factoryCustom: {
      name: "Individual Website + CRM",
      price: "€999",
      period: "",
      description: "Custom Website + CRM — continue in Factory Website+CRM for an individual build.",
      cta: "Continue to Factory · €999",
      bullets: [
        "Individual build in Factory",
        "Website + CRM tailored to you",
        "Handoff with your business data only",
      ],
    },
    bridgeNote:
      "Factory receives only business name, owner, niche, city, contacts, language, and client ID.",
    missingClient: "Open this page from your demo (client ID required).",
    loading: "Loading…",
  },
  de: {
    title: "Plan wählen",
    subtitle: "Wählen Sie die passende Option. Sprache jederzeit wechselbar.",
    back: "Zurück",
    popular: "Beliebt",
    crmDemo: {
      name: "CRM Demo",
      price: "€99",
      period: "/ Monat",
      description: "Live-CRM-Demo für Ihre Nische — weiter zur Polar-Zahlung.",
      cta: "€99 zahlen · CRM Demo",
      bullets: [
        "Funktionierende CRM Demo für Ihre Nische",
        "Monatlicher CRM-Demo-Zugang",
        "In diesem Produkt (nicht Factory)",
      ],
    },
    factoryReady: {
      name: "Factory Website + CRM",
      price: "€499",
      period: "",
      description: "Fertige Live-Website + CRM, ZIP per E-Mail über Factory Website+CRM.",
      cta: "Weiter zu Factory · €499",
      bullets: [
        "Fertige Live-Website + CRM",
        "ZIP per E-Mail",
        "Erstellt in Factory Website+CRM",
      ],
    },
    factoryCustom: {
      name: "Individuelle Website + CRM",
      price: "€999",
      period: "",
      description:
        "Individuelle Website + CRM — weiter in Factory Website+CRM zur Einzelanfertigung.",
      cta: "Weiter zu Factory · €999",
      bullets: [
        "Individuelle Erstellung in Factory",
        "Website + CRM nach Maß",
        "Übergabe nur mit Ihren Geschäftsdaten",
      ],
    },
    bridgeNote:
      "Factory erhält nur Firmenname, Inhaber, Nische, Stadt, Kontakte, Sprache und client ID.",
    missingClient: "Öffnen Sie diese Seite aus Ihrer Demo (client ID erforderlich).",
    loading: "Laden…",
  },
  ru: {
    title: "Выберите тариф",
    subtitle: "Выберите подходящий вариант. Язык можно сменить в любой момент.",
    back: "Назад",
    popular: "Популярный",
    crmDemo: {
      name: "CRM Demo",
      price: "€99",
      period: "/ месяц",
      description: "Живое CRM Demo под вашу нишу — далее оплата через Polar.",
      cta: "Оплатить €99 · CRM Demo",
      bullets: [
        "Рабочее CRM Demo под нишу",
        "Ежемесячный доступ к CRM Demo",
        "В этом продукте (не Factory)",
      ],
    },
    factoryReady: {
      name: "Factory Website + CRM",
      price: "€499",
      period: "",
      description: "Готовый live-сайт + CRM, ZIP на email через Factory Website+CRM.",
      cta: "Перейти в Factory · €499",
      bullets: [
        "Готовый live-сайт + CRM",
        "ZIP на email",
        "Сборка в Factory Website+CRM",
      ],
    },
    factoryCustom: {
      name: "Индивидуальный Website + CRM",
      price: "€999",
      period: "",
      description:
        "Индивидуальный Website + CRM — переход в Factory Website+CRM для персональной сборки.",
      cta: "Перейти в Factory · €999",
      bullets: [
        "Индивидуальная сборка в Factory",
        "Сайт + CRM под вас",
        "Передача только бизнес-данных",
      ],
    },
    bridgeNote:
      "В Factory передаются только название, владелец, ниша, город, контакты, язык и client ID.",
    missingClient: "Откройте эту страницу из демо (нужен client ID).",
    loading: "Загрузка…",
  },
} as const;

export type TariffContext = {
  clientId: string;
  businessName?: string;
  ownerName?: string;
  niche?: string;
  city?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  language?: string;
  demoUrl?: string;
};
