/**
 * Build runtime llm_manifest.json from the current idea (not llm_manifest.example.json).
 */

const MANIFEST_VERSION = "LLM_MANIFEST.1.0";

const DOMAIN_PROFILES = {
  bike_rental_platform: {
    keywords: [/велосипед/i, /\bbike/i, /bicycle/i, /аренд/i, /rental/i, /прокат/i],
    minMatches: 1,
    productName: "Bike Rental Platform",
    productType: "bike_rental_platform",
    category: "mobility_rental",
    mainProblem: "Users cannot easily find, book, and pay for bike rentals across stations.",
    mainSolution: "Unified dashboard for bikes, stations, bookings, rentals, and payments.",
    coreFeatures: [
      "bike_inventory",
      "station_management",
      "online_booking",
      "rental_tracking",
      "payment_processing",
      "user_accounts",
    ],
    pageSlugs: ["dashboard", "bikes", "stations", "rentals", "bookings", "payments", "settings"],
    entities: ["bikes", "stations", "rentals", "bookings", "payments", "users"],
    apiPrefix: "/api",
  },
  massage_salon_platform: {
    keywords: [/массаж/i, /massage/i, /кабинет/i, /spa/i, /wellness/i, /терапевт/i],
    minMatches: 1,
    productName: "Massage Cabinet Platform",
    productType: "massage_salon_platform",
    category: "wellness_services",
    mainProblem: "Massage therapists lose bookings due to manual scheduling and scattered client records.",
    mainSolution: "Booking dashboard with clients, appointments, services, therapists, and schedules.",
    coreFeatures: [
      "online_booking",
      "client_database",
      "appointment_calendar",
      "service_catalog",
      "therapist_management",
      "session_history",
    ],
    pageSlugs: [
      "dashboard",
      "clients",
      "appointments",
      "services",
      "therapists",
      "schedule",
      "settings",
    ],
    entities: ["clients", "appointments", "services", "therapists", "sessions", "users"],
    apiPrefix: "/api",
  },
  home_renovation_platform: {
    keywords: [/ремонт/i, /renovation/i, /квартир/i, /под ключ/i, /отделк/i, /contractor/i, /строител/i],
    minMatches: 1,
    productName: "Home Renovation Platform",
    productType: "home_renovation_platform",
    category: "construction_services",
    mainProblem: "Homeowners lack a single system to manage renovation projects, budgets, and contractors.",
    mainSolution: "Turnkey renovation dashboard with projects, estimates, tasks, budgets, and invoices.",
    coreFeatures: [
      "project_management",
      "contractor_directory",
      "cost_estimates",
      "budget_tracking",
      "task_scheduling",
      "invoice_management",
    ],
    pageSlugs: ["dashboard", "projects", "contractors", "estimates", "budgets", "tasks", "invoices", "settings"],
    entities: ["projects", "contractors", "estimates", "budgets", "tasks", "invoices", "users"],
    apiPrefix: "/api",
  },
  crm_platform: {
    keywords: [/маникюр/i, /салон красот/i, /beauty salon/i, /crm/i, /master/i],
    minMatches: 2,
    productName: "Salon CRM",
    productType: "crm_platform",
    category: "beauty_services",
    mainProblem: "Salon owners lose clients due to manual booking and scattered records.",
    mainSolution: "CRM dashboard with appointments, customers, services, and scheduling.",
    coreFeatures: [
      "online_booking",
      "customer_database",
      "appointment_calendar",
      "service_catalog",
      "master_management",
    ],
    pageSlugs: ["dashboard", "customers", "appointments", "services", "masters", "calendar", "settings"],
    entities: ["customers", "appointments", "services", "masters", "users"],
    apiPrefix: "",
  },
};

