import { useCallback, useEffect, useMemo, useState } from "react";
import clientData from "./data/client_data.json";
import domainUi from "./data/domain_ui.json";
import nicheLabelsData from "./data/niche-labels.json";
import nicheScenariosData from "./data/niche-scenarios.json";
import nichePromotionsData from "./data/niche-promotions.json";
import { getGalleryImagePaths, getHeroImagePath } from "./lib/image-library.js";
import { useCrmRecords } from "./lib/useCrmRecords.js";

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
  const root = document.documentElement.style;
  root.setProperty("--color-primary", resolved.primary);
  root.setProperty("--color-secondary", resolved.secondary);
  root.setProperty("--color-accent", resolved.accent);
  root.setProperty("--color-hero-bg", resolved.hero_bg);
  root.setProperty("--accent", resolved.accent);
  root.setProperty("--accent-soft", resolved.secondary);
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

function pickLocalized(value, language) {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    if ("ru" in value || "de" in value || "en" in value) {
      return value[language] ?? value.ru ?? value.de ?? value.en ?? "";
    }
  }
  return value ?? "";
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

  const t = labels[lang] || labels.ru;

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

  return status;
}

function translateServiceName(name, businessType, lang) {
  const value = String(name || "").toLowerCase().trim();
  const nicheMap = NICHE_SERVICE_TRANSLATIONS[businessType];

  if (nicheMap?.[value]?.[lang]) {
    return nicheMap[value][lang];
  }

  if (DENTAL_NICHES.has(businessType)) {
    for (const [key, translations] of Object.entries(DENTAL_SERVICE_NAMES)) {
      if (value.includes(key)) {
        return translations[lang] || translations.en;
      }
    }
  }

  for (const map of Object.values(NICHE_SERVICE_TRANSLATIONS)) {
    for (const [key, translations] of Object.entries(map)) {
      if (value.includes(key)) {
        return translations[lang] || translations.en;
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
  return TABLE_HEADERS[lang] || TABLE_HEADERS.ru;
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
    if (normalized.includes(key)) {
      return translations[lang] || translations.en;
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

function normalizeDemoData(data, language = "ru") {
  if (!data || typeof data !== "object") return null;
  const records = data.records || {};

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
      status: pickLocalized(item.status, language) || "Pending",
    })),
    services: (data.services || records.classes || records.courses || records.subscriptions || records.products || records.properties || records.services || []).map((item) => ({
      name: pickLocalized(item.name || item.title, language) || "—",
      price: item.price || item.value || "—",
      duration: pickLocalized(item.duration, language) || "",
    })),
    staff: (data.staff || records.staff || records.masters || records.doctors || records.therapists || records.trainers || records.mechanics || records.developers || records.teachers || records.drivers || records.agents || []).map((item) => ({
      name: pickLocalized(item.name, language) || "—",
      role: pickLocalized(item.role || item.interest, language) || "—",
      status: pickLocalized(item.status, language) || "Available",
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
const LOADING_DOCUMENT_TITLE = "CRM Demo — Loading…";

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
};

const NICHE_LABELS_KEY_MAP = {
  restaurant_crm: "restaurant",
  massage_salon_crm: "massage_salon",
  car_service_crm: "car_service",
  real_estate_crm: "real_estate",
  fitness: "fitness_club",
  barbershop: "beauty_salon",
  ecommerce_crm: "ecommerce",
  logistics_crm: "logistics",
  delivery: "logistics",
};

const DEFAULT_GENERIC_PAGES = ["dashboard", "clients", "appointments", "services", "settings"];

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
  if (item?.name && typeof item.name === "object") {
    return item.name[language] ?? item.name.en ?? item.name.ru ?? "—";
  }
  return item?.name ?? "—";
}

function getTodayItemService(item, language) {
  if (item?.service && typeof item.service === "object") {
    return item.service[language] ?? item.service.en ?? item.service.ru ?? "—";
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
    businessType,
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
  return promotion[language] ?? promotion.en ?? promotion.ru ?? "";
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
};

const NICHE_SECTOR_LABELS = {
  restaurant: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  restaurant_crm: { ru: "Ресторан", de: "Restaurant", en: "Restaurant" },
  beauty_salon: { ru: "Салон красоты", de: "Beauty-Salon", en: "Beauty Salon" },
  fitness_club: { ru: "Фитнес-клуб", de: "Fitnessclub", en: "Fitness Club" },
  fitness: { ru: "Фитнес-клуб", de: "Fitnessclub", en: "Fitness Club" },
  massage_salon: { ru: "Массажный салон", de: "Massagesalon", en: "Massage Salon" },
  massage_salon_crm: { ru: "Массажный салон", de: "Massagesalon", en: "Massage Salon" },
  car_service: { ru: "Автосервис", de: "Autowerkstatt", en: "Car Service" },
  car_service_crm: { ru: "Автосервис", de: "Autowerkstatt", en: "Car Service" },
  health_clinic: { ru: "Клиника", de: "Klinik", en: "Health Clinic" },
  dental_clinic: { ru: "Стоматология", de: "Zahnarztpraxis", en: "Dental Clinic" },
  hotel_booking: { ru: "Отель", de: "Hotel", en: "Hotel" },
  education: { ru: "Образование", de: "Bildung", en: "Education" },
  logistics: { ru: "Логистика", de: "Logistik", en: "Logistics" },
  logistics_crm: { ru: "Логистика", de: "Logistik", en: "Logistics" },
  delivery: { ru: "Доставка", de: "Lieferung", en: "Delivery" },
  ecommerce: { ru: "E-commerce", de: "E-Commerce", en: "E-commerce" },
  ecommerce_crm: { ru: "E-commerce", de: "E-Commerce", en: "E-commerce" },
  technology: { ru: "IT", de: "Technologie", en: "Technology" },
  real_estate: { ru: "Недвижимость", de: "Immobilien", en: "Real Estate" },
  real_estate_crm: { ru: "Недвижимость", de: "Immobilien", en: "Real Estate" },
};

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
  ru: {
    clients: "Пациенты",
    staff: "Персонал",
    notifications: "Уведомления",
    patients: "Пациенты",
    doctors: "Врачи",
    masters: "Мастера",
  },
  de: {
    clients: "Kunden",
    staff: "Personal",
    notifications: "Benachrichtigungen",
    patients: "Patienten",
    doctors: "Ärzte",
    masters: "Meister",
  },
  en: {
    clients: "Clients",
    staff: "Staff",
    notifications: "Notifications",
    patients: "Patients",
    doctors: "Doctors",
    masters: "Masters",
  },
};

const DEFAULT_PAGES_BY_NICHE = {
  health_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  dental_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  beauty_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  fitness_club: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  restaurant: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  car_service: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  hotel_booking: ["dashboard", "guests", "rooms", "reservations", "housekeeping", "settings"],
  real_estate: ["dashboard", "properties", "agents", "clients", "viewings", "contracts", "settings"],
  veterinary_clinic: ["dashboard", "pets", "owners", "appointments", "treatments", "vaccinations", "settings"],
  school_management: ["dashboard", "students", "teachers", "classes", "attendance", "grades", "settings"],
  course_platform: ["dashboard", "courses", "lessons", "students", "progress", "certificates", "settings"],
  inventory_system: ["dashboard", "products", "warehouses", "suppliers", "stock", "orders", "settings"],
  education: ["dashboard", "students", "courses", "teachers", "appointments", "settings"],
  logistics: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  ecommerce: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  technology: ["dashboard", "products", "clients", "projects", "developers", "settings"],
};

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
  const nicheLabel =
    tabs[normalized]?.[language] ??
    tabs[normalized]?.ru ??
    tabs[normalized]?.de ??
    tabs[normalized]?.en;
  if (nicheLabel) {
    return nicheLabel;
  }
  if (sectionLabels[normalized]) {
    return sectionLabels[normalized];
  }
  return (
    TAB_FALLBACK_LABELS[language]?.[normalized] ??
    TAB_FALLBACK_LABELS.ru?.[normalized] ??
    formatPageLabel(normalized)
  );
}

function translateFeatureLabel(feature, language, businessType) {
  const key = String(feature || "").toLowerCase();
  return getPageLabel(key, language, businessType);
}

function getCounterLabels(businessType, language) {
  return (
    COUNTER_LABELS_I18N[businessType]?.[language] ??
    COUNTER_LABELS_I18N[businessType]?.ru ??
    COUNTER_LABELS[businessType] ??
  ["Клиентов", "Записей", "Услуг", "Сотрудников"]
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

function applyStoredCompanySettings(stored, handlers) {
  if (!stored) {
    return;
  }
  if (typeof stored.businessName === "string") {
    handlers.setBusinessName(stored.businessName);
  }
  if (typeof stored.nicheLabel === "string") {
    handlers.setNicheLabel(stored.nicheLabel);
  }
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

export default function App() {
  const bootClientId = readClientIdFromLocation();
  const crmStorageId = bootClientId || "local-demo";
  const { theme, labels, demo, module_flags: flags, sections, dashboard_title, business_type_label, accent_tagline, hero_images: heroImages = [], gallery_images: galleryImages = [], gif_assets: gifAssets = [] } = domainUi;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState(
    clientData?.language || domainUi?.language || "ru"
  );
  const [businessName, setBusinessName] = useState(
    bootClientId ? "" : (clientData.business_name || formatPageLabel(DEFAULT_BUSINESS_TYPE)),
  );
  const [businessType, setBusinessType] = useState(
    bootClientId ? null : (clientData.business_type || domainUi?.business_type || DEFAULT_BUSINESS_TYPE),
  );
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
  const [manifestPending, setManifestPending] = useState(Boolean(bootClientId));
  const [manifestLoaded, setManifestLoaded] = useState(false);
  const [manifestError, setManifestError] = useState(null);

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
      setBusinessType,
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
      if (normalized?.businessType) {
        const lang = normalized.language || "ru";
        const seedNiche =
          NICHE_SECTOR_LABELS[normalized.businessType]?.[lang] ||
          NICHE_SECTOR_LABELS[normalized.businessType]?.en ||
          formatPageLabel(normalized.businessType);
        setNicheLabel((prev) => prev || seedNiche);
      }
      applyStoredCompanySettings(readCompanySettings(crmStorageId), {
        setBusinessName,
        setNicheLabel,
        setPhone,
        setEmail,
        setWhatsapp,
        setPostalCode,
        setAddress,
        setCity,
      });
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
    setMvpUrl(window.location.href);
  }, []);

  useEffect(() => {
    const manifestApiBase =
      import.meta.env.VITE_MANIFEST_API_BASE ||
      "https://saas-mvp-funnel-production.up.railway.app";
    const controller = new AbortController();

    const loadConfig = async () => {
      const embedded = readDeployedManifest();
      if (embedded && applyManifestFromConfig(embedded)) {
        return;
      }

      try {
        const staticResponse = await fetch("./client-manifest.json", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (staticResponse.ok) {
          const config = await staticResponse.json();
          if (applyManifestFromConfig(config)) {
            return;
          }
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }

      const clientId = readClientIdFromLocation();
      if (clientId) {
        try {
          const response = await fetch(`${manifestApiBase}/api/manifest/${clientId}`, {
            signal: controller.signal,
          });
          if (response.ok) {
            const config = await response.json();
            applyManifestFromConfig(config);
            return;
          }
          setManifestError(`Manifest not found (${response.status})`);
          setManifestPending(false);
        } catch (error) {
          if (error?.name === "AbortError") {
            return;
          }
          setManifestError("Failed to load manifest");
          setManifestPending(false);
        }
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
    const scenarioRecords = scenario?.records ?? getNicheScenario(effectiveBusinessType)?.records;
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
      services: mergedRecords.services ?? mergedRecords.classes ?? mergedRecords.courses ?? demoData?.services,
      appointments: mergedRecords.appointments ?? mergedRecords.work_orders ?? demoData?.appointments,
    }, language) || base;
  }, [demoData, demo, scenario, effectiveBusinessType, language, manifestLoaded]);
  const clients = demoSource.clients || [];
  const appointments = demoSource.appointments || [];
  const services = demoSource.services || [];

  const {
    records: crmClientRecords,
    addRecord: addCrmClient,
    updateRecord: updateCrmClient,
    deleteRecord: deleteCrmClient,
  } = useCrmRecords(crmStorageId, "clients", clients);
  const [crmShowAddClient, setCrmShowAddClient] = useState(false);
  const [crmClientForm, setCrmClientForm] = useState({ name: "", note: "", phone: "" });
  const [editingClientId, setEditingClientId] = useState(null);
  const [editClientForm, setEditClientForm] = useState({ name: "", note: "", phone: "", visits: 0 });
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
  } = useCrmRecords(crmStorageId, "appointments", appointments);
  const [crmShowAddAppointment, setCrmShowAddAppointment] = useState(false);
  const [crmAppointmentForm, setCrmAppointmentForm] = useState({ client: "", service: "", time: "", status: "Pending" });
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editAppointmentForm, setEditAppointmentForm] = useState({ client: "", service: "", time: "", status: "" });
  const displayAppointments = crmAppointmentRecords;

  function handleAddCrmAppointment() {
    if (!crmAppointmentForm.client.trim() || !crmAppointmentForm.time.trim()) return;
    addCrmAppointment({
      client: crmAppointmentForm.client.trim(),
      service: crmAppointmentForm.service.trim() || "—",
      time: crmAppointmentForm.time.trim(),
      status: crmAppointmentForm.status.trim() || "Pending",
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
      status: editAppointmentForm.status.trim() || "Pending",
    });
    setEditingAppointmentId(null);
  }

  const {
    records: crmServiceRecords,
    addRecord: addCrmService,
    updateRecord: updateCrmService,
    deleteRecord: deleteCrmService,
  } = useCrmRecords(crmStorageId, "services", services);
  const [crmShowAddService, setCrmShowAddService] = useState(false);
  const [crmServiceForm, setCrmServiceForm] = useState({ name: "", price: "", duration: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({ name: "", price: "", duration: "" });
  const displayServices = crmServiceRecords;

  function handleAddCrmService() {
    if (!crmServiceForm.name.trim()) return;
    addCrmService({
      name: crmServiceForm.name.trim(),
      price: crmServiceForm.price.trim(),
      duration: crmServiceForm.duration.trim(),
    });
    setCrmServiceForm({ name: "", price: "", duration: "" });
    setCrmShowAddService(false);
  }

  function startEditService(item) {
    setEditingServiceId(item.id);
    setEditServiceForm({
      name: item.name || "",
      price: item.price || "",
      duration: item.duration || "",
    });
  }

  function saveEditService() {
    if (!editingServiceId || !editServiceForm.name.trim()) return;
    updateCrmService(editingServiceId, {
      name: editServiceForm.name.trim(),
      price: editServiceForm.price.trim(),
      duration: editServiceForm.duration.trim(),
    });
    setEditingServiceId(null);
  }

  const staff = demoSource.staff || [];
  const {
    records: crmStaffRecords,
    addRecord: addCrmStaff,
  } = useCrmRecords(crmStorageId, "staff", staff);
  const [crmShowAddStaff, setCrmShowAddStaff] = useState(false);
  const [crmStaffForm, setCrmStaffForm] = useState({ name: "", role: "", status: "" });
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
  const notifications = demoSource.notifications || [];
  const sectorLabel =
    NICHE_SECTOR_LABELS[effectiveBusinessType]?.[language] ?? formatPageLabel(effectiveBusinessType || DEFAULT_BUSINESS_TYPE);
  const heroPhotoSrc = heroPhoto ?? getHeroImagePath(effectiveBusinessType);
  const galleryPhotoList = galleryPhotos ?? getGalleryImagePaths(effectiveBusinessType);
  const nicheLabelsConfig = useMemo(
    () => getNicheLabelsConfig(effectiveBusinessType),
    [effectiveBusinessType],
  );
  const displayPanelTitle = sectorLabel;
  const displayPanelTagline =
    subtitle ||
    nicheLabelsConfig.panel_tagline?.[language] ||
    nicheLabelsConfig.panel_tagline?.en ||
    "";
  const nicheScenario = useMemo(() => {
    if (isPopulatedScenario(scenario)) {
      return scenario;
    }
    return getNicheScenario(effectiveBusinessType);
  }, [scenario, effectiveBusinessType]);
  const fallbackPromotion = useMemo(() => pickRandomPromotion(effectiveBusinessType), [effectiveBusinessType]);
  const activePromotion = promotion ?? fallbackPromotion;
  const metricLabels = nicheScenario?.metrics?.[language] ?? nicheScenario?.metrics?.ru ?? [];
  const metricValues = nicheScenario?.metric_values ?? [];
  const todayItems = nicheScenario?.today_items ?? [];
  const popularServices =
    nicheScenario?.popular_services?.[language] ??
    nicheScenario?.popular_services?.ru ??
    [];
  const promotionText = getPromotionText(activePromotion, language);
  const businessIcon = NICHE_ICONS[effectiveBusinessType] ?? theme.icon;

  const i18n = {
    en: { patients: "Patients", visits: "Visits", visitsBadge: "visits", addClient: "Add Client", addAppointment: "Add Appointment", edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel", actions: "Actions", confirmed: "Confirmed", pending: "Pending", menu: "MENU", client: "Client", service: "Service", time: "Time", status: "Status", name: "Name", note: "Note", role: "Role", available: "Available", inSurgery: "In Surgery", gallery: "Gallery", mvpReadyTitle: "Your CRM Demo is ready", mvpReadySubtitle: "Save the link — this is your working CRM Demo", copyLink: "Copy link", openMvpTab: "Open CRM Demo in new tab", reminders: "Reminders", dentist: "Dentist", orthodontist: "Orthodontist", hygienist: "Hygienist", noteTreatment: "Treatment plan active", noteCleaning: "Regular cleaning", noteNew: "New patient record", service1: "Dental Check-up", service2: "Teeth Cleaning", service3: "Root Canal Treatment", reminder1: "Follow-up: Patient Weber treatment plan update", reminder2: "Reminder: cleaning appointment for Patient Koch", settingsSubtitle: "Basic settings for your CRM.", settingsNiche: "Niche", settingsCity: "City", settingsWhatsapp: "WhatsApp", settingsPostal: "Postal code", settingsAddress: "Address", deleteConfirm: "Delete this record?" },
    de: { patients: "Patienten", visits: "Besuche", visitsBadge: "Besuche", addClient: "Kunde hinzufügen", addAppointment: "Termin hinzufügen", edit: "Bearbeiten", delete: "Löschen", save: "Speichern", cancel: "Abbrechen", actions: "Aktionen", confirmed: "Bestätigt", pending: "Ausstehend", menu: "MENÜ", client: "Kunde", service: "Dienstleistung", time: "Uhrzeit", status: "Status", name: "Name", note: "Notiz", role: "Rolle", available: "Verfügbar", inSurgery: "Im Eingriff", gallery: "Galerie", mvpReadyTitle: "Ihre CRM Demo ist bereit", mvpReadySubtitle: "Speichern Sie den Link — das ist Ihre CRM Demo", copyLink: "Link kopieren", openMvpTab: "CRM Demo in neuem Tab öffnen", reminders: "Erinnerungen", dentist: "Zahnarzt", orthodontist: "Kieferorthopäde", hygienist: "Hygienikerin", noteTreatment: "Behandlungsplan aktiv", noteCleaning: "Regelmäßige Reinigung", noteNew: "Neue Patientenakte", service1: "Zahnkontrolle", service2: "Zahnreinigung", service3: "Wurzelkanalbehandlung", reminder1: "Nachverfolgung: Behandlungsplan Patient Weber", reminder2: "Erinnerung: Reinigungstermin für Patient Koch", settingsSubtitle: "Grundeinstellungen für Ihr CRM.", settingsNiche: "Branche", settingsCity: "Stadt", settingsWhatsapp: "WhatsApp", settingsPostal: "Postleitzahl", settingsAddress: "Adresse", deleteConfirm: "Diesen Eintrag löschen?" },
    ru: { patients: "Пациенты", visits: "Визиты", visitsBadge: "визитов", addClient: "Добавить клиента", addAppointment: "Добавить приём", edit: "Изменить", delete: "Удалить", save: "Сохранить", cancel: "Отмена", actions: "Действия", confirmed: "Подтверждён", pending: "Ожидает", menu: "МЕНЮ", client: "Клиент", service: "Услуга", time: "Время", status: "Статус", name: "Имя", note: "Заметка", role: "Роль", available: "Доступен", inSurgery: "На приёме", gallery: "Галерея", mvpReadyTitle: "Ваша CRM Demo готова", mvpReadySubtitle: "Сохраните ссылку — это ваша рабочая CRM Demo", copyLink: "Копировать ссылку", openMvpTab: "Открыть CRM Demo в новой вкладке", reminders: "Напоминания", dentist: "Стоматолог", orthodontist: "Ортодонт", hygienist: "Гигиенист", noteTreatment: "План лечения активен", noteCleaning: "Регулярная чистка", noteNew: "Новая карта пациента", service1: "Осмотр зубов", service2: "Чистка зубов", service3: "Лечение корневого канала", reminder1: "Напоминание: обновление плана лечения Пациент Вебер", reminder2: "Напоминание: запись на чистку Пациент Кох", settingsSubtitle: "Базовые настройки вашей CRM.", settingsNiche: "Ниша", settingsCity: "Город", settingsWhatsapp: "WhatsApp", settingsPostal: "Индекс", settingsAddress: "Адрес", deleteConfirm: "Удалить эту запись?" },
  };
  const sectionLabels = uiSections ?? {};
  const baseT = i18n[language] || i18n.ru;
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
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (manifestPending && !manifestLoaded) {
      document.title = LOADING_DOCUMENT_TITLE;
      return;
    }
    document.title = businessName ? `${businessName} — ${displayPanelTitle}` : displayPanelTitle;
  }, [businessName, language, displayPanelTitle, manifestPending, manifestLoaded]);

  const effectivePages = useMemo(() => {
    if (Array.isArray(pages) && pages.length > 0) {
      return pages;
    }
    const nicheKey = getNicheLabelsKey(effectiveBusinessType);
    return DEFAULT_PAGES_BY_NICHE[nicheKey] ?? DEFAULT_PAGES_BY_NICHE[effectiveBusinessType] ?? DEFAULT_GENERIC_PAGES;
  }, [pages, effectiveBusinessType]);

  const navItems = effectivePages.map((pageId) => ({
    id: pageId,
    label: getPageLabel(pageId, language, effectiveBusinessType, sectionLabels),
    icon: PAGE_TAB_ICONS[pageId] || PAGE_TAB_ICONS[PAGE_ALIASES[pageId]] || "📄",
    show: true,
  }));
  const useCrmDashboardLayout = isCrmDashboardNiche(effectiveBusinessType);
  const showDashboardHeroGallery = showsDashboardHeroGallery(effectiveBusinessType);

  const appointmentTabs = new Set(["appointments", "reservations", "viewings", "work_orders"]);
  const clientTabs = new Set(["clients", "patients", "members", "guests", "students", "customers"]);
  const serviceTabs = new Set(["services", "menu", "classes", "courses", "subscriptions", "products"]);
  const staffTabs = new Set([
    "staff",
    "doctors",
    "masters",
    "therapists",
    "agents",
    "mechanics",
    "developers",
    "teachers",
    "drivers",
  ]);

  const genericPageRecords = getPageRecords(
    {
      ...(demoData ?? {}),
      records: {
        ...(demoData?.records ?? {}),
        ...(scenario?.records ?? getNicheScenario(effectiveBusinessType)?.records ?? {}),
      },
    },
    activeTab,
  ).map((item) => localizeRecord(item, language));
  const showGenericRecords =
    genericPageRecords.length > 0 &&
    activeTab !== "dashboard" &&
    activeTab !== "settings" &&
    activeTab !== "tables" &&
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
      nicheLabel,
      phone,
      email,
      whatsapp,
      postalCode,
      address,
      city,
      ...patch,
    };
    if (patch.businessName !== undefined) setBusinessName(patch.businessName);
    if (patch.nicheLabel !== undefined) setNicheLabel(patch.nicheLabel);
    if (patch.phone !== undefined) setPhone(patch.phone);
    if (patch.email !== undefined) setEmail(patch.email);
    if (patch.whatsapp !== undefined) setWhatsapp(patch.whatsapp);
    if (patch.postalCode !== undefined) setPostalCode(patch.postalCode);
    if (patch.address !== undefined) setAddress(patch.address);
    if (patch.city !== undefined) setCity(patch.city);
    writeCompanySettings(crmStorageId, next);
  };

  useEffect(() => {
    if (nicheLabel) {
      return;
    }
    if (!sectorLabel) {
      return;
    }
    setNicheLabel(sectorLabel);
  }, [nicheLabel, sectorLabel]);

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
    fontSize: "0.92rem",
    width: "100%",
    boxSizing: "border-box",
  };
  const settingsLabelStyle = {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#475569",
  };

  const tableRows = getPageRecords(demoData, "tables").map((item) => localizeRecord(item, language));

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
    fontSize: "0.9rem",
    fontWeight: activeTab === tabId ? 700 : 500,
    background: activeTab === tabId ? "var(--color-secondary, #dbeafe)" : "transparent",
    color: activeTab === tabId ? "var(--color-accent, #1d4ed8)" : "#334155",
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
    fontSize: "0.92rem",
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
        <p style={{ fontSize: "1.1rem", color: "#475569" }}>Loading CRM Demo…</p>
      </div>
    );
  }

  if (manifestError && bootClientId && !manifestLoaded) {
    return (
      <div className="app-shell app-error" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <h1 style={{ marginBottom: "0.75rem" }}>Manifest unavailable</h1>
          <p style={{ color: "#64748b" }}>{manifestError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" data-domain={effectiveBusinessType || domainUi.domain_key}>
      <aside className="mvp-sidebar">
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
          <button type="button" onClick={() => setLanguage("en")} style={{ flex: 1, padding: "6px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "12px", background: language === "en" ? "var(--accent)" : "#fff", color: language === "en" ? "#fff" : "var(--accent)" }}>EN</button>
          <button type="button" onClick={() => setLanguage("de")} style={{ flex: 1, padding: "6px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "12px", background: language === "de" ? "var(--accent)" : "#fff", color: language === "de" ? "#fff" : "var(--accent)" }}>DE</button>
          <button type="button" onClick={() => setLanguage("ru")} style={{ flex: 1, padding: "6px 0", borderRadius: "8px", border: "2px solid var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "12px", background: language === "ru" ? "var(--accent)" : "#fff", color: language === "ru" ? "#fff" : "var(--accent)" }}>RU</button>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">{t.menu}</span>
          <ul className="module-list sidebar-module-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.id} style={{ display: "block" }}>
                <button type="button" style={navButtonStyle(item.id)} onClick={() => setActiveTab(item.id)}>
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="mvp-content">
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
                  color: "#ffffff",
                  borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "1rem",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "1.05rem",
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
                <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.5, fontWeight: 600 }}>
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
              <a href={mvpUrl} target="_blank" rel="noreferrer">
                {t.openMvpTab}
              </a>
            </div>
          </>
        )}

        {appointmentTabs.has(activeTab) && (pages ? pages.includes(activeTab) || pages.includes("appointments") || pages.includes("viewings") : flags.appointments) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddAppointment(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {t.addAppointment}
              </button>
            </div>
            {crmShowAddAppointment && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.client} value={crmAppointmentForm.client} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, client: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.service} value={crmAppointmentForm.service} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, service: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.time} value={crmAppointmentForm.time} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, time: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.status} value={crmAppointmentForm.status} onChange={(e) => setCrmAppointmentForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmAppointment} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>{t.save}</button>
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
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.55rem 1rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
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
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                  <input
                    placeholder={language === "de" ? "Telefon" : language === "en" ? "Phone" : "Телефон"}
                    value={crmClientForm.phone}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                  <input
                    placeholder={t.note}
                    value={crmClientForm.note}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, note: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                </div>
                <button type="button" onClick={handleAddCrmClient} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
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
                            <span style={{ ...statusBadgeBase, background: "var(--color-secondary, #dbeafe)", color: "var(--color-accent, #1d4ed8)", border: "1px solid transparent" }}>
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
              <button type="button" onClick={() => setCrmShowAddService(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {language === "de" ? "Leistung hinzufügen" : language === "en" ? "Add Service" : "Добавить услугу"}
              </button>
            </div>
            {crmShowAddService && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmServiceForm.name} onChange={(e) => setCrmServiceForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder="€80" value={crmServiceForm.price} onChange={(e) => setCrmServiceForm((f) => ({ ...f, price: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder="30 min" value={crmServiceForm.duration} onChange={(e) => setCrmServiceForm((f) => ({ ...f, duration: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmService} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save}
                </button>
                <button type="button" onClick={() => setCrmShowAddService(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {serviceRows.map((item) => (
                <article key={item.id || item.name} style={serviceCardStyle}>
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
                      <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{item.name}</strong>
                      <span style={{ display: "block", marginTop: "0.35rem", color: "var(--color-accent, #1d4ed8)", fontWeight: 700 }}>{item.price}</span>
                      <em style={{ display: "block", marginTop: "0.25rem", color: "#64748b", fontStyle: "normal", fontSize: "0.88rem" }}>{activeTab === "menu" ? translateMenuCategory(item.duration, language) : item.duration}</em>
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
              <button type="button" onClick={() => setCrmShowAddStaff(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {language === "de" ? "Mitarbeiter hinzufügen" : language === "en" ? "Add Staff" : "Добавить сотрудника"}
              </button>
            </div>
            {crmShowAddStaff && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmStaffForm.name} onChange={(e) => setCrmStaffForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.role} value={crmStaffForm.role} onChange={(e) => setCrmStaffForm((f) => ({ ...f, role: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={language === "de" ? "Verfügbar" : language === "en" ? "Available" : "Доступен"} value={crmStaffForm.status} onChange={(e) => setCrmStaffForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmStaff} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {language === "de" ? "Speichern" : language === "en" ? "Save" : "Сохранить"}
                </button>
                <button type="button" onClick={() => setCrmShowAddStaff(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {language === "de" ? "Abbrechen" : language === "en" ? "Cancel" : "Отмена"}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {displayStaff.map((person) => (
                <article key={person.id || person.name} style={staffCardStyle}>
                  <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{person.name}</strong>
                  <span style={{ color: "#475569", fontSize: "0.92rem" }}>{person.role}</span>
                  <span style={{ ...statusBadgeBase, ...getStatusBadgeStyle(person.status), width: "fit-content" }}>{person.status}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "tables" && (
          <section className="panel domain-section">
            <h3>{t.tables}</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {tableRows[0]
                      ? Object.keys(tableRows[0]).map((key) => (
                          <th key={key} style={thStyle}>{translateTableColumnHeader(key, language).toUpperCase()}</th>
                        ))
                      : (
                        <>
                          <th style={thStyle}>{t.name.toUpperCase()}</th>
                          <th style={thStyle}>{tableHeaders.status.toUpperCase()}</th>
                        </>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((item, index) => (
                    <tr key={item.id || index}>
                      {Object.entries(item).map(([key, value]) => (
                        <td key={key} style={tdStyle}>{String(translateTableCellValue(key, value, language))}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="panel domain-section">
            <h3>{t.settings}</h3>
            <p style={{ color: "#64748b", margin: "0 0 1rem" }}>{t.settingsSubtitle}</p>
            <div style={{ maxWidth: 480 }}>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.name}</span>
                <input
                  style={settingsInputStyle}
                  value={businessName}
                  onChange={(e) => persistCompanySettings({ businessName: e.target.value })}
                />
              </label>
              <label style={settingsFieldStyle}>
                <span style={settingsLabelStyle}>{t.settingsNiche}</span>
                <input
                  style={settingsInputStyle}
                  value={nicheLabel}
                  onChange={(e) => persistCompanySettings({ nicheLabel: e.target.value })}
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
