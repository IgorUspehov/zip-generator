# Audit: Client Questionnaire V1 → Manifest → MVP Logic

**Date:** 2026-06-14  
**Scope:** Read-only audit. No code changes.  
**Example trace:** `barbershop` / `Berlin Barber Studio` / `language=de` / `delivery_method=zip`

---

## Executive Summary

Client Questionnaire V1 saves 8 visible fields (+ hidden defaults) to `input/client_onboarding_questionnaire.json`.  
Delivery (`npm run client:deliver`) reads that file once in **Client Onboarding Factory**, builds `client_profile.json`, then runs **binding factories** that patch contact data into a **pre-built React package** and zip it.

**Critical finding:** The client delivery path does **not** run template/module selection (`mvp_assembly_intelligence_factory`, `template_selection_integration`, `react_ui_factory` rebuild).  
MVP structure (calendar, CRM, staff, appointments) is **fixed in the existing React app**. Questionnaire `business_type` affects **metadata and knowledge pack routing**, not which UI blocks are rendered.

There are **two parallel pipelines** in the repo:

| Pipeline | Trigger | Selects template/modules? | Produces client ZIP |
|----------|---------|---------------------------|---------------------|
| **Client delivery** | `npm run client:deliver` / `/api/client-delivery/run` | No | Yes (`output/client_delivery/final_package.zip`) |
| **Full V5 build** | `npm run full-v5-pipeline:*` | Yes (`assembly_decision.json`) | Separate (`output/mvp_package.zip`) |

Questionnaire V1 is wired to **Client delivery only**.

---

## 1. Questionnaire Data Sources

### 1.1 UI — `src/views/client-questionnaire-page.tsx`

**Visible fields (8):**

| Field | Key | Values |
|-------|-----|--------|
| Branche | `business_type` | `dental_clinic`, `beauty_salon`, `barbershop`, `car_service`, `fitness_club`, `restaurant`, `real_estate`, `education`, `ecommerce`, `cleaning_service` |
| Name | `business_name` | free text |
| Phone | `phone` | free text |
| WhatsApp | `whatsapp` | free text |
| Telegram | `telegram` | free text |
| Email | `email` | free text |
| Language | `language` | `ru`, `de`, `en` |
| Delivery method | `delivery_method` | `zip`, `netlify`, `github` |

**Hidden defaults** (injected by `buildSavePayload()` before POST):

```json
{
  "address": "",
  "website": "",
  "logo": "assets/logo.png",
  "currency": "EUR",
  "plan_id": "free",
  "plan": "Free",
  "amount": 0,
  "payment_status": "FREE",
  "terms_accepted": true,
  "privacy_accepted": true,
  "working_hours": { "monday": "09:00-18:00", ... },
  "social_links": { "instagram": "", "facebook": "", "tiktok": "", "website": "" },
  "business_questions": {}
}
```

**Delivery trigger:** `POST /api/client-delivery/run` runs `npm run client:deliver` **without** auto-saving the form first. User must click **Save Questionnaire** before **Generate Client MVP**.

### 1.2 API — `src/app/api/client-questionnaire/route.ts`

- **GET:** reads `input/client_onboarding_questionnaire.json`
- **POST:** normalizes body, merges commercial fields via `buildCommercialData()`, writes JSON to disk

Adds/normalizes: `delivery_method`, hidden defaults, `plan_id`, `terms_accepted`, etc.

**Not consumed downstream in client delivery:** `delivery_method` (stored only).

### 1.3 File — `input/client_onboarding_questionnaire.json`

Single source of truth for client delivery onboarding step.

Example (barbershop test):

```json
{
  "business_type": "barbershop",
  "business_name": "Berlin Barber Studio",
  "phone": "+49 30 5551234",
  "whatsapp": "+49 30 5551234",
  "telegram": "@berlin_barber",
  "email": "hello@berlin-barber.example",
  "language": "de",
  "delivery_method": "zip",
  "...": "hidden defaults"
}
```

