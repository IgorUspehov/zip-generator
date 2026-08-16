"use client";

import { useSearchParams } from "next/navigation";

import { TenantReadyLinks } from "@/components/tenant-ready-links";
import "@/client-wizard/styles.css";

/**
 * Visual QA surface for the dual-link ready screen (same component as /client s6).
 * Example: /ready-preview?site=https://…/site/slug&crm=https://…/demo/slug?clientId=…
 */
export function ReadyPreviewClient() {
  const params = useSearchParams();
  const site =
    params?.get("site")?.trim() ||
    "https://saas-mvp-funnel-production.up.railway.app/site/example-slug";
  const crm =
    params?.get("crm")?.trim() ||
    "https://saas-mvp-funnel-production.up.railway.app/demo/example-slug?clientId=00000000-0000-0000-0000-000000000000";
  const name = params?.get("name")?.trim() || "Demo Business";

  return (
    <main className="mf-root" data-step="s6" style={{ minHeight: "100svh", padding: "2rem 1rem" }}>
      <div className="build-wrap wizard-ready-wrap" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="step-h" style={{ textAlign: "center" }}>
          Ваш Сайт + CRM + Бронирование готов
        </div>
        <div className="step-sub" style={{ textAlign: "center", marginBottom: 0 }}>
          {name}
        </div>
        <TenantReadyLinks
          publicSiteUrl={site}
          crmUrl={crm}
          copy={{
            publicSiteLabel: "Ваш сайт для клиентов",
            publicSiteHint: "Эту ссылку размещайте в Google Maps, Instagram или на визитке.",
            crmLabel: "Вход в вашу CRM",
            crmHint: "Личная админ-панель для вас — не для ваших клиентов.",
            copyLink: "Копировать ссылку",
            copied: "Скопировано!",
            openJobs: "Вакансии",
            openBooking: "Заявки / Бронирование",
            openCrm: "Открыть CRM",
          }}
        />
      </div>
    </main>
  );
}
