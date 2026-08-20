# THREE BRANCH ARCHITECTURE — Technical Audit & Design

**Date:** 2026-08-20  
**Repo:** `saas-mvp-funnel`  
**Git HEAD:** `main` (`refs/heads/main`)  
**Constraint for this document:** analysis and proposal only — no code, branch, commit, Polar, DB, or deploy changes were made.

Every claim below is grounded in current files. Where a feature is absent, it is marked **НЕ НАЙДЕНО**.

---

## 1. CURRENT ARCHITECTURE

### What the product is today

A single Next.js (App Router) SaaS monolith that:

1. Accepts a client questionnaire → creates `clientId` + manifest.
2. Personalizes a shared Vite/React CRM shell (`artifacts/factory_output/react_mvp`) and deploys a static dist to **Cloudflare Pages**.
3. Serves readable CRM/demo URLs and public site routes from **Railway** (`/demo/{slug}`, `/site/{slug}`, `/admin/*`).
4. Gates unpaid demos (TTL deletion) and unlocks permanence via **Polar** (or promo).
5. Optionally emails a download token for a static ZIP of the client dist.

```
Questionnaire (wizard)
        │
        ▼
POST /api/client-questionnaire
  → Firestore clients/{clientId}
  → data/manifests/{clientId}.json
  → prepareClientDistWithOgImage(react_mvp dist)
  → Cloudflare Pages deploy
  → persistClientDistSnapshot → volume client-dists/{clientId}/dist
  → /demo/{slug}?clientId=…  (Railway iframe/host)
        │
        ▼
Unpaid TTL (~10 min) OR Polar €199 / promo → markTenantPaid
        │
        ▼
Admin magic-link (/admin) + CRM + booking leads APIs
```

### Major layers (evidence)

| Layer | Path / entry |
|---|---|
| Marketing / wizard | `src/client-wizard/page.tsx`, tariffs `src/app/tariffs/page.tsx` |
| Site generation | `src/app/api/client-questionnaire/route.ts` |
| Static CRM shell | `artifacts/factory_output/react_mvp/` (Vite build) |
| Cloudflare deploy | `src/lib/cloudflare/deploy.ts` |
| Paid / TTL | `src/lib/billing/paid-tenant.ts`, `src/lib/cloudflare/scheduler.ts` |
| Polar webhook | `src/app/api/webhooks/polar/route.ts` |
| Admin (Next) | `src/app/admin/**`, `src/app/api/admin/**` |
| ZIP packing | `src/lib/mvp-pro/zip-stream.ts` + download routes |
| Leads / CRM sync APIs | `src/app/api/leads/**`, `src/app/api/crm/**`, `src/app/api/job-leads/**` |

### Product modes today

**НЕ НАЙДЕНО:** `PRODUCT_MODE` / `OWNER` / `SUBSCRIPTION` / `MARKETPLACE` flags or separate deployments.

Everything runs as one commercial SaaS funnel with payment gating baked into the wizard and demo UI.

---

## 2. CURRENT PAYMENT FLOW

### Polar products & checkouts

Source: `src/lib/polar/constants.ts`

| Constant | Role |
|---|---|
| `POLAR_CHECKOUT_WEBSTUDIO_199` | Primary public checkout (€199/month Web Studio) |
| `POLAR_PRODUCT_CRM_DEMO` / `POLAR_CHECKOUT_CRM_DEMO` | CRM Demo product (env-overridable; legacy one-time IDs remain as fallback) |
| `POLAR_PRODUCT_RECURRING` | Product id `118dc1ba-…` — matched as `recurring` |
| `POLAR_PRODUCT_CRM_FULL` | Product id `3aefa6b9-…` — matched as `crm_full` |
| `POLAR_CHECKOUT_RECURRING` / `POLAR_CHECKOUT_CRM_FULL` | Additional checkout links |

Public €199 CTA builds Polar URL with `reference_id` / `metadata[client_id]`:

- `src/lib/tariffs/urls.ts` → `buildCrmDemoPolarUrl`
- `src/lib/cloudflare/demo-access.ts` → `buildCrmDemoCheckoutUrl`

Dynamic checkout API (needs `POLAR_ACCESS_TOKEN`):

- `POST /api/polar/crm-demo-checkout` → `src/app/api/polar/crm-demo-checkout/route.ts`

