# DEPLOYABLE ZIP V2 — Technical Design

**Date:** 2026-08-20  
**Repo:** `saas-mvp-funnel`  
**Input report:** `docs/THREE_BRANCH_ARCHITECTURE.md`  
**Constraint:** analysis and architectural proposal only — no code, branch, commit, push, Polar, DB, or deployment changes were made for this document.

Every claim is grounded in current repository files. Absent items are marked **НЕ НАЙДЕНО**. Items that need a product/architecture change (not a thin wrapper) are marked **ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ**.

---

## 1. CURRENT ZIP ARCHITECTURE

### Pipeline that produces the only real SaaS client artifact

```
POST /api/client-questionnaire
  → prepareClientDistWithOgImage(shared MVP dist, manifest)
       • cpSync source dist → staging
       • ensureImageLibraryInDist (niche + generic only)
       • stripLeadsSecrets → write client-manifest.json into staging
       • patch index.html: __CRM_DEMO_CLIENT_ID__, __CRM_DEMO_MANIFEST__
       • write Cloudflare _headers (frame-ancestors → Railway / webstudio-muenchen.com)
  → Cloudflare Pages deploy (hosted preview; not part of ZIP binary)
  → persistClientDistSnapshot(clientId, staging)
       → data/…/client-dists/{clientId}/dist
```

Evidence:

| Step | File |
|---|---|
| Questionnaire + snapshot | `src/app/api/client-questionnaire/route.ts` |
| Dist personalization | `src/lib/og-image/prepare-client-dist.ts` |
| Volume store | `src/lib/site-delivery/dist-store.ts` |
| Shared shell source | `src/lib/cloudflare/deploy.ts` → `resolveMvpDistPath()` (`artifacts/factory_output/react_mvp/dist`, `client-template/dist`, …) |
| Packer | `src/lib/mvp-pro/zip-stream.ts` → `createMvpProZipStream` |

### What “ZIP” means today (two realities)

1. **Deployable-ish static package** — packs per-client `dist` + README (+ optional root manifest). Used by paid email download routes.
2. **README-only “ZIP”** — Admin button packs only hosted SaaS URLs. Not deployable.

There is **no** single named “Deployable ZIP Builder” module. Packing is duplicated across routes with different auth and dist resolvers.

---

## 2. ZIP TYPES CURRENTLY FOUND

| # | Mechanism | Auth | Dist source | Contents | Used when |
|---|---|---|---|---|---|
| A | `GET /api/download-site` | `clientId` + download token (7-day TTL) | **`client-dists/{clientId}/dist`** via `src/lib/site-delivery/dist-store.ts` | Full dist + short README + optional root `client-manifest.json` | Post-payment email: `fulfillCrmDemoOrder`, `fulfillPaidSiteDelivery` |
| B | `GET /api/download-zip` | MVP Pro entitlement token | `src/lib/mvp-pro/dist-resolver.ts`: `artifacts/{clientId}/dist` **or fallback shared MVP dist** | Full dist + `buildMvpProReadme` + optional root `client-manifest.json` | `fulfillMvpProOrder` (Polar `recurring` / LemonSqueezy MVP Pro) |
| C | `GET /api/admin/download-zip` | Admin session cookie | **None** | **Only `README.md`** with `https://webstudio-muenchen.com` `/site`, `/demo`, `/admin` links | Admin Overview button |
| D | `createCrmDemoZipStream` / `buildCrmDemoZipBuffer` | N/A | Same idea as A, README as `README.txt`, optional email GIF filter | Defined in `zip-stream.ts` | **НЕ НАЙДЕНО** call sites — dead / unused |
| E | `buildClientDistZipBuffer` | N/A | Wrapper over `createMvpProZipStream` | Buffer variant | **НЕ НАЙДЕНО** production callers (routes use stream) |
| F | `GET /api/client-delivery/download` | None | Factory materializer `final_package.zip` | Factory package (legacy V2 / client_delivery) | Factory preview/result path — **not** live SaaS CRM Demo ZIP |
| G | `GET /api/client-delivery-v2/download` | None | `artifacts/factory_output/client_delivery_v2/final_package.zip` | Prebuilt factory ZIP | Factory V2 — **not** live SaaS ZIP |

### Answers to the audit questions

1. **Which ZIPs really contain dist?**  
   A (`/api/download-site`), B (`/api/download-zip`), and factory F/G when their files exist. **Not** C (admin).

2. **Which ZIPs contain only README?**  
   C — `src/app/api/admin/download-zip/route.ts`.

