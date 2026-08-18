"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_WORKING_HOURS,
  WORKING_HOUR_DAYS,
  type SocialLinks,
  type WorkingHours,
} from "@/lib/admin/site-content";

const DAY_LABELS: Record<string, string> = {
  monday: "Montag",
  tuesday: "Dienstag",
  wednesday: "Mittwoch",
  thursday: "Donnerstag",
  friday: "Freitag",
  saturday: "Samstag",
  sunday: "Sonntag",
};

export default function AdminContactsPage() {
  const { data, loading, error, reload } = useAdminSite();
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [hours, setHours] = useState<WorkingHours>(DEFAULT_WORKING_HOURS);
  const [social, setSocial] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!data) return;
    setPhone(data.content.phone);
    setWhatsapp(data.content.whatsapp);
    setEmail(data.content.email);
    setAddress(data.content.address);
    setPostalCode(data.content.postalCode);
    setCity(data.content.city);
    setHours(data.content.workingHours);
    setSocial(data.content.socialLinks);
  }, [data]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          whatsapp,
          email,
          address,
          postalCode,
          city,
          workingHours: hours,
          socialLinks: social,
        }),
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
    <AdminPageShell title="Kontakt" description="Telefon, Adresse, Öffnungszeiten und soziale Links.">
      {loading ? <p className="text-sm text-muted-foreground">Laden…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={(event) => void onSubmit(event)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Stadt</Label>
                <Input value={city} onChange={(event) => setCity(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>PLZ</Label>
                <Input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Adresse</Label>
                <Input value={address} onChange={(event) => setAddress(event.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold">Öffnungszeiten</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {WORKING_HOUR_DAYS.map((day) => (
                  <div key={day} className="space-y-1">
                    <Label>{DAY_LABELS[day]}</Label>
                    <Input
                      value={hours[day]}
                      onChange={(event) => setHours((current) => ({ ...current, [day]: event.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold">Social Links</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(DEFAULT_SOCIAL_LINKS) as (keyof SocialLinks)[]).map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">{key}</Label>
                    <Input
                      value={social[key]}
                      onChange={(event) => setSocial((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </div>
                ))}
              </div>
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