const ENTITY_FIELDS = {
  bikes: ["id", "model", "status", "station_id", "hourly_rate", "created_at"],
  stations: ["id", "name", "address", "capacity", "is_active", "created_at"],
  rentals: ["id", "bike_id", "user_id", "started_at", "ended_at", "status", "total_cost"],
  bookings: ["id", "bike_id", "user_id", "station_id", "scheduled_at", "status", "created_at"],
  payments: ["id", "rental_id", "amount", "currency", "status", "paid_at"],
  users: ["id", "name", "email", "role", "created_at"],
  customers: ["id", "name", "email", "phone", "status", "created_at"],
  appointments: ["id", "customer_id", "service_id", "scheduled_at", "status", "created_at"],
  services: ["id", "name", "price", "duration_minutes", "created_at"],
  masters: ["id", "name", "specialty", "is_active", "created_at"],
  clients: ["id", "name", "email", "phone", "status", "created_at"],
  therapists: ["id", "name", "specialty", "is_active", "created_at"],
  sessions: ["id", "client_id", "therapist_id", "service_id", "started_at", "duration_minutes", "status"],
  projects: ["id", "name", "address", "status", "budget_total", "started_at", "created_at"],
  contractors: ["id", "name", "specialty", "phone", "rating", "is_active", "created_at"],
  estimates: ["id", "project_id", "title", "amount", "status", "created_at"],
  budgets: ["id", "project_id", "category", "planned_amount", "spent_amount", "created_at"],
  tasks: ["id", "project_id", "title", "status", "due_date", "assignee", "created_at"],
  invoices: ["id", "project_id", "amount", "status", "due_date", "paid_at"],
};

const PAGE_META = {
  dashboard: { title: "Dashboard", purpose: "Overview of key metrics and recent activity" },
  bikes: { title: "Bikes", purpose: "Manage bike inventory and availability" },
  stations: { title: "Stations", purpose: "Manage rental stations and capacity" },
  rentals: { title: "Rentals", purpose: "Track active and completed rentals" },
  bookings: { title: "Bookings", purpose: "Schedule and manage bike reservations" },
  payments: { title: "Payments", purpose: "Track rental payments and billing status" },
  settings: { title: "Settings", purpose: "Platform configuration and preferences" },
  customers: { title: "Customers", purpose: "Manage client profiles and visit history" },
  appointments: { title: "Appointments", purpose: "Schedule and track bookings" },
  services: { title: "Services", purpose: "Manage service catalog and pricing" },
  masters: { title: "Masters", purpose: "Manage staff and availability" },
  calendar: { title: "Calendar", purpose: "Visual calendar for schedules" },
  schedule: { title: "Schedule", purpose: "Visual schedule for therapists and rooms" },
  clients: { title: "Clients", purpose: "Manage client profiles and visit history" },
  therapists: { title: "Therapists", purpose: "Manage therapists and availability" },
  projects: { title: "Projects", purpose: "Manage renovation projects and timelines" },
  contractors: { title: "Contractors", purpose: "Manage contractors and specialties" },
  estimates: { title: "Estimates", purpose: "Create and track cost estimates" },
  budgets: { title: "Budgets", purpose: "Track planned and spent budgets" },
  tasks: { title: "Tasks", purpose: "Schedule and monitor renovation tasks" },
  invoices: { title: "Invoices", purpose: "Manage project invoices and payments" },
};

