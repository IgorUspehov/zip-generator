"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/content", label: "Inhalt" },
  { href: "/admin/media", label: "Medien" },
  { href: "/admin/services", label: "Leistungen" },
  { href: "/admin/jobs", label: "Stellen" },
  { href: "/admin/contacts", label: "Kontakt" },
];

export function AdminNav({ businessName }: { businessName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Client Admin
          </p>
          <p className="text-lg font-semibold">{businessName || "Ihre Website"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void logout()}>
          Abmelden
        </Button>
      </div>
      <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-4 pb-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
