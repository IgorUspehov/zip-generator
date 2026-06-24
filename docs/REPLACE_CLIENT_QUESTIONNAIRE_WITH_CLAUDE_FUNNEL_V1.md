# REPLACE_CLIENT_QUESTIONNAIRE_WITH_CLAUDE_FUNNEL_V1

**Date:** 2026-06-14  
**Scope:** Frontend-only replacement of `/client-questionnaire`

---

## Summary

Replaced the old two-card questionnaire (`ClientFunnelShell` + full form) with a **Claude Funnel wizard** — dark UI, 4 steps, build animation, wired to existing V2 APIs.

**Source file:** `/mnt/data/Вставленный текст(98).txt` was not available on disk; UI implemented from task specification (dark card, gradient logo, progress dots, slogans EN/DE/RU).

---

## Backups

| File | Backup |
|------|--------|
| `src/app/client-questionnaire/page.tsx` | `page.tsx.bak` |
| `src/views/client-questionnaire-page.tsx` | `client-questionnaire-page.tsx.bak` |

---

## Files added / changed

| File | Action |
|------|--------|
| `src/views/claude-funnel-page.tsx` | **New** — wizard UI + API wiring |
| `src/lib/i18n/claude-funnel-copy.ts` | **New** — EN/DE/RU funnel copy + business types |
| `src/app/client-questionnaire/page.tsx` | **Changed** — imports `ClaudeFunnelPage` |

**Unchanged:** all backend routes, V2 pipeline, preview/result pages, factory modules.

---

## Wizard steps

| Step | Fields | Action |
|------|--------|--------|
| 1 | name, email | Continue |
| 2 | business_type (select) | Back / Continue |
| 3 | MVP language (en/de/ru) | Back / Continue |
| 4 | Summary + **Generate MVP** | Back / Generate |
| building | Animation | Poll status every 2s |
| redirect | — | `/client-preview/latest` when `DELIVERY_READY` |

---

## API chain

```
POST /api/client-questionnaire
  payload: { name, business_name: name, email, business_type, language, ...defaults }

POST /api/client-delivery-v2/run

GET /api/client-delivery-v2/status  (every 2s until DELIVERY_READY)

→ router.push("/client-preview/latest")
```

Hidden defaults (required by backend): empty phone/telegram/whatsapp, `working_hours`, `social_links`, `currency: EUR`, `plan_id: free`, etc.  
**No `delivery_method` in UI** — backend defaults to `zip`.

---

## Visual design

- Dark background `#0a0a0f` with violet/cyan gradients
- Centered glass card
- Gradient logo (Factory icon)
- Progress dots (4 steps)
- UI language switch: EN / DE / RU (funnel labels)
- Slogans:
  - EN: Without code / Without developers / Without AI
  - DE: Ohne Code / Ohne Entwickler / Keine KI
  - RU: Без кода / Без программиста / Без ИИ

---

## Downstream flow (unchanged)

```
/client-preview/latest  →  YES  →  /client-result/{id}
                       →  NO   →  /client-questionnaire
```

---

## Verification

```bash
npm run build
npm run start
```

URLs:
- http://localhost:3000/client-questionnaire
- http://localhost:3000/client-preview/latest
- http://localhost:3000/client-result/munich-dental-center-bd979c

Screenshots: `output/claude-funnel-screenshots/01–04-*.png`
