"use client";

import { useState } from "react";

import "@/client-wizard/styles.css";

export type TenantReadyLinksCopy = {
  publicSiteLabel: string;
  publicSiteHint: string;
  crmLabel: string;
  crmHint: string;
  copyLink: string;
  copied: string;
  openPublicSite: string;
  openCrm: string;
};

type TenantReadyLinksProps = {
  publicSiteUrl: string;
  crmUrl: string;
  copy: TenantReadyLinksCopy;
  /** Optional countdown text shown instead of open CRM while publishing. */
  publishingText?: string | null;
  className?: string;
};

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function LinkBlock({
  label,
  hint,
  url,
  copyLabel,
  copiedLabel,
  openLabel,
  openHref,
  openDisabled,
}: {
  label: string;
  hint: string;
  url: string;
  copyLabel: string;
  copiedLabel: string;
  openLabel: string;
  openHref?: string;
  openDisabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="tenant-ready-link-block">
      <div className="tenant-ready-link-label">{label}</div>
      <p className="tenant-ready-link-hint">{hint}</p>
      <input type="text" readOnly className="wizard-ready-url" value={url} aria-label={label} />
      <div className="tenant-ready-link-actions">
        <button
          type="button"
          className="wizard-ready-copy"
          onClick={() => {
            void copyText(url).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
        {openHref && !openDisabled ? (
          <a href={openHref} target="_blank" rel="noreferrer" className="btn-primary wizard-ready-open">
            {openLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

/** Two equal, labeled share links: public /site/{slug} + CRM /demo/{slug}?clientId=… */
export function TenantReadyLinks({
  publicSiteUrl,
  crmUrl,
  copy,
  publishingText,
  className,
}: TenantReadyLinksProps) {
  return (
    <div className={className ? `tenant-ready-links ${className}` : "tenant-ready-links"}>
      <LinkBlock
        label={copy.publicSiteLabel}
        hint={copy.publicSiteHint}
        url={publicSiteUrl}
        copyLabel={copy.copyLink}
        copiedLabel={copy.copied}
        openLabel={copy.openPublicSite}
        openHref={publicSiteUrl}
      />
      <LinkBlock
        label={copy.crmLabel}
        hint={copy.crmHint}
        url={crmUrl}
        copyLabel={copy.copyLink}
        copiedLabel={copy.copied}
        openLabel={copy.openCrm}
        openHref={publishingText ? undefined : crmUrl}
        openDisabled={Boolean(publishingText)}
      />
      {publishingText ? <p className="step-sub wizard-ready-countdown">{publishingText}</p> : null}
    </div>
  );
}
