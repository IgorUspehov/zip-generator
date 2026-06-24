# RULE_3_ARCHITECTURE_REVIEW

**Тема:** RULE #3 UNIQUENESS — архитектурный аудит  
**Дата:** 2026-06-13  
**Контрольная точка:** V8 Deployment Full Pass  
**Тип документа:** architecture rule review (без изменений кода)

---

## Executive Summary

**Текущая формулировка RULE #3 технически некорректна** для детерминированной архитектуры фабрики.

| Правило | Суть | Совместимость |
|---------|------|---------------|
| **RULE #3 (текущая)** | Каждый MVP уникален; одинаковые MVP запрещены | ❌ Противоречит детерминизму |
| **RULE #4** | LLM не создаёт бизнес-логику; factory deterministic; `llm_used=false` | ✅ Реализовано в V6–V8 |

**Рекомендация:** заменить «уникальный MVP» на **«персонализированный MVP»** и явно разделить два свойства:

1. **Deterministic equivalence** — одинаковый Manifest → одинаковый MVP (это feature, не bug).
2. **Input-driven differentiation** — разные входы (business_type, modules, branding, language) → различимый MVP.

---

## 1. Проблема

### 1.1. Формулировка RULE #3 (как задана)

```text
RULE #3
Каждый MVP обязан быть уникальным.
Одинаковые MVP запрещены.
```

### 1.2. Формулировка RULE #4 (как задана)

```text
RULE #4
LLM не создаёт бизнес-логику.
LLM только: классифицирует, выбирает, ранжирует, персонализирует, собирает.
Фабрика работает детерминированно. llm_used=false.
```

### 1.3. Логическое противоречие

```text
Manifest (inputs)
      ↓
Factory (deterministic function F)
      ↓
MVP (output)

Если M₁ = M₂  →  F(M₁) = F(M₂)     ← детерминизм
Если MVP₁ ≠ MVP₂ обязательно       ← RULE #3 (абсолютная уникальность)

Следствие:
  два клиента с одинаковым manifest → одинаковый MVP
  → нарушение RULE #3
  → но это корректное поведение RULE #4
```

**Вывод:** при буквальном прочтении RULE #3 и RULE #4 **несовместимы**. Фабрика не может одновременно:

- гарантировать **bit-identical output** для одинаковых inputs (quality gate expectation), и
- **запрещать** одинаковые MVP для одинаковых inputs.

### 1.4. Что реально делает текущая архитектура

Pipeline V6–V8 построен как **pure function**:

```text
MVP = f(questionnaire, manifest, knowledge_library, config)
```

Примеры детерминизма в коде:

| Компонент | Поведение | `llm_used` |
|-----------|-----------|------------|
| `questionnaire_factory/manifest_builder.py` | Manifest из answers — фиксированная функция | `false` |
| `mvp_assembly_intelligence_factory/assembly_selector.py` | Template/UI/modules по category — lookup tables | `false` |
| `knowledge_library_integration_factory/knowledge_router.py` | Pack selection по business_type + language | `false` |
| `multi_ui_factory/multi_ui_factory.py` | UI profile по business_type matrix | `false` |
| `business_profile_factory` | Content из `knowledge_library/business_content/{type}/` | `false` |
| V8 quality gates | Проверяют consistency, не uniqueness hash | `false` |

**Random seed, UUID-based variation, LLM code generation** в основном pipeline **отсутствуют**.

---

## 2. Анализ: что означает «уникальность» в контексте фабрики

### 2.1. Три возможных определения

| Определение | Формула | Достижимо без LLM? | Соответствует коду? |
|-------------|---------|-------------------|---------------------|
| **A. Absolute uniqueness** | ∀ run: hash(MVPᵢ) ≠ hash(MVPⱼ) | ❌ Требует randomness | ❌ |
| **B. Input-driven differentiation** | Mᵢ ≠ Mⱼ → MVPᵢ ≠ MVPⱼ | ✅ | ✅ |
| **C. Client-perceived personalization** | MVP отражает business/client context | ✅ | ✅ (partial) |

RULE #3 в текущей формулировке описывает **A**.  
Архитектура реализует **B + C**.