3. **Where is assembly?**  
   - Dist build: Vite `react_mvp` (prebuilt artifact on server).  
   - Personalization: `prepareClientDistWithOgImage`.  
   - ZIP archive: `createMvpProZipStream` (A/B) or inline archiver (C) or factory materializer (F).

4. **What files go inside (A/B when dist exists)?**  
   - Entire `distPath` tree at ZIP root: typically `index.html`, hashed `assets/`, niche `image-library/…`, baked `client-manifest.json`, `_headers`.  
   - `README.md` (A: one-liner; B: multilingual MVP Pro text).  
   - Optional root `client-manifest.json` from `data/manifests/{clientId}.json` via `readManifestJson` (**note:** server copy may still differ from stripped public artifact if secrets were only stripped in staging — see §12).

5. **What does NOT go in?**  
   Next.js Admin UI, public SSR `/site` pages, `/api/*` route handlers, Firebase Admin keys, Polar/Railway/Cloudflare secrets, Redis (N/A), other tenants’ dists, cookies, production `.env`.

6. **ZIP after payment (current €199 / crm_demo / paid site)?**  
   **A** — link to `/api/download-site?clientId&token` (`src/lib/crm-demo/fulfillment.ts`, `src/lib/site-delivery/post-payment-email.ts`).

7. **ZIP in Admin?**  
   **C** — README-only (`src/app/admin/(protected)/page.tsx` → `/api/admin/download-zip`).

8. **Different formats?**  
   Yes: README-only vs dist+README; MVP Pro vs site filenames (`mvp-pro-*.zip` / `site-*.zip` / `{slug}.zip`); unused CRM Demo stream uses `README.txt` + root `manifest.json`; factory packages differ entirely.

9. **Future delete / merge**  
   - **Keep / promote:** single packer based on `createMvpProZipStream` + **always** `client-dists/{clientId}/dist`.  
   - **Fix or replace:** admin C → same packer.  
   - **Unify B:** stop using `mvp-pro/dist-resolver` shared-dist fallback for customer ZIP.  
   - **Delete or quarantine:** unused `createCrmDemoZipStream` path; treat F/G as factory-only, not Deployable ZIP V2.  
   - **Policy:** stop complimentary ZIP on €199 when €999 ships (commercial; see THREE_BRANCH §14).

---

## 3. CANONICAL ZIP ARCHITECTURE

### Principle

```
MASTER (saas-mvp-funnel)
        │
        ▼
 Deployable ZIP Builder   ← ONE module / one packer contract
        │
        ▼
   ZIP + README
        │
   ┌────┼────────────────┐
   ▼    ▼                ▼
OWNER  SUBSCRIPTION€999  MARKETPLACE
(direct) (entitlement)   (SKU artifact)
```

**Do not** maintain three packers. Differ only by:

| Dimension | OWNER | €999 | Marketplace |
|---|---|---|---|
| Entitlement | Admin/owner session | One-time paid entitlement | External storefront / CI upload |
| Dist input | `client-dists/{clientId}` | Same | Template or sanitized sample client |
| README variant | Operator / self-host | Customer self-host + support | Buyer digital product |
| Polar | Forbidden | Required for purchase gate only | Outside this app |

### Proposed Builder contract (design only — no code)

```
buildDeployableZip({
  clientId,                 // required for OWNER / €999
  mode: "owner" | "subscription_export" | "marketplace",
  distPath,                 // MUST be per-client snapshot for personalized modes
  manifestPublic,           // already stripLeadsSecrets
  readmeVariant,
}) → { stream | buffer, filename }
```

Internally: **only** `createMvpProZipStream` (or rename to `createDeployableZipStream`).

### Dist truth rule

| Mode | Allowed dist source |
|---|---|
| OWNER / €999 | `resolveClientDistPath` from **`src/lib/site-delivery/dist-store.ts` only** |
| Marketplace template | Dedicated sanitized staging built from `react_mvp` + sample/public manifest — **never** another live tenant’s volume without consent |

**Forbidden for customer ZIP:** `mvp-pro/dist-resolver` fallback to shared `resolveMvpDistPath()` — that can ship a **non-personalized shared shell** under a client’s filename (**data / product integrity risk**).

---

## 4. ZIP CONTENT

### Target contents (Deployable ZIP V2)

| Path in ZIP | Purpose |
|---|---|
| `index.html` | CRM/marketing shell entry; may include baked `__CRM_DEMO_*` for that client |
| `assets/**` | Vite-built JS/CSS |
| `image-library/{niche}/**`, `image-library/generic/**` | Niche images staged by `ensureImageLibraryInDist` |
| `client-manifest.json` | Public personalization (stripped secrets) — prefer the **staging** copy, not raw server secrets file |
| `_headers` | Optional Cloudflare Pages CSP; document as host-specific |
| `README.md` | Mode-specific deploy + dependency docs |
| (optional) `.env.example` | Buyer placeholders only — **never** real secrets |

