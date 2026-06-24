# LIVE_PREVIEW_INTEGRATION_PLAN

**Date:** 2026-06-14  
**Scope:** Audit + implementation plan only. No Live Preview code in this phase.  
**Project:** `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_CORE`

**Reference documents used:**

| Document | Status |
|----------|--------|
| `docs/QUESTIONNAIRE_MANIFEST_INTERACTION_AUDIT.md` | **Not found** in repo — substituted with `AUDIT_CLIENT_QUESTIONNAIRE_TO_MVP_LOGIC.md`, `CLIENT_DELIVERY_V2_ARCHITECTURE_PLAN.md`, and live codebase inspection |
| `AUDIT_CLIENT_QUESTIONNAIRE_TO_MVP_LOGIC.md` | Present — questionnaire → V1/V2 pipeline mapping |
| `CLIENT_DELIVERY_V2_ARCHITECTURE_PLAN.md` | Present — V2 target architecture |

**Constraints (from product brief):**

- Preview only — no payment, Stripe, PayPal, subscriptions, billing
- Do **not** remove or refactor existing Client Delivery V2
- ZIP, Netlify, GitHub, APK, PWA, README, demo.mp4 remain available on the final result screen
- Change **user journey only**; factory outputs stay intact

---

## 1. Current flow

### 1.1 End-to-end data chain (as implemented today)

```
Client Questionnaire UI
  src/views/client-questionnaire-page.tsx
        ↓ POST
  input/client_onboarding_questionnaire.json
        ↓ npm run client:deliver:v2
  Client Delivery V2 Orchestrator
  factory/client_delivery_v2_orchestrator/
        ↓
  artifacts/factory_output/client_delivery_v2/manifest.json
        ↓
  artifacts/factory_output/client_delivery_v2/final_package.zip
        ↓ GET (same page)
  /api/client-delivery-v2/status  →  inline “Download ZIP” button
```

### 1.2 V2 pipeline steps (unchanged)

| Step | Command | Output |
|------|---------|--------|
| `client_onboarding` | `npm run client-onboarding:generate` | `client_profile.json` |
| `mvp_assembly` | `npm run mvp-assembly-intelligence:generate` | `assembly_decision.json` |
| `template_selection` | `npm run template-selection-integration:generate` | `selected_template.json`, `selected_modules.json` |
| `build_orchestrator` | `npm run mvp-build-orchestrator:generate` | `build_plan.json` |
| `react_mvp_build` | `npm run react-mvp-build-executor:generate` | `artifacts/factory_output/react_mvp/` |
| `v2_finalize` | internal `finalize_v2_delivery` | V2 copy + `manifest.json` + `final_package.zip` |

Defined in `factory/client_delivery_v2_orchestrator/v2_manifest.py` (`PIPELINE_STEPS`).

### 1.3 Where the React MVP is formed

**Answer to audit Q1:**

| Stage | Location | What happens |
|-------|----------|--------------|
| **Source generation** | `factory/react_mvp_build_executor_factory/` | Writes React + Vite scaffold and domain-specific UI from `build_plan.json` into `artifacts/factory_output/react_mvp/` |
| **V2 packaging copy** | `factory/client_delivery_v2_orchestrator/v2_finalize.py` → `copy_react_mvp()` | Copies `react_mvp/` → `artifacts/factory_output/client_delivery_v2/react_mvp/` |
| **Production build (`dist/`)** | Manual or CI step: `cd react_mvp && npm install && npm run build` | Produces `dist/index.html` + hashed assets. **Not invoked automatically** by `react-mvp-build-executor:generate` today |
| **V1 alternate path** | `artifacts/factory_output/react_ui/client_package/` | Static fallback if rebuild source missing (`fallback_used: true`) |

Executor materializes **source**; `dist/` exists in the workspace as a prior build artifact (`client_delivery_v2/react_mvp/dist/`).

### 1.4 Current frontend UX (questionnaire page)

File: `src/views/client-questionnaire-page.tsx`

