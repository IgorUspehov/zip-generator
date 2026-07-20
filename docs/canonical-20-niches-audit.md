# Canonical 20 niches audit

**Дата:** 2026-07-20  
**Репозиторий:** `saas-mvp-funnel` only  
**Деплой / commit / push:** не выполнялись  
**Канон:** [`docs/CANONICAL_NICHES.md`](./CANONICAL_NICHES.md) ← `WIZARD_SECTOR_IDS` (20 шт., без veterinary / construction / cleaning_service как sector_id)

## Source of truth

| Роль | Путь |
|------|------|
| Каталог ниш wizard | `src/lib/niche-sectors.ts` (`WIZARD_SECTOR_IDS`) |
| UI labels select | `src/client-wizard/copy.ts` → `sectors` |
| sector_id → businessType | `config/sector_mapping.json` |
| Режим формы | `src/lib/leads/niche-mode.ts` → `resolveLeadFormMode` |
| Список в публичной форме | `loadNicheServiceOptions` → `niche-scenarios.json` **`popular_services`** (fallback `records.services`) |
| Каталог CRM (seed) | `niche-scenarios.json` → `records.{services\|menu\|products\|courses\|…}` + UI tabs из `niche-labels.json` / `crm-matrix.js` |

---

## Системные причины (общие для многих FAIL)

1. **Каталог формы ≠ каталог CRM (инвариант нарушен везде, где проверено).**  
   Публичная форма берёт `popular_services` (обычно 4 пункта). CRM сеет `records.services` / `records.menu` / `records.courses` (другой набор, часто 3 пункта). Это не «популярные позиции» как документированное исключение — отдельный hardcoded путь.  
   Код: `src/lib/leads/store.ts` `loadNicheServiceOptions`.

2. **`barbershop` → mode `order` из-за бага `key.includes("shop")`.**  
   В `resolveLeadFormMode` проверка `includes("shop")` срабатывает на `barbershop` раньше appointment-списка → публичная форма/CTA «заказ», хотя ниша — запись.

3. **`food` / `cafe` → businessType `restaurant` → mode `inquiry`, не reservation.**  
   Ресторан/кафе не в appointment/order sets → CTA «Оставить заявку» / inquiry, тогда как CRM-таб — «Бронирования» / «Меню».

4. **`car_wash` → businessType `cleaning_service`.**  
   Нет `car_wash` в `niche-labels` / scenarios; подтягиваются клининговые строки: «Уборки», «Панель клининга», «Cleaning Service», counters «Уборок». Требуемые «Автомойка / Waschaufträge / …» в runtime не подключены.

5. **Нет живых tenant на prod для большинства из 20 sector_id.**  
   На 2026-07-20 в `demo-registry` покрыты только: education, yoga(fitness), massage, cafe(restaurant), health (+ дубли education). Остальные A–F E2E невозможны без генерации новых демо.

6. **Niche badge на `/site` часто не переключается с языком** (например «ОБРАЗОВАНИЕ / EDUCATION» на EN/DE) — `getBusinessTypeDisplayName` / dual string, не чистый EN/DE/RU.

---

## Матрица по канону (код + данные)

Тип формы = фактический `resolveLeadFormMode(businessType)` (production logic).  
«Списки 1:1» = `popular_services` (форма) vs первый CRM catalog array в `records` (код-сверка RU).

| sector_id | form mode (факт) | клиент (CRM tab RU) | каталог (CRM tab RU) | заявка (CRM tab RU) | источник формы | источник CRM-каталога | 1:1? |
|-----------|------------------|---------------------|----------------------|---------------------|----------------|------------------------|------|
| beauty | appointment | Клиенты | Услуги | Приёмы | popular_services | records.services | **NO** |
| barbershop | **order** ⚠️ | (нет niche-labels) | — | — | missing/empty | missing | N/A empty |
| massage | appointment | Клиенты | Услуги | Приёмы | popular_services | records.services | **NO** |
| fitness | appointment | Участники | Занятия | Занятия | popular_services | records.classes | **NO** |
| yoga | appointment | Участники | Занятия | Занятия | popular_services (=fitness_club) | records.classes | **NO** |
| dental | appointment | Пациенты | Услуги | Приёмы | popular_services | records.services | **NO** |
| health | appointment | Пациенты | Услуги | Приёмы | popular_services | records.services | **NO** |
| food | **inquiry** ⚠️ | — | Меню | Бронирования | popular_services | records.menu | **NO** |
| cafe | **inquiry** ⚠️ | — | Меню | Бронирования | popular_services | records.menu | **NO** |
| hotel | appointment | Гости | — | Бронирования | popular_services | empty/missing catalog | **NO** |
| car_service | inquiry | Клиенты | — | Заказы | popular_services | empty services path | **NO** |
| tire_service | inquiry | Клиенты | — | Заказы | =car_service | =car_service | **NO** |
| car_wash | appointment (via cleaning) | Клиенты | Услуги | **Уборки** ⚠️ | cleaning scenario empty popular | cleaning records empty | empty≠CRM intent |
| realestate | inquiry | Клиенты | — | Показы | popular≈records | records | YES* (3=3 popular path) |
| law_firm | inquiry | Клиенты | Услуги | Встречи | empty popular | empty | empty |
| accounting | inquiry | Клиенты | Услуги | Встречи | empty | empty | empty |
| education | appointment | Студенты | Курсы | Занятия | popular_services | records.courses | **NO** |
| logistics | inquiry | — | — | Заказы | popular_services | empty | **NO** |
| shop | order | Покупатели | Товары | Заказы | popular_services | records.products | **NO** |
| tech | order | Клиенты | Продукты | — | popular_services | records.products | **NO** |

