import type { LeadFormMode, LeadLang } from "@/lib/leads/types";

const APPOINTMENT_TYPES = new Set([
  "beauty_salon",
  "barbershop",
  "massage_salon",
  "fitness_club",
  "dental_clinic",
  "health_clinic",
  "hotel_booking",
  "education",
  "cleaning_service",
  "veterinary",
]);

const ORDER_TYPES = new Set(["ecommerce", "technology", "shop"]);

export function resolveLeadFormMode(businessType: string): LeadFormMode {
  const key = String(businessType || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/_crm$/, "");
  if (ORDER_TYPES.has(key) || key.includes("shop") || key.includes("ecommerce")) {
    return "order";
  }
  if (APPOINTMENT_TYPES.has(key) || key.includes("dental") || key.includes("beauty")) {
    return "appointment";
  }
  return "inquiry";
}

export function normalizeLeadLang(value: string | null | undefined): LeadLang {
  const lang = (value || "de").toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("en")) return "en";
  return "de";
}

export const leadFormCopy = {
  en: {
    appointmentCta: "Book now",
    orderCta: "Place order",
    inquiryCta: "Send inquiry",
    titleAppointment: "Book an appointment",
    titleOrder: "Place an order",
    titleInquiry: "Send an inquiry",
    name: "Name",
    phone: "Phone",
    service: "Service / Product",
    servicePlaceholder: "Select…",
    comment: "Comment",
    preferredAt: "Preferred date / time (optional)",
    submit: "Submit",
    sending: "Sending…",
    success: "Thank you! We received your request.",
    errorGeneric: "Could not send. Please try again.",
    errorNetwork: "Connection problem. Please try again.",
    errorRequired: "Name and phone are required.",
    errorPhone: "Please enter a valid phone number.",
    openCrm: "Open CRM",
  },
  de: {
    appointmentCta: "Termin buchen",
    orderCta: "Bestellung aufgeben",
    inquiryCta: "Anfrage senden",
    titleAppointment: "Termin buchen",
    titleOrder: "Bestellung aufgeben",
    titleInquiry: "Anfrage senden",
    name: "Name",
    phone: "Telefon",
    service: "Leistung / Produkt",
    servicePlaceholder: "Auswählen…",
    comment: "Kommentar",
    preferredAt: "Wunschtermin (optional)",
    submit: "Absenden",
    sending: "Senden…",
    success: "Danke! Wir haben Ihre Anfrage erhalten.",
    errorGeneric: "Senden fehlgeschlagen. Bitte erneut versuchen.",
    errorNetwork: "Verbindungsproblem. Bitte erneut versuchen.",
    errorRequired: "Name und Telefon sind erforderlich.",
    errorPhone: "Bitte gültige Telefonnummer eingeben.",
    openCrm: "CRM öffnen",
  },
  ru: {
    appointmentCta: "Записаться",
    orderCta: "Оформить заказ",
    inquiryCta: "Оставить заявку",
    titleAppointment: "Записаться",
    titleOrder: "Оформить заказ",
    titleInquiry: "Оставить заявку",
    name: "Имя",
    phone: "Телефон",
    service: "Услуга / Товар",
    servicePlaceholder: "Выберите…",
    comment: "Комментарий",
    preferredAt: "Предпочтительная дата/время (необязательно)",
    submit: "Отправить",
    sending: "Отправка…",
    success: "Спасибо! Заявка получена.",
    errorGeneric: "Не удалось отправить. Попробуйте ещё раз.",
    errorNetwork: "Проблема со связью. Попробуйте ещё раз.",
    errorRequired: "Имя и телефон обязательны.",
    errorPhone: "Укажите корректный телефон.",
    openCrm: "Открыть CRM",
  },
} as const;

export function leadStatusLabel(language: LeadLang): string {
  if (language === "ru") return "Новая заявка";
  if (language === "de") return "Neuer Lead";
  return "New lead";
}

export function ctaForMode(mode: LeadFormMode, language: LeadLang): string {
  const t = leadFormCopy[language];
  if (mode === "appointment") return t.appointmentCta;
  if (mode === "order") return t.orderCta;
  return t.inquiryCta;
}

export function titleForMode(mode: LeadFormMode, language: LeadLang): string {
  const t = leadFormCopy[language];
  if (mode === "appointment") return t.titleAppointment;
  if (mode === "order") return t.titleOrder;
  return t.titleInquiry;
}
