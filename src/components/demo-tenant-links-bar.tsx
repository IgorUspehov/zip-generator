"use client";

import { useEffect, useState, type CSSProperties } from "react";

type DemoTenantLinksBarProps = {
  publicSiteUrl: string;
  language?: string;
};

const COPY = {
  en: {
    vacancies: "Vacancies",
    booking: "Leads / Booking",
    copy: "Copy",
    copied: "Copied",
    missing: "Link not ready",
  },
  de: {
    vacancies: "Stellen",
    booking: "Anfragen / Buchung",
    copy: "Kopieren",
    copied: "Kopiert",
    missing: "Link noch nicht bereit",
  },
  ru: {
    vacancies: "Вакансии",
    booking: "Заявки / Бронирование",
    copy: "Копировать",
    copied: "Скопировано",
    missing: "Ссылка пока недоступна",
  },
} as const;

function normalizeLang(language: string | undefined): keyof typeof COPY {
  const lang = (language || "de").toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("en")) return "en";
  return "de";
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

const rowStyle: CSSProperties = {
  display: "flex",
  flex: "1 1 18rem",
  alignItems: "center",
  gap: "0.45rem",
  minWidth: 0,
};

const labelStyle: CSSProperties = {
  flexShrink: 0,
  fontWeight: 700,
  color: "#f8fafc",
  whiteSpace: "nowrap",
};

const urlInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: "1px solid #334155",
  borderRadius: 8,
  background: "#1e293b",
  color: "#e2e8f0",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.75rem",
  padding: "0.35rem 0.55rem",
  outline: "none",
};

const copyBtnStyle: CSSProperties = {
  flexShrink: 0,
  border: "1px solid #ea580c",
  borderRadius: 8,
  background: "#f97316",
  color: "#111827",
  fontWeight: 700,
  fontSize: "0.75rem",
  padding: "0.35rem 0.65rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

function CopyableFormLink({
  label,
  href,
  copyLabel,
  copiedLabel,
  missingLabel,
}: {
  label: string;
  href: string;
  copyLabel: string;
  copiedLabel: string;
  missingLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div style={rowStyle}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{ ...copyBtnStyle, textDecoration: "none" }}
        >
          {label}
        </a>
      ) : (
        <span style={labelStyle}>{label}</span>
      )}
      {href ? (
        <input
          type="text"
          readOnly
          value={href}
          aria-label={label}
          onFocus={(event) => event.currentTarget.select()}
          onClick={(event) => event.currentTarget.select()}
          style={urlInputStyle}
        />
      ) : (
        <span style={{ ...urlInputStyle, border: 0, background: "transparent", color: "#94a3b8" }}>
          {missingLabel}
        </span>
      )}
      <button
        type="button"
        disabled={!href}
        style={{ ...copyBtnStyle, opacity: href ? 1 : 0.45, cursor: href ? "pointer" : "not-allowed" }}
        onClick={() => {
          if (!href) return;
          void copyText(href).then((ok) => {
            if (!ok) return;
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

/** Shareable form URLs for paid demos (copy instead of orange CTA buttons). */
export function DemoTenantLinksBar({
  publicSiteUrl,
  language,
}: DemoTenantLinksBarProps) {
  const [lang, setLang] = useState(() => normalizeLang(language));
  const t = COPY[lang];
  const siteBase = String(publicSiteUrl || "").replace(/\/$/, "").replace(/#.*$/, "");
  const vacanciesHref = siteBase ? `${siteBase}/job` : "";
  const bookingHref = siteBase ? `${siteBase}/booking` : "";

  useEffect(() => {
    setLang(normalizeLang(language));
  }, [language]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if ((data as { type?: string }).type !== "crm-demo-language") return;
      const next = (data as { language?: string }).language;
      if (typeof next !== "string") return;
      setLang(normalizeLang(next));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.65rem 1.25rem",
        padding: "0.55rem 0.85rem",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        fontSize: "0.82rem",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <CopyableFormLink
        label={t.vacancies}
        href={vacanciesHref}
        copyLabel={t.copy}
        copiedLabel={t.copied}
        missingLabel={t.missing}
      />
      <CopyableFormLink
        label={t.booking}
        href={bookingHref}
        copyLabel={t.copy}
        copiedLabel={t.copied}
        missingLabel={t.missing}
      />
    </div>
  );
}
