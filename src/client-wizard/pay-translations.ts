import type { UiLang } from "@/client-wizard/copy";

export const payTranslations = {
  ru: {
    keepForever: "💳 Сохранить навсегда — €99",
    demoInfo: "⏰ Демо активно 48 часов. После оплаты сайт остаётся онлайн навсегда.",
  },
  de: {
    keepForever: "💳 Dauerhaft sichern — €99",
    demoInfo:
      "⏰ Ihre Demo ist 48 Stunden aktiv. Nach der Zahlung bleibt Ihre Website dauerhaft online.",
  },
  en: {
    keepForever: "💳 Keep forever — €99",
    demoInfo:
      "⏰ Your demo is active for 48 hours. After payment, your site stays online permanently.",
  },
} as const satisfies Record<UiLang, { keepForever: string; demoInfo: string }>;

export function getPayTranslations(lang: UiLang) {
  return payTranslations[lang] ?? payTranslations.en;
}