### What the current “full” ZIP actually is

A **static Vite CRM demo shell** personalized for one `clientId`, not a portable Next.js SaaS.

**НЕ НАЙДЕНО** in current ZIP:

- Next.js public site (`src/app/site/**`)
- Next.js Admin (`src/app/admin/**`)
- Booking/job Next forms (`src/components/public-site/booking-form.tsx`, `job-form.tsx`)
- Server APIs (`src/app/api/leads/**`, `crm/**`, `admin/**`)

### Functional block matrix (verified against source)

Legend: **In ZIP?** / works without Railway / Firebase / Cloudflare / Redis / webstudio-muenchen.com / needs env / needs API keys / needs external backend.

| Block | In ZIP? | w/o Railway | w/o Firebase | w/o Cloudflare | w/o Redis | w/o webstudio-muenchen.com | Env vars | API keys | External backend |
|---|---|---|---|---|---|---|---|---|---|
| **FRONTEND** (react_mvp UI) | Yes (dist) | Yes (any static host) | Yes | Yes | Yes (Redis **НЕ НАЙДЕНО**) | Yes for UI shell | Optional `VITE_MANIFEST_API_BASE` at **build** time | No in ZIP | No for static UI |
| **CRM** (clients/appointments UI) | Yes | Yes | Yes | Yes | Yes | Yes for localStorage CRUD (`useCrmRecords.js`) | No | No | No for local-only; Yes if syncing leads from API |
| **CATALOG** | Client sync code in dist | Partial | Sync uses SaaS Firestore APIs | Yes | Yes | **No** if default API base kept — hardcodes `https://webstudio-muenchen.com` (`sync-crm-catalog.js`) | Buyer must set own API base (**ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ** for runtime config) | Buyer’s backend keys on **their** server | Yes for cloud sync |
| **VACANCIES** | Same | Partial | Same pattern (`sync-crm-vacancies.js`) | Yes | Yes | **No** with default host | Same | Same | Yes for cloud sync |
| **BOOKING** (public Next forms) | **No** | N/A in ZIP | N/A | N/A | N/A | N/A | — | — | Hosted SaaS only today |
| **ADMIN** (Next magic-link panel) | **No** | N/A | N/A | N/A | N/A | N/A | — | — | Hosted SaaS only |
| **CONTACTS** | In baked manifest / local settings | Yes (static display) | Yes | Yes | Yes | Yes | No | No | No |
| **LEADS** | Fetch to SaaS `/api/crm/leads` / public `/api/leads` | **No** for persistence | Prod uses Firestore (`leads/store.ts`); file backend exists for non-prod | Yes | Yes | **No** if pointing at your SaaS | `LEADS_BACKEND` etc. on **backend**, not in ZIP | Firebase Admin on backend | **Yes** for real lead capture |
| **MEDIA** | Niche image-library **yes**; Admin uploads (`client-media`) **no** | Images yes | Yes | Yes | Yes | Yes for packaged images | No | No | Admin media API stays on SaaS |
| **AUTH** | Demo paid-gate calls `/api/demo-access` | Gate degrades if API down | N/A in static ZIP | Yes | Yes | Couples to your origin if left as default | — | — | Paid-gate / admin auth are SaaS features |
| **MANIFEST** | Baked + `./client-manifest.json` fallback | Yes offline via bake/static | Yes | Yes | Yes | Yes if not relying on `/api/manifest` | No | No | Live edits need SaaS `/api/manifest` |
| **CONFIGURATION** | Partial (baked + hardcoded API base) | Yes limited | Yes | Yes | Yes | **Broken coupling** if buyer keeps production default | Build-time Vite env only today | No | Own backend if syncing |
| **API** | Not shipped | — | — | — | — | — | Buyer hosts or uses yours | Buyer’s | Required for full CRM sync / leads |
| **DATABASE** | Not shipped | — | Firebase is SaaS-side | — | Redis **НЕ НАЙДЕНО** | — | Firebase env on SaaS | Firebase Admin **must never** be in ZIP | Required for full hosted product |

**Verdict (unchanged from THREE_BRANCH §8, confirmed in code):**  
ZIP is **partially autonomous** — static CRM UI + localStorage + baked content. Full “Website + CRM + Booking + Admin” as sold on SaaS **requires** an external backend (today: this Railway app + Firebase).

---

