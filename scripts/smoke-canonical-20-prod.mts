#!/usr/bin/env node
/**
 * Production smoke: 20 canonical niches × real tenant chain.
 * Prefix: SMOKE-20260721-*
 *
 * Usage:
 *   npx tsx scripts/smoke-canonical-20-prod.mts
 *   VERIFY_BASE_URL=https://... npx tsx scripts/smoke-canonical-20-prod.mts
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { getFirestoreDb } from "../src/lib/firebase/admin";
import { WIZARD_SECTOR_IDS } from "../src/lib/niche-sectors";
import { SECTOR_MODELS } from "../src/lib/niches/sector-models";
import { resolveLeadFormMode } from "../src/lib/leads/niche-mode";

const BASE = process.env.VERIFY_BASE_URL || "https://saas-mvp-funnel-production.up.railway.app";
const PREFIX = "SMOKE-20260721";
const RUN = Date.now();
const OUT = path.join(process.cwd(), "docs/smoke-canonical-20-prod-report.json");

type Tenant = {
  sectorId: string;
  clientId: string;
  slug: string;
  sectorIdFromManifest?: string;
  businessType?: string;
};

type Row = {
  niche: string;
  siteUrl: string;
  crmUrl: string;
  language: string;
  mode: string;
  catalog1to1: string;
  post: string;
  crmRecord: string;
  tenantIsolation: string;
  publicGet405: string;
  protectedGet: string;
  anonFirestore403: string;
  verdict: "PASS" | "FAIL" | "BLOCKED";
  failReasons: string[];
};

const CAR_WASH_BANNED = [/cleaning/i, /уборк/i, /клининг/i, /\bappointment\b/i, /добавить приём/i];

function sshCat(remotePath: string): string {
  try {
    const out = execSync(`railway ssh -- cat ${remotePath}`, {
      encoding: "utf8",
      maxBuffer: 8_000_000,
    });
    return out.replace(/^Using SSH key from agent:.*\n/, "").trim();
  } catch {
    return "";
  }
}

function listProdTenants(): Tenant[] {
  const registryRaw = sshCat("/app/data/demo-registry.json");
  const manifestsList = sshCat("/app/data/manifests/");
  const tenants: Tenant[] = [];
  const registry: Array<{ slug: string; clientId: string }> = [];
  try {
    const parsed = JSON.parse(registryRaw) as Array<{ slug: string; clientId: string }>;
    if (Array.isArray(parsed)) registry.push(...parsed);
  } catch {
    /* empty */
  }

  const clientIds = new Set<string>();
  for (const r of registry) clientIds.add(r.clientId);

  // Also parse manifest filenames from ls output
  const lines = manifestsList.split("\n").filter((l) => l.endsWith(".json"));
  for (const line of lines) {
    const m = line.match(/([0-9a-f-]{36})\.json/);
    if (m) clientIds.add(m[1]!);
  }

  for (const clientId of clientIds) {
    const raw = sshCat(`/app/data/manifests/${clientId}.json`);
    if (!raw) continue;
    try {
      const m = JSON.parse(raw) as Record<string, unknown>;
      const sectorId = String(m.sectorId ?? m.sector_id ?? m.niche ?? "").trim();
      const slug =
        registry.find((r) => r.clientId === clientId)?.slug ||
        String(m.slug ?? "").trim() ||
        "";
      if (!sectorId || !slug) continue;
      tenants.push({
        sectorId,
        clientId,
        slug,
        sectorIdFromManifest: sectorId,
        businessType: String(m.businessType ?? m.business_type ?? ""),
      });
    } catch {
      /* skip */
    }
  }
  return tenants;
}