### 2.2. Доказательство на примере codebase

#### Разные business_type → разные MVP

`beauty_salon/pages.json`:

```json
["dashboard", "clients", "services", "stylists", "bookings", "settings"]
```

`dental_clinic/pages.json`:

```json
["dashboard", "patients", "appointments", "doctors", "settings"]
```

→ Разная page structure, navigation, demo_data, business_profile — **без LLM**.

#### Разные questionnaire flags → разные modules

`manifest_builder.py` включает в manifest:

```python
"crm", "booking", "notifications", "pwa", "apk", "payments", "analytics", "languages"
```

`assembly_selector.py` мапит flags → `selected_modules`:

```json
{
  "selected_modules": ["appointments", "crm", "notifications"],
  "selected_template": "medical_crm",
  "selected_ui": "dashboard_modern"
}
```

→ Module composition меняется детерминированно от inputs.

#### Одинаковый manifest → одинаковый MVP

`multi_business/runs/beauty_salon/` (5 runs в PROJECT_WEIGHT_AUDIT) — при идентичных inputs каждый run воспроизводит **тот же** MVP structure. Это ожидаемо и **корректно** для quality gates, но **нарушает** буквальный RULE #3.

### 2.3. Ответ на вопрос 1: технически корректна ли текущая формулировка?

**Нет**, при следующих условиях архитектуры:

- factory = deterministic function;
- `llm_used=false` enforced во всех quality gates;
- manifest = единственный source of truth для конфигурации MVP;
- нет random seed injection.

RULE #3 в формулировке «абсолютная уникальность» **невыполнима** и **не нужна** для бизнес-цели фабрики.

---

## 3. Ответ на вопрос 2: «уникальный» → «персонализированный»?

**Да, замена термина корректна и необходима.**

| Термин | Смысл | Подходит фабрике? |
|--------|-------|-------------------|
| **Unique** | Каждый output уникален глобально, даже при одинаковых inputs | ❌ |
| **Personalized** | Output отражает конкретный business/client context из manifest | ✅ |
| **Deterministic** | Одинаковые inputs → одинаковый reproducible output | ✅ (implicit today) |

**Персонализация** — это то, что RULE #4 уже разрешает LLM делать («персонализирует»), а factory реализует **без LLM** через knowledge_library + selection rules.

```text
RULE #4:  LLM personalizes INPUT  (manifest contract)
          Factory personalizes OUTPUT (deterministic assembly)
```

---

## 4. Ответ на вопрос 3: какие свойства реально обеспечивают различие между MVP

### 4.1. Матрица personalization dimensions

| Dimension | Источник в pipeline | Varies between clients? | Implemented today? |
|-----------|---------------------|-------------------------|-------------------|
| **business_type** | questionnaire → manifest | ✅ Strong | ✅ Full |
| **selected modules** | manifest flags → assembly_decision | ✅ Strong | ✅ Full |
| **page structure** | `knowledge_library/business_content/{type}/pages.json` | ✅ Strong | ✅ Full |
| **navigation** | `navigation.json` per business_type | ✅ Strong | ✅ Full |
| **content / copy** | knowledge packs (ru/de/en) | ✅ Medium | ✅ Full |
| **datasets** | `demo_data.json` per business_type | ✅ Medium | ✅ Full |
| **selected UI** | multi_ui matrix / assembly_decision | ✅ Medium | ✅ Full |
| **selected template** | assembly_decision by category | ✅ Medium | ✅ Full |
| **languages** | manifest.languages[] | ✅ Medium | ✅ Partial |
| **business configuration** | crm/booking/payments/analytics flags | ✅ Medium | ✅ Full |
| **branding** | client_onboarding: business_name, logo, website | ✅ Strong (client-facing) | ⚠️ Partial |
| **deployment_mode** | deployment_config | ✅ Weak (delivery, not MVP core) | ✅ Full |
| **commercial** | plan_id, currency | ✅ Weak | ⚠️ Partial |

### 4.2. Что НЕ создаёт различие (и не должно)