## 5. FILES EXCLUDED

Never pack into Deployable ZIP V2:

| Exclude | Reason | Evidence |
|---|---|---|
| `.env`, `.env.local`, Railway/Polar/CF tokens | Secrets | `.env.local.example` lists production secrets |
| `FIREBASE_*` private key / admin JSON | Privilege escalation | `src/lib/firebase/admin.ts` |
| `POLAR_*`, `RESEND_*`, `STORAGE_CLEANUP_SECRET`, `CRM_DEMO_FULFILL_SECRET` | Platform secrets | `.env.local.example` |
| `leadsReadSecret` / `leads_read_secret` | CRM read token | `stripLeadsSecrets` in `src/lib/leads/read-secret.ts` |
| Other clients’ `client-dists/*`, manifests, media | Isolation | Volume layout in `dist-store.ts` |
| Admin session cookies / signing material | Auth | `src/lib/admin/session.ts` |
| Download entitlement stores as product content | Tokens | `site-download-access.json`, `mvp-pro-entitlements` |
| Full multi-niche image library | Size / leakage of unused niches | `ensureImageLibraryInDist` already niches |
| Next.js source / `node_modules` of SaaS | Not the product SKU | Current packer only archives `distPath` |
| Factory-only packages mixed into SaaS SKU | Wrong product | `client-delivery*` routes |

---

## 6. EXTERNAL DEPENDENCIES

| Dependency | Needed for hosted SaaS? | Needed inside ZIP binary? | Buyer needs? | Removable? |
|---|---|---|---|---|
| **Railway** | Yes (Next APIs, admin, `/site`, volume) | No | Only if they want to run **this** monolith | ZIP buyer can use any static host for shell |
| **Cloudflare Pages** | Yes (CRM demo deploys) | No (`_headers` is advisory) | Optional static host | Replace with Netlify/Vercel/S3/etc. |
| **Firebase / Firestore** | Yes (prod leads, catalog, clients) | **Must not** ship Admin creds | Only if buyer runs compatible backend | File backend exists for leads in non-prod (`LEADS_BACKEND=file`) — not a full self-host kit |
| **Polar** | Yes for €199 / future €999 gate | No | No for ZIP contents | OWNER bypass; Marketplace external |
| **Resend** | Magic link / fulfillment email | No | Optional for their fork | N/A in static ZIP |
| **Redis** | **НЕ НАЙДЕНО** | No | No | Omit from README |
| **webstudio-muenchen.com** | Production default API/CSP | Baked as **default JS fallback** | Must be replaced for true independence | **ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ** (runtime `API_BASE` / rebuild) |
| **Netlify** | Deprecated for live CRM path | No | Optional buyer host | `src/lib/netlify/deploy.ts` marked deprecated |

---

## 7. ENVIRONMENT VARIABLES

### SaaS (Master) — not for ZIP

See `.env.local.example`: Polar, Cloudflare, Firebase, Resend, reCAPTCHA, etc.

### Inside / beside ZIP for buyer

| Variable | Today | V2 recommendation |
|---|---|---|
| `VITE_MANIFEST_API_BASE` | Bake-time only in `react_mvp` | Document; ideally runtime `config.json` (**ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ**) |
| Buyer Firebase / DB | Not in ZIP | Only if they self-host a backend clone |
| Polar / Railway / our secrets | Must be absent | Enforce sanitizer checklist |

**Honest README stance:** static hosting needs **no** secrets. Full CRM sync / public booking needs a backend the buyer configures — that is a separate product tier or documented limitation.

---

## 8. MARKETPLACE REQUIREMENTS

### Buyer journey

1. Purchase digital product externally.  
2. Download ZIP + README.  
3. Unpack → read requirements.  
4. Configure API base / credentials **if** using backend features.  
5. Deploy static files (and optionally their own API).

### Must NOT contain

Our Polar/Firebase/Railway/Redis secrets, other clients’ data, cookies, production tokens, Admin credentials — see §5.

### Autonomy disclosure (mandatory in README)

```
PRODUCT CLASS: Partially autonomous static CRM shell
WORKS OUT OF THE BOX: UI, localStorage CRM, baked niche content/images
DOES NOT INCLUDE: Next.js Admin, SSR public site, server lead APIs
DEFAULT API HOST: may still point at webstudio-muenchen.com unless rebuilt/configured
```

### Dependencies table for Marketplace README