---

## 2. Questionnaire → Manifest / client_profile Chain

### 2.1 Delivery command flow

```
POST /api/client-delivery/run
  └─ npm run client:deliver
       └─ factory/client_one_command_delivery_factory/one_command_runner.py
            ├─ [1] client_onboarding_factory
            ├─ [2] client_full_delivery_orchestrator
            │        ├─ client-profile:edit (preserve existing profile)
            │        ├─ client_pipeline_orchestrator
            │        │     ├─ client-data:generate
            │        │     ├─ client-data:integrate
            │        │     ├─ react-ui-binding:generate
            │        │     ├─ demo-video-binding:generate
            │        │     ├─ deploy-binding:generate
            │        │     └─ final-package-binding:generate  ← rebuilds ZIP
            │        └─ client-delivery:generate
            └─ [3] final_v3_quality_gate
```

### 2.2 Client Onboarding — `factory/client_onboarding_factory/`

**Input:** `input/client_onboarding_questionnaire.json`  
**Output:**  
- `artifacts/factory_output/client_onboarding/client_profile.json`  
- sync → `artifacts/factory_output/client_data/client_profile.json`

**Logic (`build_client_profile_from_questionnaire`):**

1. Reads questionnaire fields into profile
2. Falls back to `factory/client_data_factory/client_profile_template.json` for empty `address`, `telegram`, etc.
3. Calls `enrich_profile_with_knowledge()` → adds:
   - `selected_business_category`
   - `knowledge_pack_used`
   - `language_used`
   - `business_questions` (if present)

**Barbershop example profile fields:**

```json
{
  "business_type": "barbershop",
  "selected_business_category": "beauty_salon",
  "knowledge_pack_used": "knowledge_library/de/beauty_salon",
  "language_used": "de"
}
```

### 2.3 Final Package Binding — `factory/final_package_binding_factory/`

**Input:** `artifacts/factory_output/client_data/client_profile.json` + binding artifacts  
**Output:**  
- `artifacts/factory_output/final_package_binding/package_client_data.json`  
- rebuilds `output/final_package.zip` via `final_package_factory`

**Mapper (`final_package_mapper.py`):** copies profile into `package_client_data.client_profile`, builds `package_metadata` for manifest:

```json
{
  "business_name": "Berlin Barber Studio",
  "business_type": "barbershop",
  "language": "de",
  "currency": "EUR",
  "package_title": "Berlin Barber Studio MVP Package",
  "package_slug": "berlin-barber-studio-mvp-package"
}
```

### 2.4 Manifest — `output/client_delivery/final_package.zip` → `manifest.json`

Contains packaging metadata (`project`, `public_url`, `package_metadata`).  
Does **not** list selected modules or template ID.

**ZIP also includes:** `client_data/client_profile.json`, `client_data/ui_client_data.json`, `app/client_package/` (React build tree).

---

## 3. Template / Category Selection

### 3.1 Mapping config — `config/knowledge_category_map.json`

V1 mapping (questionnaire `business_type` → `selected_business_category`):

| business_type | selected_business_category | knowledge pack folder (via alias) |
|---------------|--------------------------|-----------------------------------|
| barbershop | beauty_salon | `knowledge_library/{lang}/beauty_salon` |
| beauty_salon | beauty_salon | beauty_salon |
| dental_clinic | dental_clinic | dentist |
| car_service | car_service | automotive_service |
| fitness_club | fitness_club | fitness_club |
| restaurant | restaurant | restaurant |
| real_estate | real_estate | real_estate |
| education | education | online_course |
| ecommerce | ecommerce | consulting |
| cleaning_service | cleaning_service | cleaning_service |

Implemented in `factory/knowledge_library_integration_factory/knowledge_router.py`:
- `map_business_type_to_category()` reads config
- `resolve_knowledge_pack_folder()` applies `knowledge_pack_folder_aliases` for disk paths

