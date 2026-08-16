"use client";

import type { CSSProperties } from "react";

type DemoTenantLinksBarProps = {
  publicSiteUrl: string;
  language?: string;
};

const COPY = {
  en: {
    vacancies: "Vacancies",
    booking: "Leads / Booking",
  },
  de: {
    vacancies: "Stellen",
    booking: "Anfragen / Buchung",
  },
  ru: {
    vacancies: "Вакансии",
    booking: "Заявки / Бронирование",
  },
} as const;

function normalizeLang(language: string | undefined): keyof typeof COPY {
  const lang = (language || "de").toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("en")) return "en";
  return "de";
}

const yellowBtnStyle: CSSProperties = {
  background: "#f59e0b",
  color: "#ffffff",
  fontWeight: 700,
  border: 0,
  borderRadius: 10,
  padding: "0.45rem 0.9rem",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "inherit",
  fontSize: "0.82rem",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
};

/** Persistent Railway chrome: site deep-links for existing tenants (no CF redeploy needed). */
export function DemoTenantLinksBar({
  publicSiteUrl,
  language,
}: DemoTenantLinksBarProps) {
  const t = COPY[normalizeLang(language)];
  const siteBase = String(publicSiteUrl || "").replace(/\/$/, "").replace(/#.*$/, "");
  const vacanciesHref = siteBase ? `${siteBase}/job` : "";
  const bookingHref = siteBase ? `${siteBase}/booking` : "";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2147483645,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.65rem 1rem",
        padding: "0.55rem 0.85rem",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        fontSize: "0.82rem",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
        {vacanciesHref ? (
          <a href={vacanciesHref} target="_blank" rel="noreferrer" style={yellowBtnStyle}>
            {t.vacancies}
          </a>
        ) : (
          <button type="button" disabled style={{ ...yellowBtnStyle, opacity: 0.5, cursor: "not-allowed" }}>
            {t.vacancies}
          </button>
        )}
        {bookingHref ? (
          <a href={bookingHref} target="_blank" rel="noreferrer" style={yellowBtnStyle}>
            {t.booking}
          </a>
        ) : (
          <button type="button" disabled style={{ ...yellowBtnStyle, opacity: 0.5, cursor: "not-allowed" }}>
            {t.booking}
          </button>
        )}
      </div>
    </div>
  );
}
