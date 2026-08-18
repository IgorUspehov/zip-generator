"use client";

import { useState } from "react";

import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function uploadSlot(slot: "logo" | "hero" | "gallery", file: File) {
  const body = new FormData();
  body.set("slot", slot);
  body.set("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", body });
  const json = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !json.ok) {
    throw new Error(json.error || "Upload fehlgeschlagen");
  }
}

export default function AdminMediaPage() {
  const { data, loading, error, reload } = useAdminSite();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleUpload(slot: "logo" | "hero" | "gallery", file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      await uploadSlot(slot, file);
      setMessage("Gespeichert.");
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function remove(slot: "logo" | "hero" | "gallery", url?: string) {
    setBusy(true);
    setMessage("");
    try {
      const params = new URLSearchParams({ slot });
      if (url) params.set("url", url);
      const response = await fetch(`/api/admin/media?${params.toString()}`, { method: "DELETE" });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error || "Löschen fehlgeschlagen");
      setMessage("Aktualisiert.");
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
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
    try {
      await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryPhotos: gallery }),
      });
      await reload();
    } finally {
      setBusy(false);
    }
  }

  const content = data?.content;

  return (
    <AdminPageShell title="Medien" description="Logo, Hauptbild und Galerie.">
      {loading ? <p className="text-sm text-muted-foreground">Laden…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.logo} alt="" className="h-20 w-20 rounded object-contain bg-muted" />
            ) : (
              <p className="text-sm text-muted-foreground">Kein Logo.</p>
            )}
            <Label htmlFor="logo">Datei wählen</Label>
            <Input
              id="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(event) => void handleUpload("logo", event.target.files?.[0])}
            />
            {content?.logo ? (
              <Button variant="outline" size="sm" disabled={busy} onClick={() => void remove("logo")}>
                Logo entfernen
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hauptbild</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content?.heroPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.heroPhoto} alt="" className="h-32 w-full rounded object-cover" />
            ) : (
              <p className="text-sm text-muted-foreground">Kein Hauptbild.</p>
            )}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(event) => void handleUpload("hero", event.target.files?.[0])}
            />
            {content?.heroPhoto ? (
              <Button variant="outline" size="sm" disabled={busy} onClick={() => void remove("hero")}>
                Hauptbild entfernen
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Galerie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => void handleUpload("gallery", event.target.files?.[0])}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {(content?.galleryPhotos || []).map((src, index) => (
              <div key={`${src}-${index}`} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-32 w-full rounded object-cover" />
                <div className="flex flex-wrap gap-1">
                  <Button size="xs" variant="outline" disabled={busy} onClick={() => void move(index, -1)}>
                    ←
                  </Button>
                  <Button size="xs" variant="outline" disabled={busy} onClick={() => void move(index, 1)}>
                    →
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void remove("gallery", src)}
                  >
                    Entfernen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
