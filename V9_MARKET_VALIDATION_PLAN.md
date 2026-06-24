# V9 MARKET VALIDATION PLAN

**Project:** SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM  
**Version:** V9 Plan V1  
**Status:** Ready for execution  
**Prerequisite:** V8 Deployment Full Pass (frozen)  
**Frozen reference:** `SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz`

---

## Document purpose

V9 validates **market demand**, not code, architecture, or pipeline.

| V9 validates | V9 does NOT validate |
|--------------|----------------------|
| Real people need the factory | Factory code quality |
| Willingness to pay | New deployment modules |
| Client Success metrics | New quality gates |
| Pricing hypotheses | New factory modules |

**Central question:** *«Нужна ли фабрика реальным людям?»*

**Governance:** Until V9 exit criteria are met — no V10+, no new factories, no new ADR, no architectural changes.

**ADR alignment:** ADR-002 (Post-Deployment Feedback), ADR-003 (Release Package for client demos).

---

## Executive summary

| Item | Value |
|------|-------|
| Target runs | 5 completed factory runs with 5 real users |
| Primary metric | Client Happy Rate |
| Secondary metrics | Feedback Response Rate, Time To MVP, Time To Deploy |
| Commercial metric | First Paid Client date |
| Outreach | Manual only — no ads, no paid traffic |
| Start price hypothesis | **€99** (Professional — aligned with `config/pricing_catalog.json`) |

---

## 1. TARGET CUSTOMER

### 1.1. Selection criteria

Priority segments share these traits:

- Local or service business needing a simple CRM / booking MVP
- Owner decides quickly (no enterprise procurement)
- Pain: «нужен MVP быстро, без разработчиков и без €10k agency quote»
- Can evaluate result in one session (30–60 min review)

### 1.2. Segment analysis

#### Стоматологические клиники (`dental_clinic`)

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | Нужен patient CRM, appointments, reminders; агентства дороги; Excel/Google Sheets не масштабируется |
| **Ожидаемый результат** | Рабочий MVP: patients, appointments, doctors, dashboard, demo data |
| **Ценность MVP** | **Высокая** — factory уже генерирует medical CRM structure (`knowledge_library/business_content/dental_clinic/`) |
| **Вероятность покупки** | **Средняя (40–55%)** — высокая потребность, но строгие ожидания (compliance, локализация DE/RU) |
| **V9 priority** | **#2** — strong product fit, moderate sales cycle |

---

#### Салоны красоты (`beauty_salon`)

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | Booking chaos, client list in messengers, no unified CRM |
| **Ожидаемый результат** | MVP: clients, stylists, services, bookings, settings — готов к показу инвестору/партнёру |
| **Ценность MVP** | **Очень высокая** — текущий control path V8 (`beauty_salon`), полный pipeline proven |
| **Вероятность покупки** | **Высокая (55–70%)** — owner understands value of «готовый CRM за день» |
| **V9 priority** | **#1** — start here (lowest execution risk) |

---

#### Фитнес клубы (`fitness_club`)

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | Membership tracking, trainer schedules, class bookings |
| **Ожидаемый результат** | MVP with memberships, trainers, bookings modules |
| **Ценность MVP** | **Средняя–высокая** — supported in factory, less polished than beauty_salon path |
| **Вероятность покупки** | **Средняя (35–50%)** — clubs often already use Mindbody/similar |
| **V9 priority** | **#3** — good second wave after beauty + dental |

---

#### Локальные сервисные бизнесы (массаж, автосервис, клининг)

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | «Мне нужен простой CRM + запись клиентов, не хочу платить за разработку» |
| **Ожидаемый результат** | Branded MVP with booking + client list + basic dashboard |
| **Ценность MVP** | **Средняя** — factory covers `massage_salon`, `car_service_crm` |
| **Вероятность покупки** | **Средняя (40–55%)** — price-sensitive, but low alternatives at €99 |
| **V9 priority** | **#4** — use for diversity in 5-client sample |

---

#### Консультанты / коучи / фрилансеры

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | Need client portal / CRM demo for pitches; not a full product yet |
| **Ожидаемый результат** | Presentable MVP + demo video + screenshots for LinkedIn/investor |
| **Ценность MVP** | **Средняя** — less module depth needed, high value on packaging (V7 client delivery) |
| **Вероятность покупки** | **Средняя–высокая (45–60%)** — €49–€99 impulse range |
| **V9 priority** | **#5** — good for pricing sensitivity tests |