1. Save questionnaire → `POST /api/client-questionnaire`
2. **Generate MVP** → `POST /api/client-delivery-v2/run`
3. Poll/fetch → `GET /api/client-delivery-v2/status`
4. On PASS → show metadata + **Download ZIP** link (`/api/client-delivery-v2/download`)

There is **no** preview gate and **no** separate result/delivery-options screen.

### 1.5 Parallel V1 full-delivery artifacts (for result screen options)

V1 (`npm run client:deliver`) produces richer outputs via `client_full_delivery_orchestrator` → `client_pipeline_orchestrator` → `client_delivery_factory`:

| Deliverable | Typical path |
|-------------|--------------|
| ZIP | `output/client_delivery/final_package.zip` |
| Netlify | `artifacts/factory_output/netlify_deploy/` |
| Custom domain | `artifacts/factory_output/custom_domain/` |
| GitHub | `artifacts/factory_output/github_delivery/` |
| Demo video | `output/client_delivery/demo.mp4` (via demo factories in full pipeline) |
| README | `output/client_delivery/README_CLIENT.txt`, `README.md` in packages |
| APK foundation | `src/lib/package/apk-generator.ts` → `artifacts/factory_output/apk/` |
| PWA | Questionnaire schema field `pwa` in `factory/questionnaire_factory/`; module `knowledge_library/module_library/pwa_module.json` |

V2 ZIP today contains: manifest JSONs + `react_mvp/` source tree — **not** the full V1 tail (demo, deploy, github package). The **result screen** must expose all options; availability is determined per-artifact at runtime (see §8).

### 1.6 Status artifacts (clarification)

- `manifest.json` — V2 delivery manifest (`artifacts/factory_output/client_delivery_v2/manifest.json`)
- `delivery_report.json` — V2 step summary (`artifacts/factory_output/client_delivery_v2/delivery_report.json`)
- **`delivery_status.json` — does not exist** in the repo
- `client_delivery_status` factory — generates **UI** for `/client-delivery-status`, not a `delivery_status.json` file

---

## 2. Preview insertion point

### 2.1 Recommended insertion (minimal invasive)

Insert Live Preview **after V2 pipeline success** and **before** exposing download/delivery actions.

```
Client Questionnaire
        ↓ Save
questionnaire.json
        ↓ Generate MVP
Client Delivery V2 (all 6 steps, unchanged)
        ↓
manifest.json  (status: DELIVERY_READY)
        ↓ NEW — UI redirect / link
Live Preview  /client-preview/[id]
        ↓ User confirms
Result screen  /client-result/[id]   (“Ваш MVP готов”)
        ↓
Delivery options (ZIP, Netlify, …)
```

**Do not** insert a new factory step inside `PIPELINE_STEPS` for Phase 1. Preview is a **frontend + thin API layer** on top of existing V2 outputs.

### 2.2 Optional Phase 2 factory hook (non-breaking)

Add an **optional** post-finalize internal step `live_preview_publish` **after** `v2_finalize` that:

1. Runs `npm run build` inside `client_delivery_v2/react_mvp/` if `dist/` missing
2. Copies `dist/` → `public/preview-builds/{preview_id}/`
3. Writes `preview_url` into `manifest.json`

This step must be **additive** (new step or sub-step of finalize), not a replacement for any existing step.

### 2.3 UI trigger change (questionnaire page)

In `client-questionnaire-page.tsx`, when `deliveryResult.status === "PASS"`:

| Today | Target |
|-------|--------|
| Show inline success + Download ZIP | Show “Open Live Preview” → navigate to `/client-preview/{preview_id}` |
| Download hidden until approval | Download and all delivery options on `/client-result/{preview_id}` after “ДА” |

### 2.4 Why this point

- `manifest.json` exists only after `v2_finalize` — preview needs `business_type`, `template_id`, `modules`, `language`, and `react_mvp` path
- Inserting preview **before** finalize would show incomplete or stale builds
- Inserting preview **inside** ZIP generation would block packaging; unnecessary because preview reads the same `react_mvp/` tree the ZIP already includes

