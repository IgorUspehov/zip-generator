#!/usr/bin/env node
/**
 * Close leads-security checklist (f07163f+). Local only.
 * Usage: node scripts/verify-leads-security-close.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] || process.env.VERIFY_BASE_URL || "http://127.0.0.1:3011").replace(
  /\/$/,
  "",
);

const NICHES = [
  { id: "sec-beauty", businessType: "beauty_salon", niche: "beauty", lang: "ru", mode: "appointment", section: "appointments" },
  { id: "sec-dental", businessType: "dental_clinic", niche: "dental", lang: "de", mode: "appointment", section: "appointments" },
  { id: "sec-shop", businessType: "ecommerce", niche: "shop", lang: "en", mode: "order", section: "orders" },
  { id: "sec-accounting", businessType: "accounting", niche: "accounting", lang: "de", mode: "inquiry", section: "appointments" },
  { id: "sec-logistics", businessType: "logistics", niche: "logistics", lang: "ru", mode: "inquiry", section: "appointments" },
];

const RATE_CLIENT = `sec-rate-${Date.now()}`;
const DEDUPE_CLIENT = `sec-dedupe-${Date.now()}`;

function dataDir() {
  return process.env.CRM_DATA_DIR || process.env.DATA_DIR || path.join(root, "data");
}

function writeManifest(clientId, meta) {
  const dir = path.join(dataDir(), "manifests");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${clientId}.json`);
  const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  const manifest = {
    ...prev,
    clientId,
    businessName: `Sec ${meta.niche || clientId}`,
    businessType: meta.businessType,
    sectorId: meta.niche || meta.sectorId || "generic",
    language: meta.lang || "de",
    city: "Berlin",
    phone: "+491701111111",
    email: `${clientId}@example.com`,
  };
  // Keep existing secret if present; never invent in test output files for public checks
  fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
}

function readSecret(clientId) {
  const file = path.join(dataDir(), "manifests", `${clientId}.json`);
  if (!fs.existsSync(file)) return "";
  try {
    const m = JSON.parse(fs.readFileSync(file, "utf8"));
    return typeof m.leadsReadSecret === "string" ? m.leadsReadSecret : "";
  } catch {
    return "";
  }
}

function hasPii(body) {
  if (!body || typeof body !== "object") return false;
  if (body.client || body.booking || body.order) return true;
  if (Array.isArray(body.clients) || Array.isArray(body.appointments) || Array.isArray(body.orders)) {
    return true;
  }
  if (typeof body.name === "string" || typeof body.phone === "string") return true;
  return false;
}

function looksLikeSecretLeak(text, secret) {
  if (!text) return false;
  if (secret && secret.length >= 32 && text.includes(secret)) return true;
  // Field must not appear with a value in public JSON; bare identifier in source is ok only if no secret value.
  if (/leadsReadSecret\s*"?\s*:/.test(text)) return true;
  return false;
}

async function postLead(clientId, lang, name, phone, ip) {
  const res = await fetch(`${base}/api/leads/${encodeURIComponent(clientId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": ip,
      "x-forwarded-for": `${ip}, 10.0.0.1`,
    },
    body: JSON.stringify({
      name,
      phone,
      service: "Security verify",
      comment: "sec-close",
      language: lang,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getPublic(clientId) {
  const res = await fetch(`${base}/api/leads/${encodeURIComponent(clientId)}`, { cache: "no-store" });
  const text = await res.text();
  let body = {};
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 200) };
  }
  return { status: res.status, body, text };
}

async function getCrm(clientId, token) {
  const headers = {};
  if (token) headers["x-crm-leads-token"] = token;
  const res = await fetch(`${base}/api/crm/leads/${encodeURIComponent(clientId)}`, {
    cache: "no-store",
    headers,
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getManifest(clientId) {
  const res = await fetch(`${base}/api/manifest/${encodeURIComponent(clientId)}`, { cache: "no-store" });
  const text = await res.text();
  return { status: res.status, text };
}

function sectionOk(mode, section, body) {
  const clients = body.clients || [];
  const appointments = body.appointments || [];
  const orders = body.orders || [];
  if (!clients.length) return false;
  if (section === "orders") return orders.length > 0 && appointments.length > 0;
  return appointments.length > 0;
}

async function main() {
  const rows = [];
  const secretLeakFails = [];

  // Shared checks once
  {
    writeManifest(NICHES[0].id, NICHES[0]);
    const pub = await getPublic(NICHES[0].id);
    const pubOk =
      pub.status === 405 &&
      !hasPii(pub.body) &&
      !/[+]49\d{6,}|@example\.com|Site Lead|Security verify/i.test(pub.text);
    rows.push({
      niche: "_public_get",
      lang: "-",
      post: "-",
      crm: "-",
      getPublic: pub.status === 405 ? "405" : String(pub.status),
      protectedGet: "-",
      rateLimit: "-",
      status: pubOk ? "PASS" : "FAIL",
    });
  }

  // Dedupe phone + seed untouched (API only writes source=site_form)
  {
    writeManifest(DEDUPE_CLIENT, {
      niche: "dedupe",
      businessType: "beauty_salon",
      lang: "ru",
    });
    const phone = `+49170${String(Date.now()).slice(-8)}`;
    const ip = "203.0.113.10";
    const a = await postLead(DEDUPE_CLIENT, "ru", "Dedupe One", phone, ip);
    const b = await postLead(DEDUPE_CLIENT, "ru", "Dedupe One", phone, "203.0.113.11");
    const secret = readSecret(DEDUPE_CLIENT);
    const listed = await getCrm(DEDUPE_CLIENT, secret);
    const clients = listed.body.clients || [];
    const appointments = listed.body.appointments || [];
    const samePhoneClients = clients.filter((c) => String(c.phone) === phone);
    const bookings = appointments.filter((x) => String(x.phone) === phone);
    const seedTouch = [...clients, ...appointments].some((x) => x.source === "seed");
    const ok =
      a.status === 201 &&
      b.status === 201 &&
      !hasPii(a.body) &&
      !hasPii(b.body) &&
      listed.status === 200 &&
      samePhoneClients.length === 1 &&
      bookings.length >= 2 &&
      !seedTouch;
    rows.push({
      niche: "dedupe-phone",
      lang: "ru",
      post: a.status === 201 && b.status === 201 ? "201x2" : `A${a.status}/B${b.status}`,
      crm: `clients=${samePhoneClients.length};apt=${bookings.length};seed=${seedTouch}`,
      getPublic: "-",
      protectedGet: String(listed.status),
      rateLimit: "-",
      status: ok ? "PASS" : "FAIL",
    });
  }

  // Auth matrix on first niche after a post
  {
    const c = NICHES[0];
    writeManifest(c.id, c);
    const phone = `+49171${String(Date.now()).slice(-8)}`;
    await postLead(c.id, c.lang, "Auth Probe", phone, "203.0.113.20");
    const secret = readSecret(c.id);
    const noTok = await getCrm(c.id, "");
    const badTok = await getCrm(c.id, "a".repeat(64));
    const good = await getCrm(c.id, secret);
    const man = await getManifest(c.id);
    if (looksLikeSecretLeak(man.text, secret)) secretLeakFails.push("manifest");
    const site = await fetch(`${base}/site/${c.id}?lang=${c.lang}`);
    const siteHtml = await site.text();
    if (looksLikeSecretLeak(siteHtml, secret)) secretLeakFails.push("site-html");
    const jsBundle = path.join(
      root,
      "artifacts/factory_output/react_mvp/dist/assets",
    );
    let bundleLeak = false;
    if (fs.existsSync(jsBundle)) {
      for (const f of fs.readdirSync(jsBundle)) {
        if (!f.endsWith(".js")) continue;
        const txt = fs.readFileSync(path.join(jsBundle, f), "utf8");
        if (looksLikeSecretLeak(txt, secret)) {
          bundleLeak = true;
          break;
        }
      }
    }
    if (bundleLeak) secretLeakFails.push("js-bundle");

    // prepared HTML must not contain secret
    const { prepareClientDistWithOgImage, cleanupClientDist } = await import(
      "../src/lib/og-image/prepare-client-dist.ts"
    ).catch(() => ({ prepareClientDistWithOgImage: null, cleanupClientDist: null }));
    // skip ts import in plain node — check via reading prepare output not available; use grep source
    const prepareSrc = fs.readFileSync(
      path.join(root, "src/lib/og-image/prepare-client-dist.ts"),
      "utf8",
    );
    if (/__CRM_LEADS_READ_SECRET__/.test(prepareSrc)) secretLeakFails.push("prepare-injects-html");

    const authOk =
      [401, 403].includes(noTok.status) &&
      [401, 403].includes(badTok.status) &&
      good.status === 200 &&
      secretLeakFails.length === 0 &&
      !looksLikeSecretLeak(JSON.stringify(good.body), secret);
    rows.push({
      niche: "auth-matrix",
      lang: "-",
      post: "-",
      crm: authOk ? "scoped" : `leaks=${secretLeakFails.join(",") || "none"}`,
      getPublic: "-",
      protectedGet: `none=${noTok.status};bad=${badTok.status};ok=${good.status}`,
      rateLimit: "-",
      status: authOk ? "PASS" : "FAIL",
    });
  }

  // Cross-tenant
  {
    const a = NICHES[0];
    const b = NICHES[1];
    writeManifest(a.id, a);
    writeManifest(b.id, b);
    await postLead(a.id, a.lang, "Tenant A", `+49172${String(Date.now()).slice(-8)}`, "203.0.113.30");
    await postLead(b.id, b.lang, "Tenant B", `+49173${String(Date.now()).slice(-8)}`, "203.0.113.31");
    const secretA = readSecret(a.id);
    const secretB = readSecret(b.id);
    const wrong = await getCrm(b.id, secretA);
    const right = await getCrm(b.id, secretB);
    const phonesA = (await getCrm(a.id, secretA)).body.clients?.map((c) => c.phone) || [];
    const leak = (right.body.clients || []).some((c) => phonesA.includes(c.phone));
    const ok = [401, 403].includes(wrong.status) && right.status === 200 && !leak;
    rows.push({
      niche: "cross-tenant",
      lang: "-",
      post: "-",
      crm: ok ? "isolated" : "LEAK",
      getPublic: "-",
      protectedGet: `wrong=${wrong.status};right=${right.status}`,
      rateLimit: "-",
      status: ok ? "PASS" : "FAIL",
    });
  }

  // Niches
  for (const c of NICHES) {
    writeManifest(c.id, c);
    const phone = `+49174${String(Date.now()).slice(-7)}${Math.floor(Math.random() * 9)}`;
    const name = `Lead ${c.niche}`;
    const posted = await postLead(c.id, c.lang, name, phone, `198.51.100.${20 + NICHES.indexOf(c)}`);
    const pub = await getPublic(c.id);
    const secret = readSecret(c.id);
    const crm = await getCrm(c.id, secret);
    const clients = crm.body.clients || [];
    const hit = clients.some((x) => String(x.phone) === phone && String(x.name) === name);
    const section = sectionOk(c.mode, c.section, crm.body);
    const site = await fetch(`${base}/site/${c.id}?lang=${c.lang}`);
    const siteHtml = await site.text();
    const siteOk =
      site.status === 200 &&
      !/Водитель Ганс|Driver Hans/.test(siteHtml) &&
      !looksLikeSecretLeak(siteHtml, secret);
    const postOk = posted.status === 201 && posted.body?.ok === true && posted.body?.mode === c.mode && !hasPii(posted.body);
    const getOk = pub.status === 405 && !hasPii(pub.body);
    const protOk = crm.status === 200 && hit && section && Boolean(secret);
    const pass = postOk && getOk && protOk && siteOk;
    rows.push({
      niche: c.niche,
      lang: c.lang,
      post: postOk ? `201/${c.mode}` : `FAIL ${posted.status}`,
      crm: protOk ? `${c.section}+client` : `FAIL ${crm.status}`,
      getPublic: String(pub.status),
      protectedGet: String(crm.status),
      rateLimit: "-",
      status: pass ? "PASS" : "FAIL",
    });
  }

  // Rate limit — dedicated clientId
  {
    writeManifest(RATE_CLIENT, { niche: "rate", businessType: "beauty_salon", lang: "en" });
    const ip = `203.0.113.${50 + (Date.now() % 100)}`;
    const statuses = [];
    for (let i = 0; i < 6; i += 1) {
      const res = await postLead(
        RATE_CLIENT,
        "en",
        `Rate ${i}`,
        `+4917999${String(1000 + i)}`,
        ip,
      );
      statuses.push(res.status);
    }
    const first5 = statuses.slice(0, 5);
    const sixth = statuses[5];
    const ok = first5.every((s) => s === 201) && sixth === 429;
    rows.push({
      niche: "rate-limit",
      lang: "-",
      post: statuses.join(","),
      crm: "-",
      getPublic: "-",
      protectedGet: "-",
      rateLimit: ok ? "5ok+429" : `got ${statuses.join("/")}`,
      status: ok ? "PASS" : "FAIL",
    });
  }

  // Print table
  console.log("ниша | язык | POST | CRM | GET public=405 | protected GET | rate limit | PASS/FAIL");
  for (const r of rows) {
    if (r.niche.startsWith("_") || r.niche === "auth-matrix" || r.niche === "cross-tenant" || r.niche === "dedupe-phone" || r.niche === "rate-limit") {
      console.log(
        `${r.niche} | ${r.lang} | ${r.post} | ${r.crm} | ${r.getPublic} | ${r.protectedGet} | ${r.rateLimit} | ${r.status}`,
      );
      continue;
    }
    console.log(
      `${r.niche} | ${r.lang} | ${r.post} | ${r.crm} | ${r.getPublic} | ${r.protectedGet} | ${r.rateLimit} | ${r.status}`,
    );
  }

  const failed = rows.filter((r) => r.status !== "PASS");
  const out = path.join(root, "docs/leads-security-close.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    `${JSON.stringify({ base, generatedAt: new Date().toISOString(), secretLeakFails, rows }, null, 2)}\n`,
  );
  console.log(`\n${rows.length - failed.length}/${rows.length} PASS`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
