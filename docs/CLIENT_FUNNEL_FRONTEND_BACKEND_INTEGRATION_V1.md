# CLIENT_FUNNEL_FRONTEND_BACKEND_INTEGRATION_V1

**Date:** 2026-06-14  
**Theme:** Unified client funnel — frontend + backend integration  
**Project:** `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_CORE`

---

## 1. Pages created / updated

| Route | File | Purpose |
|-------|------|---------|
| `/client-funnel` | `src/app/client-funnel/page.tsx` | **Primary test URL** — public 6-step funnel |
| `/client-questionnaire` | `src/app/client-questionnaire/page.tsx` | Alias — same `ClientFunnelPage` component |
| `/client-result/[id]` | `src/app/client-result/[id]/page.tsx` | Result screen after YES (unchanged) |
| `/client-preview/[id]` | `src/app/client-preview/[id]/page.tsx` | Standalone preview route (unchanged) |

**Main UI component:** `src/views/client-funnel-page.tsx`  
**Styles:** `src/styles/client-funnel.css` (ported from `mvp-factory (1).html`)  
**i18n copy:** `src/lib/i18n/client-funnel-copy.ts` (EN / DE / RU)  
**Constants:** `src/lib/client-funnel/constants.ts` (sectors, languages, API mapping)

**Preserved (not deleted):**

- `src/views/claude-funnel-page.tsx` — previous funnel variant
- `src/views/client-questionnaire-page.tsx` — full questionnaire backup
- Client Delivery V2 pipeline — untouched

---

## 2. API endpoints connected

| Step | Method | Endpoint | Role |
|------|--------|----------|------|
| Save form | `POST` | `/api/client-questionnaire` | Writes `input/client_onboarding_questionnaire.json` |
| Start build | `POST` | `/api/client-delivery-v2/run` | Runs V2 orchestrator |
| Poll status | `GET` | `/api/client-delivery-v2/status` | Poll every 2s until `DELIVERY_READY` |
| Live Preview | `GET` | `/api/client-preview/latest` | Returns `preview_url`, `preview_id`, manifest fields |
| Result options | `GET` | `/api/client-result/[id]` | Delivery cards (ZIP, Netlify, …) |
| ZIP download | `GET` | `/api/client-delivery-v2/download` | Streams `final_package.zip` |

**Embed / assets (used by preview iframe):**

- `/api/client-preview/embed/[id]`
- `/api/client-preview/assets/[id]/[...path]`

---

## 3. Payload sent to backend

On **Generate MVP**, the funnel sends:

```json
{
  "name": "...",
  "business_name": "...",
  "email": "...",
  "business_type": "dental_clinic | ecommerce | car_service | restaurant | education | fitness_club | real_estate",
  "language": "de | en | ru"
}
```

Plus required questionnaire defaults (phone, working_hours, plan, payment_status: `FREE`, etc.) so the existing API accepts the payload without payment fields.

**Sector mapping** (`src/lib/client-funnel/constants.ts`):

| UI sector | `business_type` |
|-----------|-----------------|
| dental | `dental_clinic` |
| tech / shop | `ecommerce` |
| logistics | `car_service` |
| food | `restaurant` |
| education | `education` |
| fitness | `fitness_club` |
| realestate | `real_estate` |

**Platform language:** uk / fr / es fall back to `en` for the API (`languageToApiCode`).

---

## 4. Where manifest is created

Manifest is **not** created by the funnel frontend. It is written by the existing V2 orchestrator:

```
artifacts/factory_output/client_delivery_v2/manifest.json
```

Read by:

- `GET /api/client-delivery-v2/status`
- `src/lib/client-preview/preview-service.ts` → `readV2Manifest()`

Status gate: `manifest.status === "DELIVERY_READY"` (or `READY`).

---

## 5. Live Preview flow

1. After `DELIVERY_READY`, funnel calls `GET /api/client-preview/latest`.
2. Response includes `preview_url` — typically `/api/client-preview/embed/{preview_id}`.
3. Embed route serves HTML from `artifacts/factory_output/client_delivery_v2/react_mvp/dist/` with asset path rewrites.
4. Funnel renders real MVP in `<iframe src={preview_url}>` — not a fake code block.

See also: `docs/LIVE_PREVIEW_INTEGRATION_PLAN.md`.

---

## 6. YES button flow

1. User clicks **ДА / Yes, looks great** on Live Preview step.
2. `markPreviewApproved(preview_id)` → `sessionStorage`.
3. Redirect to `/client-result/{preview_id}`.
4. Result page loads delivery options via `GET /api/client-result/{id}`.

---

## 7. ZIP download

On `/client-result/[id]`:

- ZIP card uses `GET /api/client-delivery-v2/download` when `available: true`.
- File: `artifacts/factory_output/client_delivery_v2/final_package.zip`.
- Other options (Netlify, Domain, GitHub, APK, PWA, README, demo.mp4) show **Coming soon** when backend marks them unavailable.

---

## 8. Test link for client

**Recommended URL:**

```
http://localhost:3001/client-funnel
```

Start dev server:

```bash
npm run dev:client-funnel
```

**Alternate (same UI):**

```
http://localhost:3001/client-questionnaire
```

Default port `3000` also works: `npm run dev` → `http://localhost:3000/client-funnel`.

---

## 9. Funnel steps (UX)

| # | Step | UI |
|---|------|-----|
| 1 | Contacts | name, business_name, email |
| 2 | Business sector | 8 sectors with icons |
| 3 | Platform language | Deutsch, English, Русский, Українська, Français, Español |
| 4 | Generate + build animation | 6 build steps while polling backend |
| 5 | Live Preview | iframe + «Нравится результат?» → ДА / Пересобрать |
| 6 | Download | `/client-result/[id]` — ZIP + other delivery cards |

**i18n:** EN / DE / RU switcher top-right (`useTranslation` + `factory-locale` in localStorage).

---

## 10. Constraints respected

- No payment / Stripe / PayPal / tariffs
- V2 pipeline, manifest schema, factory modules — unchanged
- Existing questionnaire views kept as backups
- Not a landing page — step-by-step funnel only

---

## 11. Verification checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | Open `/client-funnel` | Dark card wizard loads |
| 2 | Step 1 contacts | Validation + next |
| 3 | Step 2 sector | 8 options selectable |
| 4 | Step 3 language | 6 languages + Generate |
| 5 | Generate | POST questionnaire + POST run |
| 6 | Status poll | Updates until DELIVERY_READY |
| 7 | Live Preview | Real iframe MVP |
| 8 | YES | → `/client-result/{id}` |
| 9 | ZIP | Download via API |
| 10 | `npm run build` | PASS |
