import fs from "fs";
import path from "path";

export const MVP_PACKAGE_REL = "artifacts/package/mvp_package.json";

export function readJsonFile(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export function loadMvpPackage(root) {
  const pkg = readJsonFile(path.join(root, MVP_PACKAGE_REL));
  if (!pkg || pkg.package_ready !== true) {
    throw new Error(`Missing or not ready: ${MVP_PACKAGE_REL}. Run mvp-package:generate first.`);
  }
  return pkg;
}

export function sanitizeProjectName(name) {
  return (name || "MVP_PROJECT")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase();
}

export function projectNameFromPackage(pkg) {
  return sanitizeProjectName(pkg.project_type || "MVP_PROJECT");
}

export function projectSlugFromPackage(pkg) {
  return (pkg.project_type || "mvp-project").toLowerCase().replace(/_/g, "-");
}

export function pageSlugToComponent(slug) {
  const parts = String(slug)
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
  return `${parts.join("")}Page`;
}

export function pageSlugToLabel(slug) {
  return String(slug)
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function apiPathToTable(apiPath) {
  let normalized = String(apiPath || "").trim().replace(/^\//, "");
  if (normalized.startsWith("api/")) {
    normalized = normalized.slice(4);
  }
  return normalized.split("/").filter(Boolean)[0] || normalized;
}

export function tableToEntity(table) {
  const clean = apiPathToTable(table);
  const singular = String(clean).replace(/s$/, "");
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

export function pipelineFromPackage(pkg) {
  return {
    best_repo: pkg.repository ?? "-",
    best_template: pkg.template ?? "-",
    best_ui: pkg.ui ?? "shadcn/ui",
    repo_score: 0,
    template_score: 0,
    ui_score: 0,
    source: "mvp_package",
  };
}

export const TABLE_ENTITY_FIELDS = {
  customers: ["id", "name", "email", "phone", "status", "created_at", "updated_at"],
  appointments: ["id", "customer_id", "service_id", "scheduled_at", "status", "created_at"],
  services: ["id", "name", "price", "duration_minutes", "created_at"],
  masters: ["id", "name", "specialty", "is_active", "created_at"],
  users: ["id", "name", "email", "role", "created_at"],
  bikes: ["id", "model", "status", "station_id", "hourly_rate", "created_at"],
  stations: ["id", "name", "address", "capacity", "is_active", "created_at"],
  rentals: ["id", "bike_id", "user_id", "started_at", "ended_at", "status", "total_cost"],
  bookings: ["id", "bike_id", "user_id", "station_id", "scheduled_at", "status", "created_at"],
  payments: ["id", "rental_id", "amount", "currency", "status", "paid_at"],
  projects: ["id", "name", "address", "status", "budget_total", "started_at", "created_at"],
  contractors: ["id", "name", "specialty", "phone", "rating", "is_active", "created_at"],
  estimates: ["id", "project_id", "title", "amount", "status", "created_at"],
  budgets: ["id", "project_id", "category", "planned_amount", "spent_amount", "created_at"],
  tasks: ["id", "project_id", "title", "status", "due_date", "assignee", "created_at"],
  invoices: ["id", "project_id", "amount", "status", "due_date", "paid_at"],
};

export function buildEntitiesFromPackage(pkg) {
  const tables = pkg.database ?? [];
  const entities = {};
  for (const table of tables) {
    const entity = tableToEntity(table);
    entities[entity] = {
      fields: TABLE_ENTITY_FIELDS[table] ?? ["id", "name", "status", "created_at"],
    };
  }
  if (Object.keys(entities).length === 0) {
    entities.Record = { fields: ["id", "name", "status", "created_at"] };
  }
  return entities;
}
