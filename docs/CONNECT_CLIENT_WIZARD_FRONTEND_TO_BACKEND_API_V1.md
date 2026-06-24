# CONNECT_CLIENT_WIZARD_FRONTEND_TO_BACKEND_API_V1

**Date:** 2026-06-14  
**Route:** `http://localhost:3001/client`

---

## Problem

`/client` rendered an internal **dashboard** (artifact status cards), not the client-facing wizard.

---

## Solution

New **`ClientWizardPage`** at `src/app/client/page.tsx` — standalone route without dashboard shell.

### Wizard steps

```
Contacts → Business Sector → Language → Build → Manifest → Live Preview → Result
```

| Step | UI | API |
|------|-----|-----|
| Contacts | Name, business, email | Prefill from `/api/client-preview/latest` |
| Business Sector | Sector grid (incl. beauty_salon) | — |
| Language | Language pills | — |
| Build | Animation + build steps | POST `/api/client-questionnaire`; uses existing preview if ready, else POST `/api/client-delivery-v2/run` |
| Manifest | JSON manifest card | `demo_flow.manifest_card` from preview API |
| Live Preview | Netlify iframe (dashboard inside iframe only) | `preview_url` from preview API |
| Result | ZIP / README / Netlify / demo cards | GET `/api/client-result/latest` after YES |

### Result delivery links

Uses existing hrefs from Result API:

- ZIP → `/api/client-delivery/download`
- README → `/api/client-result/readme`
- demo.mp4 → `/api/client-result/demo`
- Netlify → deploy URL

---

## Files

| File | Change |
|------|--------|
| `src/views/client-wizard-page.tsx` | New unified wizard |
| `src/app/client/page.tsx` | Main client route |
| `src/app/(dashboard)/client-dashboard/page.tsx` | Old dashboard relocated |
| `src/lib/client-funnel/constants.ts` | Added `beauty` → `beauty_salon` sector |
| `src/lib/i18n/client-funnel-copy.ts` | Manifest step copy + beauty sector |

---

## Verification

```bash
npm run build   # PASS
npm run dev -- -p 3001
```

1. Open `http://localhost:3001/client`
2. Walk through Contacts → Sector → Language → Generate
3. See Manifest JSON (Berlin Barber Studio / beauty_salon)
4. Live Preview iframe (Netlify)
5. Click **YES** → Result with ZIP, README, Netlify
6. Dashboard is **not** the first screen — only inside iframe preview