| DEPENDENCY | Why | Removable? | Local replace? | Buyer configures |
|---|---|---|---|---|
| Static host | Serve `index.html` | No (need some host) | `npx serve`, Pages, Netlify, S3 | Host account |
| Optional API backend | Catalog/vacancies/leads sync | Yes if local-only CRM OK | Own Next/Firebase or disable sync | `API_BASE` + backend secrets **on their server** |
| Firebase | Only if using Firestore-backed APIs | Yes if local-only | File/DB of their choice | Their Firebase project |
| Cloudflare | Not required | Yes | Any static CDN | Optional |
| Our SaaS origin | Sync defaults | **Should** remove coupling | Point to buyer API or empty | Must not keep our production host for a sold product |

### Marketplace vs client ZIP technically

| | Marketplace | €999 / OWNER |
|---|---|---|
| Packer | **Same** Builder | **Same** |
| Dist | Template / sanitized sample | **That client’s** `client-dists/{id}` |
| Manifest | Generic or sample | Client’s public manifest |
| Images | Template niche set | Client niche (+ their staged assets) |
| README | Digital product + limitations | Customer export + support |

Same packer is preferred; **inputs differ**. Shipping a live tenant’s dist as “Marketplace template” without sanitization is forbidden.

---

## 9. €999 CUSTOMER ZIP REQUIREMENTS

### Product intent

Subscription client (€199/month hosted) pays **€999 one-time** → receives **their** Deployable ZIP + README + support, and may self-host.

### Technical contents

- Their `client-dists/{clientId}/dist` (site shell + niche images + baked public manifest)  
- Their README (self-host + support)  
- **No** other tenants  
- **No** platform secrets  

### Same packer as Marketplace?

**Yes** — identical `createMvpProZipStream` / Deployable ZIP Builder.  
Difference = **entitlement gate + which `clientId` snapshot + README variant**.

### Differs from Marketplace?

| Aspect | Differs? | Why |
|---|---|---|
| Packer code | No | One Builder |
| Payload | Yes | Personalized vs template |
| Entitlement | Yes | Polar €999 vs marketplace SKU |
| Support promise | Yes | Subscription export includes support |

**НЕ НАЙДЕНО today:** Polar one-time €999 ZIP product wiring (tariffs €999 currently Factory bridge — `src/lib/tariffs/copy.ts`, `factory-crm/bridge.ts`).

---

## 10. OWNER ZIP REQUIREMENTS

### Scenario

```
OWNER → create site → edit → Integrations → Download ZIP + README
```

**Without:** Polar, promo, paid check, webhook, subscription, €999.

### Implementation shape (design)

1. Admin session (or `PRODUCT_MODE=owner` bypass) authorizes download.  
2. Call **same** Builder as `/api/download-site` with `client-dists/{session.clientId}`.  
3. Replace current README-only `/api/admin/download-zip`.  
4. Optional Integrations UI entry (today: **НЕ НАЙДЕНО** real Integrations page with ZIP action; only Overview link + CRM stub cards).

### Must not break SaaS

OWNER path is an **auth/entitlement** change + admin route fix; packer reuse avoids forking ZIP formats.

---

## 11. README SPECIFICATION

Generate via one `buildDeployableReadme(mode, ctx)` with sections included **only if required**.

### Required sections (all modes)

1. **Product overview** — what is in the ZIP; partial autonomy statement.  
2. **Requirements** — Node optional (`npx serve`); static host; browser.  
3. **Installation** — unzip; folder layout.  
4. **Environment variables** — only buyer-relevant placeholders; state “none required for static UI”.  
5. **Configuration** — how personalization works (`client-manifest.json`, baked bootstrap); how to change `API_BASE` (document current bake-time limit).  
6. **Local development** — `npx serve .` (current MVP Pro README pattern in `src/lib/mvp-pro/readme.ts`).  
7. **Production deployment** — upload dist to any static host.  
8. **Database setup** — only if documenting optional self-hosted API; otherwise “N/A for static package”.  
9. **API configuration** — catalog/vacancies/leads dependency; warn about default `webstudio-muenchen.com`.  
10. **Domain configuration** — DNS to buyer host; note `_headers` / CSP frame-ancestors may list our origins and should be edited.  
11. **Admin configuration** — **honest:** Admin panel is **not** in this ZIP; editing on SaaS vs editing `client-manifest.json` / rebuild.  
12. **Troubleshooting** — blank CRM, CORS, missing manifest, API 404, wrong clientId.  
13. **Support** — OWNER internal / €999 support contact / Marketplace vendor contact.

### Include only if actually needed

| Section | Include? |
|---|---|
| **Firebase setup** | Only as optional backend appendix — not required to open static site |
| **Railway setup** | Only if buyer clones full SaaS monolith (out of ZIP scope) — **omit** from default Marketplace README |
| **Cloudflare setup** | Optional “deploy to Pages” how-to; not mandatory |
| **Netlify setup** | Optional alternative host; fine as short subsection |

