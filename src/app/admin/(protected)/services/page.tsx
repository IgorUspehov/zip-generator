"use client";

import { useEffect, useState } from "react";

import { AdminPageShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/catalog", { cache: "no-store" });
      const json = (await response.json()) as { ok?: boolean; items?: CatalogItem[]; error?: string };
      if (!response.ok || !json.ok) {
        setMessage(json.error || "Laden fehlgeschlagen");
        return;
      }
      setRows(toRows(json.items || []));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(nextRows: Row[]) {
    setSaving(true);
    setMessage("");
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
        body: JSON.stringify({ items }),
      });
      const json = (await response.json()) as { ok?: boolean; items?: CatalogItem[]; error?: string };
      if (!response.ok || !json.ok) {
        setMessage(json.error || "Speichern fehlgeschlagen");
        return;
      }
      setRows(json.items ? toRows(json.items) : nextRows);
      setMessage("Gespeichert.");
    } finally {
      setSaving(false);
    }
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <AdminPageShell title="Leistungen" description="Namen, Preise und Dauer — derselbe Katalog wie Booking.">
      {loading ? <p className="text-sm text-muted-foreground">Laden…</p> : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Katalog</CardTitle>
          <Button
            size="sm"
            variant="outline"
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
            Leistung hinzufügen
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-4">
              <Input
                placeholder="Name"
                value={row.name}
                onChange={(event) => updateRow(index, { name: event.target.value })}
              />
              <Input
                placeholder="Preis"
                value={row.price}
                onChange={(event) => updateRow(index, { price: event.target.value })}
              />
              <Input
                placeholder="Dauer"
                value={row.duration}
                onChange={(event) => updateRow(index, { duration: event.target.value })}
              />
              <Button
                variant="outline"
                onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
              >
                Entfernen
              </Button>
            </div>
          ))}
          <Button disabled={saving || loading} onClick={() => void save(rows)}>
            {saving ? "Speichern…" : "Speichern"}
          </Button>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