\* realestate: совпадение popular vs records в RU на текущих данных; это не доказательство архитектурного 1:1.

---

## Живые tenant на prod (единственные для A–F)

| sector_id | clientId | public site | CRM |
|-----------|----------|-------------|-----|
| education | `03de11de-f488-45e1-a967-550beaca73dc` | https://saas-mvp-funnel-production.up.railway.app/site/fishkin-ntli-03de | https://saas-mvp-funnel-production.up.railway.app/demo/fishkin-ntli-03de?clientId=03de11de-f488-45e1-a967-550beaca73dc |
| education | `b475392b-3c84-4dca-82b4-b6cf780f1e31` | https://saas-mvp-funnel-production.up.railway.app/site/ihor-kriazhev-it-b475 | https://saas-mvp-funnel-production.up.railway.app/demo/ihor-kriazhev-it-b475?clientId=b475392b-3c84-4dca-82b4-b6cf780f1e31 |
| yoga | `2f7347db-504e-4b47-9613-f462ca4f0d5d` | https://saas-mvp-funnel-production.up.railway.app/site/polimernye-materialy-2f73 | https://saas-mvp-funnel-production.up.railway.app/demo/polimernye-materialy-2f73?clientId=2f7347db-504e-4b47-9613-f462ca4f0d5d |
| massage | `aa6e3973-1215-4923-bef5-3ddb4f81ddb8` | https://saas-mvp-funnel-production.up.railway.app/site/xxx-aa6e | https://saas-mvp-funnel-production.up.railway.app/demo/xxx-aa6e?clientId=aa6e3973-1215-4923-bef5-3ddb4f81ddb8 |
| cafe | `f2b6607d-b83b-4ce6-b0ee-8648b8b88904` | https://saas-mvp-funnel-production.up.railway.app/site/polimernye-materialy-f2b6 | https://saas-mvp-funnel-production.up.railway.app/demo/polimernye-materialy-f2b6?clientId=f2b6607d-b83b-4ce6-b0ee-8648b8b88904 |
| health | `f8dc41fa-23f4-4ad5-9962-2a489d85a868` | https://saas-mvp-funnel-production.up.railway.app/site/meditsinskaya-klinika-pobolit-i-perestanet-f8dc | https://saas-mvp-funnel-production.up.railway.app/demo/meditsinskaya-klinika-pobolit-i-perestanet-f8dc?clientId=f8dc41fa-23f4-4ad5-9962-2a489d85a868 |

---

## PASS/FAIL по проверкам A–F

Легенда: **PASS** / **FAIL** / **BLOCKED** (нет tenant) / **PARTIAL** (часть шагов).

### Живые ниши

| sector_id | URL (site) | A | B (1:1 form↔CRM) | C submit | D CRM entity | E EN/DE/RU | F same clientId | Verdict |
|-----------|------------|---|------------------|----------|--------------|------------|-----------------|---------|
| education (Fishkin) | …/site/fishkin-ntli-03de | PASS 200 | **FAIL** form popular ≠ CRM courses | PASS UI+API 201 mode=appointment | **PARTIAL** API ok; UI entity в iframe не сверена построчно | **PARTIAL** CTA ok; niche badge не чистый EN/DE | PASS site+crm+iframe clientId | **FAIL** (B) |
| education (Ihor) | …/site/ihor-kriazhev-it-b475 | PASS | **FAIL** | PASS | PARTIAL | PARTIAL | PASS | **FAIL** (B) |
| yoga | …/site/polimernye-materialy-2f73 | PASS | **FAIL** yoga/CrossFit… ≠ Утренняя йога/HIIT… | PASS | PARTIAL | PARTIAL (badge «ФИТНЕС-КЛУБ») | PASS | **FAIL** (B) |
| massage | …/site/xxx-aa6e | PASS | **FAIL** | PASS | PARTIAL | PARTIAL | PASS | **FAIL** (B) |
| cafe | …/site/polimernye-materialy-f2b6 | PASS | **FAIL** лосось/рибай… ≠ Бизнес-ланч/…; mode=inquiry≠reservation | PASS mode=inquiry | PARTIAL (inquiry→appointments, не reservations) | PARTIAL CTA inquiry | PASS | **FAIL** (B+mode) |
| health | …/site/meditsinskaya-klinika-…-f8dc | PASS | **FAIL** +«Анализы» в форме, нет в CRM services sample | PASS | PARTIAL | PARTIAL | PASS | **FAIL** (B) |

Фактические пары списков (пример cafe RU):