### Mode-specific README rules

| Mode | Must NOT say |
|---|---|
| Marketplace | “Log into webstudio-muenchen.com admin” as the product |
| €999 | Imply full Admin/Booking self-host without backend |
| OWNER | Require Polar payment |

### Current README quality gap

| Source | Gap |
|---|---|
| Admin ZIP README | Hosted links only — not deployable |
| `buildMvpProReadme` | Static serve OK; still implies personalization via `clientId` URL / SaaS |
| `/api/download-site` README | One-line stub — inadequate for Marketplace |

---

## 12. SECURITY REQUIREMENTS

1. **Sanitizer gate** before finalize: strip `leadsReadSecret`, env-like keys, private URLs with embedded tokens.  
2. Prefer packaging **staging public manifest** from `prepareClientDistWithOgImage`, not raw `data/manifests/{id}.json` unless re-stripped (`readManifestJson` today reads raw file — risk if secrets present on disk).  
3. **No** Firebase Admin / Polar / Resend / Railway credentials in tree.  
4. Download tokens remain transport secrets (email URLs); not packed into ZIP.  
5. OWNER download: session auth only; rate-limit.  
6. €999: separate entitlement from monthly `paid` (policy + store).  
7. Marketplace CI: assert zero matches for `BEGIN PRIVATE KEY`, `POLAR_`, `FIREBASE_PRIVATE`.  
8. Fix MVP Pro dist fallback so ZIP never silently packs shared shell as a named client.

---

## 13. DATA ISOLATION

| Risk | Mitigation |
|---|---|
| Wrong `clientId` volume | Builder accepts explicit `clientId`; path only under `client-dists/{id}` |
| Shared MVP dist fallback | Remove for Deployable ZIP V2 |
| Root manifest with secrets | Re-run `stripLeadsSecrets` |
| Multi-tenant CF project | Do not dump project; only snapshot folder |
| Marketplace sample | Dedicated template clientId or synthetic staging |
| CRM localStorage | Browser-local; not cross-tenant server data |

€999 ZIP **is** client-specific by definition. Marketplace ZIP **must not** be an arbitrary live tenant export unless that tenant is the SKU.

---

## 14. DEPLOYMENT OPTIONS

Documented for buyers of the ZIP (static shell):

| Option | Fits ZIP? | Notes |
|---|---|---|
| Any static host + `npx serve` | Yes | Baseline |
| Cloudflare Pages | Yes | `_headers` already CF-oriented |
| Netlify / Vercel static | Yes | Optional |
| Railway static | Possible | Not required |
| Full SaaS clone on Railway + Firebase | **Out of ZIP** | Separate “run the platform” product; **ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ** to package |

SaaS itself unchanged: Railway + Cloudflare + Firebase + Polar remain Subscription hosting.

---

## 15. RECOMMENDED IMPLEMENTATION

### Phase 0 — Decisions (no code)

1. Commercial: €199 = hosted only; ZIP = €999; OWNER free; Marketplace separate SKU.  
2. Product honesty: ZIP = static CRM shell + docs, not full SaaS clone.  
3. Optional later: self-host API kit (**ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ**).

### Phase 1 — Canonical Builder (highest leverage)

1. Introduce `DeployableZipBuilder` wrapping `createMvpProZipStream`.  
2. **Always** resolve dist via `site-delivery/dist-store`.  
3. Rewire `/api/admin/download-zip` → Builder + real dist (OWNER path).  
4. Rewire `/api/download-site` and `/api/download-zip` to Builder; deprecate shared-dist fallback for customer downloads.  
5. Mode-specific README generator meeting §11.  
6. Manifest sanitizer on pack.

### Phase 2 — Entitlements

1. OWNER: session → Builder (no Polar).  
2. Subscription: Polar €999 kind + entitlement store (clone `mvp-pro/entitlement-store` / `fulfillMvpProOrder` pattern).  
3. Gate/remove free ZIP links from €199 emails.  
4. Marketplace: CI pack of sanitized template → upload to storefront.

### Phase 3 — Decouple hardcoded SaaS host

1. Runtime `config.json` or query/env for API base in `react_mvp` (**ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ**).  
2. Until then: README must warn; Marketplace rebuild with empty/placeholder `VITE_MANIFEST_API_BASE`.

### What “one real Deployable ZIP” means in practice

