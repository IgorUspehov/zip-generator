import { generateMassagePageComponent } from "./massage-salon-ui-templates.mjs";

export const SECTOR_DISPLAY_NAMES = {
  dental_clinic: "Стоматология / Dental Clinic",
  massage_salon: "Массажный салон / Massage",
  fitness_club: "Фитнес клуб / Fitness",
  beauty_salon: "Салон красоты / Beauty",
  car_service_crm: "Автосервис / Car Service",
  car_service: "Автосервис / Car Service",
  restaurant_crm: "Ресторан / Restaurant",
  restaurant: "Ресторан / Restaurant",
  hotel_booking: "Отель / Hotel",
  real_estate_crm: "Недвижимость / Real Estate",
  real_estate: "Недвижимость / Real Estate",
  veterinary_clinic: "Ветеринарная клиника / Vet",
  barbershop: "Барбершоп / Barbershop",
};

export function getSectorDisplayName(sectorId) {
  const key = String(sectorId || "").trim().toLowerCase().replace(/-/g, "_");
  return SECTOR_DISPLAY_NAMES[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Business";
}

export function generateCardComponent() {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";
`;
}

export function generateInputComponent() {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";
`;
}

export function generateTableComponent() {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-10 px-4 text-left align-middle font-medium text-muted-foreground", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
);
TableCell.displayName = "TableCell";
`;
}

export function generateSimpleBadgeComponent() {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles =
    variant === "secondary"
      ? "bg-muted text-foreground"
      : variant === "outline"
        ? "border text-foreground"
        : "bg-slate-900 text-white";
  return (
    <div className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold", styles, className)} {...props} />
  );
}
`;
}

export function generateSimpleButtonComponent() {
  return `import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-input bg-background hover:bg-muted",
  ghost: "hover:bg-muted",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-8",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
`;
}

export function generateAppShell(projectTitle, pages) {
  const sectorKey = String(projectTitle || "").trim().toLowerCase().replace(/-/g, "_");
  const displayTitle = SECTOR_DISPLAY_NAMES[sectorKey] || projectTitle || "MVP";
  const navItems = pages
    .map((slug) => {
      const href = slug === "dashboard" ? "/" : `/${slug}`;
      const label = slug.charAt(0).toUpperCase() + slug.slice(1);
      return `  { href: "${href}", label: "${label}" },`;
    })
    .join("\n");

  return `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
${navItems}
];

export function AppShell({
  children,
  title = "${displayTitle}",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
        <div className="border-b px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{title}</span>
            <Badge variant="secondary">MVP</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">shadcn/ui SaaS dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "block rounded-md px-3 py-2 text-sm transition-colors " +
                  (active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">{title}</span>
              <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                Close
              </Button>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="truncate text-xs text-muted-foreground">SaaS MVP workspace</p>
          </div>
          <Badge>Live</Badge>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
`;
}

export function generateLayout(projectTitle) {
  return `import "./globals.css";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "${projectTitle}",
  description: "Materialized MVP from mvp_package.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppShell title="${projectTitle}">{children}</AppShell>
      </body>
    </html>
  );
}
`;
}

export function generateDashboardPage(label, projectName, projectType, slug) {
  return `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const STATS = [
  { label: "Active", value: "128", trend: "+12%" },
  { label: "Pending", value: "24", trend: "3 new" },
  { label: "Completed", value: "1,042", trend: "+8%" },
];

const ROWS = [
  { id: "1", name: "Sample record A", status: "active" },
  { id: "2", name: "Sample record B", status: "pending" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">${label}</h1>
          <p className="text-sm text-muted-foreground">${projectName} — ${projectType}</p>
        </div>
        <Button>Create</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{stat.trend}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent ${slug}</CardTitle>
          <CardDescription>Latest records from the MVP data layer</CardDescription>
        </CardHeader>
        <CardContent>
          {ROWS.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No records yet. Create your first item to populate this table.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell><Badge>{row.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

export function componentNameForSlug(slug) {
  if (slug === "dashboard") return "DashboardPage";
  if (slug === "settings") return "SettingsPage";
  const base = slug
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return `${base}ListPage`;
}

export function generateListPage(label, slug, componentName) {
  return `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const ROWS = [
  { id: "1", name: "${label} item 1", status: "active" },
  { id: "2", name: "${label} item 2", status: "draft" },
];

export function ${componentName}() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">${label}</h1>
          <p className="text-sm text-muted-foreground">Manage ${slug} records</p>
        </div>
        <Button>Add ${label.slice(0, -1) || label}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>${label} list</CardTitle>
          <CardDescription>Structured table view with actions</CardDescription>
        </CardHeader>
        <CardContent>
          {ROWS.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Empty state: no ${slug} yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell><Badge variant="secondary">{row.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

export function generateSettingsPage(label) {
  return `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">${label}</h1>
        <p className="text-sm text-muted-foreground">Workspace preferences and profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your MVP workspace settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="workspace-name">Workspace name</label>
            <Input id="workspace-name" placeholder="My SaaS workspace" defaultValue="MVP Workspace" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="contact-email">Contact email</label>
            <Input id="contact-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button">Save changes</Button>
            <Button type="button" variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

export function generatePageComponent(slug, projectName, projectType) {
  if (projectType === "massage_salon_platform") {
    return generateMassagePageComponent(slug, projectName);
  }

  const label = slug
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const componentName = componentNameForSlug(slug);

  if (slug === "dashboard") {
    return {
      componentName,
      content: generateDashboardPage(label, projectName, projectType, slug),
    };
  }
  if (slug === "settings") {
    return {
      componentName,
      content: generateSettingsPage(label),
    };
  }
  return {
    componentName,
    content: generateListPage(label, slug, componentName),
  };
}