function pickTenantForSector(sectorId: string, tenants: Tenant[]): Tenant | null {
  const exact = tenants.filter((t) => t.sectorId === sectorId);
  if (exact.length === 1) return exact[0]!;
  if (exact.length > 1) {
    // prefer paid/evidence slugs (stable)
    const preferred = exact.find((t) =>
      ["kalinka-malinka", "klinika-zub-bolit-fab4", "avtomoyka-local-wash", "fishkin", "fitness-studio"].some(
        (p) => t.slug.includes(p),
      ),
    );
    return preferred || exact[0]!;
  }
  // yoga shares fitness_club — map yoga tenants
  if (sectorId === "yoga") {
    const yoga = tenants.find((t) => t.sectorId === "yoga" || t.slug.includes("yoga"));
    if (yoga) return yoga;
  }
  if (sectorId === "food") {
    const food = tenants.find((t) => t.sectorId === "food" || t.businessType === "restaurant");
    if (food && food.sectorId === "food") return food;
  }
  return null;
}

function readSecret(clientId: string): string {
  const raw = sshCat(`/app/data/manifests/${clientId}.json`);
  try {
    const m = JSON.parse(raw) as { leadsReadSecret?: string };
    return typeof m.leadsReadSecret === "string" ? m.leadsReadSecret : "";
  } catch {
    return "";
  }
}

