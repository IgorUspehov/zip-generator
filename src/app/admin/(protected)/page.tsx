"use client";

import Link from "next/link";

import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";

export default function AdminHomePage() {
  const { copy } = useAdminI18n();
  const { data, loading, error } = useAdminSite();

  return (
    <AdminPageShell
      title={copy.overview.title}
      description={copy.overview.description}
      businessName={data?.content.businessName}
    >
      {loading ? <p className="admin-muted">{copy.loading}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {data ? (
        <div className="admin-grid-2">
          <div className="admin-card">
            <h2 className="admin-card-title">{data.content.businessName || "Website"}</h2>
            <div className="admin-stack" style={{ fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="admin-muted">{copy.overview.status}</span>
                <span className={data.paid ? "admin-badge" : "admin-badge admin-badge-muted"}>
                  {data.paid ? copy.overview.paid : copy.overview.demo}
                </span>
              </div>
              {data.publicSiteUrl ? (
                <p style={{ margin: 0 }}>
                  {copy.overview.publicSite}{" "}
                  <Link className="admin-link" href={data.publicSiteUrl} target="_blank">
                    {data.publicSiteUrl}
                  </Link>
                </p>
              ) : (
                <p className="admin-muted" style={{ margin: 0 }}>
                  {copy.overview.publicSiteMissing}
                </p>
              )}
              {data.crmUrl ? (
                <p style={{ margin: 0 }}>
                  {copy.overview.crm}{" "}
                  <Link className="admin-link" href={data.crmUrl} target="_blank">
                    {data.crmUrl}
                  </Link>
                </p>
              ) : null}
              <a className="admin-btn-primary admin-btn-inline" href="/admin/integrations">
                {copy.overview.openIntegrations}
              </a>
            </div>
          </div>
          <div className="admin-card">
            <h2 className="admin-card-title">{copy.overview.sections}</h2>
            <div className="admin-stack" style={{ fontSize: "0.9rem" }}>
              <Link className="admin-link" href="/admin/content">
                {copy.nav.content}
              </Link>
              <Link className="admin-link" href="/admin/media">
                {copy.nav.media}
              </Link>
              <Link className="admin-link" href="/admin/services">
                {copy.nav.services}
              </Link>
              <Link className="admin-link" href="/admin/jobs">
                {copy.nav.jobs}
              </Link>
              <Link className="admin-link" href="/admin/contacts">
                {copy.nav.contacts}
              </Link>
              <Link className="admin-link" href="/admin/integrations">
                {copy.nav.integrations}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPageShell>
  );
}
