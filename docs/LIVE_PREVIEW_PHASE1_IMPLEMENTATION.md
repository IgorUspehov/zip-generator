# LIVE_PREVIEW — Phase 1 Implementation

**Date:** 2026-06-14  
**Scope:** Live Preview + Result Screen (frontend + read-only API layer)  
**Basis:** `docs/LIVE_PREVIEW_INTEGRATION_PLAN.md`

**Constraints honored:**

- Questionnaire form/save/API logic unchanged (only post-delivery navigation added)
- V2 manifest factory and pipeline untouched
- Factory modules untouched
- Build pipeline untouched
- Uses existing `artifacts/factory_output/client_delivery_v2/` artifacts

---

## 1. Files added

### Library

| File | Purpose |
|------|---------|
| `src/lib/client-preview/types.ts` | Preview/result TypeScript types |
| `src/lib/client-preview/preview-service.ts` | Read manifest, compute `preview_id`, serve dist paths, delivery options |
| `src/lib/client-preview/approval-storage.ts` | Client-side `sessionStorage` approval gate |
| `src/lib/i18n/preview-copy.ts` | RU/DE/EN strings for preview & result screens |

### Views

| File | Purpose |
|------|---------|
| `src/views/client-preview-page.tsx` | Live Preview UI (iframe + ДА/НЕТ) |
| `src/views/client-result-page.tsx` | Result screen with 8 delivery options |

### App routes

| File | Purpose |
|------|---------|
| `src/app/client-preview/[id]/page.tsx` | Preview page entry |
| `src/app/client-result/[id]/page.tsx` | Result page entry |

### API routes

| File | Purpose |
|------|---------|
| `src/app/api/client-preview/[id]/route.ts` | Preview metadata JSON |
| `src/app/api/client-preview/embed/[id]/route.ts` | HTML embed with rewritten asset paths |
| `src/app/api/client-preview/assets/[id]/[...path]/route.ts` | Static files from `react_mvp/dist/` |
| `src/app/api/client-result/[id]/route.ts` | Result payload + delivery option availability |
| `src/app/api/client-result/readme/route.ts` | Serve README text |
| `src/app/api/client-result/demo/route.ts` | Stream demo.mp4 |

### Documentation

| File | Purpose |
|------|---------|
| `docs/LIVE_PREVIEW_PHASE1_IMPLEMENTATION.md` | This document |
| `docs/CLIENT_QUESTIONNAIRE_UI_AUDIT.md` | Client questionnaire UI audit |
| `output/LIVE_PREVIEW_PHASE1_IMPLEMENTATION_PASS.txt` | Pass marker |

### Minimal journey wiring (existing file)

| File | Change |
|------|--------|
| `src/views/client-questionnaire-page.tsx` | Redirect to `/client-preview/latest` on PASS; success link → preview (not ZIP) |

---

## 2. Routes added

| Route | Method | Description |
|-------|--------|-------------|
| `/client-preview/[id]` | GET | Live Preview page |
| `/client-result/[id]` | GET | Result / delivery options page |
| `/api/client-preview/[id]` | GET | Preview payload JSON |
| `/api/client-preview/embed/[id]` | GET | iframe HTML (dist with fixed asset URLs) |
| `/api/client-preview/assets/[id]/[...path]` | GET | dist static assets |
| `/api/client-result/[id]` | GET | Result payload JSON |
| `/api/client-result/readme` | GET | README download/view |
| `/api/client-result/demo` | GET | demo.mp4 stream |

**Special id:** `latest` — resolves to the current V2 manifest’s computed `preview_id`.

---

## 3. Preview source

Priority order:

1. **`manifest.preview.preview_url`** — if present in existing `manifest.json` (optional field, not written by factory)
2. **`/api/client-preview/embed/{preview_id}`** — reads `artifacts/factory_output/client_delivery_v2/react_mvp/dist/index.html` and rewrites `/assets/` → `/api/client-preview/assets/{id}/assets/`

**Dist path:** `artifacts/factory_output/client_delivery_v2/react_mvp/dist/`

**`preview_id` computation** (runtime, no factory change):

```text
slug(business_name) + "-" + sha256(generated_at|template_id)[0:6]
```

Or uses `manifest.preview.preview_id` if already set.

---

## 4. ДА / НЕТ flow

### Live Preview page (`/client-preview/[id]`)

1. Fetches `GET /api/client-preview/[id]`
2. Renders iframe with `preview_url`
3. Shows «Нравится результат?»

| Button | Action |
|--------|--------|
| **ДА** | `sessionStorage` key `client-preview-approved:{preview_id}` → navigate `/client-result/{preview_id}` |
| **НЕТ** | Navigate `/client-questionnaire` |

### Result guard

`/client-result/[id]` checks `sessionStorage`. If not approved → redirect back to `/client-preview/[id]`.

---

## 5. Result Screen

Route: `/client-result/[id]`

**Header:** «Ваш MVP готов» + business metadata

**Delivery options grid** (availability from disk):

| Option | Availability check |
|--------|-------------------|
| ZIP | V2 or V1 `final_package.zip` |
| Netlify | `deployment_url.txt` or deploy reports |
| Свой домен | `custom_domain/README_CUSTOM_DOMAIN.md` |
| GitHub | `github_delivery/README_DEPLOY.md` |
| APK | `artifacts/factory_output/apk/capacitor.config.json` |
| PWA | `knowledge_library/module_library/pwa_module.json` |
| README | V2 `react_mvp/README.md` or V1 `README_CLIENT.txt` |
| demo.mp4 | `output/client_delivery/demo.mp4` or final_package copy |

No payment, Stripe, or PayPal integration.

---

## 6. User journey (Phase 1)

```
/client-questionnaire
  → Generate MVP (V2 API, unchanged)
  → redirect /client-preview/latest
  → iframe embed
  → ДА → /client-result/{id}
  → delivery options (ZIP via /api/client-delivery-v2/download, etc.)
```

---

## 7. Verification

```bash
npm run build
# Manual:
# /client-preview/latest
# /client-result/{computed-id}  (after ДА on preview)
```
