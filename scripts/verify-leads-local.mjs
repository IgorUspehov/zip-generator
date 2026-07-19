#!/usr/bin/env node
/**
 * Local verification: public site form → POST /api/leads → Firestore → protected CRM GET.
 *
 * Usage (from repo root, with Firebase env loaded):
 *   node scripts/verify-leads-local.mjs [baseUrl]
 *
 * Expects Next.js already running (default http://127.0.0.1:3000).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] || process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

const CASES = [
  { id: "lead-shop", businessType: "ecommerce", sectorId: "shop", lang: "en", mode: "order" },
  { id: "lead-dental", businessType: "dental_clinic", sectorId: "dental", lang: "de", mode: "appointment" },
  { id: "lead-beauty", businessType: "beauty_salon", sectorId: "beauty", lang: "ru", mode: "appointment" },
  { id: "lead-accounting", businessType: "accounting", sectorId: "accounting", lang: "en", mode: "inquiry" },
  { id: "lead-logistics", businessType: "logistics", sectorId: "logistics", lang: "ru", mode: "inquiry" },
];

function dataDir() {
  return (
    process.env.CRM_DATA_DIR ||
    process.env.DATA_DIR ||
    path.join(root, "data")
  );
}

function writeManifest(clientId, c) {
  const dir = path.join(dataDir(), "manifests");
  fs.mkdirSync(dir, { recursive: true });
  const manifest = {
    clientId,
    businessName: `Lead Test ${c.sectorId}`,
    businessType: c.businessType,
    sectorId: c.sectorId,
    language: c.lang,
    city: "Berlin",
    phone: "+491701111111",
    email: `${clientId}@example.com`,
  };
  fs.writeFileSync(path.join(dir, `${clientId}.json`), `${JSON.stringify(manifest, null, 2)}\n`);
}

function readLeadsSecret(clientId) {
  const file = path.join(dataDir(), "manifests", `${clientId}.json`);
  if (!fs.existsSync(file)) return "";
  try {
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
    return typeof manifest.leadsReadSecret === "string" ? manifest.leadsReadSecret : "";
  } catch {
    return "";
  }
}

function hasPiiLeak(body) {
  const raw = JSON.stringify(body || {});
  return /name|phone|email|clients|appointments|orders|rec-/i.test(raw) &&
    (Array.isArray(body?.clients) ||
      Array.isArray(body?.appointments) ||
      body?.client ||
      body?.booking ||
      body?.name ||
      body?.phone);
}

async function postLead(clientId, lang, name, phone, ipSuffix = Math.floor(Math.random() * 200)) {
  const res = await fetch(`${base}/api/leads/${encodeURIComponent(clientId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `203.0.113.${ipSuffix}`,
      "x-real-ip": `203.0.113.${ipSuffix}`,
    },
    body: JSON.stringify({
      name,
      phone,
      service: "Test service",
      comment: "verify-leads-local",
      language: lang,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getPublicLeads(clientId) {
  const res = await fetch(`${base}/api/leads/${encodeURIComponent(clientId)}`, {
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getCrmLeads(clientId, token) {
  const res = await fetch(`${base}/api/crm/leads/${encodeURIComponent(clientId)}`, {
    cache: "no-store",
    headers: token ? { "x-crm-leads-token": token } : {},
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function main() {
  const rows = [];
  console.log(`Base: ${base}`);
  console.log(`Data: ${dataDir()}`);

  // Public GET must not list leads
  {
    writeManifest(CASES[0].id, CASES[0]);
    const res = await getPublicLeads(CASES[0].id);
    rows.push({
      niche: "public-get-blocked",
      status: res.status === 405 ? "PASS" : "FAIL",
      detail: `HTTP ${res.status} ${JSON.stringify(res.body).slice(0, 120)}`,
    });
  }

  // CRM GET without token
  {
    const res = await getCrmLeads(CASES[0].id, "");
    rows.push({
      niche: "crm-get-unauthorized",
      status: res.status === 401 ? "PASS" : "FAIL",
      detail: `HTTP ${res.status}`,
    });
  }

  // Rejection: missing client
  {
    const res = await postLead("does-not-exist-client", "en", "A", "+491701234567");
    rows.push({
      niche: "reject-missing-client",
      status: res.status === 404 ? "PASS" : "FAIL",
      detail: `HTTP ${res.status}`,
    });
  }

  // Rejection: empty fields
  {
    const c = CASES[0];
    writeManifest(c.id, c);
    const res = await fetch(`${base}/api/leads/${c.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", phone: "" }),
    });
    rows.push({
      niche: "reject-empty-fields",
      status: res.status === 400 ? "PASS" : "FAIL",
      detail: `HTTP ${res.status}`,
    });
  }

  const secrets = {};

  for (const c of CASES) {
    writeManifest(c.id, c);
    const phone = `+49170${String(Date.now()).slice(-8)}`;
    const posted = await postLead(c.id, c.lang, `Site Lead ${c.sectorId}`, phone);
    if (posted.status !== 201 || !posted.body?.ok) {
      rows.push({
        niche: c.sectorId,
        status: "FAIL",
        detail: `POST ${posted.status} ${JSON.stringify(posted.body).slice(0, 180)}`,
      });
      continue;
    }

    const postClean = posted.body?.ok === true &&
      posted.body?.mode === c.mode &&
      !hasPiiLeak(posted.body);
    rows.push({
      niche: `post-no-pii-${c.sectorId}`,
      status: postClean ? "PASS" : "FAIL",
      detail: JSON.stringify(posted.body),
    });

    const secret = readLeadsSecret(c.id);
    secrets[c.id] = secret;
    const listed = await getCrmLeads(c.id, secret);
    const clients = listed.body?.clients || [];
    const appointments = listed.body?.appointments || [];
    const hasClient = clients.some((x) => String(x.phone).includes(phone.slice(-6)));
    const hasBooking = appointments.some((x) => String(x.phone).includes(phone.slice(-6)));
    const idIsRec = clients.some((x) => String(x.id || "").startsWith("rec-"));
    const pass = listed.status === 200 && Boolean(secret) && hasClient && hasBooking && idIsRec;
    rows.push({
      niche: `${c.sectorId}/${c.lang}`,
      status: pass ? "PASS" : "FAIL",
      detail: `crm=${listed.status} client=${hasClient} booking=${hasBooking} recId=${idIsRec} secret=${Boolean(secret)}`,
    });

    const site = await fetch(`${base}/site/${c.id}?lang=${c.lang}`);
    const html = await site.text();
    const noSeedClients =
      !/Водитель Ганс|Driver Hans|seed|demo.?client/i.test(html) ||
      /popular|service|appointment|order|inquiry/i.test(html);
    rows.push({
      niche: `site-page-${c.sectorId}`,
      status: site.status === 200 ? "PASS" : "FAIL",
      detail: `HTTP ${site.status}`,
    });
    rows.push({
      niche: `site-no-seed-${c.sectorId}`,
      status: site.status === 200 && !html.includes("Водитель Ганс") ? "PASS" : "FAIL",
      detail: noSeedClients ? "no seed names" : "seed leakage?",
    });
  }

  // Cross-tenant: secret A must not read client B
  {
    const a = CASES[0];
    const b = CASES[1];
    const wrong = await getCrmLeads(b.id, secrets[a.id] || "x".repeat(64));
    rows.push({
      niche: "cross-tenant-isolation",
      status: wrong.status === 401 ? "PASS" : "FAIL",
      detail: `HTTP ${wrong.status}`,
    });
  }

  // Rate limit (same IP, same client)
  {
    const c = CASES[0];
    writeManifest(c.id, c);
    let hit429 = false;
    for (let i = 0; i < 8; i += 1) {
      const res = await fetch(`${base}/api/leads/${c.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "198.51.100.77, 10.0.0.1",
          "x-real-ip": "198.51.100.77",
        },
        body: JSON.stringify({
          name: `Rate ${i}`,
          phone: `+49171111${String(1000 + i)}`,
          language: "en",
        }),
      });
      if (res.status === 429) {
        hit429 = true;
        break;
      }
    }
    rows.push({
      niche: "rate-limit",
      status: hit429 ? "PASS" : "FAIL",
      detail: hit429 ? "429 received" : "no 429 within 8 posts",
    });
  }

  const failed = rows.filter((r) => r.status !== "PASS");
  console.log("\nResults:");
  for (const r of rows) {
    console.log(`${r.status}\t${r.niche}\t${r.detail}`);
  }
  console.log(`\n${rows.length - failed.length}/${rows.length} PASS`);
  const out = path.join(root, "docs/leads-local-verify.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify({ base, generatedAt: new Date().toISOString(), rows }, null, 2)}\n`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