```
A OWNER download     → Builder(client dist)     ✅
B Marketplace sell   → Builder(template dist)   ✅
C €999 fulfillment   → Builder(client dist)     ✅
D No our secrets     → sanitizer                ✅
E Deployable         → static host yes; full SaaS no without backend
F No foreign clientId→ path + entitlement       ✅
G Don’t break SaaS   → additive routes/flags    ✅
```

---

## 16. FILES/MODULES TO MODIFY

| File | Change (future) |
|---|---|
| `src/lib/mvp-pro/zip-stream.ts` | Canonical packer; retire unused CRM Demo stream or mark internal |
| `src/app/api/admin/download-zip/route.ts` | Pack dist + README via Builder |
| `src/app/api/download-site/route.ts` | Call Builder + rich README |
| `src/app/api/download-zip/route.ts` | Use `client-dists` resolver; Builder |
| `src/lib/mvp-pro/dist-resolver.ts` | Stop customer ZIP fallback to shared dist |
| `src/lib/mvp-pro/readme.ts` | Expand / replace with mode README builder |
| `src/lib/crm-demo/fulfillment.ts` | Gate complimentary ZIP when €999 live |
| `src/lib/site-delivery/post-payment-email.ts` | Same policy |
| `src/app/api/webhooks/polar/route.ts` | €999 product kind → ZIP entitlement |
| `src/lib/polar/product-match.ts` / `constants.ts` | €999 product ids |
| `src/app/admin/(protected)/page.tsx` | Keep Download; eventually Integrations |
| `artifacts/factory_output/react_mvp/src/**` | API base configurability (phase 3) |

---

## 17. FILES/MODULES TO CREATE

| Module | Role |
|---|---|
| `src/lib/deployable-zip/builder.ts` (name TBD) | Single entry: resolve dist, sanitize, README, stream |
| `src/lib/deployable-zip/readme.ts` | Mode templates §11 |
| `src/lib/deployable-zip/sanitize.ts` | Manifest / tree secret scan |
| `src/lib/deployable-zip/entitlement.ts` | €999 download grants (or extend mvp-pro store) |
| `scripts/pack-marketplace-zip.*` | CI/offline Marketplace artifact |
| `docs/DEPLOYABLE_ZIP_V2.md` | This design (created) |

**НЕ НАЙДЕНО** today: dedicated Builder module, €999 ZIP product, Marketplace pack script, OWNER Integrations page.

---

## 18. FILES/MODULES NOT TO TOUCH

For ZIP V2 implementation scope (avoid unrelated churn):

- Polar €199 checkout UX (except ZIP policy on fulfillment)  
- Questionnaire → Cloudflare deploy core (unless snapshot missing)  
- Firebase schema / leads business logic (except documenting backends)  
- Factory delivery V2 materializer as SaaS ZIP source of truth  
- Redis / SoundFire (absent)  
- Unrelated factory artifact pipelines (`assembly`, `binding`, …)  
- Database migrations for ZIP itself (**НЕ НАЙДЕНО** ZIP-specific DB)

Do **not** change Polar products, production DB, or deployment in the design phase (this document’s constraint already).

---

## 19. MIGRATION PLAN

1. **Document freeze** — this file + THREE_BRANCH commercial rules.  
2. **Builder extraction** — zero behavior change wrappers around `createMvpProZipStream`.  
3. **Fix Admin ZIP** — first user-visible honesty win (OWNER-ready).  
4. **Unify download-site / download-zip** on `client-dists` + sanitizer.  
5. **README V2** — Marketplace-grade text for all modes.  
6. **OWNER flag** — download without payment.  
7. **€999 Polar + webhook** — entitlement; remove free €199 ZIP.  
8. **Marketplace pack script** — sanitized template.  
9. **API base decoupling** — architectural follow-up.  
10. **Delete dead paths** — unused `createCrmDemoZipStream` callers already none; quarantine factory download confusion in docs/UI.

Rollback: keep old routes behind flags until Admin ZIP verified against a known `client-dists` snapshot.

---

## 20. ACCEPTANCE CRITERIA

### Must pass

- [ ] Exactly **one** packer used for OWNER, €999, and Marketplace artifacts.  
- [ ] OWNER can download ZIP+README with dist **without** Polar/promo/webhook.  
- [ ] Admin ZIP contains `index.html` (or fails loudly with `DIST_MISSING`), never README-only pretending to be the site.  
- [ ] €999 ZIP is scoped to one `clientId` volume; no other tenant files.  
- [ ] Marketplace ZIP passes secret scan (no Firebase/Polar/Railway private material).  
- [ ] README states partial autonomy and lists real dependencies.  
- [ ] `/api/download-site` and customer ZIP never fall back to shared MVP dist.  
- [ ] SaaS €199 hosted flow still works (deploy, paid flag, admin, leads).  
- [ ] Redis/SoundFire not claimed in README.  
- [ ] No second parallel “ZIP product format” introduced.

