# FIX_NEXT_RUNTIME_MISSING_CHUNK_4447_V1

**Date:** 2026-06-14  
**Scope:** Next.js runtime — stale `.next` cache after STOP_PATCHING_CLIENT_FRONTEND_V1

---

## Problem

`GET /api/client-preview/latest` returned **500** with:

```
Cannot find module './4447.js'
Require stack: .next/server/webpack-runtime.js
```

Client wizard could not load preview data.

---

## Investigation

| Check | Result |
|-------|--------|
| Dynamic `import()` to deleted module | **None** (only `fs`/`path` in client-cleanup route) |
| Route importing deleted `client-wizard-page` | **None** — API uses `@/lib/client-preview/preview-service` only |
| Source refs to `client-wizard-page` | **None** in `src/` |
| Stale chunk reference | **Yes** — dev server `.next` mixed old webpack chunks after file deletion |

Root cause: **corrupted / stale `.next` build cache** from `next dev` after removing `src/views/client-wizard-page.tsx`. Dev webpack-runtime referenced chunk `4447.js` that no longer matched the live module graph.

No application code change required.

---

## Fix

```bash
pkill -f "next dev" ; pkill -f "next start"
rm -rf .next
npm run build
npm run start -- -p 3001
```

Do **not** rely on `next dev` alone after large route/module deletions — always verify with production `build` + `start`.

---

## Verify

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/client-preview/latest
# → 200

curl -s http://localhost:3001/api/client-preview/latest | jq .ok
# → true
```

Response is JSON (`Content-Type: application/json`), not HTML error page.
