# CLIENT_DELIVERY_V2 — Phase 2 Visual Differentiation Audit

**Date:** 2026-06-14  
**Scope:** Read-only audit. No code changes.  
**Pipeline audited:** `npm run client:deliver:v2` (Phase 1)  
**Compared business types:** `barbershop`, `dental_clinic`, `restaurant`, `fitness_club`  
**React source:** `artifacts/factory_output/client_delivery_v2/react_mvp/`  
**Generator:** `react_mvp_build_executor_factory` → single-page scaffold from `build_plan.json`

---

## Executive Summary

Phase 1 V2 **proves template/module selection in JSON and metadata**, but **does not produce visually distinct product MVPs** for the four business types.

All four types render the **same single-page layout**, the **same component tree**, the **same CSS theme**, and the **same section structure**. Differences are limited to **text values** loaded from JSON (business type slug, template id, module pill labels, browser tab title).

**5-second client test:** A typical non-technical client **cannot** reliably tell barbershop from dental clinic from restaurant from fitness club. At best they might notice different English technical labels (`barbershop` vs `dental_clinic`) or one different module chip (`menu` on restaurant).

---

## Selection Matrix (backend — differs correctly)

| business_type | template_id | selected_ui | modules | normalized_category |
|---------------|-------------|-------------|---------|---------------------|
| barbershop | `beauty_salon_crm` | `dashboard_modern` | appointments, crm, booking | beauty_salon |
| dental_clinic | `medical_crm` | `dashboard_modern` | appointments, crm, notifications | dentist |
| restaurant | `restaurant_crm` | `dashboard_modern` | appointments, crm, menu | restaurant |
| fitness_club | `fitness_crm` | `dashboard_modern` | appointments, booking, crm | fitness |

Knowledge packs used differ (`beauty_salon`, `dentist`, `restaurant`, `fitness_club`), but **pack content is not rendered** in the Phase 1 React MVP.

---

## 1. Какие страницы отличаются?

### Ответ: **ни одна страница визуально не отличается — есть только одна страница, и она одинакова.**

| Aspect | barbershop | dental_clinic | restaurant | fitness_club |
|--------|------------|---------------|------------|--------------|
| Route / URL | `/` (SPA root) | `/` | `/` | `/` |
| Page files | none (`src/pages/` absent) | none | none | none |
| Rendered view | `App.jsx` only | `App.jsx` only | `App.jsx` only | `App.jsx` only |
| Page count | 1 | 1 | 1 | 1 |

**Details:**

- V2 React MVP has **no router**, no `DashboardPage`, no per-template pages.
- `react_mvp_scaffold_builder` + `react_mvp_content_builder` emit one screen: header + 3 cards + footer.
- `App.jsx`, `main.jsx`, `styles.css`, `vite.config.js` are **byte-identical** for all four business types (MD5 hash `a581ab94` for App.jsx across all runs).

**Only file-level diffs per type:**

| File | Differs? | What changes |
|------|----------|--------------|
| `index.html` | Yes | `<title>{business_type} — React MVP</title>` |
| `package.json` | Yes | `"name"` slug from business_type |
| `src/data/build_plan.json` | Yes | template, modules, business_type |
| `src/data/business_profile.json` | Yes | business_type, template |
| `src/data/modules.json` | Yes | module list |
| `src/App.jsx` | **No** | identical |
| `src/styles.css` | **No** | identical |

**Contrast (not in V2 path):** V1 pre-built dashboard at `react_ui/client_package/` has `DashboardPage.tsx` with 10+ sections — but that package is **not used** in V2 when `fallback_used: false`.

---

## 2. Какие компоненты отличаются?

### Ответ: **ни один React-комponent не отличается — один `App`, одна разметка.**

| Component / block | Present | Differs across types? |
|-------------------|---------|------------------------|
| `App` (root) | Yes | **No** — same JSX source |
| Header block (`.app-header`) | Yes | **No** — structure identical |
| Eyebrow label | Yes | **No** — always `"React MVP Build Executor"` |
| `<h1>` | Yes | **Text only** — `{business_type}` slug |
| Subtitle | Yes | **No** — always `"Generated from build_plan.json — llm_used=false"` |
| Card: Business Profile | Yes | **No** — same fields; `business_type` value differs |
| Card: Template Selection | Yes | **No** — same fields; `template` / `ui` values differ |
| Card: Selected Modules | Yes | **No** — same `<ul>`; pill **labels** differ |
| Footer (`.app-footer`) | Yes | **No** — same spans; `template` text differs |
| Sidebar, Hero, Calendar, CRM table, Staff, Contact | **No** | Not present in V2 MVP |