---

#### Агентства (web / digital / MVP studios)

| Dimension | Assessment |
|-----------|------------|
| **Проблема** | Need white-label MVP factory to serve SMB clients faster |
| **Ожидаемый результат** | Repeatable pipeline: questionnaire → MVP → client package in hours |
| **Ценность MVP** | **Высокая (B2B)** — multiplier: 1 agency = many end clients |
| **Вероятность покупки** | **Низкая–средняя (25–40%)** at €99; **выше at €499** per seat/license |
| **V9 priority** | **#6 (exploratory)** — 1 conversation in first 5 if opportunity appears; not primary ICP |

### 1.3. V9 primary ICP (first 5 clients)

```text
Priority order:
  1. beauty_salon owner (DE/EU local)
  2. dental_clinic owner (DE/EU local)
  3. fitness_club / massage_salon owner
  4. consultant / freelancer needing demo MVP
  5. mixed local service business
```

**Geography hypothesis:** Germany / EU (factory supports DE/RU content; questionnaire defaults EUR).

---

## 2. CUSTOMER JOURNEY

### 2.1. Full journey map

```text
Landing
   ↓
Questionnaire
   ↓
Manifest
   ↓
MVP Generation
   ↓
Deployment
   ↓
Client Review
   ↓
Feedback
```

### 2.2. Stage-by-stage analysis

#### Stage 1: Landing

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Переходит по ссылке (LinkedIn, WhatsApp, email, личная рекомендация) |
| **Клиент получает** | Обещание: «CRM MVP для вашего бизнеса за один день — без разработчиков» |
| **Риски** | Непонятно что такое «фабрика»; звучит как AI hype; нет social proof |
| **Drop-off point** | Не кликает дальше — **~40%** (hypothesis) |

**Mitigation:** Показать beauty_salon screenshot + demo.mp4 upfront; avoid «AI generates code» messaging — use «готовый CRM MVP».

---

#### Stage 2: Questionnaire

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Заполняет `/client-questionnaire`: business_name, business_type, contacts, modules, language |
| **Клиент получает** | Подтверждение что система поняла его бизнес |
| **Риски** | Длинная форма; непонятные поля; wrong business_type selection |
| **Drop-off point** | Бросает форму на 50%+ — **~25%** (hypothesis) |

**Mitigation:** Operator-assisted call (15 min); pre-fill demo data; limit to 12 core fields for V9.

**Time anchor starts:** `T0 = questionnaire_submitted_at`

---

#### Stage 3: Manifest

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Ничего (automatic) — optional: review manifest summary |
| **Клиент получает** | Прозрачность: «вот что будет собрано» (business_type, modules, languages) |
| **Риски** | Client doesn't understand manifest; expects custom features not in manifest |
| **Drop-off point** | Expectation mismatch discovered here — **~10%** |

**Mitigation:** Send 1-page human summary: «Your MVP will include: Dashboard, Clients, Bookings, …»

---

#### Stage 4: MVP Generation

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Ждёт (operator runs factory) |
| **Клиент получает** | React MVP + client package (README, screenshots, demo video, zip) |
| **Риски** | Wait too long; result looks «template-like»; not their branding |
| **Drop-off point** | Impatience > 4 hours — **~15%** |

**Mitigation:** Set expectation: «2–4 hours»; inject business_name into delivery; use RELEASE PACKAGE not 429MB archive.

**Time anchor:** `T_mvp = client_package_ready_at` → **Time To MVP** = `T_mvp - T0`

---

#### Stage 5: Deployment

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Opens deployment URL OR receives github_delivery package |
| **Клиент получает** | Live link or deploy instructions |
| **Риски** | github_only = no live URL (client must self-deploy); netlify requires operator login |
| **Drop-off point** | «Where is my link?» — **~20%** for github_only |

**Mitigation for V9:** Prefer **netlify** branch for market validation runs (live URL); document github_only as fallback.

**Time anchor:** `T_deploy = deployment_url_available_at` → **Time To Deploy** = `T_deploy - T_mvp`

---