| Механизм | Почему не используется |
|----------|------------------------|
| Random seed | Ломает reproducibility и quality gates |
| LLM-generated business logic | Запрещено RULE #4 |
| Timestamp injection в MVP code | Артефакт, не personalization |
| Hash salt per run | Искусственная «уникальность» без смысла |

### 4.3. Personalization vs Uniqueness — практический пример

```text
Client A: beauty_salon, crm=true, booking=true, languages=[ru,de]
Client B: beauty_salon, crm=true, booking=true, languages=[ru,de]

→ MVP_A ≡ MVP_B     (correct for deterministic factory)
→ RULE #3 (old): FAIL
→ RULE #3 (new): PASS if both are valid personalized beauty_salon MVPs

Client A: beauty_salon
Client C: dental_clinic

→ MVP_A ≢ MVP_C     (different pages, modules, content)
→ RULE #3 (new): PASS — distinguishable personalization
```

---

## 5. Варианты решения

### Вариант A — Replace wording only (рекомендуется)

Заменить RULE #3 на personalization + determinism. Минимальное изменение governance, zero code impact.

### Вариант B — Split into two rules

```text
RULE #3a  DETERMINISM
Identical manifest inputs MUST produce identical MVP outputs.

RULE #3b  PERSONALIZATION
Different manifest inputs MUST produce distinguishable MVP outputs
across at least one personalization dimension.
```

Явно формализует оба свойства.

### Вариант C — Keep RULE #3 + add exception (не рекомендуется)

```text
RULE #3: Unique MVP, except when manifests are identical.
```

Создаёт путаницу; exception swallowing rule.

### Вариант D — Force uniqueness via randomness (запрещено)

```text
Inject random seed per run to guarantee unique MVP.
```

❌ Противоречит quality gates, reproducibility, RULE #4.

### Вариант E — Force uniqueness via LLM code gen (запрещено)

```text
LLM generates custom business logic per client.
```

❌ Прямое нарушение RULE #4 и `llm_used=false` policy.

---

## 6. Рекомендуемая формулировка RULE #3

### 6.1. Primary formulation (RU)

```text
RULE #3 — PERSONALIZED MVP (DETERMINISTIC)

Каждый MVP обязан быть персонализированным под входной Manifest клиента.

Фабрика работает как детерминированная функция:
  одинаковый Manifest → одинаковый MVP.

Разные Manifest → различимый MVP по измерениям персонализации:
  business_type, modules, content, page structure, navigation,
  UI selection, datasets, branding, business configuration.

Запрещено искусственно создавать отличия через randomness,
LLM-generated business logic или non-deterministic assembly.

llm_used=false.
```

### 6.2. Compact formulation (EN, for contracts)

```text
RULE #3 — DETERMINISTIC PERSONALIZATION

MVP output MUST be a deterministic function of manifest inputs.
Identical inputs MUST yield identical outputs.
Different inputs MUST yield distinguishable personalized outputs.
Artificial uniqueness mechanisms (random seeds, LLM logic generation)
are forbidden.
```

### 6.3. Formal invariant (for future quality gates)

```text
∀ M₁, M₂:
  M₁ = M₂  ⟹  hash(MVP(M₁)) = hash(MVP(M₂))           [determinism]

∀ M₁, M₂:
  M₁ ≠ M₂  ⟹  ∃ dim ∈ PersonalizationDimensions:
              MVP(M₁)[dim] ≠ MVP(M₂)[dim]               [differentiation]
              OR explicit override documented
```

Where `PersonalizationDimensions` = {business_type, modules, pages, navigation, content, ui, language, branding}.

---

## 7. Согласование RULE #3 (new) с RULE #4

| Аспект | RULE #4 | RULE #3 (new) | Conflict? |
|--------|---------|---------------|-----------|
| LLM role | Classify, select, rank, personalize **inputs** | Factory personalizes **outputs** deterministically | ❌ No |
| Business logic origin | Templates + knowledge_library + rules | Same sources | ❌ No |
| `llm_used=false` in factory | Required | Required | ❌ No |
| Same manifest re-run | N/A | Same MVP (expected) | ❌ No |
| Different business_type | LLM may classify | Different MVP (expected) | ❌ No |

