import {
  APPOINTMENTS,
  CLIENTS,
  DASHBOARD_STATS,
  SALON_NAME,
  SCHEDULE_WEEK,
  SERVICES,
  THERAPISTS,
} from "./massage-salon-demo-data.mjs";
function componentNameForSlug(slug) {
  if (slug === "dashboard") return "DashboardPage";
  if (slug === "settings") return "SettingsPage";
  const base = slug
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return `${base}ListPage`;
}

function serializeRows(rows) {
  return JSON.stringify(rows, null, 2);
}

export function generateMassageSalonAppShell(projectTitle, pages) {
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
  title = "${projectTitle}",
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
            <Badge variant="secondary">CRM</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">${SALON_NAME}</p>
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
            <p className="truncate text-xs text-muted-foreground">Massage salon management</p>
          </div>
          <Badge>Today</Badge>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
`;
}

function generateMassageDashboardPage(projectName) {
  const todayAppointments = APPOINTMENTS.filter((a) => a.date.startsWith("2026-06-08"));
  const stats = [
    { label: "Total Clients", value: String(DASHBOARD_STATS.clients), hint: "Registered clients" },
    { label: "Appointments Today", value: String(DASHBOARD_STATS.appointmentsToday), hint: "Scheduled for Jun 8" },
    { label: "Monthly Revenue", value: DASHBOARD_STATS.monthlyRevenue, hint: "June 2026" },
    { label: "Active Therapists", value: String(DASHBOARD_STATS.activeTherapists), hint: "On duty this week" },
  ];

  return `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const STATS = ${JSON.stringify(stats, null, 2)};

const TODAY_APPOINTMENTS = ${serializeRows(todayAppointments)};

function appointmentStatusVariant(status: string) {
  if (status === "confirmed") return "secondary";
  if (status === "in progress") return "default";
  if (status === "pending") return "outline";
  return "outline";
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">${projectName} — ${SALON_NAME}</p>
        </div>
        <Button>New appointment</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s appointments</CardTitle>
          <CardDescription>June 8, 2026 — salon schedule overview</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Therapist</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TODAY_APPOINTMENTS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.client}</TableCell>
                  <TableCell>{row.therapist}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.date.split(" ")[1]}</TableCell>
                  <TableCell>
                    <Badge variant={appointmentStatusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageClientsPage() {
  return `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const CLIENTS = ${serializeRows(CLIENTS)};

export function ClientsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Client directory for ${SALON_NAME}</p>
        </div>
        <Button>Add client</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client list</CardTitle>
          <CardDescription>{CLIENTS.length} clients with contact details and visit history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLIENTS.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.lastVisit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageAppointmentsPage() {
  return `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const APPOINTMENTS = ${serializeRows(APPOINTMENTS)};

function statusVariant(status: string) {
  if (status === "confirmed") return "secondary";
  if (status === "completed") return "default";
  if (status === "in progress") return "default";
  if (status === "cancelled") return "outline";
  return "outline";
}

export function AppointmentsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">Bookings and session status</p>
        </div>
        <Button>Book appointment</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment schedule</CardTitle>
          <CardDescription>{APPOINTMENTS.length} upcoming and recent sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Therapist</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {APPOINTMENTS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.client}</TableCell>
                  <TableCell>{row.therapist}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageServicesPage() {
  return `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const SERVICES = ${serializeRows(SERVICES)};

export function ServicesListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground">Massage treatments offered at the salon</p>
        </div>
        <Button>Add service</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service catalog</CardTitle>
          <CardDescription>Duration and pricing for each treatment</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SERVICES.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>{service.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageTherapistsPage() {
  return `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const THERAPISTS = ${serializeRows(THERAPISTS)};

export function TherapistsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Therapists</h1>
          <p className="text-sm text-muted-foreground">Team members and specializations</p>
        </div>
        <Button>Add therapist</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Therapist roster</CardTitle>
          <CardDescription>{THERAPISTS.length} massage therapists on staff</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {THERAPISTS.map((therapist) => (
                <TableRow key={therapist.id}>
                  <TableCell className="font-medium">{therapist.name}</TableCell>
                  <TableCell>{therapist.specialty}</TableCell>
                  <TableCell>{therapist.experience}</TableCell>
                  <TableCell>{therapist.phone}</TableCell>
                  <TableCell>
                    <Badge variant={therapist.status === "active" ? "secondary" : "outline"}>
                      {therapist.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageSchedulePage() {
  return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WEEK = ${serializeRows(SCHEDULE_WEEK)};

export function ScheduleListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground">Weekly calendar — June 2–8, 2026</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {WEEK.map((day) => (
          <Card key={day.day} className={day.date === "Jun 8" ? "border-foreground/20 ring-1 ring-foreground/10" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{day.day}</CardTitle>
              <CardDescription>{day.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.slots.length === 0 ? (
                <p className="text-xs text-muted-foreground">No sessions</p>
              ) : (
                day.slots.map((slot) => (
                  <div
                    key={slot}
                    className="rounded-md border bg-muted/40 px-2 py-1.5 text-xs leading-snug"
                  >
                    {slot}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar notes</CardTitle>
          <CardDescription>Room assignments and therapist availability</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Sunday Jun 8 is the busiest day this week with six confirmed sessions across three treatment rooms.</p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

function generateMassageSettingsPage(projectName) {
  return `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Salon profile and operating preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salon profile</CardTitle>
          <CardDescription>Contact details and operating hours for ${SALON_NAME}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="salon-name">Salon Name</label>
            <Input id="salon-name" defaultValue="${SALON_NAME}" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="working-hours">Working Hours</label>
            <Input id="working-hours" defaultValue="Mon–Sat 09:00–20:00, Sun 10:00–18:00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="salon-phone">Phone</label>
            <Input id="salon-phone" defaultValue="+49 30 884 2200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="contact-email">Email</label>
            <Input id="contact-email" type="email" defaultValue="hello@serenity-touch.de" />
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

const MASSAGE_PAGE_BUILDERS = {
  dashboard: (projectName) => ({
    componentName: "DashboardPage",
    content: generateMassageDashboardPage(projectName),
  }),
  clients: () => ({
    componentName: "ClientsListPage",
    content: generateMassageClientsPage(),
  }),
  appointments: () => ({
    componentName: "AppointmentsListPage",
    content: generateMassageAppointmentsPage(),
  }),
  services: () => ({
    componentName: "ServicesListPage",
    content: generateMassageServicesPage(),
  }),
  therapists: () => ({
    componentName: "TherapistsListPage",
    content: generateMassageTherapistsPage(),
  }),
  schedule: () => ({
    componentName: "ScheduleListPage",
    content: generateMassageSchedulePage(),
  }),
  settings: (projectName) => ({
    componentName: "SettingsPage",
    content: generateMassageSettingsPage(projectName),
  }),
};

export function generateMassagePageComponent(slug, projectName) {
  const builder = MASSAGE_PAGE_BUILDERS[slug];
  if (builder) {
    return builder(projectName);
  }
  return {
    componentName: componentNameForSlug(slug),
    content: generateMassageClientsPage(),
  };
}
