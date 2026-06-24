# RESTORE_CLIENT_WIZARD_STEP1_EXACT_V1

**Date:** 2026-06-14  
**Source:** `mvp-factory (2).html`  
**Scope:** Step 1 contacts screen on `/client` only

---

## Problem

Step 1 showed wrong copy and extra fields:
- «Начнём» / «Let's get started» instead of «Делаем вместе ваш MVP.»
- Subtitle paragraph instead of three slogan lines
- Business name field with Berlin Barber prefill
- Active preview prefill on mount

---

## Fix

### `src/client-wizard/copy.ts`

Step 1 strings aligned to HTML i18n (`T.en` / `T.de` / `T.ru`):
- `s1_h`, `no1`, `no2`, `no3`
- `ph_email`: `anna@example.com`
- RU: «Делаем вместе ваш MVP.», «Без кода», «Без программиста», «Без ИИ», «Ваше имя», «Продолжить»

### `src/client-wizard/page.tsx`

- Step 1: name + email only (no business name field)
- Slogan block (`.cw-step-slogan`) instead of `s1_sub`
- Removed mount-time `fetchPreviewLatest` prefill
- Validation: name + email (matches HTML `go1()`)
- `business_name` fetched from API only in `runGenerate()` (after Step 3)
- Default UI lang: `ru` (PASS screen)

### `src/client-wizard/styles.css`

- Added `.cw-step-slogan` from HTML prototype

---

## PASS

`http://localhost:3001/client` shows:

- «Делаем вместе ваш MVP.»
- «Без кода» / «Без программиста» / «Без ИИ»
- «Ваше имя» placeholder «Анна Мюллер»
- «Email» placeholder «anna@example.com»
- «Продолжить»
- **No** «Название бизнеса», Berlin Barber, or hello@berlin-barber
