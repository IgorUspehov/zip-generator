# USE_UPLOADED_HTML_AS_CANONICAL_FRONTEND_V1

**Date:** 2026-06-14  
**Source:** `mvp-factory (3).html`  
**Route:** `/client`

---

## Approach

`/client` is a **pixel-perfect React port** of `mvp-factory (3).html` — same class names, CSS, DOM structure, i18n object `T`, and 6-step flow (s1–s6).

No alternate wizard UI. No custom `cw-*` classes. No manifest step (not in HTML v3).

| File | Role |
|------|------|
| `src/client-wizard/styles.css` | Verbatim CSS from HTML `<style>` |
| `src/client-wizard/copy.ts` | Verbatim i18n `T` (en/de/ru) |
| `src/client-wizard/page.tsx` | HTML structure → React (s1–s6) |
| `src/client-wizard/api.ts` | Allowed API fetch wrappers only |

---

## Steps (HTML canonical)

1. **s1** — Contacts (name + email, slogan)
2. **s2** — Business sector (`<select>`)
3. **s3** — Platform language (pills) → Generate MVP
4. **s4** — Build animation
5. **s5** — Live Preview (preview-bar + preview-body from API)
6. **s6** — Download grid (8 buttons from result API)

---

## API wiring

| When | API |
|------|-----|
| Step 3 Generate | `POST /api/client-questionnaire` + `GET /api/client-preview/latest` |
| Step 5 Yes | `GET /api/client-result/latest` |
| Step 6 links | `delivery_options` → zip, netlify, custom_domain, github, apk, pwa, readme, demo_mp4 |

Allowed endpoints only — no v2 polling, no legacy funnel components.

---

## PASS

Browser `/client` matches `mvp-factory (3).html`:

- Same steps s1–s6
- Same fields, buttons, texts, styles
- Same screen sequence
- Data populated from API after Generate / Yes
