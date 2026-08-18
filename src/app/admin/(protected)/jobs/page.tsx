"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminPageShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { VacancyRecord } from "@/lib/vacancies/store";

export default function AdminJobsPage() {
  const [items, setItems] = useState<VacancyRecord[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/jobs", { cache: "no-store" });
    const json = (await response.json()) as { ok?: boolean; items?: VacancyRecord[] };
    if (json.ok) setItems(json.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const payload = { title, description, salary, requirements };
    const response = await fetch("/api/admin/jobs", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !json.ok) {
      setMessage(json.error || "Speichern fehlgeschlagen");
      return;
    }
    setTitle("");
    setDescription("");
    setSalary("");
    setRequirements("");
    setEditingId(null);
    setMessage("Gespeichert.");
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/jobs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  function edit(item: VacancyRecord) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setSalary(item.salary || "");
    setRequirements(item.requirements || "");
  }

  return (
    <AdminPageShell title="Stellen" description="Offene Stellen für die öffentliche Job-Seite.">
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Stelle bearbeiten" : "Neue Stelle"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={(event) => void onSubmit(event)}>
            <Input placeholder="Titel" required value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea
              placeholder="Beschreibung"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Input placeholder="Gehalt" value={salary} onChange={(event) => setSalary(event.target.value)} />
            <Input
              placeholder="Anforderungen"
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Aktualisieren" : "Erstellen"}</Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                    setSalary("");
                    setRequirements("");
                  }}
                >
                  Abbrechen
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.salary ? <p className="text-sm text-muted-foreground">{item.salary}</p> : null}
                <p className="mt-1 text-sm">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => edit(item)}>
                  Bearbeiten
                </Button>
                <Button variant="outline" size="sm" onClick={() => void remove(item.id)}>
                  Löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPageShell>
  );
}