### Webhook

`POST /api/webhooks/polar` (`src/app/api/webhooks/polar/route.ts`):

1. **`onCheckoutUpdated`**: save checkout→clientId reference; if checkout succeeded → `markTenantPaid` + `persistTenantPaid` (important for 100% discount / promo-like Polar discounts).
2. **`onOrderPaid`**: resolve `clientId`, mark paid, then route by `resolvePolarProductKind`:
   - `recurring` → `fulfillMvpProOrder` (ZIP entitlement + email download link)
   - `crm_full` → `fulfillCrmFullOrder` (Firebase provision) + `fulfillPaidSiteDelivery`
   - `crm_demo` → `fulfillCrmDemoOrder` (email with site URL + optional ZIP download link)
   - `unknown` → fallback `fulfillPaidSiteDelivery`

Product matching: `src/lib/polar/product-match.ts` (id match + name heuristics).

Client id resolution: `src/lib/polar/order-context.ts` (reference_id, custom fields, metadata UUID, checkout-reference store).

### Paid tenant semantics

`src/lib/billing/paid-tenant.ts`:

- Local: demo registry + dist protection + cancel TTL deletion.
- Firestore: `clients/{clientId}.paid`, `paidEmails/{email}`.

Payment gate for demos: `resolveDemoAccess` in `src/lib/cloudflare/demo-access.ts` (`paid` only if registry/pending marked paid; fail-closed).

### Promo codes

- Wizard UI: `src/client-wizard/page.tsx` → `POST /api/redeem-promo`
- Route: `src/app/api/redeem-promo/route.ts`
  - Permanent code `serafim01` → grant paid without Polar
  - Other codes: Firestore `promoCodes` one-time `used` flag
- Also hardcoded in `src/components/pay-page.tsx` (`PROMO_CODE = "serafim01"`)

### LemonSqueezy

Still present as dependency and webhook (`src/app/api/webhooks/lemonsqueezy/route.ts`, MVP Pro variant constants). Primary live checkout path in tariffs/wizard is **Polar €199**.

### €999 today — NOT a ZIP product in this repo

Tariffs copy (`src/lib/tariffs/copy.ts`) shows:

- €199 → Polar (this product)
- €499 / €999 → **Factory Website+CRM bridge** (`/api/factory-bridge`, `NEXT_PUBLIC_FACTORY_WEBSITE_URL`)

**НЕ НАЙДЕНО:** Polar product / checkout / webhook kind for “ZIP + README €999 one-time” inside this SaaS.

Closest existing ZIP fulfillment after payment:

- Token download: `/api/download-site` after `grantSiteDownloadAccess` (crm_demo / paid site delivery emails)
- Entitlement download: `/api/download-zip` after `fulfillMvpProOrder` (Polar `recurring` kind)

---

## 3. CURRENT SITE GENERATION FLOW

Entry: `POST /api/client-questionnaire` (`src/app/api/client-questionnaire/route.ts`)

Sequence (code order):

1. Validate / normalize questionnaire payload → business type, contacts, language.
2. Build + validate client manifest (OpenAI optional correction via `OPENAI_API_KEY`).
3. `clientId = randomUUID()`.
4. Persist Firestore `clients/{clientId}` + `saveClientManifest` → `data/manifests/{clientId}.json`.
5. `ensureLeadsReadSecret(clientId)`.
6. Require Cloudflare env; else **503** `"Cloudflare is not configured"`.
7. `resolveMvpDistPath()` → shared `react_mvp` production dist.
8. `prepareClientDistWithOgImage` (`src/lib/og-image/prepare-client-dist.ts`):
   - copy dist to staging
   - inject niche images / OG
   - bake `window.__CRM_DEMO_CLIENT_ID__` + public manifest into `index.html`
   - write `client-manifest.json`, `_headers` (frame-ancestors for Railway)
9. `deployDistToPages` → Cloudflare Pages preview branch per slug.
10. `persistClientDistSnapshot` → persistent volume `client-dists/{clientId}/dist`.
11. Registry + TTL schedule; if email already paid → mark paid immediately.
12. Return demo / public URLs for wizard redirect.

**Manifest schema / storage:** `src/lib/manifest/*`, `data/manifests/*.json`.

**Preview in wizard:** Railway `/demo/{slug}?clientId=…` only (not raw pages.dev) — see comments in `src/client-wizard/page.tsx`, `src/lib/cloudflare/demo-embed.ts`.

