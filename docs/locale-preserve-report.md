# CRM locale preserve — local evidence (no deploy)

**When:** 2026-07-20  
**Scope:** CRM UI + `sync-crm-catalog` only (resolve-catalog / API schema untouched)  
**Runtime:** Next `127.0.0.1:3000` + CRM `127.0.0.1:4173` (`VITE_MANIFEST_API_BASE=http://127.0.0.1:3000`)  
**Data:** `RAILWAY_VOLUME_MOUNT_PATH=/tmp/crm-redeploy-data`, `CATALOG_BACKEND=file`  
**Script:** `scripts/verify-crm-locale-preserve.ts`  
**Artifacts:** `docs/locale-preserve-screenshots/`, `docs/locale-preserve-report.json`

## Fix summary

| Layer | Change |
|-------|--------|
| `App.jsx` `normalizeDemoData` (services) | Keep full `{en,de,ru}` for `name` / localized `duration` |
| Hydrate from shared catalog | Store LocalizedLabel object, do not collapse to UI language string |
| Display / edit forms | Show current language via `serviceLabel`; form holds one-lang string |
| `handleAddCrmService` / `saveEditService` | `patchLocalizedLabel` — update only active UI language |
| `sync-crm-catalog.js` | Primary path = full object; **removed** string→`{en,de,ru}` fan-out |

## Results (ALL PASS)

| Niche | BEFORE (EN site after DE collapse) | AFTER open CRM DE | AFTER edit DE only |
|-------|------------------------------------|-------------------|--------------------|
| **realestate** | EN/RU = German | EN=`Property Sales`… RU=`Продажа недвижимости`… | DE=`Immobilienverkauf (DE-edit)`, EN/RU intact |
| **dental** | EN/RU = German | EN=`Dental Check-up`… RU=`Осмотр зубов`… | DE=`Zahnkontrolle (DE-edit)`, EN/RU intact |
| **car_wash** | EN/RU = German | EN=`Exterior wash`… RU=`Мойка кузова`… | DE=`Außenwäsche (DE-edit)`, EN/RU intact |

## Screenshot index

### realestate
- BEFORE EN: `realestate-BEFORE-site-en.png` (dropdown = German)
- AFTER CRM DE Services: `realestate-AFTER-crm-de-services.png`
- AFTER site EN/RU: `realestate-AFTER-site-en.png`, `realestate-AFTER-site-ru.png`
- AFTER edit EN/RU: `realestate-AFTER-edit-site-en.png`, `realestate-AFTER-edit-site-ru.png`

### dental
- BEFORE EN: `dental-BEFORE-site-en.png` (Zahnkontrolle / Zahnreinigung / …)
- AFTER edit EN: `dental-AFTER-edit-site-en.png` (Dental Check-up / Teeth Cleaning / Root Canal)

### car_wash
- AFTER edit RU: `car_wash-AFTER-edit-site-ru.png` (Мойка кузова / Салон / Комплекс)

## Deploy

**Not deployed.** Waiting for confirmation.