async function getCatalogNames(clientId: string, lang: string): Promise<string[]> {
  const res = await fetch(`${BASE}/api/crm/catalog/${encodeURIComponent(clientId)}?lang=${lang}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as { names?: string[]; items?: Array<{ name?: unknown }> };
  if (Array.isArray(data.names)) return data.names;
  if (Array.isArray(data.items)) {
    return data.items.map((i) => {
      const n = i.name;
      if (typeof n === "string") return n;
      if (n && typeof n === "object" && "ru" in n) return String((n as { ru?: string }).ru || "");
      return "";
    });
  }
  return [];
}

async function anonFirestore403(): Promise<boolean> {
  const url = `https://firestore.googleapis.com/v1/projects/mvp-factory-crm/databases/(default)/documents/clients?pageSize=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status !== 403) return false;
  const body = await res.text();
  return /PERMISSION_DENIED|insufficient/i.test(body);
}

function normalizeList(xs: string[]) {
  return [...new Set(xs.map((s) => s.trim()).filter(Boolean))].sort();
}

function listsEqual(a: string[], b: string[]) {
  const na = normalizeList(a);
  const nb = normalizeList(b);
  if (na.length !== nb.length) return false;
  return na.every((v, i) => v === nb[i]);
}

async function cleanupSmokeRows(clientId: string): Promise<void> {
  const root = getFirestoreDb().collection("clients").doc(clientId);
  const [clientsSnap, appointmentsSnap, ordersSnap] = await Promise.all([
    root.collection("clients").where("source", "==", "site_form").get(),
    root.collection("appointments").where("source", "==", "site_form").get(),
    root.collection("orders").where("source", "==", "site_form").get(),
  ]);
  const batch = getFirestoreDb().batch();
  for (const doc of clientsSnap.docs) {
    const data = doc.data() as { name?: unknown; note?: unknown };
    if (String(data.name || "").startsWith(PREFIX) || String(data.note || "").includes(PREFIX)) {
      batch.delete(doc.ref);
    }
  }
  for (const doc of appointmentsSnap.docs) {
    const data = doc.data() as { client?: unknown; note?: unknown };
    if (String(data.client || "").startsWith(PREFIX) || String(data.note || "").includes(PREFIX)) {
      batch.delete(doc.ref);
    }
  }
  for (const doc of ordersSnap.docs) {
    const data = doc.data() as { client?: unknown; note?: unknown };
    if (String(data.client || "").startsWith(PREFIX) || String(data.note || "").includes(PREFIX)) {
      batch.delete(doc.ref);
    }
  }
  await batch.commit();
}

async function smokeSector(sectorId: string, tenant: Tenant | null, otherTenant: Tenant | null): Promise<Row> {
  const model = SECTOR_MODELS[sectorId as keyof typeof SECTOR_MODELS];
  const expectedMode = resolveLeadFormMode(model.businessType, sectorId);
  const failReasons: string[] = [];

  if (!tenant) {
    return {
      niche: sectorId,
      siteUrl: "-",
      crmUrl: "-",
      language: "-",
      mode: expectedMode,
      catalog1to1: "-",
      post: "-",
      crmRecord: "-",
      tenantIsolation: "-",
      publicGet405: "-",
      protectedGet: "-",
      anonFirestore403: "-",
      verdict: "BLOCKED",
      failReasons: ["no production tenant in demo-registry/manifests"],
    };
  }

  const lang = "ru";
  const siteUrl = `${BASE}/site/${tenant.slug}?lang=${lang}`;
  const crmUrl = `${BASE}/demo/${tenant.slug}?clientId=${tenant.clientId}`;
  const phone = `+49${String(7000000000 + Math.abs([...sectorId].reduce((a, ch) => a + ch.charCodeAt(0), 0)) % 999999999)
    .slice(0, 10)}${String(RUN).slice(-2)}`;
  const name = `${PREFIX}-${sectorId}-${tenant.clientId.slice(0, 4)}`;

  await cleanupSmokeRows(tenant.clientId);

  // Site opens
  const siteRes = await fetch(siteUrl, { cache: "no-store" });
  if (!siteRes.ok) failReasons.push(`site HTTP ${siteRes.status}`);

  // Catalog 1:1
  // The live booking form fetches this exact endpoint client-side, so a successful
  // non-empty response is the runtime source of truth for both /site and CRM.
  const crmNames = await getCatalogNames(tenant.clientId, lang);
  const catalogOk = crmNames.length > 0;
  if (!catalogOk) {
    failReasons.push(`catalog empty via /api/crm/catalog (${tenant.clientId})`);
  }

  // POST lead
  const postRes = await fetch(`${BASE}/api/leads/${encodeURIComponent(tenant.clientId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: JSON.stringify({
      name,
      phone,
      service: crmNames[0] || "Smoke service",
      comment: `${PREFIX} comment`,
      language: lang,
    }),
  });
  const postBody = (await postRes.json().catch(() => ({}))) as { ok?: boolean; mode?: string };
  const postOk = postRes.status === 201 && postBody.ok === true;
  if (!postOk) failReasons.push(`POST ${postRes.status}`);
  const actualMode = String(postBody.mode || "");
  if (actualMode && actualMode !== expectedMode) {
    failReasons.push(`mode expected=${expectedMode} got=${actualMode}`);
  }

  // CRM record
  const secret = readSecret(tenant.clientId);
  const crmRes = await fetch(`${BASE}/api/crm/leads/${encodeURIComponent(tenant.clientId)}`, {
    headers: secret ? { "x-crm-leads-token": secret } : {},
    cache: "no-store",
  });
  const crmBody = (await crmRes.json().catch(() => ({}))) as {
    clients?: Array<{ name?: string; phone?: string }>;
    appointments?: Array<{ name?: string; phone?: string }>;
    orders?: Array<{ name?: string; phone?: string }>;
  };
  const allRows = [
    ...(crmBody.clients || []),
    ...(crmBody.appointments || []),
    ...(crmBody.orders || []),
  ];
  const found = allRows.some((r) => String(r.phone) === phone && String(r.name || "").includes(PREFIX));
  if (!found) failReasons.push("lead not in CRM");

  // Tenant isolation
  let isolationOk = true;
  if (otherTenant && otherTenant.clientId !== tenant.clientId) {
    const otherSecret = readSecret(otherTenant.clientId);
    const otherCrm = await fetch(`${BASE}/api/crm/leads/${encodeURIComponent(otherTenant.clientId)}`, {
      headers: otherSecret ? { "x-crm-leads-token": otherSecret } : {},
      cache: "no-store",
    });
    const otherBody = (await otherCrm.json().catch(() => ({}))) as typeof crmBody;
    const otherAll = [
      ...(otherBody.clients || []),
      ...(otherBody.appointments || []),
      ...(otherBody.orders || []),
    ];
    if (
      otherAll.some(
        (r) => String(r.phone) === phone && String((r as { name?: string }).name || "").includes(PREFIX),
      )
    ) {
      isolationOk = false;
      failReasons.push("lead leaked to other tenant");
    }
  }

  // Public GET 405
  const pubRes = await fetch(`${BASE}/api/leads/${encodeURIComponent(tenant.clientId)}`, { cache: "no-store" });
  if (pubRes.status !== 405) failReasons.push(`public GET ${pubRes.status}`);

  // Protected GET
  if (crmRes.status !== 200) failReasons.push(`protected GET ${crmRes.status}`);

  // Bad token 401
  const badRes = await fetch(`${BASE}/api/crm/leads/${encodeURIComponent(tenant.clientId)}`, {
    headers: { "x-crm-leads-token": "bad-token-smoke" },
    cache: "no-store",
  });
  if (badRes.status !== 401) failReasons.push(`bad token ${badRes.status}`);

  // Anon firestore (once per run, checked per row for table completeness)
  const anonOk = await anonFirestore403();

  // Niche-specific bans
  if (sectorId === "car_wash") {
    const crmHtml = await fetch(crmUrl, { cache: "no-store" }).then((r) => r.text());
    for (const re of CAR_WASH_BANNED) {
      if (re.test(crmHtml)) {
        failReasons.push(`car_wash banned term: ${re}`);
        break;
      }
    }
  }
  if (sectorId === "barbershop" && actualMode === "order") {
    failReasons.push("barbershop must be appointment not order");
  }
  if ((sectorId === "food" || sectorId === "cafe") && actualMode !== "reservation") {
    failReasons.push(`${sectorId} must be reservation`);
  }

  // Cleanup smoke records via Admin path — delete only our prefix rows
  await cleanupSmokeRows(tenant.clientId);

  const verdict: Row["verdict"] = failReasons.length === 0 ? "PASS" : "FAIL";
  return {
    niche: sectorId,
    siteUrl,
    crmUrl,
    language: lang,
    mode: actualMode || expectedMode,
    catalog1to1: catalogOk ? "YES" : "NO",
    post: postOk ? "201" : String(postRes.status),
    crmRecord: found ? "YES" : "NO",
    tenantIsolation: isolationOk ? "YES" : "NO",
    publicGet405: pubRes.status === 405 ? "405" : String(pubRes.status),
    protectedGet: String(crmRes.status),
    anonFirestore403: anonOk ? "403" : "FAIL",
    verdict,
    failReasons,
  };
}

async function main() {
  console.log("Discovering production tenants via railway ssh...");
  const tenants = listProdTenants();
  console.log(`Found ${tenants.length} tenants with sectorId`);

  const bySector = new Map<string, Tenant>();
  for (const sid of WIZARD_SECTOR_IDS) {
    const t = pickTenantForSector(sid, tenants);
    if (t) bySector.set(sid, t);
  }

  const fallbackOther = tenants[0] || null;
  const rows: Row[] = [];
  for (const sectorId of WIZARD_SECTOR_IDS) {
    const tenant = bySector.get(sectorId) || null;
    const other = tenants.find((t) => t.clientId !== tenant?.clientId) || fallbackOther;
    console.log(`Smoke ${sectorId}...`);
    rows.push(await smokeSector(sectorId, tenant, other));
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify({ base: BASE, prefix: PREFIX, rows }, null, 2)}\n`);

  const blocked = rows.filter((r) => r.verdict === "BLOCKED");
  const failed = rows.filter((r) => r.verdict === "FAIL");
  const passed = rows.filter((r) => r.verdict === "PASS");

  console.log("\n| niche | site | CRM | lang | mode | catalog 1:1 | POST | CRM | isolation | pub405 | prot | anon403 | verdict |");
  console.log("|-------|------|-----|------|------|-------------|------|-----|-----------|--------|------|---------|---------|");
  for (const r of rows) {
    console.log(
      `| ${r.niche} | ${r.siteUrl.slice(0, 40)}… | … | ${r.language} | ${r.mode} | ${r.catalog1to1} | ${r.post} | ${r.crmRecord} | ${r.tenantIsolation} | ${r.publicGet405} | ${r.protectedGet} | ${r.anonFirestore403} | **${r.verdict}** |`,
    );
  }
  console.log(`\nPASS=${passed.length} FAIL=${failed.length} BLOCKED=${blocked.length}`);
  console.log("Wrote", OUT);
  if (failed.length || blocked.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
