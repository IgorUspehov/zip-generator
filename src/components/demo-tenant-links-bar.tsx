"use client";

import { useState } from "react";

type DemoTenantLinksBarProps = {
  publicSiteUrl: string;
  crmUrl: string;
  language?: string;
};

const COPY = {
  en: {
    site: "Customer site",
    crm: "CRM login",
    copy: "Copy",
    copied: "Copied",
  },
  de: {
    site: "Kundenwebsite",
    crm: "CRM-Zugang",
    copy: "Kopieren",
    copied: "Kopiert",
  },
  ru: {
    site: "Сайт для клиентов",
    crm: "Вход в CRM",
    copy: "Копировать",
    copied: "Скопировано",
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

/** Persistent Railway chrome: both share links for existing tenants (no CF redeploy needed). */
export function DemoTenantLinksBar({
  publicSiteUrl,
  crmUrl,
  language,
}: DemoTenantLinksBarProps) {
  const t = COPY[normalizeLang(language)];
  const [copiedKey, setCopiedKey] = useState<"site" | "crm" | null>(null);

  const onCopy = (key: "site" | "crm", value: string) => {
    void copyText(value).then((ok) => {
      if (!ok) return;
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    });
  };

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
      <span style={{ fontWeight: 700, color: "#f8fafc" }}>{t.site}</span>
      <code
        style={{
          maxWidth: "min(42vw, 280px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          background: "#1e293b",
          padding: "0.25rem 0.5rem",
          borderRadius: 6,
        }}
        title={publicSiteUrl}
      >
        {publicSiteUrl}
      </code>
      <button
        type="button"
        onClick={() => onCopy("site", publicSiteUrl)}
        style={{
          background: "#22c55e",
          color: "#052e16",
          fontWeight: 700,
          border: 0,
          borderRadius: 999,
          padding: "0.3rem 0.75rem",
          cursor: "pointer",
        }}
      >
        {copiedKey === "site" ? t.copied : t.copy}
      </button>
      <span style={{ opacity: 0.35 }}>|</span>
      <span style={{ fontWeight: 700, color: "#f8fafc" }}>{t.crm}</span>
      <button
        type="button"
        onClick={() => onCopy("crm", crmUrl)}
        style={{
          background: "#e2e8f0",
          color: "#0f172a",
          fontWeight: 700,
          border: 0,
          borderRadius: 999,
          padding: "0.3rem 0.75rem",
          cursor: "pointer",
        }}
      >
        {copiedKey === "crm" ? t.copied : t.copy}
      </button>
    </div>
  );
}
