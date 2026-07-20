# Local evidence — 3 tenants (no deploy / no push)

**When:** 2026-07-20 (local)  
**Base commit:** `13642c042712445fbe9e1f410659c309e5da752f`  
**Working tree:** uncommitted niche/catalog fixes (explicitly **not** committed)  
**Runtime:** `http://127.0.0.1:3000` (Next) + CRM iframe `http://127.0.0.1:4173`  
**Data dir:** `$RAILWAY_VOLUME_MOUNT_PATH` → `/tmp/crm-redeploy-data`  
**Backends:** `CATALOG_BACKEND=file`, `LEADS_BACKEND=file`  
**Artifacts:** `docs/local-evidence-tenants.json`, `docs/local-evidence-report.json`, `docs/local-evidence-screenshots/`

---

## 1. Local tenants + URLs

| Niche | Name | clientId | Public site | CRM |
|-------|------|----------|-------------|-----|
| **dental** | Клиника Зуб Болит | `denta100-0000-4000-8000-00000000fab4` | http://127.0.0.1:3000/site/klinika-zub-bolit-fab4?lang=ru | http://127.0.0.1:3000/demo/klinika-zub-bolit-fab4?clientId=denta100-0000-4000-8000-00000000fab4 |
| **cafe** | Калинка-Малинка | `cafe1000-0000-4000-8000-000kalinka01` | http://127.0.0.1:3000/site/kalinka-malinka-klnk?lang=ru | http://127.0.0.1:3000/demo/kalinka-malinka-klnk?clientId=cafe1000-0000-4000-8000-000kalinka01 |
| **car_wash** | Автомойка Local Wash | `wash1000-0000-4000-8000-000carwash01` | http://127.0.0.1:3000/site/avtomoyka-local-wash?lang=ru | http://127.0.0.1:3000/demo/avtomoyka-local-wash?clientId=wash1000-0000-4000-8000-000carwash01 |

---

## 2. Catalog 1:1 (dental + café)

### dental

**Shared catalog / form (RU)** — identical:

1. Осмотр зубов  
2. Чистка зубов  
3. Лечение корневого канала  

**Proof**
- Site select: `docs/local-evidence-screenshots/dental-site-select-ru.png`  
- CRM: dashboard shows **3 Процедур**; nav = Пациенты / Приёмы / Услуги — `dental-crm-catalog-ru.png`  
- API: `GET /api/crm/catalog/{dentalId}?lang=ru` → same 3 `names`  
- Report: `matchSeed: true`

### café (Калинка-Малинка)

**Shared catalog / form (RU)** — identical:

1. Бизнес-ланч  
2. Паста карбонара  
3. Тирамису  

**Proof**
- Site select: `cafe-site-select-ru.png` (label **Меню**, CTA **Забронировать столик**)  
- CRM popular services block lists the same 3 items; nav = Бронирования / Столы / **Меню** — `cafe-crm-catalog-ru.png`  
- `matchSeed: true`

---

## 3. car_wash i18n + no cleaning leak

### Public site EN / DE / RU

| Lang | Niche on site | Banned words (Уборки / Клининг / Cleaning Service / Добавить приём) | Screenshot |
|------|---------------|---------------------------------------------------------------------|------------|
| EN | Car Wash | none | `car_wash-site-en.png` |
| DE | Autowäsche | none | `car_wash-site-de.png` |
| RU | Автомойка | none | `car_wash-site-ru.png` |

### CRM RU (visual)

`car_wash-crm-ru.png` shows:

- **Автомойка Local Wash**
- Nav: **Клиенты** / **Заказы на мойку** / **Услуги мойки** / **Сотрудники**
- Stats: «Заказов на мойку», «Услуг мойки»
- No «Уборки», «Клининг», Cleaning, «Добавить приём»

### CRM EN / DE

Automation language-switch did **not** reliably flip CRM copy in headless (labels often stayed on the previously loaded language). **Not claimed as PASS** for CRM EN/DE entity strings from automation. Public site EN/DE **PASS**.