### 3.2 Knowledge pack content (barbershop → beauty_salon)

`knowledge_library/de/beauty_salon/features.json`:

```json
{ "features": ["booking", "service_menu", "staff_schedule", "client_history"] }
```

`knowledge_library/de/beauty_salon/crm_modules.json`:

```json
{ "modules": ["auth_module", "dashboard_module", "crm_module", "booking_module"] }
```

**These files are loaded during onboarding** into profile metadata context but **not applied to React structure** in client delivery path.

### 3.3 Template / pattern / module factories (NOT in client delivery)

| Factory | Role | In `client:deliver`? |
|---------|------|----------------------|
| `mvp_assembly_intelligence_factory` | Reads questionnaire + knowledge pack → `assembly_decision.json` (template, modules, UI) | **No** |
| `template_selection_integration_factory` | Maps assembly decision → `selected_template.json`, `selected_modules.json` | **No** |
| `mvp_build_orchestrator_factory` | Unifies into `build_plan.json` | **No** |
| `react_ui_factory` | Generates full React project from MVP Polish / UI library / i18n | **No** (runs in V5 pipeline) |
| `react_ui_binding_factory` | Patches `uiClientData.ts` + few components in **existing** package | **Yes** |

**Module selection logic exists** in `factory/mvp_assembly_intelligence_factory/assembly_rules.py`:

- `TEMPLATE_BY_CATEGORY` — e.g. `beauty_salon` → `beauty_salon_crm`
- `DEFAULT_MODULES_BY_CATEGORY` — e.g. `beauty_salon` → `["booking", "crm", "notifications"]`
- `FEATURE_TO_MODULE` — maps knowledge features to module names
- `CRM_MODULE_TO_ASSEMBLY` — maps `booking_module` → `appointments`

This runs only when `npm run mvp-assembly-intelligence:generate` is executed (Full V5 pipeline).

### 3.4 Pre-built React MVP used by client delivery

Path: `artifacts/factory_output/react_ui/client_package/`

Originally produced by `react_ui_factory` from:
- `artifacts/factory_output/mvp_polish/`
- `artifacts/factory_output/ui_library/`
- `artifacts/factory_output/questionnaire/manifest.json` (legacy questionnaire factory, **not** client onboarding JSON)
- `artifacts/factory_output/i18n/translations.json`
- `artifacts/factory_output/domain_transformation/transformed_demo_data.json`

**Client delivery does not rebuild this project.** It only rebinds client contact fields.

---

## 4. Field Impact Matrix

### 4.1 Fields that affect MVP structure (client delivery path)

| Field | Affects React layout/modules? | Affects metadata? | Notes |
|-------|------------------------------|-------------------|-------|
| `business_type` | **No** (fixed dashboard) | Yes | Drives `selected_business_category`, knowledge pack path |
| `language` | **Partially** | Yes | Stored in profile/UI data; `translations.ts` **not** regenerated on delivery |
| `delivery_method` | **No** | Stored in JSON only | Not read by any factory in client delivery |
| `business_name` | **No** (text substitution) | Yes | Header, footer, demo video, deploy slug |
| `phone` | **No** (text substitution) | Yes | ContactBlock, footer |
| `whatsapp` | **No** | In profile only | **Not** in `uiClientData.ts` mapper |
| `telegram` | **No** | In profile only | **Not** in `uiClientData.ts` mapper |
| `email` | **No** (text substitution) | Yes | ContactBlock, footer |

### 4.2 Fields that are client data substitution only

Via `react_ui_binding_factory/react_ui_mapper.py` → `uiClientData.ts`:

- `business_name`, `email`, `phone`, `address`, `working_hours`, `language`, `currency`, `logo`, `social_links`

**Also in profile but not in React UI mapper:** `telegram`, `whatsapp`