---

## 4. CURRENT ADMIN FLOW

| Step | Implementation |
|---|---|
| Login page | `src/app/admin/login/page.tsx` |
| Request magic link | `POST /api/admin/login` → email via Resend |
| Token store | `src/lib/admin/magic-link.ts` (file under persistent data dir) |
| Callback | `/api/admin/callback` / `src/app/admin/callback/route.ts` |
| Session cookie | `site_admin_client` HMAC (`src/lib/admin/session.ts`) |
| Protected UI | `src/app/admin/(protected)/**` |
| Nav sections | Overview, Content, Media, Services, Jobs, Contacts (`src/lib/admin/nav.ts`) |
| Load/save content | `GET/PATCH /api/admin/site` |
| Media / catalog / jobs | `/api/admin/media`, `/api/admin/catalog`, `/api/admin/jobs` |
| Download ZIP button | Overview → `href="/api/admin/download-zip"` (`src/app/admin/(protected)/page.tsx`) |

**НЕ НАЙДЕНО:** Admin section named «ИНТЕГРАЦИИ» with clickable Zip / GitHub / Netlify / Railway / SoundFire / Firebase / Redis.

Closest UI:

- CRM tab `integrations` inside `react_mvp` (`App.jsx`) — **stub cards only** (Google Calendar, Telegram, etc.), buttons `disabled`.
- Factory bridge mock actions in `src/lib/factory-crm/mapToFactoryManifest.ts` (`zip` / `github` / `firebase` / `deploy` all `mock: true`).
- Delivery options on factory result screens (`src/lib/client-preview/preview-service.ts`) — factory pipeline ZIP/Netlify/README, not the live SaaS admin.

---

## 5. CURRENT ZIP CONTENT

### Three different ZIP mechanisms

| Route | Auth | Contents | File |
|---|---|---|---|
| `GET /api/admin/download-zip` | Admin session | **Only `README.md`** with hosted SaaS links (`/site`, `/demo`, `/admin`) — **no dist** | `src/app/api/admin/download-zip/route.ts` |
| `GET /api/download-site` | `clientId` + download token (7-day TTL) | Full client dist + short README + optional `client-manifest.json` via `createMvpProZipStream` | `src/app/api/download-site/route.ts` |
| `GET /api/download-zip` | MVP Pro entitlement token | Same stream helper + richer README from `buildMvpProReadme` | `src/app/api/download-zip/route.ts` |
| `GET /api/client-delivery/download` | None (factory path) | Prebuilt `final_package.zip` from factory materializer | `src/app/api/client-delivery/download/route.ts` |

Canonical packer for SaaS client artifacts:

`createMvpProZipStream` in `src/lib/mvp-pro/zip-stream.ts`:

- `archive.directory(distPath, false)` → static files (`index.html`, `assets/`, images, `_headers`, baked manifest)
- `README.md`
- optional `client-manifest.json` from `data/manifests/{clientId}.json`

Dist sources:

- Preferred for post-payment site ZIP: volume `…/client-dists/{clientId}/dist` (`src/lib/site-delivery/dist-store.ts`)
- MVP Pro path: `artifacts/{clientId}/dist` snapshot or shared MVP dist (`src/lib/mvp-pro/dist-resolver.ts`)

### What is NOT in the SaaS ZIP

- Next.js admin app
- `/api/leads`, `/api/job-leads`, `/api/crm/*` server routes
- Firebase Admin credentials
- Polar / Railway / Cloudflare secrets
- Other tenants’ data (scoped by `clientId` path — **if** snapshot is per-client)

### README quality

- Admin ZIP README: points buyer back to **your** hosted product (`webstudio-muenchen.com`), not self-host instructions.
- MVP Pro README (`src/lib/mvp-pro/readme.ts`): static serve (`npx serve`) + “deploy anywhere” — but still mentions personalization via `clientId` URL.
- CRM Demo email README text in zip-stream: minimal static hosting note.

---

## 6. CURRENT INFRASTRUCTURE DEPENDENCIES

