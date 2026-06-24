# FIX_CLIENT_PREVIEW_APPROVAL_NAVIGATION_V1

**Date:** 2026-06-14  
**Scope:** Frontend approval flow + preview_id route resolution

---

## Problem

On `/client-preview/latest`, clicking **ДА** did not show the result screen.

- Preview API: `ok=true`, `preview_id=ihor-kriazhev-it`
- Result API `/latest`: `ok=true`, delivery options available
- UI still showed: *«Сначала подтвердите preview на экране Live Preview»*

Root causes:

1. **Route mismatch:** YES navigated to `/client-result/ihor-kriazhev-it`, but `resolvePreviewId()` did not accept the active slug id — only hashed `computePreviewId()` or `latest`. Result API returned `ok=false` for the slug route.

2. **Frontend gate too strict:** Result page required `sessionStorage` approval even when the Result API already confirmed readiness (`ok`, `artifacts_in_sync`, delivery options).

---

## Fix

### 1. `preview-service.ts` — `resolvePreviewId()`

Also accepts `assessActiveArtifacts(routeId).preview_id` (e.g. `ihor-kriazhev-it`).

`/api/client-result/ihor-kriazhev-it` now returns `ok=true`.

### 2. `result-readiness.ts` (new)

`isResultApiReady(payload)` — true when:

- `ok === true`
- `artifacts_in_sync !== false`
- at least one delivery option is available

### 3. `client-result-page.tsx`

Show result when **either**:

- user approved preview (`sessionStorage`), **or**
- Result API is ready (`isResultApiReady`)

No blocking message when API confirms delivery readiness.

Auto-persists approval when API is ready (so subsequent visits stay approved).

Redirect to preview only when **both** user approval and API readiness are missing.

### 4. `client-preview-page.tsx` (unchanged behaviour)

**ДА** still:

1. reads `payload.preview_id`
2. `markPreviewApproved(preview_id)`
3. navigates to `/client-result/{preview_id}`

---

## Verification

```bash
npm run build   # PASS
npm run dev -- -p 3001
```

1. Open `http://localhost:3001/client-preview/latest`
2. Click **ДА**
3. URL → `http://localhost:3001/client-result/ihor-kriazhev-it`
4. Result cards visible: ZIP, README, demo.mp4, Netlify, custom domain
5. `http://localhost:3001/client-result/latest` also shows result when API is ready