```text
                    RULE #4                    RULE #3 (new)
                        │                              │
            LLM shapes manifest              Factory executes manifest
            (optional, upstream)             (deterministic, required)
                        │                              │
                        └──────────┬───────────────────┘
                                   ▼
                         Personalized MVP
                    (not globally unique,
                     but client-context specific)
```

---

## 8. Влияние на текущую архитектуру

### 8.1. Что менять НЕ нужно

| Компонент | Статус |
|-----------|--------|
| V6–V8 pipeline | ✅ Already implements deterministic personalization |
| Quality gates (18/30/47 checks) | ✅ Validate PASS/consistency, not global uniqueness |
| `llm_used=false` enforcement | ✅ Aligned with new RULE #3 |
| knowledge_library structure | ✅ Primary differentiation source |
| Frozen V8 archive | ✅ No change |

### 8.2. Что стоит уточнить (governance / docs only)

| Area | Current gap | Recommended clarification |
|------|-------------|---------------------------|
| Rule documentation | «Unique» wording | Adopt RULE #3 (new) |
| LLM_MANIFEST contract | LLM «personalizes» | Clarify: personalizes **manifest**, not **code** |
| Quality gate semantics | «PASS» = factory success | Not «globally unique MVP» |
| Client onboarding | branding fields exist | Document as personalization dimension |
| POST_DEPLOYMENT feedback | Client Success separate | Unhappy client ≠ duplicate MVP violation |

### 8.3. Anti-patterns to explicitly forbid (add to architecture docs)

```text
❌  Inject Math.random() / uuid into MVP to satisfy uniqueness
❌  Reject pipeline PASS because two clients share business_type
❌  Use LLM to rewrite business logic per client
❌  Treat identical MVP hash as quality gate failure
```

### 8.4. Optional future enhancements (not required for rule fix)

These increase **personalization depth**, not **global uniqueness**:

| Enhancement | Dimension | Requires LLM? |
|-------------|-----------|---------------|
| Inject `business_name` into React MVP titles | branding | ❌ |
| Client logo in build/dist | branding | ❌ |
| Per-client demo_data from questionnaire | datasets | ❌ |
| Personalization quality gate (check dims differ when inputs differ) | governance | ❌ |

---

## 9. Связь с другими architecture reviews

| Document | Relationship |
|----------|--------------|
| `POST_DEPLOYMENT_FEEDBACK_REVIEW.md` | Client Success measures satisfaction, not MVP hash uniqueness |
| `PROJECT_WEIGHT_AUDIT_REPORT.md` | multi_business duplicate runs prove determinism (same inputs → same ~106M artifacts) |
| `LLM_MANIFEST_CONTRACT_REPORT.md` | LLM output = manifest contract; factory = deterministic executor |

---

## 10. Выводы

### Ответы на задачи аудита

| # | Вопрос | Ответ |
|---|--------|-------|
| 1 | Корректна ли текущая формулировка RULE #3? | **Нет** — абсолютная уникальность несовместима с детерминированной фабрикой |
| 2 | Заменить «уникальный» на «персонализированный»? | **Да** — точнее отражает архитектуру и согласуется с RULE #4 |
| 3 | Какие свойства обеспечивают различие? | business_type, modules, pages, navigation, content, UI, datasets, branding, config |
| 4 | Новая формулировка RULE #3? | **Deterministic Personalization** — см. раздел 6 |

### Итоговая формула

```text
Старая RULE #3:  MVP must be globally unique
Новая RULE #3:   MVP must be deterministically personalized

Factory Success = f(manifest) is reproducible
Client Success  = client_happy (separate concern, post-V8)
```

**RULE #3 в текущей формулировке — архитектурный legacy artifact**, не соответствующий реализации V6–V8. Замена на **Deterministic Personalization** устраняет противоречие с RULE #4 без изменения pipeline, factory или frozen checkpoints.

---

## Audit metadata

- **Тип:** architecture rule review only
- **Изменения в коде:** none
- **Новые factory / V9:** none
- **Pipeline / V8 frozen:** unchanged