#### Stage 6: Client Review

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Opens URL, clicks through pages, watches demo.mp4, reads README |
| **Клиент получает** | Tangible product to evaluate |
| **Риски** | Compares to mature SaaS (Mindbody, etc.); expects payments/integration day 1 |
| **Drop-off point** | «This is just a demo» — **~30%** without proper framing |

**Mitigation:** Frame as «MVP for validation / investor pitch / first clients» — not production ERP.

---

#### Stage 7: Feedback

| Aspect | Detail |
|--------|--------|
| **Клиент делает** | Answers 6 feedback questions (see Section 5) |
| **Клиент получает** | Feeling of being heard; optional discount on paid tier |
| **Риски** | No response; polite «yes» without honesty |
| **Drop-off point** | No feedback — **~35%** (hypothesis) |

**Mitigation:** 15-min call with structured questions; send feedback link within 1 hour of delivery.

**ADR-002 alignment:** `client_happy` boolean is the primary outcome signal.

---

### 2.3. Journey success definition

```text
Journey SUCCESS = client completes review + submits feedback
Journey FAIL    = drop-off before feedback (record stage)
Factory PASS    = irrelevant to journey SUCCESS (already guaranteed by V8)
```

---

## 3. SUCCESS METRICS

### 3.1. Primary metrics

#### Client Happy Rate

```text
Client Happy Rate = happy_clients / total_clients_with_feedback

Where:
  happy_clients = count(client_happy = true)
  total_clients_with_feedback = count(feedback_received = true)
```

| Target (V9 PASS) | Threshold |
|------------------|-----------|
| Minimum to continue | ≥ 60% (3/5 happy) |
| Strong signal | ≥ 80% (4/5 happy) |
| Stop signal | < 40% (2/5 or fewer) |

---

#### Feedback Response Rate

```text
Feedback Response Rate = feedback_received / completed_runs

Where:
  feedback_received = count(runs with submitted feedback)
  completed_runs    = count(full pipeline PASS + delivery to client)
```

| Target (V9 PASS) | Threshold |
|------------------|-----------|
| Minimum | ≥ 80% (4/5 runs) |
| Ideal | 100% (5/5 runs) |

---

#### Time To MVP

```text
Time To MVP = T_mvp - T0

T0    = questionnaire submitted (or operator call start)
T_mvp = client_delivery PASS (client_package.zip ready)
```

| Target (V9) | Benchmark |
|-------------|-----------|
| Internal operator | < 4 hours |
| Client-visible promise | «Same day» |
| Record per run | Log in `v9_run_log.json` |

---

#### Time To Deploy

```text
Time To Deploy = T_deploy - T_mvp

T_deploy = deployment_url live OR github_delivery package delivered
```

| Target (V9) | Benchmark |
|-------------|-----------|
| netlify branch | < 2 hours after MVP |
| github_only | < 24 hours (client self-deploy) |
| Record per run | Log in `v9_run_log.json` |

---

#### First Paid Client

```text
Metric: date of first payment_received = true
Amount: any paid tier (€49+)
Method: bank transfer / Stripe / invoice (manual OK for V9)
```

| Target (V9 PASS) | Condition |
|------------------|-----------|
| Strong commercial validation | ≥ 1 paying client before V9 close |
| Weak but acceptable | 0 paid, but ≥ 2 «would pay» at stated price |
| Fail signal | 0 paid AND 0 «would pay» across 5 clients |

---

### 3.2. Secondary metrics (log only)

