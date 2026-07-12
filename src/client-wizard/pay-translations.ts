import type { UiLang } from "@/client-wizard/copy";

export const payTranslations = {
  ru: {
    payButton: "€99 — разовый платёж",
    paySubline: "Без подписки. Без ежемесячных платежей.",
    demoInfo: "⏰ Демо активно 48 часов. После оплаты сайт остаётся онлайн навсегда.",
  },
  de: {
    payButton: "€99 — Einmalzahlung",
    paySubline: "Kein Abo. Keine monatlichen Gebühren.",
    demoInfo:
      "⏰ Ihre Demo ist 48 Stunden aktiv. Nach der Zahlung bleibt Ihre Website dauerhaft online.",
  },
  en: {
    payButton: "€99 — one-time payment",
    paySubline: "No subscription. No monthly fees.",
    demoInfo:
      "⏰ Your demo is active for 48 hours. After payment, your site stays online permanently.",
  },
} as const satisfies Record<UiLang, { payButton: string; paySubline: string; demoInfo: string }>;

export function getPayTranslations(lang: UiLang) {
  return payTranslations[lang] ?? payTranslations.en;
}
