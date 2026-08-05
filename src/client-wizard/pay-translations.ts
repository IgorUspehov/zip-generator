import type { UiLang } from "@/client-wizard/copy";

export const payTranslations = {
  ru: {
    payButton: "Выбрать тариф",
    paySubline: "€99 CRM Demo",
    demoInfo: "⏰ Демо CRM Demo активно 48 часов. Выберите тариф, чтобы продолжить.",
  },
  de: {
    payButton: "Plan wählen",
    paySubline: "€99 CRM Demo",
    demoInfo: "⏰ Ihr CRM Demo ist 48 Stunden aktiv. Wählen Sie einen Plan, um fortzufahren.",
  },
  en: {
    payButton: "Choose plan",
    paySubline: "€99 CRM Demo",
    demoInfo: "⏰ Your CRM Demo is active for 48 hours. Choose a plan to continue.",
  },
} as const satisfies Record<UiLang, { payButton: string; paySubline: string; demoInfo: string }>;

export function getPayTranslations(lang: UiLang) {
  return payTranslations[lang] ?? payTranslations.en;
}
