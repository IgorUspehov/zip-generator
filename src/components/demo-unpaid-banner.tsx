import { buildCrmDemoCheckoutUrl } from "@/lib/cloudflare/demo-access";

type DemoUnpaidBannerProps = {
  clientId: string;
  language?: string;
};

function copyFor(language: string | undefined) {
  const lang = (language || "de").toLowerCase();
  if (lang.startsWith("ru")) {
    return {
      text: "Демо-версия. Оплатите €99, чтобы убрать ограничение и сохранить сайт.",
      cta: "Оплатить €99",
    };
  }
  if (lang.startsWith("en")) {
    return {
      text: "Demo version. Pay €99 to remove limits and keep your site.",
      cta: "Pay €99",
    };
  }
  return {
    text: "Demo-Version. Zahlen Sie €99, um die Einschränkung zu entfernen und die Website zu behalten.",
    cta: "€99 bezahlen",
  };
}

/** Top bar for unpaid CRM demos on Railway /demo and /d routes. */
export function DemoUnpaidBanner({ clientId, language }: DemoUnpaidBannerProps) {
  const copy = copyFor(language);
  const href = buildCrmDemoCheckoutUrl(clientId);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2147483646,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0.75rem",
        padding: "0.65rem 1rem",
        background: "linear-gradient(90deg, #0f172a 0%, #1e3a5f 100%)",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
        fontSize: "0.9rem",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.35)",
      }}
    >
      <span style={{ textAlign: "center", maxWidth: "42rem" }}>{copy.text}</span>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{
          background: "#22c55e",
          color: "#052e16",
          fontWeight: 700,
          textDecoration: "none",
          borderRadius: "999px",
          padding: "0.4rem 1rem",
          whiteSpace: "nowrap",
        }}
      >
        {copy.cta}
      </a>
    </div>
  );
}
