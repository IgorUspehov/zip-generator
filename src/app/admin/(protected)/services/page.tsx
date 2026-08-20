"use client";

import { useEffect, useState } from "react";

import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { CatalogItem } from "@/lib/catalog/resolve-catalog";

type Row = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

function toRows(items: CatalogItem[]): Row[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name.de || item.name.en || item.name.ru,
    price: item.price || "",
    duration:
      typeof item.duration === "string"
        ? item.duration
        : item.duration
          ? item.duration.de || item.duration.en || item.duration.ru
          : "",
  }));
}

export default function AdminServicesPage() {
  const { copy } = useAdminI18n();
  const { data } = useAdminSite();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/catalog", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const json = (await response.json()) as { ok?: boolean; items?: CatalogItem[]; error?: string };
      if (!response.ok || !json.ok) {
        setSaveError(json.error || copy.loadFailed);
        return;
      }
      setRows(toRows(json.items || []));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(nextRows: Row[]) {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const items = nextRows.map((row) => ({
        id: row.id,
        name: { en: row.name, de: row.name, ru: row.name },
        price: row.price,
        duration: row.duration,
      }));
      const response = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ items }),
      });
      const json = (await response.json()) as { ok?: boolean; items?: CatalogItem[]; error?: string };
      if (!response.ok || !json.ok) {
        setSaveError(json.error || copy.saveFailed);
        return;
      }
      setRows(json.items ? toRows(json.items) : nextRows);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <AdminPageShell
      title={copy.services.title}
      description={copy.services.description}
      businessName={data?.content.businessName}
    >
      {loading ? <p className="admin-muted">{copy.loading}</p> : null}
      <AdminSaveFeedback
        saved={saved}
        error={saveError}
        siteUrl={data?.publicSiteUrl || (data?.slug ? `/site/${data.slug}` : null)}
        savedLabel={copy.saved}
        viewSiteLabel={copy.viewSite}
      />
      <div className="admin-card admin-stack">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <h2 className="admin-card-title" style={{ margin: 0 }}>
            {copy.services.catalog}
          </h2>
          <button
            type="button"
            className="admin-btn-outline"
            disabled={saving}
            onClick={() =>
              setRows((current) => [
                ...current,
                {
                  id: `svc-${Date.now()}`,
                  name: "",
                  price: "",
                  duration: "",
                },
              ])
            }
          >
            {copy.services.add}
          </button>
        </div>
        {rows.map((row, index) => (
          <div key={row.id} className="admin-service-row">
            <input
              className="admin-input"
              placeholder={copy.services.name}
              value={row.name}
              onChange={(event) => updateRow(index, { name: event.target.value })}
            />
            <input
              className="admin-input"
              placeholder={copy.services.price}
              value={row.price}
              onChange={(event) => updateRow(index, { price: event.target.value })}
            />
            <input
              className="admin-input"
              placeholder={copy.services.duration}
              value={row.duration}
              onChange={(event) => updateRow(index, { duration: event.target.value })}
            />
            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
            >
              {copy.services.remove}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn-primary"
          disabled={saving || loading}
          onClick={() => void save(rows)}
        >
          {saving ? copy.saving : copy.save}
        </button>
      </div>
    </AdminPageShell>
  );
}
