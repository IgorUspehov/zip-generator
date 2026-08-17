"use client";

import { useEffect, useState, type ReactNode } from "react";

import { DemoUnpaidBanner } from "@/components/demo-unpaid-banner";

type DemoSiteFrameProps = {
  unpaid: boolean;
  clientId: string;
  checkoutUrl: string;
  language?: string;
  iframeSrc: string;
  iframeTitle: string;
  paidBar?: ReactNode;
};

/**
 * Demo wrapper chrome (paywall banner / tenant links) belongs on a top-level
 * /demo or /d visit. When the same URL is iframed on /pay, hide it so the
 * preview is the actual site — /pay already has plan + promo actions.
 */
export function DemoSiteFrame({
  unpaid,
  clientId,
  checkoutUrl,
  language,
  iframeSrc,
  iframeTitle,
  paidBar,
}: DemoSiteFrameProps) {
  const [framed, setFramed] = useState(true);

  useEffect(() => {
    setFramed(window.self !== window.top);
  }, []);

  const showUnpaidBanner = unpaid && !framed;
  const showPaidBar = Boolean(paidBar) && !unpaid && !framed;

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
      {showUnpaidBanner ? (
        <DemoUnpaidBanner clientId={clientId} checkoutUrl={checkoutUrl} language={language} />
      ) : null}
      {showPaidBar ? paidBar : null}
      <iframe
        title={iframeTitle}
        src={iframeSrc}
        style={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          border: 0,
          margin: 0,
          padding: 0,
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
        allow="clipboard-write"
      />
    </div>
  );
}
