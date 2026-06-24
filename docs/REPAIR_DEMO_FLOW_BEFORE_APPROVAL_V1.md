# REPAIR_DEMO_FLOW_BEFORE_APPROVAL_V1

**Date:** 2026-06-14  
**Scope:** Client preview demo-flow UI + demo.mp4 sync gate

---

## Problem

`/client-preview/latest` jumped straight to Live Preview + **ДА**, skipping the client demonstration steps:

1. Questionnaire  
2. Business sphere  
3. Manifest preview  
4. Live Preview  
5. Approval (**ДА** / **НЕТ**)

Also `demo.mp4` metadata referenced **Munich Dental Center** while active MVP is **Berlin Barber Studio / beauty_salon**.

---

## Fix

### Demo flow on `/client-preview/latest`

`client-preview-page.tsx` now renders five blocks before approval:

| Block | Content |
|-------|---------|
| 1 Questionnaire | Berlin Barber Studio, beauty_salon, de, email, phone |
| 2 Sphere | beauty_salon, beauty_salon_crm, clients/services/stylists/bookings |
| 3 Manifest | JSON card with delivery_ready + artifacts_in_sync |
| 4 Live Preview | Netlify iframe + URL link |
| 5 Approval | **ДА** → `/client-result/{preview_id}` · **НЕТ** → `/client-funnel` |

Data source: `buildDemoFlowData()` from active artifact cluster + legacy `client_profile.json`.

API: `ClientPreviewPayload.demo_flow` added to `/api/client-preview/*`.

### demo.mp4 sync gate

`demo-video-sync.ts`:

- Reads `docs/demo_video_manifest.json` from legacy ZIP + video client data
- Blocks forbidden terms (dental, Petrova, restaurant, barbershop, …)
- Requires manifest business name/type to match active MVP

When **not synced**:

- `demo_mp4` delivery option hidden on Result (`available: false`)
- `/api/client-result/demo` → HTTP 409 `Demo video not synced`
- Result page shows warning banner (no dental video offered as current MVP)

---

## Files

| File | Role |
|------|------|
| `demo-flow-data.ts` | Builds questionnaire / sphere / manifest blocks |
| `demo-video-sync.ts` | Validates demo video vs active MVP |
| `client-preview-page.tsx` | 5-block demo flow UI |
| `preview-service.ts` | Exposes `demo_flow`, gates demo option |
| `delivery-artifacts.ts` | `resolveDemoPath` requires sync |
| `client-funnel.css` | Demo flow styles |

---

## Verification

```bash
npm run build   # PASS
```

1. `/client-preview/latest` — blocks 1–5 visible, approval at bottom  
2. **ДА** → `/client-result/ihor-kriazhev-it`  
3. Result shows ZIP, README, Netlify, custom domain  
4. `demo.mp4` hidden (current dental video blocked)  
5. Warning: *Demo video not synced* on Result when applicable
