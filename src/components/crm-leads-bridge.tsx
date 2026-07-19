"use client";

import { useEffect } from "react";

type CrmLeadsBridgeProps = {
  clientId: string;
  slug?: string;
  shortId?: string;
  iframeTitle: string;
};

/**
 * Railway parent → polls session-bound leads (secret stays on server) → postMessage into CRM iframe.
 */
export function CrmLeadsBridge({ clientId, slug, shortId, iframeTitle }: CrmLeadsBridgeProps) {
  useEffect(() => {
    if (!clientId) return undefined;
    let cancelled = false;

    const iframe = () =>
      document.querySelector(`iframe[title="${CSS.escape(iframeTitle)}"]`) as
        | HTMLIFrameElement
        | null;

    const push = async () => {
      try {
        await fetch("/api/crm/leads/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, slug, shortId }),
        });
        const res = await fetch("/api/crm/leads/session", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const frame = iframe();
        frame?.contentWindow?.postMessage(
          {
            type: "SITE_LEADS_SYNC",
            clientId,
            clients: data.clients || [],
            appointments: data.appointments || [],
            orders: data.orders || [],
          },
          "*",
        );
      } catch {
        /* ignore */
      }
    };

    void push();
    const id = window.setInterval(() => {
      void push();
    }, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [clientId, slug, shortId, iframeTitle]);

  return null;
}
