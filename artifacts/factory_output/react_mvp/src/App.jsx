import { useCallback, useEffect, useMemo, useState } from "react";
import clientData from "./data/client_data.json";
import domainUi from "./data/domain_ui.json";
import nicheLabelsData from "./data/niche-labels.json";
import nicheScenariosData from "./data/niche-scenarios.json";
import nichePromotionsData from "./data/niche-promotions.json";
import { getGalleryImagePaths, getHeroImagePath } from "./lib/image-library.js";
import { useCrmRecords, purgeSeedRecords, CRM_STORAGE_SECTIONS } from "./lib/useCrmRecords.js";
import { syncCrmCatalogToApi, hydrateCrmCatalogFromApi } from "./lib/sync-crm-catalog.js";
import {
  fetchCrmVacancies,
  createCrmVacancy,
  deleteCrmVacancy,
} from "./lib/sync-crm-vacancies.js";
import {
  NICHE_CRM_PAGES,
  CLIENT_TABS,
  BOOKING_TABS,
  CATALOG_TABS,
  STAFF_TABS,
  ASSET_TABS,
  PAYMENT_TABS,
  paymentStatusLabel,
  buildLiveDashboard,
} from "./lib/crm-matrix.js";
import { resolveContrastTokens } from "./lib/contrast.js";

const DEFAULT_THEME = {
  primary: "#8a271e",
  secondary: "#c27b75",
  accent: "#b14020",
  hero_bg: "linear-gradient(135deg, #581913 0%, #a35524 100%)",
  text: "#2a1e1d",
  border: "#e0d8d7",
};

function applyThemeToDocument(theme) {
  const merged = { ...DEFAULT_THEME, ...(theme || {}) };
  const resolved = {
    ...merged,
    hero_bg: merged.hero_bg ?? merged.header_bg ?? DEFAULT_THEME.hero_bg,
  };
  const contrast = resolveContrastTokens(resolved);
  const root = document.documentElement.style;
  root.setProperty("--color-primary", resolved.primary);
  root.setProperty("--color-secondary", resolved.secondary);
  root.setProperty("--color-accent", resolved.accent);
  root.setProperty("--color-hero-bg", resolved.hero_bg);
  root.setProperty("--color-fg", contrast.fg);
  root.setProperty("--color-fg-muted", contrast.fgMuted);
  root.setProperty("--color-border", contrast.border);
  root.setProperty("--color-on-primary", contrast.onPrimary);
  root.setProperty("--color-on-secondary", contrast.onSecondary);
  root.setProperty("--color-on-accent", contrast.onAccent);
  root.setProperty("--color-on-hero", contrast.onHero);
  root.setProperty("--accent", resolved.accent);
  root.setProperty("--accent-soft", resolved.secondary);
  root.setProperty("--accent-foreground", contrast.onAccent);
}

function formatPageLabel(pageKey) {
  return String(pageKey)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readDeployedClientId() {
  if (typeof window === "undefined") {
    return null;
  }
  const baked = window.__CRM_DEMO_CLIENT_ID__;
  return typeof baked === "string" && baked.trim() ? baked.trim() : null;
}

function readDeployedManifest() {
  if (typeof window === "undefined") {
    return null;
  }
  const baked = window.__CRM_DEMO_MANIFEST__;
  if (baked && typeof baked === "object" && !Array.isArray(baked)) {
    return baked;
  }
  return null;
}

function readClientIdFromLocation() {
  if (typeof window === "undefined") {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const fromQuery = searchParams.get("clientId") || searchParams.get("client_id");
  if (fromQuery) {
    return fromQuery;
  }
  const fromDeploy = readDeployedClientId();
  if (fromDeploy) {
    return fromDeploy;
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) {
    return null;
  }
  if (hash.includes("=")) {
    const hashParams = new URLSearchParams(hash.startsWith("?") ? hash.slice(1) : hash);
    return hashParams.get("clientId") || hashParams.get("client_id");
  }
  return null;
}

/** Local/preview override: ?niche=dental_clinic&lang=de (ignored when clientId is set). */
function readPreviewNicheFromLocation() {
  if (typeof window === "undefined") {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const niche = searchParams.get("niche") || searchParams.get("businessType");
  return niche && niche.trim() ? niche.trim() : null;
}

function readPreviewLangFromLocation() {
  if (typeof window === "undefined") {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const lang = (searchParams.get("lang") || searchParams.get("language") || "").toLowerCase();
  if (lang === "en" || lang === "de" || lang === "ru") {
    return lang;
  }
  return null;
}

function unwrapManifestPayload(raw) {
  if (!raw || typeof raw !== "object" || raw.error) {
    return null;
  }
  return raw.manifest ?? raw.data ?? raw.config ?? raw;
}

const TABLE_HEADERS = {
  en: { client: "Client", service: "Service", time: "Time", status: "Status" },
  de: { client: "Kunde", service: "Dienstleistung", time: "Zeit", status: "Status" },
  ru: { client: "Клиент", service: "Услуга", time: "Время", status: "Статус" },
};

const MASSAGE_SERVICE_NAMES = {
  "back massage": {
    en: "Classic Massage",
    de: "Klassische Massage",
    ru: "Классический массаж",
  },
  "relax massage": {
    en: "Relax Massage",
    de: "Entspannungsmassage",
    ru: "Релакс массаж",
  },
  "sport massage": {
    en: "Sport Massage",
    de: "Sportmassage",
    ru: "Спортивный массаж",
  },
  "lymphatic massage": {
    en: "Lymphatic Massage",
    de: "Lymphdrainage",
    ru: "Лимфодренажный массаж",
  },
  "anti-stress massage": {
    en: "Anti-Stress Massage",
    de: "Anti-Stress-Massage",
    ru: "Антистресс массаж",
  },
};

const NICHE_SERVICE_TRANSLATIONS = {
  massage_salon: MASSAGE_SERVICE_NAMES,
  massage_salon_crm: MASSAGE_SERVICE_NAMES,
};

const DENTAL_SERVICE_NAMES = {
  "dental check-up": { en: "Dental Check-up", de: "Zahnkontrolle", ru: "Осмотр зубов" },
  "teeth cleaning": { en: "Teeth Cleaning", de: "Zahnreinigung", ru: "Чистка зубов" },
  cleaning: { en: "Teeth Cleaning", de: "Zahnreinigung", ru: "Чистка зубов" },
  "root canal treatment": {
    en: "Root Canal Treatment",
    de: "Wurzelkanalbehandlung",
    ru: "Лечение корневого канала",
  },
  "root canal": { en: "Root Canal Treatment", de: "Wurzelkanalbehandlung", ru: "Лечение корневого канала" },
};

const DENTAL_NICHES = new Set(["dental_clinic", "health_clinic"]);

/** Pick a localized string for the active UI language only — never fall back to another language. */
function pickLocalized(value, language) {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    if ("ru" in value || "de" in value || "en" in value) {
      const lang = language || "en";
      const hit = value[lang];
      return typeof hit === "string" ? hit : hit == null ? "" : String(hit);
    }
  }
  return value ?? "";
}

function isLocalizedLabel(value) {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("en" in value || "de" in value || "ru" in value)
  );
}

/** Keep full {en,de,ru} for CRM catalog rows — never collapse on read. */
function preserveLocalizedLabel(value) {
  if (isLocalizedLabel(value)) {
    return {
      en: value.en == null ? "" : String(value.en),
      de: value.de == null ? "" : String(value.de),
      ru: value.ru == null ? "" : String(value.ru),
    };
  }
  return value;
}

/** Patch only the active UI language; leave the other two locales intact. */
function patchLocalizedLabel(existing, language, nextValue) {
  const lang = language === "de" || language === "ru" ? language : "en";
  const trimmed = String(nextValue ?? "").trim();
  if (isLocalizedLabel(existing)) {
    return {
      en: existing.en == null ? "" : String(existing.en),
      de: existing.de == null ? "" : String(existing.de),
      ru: existing.ru == null ? "" : String(existing.ru),
      [lang]: trimmed,
    };
  }
  // New row or legacy string — store as LocalizedLabel for the edited language only.
  return { en: "", de: "", ru: "", [lang]: trimmed };
}

function serviceLabel(value, language) {
  if (isLocalizedLabel(value)) {
    return pickLocalized(value, language) || "—";
  }
  if (typeof value === "string" && value.trim()) return value;
  return value == null || value === "" ? "—" : String(value);
}

function localizeRecord(record, language) {
  if (!record || typeof record !== "object") {
    return record;
  }
  const localized = {};
  for (const [key, value] of Object.entries(record)) {
    localized[key] = pickLocalized(value, language);
  }
  return localized;
}

function translateStatus(status, lang) {
  const localized = pickLocalized(status, lang);
  const raw = String(localized || "").toLowerCase().trim();
  const value = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const labels = {
    en: {
      confirmed: "Confirmed",
      inProgress: "In Progress",
      cancelled: "Cancelled",
      completed: "Completed",
      pending: "Pending",
    },
    de: {
      confirmed: "Bestätigt",
      inProgress: "In Bearbeitung",
      cancelled: "Abgesagt",
      completed: "Abgeschlossen",
      pending: "Ausstehend",
    },
    ru: {
      confirmed: "Подтверждён",
      inProgress: "В процессе",
      cancelled: "Отменён",
      completed: "Завершён",
      pending: "Ожидает",
    },
  };

  const t = labels[lang] || labels.en;

  if (
    value.includes("confirm") ||
    value.includes("booked") ||
    value.includes("reserved") ||
    value.includes("bestatigt") ||
    raw.includes("подтверж")
  ) {
    return t.confirmed;
  }
  if (
    value.includes("in progress") ||
    value.includes("in session") ||
    value.includes("in bearbeitung") ||
    raw.includes("процессе") ||
    raw.includes("в процессе")
  ) {
    return t.inProgress;
  }
  if (value.includes("cancel") || value.includes("abgesagt") || raw.includes("отмен")) {
    return t.cancelled;
  }
  if (
    value.includes("complet") ||
    value.includes("done") ||
    value.includes("abgeschlossen") ||
    raw.includes("заверш")
  ) {
    return t.completed;
  }
  if (
    value.includes("pending") ||
    value.includes("waitlist") ||
    value.includes("ausstehend") ||
    raw.includes("ожидает")
  ) {
    return t.pending;
  }

  return localized;
}

function translateServiceName(name, businessType, lang) {
  const value = String(name || "").toLowerCase().trim();
  const nicheMap = NICHE_SERVICE_TRANSLATIONS[businessType];

  if (nicheMap?.[value]?.[lang]) {
    return nicheMap[value][lang];
  }

  if (DENTAL_NICHES.has(businessType)) {
    for (const [key, translations] of Object.entries(DENTAL_SERVICE_NAMES)) {
      if (value.includes(key) && translations[lang]) {
        return translations[lang];
      }
    }
  }

  for (const map of Object.values(NICHE_SERVICE_TRANSLATIONS)) {
    for (const [key, translations] of Object.entries(map)) {
      if (value.includes(key) && translations[lang]) {
        return translations[lang];
      }
    }
  }

  if (RESTAURANT_NICHES.has(businessType)) {
    const dish = lookupTranslation(RESTAURANT_DISH_NAMES, name, lang);
    if (dish) {
      return dish;
    }
  }

  return name;
}

function getTableHeaders(lang) {
  return TABLE_HEADERS[lang] || TABLE_HEADERS.en;
}

const RESTAURANT_TABLE_COLUMNS = {
  en: { id: "ID", name: "Name", seats: "Seats", zone: "Zone", status: "Status" },
  de: { id: "ID", name: "Name", seats: "Plätze", zone: "Zone", status: "Status" },
  ru: { id: "ID", name: "Название", seats: "Мест", zone: "Зона", status: "Статус" },
};

const TABLE_STATUS_LABELS = {
  occupied: { en: "Occupied", de: "Besetzt", ru: "Занят" },
  free: { en: "Free", de: "Frei", ru: "Свободен" },
  available: { en: "Available", de: "Frei", ru: "Свободен" },
  reserved: { en: "Reserved", de: "Reserviert", ru: "Забронирован" },
  "in stock": { en: "In stock", de: "Auf Lager", ru: "В наличии" },
  "auf lager": { en: "In stock", de: "Auf Lager", ru: "В наличии" },
  "low stock": { en: "Low stock", de: "Wenig auf Lager", ru: "Мало на складе" },
  "wenig auf lager": { en: "Low stock", de: "Wenig auf Lager", ru: "Мало на складе" },
  "out of stock": { en: "Out of stock", de: "Nicht auf Lager", ru: "Нет в наличии" },
  "nicht auf lager": { en: "Out of stock", de: "Nicht auf Lager", ru: "Нет в наличии" },
};

const ZONE_LABELS = {
  "main hall": { en: "Main Hall", de: "Hauptsaal", ru: "Главный зал" },
  terrace: { en: "Terrace", de: "Terrasse", ru: "Терраса" },
  vip: { en: "VIP", de: "VIP", ru: "VIP" },
  bar: { en: "Bar", de: "Bar", ru: "Бар" },
};

const MENU_CATEGORY_LABELS = {
  main: { en: "Main", de: "Hauptgericht", ru: "Основное" },
  appetizer: { en: "Appetizer", de: "Vorspeise", ru: "Закуска" },
  dessert: { en: "Dessert", de: "Dessert", ru: "Десерт" },
  drinks: { en: "Drinks", de: "Getränke", ru: "Напитки" },
};

const RESTAURANT_DISH_NAMES = {
  "grilled salmon": { en: "Grilled Salmon", de: "Gegrillter Lachs", ru: "Жареный лосось" },
  "caesar salad": { en: "Caesar Salad", de: "Caesar Salat", ru: "Салат Цезарь" },
  "beef steak": { en: "Beef Steak", de: "Rindersteak", ru: "Говяжий стейк" },
  pasta: { en: "Pasta", de: "Pasta", ru: "Паста" },
};

const RESTAURANT_NICHES = new Set(["restaurant", "restaurant_crm"]);

NICHE_SERVICE_TRANSLATIONS.restaurant = RESTAURANT_DISH_NAMES;
NICHE_SERVICE_TRANSLATIONS.restaurant_crm = RESTAURANT_DISH_NAMES;

const STAFF_ROLE_LABELS = {
  waiter: { en: "Waiter", de: "Kellner", ru: "Официант" },
  chef: { en: "Chef", de: "Küchenchef", ru: "Шеф-повар" },
  manager: { en: "Manager", de: "Manager", ru: "Менеджер" },
  bartender: { en: "Bartender", de: "Barkeeper", ru: "Бармен" },
  receptionist: { en: "Receptionist", de: "Rezeptionist", ru: "Администратор" },
  therapist: { en: "Therapist", de: "Therapeut", ru: "Терапевт" },
  trainer: { en: "Trainer", de: "Trainer", ru: "Тренер" },
  doctor: { en: "Doctor", de: "Arzt", ru: "Врач" },
  master: { en: "Master", de: "Meister", ru: "Мастер" },
  mechanic: { en: "Mechanic", de: "Mechaniker", ru: "Механик" },
  driver: { en: "Driver", de: "Fahrer", ru: "Водитель" },
  teacher: { en: "Teacher", de: "Lehrer", ru: "Преподаватель" },
  dentist: { en: "Dentist", de: "Zahnarzt", ru: "Стоматолог" },
  orthodontist: { en: "Orthodontist", de: "Kieferorthopäde", ru: "Ортодонт" },
  hygienist: { en: "Hygienist", de: "Hygienikerin", ru: "Гигиенист" },
};

const STAFF_STATUS_LABELS = {
  active: { en: "Active", de: "Aktiv", ru: "Активен" },
  inactive: { en: "Inactive", de: "Inaktiv", ru: "Неактивен" },
  "on leave": { en: "On leave", de: "Im Urlaub", ru: "В отпуске" },
  available: { en: "Available", de: "Verfügbar", ru: "Доступен" },
  "in surgery": { en: "In Surgery", de: "Im Eingriff", ru: "На приёме" },
  "in consultation": { en: "In consultation", de: "In Beratung", ru: "На консультации" },
};

function lookupTranslation(map, value, lang) {
  const normalized = String(value || "").toLowerCase().trim();
  if (map[normalized]?.[lang]) {
    return map[normalized][lang];
  }
  for (const [key, translations] of Object.entries(map)) {
    if (normalized.includes(key) && translations[lang]) {
      return translations[lang];
    }
  }
  return null;
}

function translateTableColumnHeader(key, lang) {
  const columns = RESTAURANT_TABLE_COLUMNS[lang] || RESTAURANT_TABLE_COLUMNS.en;
  const normalized = String(key || "").toLowerCase();
  return columns[normalized] || formatPageLabel(key);
}

function translateTableStatus(status, lang) {
  const translated = lookupTranslation(TABLE_STATUS_LABELS, status, lang);
  return translated || status;
}

function translateZone(zone, lang) {
  const translated = lookupTranslation(ZONE_LABELS, zone, lang);
  return translated || zone;
}

function translateMenuCategory(category, lang) {
  const translated = lookupTranslation(MENU_CATEGORY_LABELS, category, lang);
  return translated || category;
}

function translateStaffRole(role, lang) {
  const localized = pickLocalized(role, lang);
  const translated = lookupTranslation(STAFF_ROLE_LABELS, localized, lang);
  return translated || localized;
}

function translateStaffStatus(status, lang) {
  const localized = pickLocalized(status, lang);
  const raw = String(localized || "").toLowerCase().trim();
  const translated = lookupTranslation(STAFF_STATUS_LABELS, localized, lang);
  if (translated) {
    return translated;
  }
  if (raw.includes("surgery") || raw.includes("eingriff") || raw.includes("приёме")) {
    return STAFF_STATUS_LABELS["in surgery"][lang] || localized;
  }
  return localized;
}

function translateTableCellValue(key, value, lang) {
  const column = String(key || "").toLowerCase();
  const localized = pickLocalized(value, lang);
  if (column === "status") {
    return translateTableStatus(localized, lang);
  }
  if (column === "zone") {
    return translateZone(localized, lang);
  }
  return localized;
}

function normalizeDemoData(data, language = "en") {
  if (!data || typeof data !== "object") return null;
  const records = data.records || {};
  const pendingFallback = { en: "Pending", de: "Ausstehend", ru: "Ожидает" };
  const availableFallback = { en: "Available", de: "Verfügbar", ru: "Доступен" };

  return {
    clients: (data.clients || records.clients || records.patients || records.members || records.guests || records.students || records.customers || []).map((item) => ({
      name: pickLocalized(item.name || item.title, language) || "—",
      visits: item.visits ?? item.deals ?? 1,
      note: pickLocalized(item.note || item.interest || item.status, language) || "",
    })),
    appointments: (data.appointments || records.work_orders || records.viewings || records.appointments || []).map((item) => ({
      client: pickLocalized(item.client || item.name, language) || "—",
      service: pickLocalized(item.service || item.property || item.title, language) || "—",
      time: item.time || item.date || "—",
      status: pickLocalized(item.status, language) || pendingFallback[language] || pendingFallback.en,
    })),
    services: (data.services || records.menu || records.products || records.subscriptions || records.classes || records.courses || records.properties || records.services || []).map((item) => {
      const rawPrice = item.price ?? item.value;
      const rawName = item.name || item.title;
      const rawDuration = item.duration || item.category;
      const price =
        rawPrice != null && typeof rawPrice === "object"
          ? pickLocalized(rawPrice, language) || "—"
          : rawPrice || "—";
      // Catalog names must stay as full {en,de,ru} in CRM state — collapsing here
      // caused CRM→site sync to overwrite every locale with the UI language.
      return {
        name: isLocalizedLabel(rawName)
          ? preserveLocalizedLabel(rawName)
          : pickLocalized(rawName, language) || "—",
        price,
        duration: isLocalizedLabel(rawDuration)
          ? preserveLocalizedLabel(rawDuration)
          : pickLocalized(rawDuration, language) || "",
        status: pickLocalized(item.status, language) || "",
      };
    }),
    staff: (data.staff || records.staff || records.masters || records.doctors || records.therapists || records.trainers || records.mechanics || records.developers || records.teachers || records.drivers || records.agents || []).map((item) => ({
      name: pickLocalized(item.name, language) || "—",
      role: pickLocalized(item.role || item.interest, language) || "—",
      status: pickLocalized(item.status, language) || availableFallback[language] || availableFallback.en,
    })),
    notifications: Array.isArray(data.notifications) ? data.notifications : [],
  };
}

function getPageRecords(data, pageKey) {
  if (!data || typeof data !== "object") return [];
  if (data.records?.[pageKey]) return data.records[pageKey];
  if (Array.isArray(data[pageKey])) return data[pageKey];
  return [];
}

const DEFAULT_BUSINESS_TYPE = "beauty_salon";
const LOADING_DOCUMENT_TITLE = "Website + CRM + Booking — Loading…";

const NICHE_FOLDER_MAP = {
  beauty_salon: "beauty",
  restaurant: "restaurant",
  restaurant_crm: "restaurant",
  fitness_club: "fitness",
  fitness: "fitness",
  massage_salon: "massage",
  massage_salon_crm: "massage",
  car_service: "car_service",
  car_service_crm: "car_service",
  health_clinic: "health_clinic",
  dental_clinic: "dental",
  hotel_booking: "hotel",
  education: "education",
  logistics: "logistics",
  logistics_crm: "logistics",
  delivery: "logistics",
  ecommerce: "ecommerce",
  ecommerce_crm: "ecommerce",
  technology: "technology",
  real_estate: "real_estate",
  real_estate_crm: "real_estate",
  car_wash: "car_wash",
  barbershop: "barbershop",
};

const NICHE_LABELS_KEY_MAP = {
  restaurant_crm: "restaurant",
  massage_salon_crm: "massage_salon",
  car_service_crm: "car_service",
  real_estate_crm: "real_estate",
  fitness: "fitness_club",
  barbershop: "barbershop",
  ecommerce_crm: "ecommerce",
  logistics_crm: "logistics",
  delivery: "logistics",
};

const DEFAULT_GENERIC_PAGES = [
  "dashboard",
  "clients",
  "appointments",
  "services",
  "integrations",
  "settings",
];

/** Ensure Integrations sits before Settings for every niche (shared, sector-agnostic). */
function ensureIntegrationsInPages(pages) {
  const next = Array.isArray(pages) ? [...pages] : [];
  const without = next.filter((id) => id !== "integrations");
  const settingsIdx = without.indexOf("settings");
  if (settingsIdx >= 0) {
    without.splice(settingsIdx, 0, "integrations");
  } else {
    without.push("integrations");
  }
  return without;
}

/** Ensure Vacancies sits right after Dashboard for every niche. */
function ensureVacanciesInPages(pages) {
  const next = Array.isArray(pages) ? pages.filter((id) => id !== "vacancies") : [];
  const dashIdx = next.indexOf("dashboard");
  if (dashIdx >= 0) {
    next.splice(dashIdx + 1, 0, "vacancies");
  } else {
    next.unshift("vacancies");
  }
  return next;
}

function getNicheLabelsKey(businessType) {
  const normalized = String(businessType || "").trim();
  if (!normalized) {
    return normalized;
  }
  if (nicheScenariosData[normalized] || nicheLabelsData[normalized]) {
    return normalized;
  }
  const mapped = NICHE_LABELS_KEY_MAP[normalized];
  if (mapped && (nicheScenariosData[mapped] || nicheLabelsData[mapped])) {
    return mapped;
  }
  if (normalized.endsWith("_crm")) {
    const withoutCrm = normalized.slice(0, -4);
    if (nicheScenariosData[withoutCrm] || nicheLabelsData[withoutCrm]) {
      return withoutCrm;
    }
  }
  return normalized;
}

function getTodayItemName(item, language) {
  if (typeof item === "string") return item;
  if (item?.name && typeof item.name === "object") {
    return pickLocalized(item.name, language) || "—";
  }
  return item?.name ?? "—";
}

function getTodayItemService(item, language) {
  if (typeof item?.service === "string") return item.service;
  if (item?.service && typeof item.service === "object") {
    return pickLocalized(item.service, language) || "—";
  }
  return item?.service ?? "—";
}

function getOwnerSummary(businessName, metricValue, language) {
  if (!metricValue) {
    return businessName;
  }
  const suffix = { ru: "сегодня", de: "heute", en: "today" };
  return `${businessName} — ${metricValue} ${suffix[language] ?? suffix.en}`;
}

const NICHE_TO_BUSINESS_TYPE = {
  beauty: "beauty_salon",
  restaurant: "restaurant",
  fitness: "fitness_club",
  massage: "massage_salon",
  dental: "dental_clinic",
  hotel: "hotel_booking",
  health_clinic: "health_clinic",
  car_service: "car_service",
  real_estate: "real_estate",
  ecommerce: "ecommerce",
  education: "education",
  logistics: "logistics",
  technology: "technology",
};

function normalizeBusinessType(value) {
  if (value == null || value === "") {
    return null;
  }
  const raw = String(value).trim().toLowerCase();
  if (NICHE_TO_BUSINESS_TYPE[raw]) {
    return NICHE_TO_BUSINESS_TYPE[raw];
  }
  if (nicheLabelsData[raw] || nicheScenariosData[raw]) {
    return raw;
  }
  const mapped = NICHE_LABELS_KEY_MAP[raw];
  if (mapped && (nicheLabelsData[mapped] || nicheScenariosData[mapped])) {
    return mapped;
  }
  if (raw.endsWith("_crm")) {
    const withoutCrm = raw.slice(0, -4);
    if (nicheLabelsData[withoutCrm] || nicheScenariosData[withoutCrm]) {
      return withoutCrm;
    }
  }
  return raw;
}

function normalizeManifestConfig(raw) {
  const payload = unwrapManifestPayload(raw);
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const businessType = normalizeBusinessType(
    payload.businessType ?? payload.business_type ?? payload.niche,
  );
  const sectorIdRaw = payload.sectorId ?? payload.sector_id ?? null;
  const sectorId =
    typeof sectorIdRaw === "string" && sectorIdRaw.trim()
      ? sectorIdRaw.trim().toLowerCase()
      : null;
  const themeSource =
    payload.theme && typeof payload.theme === "object" ? payload.theme : {};
  const theme = {
    ...themeSource,
    accent: themeSource.accent ?? payload.primaryColor ?? themeSource.primary,
    hero_bg: themeSource.hero_bg ?? themeSource.header_bg,
  };
  const hasTheme = Object.values(theme).some((value) => value != null && value !== "");

  return {
    businessName: payload.businessName ?? payload.business_name ?? null,
    ownerName: payload.ownerName ?? payload.owner_name ?? payload.name ?? null,
    businessType,
    sectorId,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    whatsapp: payload.whatsapp ?? null,
    postalCode: payload.postalCode ?? payload.postal_code ?? null,
    address: payload.address ?? null,
    city: payload.city ?? null,
    pages: Array.isArray(payload.pages) ? payload.pages : null,
    demoData: payload.demoData ?? payload.demo_data ?? null,
    features: Array.isArray(payload.features) ? payload.features : null,
    language: payload.language ?? null,
    subtitle: payload.subtitle ?? null,
    theme: hasTheme ? theme : null,
    promotion: payload.promotion ?? null,
    scenario: payload.scenario ?? null,
    galleryPhotos: payload.galleryPhotos ?? payload.gallery_photos ?? null,
    heroPhoto: payload.heroPhoto ?? payload.hero_photo ?? null,
    sections: payload.sections ?? null,
    labels: payload.labels ?? null,
  };
}

function isPopulatedScenario(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value.metrics ||
        value.records ||
        (Array.isArray(value.metric_values) && value.metric_values.length > 0)),
  );
}