---

## 3. Existing assets reusable for preview

### 3.1 React MVP build output

| Asset | Path | Reusable for preview? |
|-------|------|----------------------|
| V2 React source | `artifacts/factory_output/client_delivery_v2/react_mvp/` | Yes — run/build if needed |
| V2 `dist/` | `.../react_mvp/dist/` | **Yes — primary preview source** (static SPA) |
| Global React MVP | `artifacts/factory_output/react_mvp/` | Same content before V2 copy |
| Vite preview script | `"preview": "vite preview"` in `package.json` | Dev-only; separate port — **not** suitable for embedded CRM iframe in production UX |
| V1 deploy URL | `artifacts/factory_output/deploy/public_deploy_status.json` → `public_url` | Optional external preview fallback (requires Netlify deploy) |

### 3.2 Frontend patterns already in repo

| Pattern | Location | Reuse |
|---------|----------|-------|
| Dashboard layout + cards | `src/views/client-questionnaire-page.tsx` | Preview shell, result screen |
| V2 status API | `src/app/api/client-delivery-v2/status/route.ts` | Extend with `preview` block |
| V2 download API | `src/app/api/client-delivery-v2/download/route.ts` | Result screen ZIP button |
| Showcase demos | `src/lib/showcase/showcase-config.ts` | UX reference for iframe + deliverables list |
| i18n copy | `src/lib/i18n/questionnaire-copy.ts` | Add preview/result strings |

### 3.3 Planned but missing factory

`package.json` references `ui-preview:generate` → `factory/ui_preview_factory/ui_preview_factory.py` — **directory not present**. Do not depend on it for Phase 1; implement preview via static `dist/` serving.

### 3.4 Audit answers Q3 and Q4

| Question | Answer |
|----------|--------|
| **Q3: Reuse existing React build?** | **Yes.** Serve `client_delivery_v2/react_mvp/dist/` (or rebuild from copied source). Same artifact that ships inside `final_package.zip`. |
| **Q4: Preview without Netlify?** | **Yes.** Local static hosting via Next.js (`public/preview-builds/{id}/` or dedicated API static route). No deploy required for preview gate. |

### 3.5 Vite `base` path caveat

Current `dist/index.html` references assets as absolute paths:

```html
<script type="module" crossorigin src="/assets/index-0i7uF4OM.js"></script>
```

Serving from `/client-preview/{id}/` **requires** either:

- Rebuild with `base: './'` or `base: '/preview-builds/{id}/'` in `vite.config.js` during publish step, **or**
- A catch-all static route that also serves `/assets/*` for the active preview session

Document this in the publish step — otherwise iframe shows blank page.

---

## 4. Preview URL strategy

### 4.1 Recommended URL scheme

| Purpose | URL |
|---------|-----|
| Preview page (shell + iframe + approval UI) | `/client-preview/[id]` |
| Static MVP assets (built SPA) | `/preview-builds/[id]/index.html` |
| Preview metadata API | `GET /api/client-preview/[id]` |
| Static asset fallback API | `GET /api/client-preview/static/[id]/[...path]` |

**Answer to audit Q2:** Primary embed URL for iframe:

```
/preview-builds/{preview_id}/index.html
```

Resolved against the same Next.js origin (e.g. `http://localhost:3000/preview-builds/abc123/index.html`).

### 4.2 `preview_id` generation

Deterministic, stable for a given V2 run:

```text
preview_id = slug(business_name) + "-" + shortHash(manifest.generated_at + template_id)
```

Example: `munich-dental-center-a1b2c3`

Alternative: UUID written once in `v2_finalize` → simpler collision handling.

For single-tenant dev MVP, `"latest"` alias is acceptable as fallback when `[id]` omitted.

### 4.3 Publish flow (Phase 1 — no Netlify)