| SERVICE | Зачем | Где используется | OWNER | SUBSCRIPTION | MARKETPLACE | Credentials | Replace / disable? |
|---|---|---|---|---|---|---|---|
| **Railway** | Host Next.js SaaS, APIs, admin, `/demo` `/site`, volume for dists/manifests | `railway.toml`, `RAILWAY_PUBLIC_DOMAIN`, leads IP, iframe ancestors | Optional (local/dev) | **Required** | Not in ZIP | Railway project + volume | OWNER can run `next dev`; Marketplace buyer hosts ZIP elsewhere |
| **Cloudflare Pages** | Deploy personalized static CRM shell; TTL demos | `src/lib/cloudflare/*`, questionnaire hard-requires CF | Needed if OWNER wants same live preview path | **Required** for current funnel | Not required for ZIP buyer | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, project name | OWNER could skip CF with local preview; Marketplace uses any static host |
| **Firebase / Firestore** | Clients, paid flags, promo codes, leads (prod), CRM catalog/vacancies, CRM Full provision | `src/lib/firebase/admin.ts`, leads store, redeem-promo, crm-full | Optional for pure local OWNER if file backends | **Required** (prod) | **Must not ship Admin creds** | `FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY` | File backends exist for leads (`LEADS_BACKEND=file`) |
| **Polar** | €199 checkout + webhooks | constants, webhook, tariffs, wizard | **Must be off** | **Required** | Marketplace sold elsewhere — not Polar in-app | `POLAR_WEBHOOK_SECRET`, `POLAR_ACCESS_TOKEN` | OWNER: skip; Marketplace: external storefront |
| **Resend** | Magic-link admin login, post-pay emails, MVP Pro download mail | `src/lib/email/resend.ts`, admin login, fulfillments | Optional (OWNER can bypass login) | Required for magic link / delivery | Not in ZIP | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | OWNER: passwordless bypass or local session |
| **OpenAI** | Manifest correction in questionnaire | `client-questionnaire/route.ts` | Optional | Optional | N/A | `OPENAI_API_KEY` | Deterministic fallback exists |
| **Netlify** | Legacy / deprecated hosting; factory delivery links | `src/lib/netlify/deploy.ts` marked **@deprecated**; factory scripts | Not needed | Not for live path | Optional buyer choice | Legacy tokens | Already replaced by Cloudflare for CRM Demo |
| **GitHub** | Factory package generation / delivery option | `src/lib/github/*`, preview delivery option | Desired OWNER action — **partially factory-only today** | Optional upsell | Possible distribution channel | Tokens if automating push | UI action mostly **НЕ НАЙДЕНО** as live click |
| **LemonSqueezy** | Legacy payments / MVP Pro variant ids | webhook + constants | Off | Legacy | N/A | LS env vars in `.env.local.example` | Prefer Polar for new €999 |
| **reCAPTCHA** | Bot protection | `.env.local.example`, components | Optional | Optional | N/A | site/secret keys | Can disable in OWNER |
| **Redis** | — | — | — | — | — | — | **НЕ НАЙДЕНО** in repo |
| **SoundFire** | — | — | — | — | — | — | **НЕ НАЙДЕНО** in repo |

---

## 7. WHAT CUSTOMER ACTUALLY RECEIVES

### After €199 / month (current)

1. Paid flag → demo not deleted by TTL.
2. Hosted public site: `/site/{slug}` on SaaS origin.
3. Hosted CRM: `/demo/{slug}?clientId=…`.
4. Admin panel via magic link email.
5. Booking / job forms posting to SaaS APIs (`/api/leads`, `/api/job-leads`).
6. Email may include **download link** to `/api/download-site?clientId&token` (static dist ZIP) — see `fulfillCrmDemoOrder` / `fulfillPaidSiteDelivery`.

**Important:** €199 path already *can* hand out a ZIP link in email; product intent for three modes says ZIP should become a **separate €999** purchase for Subscription. That is a **policy change**, not current behavior.

### Admin “📦 Скачать ZIP”

Currently downloads a ZIP containing **only README with links to your hosted site** — not a deployable artifact. Evidence: `src/app/api/admin/download-zip/route.ts`.

### €499 / €999 Factory cards

Handoff of business fields to external Factory product — not ZIP fulfillment in this repo.

---

## 8. CAN ZIP RUN INDEPENDENTLY

### Classification (by code, not assumption)

**Verdict: 2 — Works partially autonomously + 3 — Requires external backend for full CRM/booking + 4 — Requires external service setup for a complete product.**

