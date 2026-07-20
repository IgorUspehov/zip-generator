#!/usr/bin/env node
/**
 * Production verify for leads security (manifests via railway ssh tee/cat).
 */
import { execSync, spawnSync } from "node:child_process";

const BASE = process.env.VERIFY_BASE_URL || "https://saas-mvp-funnel-production.up.railway.app";
const RUN = Date.now();

function sshCat(path) {
  const out = execSync(`railway ssh -- cat ${path}`, { encoding: "utf8", maxBuffer: 2_000_000 });
  return out.replace(/^Using SSH key from agent:.*\n/, "").trim();
}

function writeManifest(clientId, meta) {
  const payload = JSON.stringify({
    clientId,
    businessName: `Prod Sec ${meta.niche || clientId}`,
    businessType: meta.businessType,
    sectorId: meta.niche || "generic",
    language: meta.lang || "de",
    city: "Berlin",
    phone: "+491701111111",
    email: `${clientId}@example.com`,
  });
  const r = spawnSync("railway", ["ssh", "--", "tee", `/app/data/manifests/${clientId}.json`], {
    input: `${payload}\n`,
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`tee failed: ${r.stderr || r.stdout}`);
}

function readSecret(clientId) {
  const raw = sshCat(`/app/data/manifests/${clientId}.json`);
  try {
    const m = JSON.parse(raw);
    return typeof m.leadsReadSecret === "string" ? m.leadsReadSecret : "";
  } catch {
    return "";
  }
}

function hasPii(body) {
  if (!body || typeof body !== "object") return false;
  if (body.client || body.booking || body.order) return true;
  if (Array.isArray(body.clients) || Array.isArray(body.appointments) || Array.isArray(body.orders)) return true;
  if (typeof body.name === "string" || typeof body.phone === "string") return true;
  return false;
}

async function postLead(clientId, lang, name, phone, ip) {
  const res = await fetch(`${BASE}/api/leads/${encodeURIComponent(clientId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": ip,
      "x-forwarded-for": `${ip}, 10.0.0.1`,
    },
    body: JSON.stringify({
      name,
      phone,
      service: "Prod verify",
      comment: "prod-sec",
      language: lang,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getPublic(clientId) {
  const res = await fetch(`${BASE}/api/leads/${encodeURIComponent(clientId)}`, { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function getCrm(clientId, token) {
  const headers = {};
  if (token) headers["x-crm-leads-token"] = token;
  const res = await fetch(`${BASE}/api/crm/leads/${encodeURIComponent(clientId)}`, {
    cache: "no-store",
    headers,
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

const niches = [
  { id: `prod-sec-beauty-${RUN}`, niche: "beauty", businessType: "beauty_salon", lang: "ru", mode: "appointment", section: "appointments" },
  { id: `prod-sec-dental-${RUN}`, niche: "dental", businessType: "dental_clinic", lang: "de", mode: "appointment", section: "appointments" },
  { id: `prod-sec-shop-${RUN}`, niche: "shop", businessType: "ecommerce", lang: "en", mode: "order", section: "orders" },
  { id: `prod-sec-accounting-${RUN}`, niche: "accounting", businessType: "accounting", lang: "de", mode: "inquiry", section: "appointments" },
  { id: `prod-sec-logistics-${RUN}`, niche: "logistics", businessType: "logistics", lang: "ru", mode: "inquiry", section: "appointments" },
];

const rows = [];
let allPass = true;

function add(niche, lang, post, crm, getPublicStatus, protectedGet, rateLimit, status) {
  rows.push({ niche, lang, post, crm, getPublic: getPublicStatus, protectedGet, rateLimit, status });
  if (status !== "PASS") allPass = false;
}

for (const c of niches) writeManifest(c.id, c);

{
  const pub = await getPublic(niches[0].id);
  add("_public_get", "-", "-", "-", String(pub.status), "-", "-", pub.status === 405 && !hasPii(pub.body) ? "PASS" : "FAIL");
}

{
  const id = `prod-sec-dedupe-${RUN}`;
  writeManifest(id, { niche: "dedupe", businessType: "beauty_salon", lang: "ru" });
  const phone = `+49170${String(Date.now()).slice(-8)}`;
  const a = await postLead(id, "ru", "Dedupe One", phone, "203.0.113.210");
  const b = await postLead(id, "ru", "Dedupe One", phone, "203.0.113.211");
  const secret = readSecret(id);
  const listed = await getCrm(id, secret);
  const clients = (listed.body.clients || []).filter((c) => String(c.phone) === phone);
  const apts = (listed.body.appointments || []).filter((x) => String(x.phone) === phone);
  const seed = [...(listed.body.clients || []), ...(listed.body.appointments || [])].some((x) => x.source === "seed");
  const ok =
    a.status === 201 &&
    b.status === 201 &&
    !hasPii(a.body) &&
    listed.status === 200 &&
    clients.length === 1 &&
    apts.length >= 2 &&
    !seed;
  add(
    "dedupe-phone",
    "ru",
    a.status === 201 && b.status === 201 ? "201x2" : `A${a.status}/B${b.status}`,
    `clients=${clients.length};apt=${apts.length}`,
    "-",
    String(listed.status),
    "-",
    ok ? "PASS" : "FAIL",
  );
}

{
  const c = niches[0];
  const phone = `+49171${String(Date.now()).slice(-8)}`;
  await postLead(c.id, c.lang, "Auth Probe", phone, "203.0.113.220");
  const secret = readSecret(c.id);
  const noTok = await getCrm(c.id, "");
  const badTok = await getCrm(c.id, "a".repeat(64));
  const good = await getCrm(c.id, secret);
  const man = await (await fetch(`${BASE}/api/manifest/${c.id}`)).text();
  const site = await (await fetch(`${BASE}/site/${c.id}?lang=${c.lang}`)).text();
  const leak =
    Boolean(secret && (man.includes(secret) || site.includes(secret))) ||
    /leadsReadSecret\s*"?\s*:/.test(man);
  const authOk =
    [401, 403].includes(noTok.status) &&
    [401, 403].includes(badTok.status) &&
    good.status === 200 &&
    !leak;
  add(
    "auth-matrix",
    "-",
    "-",
    leak ? "LEAK" : "scoped",
    "-",
    `none=${noTok.status};bad=${badTok.status};ok=${good.status}`,
    "-",
    authOk ? "PASS" : "FAIL",
  );

  const d = niches[1];
  await postLead(d.id, d.lang, "Tenant B", `+49172${String(Date.now()).slice(-8)}`, "203.0.113.221");
  const secretB = readSecret(d.id);
  const wrong = await getCrm(d.id, secret);
  const right = await getCrm(d.id, secretB);
  const crossOk = [401, 403].includes(wrong.status) && right.status === 200;
  add(
    "cross-tenant",
    "-",
    "-",
    crossOk ? "isolated" : "LEAK",
    "-",
    `wrong=${wrong.status};right=${right.status}`,
    "-",
    crossOk ? "PASS" : "FAIL",
  );
}

for (const c of niches) {
  const phone = `+49174${String(Date.now()).slice(-7)}${Math.floor(Math.random() * 9)}`;
  const name = `Lead ${c.niche}`;
  const posted = await postLead(c.id, c.lang, name, phone, `198.51.100.${40 + niches.indexOf(c)}`);
  const pub = await getPublic(c.id);
  const secret = readSecret(c.id);
  const crm = await getCrm(c.id, secret);
  const clients = crm.body.clients || [];
  const hit = clients.some((x) => String(x.phone) === phone && String(x.name) === name);
  const appointments = crm.body.appointments || [];
  const orders = crm.body.orders || [];
  const section =
    c.section === "orders" ? orders.length > 0 && appointments.length > 0 : appointments.length > 0;
  const site = await fetch(`${BASE}/site/${c.id}?lang=${c.lang}`);
  const siteHtml = await site.text();
  const siteOk =
    site.status === 200 &&
    !/Водитель Ганс|Driver Hans/.test(siteHtml) &&
    !(secret && siteHtml.includes(secret));
  const postOk =
    posted.status === 201 &&
    posted.body?.ok === true &&
    posted.body?.mode === c.mode &&
    !hasPii(posted.body);
  const getOk = pub.status === 405 && !hasPii(pub.body);
  const protOk = crm.status === 200 && hit && section && Boolean(secret);
  const pass = postOk && getOk && protOk && siteOk;
  add(
    c.niche,
    c.lang,
    postOk ? `201/${c.mode}` : `FAIL ${posted.status}`,
    protOk ? `${c.section}+client` : `FAIL ${crm.status}`,
    String(pub.status),
    String(crm.status),
    "-",
    pass ? "PASS" : "FAIL",
  );
}

{
  const id = `prod-sec-rate-${RUN}`;
  writeManifest(id, { niche: "rate", businessType: "beauty_salon", lang: "en" });
  const ip = `203.0.113.${60 + (Date.now() % 40)}`;
  const statuses = [];
  for (let i = 0; i < 6; i += 1) {
    const res = await postLead(id, "en", `Rate ${i}`, `+4917999${String(3000 + i)}`, ip);
    statuses.push(res.status);
  }
  const ok = statuses.slice(0, 5).every((s) => s === 201) && statuses[5] === 429;
  add(
    "rate-limit",
    "-",
    statuses.join(","),
    "-",
    "-",
    "-",
    ok ? "5ok+429" : statuses.join("/"),
    ok ? "PASS" : "FAIL",
  );
}

console.log("ниша | язык | POST | CRM | GET public=405 | protected GET | rate limit | PASS/FAIL");
for (const r of rows) {
  console.log(
    `${r.niche} | ${r.lang} | ${r.post} | ${r.crm} | ${r.getPublic} | ${r.protectedGet} | ${r.rateLimit} | ${r.status}`,
  );
}
console.log(allPass ? "OVERALL PASS" : "OVERALL FAIL");
process.exit(allPass ? 0 : 1);
