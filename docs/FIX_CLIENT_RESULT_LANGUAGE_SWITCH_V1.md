# FIX_CLIENT_RESULT_LANGUAGE_SWITCH_V1

**Date:** 2026-06-14  
**Scope:** Frontend i18n only — result screen language switch

---

## Problem

On `/client-result/[id]`, EN / DE / RU switch did not fully localize the screen:
- UI strings from `getPreviewCopy(locale)` updated partially
- Delivery option **labels** came from API (`preview-service.ts`) with hardcoded mixed language (e.g. «Свой домен»)
- Badge showed hardcoded «OK» instead of localized status
- `/client-questionnaire` used separate `uiLocale` state — language did not persist to preview/result

---

## Root cause

| Layer | Issue |
|-------|--------|
| Result cards | Rendered `option.label` from API, not locale copy |
| Questionnaire | Claude funnel used local `useState` for UI language, not `I18nProvider` |
| Funnel shell | Nav labels hardcoded in English |

Preview/result already used `useTranslation()` + `LanguageSwitcher` → `localStorage` key `factory-locale`.

---

## Fix

### 1. Extended `src/lib/i18n/preview-copy.ts`

- Added `deliveryOptions` per locale (all 8 keys)
- Added `optionAvailable`, funnel nav labels, funnel brand/subtitle
- Added `getDeliveryOptionCopy(locale, key)` helper

### 2. `src/views/client-result-page.tsx`

- `DeliveryOptionCard` uses `copy.deliveryOptions[option.key]` for label + description
- Status badge: `copy.optionAvailable` / `copy.optionUnavailable`
- Re-renders on `locale` change via `useTranslation()` (no reload)

### 3. `src/components/client-funnel-shell.tsx`

- Nav + header use `getPreviewCopy(locale)` — updates with language switch

### 4. `src/views/claude-funnel-page.tsx`

- Replaced local `uiLocale` with `useTranslation().locale` / `setLocale`
- Same `factory-locale` storage as preview/result

---

## Language persistence chain

```
I18nProvider (localStorage: factory-locale)
  ├── /client-questionnaire  (Claude funnel LanguageSwitcher → setLocale)
  ├── /client-preview/[id]   (LanguageSwitcher in ClientFunnelShell)
  └── /client-result/[id]    (LanguageSwitcher in ClientFunnelShell)
```

Switching EN / DE / RU on any page updates all subsequent pages without reload.

---

## Unchanged

- Backend APIs
- `preview-service.ts` delivery option **data** (availability, href)
- Client Delivery V2 pipeline

---

## Verification

```bash
npm run build   # PASS
npm run start
```

1. Open `/client-result/latest` (or approved `/client-result/{id}`)
2. Click **EN** → all labels English (incl. «Custom domain», «Available options»)
3. Click **DE** → all German
4. Click **RU** → all Russian

Navigate questionnaire → preview → result — language persists.