---

## 4. Dynamic catalog (shared store → public form)

Mutation path used in this run: **`PUT /api/crm/catalog/{clientId}`** (same store the CRM parent bridge writes to via `CRM_CATALOG_PUSH`).  
CRM iframe «Добавить услугу» → bridge sync was **not** successfully exercised in automation (`via: api_same_store`).

| Tenant | Unique item | Added on site | Removed on site | Add time (UTC) | Del time (UTC) | Screenshots |
|--------|-------------|----------------|-----------------|----------------|----------------|-------------|
| dental | `LIVE-DENTAL-68679` | yes | yes | 2026-07-20T00:21:14Z | 2026-07-20T00:21:16Z | `dental-site-after-add.png` / `dental-site-after-del.png` |
| cafe | `LIVE-CAFE-05755` | yes | yes | 2026-07-20T00:21:50Z | 2026-07-20T00:21:53Z | `cafe-site-after-add.png` / `cafe-site-after-del.png` |
| car_wash | `LIVE-CAR_WASH-42778` | yes | yes | 2026-07-20T00:22:29Z | 2026-07-20T00:22:31Z | `car_wash-site-after-add.png` / `car_wash-site-after-del.png` |

URLs checked after each mutation: `/site/{slug}?lang=ru` (reload, no code change, no deploy).

---

## 5. Lead → CRM entity kind

| Tenant | Lead | UI success | Store | Entity kind |
|--------|------|------------|-------|-------------|
| dental | Lead dental 9094 | yes | client + appointment | **`appointment`** (patient/client + приём) |
| cafe | Lead cafe 5587 | yes | client + appointment | **`reservation`** (гость/клиент + бронирование) |
| car_wash | Lead car_wash 4056 | yes | client + order + appointment mirror | **`order`** (клиент + заказ на мойку) |

Café CRM dashboard also shows prior site lead «Evidence Lead cafe 6932» / Бизнес-ланч under «Сегодня в работе».  
Car wash CRM shows wash orders including «Lead car_wash 4056» / Мойка кузова.

`inCrmUi` flag in JSON is flaky (tab click timing); visual CRM screenshots + file lead store are authoritative here.

---

## 6. Changed files (architecture for this work)

**New**
- `src/lib/niches/sector-models.ts`
- `src/lib/catalog/resolve-catalog.ts`, `file-catalog.ts`, `firestore-catalog.ts`
- `src/app/api/crm/catalog/[clientId]/route.ts`
- `src/lib/leads/file-store.ts`
- `artifacts/.../sync-crm-catalog.js`
- evidence scripts + `docs/local-evidence-*`

**Updated (core)**
- `src/lib/leads/niche-mode.ts`, `store.ts`, `types.ts`
- `src/app/site/[clientId]/page.tsx`, `booking-form.tsx`
- `src/components/crm-leads-bridge.tsx` (catalog push via session)
- `config/sector_mapping.json` (`car_wash` → `car_wash`)
- CRM `App.jsx`, `crm-matrix.js`, niche scenarios/labels (`car_wash`, `barbershop`)

**Architecture**
```
sector-models → mode + labels + catalogKey
shared catalog: data/catalogs/{clientId}.json (local) / Firestore (prod)
/site form ← listCatalogItems (same source)
CRM edits → postMessage CRM_CATALOG_PUSH → parent PUT /api/crm/catalog
```

---

## 7. Manual check results (PASS / FAIL / PARTIAL)

| Check | Result |
|-------|--------|
| A entities logical (dental/cafe/car_wash) | **PASS** (CRM nav + CTAs) |
| B form dropdown = shared catalog 1:1 | **PASS** (text lists + screenshots) |
| C lead → correct kind | **PASS** (appointment / reservation / order) |
| D site i18n car_wash EN/DE/RU | **PASS** |
| D CRM car_wash RU labels | **PASS** (screenshot) |
| D CRM car_wash EN/DE labels | **PARTIAL / unverified** (lang switch flaky in headless) |
| E no cleaning leak | **PASS** on site + CRM RU |
| F dental appointment / cafe reservation / car_wash order | **PASS** |
| Dynamic catalog without redeploy | **PASS** via shared catalog API |
| Dynamic via CRM UI button only | **FAIL in automation** (fell back to same API store) |

