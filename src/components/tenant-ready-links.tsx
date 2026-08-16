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
  openJobs: string;
  openBooking: string;
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

function joinSitePath(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function LinkBlock({
  label,
  hint,
  url,
  copyLabel,
  copiedLabel,
  openLinks,
}: {
  label: string;
  hint: string;
  url: string;
  copyLabel: string;
  copiedLabel: string;
  openLinks?: Array<{ label: string; href: string }>;
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
        {openLinks?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="btn-primary wizard-ready-open"
          >
            {link.label}
          </a>
        ))}
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
        openLinks={[
          { label: copy.openJobs, href: joinSitePath(publicSiteUrl, "/job") },
          { label: copy.openBooking, href: joinSitePath(publicSiteUrl, "/booking") },
        ]}
      />
      <LinkBlock
        label={copy.crmLabel}
        hint={copy.crmHint}
        url={crmUrl}
        copyLabel={copy.copyLink}
        copiedLabel={copy.copied}
        openLinks={
          publishingText ? undefined : [{ label: copy.openCrm, href: crmUrl }]
        }
      />
      {publishingText ? <p className="step-sub wizard-ready-countdown">{publishingText}</p> : null}
    </div>
  );
}
