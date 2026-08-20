"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import type {
  OwnerIntegrationId,
  OwnerIntegrationInfo,
  OwnerIntegrationStatus,
} from "@/lib/owner/integrations";

type IntegrationsResponse = {
  ok: boolean;
  clientId?: string;
  distReady?: boolean;
  integrations?: OwnerIntegrationInfo[];
  error?: string;
};

type ZipDownloadState = "ready" | "loading" | "error";

function statusLabel(
  status: OwnerIntegrationStatus,
  copy: ReturnType<typeof useAdminI18n>["copy"]["integrations"],
): string {
  switch (status) {
    case "ready":
      return copy.statusReady;
    case "coming_soon":
      return copy.statusComingSoon;
    case "not_configured":
      return copy.statusNotConfigured;
    case "platform":
      return copy.statusPlatform;
    default:
      return copy.statusComingSoon;
  }
}

function statusBadgeClass(status: OwnerIntegrationStatus): string {
  if (status === "ready") return "admin-badge";
  if (status === "platform") return "admin-badge admin-badge-platform";
  return "admin-badge admin-badge-muted";
}

function itemCopy(
  id: OwnerIntegrationId,
  copy: ReturnType<typeof useAdminI18n>["copy"]["integrations"],
): { title: string; description: string } {
  return copy.items[id];
}

export default function AdminIntegrationsPage() {
  const { copy } = useAdminI18n();
  const { data, loading, error } = useAdminSite();
  const [integrations, setIntegrations] = useState<OwnerIntegrationInfo[]>([]);
  const [distReady, setDistReady] = useState<boolean | null>(null);
  const [statusError, setStatusError] = useState("");
  const [zipState, setZipState] = useState<ZipDownloadState>("ready");
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
      setIntegrations(json.integrations || []);
      setDistReady(Boolean(json.distReady));
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : copy.loadFailed);
    }
  }, [copy.loadFailed]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function downloadOwnerZip() {
    setZipState("loading");
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
        setZipState("error");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/i);
      const filename = match?.[1] || "deployable-owner-site.zip";

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);

      setZipState("ready");
      await loadStatus();
    } catch (err) {
      setZipError(err instanceof Error ? err.message : copy.integrations.downloadZipError);
      setZipState("error");
    }
  }

  return (
    <AdminPageShell
      title={copy.integrations.title}
      description={copy.integrations.description}
      businessName={data?.content.businessName}
    >
      {loading ? <p className="admin-muted">{copy.loading}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {statusError ? <p className="admin-error">{statusError}</p> : null}

      {distReady !== null ? (
        <p className="admin-muted" style={{ marginTop: 0 }}>
          {distReady ? copy.integrations.distReady : copy.integrations.distMissing}
          {data?.clientId ? ` · ${data.clientId}` : null}
        </p>
      ) : null}

      <div className="admin-integrations-grid">
        {integrations.map((item) => {
          const labels = itemCopy(item.id, copy.integrations);
          const isZip = item.id === "zip";

          return (
            <div key={item.id} className="admin-card admin-integration-card">
              <div className="admin-integration-card-head">
                <h2 className="admin-card-title">{labels.title}</h2>
                <span className={statusBadgeClass(item.status)}>
                  {statusLabel(item.status, copy.integrations)}
                </span>
              </div>
              <p className="admin-muted" style={{ margin: "0 0 0.75rem" }}>
                {labels.description}
              </p>

              {isZip && item.actionable ? (
                <div className="admin-stack">
                  <button
                    type="button"
                    className="admin-btn-primary"
                    disabled={zipState === "loading" || distReady === false}
                    onClick={() => void downloadOwnerZip()}
                  >
                    {zipState === "loading"
                      ? copy.integrations.downloadZipLoading
                      : copy.integrations.downloadZip}
                  </button>
                  {zipError ? <p className="admin-error">{zipError}</p> : null}
                  {distReady === false ? (
                    <p className="admin-muted">{copy.integrations.downloadZipDistMissing}</p>
                  ) : null}
                </div>
              ) : (
                <p className="admin-muted" style={{ margin: 0, fontSize: "0.8rem" }}>
                  {item.note || statusLabel(item.status, copy.integrations)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AdminPageShell>
  );
}
