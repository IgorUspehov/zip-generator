"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { OWNER_PLATFORM_LINKS } from "@/lib/owner/integrations";

type IntegrationsResponse = {
  ok: boolean;
  clientId?: string;
  distReady?: boolean;
  zipUnlocked?: boolean;
  email?: string;
  error?: string;
};

type ZipDownloadState = "ready" | "loading" | "error";

export default function AdminIntegrationsPage() {
  const { copy } = useAdminI18n();
  const { data, loading, error } = useAdminSite();
  const [distReady, setDistReady] = useState<boolean | null>(null);
  const [statusError, setStatusError] = useState("");
  const [zipState, setZipDownloadState] = useState<ZipDownloadState>("ready");
  const [zipError, setZipError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/owner/integrations", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const json = (await response.json()) as IntegrationsResponse;
      if (!response.ok || !json.ok) {
        setStatusError(json.error || copy.loadFailed);
        return;
      }
      setStatusError("");
      setDistReady(Boolean(json.distReady));
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : copy.loadFailed);
    }
  }, [copy.loadFailed]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function downloadOwnerZip() {
    setZipDownloadState("loading");
    setZipError("");
    try {
      const response = await fetch("/api/owner/deployable-zip", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        let message = copy.integrations.downloadZipError;
        try {
          const json = (await response.json()) as { error?: string; code?: string };
          if (json.code === "DIST_MISSING") {
            message = copy.integrations.downloadZipDistMissing;
          } else if (json.error) {
            message = json.error;
          }
        } catch {
          /* non-JSON error body */
        }
        setZipError(message);
        setZipDownloadState("error");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/i);
      const filename = match?.[1] || "deployable-site.zip";

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);

      setZipDownloadState("ready");
      await loadStatus();
    } catch (err) {
      setZipError(err instanceof Error ? err.message : copy.integrations.downloadZipError);
      setZipDownloadState("error");
    }
  }

  const zipBusy = zipState === "loading";

  return (
    <AdminPageShell
      title={copy.integrations.title}
      description={copy.integrations.description}
      businessName={data?.content.businessName}
    >
      {loading ? <p className="admin-muted">{copy.loading}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {statusError ? <p className="admin-error">{statusError}</p> : null}

      <div className="admin-delivery-card">
        <div className="admin-delivery-card-head">
          <h2 className="admin-delivery-card-title">{copy.integrations.readyTitle}</h2>
        </div>

        <ul className="admin-delivery-list">
          <li>
            <button
              type="button"
              className="admin-delivery-row admin-delivery-row--primary"
              disabled={zipBusy || distReady === false}
              onClick={() => void downloadOwnerZip()}
            >
              <span className="admin-delivery-icon" aria-hidden>
                📦
              </span>
              <span className="admin-delivery-label">
                {zipState === "loading"
                  ? copy.integrations.downloadZipLoading
                  : copy.integrations.downloadZip}
              </span>
            </button>
          </li>

          {OWNER_PLATFORM_LINKS.map((platform) => (
            <li key={platform.id}>
              <a
                className="admin-delivery-row"
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="admin-delivery-icon" aria-hidden>
                  {platform.icon}
                </span>
                <span className="admin-delivery-label">{platform.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {zipError ? <p className="admin-error admin-delivery-msg">{zipError}</p> : null}
        {distReady === false ? (
          <p className="admin-muted admin-delivery-msg">
            {copy.integrations.downloadZipDistMissing}
          </p>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
