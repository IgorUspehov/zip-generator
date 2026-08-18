"use client";

import { useCallback, useEffect, useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import type { SiteContent } from "@/lib/admin/site-content";

export type AdminSiteResponse = {
  ok: boolean;
  clientId: string;
  slug?: string | null;
  paid?: boolean;
  publicSiteUrl?: string | null;
  crmUrl?: string | null;
  content: SiteContent;
  error?: string;
};

export function useAdminSite() {
  const [data, setData] = useState<AdminSiteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/site", { cache: "no-store" });
      const json = (await response.json()) as AdminSiteResponse;
      if (!response.ok || !json.ok) {
        setError(json.error || "Laden fehlgeschlagen");
        setData(null);
        return;
      }
      setError(null);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Laden fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload, setData };
}

export function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { data } = useAdminSite();
  return (
    <div className="min-h-svh bg-muted/30">
      <AdminNav businessName={data?.content.businessName} />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