function slugToTitle(slug) {
  return String(slug)
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function detectProfile(idea) {
  const text = String(idea || "").trim();
  if (!text) return null;

  let best = null;
  let bestScore = 0;

  for (const [key, profile] of Object.entries(DOMAIN_PROFILES)) {
    const score = profile.keywords.reduce(
      (sum, pattern) => sum + (pattern.test(text) ? 1 : 0),
      0
    );
    if (score >= profile.minMatches && score > bestScore) {
      best = { key, profile, score };
      bestScore = score;
    }
  }

  if (best) return best.profile;

  return {
    productName: slugToTitle(text.split(/[.!?]/)[0].slice(0, 48)) || "SaaS Platform",
    productType: "saas_platform",
    category: "general_saas",
    mainProblem: "Users need a digital product to manage their workflow.",
    mainSolution: "A SaaS dashboard with core modules derived from the product idea.",
    coreFeatures: ["dashboard", "data_management", "user_accounts", "settings"],
    pageSlugs: ["dashboard", "records", "users", "settings"],
    entities: ["records", "users"],
    apiPrefix: "/api",
  };
}

function routeForSlug(slug) {
  return slug === "dashboard" ? "/" : `/${slug}`;
}

function buildPages(pageSlugs) {
  return pageSlugs.map((slug) => {
    const meta = PAGE_META[slug] ?? {
      title: slugToTitle(slug),
      purpose: `Manage ${slugToTitle(slug).toLowerCase()} data`,
    };
    return {
      route: routeForSlug(slug),
      title: meta.title,
      purpose: meta.purpose,
      components: ["data_table", "feature_card", "stats_cards"],
    };
  });
}

function buildEntities(entityNames) {
  return entityNames.map((name) => ({
    name,
    fields: ENTITY_FIELDS[name] ?? ["id", "name", "status", "created_at"],
    relations: [],
  }));
}

function buildApi(entityNames, apiPrefix) {
  const prefix = apiPrefix || "";
  return entityNames.flatMap((entity) => [
    {
      endpoint: `${prefix}/${entity}`,
      method: "GET",
      entity,
      action: "list",
    },
    {
      endpoint: `${prefix}/${entity}`,
      method: "POST",
      entity,
      action: "create",
    },
  ]);
}

function buildNavigation(pageSlugs) {
  return pageSlugs.map((slug) => ({
    route: routeForSlug(slug),
    label: (PAGE_META[slug] ?? { title: slugToTitle(slug) }).title,
  }));
}

export function buildLlmManifest(idea, hints = {}) {
  const raw = String(idea || "").trim();
  const profile = detectProfile(raw);
  const productType = profile.productType || hints.productType;
  const pageSlugs = profile.pageSlugs || hints.pageSlugs;
  const entities = profile.entities || hints.entities;
  const apiPrefix = profile.apiPrefix ?? hints.apiPrefix ?? "/api";

  return {
    version: MANIFEST_VERSION,
    status: "LLM_MANIFEST_READY",
    idea: {
      raw_user_idea: raw,
      normalized_idea: raw,
      language: hints.language || "ru",
      target_market: hints.targetMarket || "Global",
      target_user: hints.targetUser || "End users and operators",
    },
    product: {
      product_name: hints.productName || profile.productName,
      product_type: productType,
      category: profile.category,
      main_problem: profile.mainProblem,
      main_solution: profile.mainSolution,
      core_features: profile.coreFeatures,
    },
    pages: buildPages(pageSlugs),
    entities: buildEntities(entities),
    api: buildApi(entities, apiPrefix),
    ui: {
      style: "shadcn/ui",
      layout: "dashboard",
      shadcn_components: ["sidebar", "topbar", "stats_cards", "data_table", "button", "card"],
      navigation: buildNavigation(pageSlugs),
    },
    business: {
      pricing_model: "subscription",
      plans: [
        { name: "Starter", price: 10, currency: "EUR", interval: "month" },
        { name: "Pro", price: 20, currency: "EUR", interval: "month" },
      ],
      monetization: "Monthly subscription for platform operators",
    },
    constraints: {
      no_custom_ui: true,
      use_shadcn: true,
      no_paid_services: true,
      no_manual_steps: true,
      output_must_include: [
        "idea",
        "product",
        "pages",
        "entities",
        "api",
        "ui",
        "business",
        "constraints",
        "factory_contract",
      ],
    },
    factory_contract: {
      expected_outputs: [
        "PROJECT_TYPE",
        "REPOSITORY",
        "TEMPLATE",
        "ASSEMBLY_BLUEPRINT",
        "MVP_STRUCTURE",
        "MVP_PACKAGE",
        "REAL_MVP",
        "ZIP",
        "DEPLOY",
        "DEMO_VIDEO",
      ],
      forbidden_actions: [
        "generate_full_project_code",
        "create_new_factories",
        "change_factory_architecture",
        "use_paid_services",
        "generate_chaotic_code",
        "bypass_pipeline",
        "manual_screen_recording",
        "write_sql_migrations",
        "deploy_without_factory",
      ],
      handoff_to_factory: [
        "K1_DOMAIN_ANALYZER",
        "K2_REPOSITORY_EXTRACTION",
        "K3_REPOSITORY_ASSEMBLY",
        "K4_REPOSITORY_DOWNLOAD",
        "K5_TEMPLATE_EXTRACTION",
        "K6_ASSEMBLY_BLUEPRINT",
        "K7_MVP_STRUCTURE",
        "K8_MVP_PACKAGE",
        "L1_REAL_MVP",
        "L2_ZIP",
        "L3_DEPLOY",
        "L5_DEMO_VIDEO",
      ],
    },
  };
}

export function pageSlugsFromManifest(manifest) {
  return (manifest?.pages ?? []).map((page) => {
    const route = String(page.route || "/").replace(/^\//, "");
    return route || "dashboard";
  });
}

export function entityNamesFromManifest(manifest) {
  return (manifest?.entities ?? []).map((entity) => String(entity.name || "").trim()).filter(Boolean);
}

export function apiEndpointsFromManifest(manifest) {
  const seen = new Set();
  const endpoints = [];
  for (const item of manifest?.api ?? []) {
    const endpoint = String(item.endpoint || "").trim();
    if (endpoint && !seen.has(endpoint)) {
      seen.add(endpoint);
      endpoints.push(endpoint);
    }
  }
  return endpoints;
}
