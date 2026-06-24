# REPAIR_CLIENT_RESULT_ARTIFACTS_V1

**Date:** 2026-06-14  
**Scope:** Result Screen artifacts after YES — frontend/API layer only  
**Not changed:** questionnaire, preview UI, V2 pipeline, manifest factory, payment

---

## Problems fixed

| Issue | Root cause | Fix |
|-------|------------|-----|
| ZIP = factory archive | Stale `output/client_delivery` (Berlin Barber) preferred over current V2 | Materialize live package from V2 manifest |
| README = Berlin Barber / 404 | Old `README_CLIENT.txt` + wrong priority | Generate README from current manifest + questionnaire |
| Custom Domain → beautysalon-munich.de | `deployment_url.txt` used as href | Internal guide `/client-result/custom-domain` only |
| GitHub → admin dashboard | Link to `/artifacts/.../README_DEPLOY.md` | Removed unless client GitHub package matches current business |
| PWA/APK shown | Always included in options | Removed from result options entirely |

---

## Architecture

### Source of truth

Current generation = `artifacts/factory_output/client_delivery_v2/manifest.json`  
(`status: DELIVERY_READY`, `generated_at` stamp)

### Materializer

`src/lib/client-preview/client-delivery-materializer.ts`

On each result/download/readme request:

1. Read V2 manifest + `input/client_onboarding_questionnaire.json`
2. If `generated_at` changed → rebuild `output/client_delivery_live/`
3. Package structure inside `final_package.zip`:

```
README_CLIENT.txt
README.md
manifest.json
client_data/client_profile.json
client_data/README_CLIENT.txt
app/client_package/     ← V2 react_mvp
demo/demo.mp4
deploy/deploy_report.json
```

4. Cache stamp: `output/client_delivery_live/.generation_stamp`

### Example (current client)

- Business: **Ihor Kriazhev IT**
- Email: uspeh.polimer2022@gmail.com
- Template: restaurant_crm

---

## Result Screen options

Visible on `/client-result/[id]`:

| Option | Endpoint / route | Condition |
|--------|------------------|-----------|
| ZIP | `/api/client-delivery/download` | Live materialized zip |
| Netlify | External Netlify URL | Only if `deployment_url.txt` exists |
| Custom Domain | `/client-result/custom-domain` | V2 delivery ready |
| README | `/api/client-result/readme` | Live README generated |
| demo.mp4 | `/api/client-result/demo` | Demo file available |

Hidden:

- **GitHub** — unless `github_delivery_package` exists AND `business_type` matches manifest
- **APK / PWA** — not included in client result options

---

## Custom Domain guide

Route: `/client-result/custom-domain`

Steps (EN/DE/RU):

1. Buy a domain
2. Open DNS panel
3. Add Netlify DNS records
4. Wait for SSL

Shows real Netlify deploy URL — **never** links to `beautysalon-munich.de`.

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/client-preview/client-delivery-materializer.ts` | **NEW** — sync zip/readme from V2 |
| `src/lib/client-preview/delivery-artifacts.ts` | Live paths + Netlify reader |
| `src/lib/client-preview/preview-service.ts` | Client-only delivery options |
| `src/app/api/client-delivery/download/route.ts` | Prefer `client_delivery_live` zip |
| `src/app/api/client-result/readme/route.ts` | Live README |
| `src/app/api/client-result/demo/route.ts` | Live demo path |
| `src/views/client-result-page.tsx` | Whitelist client options |
| `src/lib/i18n/preview-copy.ts` | Domain guide steps |

---

## Verification

```bash
npm run build   # PASS
npm run start -- -p 3001
```

Flow:

1. `/client-preview/latest`
2. **ДА**
3. `/client-result/latest`

Check:

- [ ] ZIP contains `Ihor Kriazhev IT` in README + manifest
- [ ] README opens current client text (not Berlin Barber)
- [ ] Custom Domain → instruction page (no beautysalon-munich.de)
- [ ] Netlify → harmonious-unicorn-e1596b.netlify.app
- [ ] demo.mp4 plays
- [ ] GitHub not shown (business_type mismatch)
- [ ] PWA/APK not shown

---

## Build

`npm run build` — **PASS**