**Hidden defaults still flow to profile:** `working_hours`, `address` (from template if empty), `currency`, `logo`, `social_links`

### 4.3 UI blocks always present in React MVP (regardless of barbershop)

From `DashboardPage.tsx` (hardcoded):

- HeroSection
- ContactBlock + BusinessInfoBlock
- StatCard grid (from `demoData.stats`)
- CalendarStrip (`demoData.calendarDays`)
- PerformancePanel / statistics (`demoData.progress`)
- ActivityFeed
- StaffList
- AppointmentTable

All demo content comes from `src/data/translations.ts` → `demo` section (still contains legacy **"Glow Beauty Salon"** in demo strings unless manually rebuilt via `react_ui_factory`).

---

## 5. Where Modules Come From

| UI concept | Source in client delivery | Configurable by questionnaire? |
|------------|---------------------------|--------------------------------|
| Онлайн-запись / Appointments | Hardcoded `AppointmentTable` + `demoData.appointments` | No |
| Календарь | Hardcoded `CalendarStrip` + `demoData.calendarDays` | No |
| CRM / Clients | Nav labels + stats; no dynamic CRM module | No |
| Сотрудники | Hardcoded `StaffList` + `demoData.staff` | No |
| Статистика | Hardcoded `StatCard` + `PerformancePanel` | No |
| Часы работы | `uiClientData.working_hours` in ContactBlock | Default only (hidden in V1 UI) |
| Услуги | Demo appointment `service` strings | No |

**Knowledge pack** defines conceptual features (`booking`, `service_menu`, …) used by:
- `mvp_assembly_intelligence_factory` (not in client delivery)
- API `/api/knowledge-library/category` (removed from V1 UI)

**Rule-based module list** for beauty_salon in assembly (if V5 pipeline runs):

```python
DEFAULT_MODULES_BY_CATEGORY["beauty_salon"] = ["booking", "crm", "notifications"]
```

---

## Answers A–F

### A) MVP сейчас собирается по фиксированному шаблону или по галочкам/параметрам?

**По фиксированному шаблону.**

Client delivery path:
1. Uses a **pre-generated** React dashboard (`artifacts/factory_output/react_ui/client_package/`)
2. **Patches contact data** via `react_ui_binding_factory`
3. Does **not** read `assembly_decision.json`, `selected_modules.json`, or questionnaire checkboxes (`business_questions` is always `{}` in V1)

Template/module selection **exists** in `mvp_assembly_intelligence_factory` but belongs to the **Full V5 pipeline**, not to `npm run client:deliver`.

---

### B) Если выбран barbershop, какие файлы/шаблоны реально используются?

**During `npm run client:deliver`:**

| Stage | Files |
|-------|-------|
| Input | `input/client_onboarding_questionnaire.json` |
| Category map | `config/knowledge_category_map.json` (`barbershop` → `beauty_salon`) |
| Knowledge pack (read, not applied to UI) | `knowledge_library/de/beauty_salon/*.json` |
| Profile | `artifacts/factory_output/client_data/client_profile.json` |
| React app (structure) | `artifacts/factory_output/react_ui/client_package/` (unchanged layout) |
| Patched client data | `.../client_package/src/data/uiClientData.ts` |
| Demo content (static) | `.../client_package/src/data/translations.ts` |
| Package binding | `artifacts/factory_output/final_package_binding/package_client_data.json` |
| Output | `output/client_delivery/final_package.zip` |

**Not used for barbershop in client delivery:**
- `artifacts/factory_output/mvp_assembly_intelligence/assembly_decision.json`
- `artifacts/factory_output/template_selection_integration/selected_*.json`
- `knowledge_library/business_content/beauty_salon/` (V6 business content path)

---

### C) Где в коде определяется, что barbershop получает запись, календарь, CRM и т.п.?

**Not determined by barbershop at delivery time.**

Calendar / appointments / staff / stats are **always rendered** because `DashboardPage.tsx` imports all components unconditionally.

