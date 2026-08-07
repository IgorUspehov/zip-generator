/**
 * Push CRM catalog to shared SaaS catalog so /site form stays 1:1.
 * Prefer parent Railway bridge (session cookie) — never requires baked secret.
 * Fallback: direct PUT with __CRM_LEADS_READ_SECRET__ when present.
 *
 * Never push an empty list unless options.allowEmpty=true (avoids wiping seed).
 * Names must stay as full {en,de,ru} — never fan a single UI string into all locales.
 */
function isLocalizedName(value) {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("en" in value || "de" in value || "ru" in value)
  );
}

function normalizeCatalogName(nameRaw) {
  if (isLocalizedName(nameRaw)) {
    // Preserve each locale as-is; do not fill empty slots from another language.
    return {
      en: nameRaw.en == null ? "" : String(nameRaw.en),
      de: nameRaw.de == null ? "" : String(nameRaw.de),
      ru: nameRaw.ru == null ? "" : String(nameRaw.ru),
    };
  }
  // Legacy collapsed string rows are unsafe to push (would overwrite EN/RU/DE).
  return null;
}

export function syncCrmCatalogToApi(clientId, records, options = {}) {
  if (!clientId || typeof window === "undefined") return;

  const seenNames = new Set();
  const items = (Array.isArray(records) ? records : [])
    .map((item, index) => {
      const name = normalizeCatalogName(item?.name);
      if (!name) return null;
      if (!name.en && !name.de && !name.ru) return null;
      // Prefer first occurrence; skip seed+hydrate duplicates of the same product.
      const dedupeKey = [name.en, name.de, name.ru]
        .map((v) => String(v || "").trim().toLowerCase())
        .find(Boolean);
      if (dedupeKey) {
        if (seenNames.has(dedupeKey)) return null;
        seenNames.add(dedupeKey);
      }
      return {
        id: String(item?.id || `rec-cat-${index}`),
        name,
        price: item?.price != null ? String(item.price) : undefined,
        duration: item?.duration,
      };
    })
    .filter(Boolean);

  if (!items.length && options.allowEmpty !== true) {
    return;
  }

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: "CRM_CATALOG_PUSH",
        clientId,
        items,
      },
      "*",
    );
  }

  const token =
    typeof window.__CRM_LEADS_READ_SECRET__ === "string"
      ? window.__CRM_LEADS_READ_SECRET__
      : "";
  if (!token) return;

  const base =
    options.apiBase ||
    import.meta.env.VITE_MANIFEST_API_BASE ||
    (typeof window !== "undefined" && window.location?.origin?.includes("127.0.0.1")
      ? "http://127.0.0.1:3000"
      : "https://saas-mvp-funnel-production.up.railway.app");

  void fetch(`${base}/api/crm/catalog/${encodeURIComponent(clientId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CRM-Secret": token,
      "x-crm-leads-token": token,
    },
    body: JSON.stringify({ items }),
  }).catch(() => {
    /* best-effort */
  });
}

/** Load shared catalog into CRM when local services are empty (paid purge / fresh tenant). */
export async function hydrateCrmCatalogFromApi(clientId, options = {}) {
  if (!clientId || typeof window === "undefined") return [];
  const base =
    options.apiBase ||
    import.meta.env.VITE_MANIFEST_API_BASE ||
    (window.location?.origin?.includes("127.0.0.1")
      ? "http://127.0.0.1:3000"
      : "https://saas-mvp-funnel-production.up.railway.app");
  try {
    const res = await fetch(
      `${base}/api/crm/catalog/${encodeURIComponent(clientId)}?lang=${options.lang || "en"}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}