function applyManifestPatch(config, handlers) {
  const normalized = normalizeManifestConfig(config);
  if (!normalized) {
    return false;
  }

  let applied = false;

  if (normalized.businessName) {
    handlers.setBusinessName(normalized.businessName);
    applied = true;
  }
  if (normalized.ownerName && handlers.setOwnerName) {
    handlers.setOwnerName(normalized.ownerName);
    applied = true;
  }
  if (normalized.businessType) {
    handlers.setBusinessType(normalized.businessType);
    applied = true;
    if (!normalized.sections) {
      handlers.setUiSections({});
    }
    if (!normalized.labels) {
      handlers.setUiLabels({});
    }
  }
  if (normalized.sectorId && handlers.setSectorId) {
    handlers.setSectorId(normalized.sectorId);
    applied = true;
  }
  if (normalized.phone) {
    handlers.setPhone(normalized.phone);
    applied = true;
  }
  if (normalized.email) {
    handlers.setEmail(normalized.email);
    applied = true;
  }
  if (normalized.whatsapp) {
    handlers.setWhatsapp(normalized.whatsapp);
    applied = true;
  }
  if (normalized.postalCode) {
    handlers.setPostalCode(normalized.postalCode);
    applied = true;
  }
  if (normalized.address) {
    handlers.setAddress(normalized.address);
    applied = true;
  }
  if (normalized.city) {
    handlers.setCity(normalized.city);
    applied = true;
  }
  if (normalized.pages?.length) {
    handlers.setPages(normalized.pages);
    applied = true;
  }
  if (normalized.demoData) {
    handlers.setDemoData(normalized.demoData);
    applied = true;
  }
  if (normalized.features?.length) {
    handlers.setFeatures(normalized.features);
    applied = true;
  }
  if (normalized.language) {
    handlers.setLanguage(normalized.language);
    applied = true;
  }
  if (normalized.subtitle) {
    handlers.setSubtitle(normalized.subtitle);
    applied = true;
  }
  if (normalized.theme) {
    applyThemeToDocument(normalized.theme);
    if (normalized.theme.hero_bg) {
      handlers.setHeroBackground(normalized.theme.hero_bg);
    }
    applied = true;
  }
  if (normalized.promotion) {
    handlers.setPromotion(normalized.promotion);
    applied = true;
  }
  if (isPopulatedScenario(normalized.scenario)) {
    handlers.setScenario(normalized.scenario);
    applied = true;
  }
  if (Array.isArray(normalized.galleryPhotos) && normalized.galleryPhotos.length > 0) {
    handlers.setGalleryPhotos(normalized.galleryPhotos);
    applied = true;
  }
  if (normalized.heroPhoto) {
    handlers.setHeroPhoto(normalized.heroPhoto);
    applied = true;
  }
  if (normalized.sections) {
    handlers.setUiSections(normalized.sections);
    applied = true;
  }
  if (normalized.labels) {
    handlers.setUiLabels(normalized.labels);
    applied = true;
  }

  return applied;
}

function getNicheLabelsConfig(businessType) {
  const key = getNicheLabelsKey(businessType);
  return nicheLabelsData[key] ?? { panel_title: {}, tabs: {} };
}

function getNicheScenario(businessType) {
  const key = getNicheLabelsKey(businessType);
  return nicheScenariosData[key] ?? null;
}

function pickRandomPromotion(businessType) {
  const key = getNicheLabelsKey(businessType);
  const list = nichePromotionsData[key];
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return list[Math.floor(Math.random() * list.length)];
}

function getPromotionText(promotion, language) {
  if (!promotion) {
    return "";
  }
  return pickLocalized(promotion, language) || "";
}

const DASHBOARD_SECTION_LABELS = {
  today: { ru: "Сегодня в работе", de: "Heute im Betrieb", en: "Today in Progress" },
  popular: { ru: "Популярные услуги", de: "Beliebte Leistungen", en: "Popular Services" },
  specialOffer: { ru: "Специальное предложение", de: "Sonderangebot", en: "Special Offer" },
};

const COUNTER_LABELS_I18N = {
  restaurant: {
    ru: ["Гостей", "Бронирований", "Столов", "Персонала"],
    de: ["Gäste", "Reservierungen", "Tische", "Personal"],
    en: ["Guests", "Reservations", "Tables", "Staff"],
  },
  restaurant_crm: {
    ru: ["Гостей", "Бронирований", "Столов", "Персонала"],
    de: ["Gäste", "Reservierungen", "Tische", "Personal"],
    en: ["Guests", "Reservations", "Tables", "Staff"],
  },
  beauty_salon: {
    ru: ["Клиентов", "Записей", "Услуг", "Мастеров"],
    de: ["Kunden", "Termine", "Dienstleistungen", "Meister"],
    en: ["Clients", "Appointments", "Services", "Stylists"],
  },
  fitness_club: {
    ru: ["Членов", "Тренировок", "Абонементов", "Тренеров"],
    de: ["Mitglieder", "Trainings", "Abos", "Trainer"],
    en: ["Members", "Workouts", "Plans", "Trainers"],
  },
  fitness: {
    ru: ["Членов", "Тренировок", "Абонементов", "Тренеров"],
    de: ["Mitglieder", "Trainings", "Abos", "Trainer"],
    en: ["Members", "Workouts", "Plans", "Trainers"],
  },
  education: {
    ru: ["Студентов", "Занятий", "Классов", "Учителей"],
    de: ["Studenten", "Kurse", "Klassen", "Lehrer"],
    en: ["Students", "Classes", "Courses", "Teachers"],
  },
  car_service: {
    ru: ["Клиентов", "Заказов", "Машин", "Механиков"],
    de: ["Kunden", "Aufträge", "Fahrzeuge", "Mechaniker"],
    en: ["Clients", "Orders", "Vehicles", "Mechanics"],
  },
  car_service_crm: {
    ru: ["Клиентов", "Заказов", "Машин", "Механиков"],
    de: ["Kunden", "Aufträge", "Fahrzeuge", "Mechaniker"],
    en: ["Clients", "Orders", "Vehicles", "Mechanics"],
  },
  health_clinic: {
    ru: ["Пациентов", "Приёмов", "Процедур", "Врачей"],
    de: ["Patienten", "Termine", "Leistungen", "Ärzte"],
    en: ["Patients", "Appointments", "Procedures", "Doctors"],
  },
  dental_clinic: {
    ru: ["Пациентов", "Приёмов", "Процедур", "Врачей"],
    de: ["Patienten", "Termine", "Leistungen", "Ärzte"],
    en: ["Patients", "Appointments", "Procedures", "Doctors"],
  },
  massage_salon: {
    ru: ["Клиентов", "Сессий", "Услуг", "Мастеров"],
    de: ["Kunden", "Sitzungen", "Leistungen", "Therapeuten"],
    en: ["Clients", "Sessions", "Services", "Therapists"],
  },
  massage_salon_crm: {
    ru: ["Клиентов", "Сессий", "Услуг", "Мастеров"],
    de: ["Kunden", "Sitzungen", "Leistungen", "Therapeuten"],
    en: ["Clients", "Sessions", "Services", "Therapists"],
  },
  logistics: {
    ru: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
    de: ["Kunden", "Routen", "Lieferungen", "Fahrer"],
    en: ["Clients", "Routes", "Deliveries", "Drivers"],
  },
  logistics_crm: {
    ru: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
    de: ["Kunden", "Routen", "Lieferungen", "Fahrer"],
    en: ["Clients", "Routes", "Deliveries", "Drivers"],
  },
  delivery: {
    ru: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
    de: ["Kunden", "Routen", "Lieferungen", "Fahrer"],
    en: ["Clients", "Routes", "Deliveries", "Drivers"],
  },
  ecommerce: {
    ru: ["Клиентов", "Заказов", "Товаров", "Сотрудников"],
    de: ["Kunden", "Bestellungen", "Produkte", "Mitarbeiter"],
    en: ["Clients", "Orders", "Products", "Staff"],
  },
  ecommerce_crm: {
    ru: ["Клиентов", "Заказов", "Товаров", "Сотрудников"],
    de: ["Kunden", "Bestellungen", "Produkte", "Mitarbeiter"],
    en: ["Clients", "Orders", "Products", "Staff"],
  },
  hotel_booking: {
    ru: ["Гостей", "Бронирований", "Номеров", "Персонала"],
    de: ["Gäste", "Reservierungen", "Zimmer", "Personal"],
    en: ["Guests", "Reservations", "Rooms", "Staff"],
  },
  technology: {
    ru: ["Клиентов", "Проектов", "Задач", "Сотрудников"],
    de: ["Kunden", "Projekte", "Aufgaben", "Mitarbeiter"],
    en: ["Clients", "Projects", "Tasks", "Staff"],
  },
  real_estate: {
    ru: ["Клиентов", "Объектов", "Просмотров", "Агентов"],
    de: ["Kunden", "Objekte", "Besichtigungen", "Makler"],
    en: ["Clients", "Properties", "Viewings", "Agents"],
  },
  real_estate_crm: {
    ru: ["Клиентов", "Объектов", "Просмотров", "Агентов"],
    de: ["Kunden", "Objekte", "Besichtigungen", "Makler"],
    en: ["Clients", "Properties", "Viewings", "Agents"],
  },
  law_firm: {
    ru: ["Клиентов", "Встреч", "Дел", "Юристов"],
    de: ["Mandanten", "Termine", "Mandate", "Anwälte"],
    en: ["Clients", "Meetings", "Matters", "Lawyers"],
  },
  accounting: {
    ru: ["Клиентов", "Встреч", "Счетов", "Бухгалтеров"],
    de: ["Mandanten", "Termine", "Rechnungen", "Buchhalter"],
    en: ["Clients", "Meetings", "Invoices", "Accountants"],
  },
  construction: {
    ru: ["Клиентов", "Выездов", "Проектов", "Бригад"],
    de: ["Kunden", "Termine", "Projekte", "Teams"],
    en: ["Clients", "Site visits", "Projects", "Crews"],
  },
  cleaning_service: {
    ru: ["Клиентов", "Уборок", "Объектов", "Сотрудников"],
    de: ["Kunden", "Einsätze", "Objekte", "Mitarbeiter"],
    en: ["Clients", "Jobs", "Locations", "Staff"],
  },
  car_wash: {
    ru: ["Клиентов", "Заказов на мойку", "Услуг мойки", "Сотрудников"],
    de: ["Kunden", "Waschaufträge", "Waschleistungen", "Mitarbeiter"],
    en: ["Customers", "Wash Orders", "Wash Services", "Employees"],
  },
  veterinary_clinic: {
    ru: ["Питомцев", "Приёмов", "Владельцев", "Врачей"],
    de: ["Haustiere", "Termine", "Besitzer", "Tierärzte"],
    en: ["Pets", "Appointments", "Owners", "Vets"],
  },
};

