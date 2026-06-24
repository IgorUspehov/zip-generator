# CLIENT_QUESTIONNAIRE_UI_AUDIT

**Date:** 2026-06-14  
**Route:** `/client-questionnaire`  
**View:** `src/views/client-questionnaire-page.tsx`  
**Wrapper:** `src/app/(dashboard)/client-questionnaire/page.tsx` → `LocalizedPageShell`

---

## 1. All fields (visible)

| # | Field key | UI label (RU) | Control | Required in UI |
|---|-----------|-----------------|---------|----------------|
| 1 | `business_type` | Сфера деятельности | `<select>` — 10 options | No HTML required |
| 2 | `business_name` | Название | `<Input>` text | No |
| 3 | `phone` | Телефон | `<Input>` text | No |
| 4 | `whatsapp` | WhatsApp | `<Input>` text | No |
| 5 | `telegram` | Telegram | `<Input>` text | No |
| 6 | `email` | E-mail | `<Input type="email">` | No |
| 7 | `language` | Язык | `<select>` ru/de/en | No |
| 8 | `delivery_method` | Способ получения | `<select>` zip/netlify/github | No |

### Hidden fields (injected on save, not shown)

Injected by `buildSavePayload()`:

- `address`, `website`, `logo`, `currency`
- `plan_id`, `plan`, `amount`, `payment_status`
- `terms_accepted`, `privacy_accepted`, `accepted_at`
- `working_hours` (7 days)
- `social_links` (instagram, facebook, tiktok, website)
- `business_questions` (empty object)

---

## 2. All steps / sections

The page has **two cards**, not a multi-step wizard:

### Card 1 — Questionnaire form

1. Load existing data from `GET /api/client-questionnaire`
2. User edits fields
3. Optional: **Save Questionnaire** → `POST /api/client-questionnaire`

### Card 2 — MVP Delivery

1. **Create MVP** → saves questionnaire + `POST /api/client-delivery-v2/run`
2. Pipeline step list (6 steps, status badges)
3. On success → redirect to `/client-preview/latest` (Phase 1)
4. On failure → error alert

### V2 pipeline steps displayed

| Step name | Label (EN) |
|-----------|------------|
| `client_onboarding` | Client Onboarding |
| `mvp_assembly` | MVP Assembly |
| `template_selection` | Template Selection |
| `build_orchestrator` | Build Orchestrator |
| `react_mvp_build` | React MVP Build |
| `v2_finalize` | Finalize V2 & ZIP |

---

## 3. All texts (RU locale)

| Element | Text |
|---------|------|
| Page title (shell) | From i18n `pages.clientQuestionnaire` or dashboard |
| Card 1 title | Клиентский опросник V1 |
| Card 1 description | Выберите сферу, укажите контакты, язык и способ получения… |
| Card 2 title | Доставка MVP клиенту |
| Card 2 description | Сохраните опросник, затем запустите доставку MVP (V2). |
| Save button | Сохранить опросник |
| Generate button | Создать MVP |
| Success delivery | Успешно |
| Fail delivery | Ошибка |
| Open preview (Phase 1) | Открыть Live Preview |

Full copy in `src/lib/i18n/questionnaire-copy.ts` (ru/de/en).

---

## 4. All buttons

| Button | Location | Action |
|--------|----------|--------|
| **LanguageSwitcher** | Card 1 header | Switch UI locale ru/de/en |
| **Сохранить опросник** | Card 1 footer | POST questionnaire |
| **Создать MVP** | Card 2 | Save + run V2 delivery |
| **Открыть Live Preview** | Card 2 success alert | Link `/client-preview/latest` |

No «Next step» / «Back» wizard buttons.

---

## 5. Screenshot structure (page layout)

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Header: page title + LanguageSwitcher           │
├───────────┴─────────────────────────────────────────────────┤
│ CARD 1: Client Questionnaire V1                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Industry select — full width]                          │ │
│ │ [Business name — full width]                            │ │
│ │ [Phone]          [WhatsApp]                             │ │
│ │ [Telegram]       [Email]                                │ │
│ │ [Language]       [Delivery method]                      │ │
│ │ [Save Questionnaire]                                    │ │
│ │ [Saved / Error alerts]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ CARD 2: Client MVP Delivery                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Create MVP]                                            │ │
│ │ [Progress bar when running]                             │ │
│ │ Step list × 6 (label + status badge)                    │ │
│ │ [Success alert: metadata + Open Live Preview]           │ │
│ │ [Error alert on failure]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Concept alignment check

**Target concept:**

```
Контакты
  ↓
Сфера бизнеса
  ↓
Язык
  ↓
Generate MVP
```

### Verdict: **Partially matches — single form, not stepped flow**

| Concept step | Present? | Notes |
|--------------|----------|-------|
| Контакты | **Yes** | phone, whatsapp, telegram, email, business_name — same card |
| Сфера бизнеса | **Yes** | `business_type` select at top of form |
| Язык | **Yes** | `language` select + header LanguageSwitcher |
| Generate MVP | **Yes** | Separate card with «Создать MVP» |

### Gaps vs concept

1. **Not a wizard** — all fields on one screen; no step-by-step «Контакты → Сфера → Язык»
2. **Field order differs** — industry (`business_type`) is **first**, not after contacts
3. **Extra field** — `delivery_method` (zip/netlify/github) not in target concept
4. **Separate save** — «Сохранить опросник» exists before Generate MVP
5. **Post-MVP flow** (Phase 1) — redirects to Live Preview, not inline ZIP download

### Conclusion

The UI collects the same **data categories** (contacts, industry, language, MVP generation) but presents them as a **two-card flat form**, not a linear stepped questionnaire. Functionally aligned; UX structure **does not** match a strict step-by-step concept.
