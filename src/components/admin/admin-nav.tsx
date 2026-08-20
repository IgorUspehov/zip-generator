"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { AdminLangSwitcher } from "@/components/admin/admin-lang-switcher";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export function AdminNav({ businessName }: { businessName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { copy } = useAdminI18n();

  const nav = [
    { href: "/admin", label: copy.nav.overview },
    { href: "/admin/content", label: copy.nav.content },
    { href: "/admin/media", label: copy.nav.media },
    { href: "/admin/services", label: copy.nav.services },
    { href: "/admin/jobs", label: copy.nav.jobs },
    { href: "/admin/contacts", label: copy.nav.contacts },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-header">
      <div className="admin-header-top">
        <div className="admin-brand-block">
          <p className="admin-brand-eyebrow">⚡ {copy.brand}</p>
          <p className="admin-brand-name">{businessName || "Website"}</p>
        </div>
        <div className="admin-header-actions">
          <AdminLangSwitcher />
          <button type="button" className="admin-btn-outline" onClick={() => void logout()}>
            {copy.logout}
          </button>
        </div>
      </div>
      <nav className="admin-nav" aria-label="Admin">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${active ? "active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
