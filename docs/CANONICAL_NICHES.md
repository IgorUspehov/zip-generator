# CANONICAL_NICHES

**Source of truth (wizard / production):** `src/lib/niche-sectors.ts` → `WIZARD_SECTOR_IDS`  
(зеркало UI: `src/client-wizard/copy.ts` → `sectors[]` для en/de/ru)

**Маппинг sector_id → businessType:** `config/sector_mapping.json` → `sector_id_to_business_type`  
(используется wizard через `SECTOR_ID_TO_BUSINESS_TYPE` / `src/lib/sector-mapping.ts`)

Не входят в канон (нет в wizard select): `veterinary`, `construction`, `cleaning` / `cleaning_service` как отдельный sector_id.  
Исключение по данным: sector_id `car_wash` **мапится** на businessType `cleaning_service` — это не отдельная wizard-ниша «клининг», а ошибка маппинга (см. audit).

Ровно **20** актуальных `sector_id`:

| # | sector_id | wizard label (EN) | businessType (`sector_mapping.json`) |
|---|-----------|-------------------|--------------------------------------|
| 1 | `beauty` | Beauty salon | `beauty_salon` |
| 2 | `barbershop` | Barbershop | `barbershop` |
| 3 | `massage` | Massage studio | `massage_salon` |
| 4 | `fitness` | Fitness club | `fitness_club` |
| 5 | `yoga` | Yoga studio | `fitness_club` |
| 6 | `dental` | Dentistry | `dental_clinic` |
| 7 | `health` | Medical clinic | `health_clinic` |
| 8 | `food` | Restaurant | `restaurant` |
| 9 | `cafe` | Café | `restaurant` |
| 10 | `hotel` | Hotel | `hotel_booking` |
| 11 | `car_service` | Auto repair | `car_service` |
| 12 | `tire_service` | Tire service | `car_service` |
| 13 | `car_wash` | Car wash | `cleaning_service` ⚠️ |
| 14 | `realestate` | Real estate agency | `real_estate` |
| 15 | `law_firm` | Law firm | `law_firm` |
| 16 | `accounting` | Accounting services | `accounting` |
| 17 | `education` | Education center | `education` |
| 18 | `logistics` | Logistics & transport | `logistics` |
| 19 | `shop` | Online store | `ecommerce` |
| 20 | `tech` | IT & technology | `technology` |

Дата фиксации аудита: 2026-07-20.
