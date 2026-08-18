"use client";

import Link from "next/link";

import { AdminPageShell, useAdminSite } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHomePage() {
  const { data, loading, error } = useAdminSite();

  return (
    <AdminPageShell title="Übersicht" description="Verwalten Sie den Inhalt Ihrer veröffentlichten Website.">
      {loading ? <p className="text-sm text-muted-foreground">Laden…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{data.content.businessName || "Website"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={data.paid ? "default" : "secondary"}>
                  {data.paid ? "Aktiv / bezahlt" : "Demo"}
                </Badge>
              </div>
              {data.publicSiteUrl ? (
                <p>
                  Öffentliche Website:{" "}
                  <Link className="font-medium underline" href={data.publicSiteUrl} target="_blank">
                    {data.publicSiteUrl}
                  </Link>
                </p>
              ) : (
                <p className="text-muted-foreground">Öffentliche URL noch nicht verfügbar.</p>
              )}
              {data.crmUrl ? (
                <p>
                  CRM / Booking:{" "}
                  <Link className="font-medium underline" href={data.crmUrl} target="_blank">
                    {data.crmUrl}
                  </Link>
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bereiche</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <Link className="underline" href="/admin/content">
                Inhalt
              </Link>
              <Link className="underline" href="/admin/media">
                Medien
              </Link>
              <Link className="underline" href="/admin/services">
                Leistungen & Preise
              </Link>
              <Link className="underline" href="/admin/jobs">
                Stellen
              </Link>
              <Link className="underline" href="/admin/contacts">
                Kontakt & Öffnungszeiten
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AdminPageShell>
  );
}
