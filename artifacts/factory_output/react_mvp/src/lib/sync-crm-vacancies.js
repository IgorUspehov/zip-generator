/**
 * CRM vacancies ↔ shared Firestore vacancies/{clientId}/items.
 * Prefer parent Railway bridge (session cookie); fallback to token header.
 */

function apiBase(options = {}) {
  return (
    options.apiBase ||
    import.meta.env.VITE_MANIFEST_API_BASE ||
    (typeof window !== "undefined" && window.location?.origin?.includes("127.0.0.1")
      ? "http://127.0.0.1:3000"
      : "https://webstudio-muenchen.com")
  );
}

function leadsToken() {
  return typeof window !== "undefined" &&
    typeof window.__CRM_LEADS_READ_SECRET__ === "string"
    ? window.__CRM_LEADS_READ_SECRET__
    : "";
}

export async function fetchCrmVacancies(clientId, options = {}) {
  if (!clientId || typeof window === "undefined") return [];
  try {
    const res = await fetch(
      `${apiBase(options)}/api/crm/vacancies/${encodeURIComponent(clientId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function createCrmVacancy(clientId, payload, options = {}) {
  if (!clientId || typeof window === "undefined") return null;

  if (window.parent && window.parent !== window) {
    return new Promise((resolve) => {
      const requestId = `vac-create-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const onMessage = (event) => {
        const data = event?.data;
        if (!data || data.type !== "CRM_VACANCY_RESULT") return;
        if (data.requestId !== requestId) return;
        window.removeEventListener("message", onMessage);
        resolve(data.ok ? data.item || true : null);
      };
      window.addEventListener("message", onMessage);
      window.parent.postMessage(
        {
          type: "CRM_VACANCY_CREATE",
          requestId,
          clientId,
          ...payload,
        },
        "*",
      );
      window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(null);
      }, 12000);
    });
  }

  const token = leadsToken();
  if (!token) return null;
  try {
    const res = await fetch(
      `${apiBase(options)}/api/crm/vacancies/${encodeURIComponent(clientId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Secret": token,
          "x-crm-leads-token": token,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.item || null;
  } catch {
    return null;
  }
}

export async function deleteCrmVacancy(clientId, vacancyId, options = {}) {
  if (!clientId || !vacancyId || typeof window === "undefined") return false;

  if (window.parent && window.parent !== window) {
    return new Promise((resolve) => {
      const requestId = `vac-del-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const onMessage = (event) => {
        const data = event?.data;
        if (!data || data.type !== "CRM_VACANCY_RESULT") return;
        if (data.requestId !== requestId) return;
        window.removeEventListener("message", onMessage);
        resolve(Boolean(data.ok));
      };
      window.addEventListener("message", onMessage);
      window.parent.postMessage(
        {
          type: "CRM_VACANCY_DELETE",
          requestId,
          clientId,
          id: vacancyId,
        },
        "*",
      );
      window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(false);
      }, 12000);
    });
  }

  const token = leadsToken();
  if (!token) return false;
  try {
    const res = await fetch(
      `${apiBase(options)}/api/crm/vacancies/${encodeURIComponent(clientId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CRM-Secret": token,
          "x-crm-leads-token": token,
        },
        body: JSON.stringify({ id: vacancyId }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
