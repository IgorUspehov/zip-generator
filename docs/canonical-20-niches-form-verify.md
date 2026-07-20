# Canonical 20 niches — local form verify

**Date:** 2026-07-19
**Scope:** `saas-mvp-funnel` only — no commit / push / deploy
**Method:** sector-models + shared catalog seed (`records[catalogKey]` / `seedCatalog`) × EN/DE/RU

**Summary:** 60 PASS / 0 FAIL of 60 (20 niches × 3 langs)

## Matrix 20 × 3

| sector_id | lang | mode | catalog 1:1 | niche | party | catalog | booking | public CTA | CRM CTA | payment | result |
|-----------|------|------|-------------|-------|-------|---------|---------|------------|---------|---------|--------|
| beauty | en | appointment | YES (Haircut; Hair Coloring; Manicure) | Beauty Salon | Clients | Services | Appointments | Book now | Add appointment | appointments | **PASS** |
| beauty | de | appointment | YES (Haarschnitt; Haare färben; Maniküre) | Beauty-Salon | Kunden | Leistungen | Termine | Termin buchen | Termin hinzufügen | appointments | **PASS** |
| beauty | ru | appointment | YES (Стрижка; Окрашивание волос; Маникюр) | Салон красоты | Клиенты | Услуги | Записи | Записаться | Добавить запись | appointments | **PASS** |
| barbershop | en | appointment | YES (Classic haircut; Beard trim; Hot towel shave) | Barbershop | Clients | Services | Appointments | Book now | Add appointment | appointments | **PASS** |
| barbershop | de | appointment | YES (Klassischer Haarschnitt; Bartpflege; Rasur mit Hot Towel) | Barbershop | Kunden | Leistungen | Termine | Termin buchen | Termin hinzufügen | appointments | **PASS** |
| barbershop | ru | appointment | YES (Классическая стрижка; Борода; Бритьё) | Барбершоп | Клиенты | Услуги | Записи | Записаться | Добавить запись | appointments | **PASS** |
| massage | en | appointment | YES (Classic Massage; Anti-Stress Massage; Sport Massage) | Massage Studio | Clients | Services | Appointments | Book now | Add appointment | appointments | **PASS** |
| massage | de | appointment | YES (Klassische Massage; Anti-Stress-Massage; Sportmassage) | Massagestudio | Kunden | Leistungen | Termine | Termin buchen | Termin hinzufügen | appointments | **PASS** |
| massage | ru | appointment | YES (Классический массаж; Антистресс массаж; Спортивный массаж) | Массажный салон | Клиенты | Услуги | Записи | Записаться | Добавить запись | appointments | **PASS** |
| fitness | en | appointment | YES (Morning Yoga; HIIT Training; Spinning) | Fitness Club | Members | Classes | Bookings | Book a class | Add booking | appointments | **PASS** |
| fitness | de | appointment | YES (Morgenyoga; HIIT-Training; Spinning) | Fitnessstudio | Mitglieder | Kurse | Buchungen | Kurs buchen | Buchung hinzufügen | appointments | **PASS** |
| fitness | ru | appointment | YES (Утренняя йога; HIIT тренировка; Велотренировка) | Фитнес-клуб | Участники | Занятия | Записи | Записаться на занятие | Добавить запись | appointments | **PASS** |
| yoga | en | appointment | YES (Morning Yoga; HIIT Training; Spinning) | Yoga Studio | Members | Classes | Bookings | Book a class | Add booking | appointments | **PASS** |
| yoga | de | appointment | YES (Morgenyoga; HIIT-Training; Spinning) | Yoga-Studio | Mitglieder | Kurse | Buchungen | Kurs buchen | Buchung hinzufügen | appointments | **PASS** |
| yoga | ru | appointment | YES (Утренняя йога; HIIT тренировка; Велотренировка) | Йога-студия | Участники | Занятия | Записи | Записаться на занятие | Добавить запись | appointments | **PASS** |
| dental | en | appointment | YES (Dental Check-up; Teeth Cleaning; Root Canal) | Dental Clinic | Patients | Services | Appointments | Book now | Add appointment | appointments | **PASS** |
| dental | de | appointment | YES (Zahnkontrolle; Zahnreinigung; Wurzelkanalbehandlung) | Zahnarztpraxis | Patienten | Leistungen | Termine | Termin buchen | Termin hinzufügen | appointments | **PASS** |
| dental | ru | appointment | YES (Осмотр зубов; Чистка зубов; Лечение корневого канала) | Стоматология | Пациенты | Услуги | Приёмы | Записаться | Добавить приём | appointments | **PASS** |
| health | en | appointment | YES (General Examination; Ultrasound; ECG) | Medical Clinic | Patients | Services | Appointments | Book now | Add appointment | appointments | **PASS** |
| health | de | appointment | YES (Allgemeinuntersuchung; Ultraschall; EKG) | Medizinische Klinik | Patienten | Leistungen | Termine | Termin buchen | Termin hinzufügen | appointments | **PASS** |
| health | ru | appointment | YES (Общий осмотр; УЗИ; Кардиограмма) | Медицинская клиника | Пациенты | Услуги | Приёмы | Записаться | Добавить приём | appointments | **PASS** |
| food | en | reservation | YES (Business Lunch; Pasta Carbonara; Tiramisu) | Restaurant | Guests | Menu | Reservations | Reserve a table | Add reservation | reservations | **PASS** |
| food | de | reservation | YES (Business Lunch; Pasta Carbonara; Tiramisu) | Restaurant | Gäste | Speisekarte | Reservierungen | Tisch reservieren | Reservierung hinzufügen | reservations | **PASS** |
| food | ru | reservation | YES (Бизнес-ланч; Паста карбонара; Тирамису) | Ресторан | Гости | Меню | Бронирования | Забронировать столик | Добавить бронирование | reservations | **PASS** |
| cafe | en | reservation | YES (Business Lunch; Pasta Carbonara; Tiramisu) | Café | Guests | Menu | Reservations | Reserve a table | Add reservation | reservations | **PASS** |
| cafe | de | reservation | YES (Business Lunch; Pasta Carbonara; Tiramisu) | Café | Gäste | Speisekarte | Reservierungen | Tisch reservieren | Reservierung hinzufügen | reservations | **PASS** |
| cafe | ru | reservation | YES (Бизнес-ланч; Паста карбонара; Тирамису) | Кафе | Гости | Меню | Бронирования | Забронировать столик | Добавить бронирование | reservations | **PASS** |
| hotel | en | reservation | YES (Standard room; Deluxe room; Suite) | Hotel | Guests | Room types | Reservations | Book a room | Add reservation | reservations | **PASS** |
| hotel | de | reservation | YES (Standardzimmer; Deluxe-Zimmer; Suite) | Hotel | Gäste | Zimmertypen | Reservierungen | Zimmer buchen | Reservierung hinzufügen | reservations | **PASS** |
| hotel | ru | reservation | YES (Стандартный номер; Делюкс; Сьют) | Отель | Гости | Типы номеров | Бронирования | Забронировать номер | Добавить бронирование | reservations | **PASS** |
| car_service | en | order | YES (Oil change; Brake service; Diagnostics) | Auto Repair | Clients | Services | Work orders | Request service | Add work order | orders | **PASS** |
| car_service | de | order | YES (Ölwechsel; Bremsenservice; Diagnose) | Autowerkstatt | Kunden | Leistungen | Aufträge | Service anfragen | Auftrag hinzufügen | orders | **PASS** |
| car_service | ru | order | YES (Замена масла; Тормоза; Диагностика) | Автосервис | Клиенты | Услуги | Заказы | Оставить заказ | Добавить заказ | orders | **PASS** |
| tire_service | en | order | YES (Tire change; Balancing; Puncture repair) | Tire Service | Clients | Services | Work orders | Request service | Add work order | orders | **PASS** |
| tire_service | de | order | YES (Reifenwechsel; Auswuchten; Reifenreparatur) | Reifendienst | Kunden | Leistungen | Aufträge | Service anfragen | Auftrag hinzufügen | orders | **PASS** |
| tire_service | ru | order | YES (Замена шин; Балансировка; Ремонт прокола) | Шиномонтаж | Клиенты | Услуги | Заказы | Оставить заказ | Добавить заказ | orders | **PASS** |
| car_wash | en | order | YES (Exterior wash; Interior cleaning; Full wash) | Car Wash | Customers | Wash Services | Wash Orders | Book a wash | Add Wash Order | orders | **PASS** |
| car_wash | de | order | YES (Außenwäsche; Innenreinigung; Komplettwäsche) | Autowäsche | Kunden | Waschleistungen | Waschaufträge | Wäsche buchen | Waschauftrag hinzufügen | orders | **PASS** |
| car_wash | ru | order | YES (Мойка кузова; Салон; Комплекс) | Автомойка | Клиенты | Услуги мойки | Заказы на мойку | Заказать мойку | Добавить заказ на мойку | orders | **PASS** |
| realestate | en | inquiry | YES (Property Sales; Rental; Property Valuation) | Real Estate Agency | Clients | Services | Viewings | Request a viewing | Add viewing | inquiries | **PASS** |
| realestate | de | inquiry | YES (Immobilienverkauf; Vermietung; Objektbewertung) | Immobilienagentur | Kunden | Leistungen | Besichtigungen | Besichtigung anfragen | Besichtigung hinzufügen | inquiries | **PASS** |
| realestate | ru | inquiry | YES (Продажа недвижимости; Аренда; Оценка объекта) | Агентство недвижимости | Клиенты | Услуги | Показы | Запросить показ | Добавить показ | inquiries | **PASS** |
| law_firm | en | inquiry | YES (Legal consultation; Contract review; Representation) | Law Firm | Clients | Services | Meetings | Request consultation | Add meeting | inquiries | **PASS** |
| law_firm | de | inquiry | YES (Rechtsberatung; Vertragsprüfung; Vertretung) | Anwaltskanzlei | Mandanten | Leistungen | Termine | Beratung anfragen | Termin hinzufügen | inquiries | **PASS** |
| law_firm | ru | inquiry | YES (Юридическая консультация; Проверка договора; Представительство) | Юридическая фирма | Клиенты | Услуги | Встречи | Запросить консультацию | Добавить встречу | inquiries | **PASS** |
| accounting | en | inquiry | YES (Tax consultation; Bookkeeping; Annual closing) | Accounting | Clients | Services | Meetings | Request consultation | Add meeting | inquiries | **PASS** |
| accounting | de | inquiry | YES (Steuerberatung; Buchführung; Jahresabschluss) | Buchhaltung | Mandanten | Leistungen | Termine | Beratung anfragen | Termin hinzufügen | inquiries | **PASS** |
| accounting | ru | inquiry | YES (Налоговая консультация; Ведение учёта; Годовая отчётность) | Бухгалтерия | Клиенты | Услуги | Встречи | Запросить консультацию | Добавить встречу | inquiries | **PASS** |
| education | en | appointment | YES (German B2; English A2; Math Basics) | Education Center | Students | Courses | Lessons | Book a lesson | Add lesson | appointments | **PASS** |
| education | de | appointment | YES (Deutsch B2; Englisch A2; Mathe-Grundlagen) | Bildungszentrum | Schüler | Kurse | Unterricht | Unterricht buchen | Unterricht hinzufügen | appointments | **PASS** |
| education | ru | appointment | YES (Немецкий B2; Английский A2; Основы математики) | Образовательный центр | Студенты | Курсы | Занятия | Записаться на занятие | Добавить занятие | appointments | **PASS** |
| logistics | en | order | YES (City delivery; Express; Warehouse pickup) | Logistics & Transport | Clients | Services | Orders | Request delivery | Add order | orders | **PASS** |
| logistics | de | order | YES (Stadtlieferung; Express; Lagerabholung) | Logistik & Transport | Kunden | Leistungen | Aufträge | Lieferung anfragen | Auftrag hinzufügen | orders | **PASS** |
| logistics | ru | order | YES (Городская доставка; Экспресс; Забор со склада) | Логистика и перевозки | Клиенты | Услуги | Заказы | Заказать доставку | Добавить заказ | orders | **PASS** |
| shop | en | order | YES (Wireless Headphones; Smart Watch; Phone Case) | Online Store | Customers | Products | Orders | Place order | Add order | orders | **PASS** |
| shop | de | order | YES (Kabellose Kopfhörer; Smartwatch; Handyhülle) | Online-Shop | Kunden | Produkte | Bestellungen | Bestellung aufgeben | Bestellung hinzufügen | orders | **PASS** |
| shop | ru | order | YES (Беспроводные наушники; Умные часы; Чехол для телефона) | Интернет-магазин | Покупатели | Товары | Заказы | Оформить заказ | Добавить заказ | orders | **PASS** |
| tech | en | order | YES (SaaS Platform; Mobile App; API Access) | IT & Technology | Clients | Products | Orders | Place order | Add order | orders | **PASS** |
| tech | de | order | YES (SaaS-Plattform; Mobile App; API-Zugang) | IT & Technologie | Kunden | Produkte | Aufträge | Auftrag anfragen | Auftrag hinzufügen | orders | **PASS** |
| tech | ru | order | YES (SaaS платформа; Мобильное приложение; Доступ к API) | IT и технологии | Клиенты | Продукты | Заказы | Оформить заказ | Добавить заказ | orders | **PASS** |