| Capability | In ZIP? | Autonomous? | Evidence |
|---|---|---|---|
| Static marketing/CRM UI shell | Yes (dist) | Yes — static host | `createMvpProZipStream` packs dist |
| CRM records (clients, appointments UI) | Yes | Partial — **localStorage** | `artifacts/.../useCrmRecords.js` |
| Catalog / vacancies sync | Client calls SaaS API | **No** — defaults to `https://webstudio-muenchen.com` | `sync-crm-catalog.js`, `sync-crm-vacancies.js` (`VITE_MANIFEST_API_BASE`) |
| Public booking / job forms (Next) | **Not in ZIP** | N/A on static-only deploy | `src/components/public-site/booking-form.tsx` → `/api/leads/...` |
| Admin content editing | **Not in ZIP** | Requires Railway SaaS | `src/app/admin/**` |
| Leads persistence | Server | Firestore or file backend on SaaS | `src/lib/leads/store.ts` |
| Firebase client SDK in ZIP | **НЕ НАЙДЕНО** as real client SDK; Factory mock config only | — | `mapToFactoryManifest.ts` mock |
| Hardcoded SaaS URLs | Yes | Couples ZIP to your backend | `webstudio-muenchen.com` fallbacks |
| Env vars inside ZIP | Bake-time `VITE_MANIFEST_API_BASE` at react_mvp build | Buyer cannot reconfigure without rebuild | `package.json` `react-mvp:build` |

### After unzip

1. User gets `index.html` + `assets/` (+ images) + README (+ manifest).
2. `npx serve .` / Netlify / Cloudflare Pages / any static host → UI loads.
3. Full “Website + CRM + Booking” as operated on SaaS **does not** self-host from ZIP alone without pointing APIs at a backend the buyer controls.

---

## 9. OWNER ARCHITECTURE

### Goal

Internal operator mode: create → edit → preview → Integrations → **Download ZIP immediately**, no Polar / promo / paid gate / webhook wait.

### Recommended shape (same Master codebase)

```
PRODUCT_MODE=owner
  - Skip / hide Polar CTAs, tariff pay step, promo UI
  - Auto-mark paid (or never schedule TTL)
  - Admin session: local bypass or always-on owner login
  - Integrations page (new admin or CRM section): real actions
      • Download ZIP+README → reuse createMvpProZipStream + client-dists snapshot
      • GitHub / Netlify / Railway / Firebase → link out or wrap existing lib helpers where real
      • Redis / SoundFire → НЕ НАЙДЕНО — omit or stub explicitly
  - Cloudflare deploy: optional for preview; do not block ZIP if dist snapshot exists
```

### Reuse, do not fork ZIP

Wire OWNER download to the **same** packer as `/api/download-site`:

- `createMvpProZipStream` / `buildClientDistZipBuffer`
- Dist from `persistClientDistSnapshot` / `resolveClientDistPath`

**Do not** extend the current admin README-only ZIP as the production OWNER artifact without packing dist.

### Must remove / gate for OWNER

- Wizard s6 Polar + promo (`src/client-wizard/page.tsx`)
- Unpaid DEMO watermark / paywall in `react_mvp` (`isUnpaidDemo`)
- TTL scheduler deletion for owner-created tenants
- Dependency on webhook success before download

---

## 10. SUBSCRIPTION ARCHITECTURE

### €199 / month (existing Polar)

Keep current hosted product:

- Questionnaire → CF deploy → Railway CRM/admin → leads APIs → paid via Polar webhook.

### ZIP €999 one-time (new paid action — design only)

**Do not invent a new payment provider.** Extend Polar:

1. Create Polar **one-time** product “ZIP + README” (€999) in Polar dashboard.
2. Add constants, e.g. `POLAR_PRODUCT_ZIP_EXPORT` + checkout URL/env (mirror `src/lib/polar/constants.ts`).
3. Extend `PolarProductKind` in `product-match.ts` with `zip_export`.
4. In webhook `onOrderPaid`, branch:
   - mark a **separate** entitlement (do **not** conflate with monthly `paid` alone), e.g. reuse/adapt `grantMvpProEntitlement` or new `zip-export-entitlement-store`.
   - email download link via existing Resend pattern (`fulfillMvpProOrder` is the closest template).