| Metric | Formula / note |
|--------|----------------|
| Drop-off stage | Last completed journey stage per client |
| Would-pay rate | `count(would_pay=yes) / feedback_received` |
| Stated WTP median | Median of «how much would you pay» answers |
| Issue categories | Top 3 from feedback Q4 (what's missing) |
| NPS (optional) | Not required for V9 PASS |

---

### 3.3. Metrics storage (V9)

```text
docs/market_validation/
  v9_run_log.json           # per-run timestamps + outcomes
  v9_feedback/              # one JSON per client/run
  v9_metrics_summary.json   # aggregated rates (calculated manually or script)
  V9_MARKET_VALIDATION_REPORT.md  # final report (created at V9 close)
```

No new factory required — manual JSON + spreadsheet acceptable for V9.

---

## 4. PRICING HYPOTHESES

**Note:** Existing catalog (`config/pricing_catalog.json`): Free €0, Starter €49, Professional €99, Enterprise €299.

V9 tests four price **hypotheses** including €199 (between Professional and Enterprise).

---

### €49 — Starter / «Try MVP»

| Dimension | Assessment |
|-----------|------------|
| **Клиент получает** | MVP package: React app + README + screenshots + demo video; no deployment support |
| **Вероятность покупки** | **Высокая (60–75%)** — low friction, impulse |
| **Ожидаемые возражения** | «Слишком дёшево — значит некачественно»; «Где поддержка?» |
| **Сценарий** | Freelancers, consultants, first test; upsell to €99 with deploy |

---

### €99 — Professional / «MVP + Delivery» ⭐ recommended start

| Dimension | Assessment |
|-----------|------------|
| **Клиент получает** | Full V7 client delivery + deployment (netlify URL or github package) + 1 feedback call |
| **Вероятность покупки** | **Средняя–высокая (45–60%)** — matches current default plan |
| **Ожидаемые возражения** | «Могу найти шаблон бесплатно»; «Нужны payments/integrations» |
| **Сценарий** | Primary V9 offer for beauty_salon / dental_clinic owners |

**Start price hypothesis:** **€99** — balances value perception and proven catalog default.

---

### €199 — Business / «MVP + Customization»

| Dimension | Assessment |
|-----------|------------|
| **Клиент получает** | Everything in €99 + business_name branding in MVP + 1 round of manifest adjustment + priority deploy |
| **Вероятность покупки** | **Средняя (30–45%)** — needs clear differentiation from template |
| **Ожидаемые возражения** | «За €199 хочу уникальный дизайн» (ADR-001: personalization ≠ unique code) |
| **Сценарий** | Clients who want «my brand on it» — test WTP ceiling |

---

### €499 — Agency / «White-label seat»

| Dimension | Assessment |
|-----------|------------|
| **Клиент получает** | 5 MVP runs / month + agency branding + operator support |
| **Вероятность покупки** | **Низкая (15–25%)** for first 5 manual clients; higher in B2B conversations |
| **Ожидаемые возражения** | «Нужен API»; «Нужен SLA»; «Покажите 10 кейсов» |
| **Сценарий** | Exploratory only in V9 — do not lead with this price |

---

### Pricing test protocol (V9)

```text
Clients 1–2:  quote €99 (anchor)
Clients 3–4:  ask WTP question before quoting (see Section 5 Q6)
Client 5:     test €49 OR €199 based on segment

Record: quoted_price, would_pay, stated_wtp, actual_paid
```

### Start price decision

| Decision | Value | Rationale |
|----------|-------|-----------|
| **V9 default offer** | **€99** | Aligned with Professional plan; covers operator time + delivery |
| **Discount for first 5** | €49 acceptable | Exchange: full feedback + testimonial permission |
| **Do not lead with** | €499 | Insufficient proof for agency tier |

---

## 5. FEEDBACK LOOP

### 5.1. Minimum process (ADR-002 aligned)

After **each** completed MVP delivery, collect answers within **72 hours** (call preferred, form acceptable).

### 5.2. Six required questions

| # | Question (RU) | Field | Type |
|---|---------------|-------|------|
| 1 | Получили ли вы то, что ожидали? | `expectations_met` | yes / no |
| 2 | Что понравилось больше всего? | `liked_most` | free text |
| 3 | Что было непонятно? | `unclear` | free text |
| 4 | Что отсутствует? | `missing` | free text |
| 5 | Заплатили бы вы за такой результат? | `would_pay` | yes / no / maybe |
| 6 | Если да — сколько? | `stated_wtp` | number + currency |

**Derived fields:**

```text
client_happy = (expectations_met == "yes")
feedback_result = expectations_met
feedback_reason = missing OR unclear (if expectations_met == "no")
```

### 5.3. Storage format

**Per-run file:** `docs/market_validation/v9_feedback/{run_id}.json`

```json
{
  "feedback_id": "fb_v9_001",
  "run_id": "run_v9_001",
  "business_type": "beauty_salon",
  "client_segment": "beauty_salon_owner",
  "deployment_mode": "netlify",
  "deployment_url": "https://example.netlify.app",
  "expectations_met": "yes",
  "client_happy": true,
  "feedback_result": "yes",
  "liked_most": "Быстро получил рабочий CRM с booking",
  "unclear": "Не понял как самому обновить контент",
  "missing": "Онлайн-оплата",
  "would_pay": "yes",
  "stated_wtp": 99,
  "stated_wtp_currency": "EUR",
  "quoted_price": 99,
  "actual_paid": 0,
  "payment_received": false,
  "feedback_method": "call",
  "feedback_submitted_at": "2026-06-20T14:00:00+00:00",
  "questionnaire_submitted_at": "2026-06-20T09:00:00+00:00",
  "mvp_ready_at": "2026-06-20T12:30:00+00:00",
  "deploy_ready_at": "2026-06-20T13:00:00+00:00",
  "llm_used": false
}
```

**Run log:** `docs/market_validation/v9_run_log.json`

```json
{
  "v9_runs": [
    {
      "run_id": "run_v9_001",
      "client_id": "client_001",
      "business_type": "beauty_salon",
      "factory_pass": true,
      "feedback_received": true,
      "client_happy": true,
      "time_to_mvp_hours": 3.5,
      "time_to_deploy_hours": 0.5
    }
  ]
}
```

### 5.4. Aggregation (at V9 close)

```text
Client Happy Rate       = sum(client_happy) / count(feedback_received)
Feedback Response Rate  = count(feedback_received) / count(completed_runs)
Would-pay rate          = count(would_pay=yes) / count(feedback_received)
Median stated WTP       = median(stated_wtp where would_pay=yes)
Median Time To MVP      = median(time_to_mvp_hours)
Median Time To Deploy   = median(time_to_deploy_hours)
```

Manual calculation acceptable — no new factory.

---

## 6. FIRST FIVE CLIENTS PLAN

**Constraints:** No ads. No paid traffic. No scaling. Manual outreach only.

### Client #1 — Beauty salon owner (warm contact)

| Field | Plan |
|-------|------|
| **Где найти** | Personal network: знакомый владелец салона (Munich/Berlin) |
| **Как связаться** | WhatsApp / личный звонок: «Могу собрать CRM MVP для твоего салона бесплатно за feedback» |
| **Что показать** | beauty_salon screenshots + demo.mp4 from V7 client_delivery |
| **Успех** | Full journey + feedback + `client_happy=true` OR documented fail reason |

---

### Client #2 — Dental clinic (referral from #1)

| Field | Plan |
|-------|------|
| **Где найти** | Referral from Client #1; local Google Maps «Zahnarzt» |
| **Как связаться** | Email: «Wir erstellen ein CRM-MVP für Ihre Praxis — kostenlos gegen Feedback» |
| **Что показать** | dental_clinic page structure diff vs beauty_salon; DE language |
| **Успех** | Feedback received; WTP question answered |

---

### Client #3 — Fitness / massage salon (local service)

| Field | Plan |
|-------|------|
| **Где найти** | Instagram local business; coworking space bulletin |
| **Как связаться** | DM + offer 15-min call |
| **Что показать** | «Same day MVP» promise; live netlify URL |
| **Успех** | Time To MVP logged; deploy URL opened by client |

---

### Client #4 — Consultant / freelancer

| Field | Plan |
|-------|------|
| **Где найти** | LinkedIn (DE consultants, business coaches); Upwork alumni network |
| **Как связаться** | LinkedIn message: «Need a demo CRM MVP for client pitches?» |
| **Что показать** | client_package.zip + demo video as pitch asset |
| **Успех** | `would_pay` answer recorded; price sensitivity data |

---

### Client #5 — Wildcard (validate weakest segment)

| Field | Plan |
|-------|------|
| **Где найти** | Agency OR car_service OR remaining gap from #1–4 |
| **Как связаться** | Cold email to 10 local agencies; 1 response target |
| **Что показать** | Full factory journey transparency (questionnaire → MVP in hours) |
| **Успех** | Complete V9 dataset: 5/5 feedback; all metrics calculable |

---

### Outreach tracker (manual)

| Client | Source | Contact date | Run started | MVP delivered | Feedback | Happy | Paid |
|--------|--------|--------------|-------------|---------------|----------|-------|------|
| #1 | | | | | | | |
| #2 | | | | | | | |
| #3 | | | | | | | |
| #4 | | | | | | | |
| #5 | | | | | | | |

---

## 7. V9 EXIT CRITERIA

### 7.1. PASS conditions (all required)

| # | Criterion | Measure |
|---|-----------|---------|
| 1 | Real users | ≥ 5 real people (not team members) |
| 2 | Completed runs | ≥ 5 full factory runs (V6→V7→V8 PASS) |
| 3 | Feedback coverage | Feedback for **each** run |
| 4 | Client Happy Rate | Calculated and documented |
| 5 | Feedback Response Rate | Calculated and documented |
| 6 | Time To MVP | Known (median logged) |
| 7 | Time To Deploy | Known (median logged) |
| 8 | Payment question answered | «Готов ли кто-нибудь платить?» — yes/no with evidence |

### 7.2. Outcome matrix

| Result | Conditions | Next step |
|--------|------------|-----------|
| **V9 PASS — demand signal** | Client Happy Rate ≥ 60% AND (≥1 paid OR ≥2 would_pay at €99+) | Proceed to V10 planning |
| **V9 PASS — weak demand** | Metrics calculated but Happy Rate < 40% OR 0 would_pay | Pivot ICP or offer; do NOT proceed to product expansion |
| **V9 FAIL — incomplete** | < 5 runs OR < 80% feedback coverage | Extend V9; do not close |
| **V9 INCONCLUSIVE** | 5 runs, full feedback, Happy Rate 40–60%, mixed WTP | Second V9 batch (5 more clients) before decision |

### 7.3. Deliverables at V9 close

```text
docs/market_validation/
  v9_run_log.json
  v9_feedback/*.json
  v9_metrics_summary.json
  V9_MARKET_VALIDATION_REPORT.md    ← final PASS/FAIL/INCONCLUSIVE verdict
```

---

## 8. V9 execution timeline (suggested)

| Week | Activity |
|------|----------|
| W1 | Outreach clients #1–2; run factory; collect feedback |
| W2 | Clients #3–4; refine pitch based on #1–2 objections |
| W3 | Client #5; calculate metrics |
| W4 | Write `V9_MARKET_VALIDATION_REPORT.md`; apply exit criteria |

**Duration:** 4 weeks (adjustable — quality over speed).

---

## 9. Explicit non-goals (V9)

Do **NOT** create until V9 closes:

- V10, V11, V12 modules
- New factory modules
- New ADR documents
- New libraries or architectural changes
- New deployment pipeline modules
- New quality gates
- Paid advertising campaigns

---

## 10. CURRENT VERDICT (plan stage)

> **This section reflects status at plan creation — before V9 execution.**

### Question: «Нужна ли фабрика реальным людям?»

# ➤ 3. Недостаточно данных

| Reason | Detail |
|--------|--------|
| No market runs yet | 0 of 5 required client validations completed |
| No feedback data | Client Happy Rate cannot be calculated |
| No payment evidence | First Paid Client date unknown |
| Factory validated, market not | V8 proves Factory Success — not Client Success |

### What changes the verdict

| After V9 execution | Verdict |
|--------------------|---------|
| Client Happy Rate ≥ 60% + payment or WTP signal | **1. Есть спрос** |
| Client Happy Rate < 40% + 0 would_pay | **2. Спроса нет** |
| Mixed results or incomplete data | **3. Недостаточно данных** → extend V9 |

**Transition to next versions is permitted ONLY after:**

1. V9 exit criteria fully met, AND  
2. `V9_MARKET_VALIDATION_REPORT.md` published with verdict **1** or **2** (not **3**).

---

## References

| Document | Role |
|----------|------|
| `docs/architecture/ARCHITECTURE_DECISION_RECORDS.md` | ADR-001, ADR-002, ADR-003 |
| `POST_DEPLOYMENT_FEEDBACK_REVIEW.md` | Feedback layer design |
| `PROJECT_WEIGHT_AUDIT_REPORT.md` | Release package for client demos |
| `config/pricing_catalog.json` | Existing price tiers |
| V8 frozen archive | Factory baseline (do not modify) |

---

## Revision history

| Version | Date | Change |
|---------|------|--------|
| V9 Plan V1 | 2026-06-13 | Initial market validation plan |
