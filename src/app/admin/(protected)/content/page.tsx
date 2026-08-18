"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminContentPage() {
  const { data, loading, error, reload } = useAdminSite();
  const [businessName, setBusinessName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!data) return;
    setBusinessName(data.content.businessName);
    setSubtitle(data.content.subtitle);
    setDescription(data.content.description);
  }, [data]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, subtitle, description }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        setMessage(json.error || "Speichern fehlgeschlagen");
        return;
      }
      setMessage("Gespeichert.");
      await reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell title="Inhalt" description="Name und Beschreibung Ihrer Website.">
      {loading ? <p className="text-sm text-muted-foreground">Laden…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <div className="space-y-2">
              <Label htmlFor="businessName">Geschäftsname</Label>
              <Input
                id="businessName"
                required
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Untertitel</Label>
              <Input id="subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            <Button type="submit" disabled={saving || loading}>
              {saving ? "Speichern…" : "Speichern"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