const COUNTER_LABELS = {
  restaurant: ["Гостей", "Бронирований", "Столов", "Персонала"],
  restaurant_crm: ["Гостей", "Бронирований", "Столов", "Персонала"],
  beauty_salon: ["Клиентов", "Записей", "Услуг", "Мастеров"],
  fitness_club: ["Членов", "Тренировок", "Абонементов", "Тренеров"],
  fitness: ["Членов", "Тренировок", "Абонементов", "Тренеров"],
  education: ["Студентов", "Занятий", "Классов", "Учителей"],
  car_service: ["Клиентов", "Заказов", "Машин", "Механиков"],
  car_service_crm: ["Клиентов", "Заказов", "Машин", "Механиков"],
  health_clinic: ["Пациентов", "Приёмов", "Процедур", "Врачей"],
  dental_clinic: ["Пациентов", "Приёмов", "Процедур", "Врачей"],
  logistics: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
  logistics_crm: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
  delivery: ["Клиентов", "Маршрутов", "Доставок", "Водителей"],
  ecommerce: ["Клиентов", "Заказов", "Товаров", "Сотрудников"],
  ecommerce_crm: ["Клиентов", "Заказов", "Товаров", "Сотрудников"],
  real_estate: ["Клиентов", "Объектов", "Просмотров", "Агентов"],
  real_estate_crm: ["Клиентов", "Объектов", "Просмотров", "Агентов"],
};

function getNicheFolder(businessType) {
  return NICHE_FOLDER_MAP[businessType] ?? businessType ?? "beauty";
}

const NICHE_ICONS = {
  restaurant: "🍽️",
  restaurant_crm: "🍽️",
  beauty_salon: "💇",
  fitness_club: "💪",
  fitness: "💪",
  dental_clinic: "🦷",
  health_clinic: "🏥",
  massage_salon: "/image-library/massage_salon/logo.png",
  massage_salon_crm: "/image-library/massage_salon/logo.png",
  car_service: "🚗",
  car_service_crm: "🚗",
  hotel_booking: "🏨",
  education: "📚",
  logistics: "🚛",
  logistics_crm: "🚛",
  delivery: "🚛",
  ecommerce: "🛒",
  ecommerce_crm: "🛒",
  technology: "💻",
  real_estate: "/image-library/real_estate/logo.png",
  real_estate_crm: "/image-library/real_estate/logo.png",
  law_firm: "⚖️",
  accounting: "📊",
  construction: "🏗️",
  cleaning_service: "🧹",
  car_wash: "🫧",
  veterinary_clinic: "🐾",
};

const NICHE_SECTOR_LABELS = {
  restaurant: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  restaurant_crm: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  beauty_salon: { ru: "Салон красоты", de: "Beauty-Salon", en: "Beauty Salon" },
  barbershop: { ru: "Барбершоп", de: "Barbershop", en: "Barbershop" },
  fitness_club: { ru: "Фитнес-клуб", de: "Fitnessstudio", en: "Fitness Club" },
  fitness: { ru: "Фитнес-клуб", de: "Fitnessstudio", en: "Fitness Club" },
  massage_salon: { ru: "Массажный салон", de: "Massagestudio", en: "Massage Studio" },
  massage_salon_crm: { ru: "Массажный салон", de: "Massagestudio", en: "Massage Studio" },
  car_service: { ru: "Автосервис", de: "Autowerkstatt", en: "Auto Repair" },
  car_service_crm: { ru: "Автосервис", de: "Autowerkstatt", en: "Auto Repair" },
  health_clinic: { ru: "Медицинская клиника", de: "Medizinische Klinik", en: "Medical Clinic" },
  dental_clinic: { ru: "Стоматология", de: "Zahnarztpraxis", en: "Dentistry" },
  hotel_booking: { ru: "Отель", de: "Hotel", en: "Hotel" },
  education: { ru: "Образовательный центр", de: "Bildungszentrum", en: "Education Center" },
  logistics: { ru: "Логистика и транспорт", de: "Logistik & Transport", en: "Logistics & Transport" },
  logistics_crm: { ru: "Логистика и транспорт", de: "Logistik & Transport", en: "Logistics & Transport" },
  delivery: { ru: "Логистика и транспорт", de: "Logistik & Transport", en: "Logistics & Transport" },
  ecommerce: { ru: "Интернет-магазин", de: "Online-Shop", en: "Online Store" },
  ecommerce_crm: { ru: "Интернет-магазин", de: "Online-Shop", en: "Online Store" },
  technology: { ru: "IT и технологии", de: "IT & Technologie", en: "IT & Technology" },
  real_estate: { ru: "Агентство недвижимости", de: "Immobilienagentur", en: "Real Estate Agency" },
  real_estate_crm: { ru: "Агентство недвижимости", de: "Immobilienagentur", en: "Real Estate Agency" },
  law_firm: { ru: "Юридическая фирма", de: "Anwaltskanzlei", en: "Law Firm" },
  accounting: { ru: "Бухгалтерские услуги", de: "Buchhaltungsservice", en: "Accounting Services" },
  construction: { ru: "Строительство", de: "Bauunternehmen", en: "Construction" },
  cleaning_service: { ru: "Клининг", de: "Reinigungsservice", en: "Cleaning Service" },
  car_wash: { ru: "Автомойка", de: "Autowäsche", en: "Car Wash" },
  veterinary_clinic: { ru: "Ветеринарная клиника", de: "Tierklinik", en: "Veterinary Clinic" },
};

/** Wizard sector id → localized Branche (matches client-wizard copy.sectors). */
const WIZARD_SECTOR_LABELS = {
  beauty: { ru: "Салон красоты", de: "Beauty-Salon", en: "Beauty Salon" },
  barbershop: { ru: "Барбершоп", de: "Barbershop", en: "Barbershop" },
  massage: { ru: "Массажный салон", de: "Massagestudio", en: "Massage Studio" },
  fitness: { ru: "Фитнес-клуб", de: "Fitnessstudio", en: "Fitness Club" },
  yoga: { ru: "Йога-студия", de: "Yoga-Studio", en: "Yoga Studio" },
  dental: { ru: "Стоматология", de: "Zahnarztpraxis", en: "Dentistry" },
  health: { ru: "Медицинская клиника", de: "Medizinische Klinik", en: "Medical Clinic" },
  food: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  cafe: { ru: "Кафе", de: "Café", en: "Café" },
  hotel: { ru: "Отель", de: "Hotel", en: "Hotel" },
  car_service: { ru: "Автосервис", de: "Autowerkstatt", en: "Auto Repair" },
  tire_service: { ru: "Шиномонтаж", de: "Reifendienst", en: "Tire Service" },
  car_wash: { ru: "Автомойка", de: "Autowäsche", en: "Car Wash" },
  realestate: { ru: "Агентство недвижимости", de: "Immobilienagentur", en: "Real Estate Agency" },
  law_firm: { ru: "Юридическая фирма", de: "Anwaltskanzlei", en: "Law Firm" },
  accounting: { ru: "Бухгалтерские услуги", de: "Buchhaltungsservice", en: "Accounting Services" },
  education: { ru: "Образовательный центр", de: "Bildungszentrum", en: "Education Center" },
  logistics: { ru: "Логистика и транспорт", de: "Logistik & Transport", en: "Logistics & Transport" },
  shop: { ru: "Интернет-магазин", de: "Online-Shop", en: "Online Store" },
  tech: { ru: "IT и технологии", de: "IT & Technologie", en: "IT & Technology" },
};

/** Niche-specific CRM “add booking/order” CTA (sector_id preferred). */
const CRM_ADD_BOOKING_CTA = {
  car_wash: {
    ru: "Добавить заказ на мойку",
    de: "Waschauftrag hinzufügen",
    en: "Add Wash Order",
  },
  food: {
    ru: "Добавить бронирование",
    de: "Reservierung hinzufügen",
    en: "Add reservation",
  },
  cafe: {
    ru: "Добавить бронирование",
    de: "Reservierung hinzufügen",
    en: "Add reservation",
  },
  hotel: {
    ru: "Добавить бронирование",
    de: "Reservierung hinzufügen",
    en: "Add reservation",
  },
  barbershop: {
    ru: "Добавить запись",
    de: "Termin hinzufügen",
    en: "Add appointment",
  },
  shop: {
    ru: "Добавить заказ",
    de: "Bestellung hinzufügen",
    en: "Add order",
  },
  tech: {
    ru: "Добавить заказ",
    de: "Auftrag hinzufügen",
    en: "Add order",
  },
  car_service: {
    ru: "Добавить заказ",
    de: "Auftrag hinzufügen",
    en: "Add work order",
  },
  tire_service: {
    ru: "Добавить заказ",
    de: "Auftrag hinzufügen",
    en: "Add work order",
  },
  logistics: {
    ru: "Добавить заказ",
    de: "Auftrag hinzufügen",
    en: "Add order",
  },
};

function getCrmAddBookingCta(sectorId, language, fallback) {
  const lang = language || "en";
  if (sectorId && CRM_ADD_BOOKING_CTA[sectorId]) {
    return CRM_ADD_BOOKING_CTA[sectorId][lang] || CRM_ADD_BOOKING_CTA[sectorId].en || fallback;
  }
  return fallback;
}

/**
 * Canonical Branche/Niche for Settings, sidebar, footer.
 * Prefer wizard sector_id when present (yoga/cafe/etc.), else businessType.
 */
function getSectorLabel(businessType, language, sectorId = null) {
  const lang = language || "en";
  if (sectorId && WIZARD_SECTOR_LABELS[sectorId]) {
    const bySector = WIZARD_SECTOR_LABELS[sectorId];
    return bySector[lang] || "";
  }
  const key = normalizeBusinessType(businessType) || businessType;
  if (!key) {
    return "";
  }
  const labels = NICHE_SECTOR_LABELS[key];
  if (labels) {
    return labels[lang] || "";
  }
  return formatPageLabel(key);
}

const PAGE_ALIASES = {
  patients: "clients",
  doctors: "staff",
  masters: "masters",
  therapists: "staff",
  agents: "staff",
  mechanics: "mechanics",
  viewings: "appointments",
  booking: "reservations",
  fahrzeuge: "vehicles",
  workorders: "work_orders",
  schuler: "students",
};

const PAGE_TAB_ICONS = {
  dashboard: "🏠",
  vacancies: "💼",
  appointments: "📅",
  reservations: "📅",
  clients: "👥",
  patients: "👥",
  students: "🎓",
  tables: "🪑",
  rooms: "🛏️",
  menu: "📋",
  services: "🛠",
  courses: "📚",
  products: "📦",
  staff: "👤",
  doctors: "👤",
  masters: "👤",
  therapists: "👤",
  agents: "👤",
  mechanics: "🔧",
  developers: "💻",
  teachers: "👨‍🏫",
  drivers: "🚗",
  notifications: "🔔",
  integrations: "🔌",
  settings: "⚙️",
  payments: "💳",
  invoices: "🧾",
  properties: "🏠",
  viewings: "📅",
  contracts: "📄",
  vehicles: "🚙",
  routes: "🗺️",
  deliveries: "📦",
  work_orders: "🔧",
  orders: "📋",
  projects: "📁",
  guests: "👥",
  housekeeping: "🧹",
};

const TAB_FALLBACK_LABELS = {
  en: {
    clients: "Clients",
    staff: "Staff",
    notifications: "Notifications",
    integrations: "Integrations",
    vacancies: "Jobs",
    patients: "Patients",
    doctors: "Doctors",
    masters: "Masters",
    payments: "Payments",
    invoices: "Invoices",
    orders: "Orders",
    properties: "Properties",
    vehicles: "Vehicles",
    tables: "Tables",
    rooms: "Rooms",
    routes: "Routes",
    amount: "Amount",
    addPayment: "Add Payment",
    markPaid: "Mark paid",
    linkedBooking: "Linked booking",
  },
  de: {
    clients: "Kunden",
    staff: "Personal",
    notifications: "Benachrichtigungen",
    integrations: "Integrationen",
    vacancies: "Jobs",
    patients: "Patienten",
    doctors: "Ärzte",
    masters: "Meister",
    payments: "Zahlungen",
    invoices: "Rechnungen",
    orders: "Bestellungen",
    properties: "Objekte",
    vehicles: "Fahrzeuge",
    tables: "Tische",
    rooms: "Zimmer",
    routes: "Routen",
    amount: "Betrag",
    addPayment: "Zahlung hinzufügen",
    markPaid: "Als bezahlt markieren",
    linkedBooking: "Verknüpfter Termin",
  },
  ru: {
    clients: "Клиенты",
    staff: "Персонал",
    notifications: "Уведомления",
    integrations: "Интеграции",
    vacancies: "Вакансии",
    patients: "Пациенты",
    doctors: "Врачи",
    masters: "Мастера",
    payments: "Платежи",
    invoices: "Счета",
    orders: "Заказы",
    properties: "Объекты",
    vehicles: "Авто",
    tables: "Столы",
    rooms: "Номера",
    routes: "Маршруты",
    amount: "Сумма",
    addPayment: "Добавить платёж",
    markPaid: "Отметить оплаченным",
    linkedBooking: "Связанная запись",
  },
};

const DEFAULT_PAGES_BY_NICHE = {
  ...NICHE_CRM_PAGES,
  veterinary_clinic: [
    "dashboard",
    "pets",
    "owners",
    "appointments",
    "treatments",
    "vaccinations",
    "payments",
    "integrations",
    "settings",
  ],
  school_management: [
    "dashboard",
    "students",
    "teachers",
    "classes",
    "attendance",
    "grades",
    "payments",
    "integrations",
    "settings",
  ],
  course_platform: [
    "dashboard",
    "courses",
    "lessons",
    "students",
    "progress",
    "certificates",
    "payments",
    "integrations",
    "settings",
  ],
  inventory_system: [
    "dashboard",
    "products",
    "warehouses",
    "suppliers",
    "stock",
    "orders",
    "payments",
    "integrations",
    "settings",
  ],
};