```
v2_finalize completes
        ↓
ensure dist/ exists (npm run build in react_mvp if missing)
        ↓
copy dist/ → public/preview-builds/{preview_id}/
        ↓
manifest.outputs.preview_url = "/preview-builds/{preview_id}/index.html"
        ↓
client navigates to /client-preview/{preview_id}
```

### 4.4 Optional Netlify URL (Phase 2+)

If V1 deploy artifacts exist (`artifacts/factory_output/deploy/public_deploy_status.json`), expose as secondary link:

```json
"deploy_preview_url": "https://deploy-binding-preview.local/berlin-barber-studio"
```

Do **not** require deploy for the preview gate.

---

## 5. Preview page architecture

### 5.1 Route: `/client-preview/[id]`

**Answer to audit Q5:** This route is the Live Preview screen.

Proposed files (implementation phase):

```
src/app/(dashboard)/client-preview/[id]/page.tsx   → thin server wrapper
src/views/client-preview-page.tsx                  → client UI
src/lib/client-preview/preview-types.ts            → types
src/lib/client-preview/preview-mapper.ts           → manifest → view model
```

### 5.2 Page layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: business_name · business_type · language        │
│ Badges: template_id · selected_modules                  │
├─────────────────────────────────────────────────────────┤
│ iframe src={preview_url}  (responsive, min-height 70vh) │
├─────────────────────────────────────────────────────────┤
│ “Нравится результат?”                                   │
│  [ Нет — вернуться ]   [ Да — получить результат ]      │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Data loading

On mount:

1. `GET /api/client-preview/[id]` — returns preview payload (§6.3)
2. If `preview_url` missing → call publish endpoint or show “build preview” spinner
3. iframe `sandbox="allow-scripts allow-same-origin allow-forms"` (tighten as needed)

### 5.4 “Нет” path

- Navigate back to `/client-questionnaire` with form state preserved (sessionStorage or re-fetch questionnaire API)
- **Do not** delete V2 artifacts or re-run pipeline automatically

### 5.5 “Да” path

- `POST /api/client-preview/[id]/approve` — records approval (session flag or `manifest.preview.approved_at`)
- Redirect → `/client-result/[id]`

No billing, no payment gate.

---

## 6. Manifest → Preview mapping

### 6.1 Link chain

```
input/client_onboarding_questionnaire.json
        │  (sources.questionnaire)
        ▼
artifacts/factory_output/client_delivery_v2/manifest.json
        │  (outputs.react_mvp, template_id, modules, language)
        ▼
preview_id  ← derived or stored in manifest.preview.preview_id
        ▼
public/preview-builds/{preview_id}/   OR   react_mvp/dist/
        ▼
/client-preview/{preview_id}
```

**Answer to audit Q6:**

| Link | Key |
|------|-----|
| questionnaire → manifest | `manifest.sources.questionnaire` + mirrored fields (`business_type`, `language`, `client_contacts.business_name`) |
| manifest → preview | `manifest.outputs.react_mvp` + `manifest.preview.preview_url` |
| preview → result | Same `preview_id`; approval flag unlocks `/client-result/[id]` |

### 6.2 Preview payload object

**Answer to audit Q7:**

```typescript
type ClientPreviewPayload = {
  preview_id: string;
  business_name: string;
  business_type: string;
  language: string;
  selected_modules: string[];
  selected_template: string;      // maps to manifest.template_id
  preview_url: string;          // iframe src
  manifest_status: string;        // DELIVERY_READY
  delivery_ready: boolean;
};
```

Mapping from V2 `manifest.json`:

| Payload field | Manifest source |
|---------------|-----------------|
| `business_name` | `client_contacts.business_name` |
| `business_type` | `business_type` |
| `language` | `language` |
| `selected_modules` | `modules[]` |
| `selected_template` | `template_id` |
| `preview_url` | `preview.preview_url` (new) or computed |
| `preview_id` | `preview.preview_id` (new) or route param |

Also load `selected_template.json` / `selected_modules.json` if UI needs full factory objects.

### 6.3 Where to store `preview_url`