5. Admin UI: “Получить ZIP + README” → starts Polar checkout with `reference_id=clientId` (only if monthly active — product rule).
6. **Change policy:** stop attaching free ZIP links on €199 fulfillment (`fulfillCrmDemoOrder` / `fulfillPaidSiteDelivery`) once €999 is live — otherwise commercial model contradicts itself.

### €999 vs current Factory €999 card

Current UI €999 is Factory bridge — **different product**. Either:

- Rename/hide Factory card in Subscription mode, or
- Keep Factory as separate SKU and name ZIP export clearly (“Self-host ZIP €999”).

---

## 11. MARKETPLACE ARCHITECTURE

### Product

Standalone digital good: ZIP + README for self-host. **No** SaaS onboarding, Polar, promo, or magic-link admin of this funnel.

### What ZIP should contain (target)

- Personalized (or template) static `dist`
- `README.md` with deploy steps, env/API expectations, license/support
- `client-manifest.json` **sanitized** (no secrets)
- Optional: `.env.example` for buyer’s own backend URLs

### What must NOT be in Marketplace ZIP

- `FIREBASE_*`, Polar, Railway, Cloudflare, Resend, Admin session secrets
- Other clients’ manifests / dists / leads
- Internal `data/` volume dumps
- Hardcoded production admin magic-link flows
- Your SaaS-only billing UI

### Buyer dependencies to document in README

1. Static hosting (Pages / Netlify / S3 / nginx).
2. If they want live booking: they need **their** backend compatible with `/api/leads` contract **or** accept localStorage-only CRM.
3. Rebuild with their `VITE_MANIFEST_API_BASE` if catalog sync is required.
4. Credentials they supply themselves (their Firebase, their email SMTP, etc.) — never yours.

### Fulfillment

Outside this app’s Polar webhook — Gumroad / Lemon Squeezy Marketplace / etc.  
Optional: CI job on Master that builds a **sanitized template ZIP** artifact for upload.

---

## 12. SHARED MASTER COMPONENTS

Keep on Master / shared by all modes:

- Questionnaire → manifest pipeline
- `react_mvp` shell + niche content/image libraries
- `prepareClientDistWithOgImage` / dist snapshot
- `createMvpProZipStream` (single ZIP engine)
- Admin content model (`site-content`, media, services, jobs)
- Leads validation schemas / niche catalogs
- Cloudflare + Railway deploy helpers (used by Subscription; optional OWNER)
- i18n, legal pages (mode-gated)

---

## 13. COMPONENTS THAT MUST BE ISOLATED

| Concern | Isolation method |
|---|---|
| Polar checkout / webhook / promo | `PRODUCT_MODE !== 'owner'`; Marketplace build excludes routes |
| TTL unpaid deletion | Owner: off; Subscription: on |
| Free ZIP on €199 email | Subscription policy flag |
| €999 ZIP entitlement | Separate store from monthly `paid` |
| Admin Integrations actions | Feature module; OWNER full, Subscription paywalled ZIP |
| Factory bridge €499/€999 | Do not mix with Marketplace ZIP SKU |
| Secrets / `.env` | Never packed; Marketplace sanitizer checklist |
| Hardcoded `webstudio-muenchen.com` in client JS | Build-time `VITE_MANIFEST_API_BASE` per mode |

---

## 14. PAYMENT / FULFILLMENT CHANGES REQUIRED

1. Add Polar one-time €999 product + env constants + `product-match` kind.
2. Webhook fulfillment → ZIP entitlement + Resend link (clone `fulfillMvpProOrder` pattern).
3. Admin CTA checkout for ZIP (Subscription only).
4. Decouple monthly `paid` from ZIP download rights.
5. Stop or gate complimentary ZIP in `fulfillCrmDemoOrder` / `fulfillPaidSiteDelivery`.
6. OWNER: bypass Polar entirely; grant download by session/role.
7. Marketplace: no in-app Polar; external storefront + prebuilt artifact.

**НЕ НАЙДЕНО today:** dedicated €999 ZIP Polar product wiring.

---

## 15. ZIP / README CHANGES REQUIRED

1. Fix admin download to pack **dist + README** (reuse `createMvpProZipStream`) — critical for OWNER and honest Subscription ZIP.
2. README variants by mode:
   - OWNER: internal operator notes
   - Subscription €999: self-host + support terms + API base configuration
   - Marketplace: no SaaS login URLs; full dependency list; no secrets