The **only** barbershop-specific logic in client delivery:

```python
# knowledge_router.py + knowledge_category_map.json
barbershop → selected_business_category = "beauty_salon"
           → knowledge_pack_used = "knowledge_library/de/beauty_salon"
```

Conceptual modules for beauty_salon are declared in:
- `knowledge_library/de/beauty_salon/features.json`
- `knowledge_library/de/beauty_salon/crm_modules.json`

Would affect module list **if** `mvp_assembly_intelligence_factory/assembly_selector.py` ran:

```python
# assembly_rules.py
DEFAULT_MODULES_BY_CATEGORY["beauty_salon"] = ["booking", "crm", "notifications"]
FEATURE_TO_MODULE["booking"] = "appointments"
CRM_MODULE_TO_ASSEMBLY["booking_module"] = "appointments"
```

That decision is **not connected** to React component inclusion in client delivery.

---

### D) Какие поля из client_onboarding_questionnaire.json реально попадают в React app?

**Into `uiClientData.ts` (rendered in UI):**

| Questionnaire field | In React app |
|--------------------|--------------|
| `business_name` | Yes — Header, Hero, footer |
| `email` | Yes — ContactBlock, footer |
| `phone` | Yes — ContactBlock, footer |
| `language` | Yes — stored, but UI strings from static `translations.ts` |
| `working_hours` | Yes — ContactBlock "Today" (hidden default in V1) |
| `address` | Yes — ContactBlock, footer (often template fallback) |
| `currency` | Yes — footer |
| `logo` | In data file, minimal UI use |
| `social_links` | In data file, not prominently rendered |

**In profile JSON inside ZIP but NOT in React UI mapper:**

| Field | In client_profile.json | In uiClientData.ts |
|-------|------------------------|-------------------|
| `telegram` | Yes | **No** |
| `whatsapp` | Yes | **No** |
| `business_type` | Yes | **No** |
| `delivery_method` | Yes | **No** |
| `selected_business_category` | Yes | **No** |
| `knowledge_pack_used` | Yes | **No** |

---

### E) Какие поля есть в manifest.json, но не влияют на MVP?

**In `manifest.json` → `package_metadata`:**

| Field | Affects React MVP? |
|-------|-------------------|
| `business_name` | Indirectly (also in uiClientData) |
| `business_type` | **No** |
| `language` | **No** (manifest only) |
| `currency` | **No** (manifest only) |
| `package_title` | **No** |
| `package_slug` | **No** |
| `package_description` | **No** |

**Also in questionnaire / profile but not affecting MVP structure:**

- `delivery_method`
- `plan_id`, `plan`, `amount`, `payment_status`
- `terms_accepted`, `privacy_accepted`
- `business_questions`
- `selected_business_category`, `knowledge_pack_used` (metadata only)

---

### F) Что нужно для прозрачной цепочки: Опросник → Manifest → Template → Modules → React MVP → ZIP

#### Current gaps

1. **Broken link:** Client delivery skips `mvp_assembly_intelligence` → `template_selection` → `react_ui_factory` rebuild
2. **`delivery_method`** is write-only (no Netlify/GitHub branch in client delivery)
3. **`telegram` / `whatsapp`** saved to profile but not mapped to React
4. **`language`** does not regenerate `translations.ts` on delivery
5. **Demo data** (`translations.ts` demo section) can disagree with client name (legacy Glow Beauty Salon)
6. **Two sources of truth:** `input/client_onboarding_questionnaire.json` vs legacy `artifacts/factory_output/questionnaire/manifest.json`
7. **Manifest** describes packaging, not assembly decisions (no `selected_template`, `selected_modules`)

#### Recommended target architecture