### Explicit non-goals (unless later architecture project)

- [ ] Shipping Next Admin + `/api/leads` inside the ZIP  
- [ ] Zero dependency on any backend for catalog/leads cloud sync without rebuild  
- [ ] Fully offline Booking+Admin parity with production SaaS  

---

## MAIN QUESTION — ANSWER

**МОЖНО ЛИ СДЕЛАТЬ ОДИН НАСТОЯЩИЙ DEPLOYABLE ZIP** satisfying A–G?

### YES — with precise definition of “deployable”

| Criterion | Answer |
|---|---|
| A OWNER direct download | **YES** — same Builder; replace README-only admin route |
| B Marketplace sell | **YES** — same Builder; template/sanitized input + Marketplace README |
| C €999 customer | **YES** — same Builder; client snapshot + entitlement |
| D No our secrets | **YES** — sanitizer + never pack env/Firebase Admin |
| E Everything needed to deploy | **YES for static CRM shell**; **NO for full SaaS clone** without backend kit |
| F No foreign clientId | **YES** — path + entitlement discipline; fix shared-dist fallback |
| G Don’t break SaaS | **YES** — additive Builder + entitlement; keep hosted path |

### Architecture (short)

```
prepareClientDistWithOgImage → client-dists/{clientId}
                │
                ▼
     DeployableZipBuilder (= createMvpProZipStream + sanitize + README)
                │
     ┌──────────┼──────────────┐
 OWNER session  €999 token   Marketplace CI
```

### If “deployable” is misread as “full autonomous Website+CRM+Booking+Admin”

Then: **NO** without **ТРЕБУЕТ АРХИТЕКТУРНОГО ИЗМЕНЕНИЯ**:

1. Package or document a runnable backend (Next APIs / Firebase / file store).  
2. Include or replace public booking + Admin (currently Next-only).  
3. Remove hardcoded `webstudio-muenchen.com` API defaults (runtime config).  

That is a **platform export** project, not a ZIP packing fix.

---

## READY FOR IMPLEMENTATION

### READY FOR IMPLEMENTATION: **YES**

Ready to implement **Deployable ZIP V2** as:

- one canonical Builder,  
- real dist for OWNER/Admin,  
- entitlement-gated €999 / Marketplace variants,  
- honest README,  
- secret sanitization,  

**without** claiming full offline SaaS parity.

### Blocking problems — only if goal expands to 100% autonomous full stack

1. Public Booking + Admin live only in Next.js SaaS — **not in dist**.  
2. Catalog / vacancies / leads sync default to **our** production API host.  
3. No self-contained backend kit in ZIP.  
4. €999 Polar product **НЕ НАЙДЕНО** (commercial wiring still required for Subscription path, but not for Builder/OWNER).  
5. Admin ZIP currently README-only — must be fixed first for OWNER acceptance.

None of (4)–(5) block starting Builder + Admin ZIP fix.  
(1)–(3) block only the “fully autonomous product” interpretation — disclose in README, do not hide.

---

## Appendix — Key evidence index

| Topic | Path |
|---|---|
| Packer | `src/lib/mvp-pro/zip-stream.ts` |
| Site download | `src/app/api/download-site/route.ts` |
| MVP Pro download | `src/app/api/download-zip/route.ts` |
| Admin README ZIP | `src/app/api/admin/download-zip/route.ts` |
| Dist volume | `src/lib/site-delivery/dist-store.ts` |
| Dist prepare | `src/lib/og-image/prepare-client-dist.ts` |
| MVP Pro dist resolver (fallback risk) | `src/lib/mvp-pro/dist-resolver.ts` |
| README MVP Pro | `src/lib/mvp-pro/readme.ts` |
| Post-pay ZIP link | `src/lib/site-delivery/post-payment-email.ts`, `src/lib/crm-demo/fulfillment.ts` |
| MVP Pro fulfill | `src/lib/mvp-pro/fulfillment.ts` |
| API hardcode | `artifacts/factory_output/react_mvp/src/lib/sync-crm-catalog.js`, `sync-crm-vacancies.js`, `App.jsx` |
| Secret strip | `src/lib/leads/read-secret.ts` |
| Factory ZIP (out of scope) | `src/app/api/client-delivery/download/route.ts`, `client-delivery-v2/download/route.ts` |
| Prior architecture | `docs/THREE_BRANCH_ARCHITECTURE.md` |