3. Sanitize manifest (strip `leadsReadSecret` and any private fields — see strip helpers in `prepare-client-dist` / `leads/read-secret`).
4. Document that booking/admin need a backend; static-only limitations.
5. Optionally ship `API_BASE` placeholder instead of hardcoded production host.

---

## 16. SECURITY RISKS

| Risk | Evidence / note |
|---|---|
| Admin ZIP is not the artifact customers think | README-only ZIP |
| Download tokens in email URLs | `/api/download-site` UUID tokens, 7-day TTL — treat as secrets |
| MVP Pro entitlements on disk | `data/mvp-pro-entitlements/` |
| Session signing fallback chain includes Firebase/Polar secrets | `src/lib/admin/session.ts` |
| Permanent promo `serafim01` | Hardcoded grant-paid |
| CORS `*` on public leads POST | `src/app/api/leads/[clientId]/route.ts` |
| Shipping ZIP with baked production API host | Couples buyers to your backend; data exfil risk if they keep it |
| Packing wrong dist (shared MVP dist vs per-client) | `mvp-pro/dist-resolver` can fall back to shared dist |
| Firestore Admin key in Marketplace ZIP | Must never happen |

---

## 17. DATA ISOLATION RISKS

| Risk | Mitigation |
|---|---|
| Shared Cloudflare project multi-tenant | Slug/branch isolation; do not dump project-wide |
| Volume `client-dists` mix-up | Always key by `clientId` |
| Manifest files in repo `data/manifests/` | Do not publish; sanitize before ZIP |
| Promo / paidEmails collections | Never export |
| CRM localStorage is per-browser | Not a server isolation issue; buyer data stays local unless synced to your API |
| Factory bridge leakage | Already limits fields — keep that boundary |

---

## 18. RECOMMENDED GIT BRANCH STRUCTURE

### Current Git workflow

- Active branch: **`main`** only (`.git/HEAD` → `refs/heads/main`).
- **НЕ НАЙДЕНО:** existing `owner` / `subscription` / `marketplace` branches in this workspace snapshot.
- Uncommitted work present at audit start: admin page + `api/admin/download-zip` (README-only ZIP) — do not treat as finished OWNER mode.

### Do **not** use three long-lived divergent product branches as source of truth

That creates three products. Requirement is one Master.

### Recommended model

```
main                    ← SOURCE OF TRUTH (Master / Factory)
 │
 ├── feat/*             ← short-lived implementation PRs
 │
 └── (optional thin overlays, not forks)
       deploy/owner         # only env samples / CI deploy config
       deploy/subscription
       deploy/marketplace-artifact
```

If you still want three Cursor windows:

| Window | Checkout | Difference |
|---|---|---|
| 1 | `main` + worktree, `PRODUCT_MODE=owner` | Config + gated UI |
| 2 | same commit, `PRODUCT_MODE=subscription` | Polar on |
| 3 | same commit, marketplace pack script / docs | Artifact pipeline |

**Better than `main → owner|subscription|marketplace` code forks:**

- All feature code merges to **`main`**.
- Mode-specific behavior = `PRODUCT_MODE` + route allowlists + deploy env.
- Optional long-lived branches only for **deploy config / release pinning**, regularly reset/rebased from `main`, never accumulating unique business logic.

### What goes where

| Change type | Land in |
|---|---|
| ZIP packer, manifest, react_mvp, leads schemas | `main` |
| Polar €999 product match + webhook branch | `main` (gated) |
| OWNER bypass flags | `main` (`PRODUCT_MODE=owner`) |
| Marketplace README template + sanitizer | `main` |
| Secrets / Polar product IDs | Env / Polar dashboard — not committed |
| Mode-only copy tweaks | Prefer `main` with mode switches; avoid branch-only copy drift |

---

## 19. RECOMMENDED DEPLOYMENT STRUCTURE

| Mode | Deploy | Runtime |
|---|---|---|
| OWNER | Private Railway (or local) | `PRODUCT_MODE=owner`, Polar env empty/ignored, TTL off |
| SUBSCRIPTION | Current production Railway + Cloudflare + Firebase + Polar + Resend | `PRODUCT_MODE=subscription` |
| MARKETPLACE | **No** customer-facing deploy of this app required; CI uploads ZIP to marketplace | Build job from `main` |