**Module pills (only dynamic list content):**

```
barbershop:     [appointments] [crm] [booking]
dental_clinic:  [appointments] [crm] [notifications]
restaurant:     [appointments] [crm] [menu]
fitness_club:   [appointments] [booking] [crm]
```

Shared pills `appointments` and `crm` appear on **all four** screens with identical styling (blue rounded chips).

**Not wired in Phase 1:**

- `react_mvp_business_content_integration_factory` (would add `pages/` + datasets) — **not in V2 pipeline**
- `react_ui_factory` components (Header, AppointmentTable, etc.) — **not used**

---

## 3. Какие данные отличаются?

### Metadata / JSON (differs — machine-readable)

| Data field | barbershop | dental_clinic | restaurant | fitness_club |
|------------|------------|---------------|------------|--------------|
| `manifest.template_id` | beauty_salon_crm | medical_crm | restaurant_crm | fitness_crm |
| `build_plan.template` | beauty_salon_crm | medical_crm | restaurant_crm | fitness_crm |
| `build_plan.modules` | 3 items | 3 items | 3 items | 3 items |
| `normalized_category` | beauty_salon | dentist | restaurant | fitness |
| `selected_ui` | dashboard_modern | dashboard_modern | dashboard_modern | dashboard_modern |
| `knowledge_pack_used` | …/beauty_salon | …/dentist | …/restaurant | …/fitness_club |

### On-screen rendered data (differs — minimal)

| UI field | Differs? | Notes |
|----------|----------|-------|
| Page title (browser tab) | Yes | `{business_type} — React MVP` |
| H1 headline | Yes | Raw slug: `barbershop`, `dental_clinic`, … |
| Business Profile → Business Type | Yes | Same slugs |
| Template Selection → Selected Template | Yes | `*_crm` template ids |
| Template Selection → Selected UI | **No** | Always `dashboard_modern` |
| Selected Modules list | Partially | 1–2 of 3 pills may differ |
| Language | No* | Same if questionnaire language unchanged (`de`) |
| Delivery Mode / Build Target | No | Always `client_package` / `react_mvp` |
| Client contacts (name, phone, email) | No† | **Not displayed** in V2 React MVP |

\* Language affects `document.documentElement.lang` but not visible copy (all UI strings are hardcoded English in `App.jsx`).

† `manifest.client_contacts` exists in ZIP metadata but is **not bound** into the React UI in Phase 1.

### Knowledge library (loaded at assembly, not shown)

| Pack | Distinct features (not rendered) |
|------|----------------------------------|
| beauty_salon | booking, service_menu, staff_schedule, client_history |
| dentist | appointments, patient_records, treatment_catalog, notifications |
| restaurant | reservations, menu_management, delivery_tracking, loyalty_points |
| fitness_club | memberships, class_schedule, trainer_booking, progress_tracking |

---

## 4. Какие элементы UI одинаковые?

**Everything structural and visual is shared:**

| Layer | Same across all 4 types |
|-------|-------------------------|
| Layout | Single column header + 3-card grid + footer |
| Color palette | `#eef3fb` background, white cards, `#dbeafe` pills, `#1d4ed8` pill text |
| Typography | Segoe UI / system-ui, same sizes (h1 2.5rem, etc.) |
| Spacing / radius | 16px card radius, 2rem shell padding |
| Component code | `App.jsx`, `main.jsx`, `styles.css`, `vite.config.js` |
| Section titles | "Business Profile", "Template Selection", "Selected Modules" |
| Eyebrow + subtitle | Developer boilerplate text |
| UI pattern | `dashboard_modern` selected but **not implemented** as a distinct theme |
| Icons / images / logo | None |
| Charts / tables / forms | None |
| i18n | No localized strings — English UI regardless of `language=de` |
| Business-specific demo content | None (no salon/dental/restaurant/fitness copy) |

**Visually identical screens (screenshot-equivalent layout):**

