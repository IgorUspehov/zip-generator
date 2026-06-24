# STOP_PATCHING_CLIENT_FRONTEND_V1

**Date:** 2026-06-14  
**Scope:** Clean replacement of `/client` — wizard only, no legacy UI

---

## Problem

`/client` was patched on top of old dashboard / client-funnel / preview / result layouts. Imports pulled in `client-funnel.css`, `client-funnel-copy`, `client-preview/types`, `client-delivery-v2`, and lucide icons — a mix of old and new UI on the first screen.

---

## Fix

New isolated module **`src/client-wizard/`** — self-contained wizard from the MVP Factory HTML prototype.

| File | Role |
|------|------|
| `page.tsx` | 7-step wizard UI (Contacts → Sector → Language → Build → Manifest → Live Preview → Result) |
| `styles.css` | Standalone dark theme (DM Sans), no `client-funnel.css` |
| `copy.ts` | EN / DE / RU strings + sector/language maps |
| `api.ts` | Thin fetch wrappers for allowed APIs only |
| `types.ts` | Wizard step + API response types |

**Removed:** `src/views/client-wizard-page.tsx` (legacy imports).

**Route:** `src/app/client/page.tsx` → `@/client-wizard/page` only.

---

## Wizard flow

1. **Contacts** — name, business name, email  
2. **Business Sector** — sector grid  
3. **Language** — platform language pills  
4. **Build** — animated build steps  
5. **Manifest** — JSON manifest from `GET /api/client-preview/latest`  
6. **Live Preview** — iframe from `preview_url` (Netlify)  
7. **Result** — delivery grid from `GET /api/client-result/latest`

---

## Allowed APIs (frontend)

- `GET /api/client-preview/latest`
- `GET /api/client-result/latest`
- `POST /api/client-questionnaire`
- `GET /api/client-delivery/download` (via result `delivery_options` href)
- `GET /api/client-result/readme` (via result `delivery_options` href)

**Not used by `/client`:** `client-delivery-v2/*`, old funnel/preview/result page components.

---

## Forbidden on `/client`

- Old dashboard shell  
- `client-funnel` components / CSS  
- Legacy preview / result layouts  
- V2 delivery polling from wizard UI  

Old routes (`/client-dashboard`, `/client-funnel`, `/client-preview/*`, `/client-result/*`) remain elsewhere; they are not mounted on `/client`.

---

## Verify

```bash
npm run build          # PASS
npm run dev -- -p 3001
open http://localhost:3001/client
```

**PASS:** First screen is Contacts wizard only — dark card, MVP Factory logo, 7 progress dots. No dashboard, no legacy component mix.