- Форма: `Жареный лосось`, `Стейк рибай`, `Паста карбонара`, `Тирамису`
- CRM Меню seed: `Бизнес-ланч`, `Паста карбонара`, `Тирамису`

### Остальные канонические sector_id (нет live tenant)

| sector_id | A–F | Verdict | Причина |
|-----------|-----|---------|---------|
| beauty | BLOCKED | **FAIL** | Нет live slug/clientId в prod registry; код: B=NO (popular≠services) |
| barbershop | BLOCKED | **FAIL** | Нет tenant; код: mode=order из-за `includes("shop")`; нет niche-labels |
| fitness | BLOCKED | **FAIL** | Нет tenant; B=NO (как yoga/fitness_club) |
| dental | BLOCKED | **FAIL** | Нет tenant; B=NO |
| food | BLOCKED | **FAIL** | Нет tenant; mode=inquiry; B menu≠popular |
| hotel | BLOCKED | **FAIL** | Нет tenant |
| car_service | BLOCKED | **FAIL** | Нет tenant |
| tire_service | BLOCKED | **FAIL** | Нет tenant; делится businessType с car_service |
| car_wash | BLOCKED | **FAIL** | Нет tenant; **маппинг→cleaning_service**; клининговые labels (см. ниже) |
| realestate | BLOCKED | **FAIL** | Нет tenant (код B условно YES на данных — не E2E) |
| law_firm | BLOCKED | **FAIL** | Нет tenant; пустые каталоги |
| accounting | BLOCKED | **FAIL** | Нет tenant |
| logistics | BLOCKED | **FAIL** | Нет tenant |
| shop | BLOCKED | **FAIL** | Нет tenant; B=NO |
| tech | BLOCKED | **FAIL** | Нет tenant; B=NO |

**Итог:** ни одна из 20 ниш не закрыта как полный PASS по A–F.  
Живые 6 tenant-кейсов: все **FAIL по B** (каталог). Остальные **FAIL/BLOCKED**.  
Фраза «20/20 PASS» **недопустима**.

---

## car_wash (отдельный аудит)

### Маппинг

`config/sector_mapping.json`: `"car_wash": "cleaning_service"`.

### Labels / UI (факт в коде)

Из `niche-labels.json` → `cleaning_service` (используется при bake car_wash):

| Key | RU | DE | EN | Требование |
|-----|----|----|-----|------------|
| panel_title | Панель **клининга** | Reinigungs-Panel | Cleaning Panel | Автомойка / Autowäsche / Car Wash |
| appointments | **Уборки** | Einsätze | Jobs | Заказы на мойку / Waschaufträge / Wash Orders |
| services | Услуги | Leistungen | Services | Услуги мойки / Waschleistungen / Wash Services |
| staff | Сотрудники | Mitarbeiter | Staff | Сотрудники / Mitarbeiter / Employees ✓ (частично) |
| counters (App.jsx) | … **Уборок** … | … Einsätze … | … Jobs … | не мойка |
| NICHE_SECTOR_LABELS | **Клининг** | Reinigungsservice | Cleaning Service | не Car Wash |
| addAppointment (generic t) | **Добавить приём** | … | Add Appointment | не «Добавить заказ на мойку» |

В `App.jsx` есть объект `car_wash: { ru: "Автомойка", … }`, но **sector mapping не ведёт на ключ `car_wash`** → эти строки не применяются.

### Форма заказа мойки

Поля заказа мойки (клиент, услуга, авто/номер опционально, время, статус):  
CRM pages для `cleaning_service` = appointments/services — **нет поля автомобиля/номера** в стандартной appointment-форме App.jsx.  
Отдельного `car_wash` scenario в `niche-scenarios.json` **нет**.

### EN/DE/RU страницы car_wash

**BLOCKED** на live: нет tenant sector_id=car_wash в registry.  
По коду: любой новый car_wash bake получит клининговые RU/DE/EN → **FAIL** относительно требований.

---

## D — появление заявки в CRM

Для 6 live tenant: `POST /api/leads/{clientId}` → **201 `{ ok:true, mode }`** (C PASS).  
Проверка «ровно в нужной вкладке CRM» (appointments vs reservations vs orders) в iframe **не доведена до PASS** (PARTIAL): нет автоматического чтения Firestore/CRM table в этом аудите.  
Для cafe `mode=inquiry` пишет в appointments-путь leads store, тогда как CRM UI ресторана ориентирован на **reservations** — риск неверной сущности.

---

## Рекомендуемый порядок фикса (только план, без реализации)

1. Единый каталог: форма читает тот же массив, что CRM tab (records / live CRM), без `popular_services` как основного источника.  
2. Исправить `includes("shop")` → не матчить `barbershop`.  
3. `food`/`cafe` → mode reservation (или явный restaurant mode).  
4. `car_wash` → собственный businessType + labels/scenarios/pages (не `cleaning_service`).  
5. Сгенерировать live demo на все 20 sector_id и повторить A–F.

---

## Артефакты прогона

- Prep/lists: `/tmp/live-audit-prep.json`  
- Live CDF: `/tmp/live-audit-cdf.json`  
- Form options scrape: `/tmp/live-audit-results.json`