```
┌─────────────────────────────────────────────┐
│ REACT MVP BUILD EXECUTOR                    │
│ {business_type}                             │  ← only this line's text changes
│ Generated from build_plan.json...           │
├─────────────────┬───────────────────────────┤
│ Business Profile│ Template Selection        │
│ (dl fields)     │ template / ui values      │  ← template value changes
├─────────────────┴───────────────────────────┤
│ Selected Modules: [pill] [pill] [pill]      │  ← 1-2 pill labels may change
├─────────────────────────────────────────────┤
│ Template: … | UI: dashboard_modern | …      │
└─────────────────────────────────────────────┘
```

---

## 5. Может ли клиент визуально понять разницу между MVP за 5 секунд?

### Ответ: **Нет** (для типичного клиента). **Маловероятно даже для технического пользователя.**

| Criterion | Assessment |
|-----------|------------|
| Distinct layout per industry | Fail — same scaffold |
| Distinct color / branding | Fail — identical CSS |
| Business name visible | Fail — shows `business_type` slug, not `business_name` |
| Industry-specific sections (menu, treatments, classes) | Fail — not rendered |
| Localized copy (DE/RU) | Fail — English developer strings |
| Obvious at a glance | Fail — looks like internal factory debug screen |

**What a client sees in 5 seconds:** four nearly identical white cards on a light blue-gray background with technical labels. The headline may say `barbershop` vs `dental_clinic` — not `"Berlin Barber Studio"` vs `"Munich Dental Center"`.

**Fastest distinguishable pair:** `restaurant` — module pill `menu` is the only industry-specific chip. Others share `appointments` + `crm`.

**Pair hardest to distinguish:** `barbershop` vs `fitness_club` — both show `appointments`, `crm`, `booking` (order differs only).

---

## Side-by-Side Visual Diff Summary

| Visual element | barbershop | dental_clinic | restaurant | fitness_club |
|----------------|:----------:|:-------------:|:----------:|:------------:|
| Layout | = | = | = | = |
| Colors / CSS | = | = | = | = |
| H1 text | barbershop | dental_clinic | restaurant | fitness_club |
| Template label | beauty_salon_crm | medical_crm | restaurant_crm | fitness_crm |
| Unique module chip | booking | notifications | **menu** | booking |
| Product-ready feel | ✗ | ✗ | ✗ | ✗ |

---

## Root Cause (why visual diff is weak)

1. **Phase 1 scope:** `react_mvp_build_executor` is a **proof-of-selection scaffold**, not a product UI factory.
2. **`App.jsx` is static** — generated once; no module-gated sections, no template-specific JSX branches.
3. **`selected_ui: dashboard_modern`** is stored in JSON but not mapped to different layouts or themes.
4. **Knowledge packs** influence module **names** only at assembly time; features like `menu_management`, `memberships`, `patient_records` do not create UI blocks.
5. **Client contacts** from Questionnaire V1 are in `manifest.json` but not injected into React.
6. **Phase 2 rich dashboard** (`react_ui_factory` / `react_mvp_business_content_integration`) is documented but **not connected** to `client:deliver:v2`.

---

## Recommendations for Phase 2 (informational — out of audit scope)

To pass the 5-second client test, Phase 2 would need at minimum:

1. Template-specific pages or module-gated sections (not one static `App.jsx`).
2. Business name + localized industry copy from knowledge packs / questionnaire.
3. Distinct demo datasets per category (services, menu items, treatments, classes).
4. Visual theme or layout variation per `template_id` or `normalized_category`.
5. Wire `react_mvp_business_content_integration` or `react_ui_from_build_plan` adapter into V2 pipeline.

---

## Audit Conclusion

| Question | Result |
|----------|--------|
| Pages differ? | **No** — one identical page |
| Components differ? | **No** — one identical `App` |
| Data differs? | **Yes in JSON**; **marginally on screen** (slugs, template id, module pills) |
| UI elements same? | **Yes** — layout, styles, structure, most labels |
| 5-second visual differentiation? | **No** |

**Phase 1 V2 status:** Selection differentiation **proven in artifacts** (`manifest.json`, `build_plan.json`, ZIP metadata). **Visual product differentiation not achieved.**

---

*Generated from static analysis of `react_mvp_build_executor_factory` sources, assembly outputs for four business types, and current `artifacts/factory_output/client_delivery_v2/react_mvp/`.*