---

## 8. Still unverified / gaps

1. Headless CRM **EN/DE** label switch for car_wash.  
2. End-to-end **CRM UI «Добавить услугу» → bridge → site** without API fallback (bridge code is present; UI automation did not sync).  
3. Live Firebase/Firestore path (this evidence used **file** backends).  
4. Remaining 17 wizard niches — not re-run as live tenants here (covered only by offline `canonical-20-niches-form-verify.md`).  
5. No commit / push / deploy performed.

---

## 9. How to re-open locally

```bash
# terminals already used:
# CRM:  vite preview :4173
# App:  CATALOG_BACKEND=file LEADS_BACKEND=file RAILWAY_VOLUME_MOUNT_PATH=/tmp/crm-redeploy-data next dev :3000
npx tsx scripts/bootstrap-local-evidence-tenants.ts
npx tsx scripts/local-evidence-followup.ts
```

Deploy approved: commit + push + `railway up` after follow-up closure.

---

## 10. Follow-up closure (UI sync + car_wash EN/DE)

Artifacts:
- JSON: `docs/local-evidence-followup.json`
- CRM EN dashboard: `docs/local-evidence-screenshots/car_wash-crm-en-manual.png`
- CRM DE dashboard: `docs/local-evidence-screenshots/car_wash-crm-de-manual.png`
- CRM EN orders CTA: `docs/local-evidence-screenshots/car_wash-crm-en-orders-manual.png`
- CRM DE orders CTA: `docs/local-evidence-screenshots/car_wash-crm-de-orders-manual.png`
- CRM services before add: `docs/local-evidence-screenshots/car_wash-crm-ui-before-add.png`
- CRM services after real UI add: `docs/local-evidence-screenshots/car_wash-crm-ui-after-add.png`
- Site form before: `docs/local-evidence-screenshots/car_wash-site-live-before.png`
- Site form after live sync: `docs/local-evidence-screenshots/car_wash-site-live-after-add.png`

### A. Real CRM UI button -> live `/site` form sync

This check used the actual CRM interface on local `car_wash`:

- CRM URL: `http://127.0.0.1:4173/?clientId=wash1000-0000-4000-8000-000carwash01`
- Site URL: `http://127.0.0.1:3000/site/avtomoyka-local-wash?lang=en`
- Added via UI button: `UI-LIVE-CW-45405`

Observed option arrays from the already opened site form:

- Before CRM click: `Select…`, `UI-LIVE-CW-74269`
- After CRM `Add Service` + `Save`: `Select…`, `UI-LIVE-CW-45405`, `UI-LIVE-CW-74269`

Result: **PASS**. The new item appeared in the open public form without code change and without redeploy. The proof path is:

`car_wash-crm-ui-before-add.png` -> real click on `Add Service` / `Save` -> `car_wash-crm-ui-after-add.png` -> `car_wash-site-live-after-add.png`

Note: the public form now performs live catalog refetch while opened, so the select updates without a page reload.

### B. `car_wash` EN / DE manual proof

From `docs/local-evidence-followup.json`:

- EN: `Car Wash`, `Customers`, `Wash Orders`, `Wash Services`, `Employees`, `Add Wash Order` -> all present
- DE: `Autowäsche`, `Kunden`, `Waschaufträge`, `Waschleistungen`, `Mitarbeiter`, `Waschauftrag hinzufügen` -> all present
- Banned strings in both EN and DE: none of `Cleaning`, `Уборка`, `Клининг`, `appointment`, `Добавить приём`

Result: **PASS**.

### Updated closure status

| Previously open item | Status |
|---|---|
| CRM UI `Add Service` did not prove sync | **CLOSED** |
| `car_wash` CRM EN/DE were not visually verified | **CLOSED** |
