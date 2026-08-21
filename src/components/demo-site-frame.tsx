"use client";

import { useEffect, useState, type ReactNode } from "react";

type DemoSiteFrameProps = {
  clientId: string;
  language?: string;
  iframeSrc: string;
  iframeTitle: string;
  paidBar?: ReactNode;
};

const REVEAL_FALLBACK_MS = 2500;

/**
 * CRM wrapper chrome (tenant links) for /demo and /d visits.
 * When the same URL is iframed (e.g. preview embeds), hide chrome.
 */
export function DemoSiteFrame({
  iframeSrc,
  iframeTitle,
  paidBar,
}: DemoSiteFrameProps) {
  const [framed, setFramed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setFramed(window.self !== window.top);
  }, []);

  useEffect(() => {
    setRevealed(false);
  }, [iframeSrc]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if ((data as { type?: string }).type === "crm-demo-ready") {
        setRevealed(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const timer = window.setTimeout(() => setRevealed(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [revealed, iframeSrc]);

  const showPaidBar = Boolean(paidBar) && !framed;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
      }}
    >
      {showPaidBar ? paidBar : null}
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <iframe
          title={iframeTitle}
          src={iframeSrc}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            margin: 0,
            padding: 0,
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.35s ease-out",
            background: "#0f172a",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
          allow="clipboard-write"
        />
        <div
          aria-hidden={revealed}
          style={{
            pointerEvents: revealed ? "none" : "auto",
            position: "absolute",
            inset: 0,
            background: "#0f172a",
            opacity: revealed ? 0 : 1,
            transition: "opacity 0.35s ease-out",
          }}
        />
      </div>
    </div>
  );
}