**Answer to audit Q8:**

| Store | Recommendation |
|-------|----------------|
| **`manifest.json`** | **Primary.** Add optional `preview` object — canonical, versioned with delivery, already read by status API |
| **`delivery_report.json`** | **Mirror** `preview_url` for debugging/reporting only |
| **`delivery_status.json`** | **Do not create** unless a new factory explicitly needs it; file does not exist today |

Proposed manifest extension (backward compatible):

```json
{
  "status": "DELIVERY_READY",
  "preview": {
    "preview_id": "munich-dental-center-a1b2c3",
    "preview_url": "/preview-builds/munich-dental-center-a1b2c3/index.html",
    "published_at": "2026-06-14T14:00:00+00:00",
    "source_dist": "artifacts/factory_output/client_delivery_v2/react_mvp/dist",
    "approved_at": null
  },
  "outputs": {
    "react_mvp": "artifacts/factory_output/client_delivery_v2/react_mvp/",
    "final_package": "artifacts/factory_output/client_delivery_v2/final_package.zip",
    "preview_static": "public/preview-builds/munich-dental-center-a1b2c3/"
  }
}
```

---

## 7. Result screen architecture

### 7.1 Route: `/client-result/[id]`

Shown **only after** preview approval (“ДА”).

```
┌─────────────────────────────────────────────────────────┐
│  ✓  Ваш MVP готов                                       │
│  {business_name} · {business_type} · {language}         │
│  Template: {selected_template}                          │
├─────────────────────────────────────────────────────────┤
│  Delivery options grid (§8)                             │
├─────────────────────────────────────────────────────────┤
│  [ Back to Preview ]  [ New Questionnaire ]             │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Guard

If user opens `/client-result/[id]` without approval:

- Redirect to `/client-preview/[id]`, or
- Show soft gate: “Сначала просмотрите preview”

### 7.3 API

`GET /api/client-result/[id]` — aggregates:

- V2 manifest fields
- Approval status
- Delivery option availability (file existence checks)

---

## 8. Delivery options screen

All options remain; show card per option with enabled/disabled state based on artifact presence.

| Option | Source (primary) | Action |
|--------|------------------|--------|
| **ZIP** | V2: `/api/client-delivery-v2/download` | Download `final_package.zip` |
| **Netlify** | `artifacts/factory_output/netlify_deploy/deployment_url.txt` | Open URL or show deploy instructions |
| **Свой домен** | `artifacts/factory_output/custom_domain/` | Link to DNS readme / setup report |
| **GitHub** | `artifacts/factory_output/github_delivery/github_delivery_package/` | Download package or open README_DEPLOY |
| **APK** | `artifacts/factory_output/apk/` via `src/lib/package/apk-generator.ts` | Download Capacitor foundation / future APK |
| **PWA** | PWA manifest in react_mvp or module flags | Link to install instructions / manifest |
| **README** | `react_mvp/README.md`, `output/client_delivery/README_CLIENT.txt` | Download / open in new tab |
| **demo.mp4** | `output/client_delivery/demo.mp4`, `final_package/demo.mp4` | Stream or download |

**V2 note:** Until V2 pipeline is extended with V1 tail factories, some options may show as “available after full delivery run” while **ZIP + README (from react_mvp)** are always available post-V2.

**Do not remove** any existing download routes or factory outputs — only **relocate** primary ZIP CTA from questionnaire inline block to result screen.

---

## 9. Exact implementation steps

### Phase A — Documentation & pass file (this task)

- [x] Audit codebase and write this plan
- [x] Create `output/LIVE_PREVIEW_INTEGRATION_PLAN_PASS.txt`
- [x] Verify `npm run build`

### Phase B — Backend / manifest (additive only)

1. **`v2_finalize.py`** — after ZIP creation:
   - Compute `preview_id`
   - Run `npm run build` in `REACT_MVP_REL` if `dist/index.html` missing (subprocess, timeout)
   - Copy `dist/` → `public/preview-builds/{preview_id}/`
   - Append `preview` block to manifest; mirror in `delivery_report.json`
2. **`v2_manifest.py`** — extend `build_delivery_manifest()` with optional `preview` defaults (null until publish)
3. **New API routes:**
   - `GET /api/client-preview/[id]/route.ts`
   - `POST /api/client-preview/[id]/approve/route.ts`
   - `GET /api/client-result/[id]/route.ts`
   - Optional: `GET /api/client-preview/static/[id]/[...path]/route.ts` if not using `public/`
4. **Extend** `GET /api/client-delivery-v2/status` — include `preview_id`, `preview_url`, `preview_ready` (non-breaking additive fields)

### Phase C — Frontend UX (journey change only)

1. **`src/app/(dashboard)/client-preview/[id]/page.tsx`** + **`client-preview-page.tsx`**
2. **`src/app/(dashboard)/client-result/[id]/page.tsx`** + **`client-result-page.tsx`**
3. **`client-questionnaire-page.tsx`** — on PASS: replace inline Download with link to `/client-preview/{id}`; keep step progress UI unchanged
4. **`questionnaire-copy.ts`** — RU/DE/EN strings for preview gate and result screen
5. **Sidebar** (optional) — no new nav item required; flow is questionnaire-driven

### Phase D — Vite base path fix

1. Update `react_mvp_scaffold_builder.py` — `vite.config.js` template with `base: './'` **or** publish-step rewrite of `index.html` asset paths
2. Re-run one V2 delivery to validate iframe loads CSS/JS under subpath

### Phase E — Quality gate (additive)

1. Add checks to `client:v2:quality-gate`:
   - `preview_id` present in manifest when `DELIVERY_READY`
   - `public/preview-builds/{id}/index.html` exists
   - `preview_url` returns 200 from Next dev server
2. Pass file: `output/LIVE_PREVIEW_INTEGRATION_PASS.txt`

### Phase F — Future (out of scope now)

- Wire V1 tail (demo, netlify, github) into V2 post-approval batch without removing V2 ZIP
- Implement missing `ui_preview_factory` or deprecate script in `package.json`
- Multi-run history: index previews by order id in `client_orders`

### Files touched (implementation estimate)

| File | Change type |
|------|-------------|
| `factory/client_delivery_v2_orchestrator/v2_finalize.py` | Additive publish |
| `factory/client_delivery_v2_orchestrator/v2_manifest.py` | Additive `preview` schema |
| `src/views/client-questionnaire-page.tsx` | UX redirect |
| `src/views/client-preview-page.tsx` | **New** |
| `src/views/client-result-page.tsx` | **New** |
| `src/app/(dashboard)/client-preview/[id]/page.tsx` | **New** |
| `src/app/(dashboard)/client-result/[id]/page.tsx` | **New** |
| `src/app/api/client-preview/**` | **New** |
| `src/lib/i18n/questionnaire-copy.ts` | Additive strings |

### Risk register

| Risk | Mitigation |
|------|------------|
| Absolute `/assets/` paths in Vite dist | Rebuild with relative `base` or asset proxy |
| `npm run build` slow in finalize | Cache `dist/`; skip rebuild if newer than source mtime |
| V2 ZIP lacks demo/deploy | Result screen shows per-option availability; optional Phase F |
| Missing reference audit doc | This plan cites actual files inspected 2026-06-14 |

---

## Appendix — Audit question index

| # | Question | Section |
|---|----------|---------|
| 1 | Where is React MVP formed? | §1.3 |
| 2 | Preview embed URL? | §4.1 |
| 3 | Reuse React build? | §3.4 |
| 4 | Preview without Netlify? | §3.4, §4.3 |
| 5 | `/client-preview/[id]` role? | §5.1 |
| 6 | questionnaire → manifest → preview link? | §6.1 |
| 7 | Preview payload object? | §6.2 |
| 8 | `preview_url` storage? | §6.3 |

---

**Status:** PLAN COMPLETE — ready for implementation phase (Phase B–E).