const INTEGRATION_STUB_CARDS = [
  {
    id: "google_calendar",
    status: "soon",
    title: {
      en: "Google Calendar",
      de: "Google Calendar",
      ru: "Google Calendar",
    },
    description: {
      en: "Sync appointments and bookings to Google Calendar.",
      de: "Termine und Buchungen mit Google Calendar synchronisieren.",
      ru: "Синхронизация записей и приёмов с Google Calendar.",
    },
  },
  {
    id: "google_maps",
    status: "soon",
    title: {
      en: "Google Maps / Google Business Profile",
      de: "Google Maps / Google Business Profile",
      ru: "Google Maps / Google Business Profile",
    },
    description: {
      en: "Opening hours and reviews via Google Business Profile.",
      de: "Öffnungszeiten und Bewertungen über Google Business Profile.",
      ru: "Часы работы и отзывы через Google Business Profile.",
    },
  },
  {
    id: "telegram",
    status: "connect",
    title: {
      en: "Telegram",
      de: "Telegram",
      ru: "Telegram",
    },
    description: {
      en: "New-lead alerts (future hook for notifyNewLead in the API).",
      de: "Benachrichtigungen zu neuen Anfragen (künftiger Hook für notifyNewLead in der API).",
      ru: "Уведомления о новых заявках (будущая точка подключения к notifyNewLead() в API).",
    },
  },
  {
    id: "whatsapp",
    status: "not_configured",
    title: {
      en: "WhatsApp Business",
      de: "WhatsApp Business",
      ru: "WhatsApp Business",
    },
    description: {
      en: "New-lead notifications via WhatsApp Business.",
      de: "Benachrichtigungen zu neuen Anfragen über WhatsApp Business.",
      ru: "Уведомления о новых заявках через WhatsApp Business.",
    },
  },
  {
    id: "email_smtp",
    status: "soon",
    title: {
      en: "Email (SMTP)",
      de: "E-Mail (SMTP)",
      ru: "Email (SMTP)",
    },
    description: {
      en: "Auto-confirm bookings to the customer by email.",
      de: "Automatische Buchungsbestätigung per E-Mail an den Kunden.",
      ru: "Автоподтверждение клиенту после записи по email.",
    },
  },
  {
    id: "payments_stripe_polar",
    status: "not_configured",
    title: {
      en: "Payments (Stripe / Polar)",
      de: "Zahlungen (Stripe / Polar)",
      ru: "Платежи (Stripe / Polar)",
    },
    description: {
      en: "Online prepayment when booking.",
      de: "Online-Vorauszahlung bei der Buchung.",
      ru: "Онлайн-предоплата при бронировании.",
    },
  },
  {
    id: "google_reviews",
    status: "soon",
    title: {
      en: "Google Reviews",
      de: "Google Reviews",
      ru: "Google Reviews",
    },
    description: {
      en: "Automatic review request after a visit.",
      de: "Automatische Bewertungsanfrage nach dem Besuch.",
      ru: "Автозапрос отзыва после визита.",
    },
  },
  {
    id: "datev",
    status: "soon",
    title: {
      en: "Accounting (DATEV)",
      de: "Buchhaltung (DATEV)",
      ru: "Бухгалтерия (DATEV)",
    },
    description: {
      en: "Export payments for DACH accounting workflows.",
      de: "Zahlungs-Export für DACH-Buchhaltung.",
      ru: "Экспорт платежей (релевантно для DACH-рынка).",
    },
  },
];

const INTEGRATIONS_UI_COPY = {
  en: {
    openIntegrations: "Integrations",
    subtitle: "Connect tools when you are ready. Cards below are placeholders — not live integrations yet.",
    statusSoon: "Soon",
    statusConnect: "Connect",
    statusNotConfigured: "Not configured",
    stubHint: "Not available yet",
    factoryTitle: "Factory Website+CRM",
    factoryBody:
      "Need more capabilities? Move to Factory Website+CRM with the Studio SDK.",
    factoryCta: "Open Factory Website+CRM",
  },
  de: {
    openIntegrations: "Integrationen",
    subtitle:
      "Verbinden Sie Tools, wenn Sie bereit sind. Die Karten unten sind Platzhalter — noch keine Live-Integrationen.",
    statusSoon: "Bald",
    statusConnect: "Verbinden",
    statusNotConfigured: "Nicht eingerichtet",
    stubHint: "Noch nicht verfügbar",
    factoryTitle: "Factory Website+CRM",
    factoryBody:
      "Mehr Funktionen nötig? Wechseln Sie zu Factory Website+CRM mit dem Studio SDK.",
    factoryCta: "Factory Website+CRM öffnen",
  },
  ru: {
    openIntegrations: "Интеграции",
    subtitle:
      "Подключайте сервисы, когда будете готовы. Карточки ниже — заглушки, не рабочие интеграции.",
    statusSoon: "Скоро",
    statusConnect: "Подключить",
    statusNotConfigured: "Не настроено",
    stubHint: "Пока недоступно",
    factoryTitle: "Factory Website+CRM",
    factoryBody:
      "Нужно больше возможностей? Перейдите в Factory Website+CRM со Studio SDK.",
    factoryCta: "Перейти в Factory Website+CRM",
  },
};

function integrationStatusLabel(status, language) {
  const copy = INTEGRATIONS_UI_COPY[language] || INTEGRATIONS_UI_COPY.en;
  if (status === "connect") return copy.statusConnect;
  if (status === "not_configured") return copy.statusNotConfigured;
  return copy.statusSoon;
}

function buildFactoryBridgeHref({
  apiBase,
  clientId,
  language,
  businessName,
  niche,
  city,
  phone,
  email,
  whatsapp,
}) {
  const base = String(apiBase || "").replace(/\/$/, "");
  const params = new URLSearchParams();
  if (clientId) params.set("clientId", String(clientId));
  params.set("tier", "factory_ready");
  if (language) params.set("language", String(language));
  if (businessName) params.set("businessName", String(businessName));
  if (niche) params.set("niche", String(niche));
  if (city) params.set("city", String(city));
  if (phone) params.set("phone", String(phone));
  if (email) params.set("email", String(email));
  if (whatsapp) params.set("whatsapp", String(whatsapp));
  return `${base}/api/factory-bridge?${params.toString()}`;
}

const LANDING_DASHBOARD_NICHES = new Set([
  "beauty_salon",
  "fitness_club",
  "massage_salon",
  "restaurant",
]);

function isCrmDashboardNiche(businessType) {
  const key = getNicheLabelsKey(businessType);
  return Boolean(key) && !LANDING_DASHBOARD_NICHES.has(key);
}

function showsDashboardHeroGallery(_businessType) {
  return true;
}

function getPageLabel(pageId, language, businessType, sectionLabels = {}) {
  const normalized = String(pageId || "").toLowerCase();
  const tabs = getNicheLabelsConfig(businessType).tabs ?? {};
  const nicheLabel = tabs[normalized]?.[language];
  if (nicheLabel) {
    return nicheLabel;
  }
  if (sectionLabels[normalized]) {
    return sectionLabels[normalized];
  }
  return (
    TAB_FALLBACK_LABELS[language]?.[normalized] ??
    formatPageLabel(normalized)
  );
}

function translateFeatureLabel(feature, language, businessType) {
  const key = String(feature || "").toLowerCase();
  return getPageLabel(key, language, businessType);
}

const DEFAULT_COUNTER_LABELS = {
  en: ["Clients", "Appointments", "Services", "Staff"],
  de: ["Kunden", "Termine", "Leistungen", "Mitarbeiter"],
  ru: ["Клиентов", "Записей", "Услуг", "Сотрудников"],
};

function getCounterLabels(businessType, language) {
  const lang = language || "en";
  const nicheKey = getNicheLabelsKey(businessType) || businessType;
  return (
    COUNTER_LABELS_I18N[businessType]?.[lang] ??
    COUNTER_LABELS_I18N[nicheKey]?.[lang] ??
    DEFAULT_COUNTER_LABELS[lang] ??
    DEFAULT_COUNTER_LABELS.en
  );
}

const PAGE_NAV = {
  dashboard: { icon: "🏠", labelKey: "dashboard" },
  appointments: { icon: "📅", labelKey: "appointments" },
  clients: { icon: "👥", labelKey: "clients" },
  services: { icon: "🛠", labelKey: "services" },
  staff: { icon: "👤", labelKey: "staff" },
  notifications: { icon: "🔔", labelKey: "notifications" },
  properties: { icon: "🏠", label: "Properties" },
  agents: { icon: "👤", label: "Agents" },
  viewings: { icon: "📅", label: "Viewings" },
  contracts: { icon: "📄", label: "Contracts" },
  settings: { icon: "⚙️", label: "Settings" },
};

function companyStorageKey(clientId) {
  return clientId ? `mvp_crm:${clientId}:company` : null;
}

