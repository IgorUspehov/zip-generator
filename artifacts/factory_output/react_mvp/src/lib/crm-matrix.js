/**
 * Canonical CRM entity matrix for wizard niches (sector_id → pages + roles).
 * Derived from DEFAULT_PAGES + approved business-logic matrix.
 */
export const NICHE_CRM_PAGES = {
  beauty_salon: ["dashboard", "clients", "appointments", "services", "staff", "payments", "integrations", "settings"],
  fitness_club: ["dashboard", "clients", "appointments", "services", "staff", "payments", "integrations", "settings"],
  massage_salon: ["dashboard", "clients", "appointments", "services", "staff", "payments", "integrations", "settings"],
  dental_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments", "integrations", "settings"],
  health_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments", "integrations", "settings"],
  restaurant: ["dashboard", "reservations", "tables", "menu", "staff", "payments", "integrations", "settings"],
  car_service: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "payments", "integrations", "settings"],
  hotel_booking: ["dashboard", "guests", "rooms", "reservations", "housekeeping", "payments", "integrations", "settings"],
  real_estate: [
    "dashboard",
    "properties",
    "agents",
    "clients",
    "viewings",
    "services",
    "contracts",
    "payments",
    "integrations", "settings",
  ],
  education: ["dashboard", "students", "courses", "teachers", "appointments", "payments", "integrations", "settings"],
  logistics: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "payments", "integrations", "settings"],
  ecommerce: ["dashboard", "products", "orders", "clients", "payments", "integrations", "settings"],
  technology: ["dashboard", "products", "clients", "projects", "developers", "payments", "integrations", "settings"],
  law_firm: [
    "dashboard",
    "clients",
    "staff",
    "matters",
    "appointments",
    "services",
    "invoices",
    "payments",
    "integrations", "settings",
  ],
  accounting: [
    "dashboard",
    "clients",
    "staff",
    "invoices",
    "appointments",
    "services",
    "payments",
    "reports",
    "integrations", "settings",
  ],
  cleaning_service: ["dashboard", "clients", "appointments", "services", "staff", "payments", "integrations", "settings"],
  car_wash: ["dashboard", "clients", "appointments", "services", "staff", "payments", "integrations", "settings"],
  construction: ["dashboard", "clients", "projects", "appointments", "services", "staff", "payments", "integrations", "settings"],
};

export const CLIENT_TABS = new Set([
  "clients",
  "patients",
  "members",
  "guests",
  "students",
  "customers",
  "owners",
]);

export const BOOKING_TABS = new Set([
  "appointments",
  "reservations",
  "viewings",
  "work_orders",
  "deliveries",
  "orders",
  "contracts",
  "matters",
  "projects",
]);

export const CATALOG_TABS = new Set([
  "services",
  "menu",
  "classes",
  "courses",
  "subscriptions",
  "products",
]);

export const STAFF_TABS = new Set([
  "staff",
  "doctors",
  "masters",
  "therapists",
  "agents",
  "mechanics",
  "developers",
  "teachers",
  "drivers",
  "housekeeping",
]);

export const ASSET_TABS = new Set(["tables", "rooms", "vehicles", "properties", "routes"]);

export const PAYMENT_TABS = new Set(["payments", "invoices"]);

export const PAYMENT_STATUS = {
  pending: { en: "Pending", de: "Ausstehend", ru: "Ожидает" },
  paid: { en: "Paid", de: "Bezahlt", ru: "Оплачено" },
  failed: { en: "Failed", de: "Fehlgeschlagen", ru: "Ошибка" },
  refunded: { en: "Refunded", de: "Erstattet", ru: "Возврат" },
};

export function paymentStatusLabel(status, language) {
  const key = String(status || "pending").toLowerCase();
  return PAYMENT_STATUS[key]?.[language] || PAYMENT_STATUS.pending[language] || key;
}

/** Build dashboard counters from live CRM collections (not scenario). */
export function buildLiveDashboard(language, counts, counterLabels) {
  const labels =
    Array.isArray(counterLabels) && counterLabels.length >= 4
      ? counterLabels
      : language === "de"
        ? ["Kunden", "Termine", "Leistungen", "Mitarbeiter"]
        : language === "ru"
          ? ["Клиентов", "Записей", "Услуг", "Сотрудников"]
          : ["Clients", "Appointments", "Services", "Staff"];

  return {
    metricLabels: labels.slice(0, 4),
    metricValues: [
      counts.clients ?? 0,
      counts.bookings ?? 0,
      counts.catalog ?? 0,
      counts.staff ?? 0,
    ],
  };
}