## Checks covered

| Check | How |
|-------|-----|
| A entities/labels | sector-models party/staff/catalog/booking |
| B form dropdown = CRM catalog | same `buildCatalogSeed` for both |
| C lead entity kind | mode → appointment/order/reservation/inquiry in `createSiteLead` |
| D i18n | labels + catalog names per lang; leak heuristics |
| E car_wash ≠ cleaning | mapping + banned substrings |
| F barbershop/food/cafe modes | appointment / reservation |

## Architecture diff

```
BEFORE:
  /site form  ← popular_services (independent)
  CRM UI     ← records.services|menu|courses (localStorage)
  mode       ← includes('shop') heuristics
  car_wash   ← cleaning_service

AFTER:
  sector-models.ts  → mode, labels, catalogKey, CTAs, paymentSource
  resolve-catalog   → buildCatalogSeed(records[catalogKey] || seedCatalog)
  Firestore clients/{id}/catalog  ← shared (GET public, PUT CRM)
  /site + CRM sync via /api/crm/catalog/[clientId]
  car_wash businessType = car_wash (own labels/scenario)
```

## Changed files (this fix)

- `src/lib/niches/sector-models.ts`
- `src/lib/catalog/resolve-catalog.ts`
- `src/lib/catalog/firestore-catalog.ts`
- `src/app/api/crm/catalog/[clientId]/route.ts`
- `src/lib/leads/niche-mode.ts`
- `src/lib/leads/types.ts`
- `src/lib/leads/store.ts`
- `src/app/site/[clientId]/page.tsx`
- `src/components/public-site/booking-form.tsx`
- `src/app/api/leads/[clientId]/route.ts`
- `src/lib/manifest/schema.ts`
- `src/lib/manifest/niche-scenario.ts`
- `config/sector_mapping.json`
- `src/lib/image-library/business-type-map.ts`
- `src/lib/niche-scenarios.json`
- `src/lib/niche-labels.json`
- `artifacts/factory_output/react_mvp/src/data/niche-scenarios.json`
- `artifacts/factory_output/react_mvp/src/data/niche-labels.json`
- `artifacts/factory_output/react_mvp/src/App.jsx`
- `artifacts/factory_output/react_mvp/src/lib/crm-matrix.js`
- `artifacts/factory_output/react_mvp/src/lib/sync-crm-catalog.js`
- `artifacts/factory_output/react_mvp/src/lib/image-library.js`
- `scripts/verify-canonical-20-niches.ts`
- `docs/canonical-20-niches-form-verify.md`

## Notes

- Live tenant E2E (POST lead → CRM UI) still needs Firebase + CRM secret; this run validates the **system invariants** offline.
- `popular_services` remains in scenario JSON for legacy dashboard copy but is **no longer** the public form source.
- Inactive niches `veterinary` / `construction` / `cleaning_service` are not in `WIZARD_SECTOR_IDS` and were not verified as wizard niches.

