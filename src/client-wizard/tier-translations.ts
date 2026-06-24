import type { UiLang } from "@/client-wizard/copy";

export const tierTranslations = {
  ru: {
    choosePlan: "Выберите план:",
    popular: "Popular",
    comingSoon: "Скоро доступно",
    downloadZip: "Скачать ZIP",
    mvpDemo: {
      name: "MVP Demo",
      description: "Netlify ссылка навсегда",
    },
    mvpPro: {
      name: "MVP Pro",
      description: "ZIP + README + i18n + ваш домен",
    },
    crmFull: {
      name: "CRM Full",
      description: "Firebase + домен + полная CRM",
      contact: "Купить за €999",
    },
  },
  de: {
    choosePlan: "Plan wählen:",
    popular: "Popular",
    comingSoon: "Bald verfügbar",
    downloadZip: "ZIP herunterladen",
    mvpDemo: {
      name: "MVP Demo",
      description: "Netlify-Link für immer",
    },
    mvpPro: {
      name: "MVP Pro",
      description: "ZIP + README + i18n + Ihre Domain",
    },
    crmFull: {
      name: "CRM Full",
      description: "Firebase + Domain + volles CRM",
      contact: "Für €999 kaufen",
    },
  },
  en: {
    choosePlan: "Choose plan:",
    popular: "Popular",
    comingSoon: "Coming soon",
    downloadZip: "Download ZIP",
    mvpDemo: {
      name: "MVP Demo",
      description: "Netlify link forever",
    },
    mvpPro: {
      name: "MVP Pro",
      description: "ZIP + README + i18n + your domain",
    },
    crmFull: {
      name: "CRM Full",
      description: "Firebase + domain + full CRM",
      contact: "Buy for €999",
    },
  },
} as const satisfies Record<
  UiLang,
  {
    choosePlan: string;
    popular: string;
    comingSoon: string;
    downloadZip: string;
    mvpDemo: { name: string; description: string };
    mvpPro: { name: string; description: string };
    crmFull: { name: string; description: string; contact: string };
  }
>;

export function getTierTranslations(lang: UiLang) {
  return tierTranslations[lang] ?? tierTranslations.en;
}