```
┌─────────────────────┐
│ Client Questionnaire│  8 visible + hidden defaults
│ V1 UI + API         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ client_onboarding   │  questionnaire.json → client_profile.json
│ _factory            │  + knowledge enrichment
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ mvp_assembly        │  business_type + knowledge pack
│ _intelligence       │  → assembly_decision.json
└──────────┬──────────┘      (template, modules, ui, reason)
           ▼
┌─────────────────────┐
│ template_selection  │  selected_template.json
│ _integration        │  selected_modules.json
└──────────┬──────────┘  selected_ui.json
           ▼
┌─────────────────────┐
│ react_ui_factory    │  rebuild client_package from decisions
│ (or module loader)  │  + uiClientData + i18n(language)
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ final_package       │  manifest includes assembly + modules
│ _binding + factory  │  ZIP with traceable build manifest
└─────────────────────┘
```

#### Concrete steps

1. **Insert assembly step** into `client_pipeline_orchestrator` before `react-ui-binding`:
   - Run `mvp_assembly_intelligence_factory` (or lightweight wrapper reading current questionnaire)
2. **Rebuild or patch React** based on `selected_modules`:
   - Either conditional component map in `DashboardPage`
   - Or full `react_ui_factory` run per delivery (slower but accurate)
3. **Extend manifest** with:
   ```json
   {
     "selected_business_category": "beauty_salon",
     "selected_template": "beauty_salon_crm",
     "selected_modules": ["booking", "crm", "notifications"],
     "knowledge_pack_used": "knowledge_library/de/beauty_salon",
     "questionnaire_source": "input/client_onboarding_questionnaire.json"
   }
   ```
4. **Map all contact fields** to React (`telegram`, `whatsapp` in `react_ui_mapper.py` + ContactBlock)
5. **Regenerate i18n** on delivery when `language` changes (`i18n_factory` keyed to questionnaire language)
6. **Wire `delivery_method`** to deploy/github factories after ZIP step
7. **Single trace file:** `artifacts/factory_output/client_pipeline/build_trace.json` listing each step input/output hashes

---

## Appendix: Key File Reference

| Purpose | Path |
|---------|------|
| Questionnaire UI V1 | `src/views/client-questionnaire-page.tsx` |
| Questionnaire API | `src/app/api/client-questionnaire/route.ts` |
| Saved input | `input/client_onboarding_questionnaire.json` |
| Category mapping | `config/knowledge_category_map.json` |
| Knowledge router | `factory/knowledge_library_integration_factory/knowledge_router.py` |
| Onboarding | `factory/client_onboarding_factory/client_onboarding_factory.py` |
| Client pipeline steps | `factory/client_pipeline_orchestrator/pipeline_steps.py` |
| React data binding | `factory/react_ui_binding_factory/react_ui_mapper.py` |
| Package binding | `factory/final_package_binding_factory/final_package_mapper.py` |
| Assembly rules (unused in delivery) | `factory/mvp_assembly_intelligence_factory/assembly_rules.py` |
| React dashboard (fixed) | `artifacts/factory_output/react_ui/client_package/src/pages/DashboardPage.tsx` |
| Client data in app | `artifacts/factory_output/react_ui/client_package/src/data/uiClientData.ts` |
| Demo/static content | `artifacts/factory_output/react_ui/client_package/src/data/translations.ts` |
| Delivery output | `output/client_delivery/final_package.zip` |

---

## Verification Commands

```bash
# Profile inside ZIP
unzip -p ./output/client_delivery/final_package.zip client_data/client_profile.json

# Manifest
unzip -p ./output/client_delivery/final_package.zip manifest.json

# React client data inside ZIP
unzip -p ./output/client_delivery/final_package.zip client_data/ui_client_data.json

# Assembly decision (V5 only — not updated by client:deliver)
cat artifacts/factory_output/mvp_assembly_intelligence/assembly_decision.json
```

**Expected for barbershop (client delivery):**

```json
{
  "business_type": "barbershop",
  "selected_business_category": "beauty_salon",
  "knowledge_pack_used": "knowledge_library/de/beauty_salon"
}
```
