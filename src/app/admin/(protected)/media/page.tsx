"use client";

import { useState } from "react";

import { useAdminI18n } from "@/components/admin/admin-i18n";
import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";

async function uploadSlot(slot: "logo" | "hero" | "gallery", file: File) {
  const body = new FormData();
  body.set("slot", slot);
  body.set("file", file);
  const response = await fetch("/api/admin/media", {
    method: "POST",
    body,
    credentials: "same-origin",
  });
  const json = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !json.ok) {
    throw new Error(json.error || "Upload failed");
  }
}

export default function AdminMediaPage() {
  const { copy } = useAdminI18n();
  const { data, loading, error, reload } = useAdminSite();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleUpload(slot: "logo" | "hero" | "gallery", file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setSaved(false);
    setSaveError("");
    try {
      await uploadSlot(slot, file);
      setSaved(true);
      await reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : copy.media.uploadFailed);
    } finally {
      setBusy(false);
    }
  }

  async function remove(slot: "logo" | "hero" | "gallery", url?: string) {
    setBusy(true);
    setSaved(false);
    setSaveError("");
    try {
      const params = new URLSearchParams({ slot });
      if (url) params.set("url", url);
      const response = await fetch(`/api/admin/media?${params.toString()}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || copy.media.deleteFailed);
      setSaved(true);
      await reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : copy.media.deleteFailed);
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!data) return;
    const gallery = [...data.content.galleryPhotos];
    const next = index + direction;
    if (next < 0 || next >= gallery.length) return;
    const [item] = gallery.splice(index, 1);
    gallery.splice(next, 0, item!);
    setBusy(true);
    setSaved(false);
    setSaveError("");
    try {
      const response = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ galleryPhotos: gallery }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        setSaveError(json.error || copy.saveFailed);
        return;
      }
      setSaved(true);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  const content = data?.content;

  return (
    <AdminPageShell
      title={copy.media.title}
      description={copy.media.description}
      businessName={data?.content.businessName}
    >
      {loading ? <p className="admin-muted">{copy.loading}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <AdminSaveFeedback
        saved={saved}
        error={saveError}
        siteUrl={data?.publicSiteUrl || (data?.slug ? `/site/${data.slug}` : null)}
        savedLabel={copy.saved}
        viewSiteLabel={copy.viewSite}
      />

      <div className="admin-grid-2">
        <div className="admin-card admin-stack">
          <h2 className="admin-card-title">{copy.media.logo}</h2>
          {content?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.logo} alt="" className="admin-media-logo" />
          ) : (
            <p className="admin-muted">{copy.media.noLogo}</p>
          )}
          <label className="admin-label" htmlFor="logo">
            {copy.media.chooseFile}
          </label>
          <input
            id="logo"
            className="admin-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => void handleUpload("logo", event.target.files?.[0])}
          />
          {content?.logo ? (
            <button
              type="button"
              className="admin-btn-outline"
              disabled={busy}
              onClick={() => void remove("logo")}
            >
              {copy.media.removeLogo}
            </button>
          ) : null}
        </div>

        <div className="admin-card admin-stack">
          <h2 className="admin-card-title">{copy.media.hero}</h2>
          {content?.heroPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.heroPhoto} alt="" className="admin-media-thumb" />
          ) : (
            <p className="admin-muted">{copy.media.noHero}</p>
          )}
          <input
            className="admin-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => void handleUpload("hero", event.target.files?.[0])}
          />
          {content?.heroPhoto ? (
            <button
              type="button"
              className="admin-btn-outline"
              disabled={busy}
              onClick={() => void remove("hero")}
            >
              {copy.media.removeHero}
            </button>
          ) : null}
        </div>
      </div>

      <div className="admin-card admin-stack">
        <h2 className="admin-card-title">{copy.media.gallery}</h2>
        <input
          className="admin-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={(event) => void handleUpload("gallery", event.target.files?.[0])}
        />
        <div className="admin-grid-2" style={{ gridTemplateColumns: undefined }}>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
            }}
          >
            {(content?.galleryPhotos || []).map((src, index) => (
              <div key={`${src}-${index}`} className="admin-stack">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="admin-media-thumb" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    disabled={busy}
                    onClick={() => void move(index, -1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    disabled={busy}
                    onClick={() => void move(index, 1)}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    disabled={busy}
                    onClick={() => void remove("gallery", src)}
                  >
                    {copy.media.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