Shared artifact pipeline: one `react_mvp` build; per-client personalization at questionnaire/export time.

---

## 20. STEP-BY-STEP IMPLEMENTATION PLAN

1. Freeze commercial rules: €199 includes hosted product only; ZIP = €999; OWNER free ZIP; Marketplace separate SKU.
2. Introduce `PRODUCT_MODE` (or equivalent) on Master — no behavior change until flags wired.
3. Unify ZIP: admin/OWNER download must use `createMvpProZipStream` + real `client-dists` (fix README-only bug).
4. Write mode-specific README generators; sanitize manifests.
5. OWNER: disable Polar/promo/TTL; auto-paid; Integrations actions (ZIP first).
6. Subscription: add Polar €999 one-time product; webhook kind; entitlement; admin CTA; remove free ZIP from €199 email.
7. Marketplace: sanitizer + pack script + README; exclude secrets; document API/backend limits.
8. Harden hardcoded API base (build arg / runtime config).
9. Security review: tokens, promo, session secrets, CORS.
10. Deploy OWNER private → Subscription prod → Marketplace upload.
11. Only then open three Cursor windows for sequential polish — still merging to `main`.

---

## WHAT SHOULD BE DONE FIRST

1. **Confirm commercial policy in writing:** is complimentary ZIP on €199 emails staying or dying when €999 ships?
2. **Fix the ZIP truth gap:** decide that the only deployable ZIP is `createMvpProZipStream(client-dists)` — treat current `/api/admin/download-zip` as incomplete.
3. **Add `PRODUCT_MODE` design** (env + allowlist matrix) on Master before any branch work.
4. **Polar dashboard:** create €999 one-time product (IDs only; no code yet if you want — but needed before Subscription fulfillment).
5. **Document Marketplace ZIP autonomy** for buyers using §8 of this report (partial static + optional backend).
6. **Git:** keep `main` as sole source of truth; use worktrees + env for three windows; do **not** create divergent `owner`/`subscription`/`marketplace` long-lived code branches.
7. **Implement OWNER ZIP path first** (highest leverage, no Polar dependency) reusing existing packer.
8. **Then Subscription €999 entitlement** extending existing Polar webhook.
9. **Then Marketplace sanitizer/pack** as CI artifact from the same packer.
10. **Finally** Integrations UI (GitHub/Netlify/Railway/Firebase) — most are stubs or absent (Redis/SoundFire **НЕ НАЙДЕНО**).

---

## Appendix A — Key file index

| Topic | Files |
|---|---|
| Polar constants | `src/lib/polar/constants.ts` |
| Polar webhook | `src/app/api/webhooks/polar/route.ts` |
| Product match | `src/lib/polar/product-match.ts` |
| Paid tenant | `src/lib/billing/paid-tenant.ts` |
| Promo | `src/app/api/redeem-promo/route.ts` |
| Questionnaire | `src/app/api/client-questionnaire/route.ts` |
| Dist prepare | `src/lib/og-image/prepare-client-dist.ts` |
| Dist store | `src/lib/site-delivery/dist-store.ts` |
| ZIP stream | `src/lib/mvp-pro/zip-stream.ts` |
| Download site | `src/app/api/download-site/route.ts` |
| Download MVP Pro | `src/app/api/download-zip/route.ts` |
| Admin ZIP (README-only) | `src/app/api/admin/download-zip/route.ts` |
| Admin overview button | `src/app/admin/(protected)/page.tsx` |
| CRM Integrations stubs | `artifacts/factory_output/react_mvp/src/App.jsx` |
| Tariffs / €199 / Factory €999 | `src/lib/tariffs/copy.ts`, `src/lib/tariffs/urls.ts` |
| Env template | `.env.local.example`, `.env.example` |

## Appendix B — Explicit НЕ НАЙДЕНО

- `PRODUCT_MODE` / three-mode runtime switch
- Admin «ИНТЕГРАЦИИ» with Zip/GitHub/Netlify/Railway/Firebase/Redis/SoundFire actions
- Live SoundFire integration
- Live Redis usage
- Polar €999 ZIP one-time product wiring in this repo
- Marketplace storefront / SKU fulfillment path
- Fully autonomous self-host of booking + admin from ZIP alone
- Git branches `owner` / `subscription` / `marketplace` (only `main` observed)