function readCompanySettings(clientId) {
  const key = companyStorageKey(clientId);
  if (!key) {
    return null;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCompanySettings(clientId, settings) {
  const key = companyStorageKey(clientId);
  if (!key) {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(settings));
  } catch {
    // ignore quota / private mode
  }
}

function applyStoredCompanySettings(stored, handlers, options = {}) {
  if (!stored) {
    return;
  }
  if (typeof stored.businessName === "string") {
    handlers.setBusinessName(stored.businessName);
  }
  // Never restore nicheLabel from localStorage — Branche/Niche always follows
  // manifest businessType via getSectorLabel (avoids sticky "Beauty Salon").
  if (!options.skipContactFields) {
    if (typeof stored.phone === "string") {
      handlers.setPhone(stored.phone);
    }
    if (typeof stored.email === "string") {
      handlers.setEmail(stored.email);
    }
    if (typeof stored.whatsapp === "string") {
      handlers.setWhatsapp(stored.whatsapp);
    }
    if (typeof stored.postalCode === "string") {
      handlers.setPostalCode(stored.postalCode);
    }
    if (typeof stored.address === "string") {
      handlers.setAddress(stored.address);
    }
    if (typeof stored.city === "string") {
      handlers.setCity(stored.city);
    }
  }
}

export default function App() {
  const bootClientId = readClientIdFromLocation();
  const crmStorageId = bootClientId || "local-demo";
  const { theme, labels, demo, module_flags: flags, sections, dashboard_title, business_type_label, accent_tagline, hero_images: heroImages = [], gallery_images: galleryImages = [], gif_assets: gifAssets = [] } = domainUi;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState(
    () =>
      readPreviewLangFromLocation() ||
      clientData?.language ||
      domainUi?.language ||
      "ru",
  );
  const [businessName, setBusinessName] = useState(
    bootClientId ? "" : (clientData.business_name || formatPageLabel(DEFAULT_BUSINESS_TYPE)),
  );
  const [ownerName, setOwnerName] = useState("");
  const [businessType, setBusinessType] = useState(() => {
    if (bootClientId) {
      return null;
    }
    return (
      readPreviewNicheFromLocation() ||
      clientData.business_type ||
      domainUi?.business_type ||
      DEFAULT_BUSINESS_TYPE
    );
  });
  const [sectorId, setSectorId] = useState(null);
  const [phone, setPhone] = useState(clientData.phone || "");
  const [email, setEmail] = useState(clientData.email || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [nicheLabel, setNicheLabel] = useState("");
  const [pages, setPages] = useState(null);
  const [demoData, setDemoData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [subtitle, setSubtitle] = useState("");
  const [promotion, setPromotion] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState(null);
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [uiSections, setUiSections] = useState(bootClientId ? {} : (sections ?? {}));
  const [uiLabels, setUiLabels] = useState(bootClientId ? {} : (labels ?? {}));
  const [heroBackground, setHeroBackground] = useState(
    () => (bootClientId ? DEFAULT_THEME.hero_bg : (domainUi.theme?.header_bg || DEFAULT_THEME.hero_bg)),
  );
  const [mvpUrl, setMvpUrl] = useState("");
  const [publicSiteUrl, setPublicSiteUrl] = useState("");
  const [siteLinkCopied, setSiteLinkCopied] = useState(false);
  const [manifestPending, setManifestPending] = useState(Boolean(bootClientId));
  const [manifestLoaded, setManifestLoaded] = useState(false);
  const [manifestError, setManifestError] = useState(null);
  /** null = access unknown (hold seeds); true = paid empty CRM; false = unpaid demo */
  const [demoPaid, setDemoPaid] = useState(() => (bootClientId ? null : true));
  const [demoCheckoutUrl, setDemoCheckoutUrl] = useState("");
  const [demoAccessReady, setDemoAccessReady] = useState(() => !bootClientId);
  const [isTopFrame, setIsTopFrame] = useState(true);

  const effectiveBusinessType = useMemo(() => {
    if (businessType) {
      return businessType;
    }
    if (manifestPending && !manifestLoaded) {
      return null;
    }
    return clientData.business_type || domainUi?.business_type || DEFAULT_BUSINESS_TYPE;
  }, [businessType, manifestPending, manifestLoaded]);

  const applyManifestFromConfig = useCallback((config) => {
    const applied = applyManifestPatch(config, {
      setBusinessName,
      setOwnerName,
      setBusinessType,
      setSectorId,
      setPhone,
      setEmail,
      setWhatsapp,
      setPostalCode,
      setAddress,
      setCity,
      setPages,
      setDemoData,
      setFeatures,
      setLanguage,
      setSubtitle,
      setHeroBackground,
      setPromotion,
      setScenario,
      setGalleryPhotos,
      setHeroPhoto,
      setUiSections,
      setUiLabels,
    });
    if (applied) {
      const normalized = normalizeManifestConfig(config);
      if (normalized?.businessType || normalized?.sectorId) {
        const lang = normalized.language || "ru";
        // Always set Branche from the demo's sector/businessType — never keep a prior niche.
        setNicheLabel(
          getSectorLabel(normalized.businessType, lang, normalized.sectorId),
        );
      }
      // Contact fields from localStorage may refine empty gaps, but never niche/Branche.
      applyStoredCompanySettings(readCompanySettings(crmStorageId), {
        setBusinessName,
        setPhone,
        setEmail,
        setWhatsapp,
        setPostalCode,
        setAddress,
        setCity,
      });
      // Manifest contact fields win over stale localStorage when present.
      if (normalized?.phone) setPhone(normalized.phone);
      if (normalized?.email) setEmail(normalized.email);
      if (normalized?.whatsapp) setWhatsapp(normalized.whatsapp);
      if (normalized?.postalCode) setPostalCode(normalized.postalCode);
      if (normalized?.address) setAddress(normalized.address);
      if (normalized?.city) setCity(normalized.city);
      if (normalized?.businessName) setBusinessName(normalized.businessName);
      if (normalized?.ownerName) setOwnerName(normalized.ownerName);
      setManifestLoaded(true);
      setManifestPending(false);
      setManifestError(null);
    }
    return applied;
  }, [crmStorageId]);

  useEffect(() => {
    if (manifestLoaded) {
      return;
    }
    if (manifestPending) {
      return;
    }
    applyThemeToDocument(domainUi.theme ?? DEFAULT_THEME);
  }, [manifestLoaded, manifestPending]);

  useEffect(() => {
    // Default to current href; demo-access may replace with canonical Railway /demo/{slug}.
    setMvpUrl(window.location.href);
    setIsTopFrame(window.self === window.top);
  }, []);

  useEffect(() => {
    if (!bootClientId) {
      setDemoPaid(true);
      setDemoAccessReady(true);
      return undefined;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1" || params.get("paid") === "true") {
      setDemoPaid(true);
      setDemoAccessReady(true);
      return undefined;
    }

    const manifestApiBase =
      import.meta.env.VITE_MANIFEST_API_BASE ||
      "https://saas-mvp-funnel-production.up.railway.app";
    let cancelled = false;

    const checkAccess = async () => {
      try {
        const response = await fetch(
          `${manifestApiBase}/api/demo-access/${encodeURIComponent(bootClientId)}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          if (!cancelled) {
            setDemoPaid(false);
            setDemoAccessReady(true);
          }
          return;
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        setDemoPaid(Boolean(data.paid));
        if (typeof data.checkoutUrl === "string" && data.checkoutUrl) {
          setDemoCheckoutUrl(data.checkoutUrl);
        }
        // Never keep a foreign pages.dev URL on the "open in new tab" button.
        if (typeof data.crmUrl === "string" && data.crmUrl) {
          setMvpUrl(data.crmUrl);
        }
        if (typeof data.publicSiteUrl === "string" && data.publicSiteUrl) {
          setPublicSiteUrl(data.publicSiteUrl);
        }
        setDemoAccessReady(true);
      } catch {
        if (!cancelled) {
          setDemoPaid(false);
          setDemoAccessReady(true);
        }
      }
    };

    void checkAccess();
    const intervalId = window.setInterval(() => {
      void checkAccess();
    }, 20000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [bootClientId]);

  // Derive public site URL from CRM URL when API omits publicSiteUrl (older deploys).
  useEffect(() => {
    if (publicSiteUrl || !mvpUrl) return;
    try {
      const u = new URL(mvpUrl);
      if (!u.pathname.includes("/demo/")) return;
      u.pathname = u.pathname.replace("/demo/", "/site/");
      u.search = "";
      setPublicSiteUrl(u.toString());
    } catch {
      /* ignore */
    }
  }, [mvpUrl, publicSiteUrl]);

  useEffect(() => {
    const manifestApiBase =
      import.meta.env.VITE_MANIFEST_API_BASE ||
      "https://saas-mvp-funnel-production.up.railway.app";
    const controller = new AbortController();

    const loadConfig = async () => {
      const clientId = readClientIdFromLocation();

      // Prefer live Railway manifest whenever URL has a tenant id.
      // Baked CF manifests are incomplete (often missing pages) and must not
      // block the API when the same shared Pages deploy serves many clients.
      if (clientId) {
        try {
          const response = await fetch(`${manifestApiBase}/api/manifest/${clientId}`, {
            signal: controller.signal,
          });
          if (response.ok) {
            const config = await response.json();
            const applied = applyManifestFromConfig(config);
            if (applied) {
              return;
            }
            console.error("[CRM] Manifest API returned OK but applyManifestFromConfig failed", {
              clientId,
              keys: config && typeof config === "object" ? Object.keys(config) : [],
            });
            // Fall through to baked/static fallbacks, then explicit error UI.
          } else {
            setManifestError(`Manifest not found (${response.status})`);
            setManifestPending(false);
          }
        } catch (error) {
          if (error?.name === "AbortError") {
            return;
          }
          // Fall through to baked/static fallbacks when API is unreachable.
        }
      }

      const embedded = readDeployedManifest();
      const embeddedClientId =
        embedded && typeof embedded === "object"
          ? String(embedded.clientId || embedded.client_id || "").trim()
          : "";
      if (
        embedded &&
        (!clientId || !embeddedClientId || embeddedClientId === clientId) &&
        applyManifestFromConfig(embedded)
      ) {
        return;
      }

      try {
        const staticResponse = await fetch("./client-manifest.json", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (staticResponse.ok) {
          const config = await staticResponse.json();
          const staticId = String(config?.clientId || config?.client_id || "").trim();
          if ((!clientId || !staticId || staticId === clientId) && applyManifestFromConfig(config)) {
            return;
          }
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }

      if (clientId) {
        // API + baked/static fallbacks failed — surface a clear error instead of infinite Loading.
        const unavailable = {
          en: "Demo unavailable, please try again later",
          de: "Demo nicht verfügbar, bitte versuchen Sie es später erneut",
          ru: "Демо недоступно, попробуйте позже",
        };
        const langHint =
          readPreviewLangFromLocation() ||
          (typeof language === "string" ? language : "") ||
          "en";
        const langKey = langHint === "de" || langHint === "ru" ? langHint : "en";
        console.error("[CRM] Demo unavailable: could not apply manifest from API or static fallbacks", {
          clientId,
          language: langKey,
        });
        setManifestError(unavailable[langKey]);
        setManifestPending(false);
        return;
      }

      setManifestPending(false);

      const hash = window.location.hash.slice(1);
      if (!hash) {
        return;
      }

      try {
        const config = JSON.parse(decodeURIComponent(escape(atob(hash))));
        applyManifestFromConfig(config);
      } catch (e) {}
    };

    void loadConfig();

    return () => {
      controller.abort();
    };
  }, [applyManifestFromConfig]);

  const demoSource = useMemo(() => {
    const staticFallback = manifestLoaded ? null : demo;
    const base = normalizeDemoData(demoData, language) || staticFallback;
    // Always prefer local multilingual niche-scenarios over manifest/OpenAI blobs.
    const localScenario = getNicheScenario(effectiveBusinessType);
    const scenarioRecords = localScenario?.records ?? null;
    if (!scenarioRecords) {
      return base;
    }

    const mergedRecords = {
      ...(demoData?.records ?? {}),
      ...scenarioRecords,
    };

    return normalizeDemoData({
      ...(demoData ?? {}),
      records: mergedRecords,
      clients: mergedRecords.clients ?? mergedRecords.patients ?? demoData?.clients,
      staff:
        mergedRecords.staff ??
        mergedRecords.masters ??
        mergedRecords.doctors ??
        mergedRecords.therapists ??
        mergedRecords.trainers ??
        mergedRecords.mechanics ??
        mergedRecords.developers ??
        mergedRecords.teachers ??
        mergedRecords.drivers ??
        demoData?.staff,
      services:
        mergedRecords.services ??
        mergedRecords.menu ??
        mergedRecords.products ??
        mergedRecords.subscriptions ??
        mergedRecords.classes ??
        mergedRecords.courses ??
        demoData?.services,
      appointments: mergedRecords.appointments ?? mergedRecords.work_orders ?? demoData?.appointments,
    }, language) || base;
  }, [demoData, demo, effectiveBusinessType, language, manifestLoaded]);
  const clients = demoSource.clients || [];
  const appointments = demoSource.appointments || [];
  const services = demoSource.services || [];
  const isPaidCrm = demoPaid === true;
  const isUnpaidDemo = demoPaid === false;
  const holdCrmRecords = Boolean(bootClientId) && demoPaid === null;
  const allowSeed = isUnpaidDemo;

  useEffect(() => {
    if (!isPaidCrm || !crmStorageId) return;
    purgeSeedRecords(crmStorageId, CRM_STORAGE_SECTIONS);
  }, [isPaidCrm, crmStorageId]);

  const {
    records: crmClientRecords,
    addRecord: addCrmClient,
    updateRecord: updateCrmClient,
    deleteRecord: deleteCrmClient,
    mergeRemoteRecords: mergeRemoteClients,
  } = useCrmRecords(crmStorageId, "clients", clients, { allowSeed, hold: holdCrmRecords });
  const [crmShowAddClient, setCrmShowAddClient] = useState(false);
  const [crmClientForm, setCrmClientForm] = useState({ name: "", note: "", phone: "" });
  const [editingClientId, setEditingClientId] = useState(null);
  const [editClientForm, setEditClientForm] = useState({ name: "", note: "", phone: "", visits: 0 });
  const [siteLeadBadge, setSiteLeadBadge] = useState(0);
  const [jobApplications, setJobApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [vacancySaving, setVacancySaving] = useState(false);
  const displayClients = crmClientRecords;

  function handleAddCrmClient() {
    if (!crmClientForm.name.trim()) return;
    addCrmClient({
      name: crmClientForm.name.trim(),
      note: crmClientForm.note.trim(),
      phone: crmClientForm.phone.trim(),
      visits: 0,
    });
    setCrmClientForm({ name: "", note: "", phone: "" });
    setCrmShowAddClient(false);
  }

  function startEditClient(item) {
    setEditingClientId(item.id);
    setEditClientForm({
      name: item.name || "",
      note: item.note || "",
      phone: item.phone || "",
      visits: item.visits ?? 0,
    });
  }

  function saveEditClient() {
    if (!editingClientId || !editClientForm.name.trim()) return;
    updateCrmClient(editingClientId, {
      name: editClientForm.name.trim(),
      note: editClientForm.note.trim(),
      phone: editClientForm.phone.trim(),
      visits: Number(editClientForm.visits) || 0,
    });
    setEditingClientId(null);
  }

  const {
    records: crmAppointmentRecords,
    addRecord: addCrmAppointment,
    updateRecord: updateCrmAppointment,
    deleteRecord: deleteCrmAppointment,
    mergeRemoteRecords: mergeRemoteAppointments,
  } = useCrmRecords(crmStorageId, "appointments", appointments, { allowSeed, hold: holdCrmRecords });
  const [crmShowAddAppointment, setCrmShowAddAppointment] = useState(false);
  const [crmAppointmentForm, setCrmAppointmentForm] = useState({ client: "", service: "", time: "", status: "" });
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editAppointmentForm, setEditAppointmentForm] = useState({ client: "", service: "", time: "", status: "" });
  const displayAppointments = crmAppointmentRecords;

  const {
    records: crmPaymentRecords,
    addRecord: addCrmPayment,
    updateRecord: updateCrmPayment,
    deleteRecord: deleteCrmPayment,
  } = useCrmRecords(
    crmStorageId,
    "payments",
    allowSeed
      ? (getNicheScenario(effectiveBusinessType)?.records?.payments ||
          getNicheScenario(effectiveBusinessType)?.records?.invoices ||
          []
        ).map((item) => ({
          client: pickLocalized(item.client || item.name, language) || "—",
          amount: pickLocalized(item.amount, language) || item.amount || "—",
          status: String(pickLocalized(item.status, language) || item.status || "pending").toLowerCase().includes("paid")
            || String(pickLocalized(item.status, language) || "").toLowerCase().includes("bezahlt")
            || String(pickLocalized(item.status, language) || "").includes("Оплач")
            ? "paid"
            : "pending",
          bookingId: item.bookingId || "",
          source: "seed",
        }))
      : [],
    { allowSeed, hold: holdCrmRecords },
  );

  // Site leads: Railway parent postMessage (no secret in HTML/JS) and optional token header.
  useEffect(() => {
    if (!bootClientId || holdCrmRecords) return undefined;
    let cancelled = false;

    const applyPayload = (data) => {
      if (cancelled || !data || data.clientId !== bootClientId) return;
      const remoteClients = Array.isArray(data.clients) ? data.clients : [];
      const remoteAppointments = Array.isArray(data.appointments) ? data.appointments : [];
      const remoteJobs = Array.isArray(data.jobApplications) ? data.jobApplications : [];
      setJobApplications(remoteJobs);
      const addedClients = mergeRemoteClients(remoteClients) || 0;
      const addedAppointments = mergeRemoteAppointments(remoteAppointments) || 0;
      const added = Number(addedClients) + Number(addedAppointments);
      if (added > 0) setSiteLeadBadge((prev) => prev + added);
    };

    const onMessage = (event) => {
      const data = event?.data;
      if (!data || data.type !== "SITE_LEADS_SYNC") return;
      applyPayload(data);
    };
    window.addEventListener("message", onMessage);

    const leadsToken =
      typeof window !== "undefined" && typeof window.__CRM_LEADS_READ_SECRET__ === "string"
        ? window.__CRM_LEADS_READ_SECRET__
        : "";
    let intervalId = 0;
    if (leadsToken) {
      const manifestApiBase =
        import.meta.env.VITE_MANIFEST_API_BASE ||
        "https://saas-mvp-funnel-production.up.railway.app";
      const syncLeads = async () => {
        try {
          const response = await fetch(
            `${manifestApiBase}/api/crm/leads/${encodeURIComponent(bootClientId)}`,
            {
              cache: "no-store",
              headers: { "x-crm-leads-token": leadsToken },
            },
          );
          if (!response.ok || cancelled) return;
          applyPayload({ ...(await response.json()), clientId: bootClientId });
        } catch {
          /* ignore */
        }
      };
      void syncLeads();
      intervalId = window.setInterval(() => {
        void syncLeads();
      }, 8000);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("message", onMessage);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [
    bootClientId,
    holdCrmRecords,
    mergeRemoteClients,
    mergeRemoteAppointments,
  ]);

  // Vacancies: load from shared Firestore via Railway API / parent bridge.
  useEffect(() => {
    if (!bootClientId || holdCrmRecords) return undefined;
    let cancelled = false;
    (async () => {
      const items = await fetchCrmVacancies(bootClientId);
      if (!cancelled) setVacancies(Array.isArray(items) ? items : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [bootClientId, holdCrmRecords]);

  async function handleAddVacancy() {
    if (!bootClientId || vacancySaving) return;
    const titleEl = document.getElementById("jobTitle");
    const salaryEl = document.getElementById("jobSalary");
    const reqsEl = document.getElementById("jobReqs");
    const title = String(titleEl?.value || "").trim();
    if (!title) return;
    const salary = String(salaryEl?.value || "").trim();
    const requirements = String(reqsEl?.value || "").trim();
    setVacancySaving(true);
    try {
      const item = await createCrmVacancy(bootClientId, {
        title,
        description: requirements || title,
        salary: salary || undefined,
        requirements: requirements || undefined,
      });
      if (item && typeof item === "object") {
        setVacancies((prev) => [item, ...prev.filter((v) => v.id !== item.id)]);
      } else {
        const refreshed = await fetchCrmVacancies(bootClientId);
        setVacancies(Array.isArray(refreshed) ? refreshed : []);
      }
      if (titleEl) titleEl.value = "";
      if (salaryEl) salaryEl.value = "";
      if (reqsEl) reqsEl.value = "";
    } finally {
      setVacancySaving(false);
    }
  }

  async function handleDeleteVacancy(vacancyId) {
    if (!bootClientId || !vacancyId) return;
    const confirmMsg =
      language === "ru"
        ? "Удалить эту запись?"
        : language === "de"
          ? "Diesen Eintrag löschen?"
          : "Delete this record?";
    if (!window.confirm(confirmMsg)) return;
    const ok = await deleteCrmVacancy(bootClientId, vacancyId);
    if (ok) {
      setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
    }
  }

  const assetSeedSource = getNicheScenario(effectiveBusinessType)?.records || {};
  const {
    records: crmAssetRecords,
    addRecord: addCrmAsset,
    updateRecord: updateCrmAsset,
    deleteRecord: deleteCrmAsset,
  } = useCrmRecords(
    crmStorageId,
    "assets",
    allowSeed
      ? (
          assetSeedSource.tables ||
          assetSeedSource.rooms ||
          assetSeedSource.vehicles ||
          assetSeedSource.properties ||
          assetSeedSource.routes ||
          []
        ).map((item) => ({
          name: pickLocalized(item.name || item.model || item.title, language) || "—",
          status: pickLocalized(item.status, language) || "free",
          seats: item.seats || item.plate || "",
          kind: assetSeedSource.tables
            ? "tables"
            : assetSeedSource.rooms
              ? "rooms"
              : assetSeedSource.vehicles
                ? "vehicles"
                : assetSeedSource.properties
                  ? "properties"
                  : "routes",
        }))
      : [],
    { allowSeed, hold: holdCrmRecords },
  );

  function createPendingPayment({ client, amount, bookingId, source }) {
    if (!client) return null;
    return addCrmPayment({
      client: String(client).trim(),
      amount: amount || "—",
      status: "pending",
      bookingId: bookingId || "",
      source: source || "booking",
    });
  }

  function handleAddCrmAppointment() {
    if (!crmAppointmentForm.client.trim() || !crmAppointmentForm.time.trim()) return;
    const pendingFallback = { en: "Pending", de: "Ausstehend", ru: "Ожидает" };
    const booking = addCrmAppointment({
      client: crmAppointmentForm.client.trim(),
      service: crmAppointmentForm.service.trim() || "—",
      time: crmAppointmentForm.time.trim(),
      status: crmAppointmentForm.status.trim() || pendingFallback[language] || pendingFallback.en,
    });
    const matchedService = displayServices.find(
      (s) =>
        serviceLabel(s.name, language).toLowerCase() ===
        String(crmAppointmentForm.service || "").toLowerCase(),
    );
    createPendingPayment({
      client: booking.client,
      amount: matchedService?.price || "—",
      bookingId: booking.id,
      source: "booking",
    });
    setCrmAppointmentForm({ client: "", service: "", time: "", status: "Pending" });
    setCrmShowAddAppointment(false);
  }

  function startEditAppointment(item) {
    setEditingAppointmentId(item.id);
    setEditAppointmentForm({
      client: item.client || "",
      service: item.service || "",
      time: item.time || "",
      status: item.status || "Pending",
    });
  }

  function saveEditAppointment() {
    if (!editingAppointmentId || !editAppointmentForm.client.trim()) return;
    updateCrmAppointment(editingAppointmentId, {
      client: editAppointmentForm.client.trim(),
      service: editAppointmentForm.service.trim(),
      time: editAppointmentForm.time.trim(),
      status: editAppointmentForm.status.trim() || ({ en: "Pending", de: "Ausstehend", ru: "Ожидает" }[language] || "Pending"),
    });
    setEditingAppointmentId(null);
  }

  const {
    records: crmServiceRecords,
    addRecord: addCrmService,
    updateRecord: updateCrmService,
    deleteRecord: deleteCrmService,
    persist: persistCrmServices,
  } = useCrmRecords(crmStorageId, "services", services, { allowSeed, hold: holdCrmRecords });
  const [crmShowAddService, setCrmShowAddService] = useState(false);
  const [crmServiceForm, setCrmServiceForm] = useState({ name: "", price: "", duration: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({ name: "", price: "", duration: "" });
  const displayServices = crmServiceRecords;

  // Keep public /site form catalog 1:1 with CRM services/menu/products.
  useEffect(() => {
    if (!bootClientId || holdCrmRecords) return;
    let cancelled = false;
    (async () => {
      if (displayServices.length > 0) {
        syncCrmCatalogToApi(bootClientId, displayServices);
        return;
      }
      // Paid CRM may have purged seeds — hydrate from shared catalog, then persist locally.
      const remote = await hydrateCrmCatalogFromApi(bootClientId, { lang: language });
      if (cancelled || !remote.length) return;
      const seenNames = new Set();
      const mapped = remote
        .map((item, index) => {
          const label = isLocalizedLabel(item.name)
            ? preserveLocalizedLabel(item.name)
            : typeof item.name === "string"
              ? item.name
              : { en: "—", de: "—", ru: "—" };
          const key = isLocalizedLabel(label)
            ? String(label.en || label.de || label.ru || "")
                .trim()
                .toLowerCase()
            : String(label || "")
                .trim()
                .toLowerCase();
          if (key) {
            if (seenNames.has(key)) return null;
            seenNames.add(key);
          }
          return {
            id: item.id || `rec-cat-hydrated-${index}`,
            // Keep full LocalizedLabel in CRM state — display picks the UI language later.
            name: label,
            price: item.price || "",
            duration: isLocalizedLabel(item.duration)
              ? preserveLocalizedLabel(item.duration)
              : typeof item.duration === "string"
                ? item.duration
                : "",
          };
        })
        .filter(Boolean);
      // Only user-looking ids survive paid mode; mark hydrated as rec-*.
      const asUser = mapped.map((item, index) => ({
        ...item,
        id: String(item.id || "").startsWith("rec-")
          ? item.id
          : `rec-cat-${Date.now()}-${index}`,
      }));
      if (typeof persistCrmServices === "function") {
        persistCrmServices(asUser);
      }
      syncCrmCatalogToApi(bootClientId, asUser);
    })();
    return () => {
      cancelled = true;
    };
  }, [bootClientId, holdCrmRecords, displayServices, language]);

  function handleAddCrmService() {
    if (!crmServiceForm.name.trim()) return;
    addCrmService({
      name: patchLocalizedLabel(null, language, crmServiceForm.name.trim()),
      price: crmServiceForm.price.trim(),
      duration: crmServiceForm.duration.trim(),
    });
    setCrmServiceForm({ name: "", price: "", duration: "" });
    setCrmShowAddService(false);
  }

  function startEditService(item) {
    setEditingServiceId(item.id);
    setEditServiceForm({
      name: serviceLabel(item.name, language) === "—" ? "" : serviceLabel(item.name, language),
      price: item.price || "",
      duration:
        serviceLabel(item.duration, language) === "—"
          ? ""
          : isLocalizedLabel(item.duration)
            ? pickLocalized(item.duration, language) || ""
            : item.duration || "",
    });
  }

  function saveEditService() {
    if (!editingServiceId || !editServiceForm.name.trim()) return;
    const existing = crmServiceRecords.find((row) => row.id === editingServiceId);
    updateCrmService(editingServiceId, {
      name: patchLocalizedLabel(existing?.name, language, editServiceForm.name.trim()),
      price: editServiceForm.price.trim(),
      duration: isLocalizedLabel(existing?.duration)
        ? patchLocalizedLabel(existing.duration, language, editServiceForm.duration.trim())
        : editServiceForm.duration.trim(),
    });
    setEditingServiceId(null);
  }

  const staff = demoSource.staff || [];
  const {
    records: crmStaffRecords,
    addRecord: addCrmStaff,
    updateRecord: updateCrmStaff,
    deleteRecord: deleteCrmStaff,
  } = useCrmRecords(crmStorageId, "staff", staff, { allowSeed, hold: holdCrmRecords });
  const [crmShowAddStaff, setCrmShowAddStaff] = useState(false);
  const [crmStaffForm, setCrmStaffForm] = useState({ name: "", role: "", status: "" });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editStaffForm, setEditStaffForm] = useState({ name: "", role: "", status: "" });
  const displayStaff = crmStaffRecords;

  function handleAddCrmStaff() {
    if (!crmStaffForm.name.trim()) return;
    addCrmStaff({
      name: crmStaffForm.name.trim(),
      role: crmStaffForm.role.trim(),
      status: crmStaffForm.status.trim() || "available",
    });
    setCrmStaffForm({ name: "", role: "", status: "" });
    setCrmShowAddStaff(false);
  }

  function startEditStaff(item) {
    setEditingStaffId(item.id);
    setEditStaffForm({
      name: item.name || "",
      role: item.role || "",
      status: item.status || "",
    });
  }

  function saveEditStaff() {
    if (!editingStaffId || !editStaffForm.name.trim()) return;
    updateCrmStaff(editingStaffId, {
      name: editStaffForm.name.trim(),
      role: editStaffForm.role.trim(),
      status: editStaffForm.status.trim() || "available",
    });
    setEditingStaffId(null);
  }

  const [crmShowAddPayment, setCrmShowAddPayment] = useState(false);
  const [crmPaymentForm, setCrmPaymentForm] = useState({ client: "", amount: "", bookingId: "" });

  function handleAddCrmPayment() {
    if (!crmPaymentForm.client.trim()) return;
    createPendingPayment({
      client: crmPaymentForm.client.trim(),
      amount: crmPaymentForm.amount.trim() || "—",
      bookingId: crmPaymentForm.bookingId.trim(),
      source: crmPaymentForm.bookingId.trim() ? "booking" : "manual",
    });
    setCrmPaymentForm({ client: "", amount: "", bookingId: "" });
    setCrmShowAddPayment(false);
  }

  const [crmShowAddAsset, setCrmShowAddAsset] = useState(false);
  const [crmAssetForm, setCrmAssetForm] = useState({ name: "", status: "", seats: "" });

  function handleAddCrmAsset() {
    if (!crmAssetForm.name.trim()) return;
    addCrmAsset({
      name: crmAssetForm.name.trim(),
      status: crmAssetForm.status.trim() || "free",
      seats: crmAssetForm.seats.trim(),
      kind: activeTab,
    });
    setCrmAssetForm({ name: "", status: "", seats: "" });
    setCrmShowAddAsset(false);
  }

  const notifications = demoSource.notifications || [];
  const sectorLabel = getSectorLabel(effectiveBusinessType, language, sectorId);
  const heroPhotoSrc = heroPhoto ?? getHeroImagePath(effectiveBusinessType);
  const galleryPhotoList = galleryPhotos ?? getGalleryImagePaths(effectiveBusinessType);
  const nicheLabelsConfig = useMemo(
    () => getNicheLabelsConfig(effectiveBusinessType),
    [effectiveBusinessType],
  );
  const displayPanelTitle = sectorLabel;
  // Prefer niche i18n tagline for the active language only (no foreign subtitle leftover).
  const displayPanelTagline = nicheLabelsConfig.panel_tagline?.[language] || "";
  // Always use local multilingual niche-scenarios — never OpenAI/manifest one-language blobs.
  const nicheScenario = useMemo(() => {
    const local = getNicheScenario(effectiveBusinessType);
    if (isPopulatedScenario(local)) {
      return local;
    }
    if (isPopulatedScenario(scenario)) {
      return scenario;
    }
    return local;
  }, [scenario, effectiveBusinessType]);
  const fallbackPromotion = useMemo(() => pickRandomPromotion(effectiveBusinessType), [effectiveBusinessType]);
  const activePromotion = promotion ?? fallbackPromotion;
  const counterLabels = getCounterLabels(effectiveBusinessType, language);
  const liveCounts = {
    clients: displayClients.length,
    bookings: displayAppointments.length,
    catalog: displayServices.length,
    staff: displayStaff.length,
  };
  // Unpaid: scenario metrics + today_items together (never live zeros beside seed copy).
  // Paid: live empty/real counts only — no scenario dashboard content.
  const liveDashboard = (() => {
    if (isPaidCrm) {
      return buildLiveDashboard(language, liveCounts, counterLabels);
    }
    if (isUnpaidDemo) {
      const scenarioLabels = nicheScenario?.metric_labels?.[language];
      const scenarioValues = Array.isArray(nicheScenario?.metric_values)
        ? nicheScenario.metric_values.map((v) => String(v))
        : null;
      if (scenarioValues?.length) {
        return {
          metricLabels: (
            Array.isArray(scenarioLabels) && scenarioLabels.length
              ? scenarioLabels
              : counterLabels
          ).slice(0, 4),
          metricValues: scenarioValues.slice(0, 4),
        };
      }
      return buildLiveDashboard(language, liveCounts, counterLabels);
    }
    return {
      metricLabels: (counterLabels || []).slice(0, 4),
      metricValues: [0, 0, 0, 0],
    };
  })();
  const metricLabels = liveDashboard.metricLabels;
  const metricValues = liveDashboard.metricValues;
  const todayItems = isPaidCrm
    ? displayAppointments.slice(0, 6).map((item) => ({
        name: item.client,
        service: item.service,
        time: item.time,
      }))
    : isUnpaidDemo
      ? nicheScenario?.today_items ?? []
      : [];
  const popularServices = displayServices.slice(0, 6).map((item) => serviceLabel(item.name, language));
  const promotionText = isUnpaidDemo ? getPromotionText(activePromotion, language) : "";
  const businessIcon = NICHE_ICONS[effectiveBusinessType] ?? theme.icon;

  const i18n = {
    en: { patients: "Patients", visits: "Visits", visitsBadge: "visits", addClient: "Add Client", addAppointment: "Add Appointment", addService: "Add Service", addStaff: "Add Staff", addPayment: "Add Payment", addAsset: "Add Item", markPaid: "Mark paid", amount: "Amount", linkedBooking: "Linked booking", edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel", actions: "Actions", confirmed: "Confirmed", pending: "Pending", paid: "Paid", menu: "MENU", client: "Client", service: "Service", time: "Time", status: "Status", name: "Name", note: "Note", role: "Role", available: "Available", inSurgery: "In Surgery", gallery: "Gallery", phone: "Phone", mvpReadyTitle: "Your Website + CRM + Booking is ready", mvpReadySubtitle: "Save the link — this is your working Website + CRM + Booking", copyLink: "Copy link", openMvpTab: "Open Website + CRM + Booking in new tab", reminders: "Reminders", dentist: "Dentist", orthodontist: "Orthodontist", hygienist: "Hygienist", noteTreatment: "Treatment plan active", noteCleaning: "Regular cleaning", noteNew: "New patient record", service1: "Dental Check-up", service2: "Teeth Cleaning", service3: "Root Canal Treatment", reminder1: "Follow-up: Patient Weber treatment plan update", reminder2: "Reminder: cleaning appointment for Patient Koch", settingsSubtitle: "Basic settings for your CRM.", settingsCopySite: "Copy link to my site", settingsSiteCopied: "Site link copied!", settingsPublicSite: "Your site for customers", settingsCrmLogin: "CRM login", settingsBusiness: "Company name", settingsOwner: "Owner", settingsNiche: "Niche", settingsCity: "City", settingsWhatsapp: "WhatsApp", settingsPostal: "Postal code", settingsAddress: "Address", deleteConfirm: "Delete this record?", paywallText: "Demo version. Choose a plan to continue.", paywallCta: "Choose plan" },
    de: { patients: "Patienten", visits: "Besuche", visitsBadge: "Besuche", addClient: "Kunde hinzufügen", addAppointment: "Termin hinzufügen", addService: "Leistung hinzufügen", addStaff: "Mitarbeiter hinzufügen", addPayment: "Zahlung hinzufügen", addAsset: "Eintrag hinzufügen", markPaid: "Als bezahlt markieren", amount: "Betrag", linkedBooking: "Verknüpfter Termin", edit: "Bearbeiten", delete: "Löschen", save: "Speichern", cancel: "Abbrechen", actions: "Aktionen", confirmed: "Bestätigt", pending: "Ausstehend", paid: "Bezahlt", menu: "MENÜ", client: "Kunde", service: "Dienstleistung", time: "Uhrzeit", status: "Status", name: "Name", note: "Notiz", role: "Rolle", available: "Verfügbar", inSurgery: "Im Eingriff", gallery: "Galerie", phone: "Telefon", mvpReadyTitle: "Ihre Website + CRM + Buchung ist bereit", mvpReadySubtitle: "Speichern Sie den Link — das ist Ihre Website + CRM + Buchung", copyLink: "Link kopieren", openMvpTab: "Website + CRM + Buchung in neuem Tab öffnen", reminders: "Erinnerungen", dentist: "Zahnarzt", orthodontist: "Kieferorthopäde", hygienist: "Hygienikerin", noteTreatment: "Behandlungsplan aktiv", noteCleaning: "Regelmäßige Reinigung", noteNew: "Neue Patientenakte", service1: "Zahnkontrolle", service2: "Zahnreinigung", service3: "Wurzelkanalbehandlung", reminder1: "Nachverfolgung: Behandlungsplan Patient Weber", reminder2: "Erinnerung: Reinigungstermin für Patient Koch", settingsSubtitle: "Grundeinstellungen für Ihr CRM.", settingsCopySite: "Link zu meiner Website kopieren", settingsSiteCopied: "Website-Link kopiert!", settingsPublicSite: "Ihre Website für Kunden", settingsCrmLogin: "CRM-Zugang", settingsBusiness: "Firmenname", settingsOwner: "Inhaber", settingsNiche: "Branche", settingsCity: "Stadt", settingsWhatsapp: "WhatsApp", settingsPostal: "Postleitzahl", settingsAddress: "Adresse", deleteConfirm: "Diesen Eintrag löschen?", paywallText: "Demo-Version. Wählen Sie einen Plan, um fortzufahren.", paywallCta: "Plan wählen" },
    ru: { patients: "Пациенты", visits: "Визиты", visitsBadge: "визитов", addClient: "Добавить клиента", addAppointment: "Добавить приём", addService: "Добавить услугу", addStaff: "Добавить сотрудника", addPayment: "Добавить платёж", addAsset: "Добавить объект", markPaid: "Отметить оплаченным", amount: "Сумма", linkedBooking: "Связанная запись", edit: "Изменить", delete: "Удалить", save: "Сохранить", cancel: "Отмена", actions: "Действия", confirmed: "Подтверждён", pending: "Ожидает", paid: "Оплачено", menu: "МЕНЮ", client: "Клиент", service: "Услуга", time: "Время", status: "Статус", name: "Имя", note: "Заметка", role: "Роль", available: "Доступен", inSurgery: "На приёме", gallery: "Галерея", phone: "Телефон", mvpReadyTitle: "Ваш Сайт + CRM + Бронирование готов", mvpReadySubtitle: "Сохраните ссылку — это ваш рабочий Сайт + CRM + Бронирование", copyLink: "Копировать ссылку", openMvpTab: "Открыть Сайт + CRM + Бронирование в новой вкладке", reminders: "Напоминания", dentist: "Стоматолог", orthodontist: "Ортодонт", hygienist: "Гигиенист", noteTreatment: "План лечения активен", noteCleaning: "Регулярная чистка", noteNew: "Новая карта пациента", service1: "Осмотр зубов", service2: "Чистка зубов", service3: "Лечение корневого канала", reminder1: "Напоминание: обновление плана лечения Пациент Вебер", reminder2: "Напоминание: запись на чистку Пациент Кох", settingsSubtitle: "Базовые настройки вашей CRM.", settingsCopySite: "Скопировать ссылку на мой сайт", settingsSiteCopied: "Ссылка на сайт скопирована!", settingsPublicSite: "Ваш сайт для клиентов", settingsCrmLogin: "Вход в CRM", settingsBusiness: "Название компании", settingsOwner: "Владелец", settingsNiche: "Ниша", settingsCity: "Город", settingsWhatsapp: "WhatsApp", settingsPostal: "Индекс", settingsAddress: "Адрес", deleteConfirm: "Удалить эту запись?", paywallText: "Демо-версия. Выберите тариф, чтобы продолжить.", paywallCta: "Выбрать тариф" },
  };
  const sectionLabels = uiSections ?? {};
  const baseT = i18n[language] || i18n.en;
  const t = {
    ...baseT,
    dashboard: getPageLabel("dashboard", language, effectiveBusinessType, sectionLabels),
    appointments: getPageLabel("appointments", language, effectiveBusinessType, sectionLabels),
    reservations: getPageLabel("reservations", language, effectiveBusinessType, sectionLabels),
    clients: getPageLabel("clients", language, effectiveBusinessType, sectionLabels),
    patients: getPageLabel("patients", language, effectiveBusinessType, sectionLabels),
    services: getPageLabel("services", language, effectiveBusinessType, sectionLabels),
    menu: getPageLabel("menu", language, effectiveBusinessType, sectionLabels),
    staff: getPageLabel("staff", language, effectiveBusinessType, sectionLabels),
    tables: getPageLabel("tables", language, effectiveBusinessType, sectionLabels),
    settings: getPageLabel("settings", language, effectiveBusinessType, sectionLabels),
    payments: getPageLabel("payments", language, effectiveBusinessType, sectionLabels),
    notifications: getPageLabel("notifications", language, effectiveBusinessType, sectionLabels),
    integrations: getPageLabel("integrations", language, effectiveBusinessType, sectionLabels),
    openIntegrations:
      (INTEGRATIONS_UI_COPY[language] || INTEGRATIONS_UI_COPY.en).openIntegrations,
  };

  const integrationsCopy = INTEGRATIONS_UI_COPY[language] || INTEGRATIONS_UI_COPY.en;
  const manifestApiBaseForBridge =
    import.meta.env.VITE_MANIFEST_API_BASE ||
    "https://saas-mvp-funnel-production.up.railway.app";
  const factoryBridgeHref = buildFactoryBridgeHref({
    apiBase: manifestApiBaseForBridge,
    clientId: bootClientId,
    language,
    businessName,
    niche: effectiveBusinessType,
    city,
    phone,
    email,
    whatsapp,
  });

  useEffect(() => {
    document.documentElement.lang = language;
    if (manifestPending && !manifestLoaded) {
      document.title = LOADING_DOCUMENT_TITLE;
      return;
    }
    document.title = businessName ? `${businessName} — ${displayPanelTitle}` : displayPanelTitle;
  }, [businessName, language, displayPanelTitle, manifestPending, manifestLoaded]);

  const effectivePages = useMemo(() => {
    let resolved;
    if (Array.isArray(pages) && pages.length > 0) {
      resolved = [...pages];
    } else {
      const nicheKey = getNicheLabelsKey(effectiveBusinessType);
      resolved = [
        ...(DEFAULT_PAGES_BY_NICHE[nicheKey] ??
          DEFAULT_PAGES_BY_NICHE[effectiveBusinessType] ??
          DEFAULT_GENERIC_PAGES),
      ];
    }
    // Settings must always be available so Branche/Niche reflects the client niche.
    if (!resolved.includes("settings")) {
      resolved.push("settings");
    }
    // Integrations is shared across all niches (not sector-specific).
    return ensureVacanciesInPages(ensureIntegrationsInPages(resolved));
  }, [pages, effectiveBusinessType]);

  const navItems = effectivePages.map((pageId) => ({
    id: pageId,
    label: getPageLabel(pageId, language, effectiveBusinessType, sectionLabels),
    icon: PAGE_TAB_ICONS[pageId] || PAGE_TAB_ICONS[PAGE_ALIASES[pageId]] || "📄",
    show: true,
  }));
  const useCrmDashboardLayout = isCrmDashboardNiche(effectiveBusinessType);
  const showDashboardHeroGallery = showsDashboardHeroGallery(effectiveBusinessType);

  const appointmentTabs = BOOKING_TABS;
  const clientTabs = CLIENT_TABS;
  const serviceTabs = CATALOG_TABS;
  const staffTabs = STAFF_TABS;
  const paymentTabs = PAYMENT_TABS;
  const assetTabs = ASSET_TABS;

  const genericPageRecords = (isUnpaidDemo
    ? getPageRecords(
        {
          ...(demoData ?? {}),
          records: {
            ...(demoData?.records ?? {}),
            ...(getNicheScenario(effectiveBusinessType)?.records ?? {}),
          },
        },
        activeTab,
      )
    : []
  ).map((item) => localizeRecord(item, language));
  const showGenericRecords =
    isUnpaidDemo &&
    genericPageRecords.length > 0 &&
    activeTab !== "dashboard" &&
    activeTab !== "vacancies" &&
    activeTab !== "settings" &&
    activeTab !== "integrations" &&
    !assetTabs.has(activeTab) &&
    !paymentTabs.has(activeTab) &&
    !appointmentTabs.has(activeTab) &&
    !clientTabs.has(activeTab) &&
    !serviceTabs.has(activeTab) &&
    !staffTabs.has(activeTab);
  const appointmentRows = displayAppointments;
  const serviceRows = displayServices;
  const crmActionBtnStyle = {
    background: "transparent",
    color: "var(--color-accent, #1d4ed8)",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "0.35rem 0.65rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    marginRight: "0.35rem",
  };
  const crmDangerBtnStyle = {
    ...crmActionBtnStyle,
    color: "#b91c1c",
    borderColor: "#fecaca",
  };
  const persistCompanySettings = (patch) => {
    const next = {
      businessName,
      phone,
      email,
      whatsapp,
      postalCode,
      address,
      city,
      ...patch,
      // Always persist canonical sector label — never a free-text / stale Beauty Salon.
      nicheLabel: sectorLabel,
    };
    if (patch.businessName !== undefined) setBusinessName(patch.businessName);
    if (patch.phone !== undefined) setPhone(patch.phone);
    if (patch.email !== undefined) setEmail(patch.email);
    if (patch.whatsapp !== undefined) setWhatsapp(patch.whatsapp);
    if (patch.postalCode !== undefined) setPostalCode(patch.postalCode);
    if (patch.address !== undefined) setAddress(patch.address);
    if (patch.city !== undefined) setCity(patch.city);
    writeCompanySettings(crmStorageId, next);
  };

  // Keep Settings Branche/Niche in sync with businessType + sector + UI language.
  useEffect(() => {
    if (!effectiveBusinessType && !sectorId) {
      return;
    }
    const next = getSectorLabel(effectiveBusinessType, language, sectorId);
    if (next && next !== nicheLabel) {
      setNicheLabel(next);
    }
  }, [effectiveBusinessType, sectorId, language, nicheLabel]);

  // Sync paywall banner on parent /demo wrapper when user switches EN/DE/RU.
  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) {
      return;
    }
    try {
      window.parent.postMessage({ type: "crm-demo-language", language }, "*");
    } catch {
      /* ignore cross-origin issues */
    }
  }, [language]);

  const settingsFieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    marginBottom: "0.85rem",
  };
  const settingsInputStyle = {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "0.55rem 0.75rem",
    fontSize: "1.05rem",
    width: "100%",
    boxSizing: "border-box",
  };
  const settingsLabelStyle = {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#475569",
  };

  const tableRows = getPageRecords(
    {
      ...(demoData ?? {}),
      records: {
        ...(demoData?.records ?? {}),
        ...(getNicheScenario(effectiveBusinessType)?.records ?? {}),
      },
    },
    "tables",
  ).map((item) => localizeRecord(item, language));

  const tableHeaders = getTableHeaders(language);

  const translateNote = (note) => {
    const value = (note || "").toLowerCase();
    if (value.includes("treatment plan")) {
      return t.noteTreatment;
    }
    if (value.includes("regular cleaning")) {
      return t.noteCleaning;
    }
    if (value.includes("new patient")) {
      return t.noteNew;
    }
    return note;
  };

  const translateReminder = (text, index) => {
    if (index === 0) {
      return t.reminder1;
    }
    if (index === 1) {
      return t.reminder2;
    }
    const value = (text || "").toLowerCase();
    if (value.includes("weber")) {
      return t.reminder1;
    }
    if (value.includes("koch")) {
      return t.reminder2;
    }
    return text;
  };

  const navButtonStyle = (tabId) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.65rem 0.75rem",
    marginBottom: "0.25rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "1.05rem",
    fontWeight: activeTab === tabId ? 700 : 500,
    background: activeTab === tabId ? "var(--color-secondary, #dbeafe)" : "transparent",
    color: activeTab === tabId ? "var(--color-on-secondary, #0f172a)" : "var(--color-fg, #334155)",
    transition: "background 0.15s ease, color 0.15s ease",
  });

  const metricCardStyle = {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "1.15rem 1rem",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
    textAlign: "center",
  };

  const getStatusBadgeStyle = (status) => {
    const value = (status || "").toLowerCase();
    if (["confirmed", "booked", "reserved", "completed", "done", "available", "abgeschlossen", "free", "frei", "aktiv", "active", "подтверж", "доступен", "свободен", "оплач", "bezahlt", "geliefert", "доставлен", "готов", "bereit", "erledigt", "выполн"].some((key) => value.includes(key))) {
      return { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
    }
    if (["pending", "waitlist", "in session", "in surgery", "in progress", "prep", "class live", "kitchen", "in bearbeitung", "occupied", "besetzt", "занят", "ожида", "ausstehend", "на смене", "im dienst", "на сеансе", "в работе", "в пути", "unterwegs", "обработк"].some((key) => value.includes(key))) {
      return { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" };
    }
    if (["cancel", "cancelled", "canceled", "abgesagt"].some((key) => value.includes(key))) {
      return { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
    }
    return { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
  };

  const statusBadgeBase = {
    display: "inline-block",
    padding: "0.25rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "capitalize",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1.05rem",
  };

  const thStyle = {
    textAlign: "left",
    padding: "0.75rem 1rem",
    borderBottom: "2px solid #e2e8f0",
    color: "#64748b",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontWeight: 700,
  };

  const tdStyle = {
    padding: "0.85rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
  };

  const serviceCardStyle = {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "1rem 1.1rem",
    border: "1px solid #e2e8f0",
    borderTop: "4px solid var(--color-accent, #1d4ed8)",
  };

  const staffCardStyle = {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "1rem 1.1rem",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "0.35rem",
  };

  if (manifestPending && !manifestLoaded) {
    return (
      <div className="app-shell app-loading" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p style={{ fontSize: "1.1rem", color: "#475569" }}>Loading Website + CRM + Booking…</p>
      </div>
    );
  }

  if (manifestError && bootClientId && !manifestLoaded) {
    return (
      <div className="app-shell app-error" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <h1 style={{ marginBottom: "0.75rem", fontSize: "1.25rem", color: "#0f172a" }}>{manifestError}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" data-domain={effectiveBusinessType || domainUi.domain_key}>
      {demoAccessReady && isUnpaidDemo && isTopFrame ? (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2147483646,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              padding: "0.65rem 1rem",
              background: "linear-gradient(90deg, #0f172a 0%, #1e3a5f 100%)",
              color: "#f8fafc",
              fontSize: "1.05rem",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.35)",
            }}
          >
            <span style={{ textAlign: "center", maxWidth: "42rem" }}>{t.paywallText}</span>
            <a
              href={demoCheckoutUrl || mvpUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#22c55e",
                color: "#052e16",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: "999px",
                padding: "0.4rem 1rem",
                whiteSpace: "nowrap",
              }}
            >
              {t.paywallCta}
            </a>
          </div>
        </>
      ) : null}
      {demoAccessReady && isUnpaidDemo ? (
          <div
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              position: "fixed",
              inset: 0,
              zIndex: 2147483645,
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: "rotate(-28deg)",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "rgba(15, 23, 42, 0.07)",
                textTransform: "uppercase",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              DEMO · €199
            </div>
          </div>
      ) : null}
      <aside className="mvp-sidebar" style={demoAccessReady && isUnpaidDemo && isTopFrame ? { paddingTop: "3.25rem" } : undefined}>
        <div className="sidebar-brand">
          {typeof businessIcon === "string" &&
          (businessIcon.startsWith("/") || businessIcon.startsWith("http") || businessIcon.endsWith(".png") || businessIcon.endsWith(".svg")) ? (
            <img className="domain-icon domain-icon-img" src={businessIcon} alt="" aria-hidden="true" />
          ) : (
            <span className="domain-icon" aria-hidden="true">{businessIcon}</span>
          )}
          <div>
            <h2 className="sidebar-business-name">{businessName}</h2>
            <p className="sidebar-sector">{sectorLabel}</p>
            {city && <p className="sidebar-sector">{city}</p>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "8px" }}>
          <button type="button" onClick={() => setLanguage("en")} style={{ flex: 1, padding: "8px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: language === "en" ? "var(--accent)" : "#fff", color: language === "en" ? "var(--color-on-accent, #ffffff)" : "var(--accent)" }}>EN</button>
          <button type="button" onClick={() => setLanguage("de")} style={{ flex: 1, padding: "8px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: language === "de" ? "var(--accent)" : "#fff", color: language === "de" ? "var(--color-on-accent, #ffffff)" : "var(--accent)" }}>DE</button>
          <button type="button" onClick={() => setLanguage("ru")} style={{ flex: 1, padding: "8px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "14px", background: language === "ru" ? "var(--accent)" : "#fff", color: language === "ru" ? "var(--color-on-accent, #ffffff)" : "var(--accent)" }}>RU</button>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">{t.menu}</span>
          <ul className="module-list sidebar-module-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.id} style={{ display: "block" }}>
                <button
                  type="button"
                  style={navButtonStyle(item.id)}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (clientTabs.has(item.id) || appointmentTabs.has(item.id)) {
                      setSiteLeadBadge(0);
                    }
                  }}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                  {siteLeadBadge > 0 && (clientTabs.has(item.id) || appointmentTabs.has(item.id)) ? (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: "#ea580c",
                        color: "#fff",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.1rem 0.45rem",
                      }}
                    >
                      {language === "ru" ? "новая" : language === "de" ? "neu" : "new"}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="mvp-content" style={demoAccessReady && isUnpaidDemo && isTopFrame ? { paddingTop: "3.25rem" } : undefined}>
        {activeTab === "dashboard" && (
          <>
            <header className="hero-header" style={{ background: heroBackground }}>
              <div className="hero-top">
                <span className="domain-badge">{sectorLabel}</span>
              </div>
              <h1 className="business-name">{businessName}</h1>
              <h2 className="dashboard-title">{displayPanelTitle}</h2>
              {metricValues[0] ? (
                <p className="tagline" style={{ marginTop: "0.35rem" }}>
                  {getOwnerSummary(businessName, metricValues[0], language)}
                </p>
              ) : null}
              <p className="tagline">{displayPanelTagline}</p>
              {features.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                  {features.map((feature) => (
                    <span
                      key={feature}
                      style={{
                        background: "rgba(255,255,255,0.18)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        borderRadius: "999px",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {translateFeatureLabel(feature, language, effectiveBusinessType)}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              {metricValues.map((value, index) => (
                <div key={metricLabels[index] ?? index} style={metricCardStyle}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-accent, #1d4ed8)" }}>
                    {value}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
                    {metricLabels[index] ?? ""}
                  </div>
                </div>
              ))}
            </div>

            <section className="panel domain-section">
              <h3>{DASHBOARD_SECTION_LABELS.today[language] ?? DASHBOARD_SECTION_LABELS.today.en}</h3>
              <ul className="item-list">
                {todayItems.map((item, index) => (
                  <li key={`${getTodayItemName(item, language)}-${item.time}-${index}`}>
                    <strong>{getTodayItemName(item, language)}</strong>
                    <span>{getTodayItemService(item, language)}</span>
                    <em>{item.time}</em>
                  </li>
                ))}
              </ul>
            </section>

            {!useCrmDashboardLayout && promotionText ? (
              <section
                style={{
                  background: "var(--color-accent, #f59e0b)",
                  color: "var(--color-on-accent, #ffffff)",
                  borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "1rem",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span aria-hidden>🎁</span>
                  {DASHBOARD_SECTION_LABELS.specialOffer[language] ??
                    DASHBOARD_SECTION_LABELS.specialOffer.en}
                </h3>
                <p style={{ margin: 0, fontSize: "1.1rem", lineHeight: 1.5, fontWeight: 600 }}>
                  {promotionText}
                </p>
              </section>
            ) : null}

            {!useCrmDashboardLayout && (
              <section className="panel domain-section">
                <h3>{DASHBOARD_SECTION_LABELS.popular[language] ?? DASHBOARD_SECTION_LABELS.popular.en}</h3>
                <ul className="module-list">
                  {popularServices.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </section>
            )}

            {showDashboardHeroGallery && (
              <div className="panel" style={{ padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
                <img
                  src={heroPhotoSrc}
                  alt={`${businessName} banner`}
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              </div>
            )}

            {showDashboardHeroGallery && (
              <section className="panel gallery-panel">
                <h3>{t.gallery}</h3>
                <div className="gallery-grid">
                  {galleryPhotoList.map((src, index) => (
                    <img key={`${src}-gallery`} src={src} alt={`${businessName} gallery ${index + 1}`} className="gallery-image" loading="lazy" />
                  ))}
                </div>
              </section>
            )}

            {!useCrmDashboardLayout && gifAssets.length > 0 && (
              <section className="panel" style={{ marginTop: 16 }}>
                <h3 style={{ color: "var(--accent)", marginBottom: 12 }}>{t.gallery} GIF</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {gifAssets.map((src, i) => (
                    <img key={i} src={src} alt={`gif ${i + 1}`} style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 10, border: "2px solid var(--accent-soft)" }} />
                  ))}
                </div>
              </section>
            )}

            <div className="mvp-ready-compact">
              {isUnpaidDemo ? (
                <a
                  href={demoCheckoutUrl || mvpUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.paywallCta}
                </a>
              ) : (
                <button
                  type="button"
                  className="mvp-ready-compact-btn"
                  onClick={() => setActiveTab("integrations")}
                >
                  {t.openIntegrations}
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === "vacancies" && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel("vacancies", language, effectiveBusinessType)}</h3>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <input
                id="jobTitle"
                placeholder="Название должности *"
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                id="jobSalary"
                placeholder="Зарплата (необязательно, напр. €16/час)"
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <textarea
                id="jobReqs"
                placeholder="Требования (необязательно)"
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", height: "80px" }}
              />
              <button
                type="button"
                onClick={handleAddVacancy}
                disabled={vacancySaving}
                style={{ background: "#FFD400", color: "#000", fontWeight: "bold", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: vacancySaving ? "wait" : "pointer" }}
              >
                Добавить вакансию
              </button>
            </div>

            {vacancies.length === 0 ? (
              <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>
                {language === "ru" ? "Вакансий пока нет" : language === "de" ? "Noch keine Stellen" : "No vacancies yet"}
              </p>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {vacancies.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "1rem",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: "0 0 0.35rem", color: "#0f172a", fontSize: "1.05rem" }}>{item.title}</h4>
                        {item.salary ? (
                          <p style={{ margin: "0 0 0.25rem", color: "#0f172a", fontWeight: 600 }}>
                            {language === "ru" ? "Зарплата" : language === "de" ? "Gehalt" : "Salary"}: {item.salary}
                          </p>
                        ) : null}
                        {item.requirements ? (
                          <p style={{ margin: 0, color: "#64748b", whiteSpace: "pre-wrap", fontSize: "0.92rem" }}>
                            {language === "ru" ? "Требования" : language === "de" ? "Anforderungen" : "Requirements"}: {item.requirements}
                          </p>
                        ) : item.description && item.description !== item.title ? (
                          <p style={{ margin: 0, color: "#475569", whiteSpace: "pre-wrap" }}>{item.description}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        style={crmDangerBtnStyle}
                        onClick={() => handleDeleteVacancy(item.id)}
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h4 style={{ margin: "0 0 0.75rem", color: "#0f172a" }}>
              {language === "ru" ? "Отклики" : language === "de" ? "Bewerbungen" : "Applications"}
            </h4>
            {jobApplications.length === 0 ? (
              <p style={{ color: "#64748b", margin: 0 }}>
                {language === "ru" ? "Заявок пока нет" : language === "de" ? "Noch keine Bewerbungen" : "No applications yet"}
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{(language === "ru" ? "Имя" : language === "de" ? "Name" : "Name").toUpperCase()}</th>
                      <th style={thStyle}>{(language === "ru" ? "Телефон" : language === "de" ? "Telefon" : "Phone").toUpperCase()}</th>
                      <th style={thStyle}>{(language === "ru" ? "Должность" : language === "de" ? "Position" : "Position").toUpperCase()}</th>
                      <th style={thStyle}>{(language === "ru" ? "Опыт" : language === "de" ? "Erfahrung" : "Experience").toUpperCase()}</th>
                      <th style={thStyle}>{(language === "ru" ? "Дата" : language === "de" ? "Datum" : "Date").toUpperCase()}</th>
                      <th style={thStyle}>{(language === "ru" ? "Статус" : language === "de" ? "Status" : "Status").toUpperCase()}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobApplications.map((item) => {
                      const createdAt = Number(item.createdAt) || 0;
                      const dateLabel = createdAt
                        ? new Date(createdAt).toLocaleDateString(
                            language === "ru" ? "ru-RU" : language === "de" ? "de-DE" : "en-GB",
                          )
                        : "—";
                      const statusLabel =
                        language === "ru" ? "Новая" : language === "de" ? "Neu" : "New";
                      return (
                        <tr key={item.id || `${item.name}-${item.phone}-${createdAt}`}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#0f172a" }}>{item.name || "—"}</td>
                          <td style={tdStyle}>{item.phone || "—"}</td>
                          <td style={tdStyle}>{item.position || "—"}</td>
                          <td style={tdStyle}>{item.experience || "—"}</td>
                          <td style={tdStyle}>{dateLabel}</td>
                          <td style={tdStyle}>
                            <span style={{ ...statusBadgeBase, ...getStatusBadgeStyle("new") }}>{statusLabel}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {appointmentTabs.has(activeTab) &&
          (effectivePages.includes(activeTab) ||
            (pages
              ? pages.includes(activeTab) || pages.includes("appointments") || pages.includes("viewings")
              : flags.appointments)) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddAppointment(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {getCrmAddBookingCta(sectorId, language, t.addAppointment)}
              </button>
            </div>
            {crmShowAddAppointment && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.client} value={crmAppointmentForm.client} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, client: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.service} value={crmAppointmentForm.service} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, service: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.time} value={crmAppointmentForm.time} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, time: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.status} value={crmAppointmentForm.status} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmAppointment} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>{t.save}</button>
                <button type="button" onClick={() => setCrmShowAddAppointment(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{tableHeaders.client.toUpperCase()}</th>
                    <th style={thStyle}>{tableHeaders.service.toUpperCase()}</th>
                    <th style={thStyle}>{tableHeaders.time.toUpperCase()}</th>
                    <th style={thStyle}>{tableHeaders.status.toUpperCase()}</th>
                    <th style={thStyle}>{t.actions.toUpperCase()}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentRows.map((item) => (
                    <tr key={item.id || `${item.client}-${item.time}`}>
                      {editingAppointmentId === item.id ? (
                        <>
                          <td style={tdStyle}><input value={editAppointmentForm.client} onChange={(e) => setEditAppointmentForm((f) => ({ ...f, client: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}><input value={editAppointmentForm.service} onChange={(e) => setEditAppointmentForm((f) => ({ ...f, service: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}><input value={editAppointmentForm.time} onChange={(e) => setEditAppointmentForm((f) => ({ ...f, time: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}><input value={editAppointmentForm.status} onChange={(e) => setEditAppointmentForm((f) => ({ ...f, status: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}>
                            <button type="button" style={crmActionBtnStyle} onClick={saveEditAppointment}>{t.save}</button>
                            <button type="button" style={crmActionBtnStyle} onClick={() => setEditingAppointmentId(null)}>{t.cancel}</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#0f172a" }}>{item.client}</td>
                          <td style={tdStyle}>{item.service}</td>
                          <td style={tdStyle}>{item.time}</td>
                          <td style={tdStyle}>
                            <span style={{ ...statusBadgeBase, ...getStatusBadgeStyle(item.status) }}>{item.status}</span>
                          </td>
                          <td style={tdStyle}>
                            {item.id && (
                              <>
                                <button type="button" style={crmActionBtnStyle} onClick={() => startEditAppointment(item)}>{t.edit}</button>
                                <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmAppointment(item.id); }}>{t.delete}</button>
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {clientTabs.has(activeTab) && (pages ? pages.includes(activeTab) || pages.includes("clients") : flags.crm) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button
                type="button"
                onClick={() => setCrmShowAddClient(true)}
                style={{
                  background: "var(--color-accent, #1d4ed8)",
                  color: "var(--color-on-accent, #ffffff)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.55rem 1rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                }}
              >
                {t.addClient}
              </button>
            </div>
            {crmShowAddClient && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input
                    placeholder={t.name}
                    value={crmClientForm.name}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }}
                  />
                  <input
                    placeholder={t.phone}
                    value={crmClientForm.phone}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }}
                  />
                  <input
                    placeholder={t.note}
                    value={crmClientForm.note}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, note: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }}
                  />
                </div>
                <button type="button" onClick={handleAddCrmClient} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save}
                </button>
                <button type="button" onClick={() => setCrmShowAddClient(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel}
                </button>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t.name.toUpperCase()}</th>
                    <th style={thStyle}>{t.note.toUpperCase()}</th>
                    <th style={thStyle}>{t.visits.toUpperCase()}</th>
                    <th style={thStyle}>{t.actions.toUpperCase()}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayClients.map((item) => (
                    <tr key={item.id || item.name}>
                      {editingClientId === item.id ? (
                        <>
                          <td style={tdStyle}><input value={editClientForm.name} onChange={(e) => setEditClientForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}><input value={editClientForm.note} onChange={(e) => setEditClientForm((f) => ({ ...f, note: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}><input type="number" value={editClientForm.visits} onChange={(e) => setEditClientForm((f) => ({ ...f, visits: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.35rem" }} /></td>
                          <td style={tdStyle}>
                            <button type="button" style={crmActionBtnStyle} onClick={saveEditClient}>{t.save}</button>
                            <button type="button" style={crmActionBtnStyle} onClick={() => setEditingClientId(null)}>{t.cancel}</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "#0f172a" }}>{item.name}</td>
                          <td style={tdStyle}>{translateNote(item.note)}</td>
                          <td style={tdStyle}>
                            <span style={{ ...statusBadgeBase, background: "var(--color-secondary, #dbeafe)", color: "var(--color-on-secondary, #0f172a)", border: "1px solid transparent" }}>
                              {item.visits} {t.visitsBadge ?? t.visits}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {item.id && (
                              <>
                                <button type="button" style={crmActionBtnStyle} onClick={() => startEditClient(item)}>{t.edit}</button>
                                <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmClient(item.id); }}>{t.delete}</button>
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {serviceTabs.has(activeTab) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddService(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {t.addService}
              </button>
            </div>
            {crmShowAddService && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmServiceForm.name} onChange={(e) => setCrmServiceForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder="€80" value={crmServiceForm.price} onChange={(e) => setCrmServiceForm((f) => ({ ...f, price: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder="30 min" value={crmServiceForm.duration} onChange={(e) => setCrmServiceForm((f) => ({ ...f, duration: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmService} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save}
                </button>
                <button type="button" onClick={() => setCrmShowAddService(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {serviceRows.map((item) => (
                <article key={item.id || serviceLabel(item.name, language)} style={serviceCardStyle}>
                  {editingServiceId === item.id ? (
                    <>
                      <input value={editServiceForm.name} onChange={(e) => setEditServiceForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.35rem" }} />
                      <input value={editServiceForm.price} onChange={(e) => setEditServiceForm((f) => ({ ...f, price: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.35rem" }} />
                      <input value={editServiceForm.duration} onChange={(e) => setEditServiceForm((f) => ({ ...f, duration: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.5rem" }} />
                      <button type="button" style={crmActionBtnStyle} onClick={saveEditService}>{t.save}</button>
                      <button type="button" style={crmActionBtnStyle} onClick={() => setEditingServiceId(null)}>{t.cancel}</button>
                    </>
                  ) : (
                    <>
                      <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{serviceLabel(item.name, language)}</strong>
                      <span style={{ display: "block", marginTop: "0.35rem", color: "var(--color-accent, #1d4ed8)", fontWeight: 700 }}>{item.price}</span>
                      <em style={{ display: "block", marginTop: "0.25rem", color: "#64748b", fontStyle: "normal", fontSize: "1rem" }}>{activeTab === "menu" ? translateMenuCategory(serviceLabel(item.duration, language), language) : serviceLabel(item.duration, language) === "—" ? "" : serviceLabel(item.duration, language)}</em>
                      {item.id && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <button type="button" style={crmActionBtnStyle} onClick={() => startEditService(item)}>{t.edit}</button>
                          <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmService(item.id); }}>{t.delete}</button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {staffTabs.has(activeTab) && (pages ? pages.includes(activeTab) || staffTabs.has(activeTab) : flags.staff) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddStaff(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {t.addStaff}
              </button>
            </div>
            {crmShowAddStaff && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmStaffForm.name} onChange={(e) => setCrmStaffForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.role} value={crmStaffForm.role} onChange={(e) => setCrmStaffForm((f) => ({ ...f, role: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.available} value={crmStaffForm.status} onChange={(e) => setCrmStaffForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmStaff} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save}
                </button>
                <button type="button" onClick={() => setCrmShowAddStaff(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {displayStaff.map((person) => (
                <article key={person.id || person.name} style={staffCardStyle}>
                  {editingStaffId === person.id ? (
                    <>
                      <input value={editStaffForm.name} onChange={(e) => setEditStaffForm((f) => ({ ...f, name: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.35rem" }} />
                      <input value={editStaffForm.role} onChange={(e) => setEditStaffForm((f) => ({ ...f, role: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.35rem" }} />
                      <input value={editStaffForm.status} onChange={(e) => setEditStaffForm((f) => ({ ...f, status: e.target.value }))} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem", marginBottom: "0.5rem" }} />
                      <button type="button" style={crmActionBtnStyle} onClick={saveEditStaff}>{t.save}</button>
                      <button type="button" style={crmActionBtnStyle} onClick={() => setEditingStaffId(null)}>{t.cancel}</button>
                    </>
                  ) : (
                    <>
                      <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{person.name}</strong>
                      <span style={{ color: "#475569", fontSize: "1.05rem" }}>{person.role}</span>
                      <span style={{ ...statusBadgeBase, ...getStatusBadgeStyle(person.status), width: "fit-content" }}>{translateStaffStatus(person.status, language)}</span>
                      {person.id && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <button type="button" style={crmActionBtnStyle} onClick={() => startEditStaff(person)}>{t.edit}</button>
                          <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmStaff(person.id); }}>{t.delete}</button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {paymentTabs.has(activeTab) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddPayment(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                {t.addPayment}
              </button>
            </div>
            {crmShowAddPayment && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.client} value={crmPaymentForm.client} onChange={(e) => setCrmPaymentForm((f) => ({ ...f, client: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.amount} value={crmPaymentForm.amount} onChange={(e) => setCrmPaymentForm((f) => ({ ...f, amount: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.linkedBooking} value={crmPaymentForm.bookingId} onChange={(e) => setCrmPaymentForm((f) => ({ ...f, bookingId: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmPayment} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>{t.save}</button>
                <button type="button" onClick={() => setCrmShowAddPayment(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t.client}</th>
                    <th style={thStyle}>{t.amount}</th>
                    <th style={thStyle}>{t.status}</th>
                    <th style={thStyle}>{t.linkedBooking}</th>
                    <th style={thStyle}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {crmPaymentRecords.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>{item.client}</td>
                      <td style={tdStyle}>{item.amount}</td>
                      <td style={tdStyle}>{paymentStatusLabel(item.status, language)}</td>
                      <td style={tdStyle}>{item.bookingId || "—"}</td>
                      <td style={tdStyle}>
                        {String(item.status).toLowerCase() !== "paid" && (
                          <button type="button" style={crmActionBtnStyle} onClick={() => updateCrmPayment(item.id, { status: "paid" })}>{t.markPaid}</button>
                        )}
                        <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmPayment(item.id); }}>{t.delete}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {assetTabs.has(activeTab) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddAsset(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                {t.addAsset}
              </button>
            </div>
            {crmShowAddAsset && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmAssetForm.name} onChange={(e) => setCrmAssetForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder={t.status} value={crmAssetForm.status} onChange={(e) => setCrmAssetForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                  <input placeholder="ID / seats" value={crmAssetForm.seats} onChange={(e) => setCrmAssetForm((f) => ({ ...f, seats: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmAsset} style={{ background: "var(--color-accent, #1d4ed8)", color: "var(--color-on-accent, #ffffff)", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>{t.save}</button>
                <button type="button" onClick={() => setCrmShowAddAsset(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{t.name}</th>
                    <th style={thStyle}>{t.status}</th>
                    <th style={thStyle}>Info</th>
                    <th style={thStyle}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {crmAssetRecords
                    .filter((item) => !item.kind || item.kind === activeTab)
                    .map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>{item.name}</td>
                        <td style={tdStyle}>{item.status}</td>
                        <td style={tdStyle}>{item.seats || "—"}</td>
                        <td style={tdStyle}>
                          <button type="button" style={crmDangerBtnStyle} onClick={() => { if (window.confirm(t.deleteConfirm)) deleteCrmAsset(item.id); }}>{t.delete}</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "integrations" && (
          <section className="panel domain-section integrations-panel">
            <h3 style={{ margin: 0 }}>{t.integrations}</h3>
            <p style={{ color: "#64748b", margin: "0.5rem 0 1.25rem" }}>
              {integrationsCopy.subtitle}
            </p>

            <a
              className="integrations-factory-card"
              href={factoryBridgeHref}
              target="_blank"
              rel="noreferrer"
            >
              <div className="integrations-factory-card__badge">Factory</div>
              <h4 style={{ margin: "0 0 0.5rem" }}>{integrationsCopy.factoryTitle}</h4>
              <p style={{ margin: "0 0 0.85rem", color: "#475569", lineHeight: 1.45 }}>
                {integrationsCopy.factoryBody}
              </p>
              <span className="integrations-factory-card__cta">{integrationsCopy.factoryCta}</span>
            </a>

            <div className="integrations-grid">
              {INTEGRATION_STUB_CARDS.map((card) => (
                <article key={card.id} className="integrations-stub-card" data-integration={card.id}>
                  <div className="integrations-stub-card__head">
                    <h4 style={{ margin: 0 }}>
                      {card.title[language] || card.title.en}
                    </h4>
                    <span
                      className={`integrations-status integrations-status--${card.status}`}
                    >
                      {integrationStatusLabel(card.status, language)}
                    </span>
                  </div>
                  <p style={{ margin: "0.65rem 0 0.85rem", color: "#64748b", lineHeight: 1.4 }}>
                    {card.description[language] || card.description.en}
                  </p>
                  <button type="button" className="integrations-stub-btn" disabled>
                    {integrationsCopy.stubHint}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="panel domain-section">
            <h3>{t.settings}</h3>
            <p style={{ color: "#64748b", margin: "0 0 1rem" }}>{t.settingsSubtitle}</p>
            <div style={{ maxWidth: 480 }}>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsBusiness}</span>
                <input
                  style={settingsInputStyle}
                  value={businessName}
                  onChange={(e) => persistCompanySettings({ businessName: e.target.value })}
                />
              </label>
              {ownerName ? (
                <label style={settingsFieldStyle}>
                  <span style={settingsLabelStyle}>{t.settingsOwner}</span>
                  <input
                    style={{ ...settingsInputStyle, opacity: 0.85, cursor: "default" }}
                    value={ownerName}
                    readOnly
                    aria-readonly="true"
                  />
                </label>
              ) : null}
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsNiche}</span>
                <input
                  style={{ ...settingsInputStyle, opacity: 0.85, cursor: "default" }}
                  value={sectorLabel || nicheLabel}
                  readOnly
                  aria-readonly="true"
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsCity}</span>
                <input
                  style={settingsInputStyle}
                  value={city}
                  onChange={(e) => persistCompanySettings({ city: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsEmail}</span>
                <input
                  style={settingsInputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => persistCompanySettings({ email: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsPhone}</span>
                <input
                  style={settingsInputStyle}
                  type="tel"
                  value={phone}
                  onChange={(e) => persistCompanySettings({ phone: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsWhatsapp}</span>
                <input
                  style={settingsInputStyle}
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => persistCompanySettings({ whatsapp: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsPostal}</span>
                <input
                  style={settingsInputStyle}
                  value={postalCode}
                  onChange={(e) => persistCompanySettings({ postalCode: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsAddress}</span>
                <input
                  style={settingsInputStyle}
                  value={address}
                  onChange={(e) => persistCompanySettings({ address: e.target.value })}
                />
              </label>
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{t.settingsPublicSite || "Your site for customers"}</div>
                <input
                  readOnly
                  value={publicSiteUrl || ""}
                  placeholder="/site/…"
                  style={{ ...settingsInputStyle, marginBottom: "0.5rem", fontSize: "0.85rem" }}
                />
                <button
                  type="button"
                  disabled={!publicSiteUrl}
                  onClick={() => {
                    if (!publicSiteUrl) return;
                    void navigator.clipboard.writeText(publicSiteUrl).then(() => {
                      setSiteLinkCopied(true);
                      window.setTimeout(() => setSiteLinkCopied(false), 2000);
                    });
                  }}
                  style={{
                    background: publicSiteUrl ? "var(--color-accent, #1d4ed8)" : "#94a3b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.65rem 1rem",
                    fontWeight: 700,
                    cursor: publicSiteUrl ? "pointer" : "not-allowed",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                >
                  {siteLinkCopied ? (t.settingsSiteCopied || "Copied!") : (t.settingsCopySite || "Copy site link")}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "notifications" && flags.notifications && (
          <section className="panel domain-section notifications-section">
            <h3>{t.reminders}</h3>
            <ul className="notice-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {notifications.map((note, index) => (
                <li
                  key={note}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                    padding: "0.75rem 0.85rem",
                    marginBottom: "0.5rem",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>🔔</span>
                  <span>{translateReminder(note, index)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showGenericRecords && (
          <section className="panel domain-section">
            <h3>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {Object.keys(genericPageRecords[0]).map((key) => (
                      <th key={key} style={thStyle}>{key.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {genericPageRecords.map((item, index) => (
                    <tr key={item.id || index}>
                      {Object.values(item).map((value, valueIndex) => (
                        <td key={valueIndex} style={tdStyle}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="site-footer">
          <strong>{businessName}</strong>
          <span>{sectorLabel}</span>
          {phone && <span>{phone}</span>}
          {city && <span>{city}</span>}
          <span>{email || labels.email}</span>
        </footer>
      </div>
    </div>
  );
}

/* logo-asset-sync 2026-07-16T22:26:14+02:00 */
