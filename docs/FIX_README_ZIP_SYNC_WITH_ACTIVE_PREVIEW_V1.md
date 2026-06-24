# FIX_README_ZIP_SYNC_WITH_ACTIVE_PREVIEW_V1

**Date:** 2026-06-14  
**Scope:** Client preview/result artifact routing — README, ZIP, demo, consistency gate

---

## Problem

Netlify, Preview iframe, and `demo.mp4` showed **beauty_salon** (Berlin Barber Studio) — the correct active demo.

README and ZIP still came from the latest V2 factory manifest (**restaurant**, Ihor Kriazhev IT, `restaurant_crm`).

Mixed artifacts on Result Screen: preview ≠ README ≠ ZIP.

---

## Root cause

| Consumer | Old source |
|----------|------------|
| `/client-preview/latest` iframe | V2 `react_mvp/dist` **or** legacy deploy cluster |
| Netlify option | `artifacts/factory_output/netlify_deploy/deployment_url.txt` |
| `demo.mp4` | `output/client_delivery/demo.mp4` |
| `/api/client-result/readme` | V2 manifest → materializer built restaurant README |
| `/api/client-delivery/download` | V2 `react_mvp` zip builder |

Materializer treated **latest V2 manifest** as truth instead of the **active preview/result cluster**.

---

## Source of truth

New module: `src/lib/client-preview/active-artifact-context.ts`

`assessActiveArtifacts(routeId)` reads identities from:

| Source key | File / origin | Role |
|------------|---------------|------|
| `preview_ui` | V2 `domain_ui.json` **or** legacy `output/client_delivery` when netlify+demo+legacy fingerprints match | **Active preview UI** |
| `preview_meta` | V2 `manifest.json` | Factory internal (non-blocking drift) |
| `netlify` | `netlify_deploy_report.json` | Netlify deploy identity |
| `demo` | `output/client_delivery/delivery_manifest.json` + `client_profile.json` | Demo video cluster |
| `legacy_package` | Same legacy delivery files + `final_package.zip` | ZIP source |

**Fingerprint:** `normalized_category|template_id|sorted(modules)`

**Blocking consistency rule:** `preview_ui`, `netlify`, `demo`, `legacy_package` must share the same fingerprint.

If mismatch → `artifacts_in_sync: false`, warning **"Artifacts are out of sync"**, README/ZIP/demo blocked (HTTP 409).

**Factory drift (info only):** when V2 manifest differs from active preview UI — exposed as `factory_drift[]`, does not block delivery.

---

## Materialization

`src/lib/client-preview/client-delivery-materializer.ts`

When consistent:

- **Legacy cluster match** → copy `output/client_delivery/final_package.zip`, regenerate README from legacy profile into `output/client_delivery_live/`
- **V2 cluster match** → build zip from V2 `react_mvp` into `output/client_delivery_live/`

Stamp file `.generation_stamp` avoids redundant rebuilds.

---

## API / UI wiring

| Endpoint / page | Change |
|-----------------|--------|
| `delivery-artifacts.ts` | Routes through `assessActiveArtifacts()` |
| `/api/client-result/readme` | 409 if out of sync; serves live README |
| `/api/client-delivery/download` | 409 if out of sync; serves live ZIP |
| `/api/client-result/demo` | 409 if out of sync |
| `preview-service.ts` `buildResultPayload` | Uses `canonical` identity; exposes sync fields |
| `client-result-page.tsx` | Banner when `artifacts_in_sync === false` |
| `preview-copy.ts` | `artifactsSyncWarning` (EN/DE/RU) |

Delivery options (ZIP, README, demo, Netlify) are **disabled** when artifacts are out of sync.

---

## Unchanged

- Client Delivery V2 pipeline / factory modules
- Questionnaire flow
- Payment / backend orchestration

---

## Verification

```bash
npm run build   # PASS
npm run dev -- -p 3001
```

When consistent on legacy cluster, preview iframe uses **Netlify deploy URL** (same site as Result option).
2. Click **ДА** → `http://localhost:3001/client-result/latest`
3. Confirm all five align on **beauty_salon / Berlin Barber Studio**:
   - Netlify URL (deployed beauty_salon)
   - Preview iframe
   - README (`/api/client-result/readme`)
   - ZIP (`/api/client-delivery/download` → manifest inside zip)
   - demo.mp4 (`/api/client-result/demo`)

Expected README excerpt:

```
# Berlin Barber Studio — Client MVP Package
- Business type: beauty_salon
- Template: beauty_salon_crm
```

If any cluster member drifts (e.g. netlify = restaurant while demo = beauty_salon), Result Screen shows **Artifacts are out of sync** and README/ZIP return 409.
