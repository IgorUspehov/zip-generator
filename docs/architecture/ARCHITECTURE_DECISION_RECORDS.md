# Architecture Decision Records

**Project:** SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM  
**Version:** ADR V1  
**Status:** Accepted  
**Control point:** V8 Deployment Full Pass  
**Frozen reference:** `SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz` (429 MB)

---

## Document purpose

This document records **architecture decisions** for the project after V8 completion. These are governance decisions — not V9 modules, not new factories, not pipeline changes.

| Scope | In scope | Out of scope |
|-------|----------|--------------|
| Rule definitions | ✅ | |
| Post-deployment feedback concept | ✅ | |
| Release packaging policy | ✅ | |
| V6 / V7 / V8 pipeline code | | ❌ |
| New factory modules | | ❌ |
| New V-modules | | ❌ |

---

## Basis

Independent external architecture audits:

- DeepSeek
- Gemini
- Kimi
- Qwen
- ChatGPT

Supporting internal review documents (same audit cycle):

- `RULE_3_ARCHITECTURE_REVIEW.md`
- `POST_DEPLOYMENT_FEEDBACK_REVIEW.md`
- `PROJECT_WEIGHT_AUDIT_REPORT.md`

---

## ADR index

| ID | Title | Status |
|----|-------|--------|
| [ADR-001](#adr-001-rule-3--deterministic-personalization) | RULE #3 — Deterministic Personalization | Accepted |
| [ADR-002](#adr-002-post-deployment-feedback-layer) | Post-Deployment Feedback Layer | Accepted |
| [ADR-003](#adr-003-lightweight-release-package-policy) | Lightweight Release Package Policy | Accepted |

---

## ADR-001: RULE #3 — Deterministic Personalization

### Status

**Accepted**

### Context

Current formulation:

```text
RULE #3
Каждый MVP обязан быть уникальным.
Одинаковые MVP запрещены.
```

This conflicts with:

```text
RULE #4
LLM не создаёт бизнес-логику.
Фабрика работает детерминированно. llm_used=false.
```

The factory is a deterministic function:

```text
Manifest → Factory → MVP

If M₁ = M₂  →  MVP(M₁) = MVP(M₂)
```

Absolute MVP uniqueness therefore cannot be guaranteed without randomness, random seed, or LLM-generated business logic — all of which contradict the current architecture.

### Decision

Replace the interpretation of **RULE #3**. Do not change RULE #4 or the V6–V8 pipeline.

**New formulation:**

```text
RULE #3 — PERSONALIZED MVP (DETERMINISTIC)

Каждый MVP персонализирован под входной Manifest.

Одинаковый Manifest → одинаковый MVP.
Разный Manifest → различимый MVP.

Различия обеспечиваются через:
  • business_type
  • modules
  • pages
  • navigation
  • content
  • branding
  • datasets
  • configuration

Запрещено:
  • randomness
  • random seed
  • искусственная уникальность
  • LLM-generated business logic

llm_used=false
```

### Formal invariants

```text
Determinism:     M₁ = M₂  ⟹  MVP(M₁) = MVP(M₂)
Differentiation: M₁ ≠ M₂  ⟹  MVP(M₁) ≠ MVP(M₂)  (at least one personalization dimension)
```

### Consequences

| Positive | Neutral / negative |
|----------|-------------------|
| RULE #3 aligned with RULE #4 | Old «absolute uniqueness» wording deprecated |
| Reproducible quality gates preserved | Two clients with identical manifest get identical MVP (expected) |
| Personalization dimensions explicitly documented | No code change required — architecture already implements this |

### What must NOT change

- V6, V7, V8 pipeline logic
- `llm_used=false` enforcement in quality gates
- knowledge_library as primary differentiation source

---

## ADR-002: Post-Deployment Feedback Layer

### Status

**Accepted** (concept only — not implemented as factory or V-module)

### Context

After V8, the pipeline ends at:

```text
Deployment Final Quality Gate → DEPLOYMENT FINAL PASS
```

This proves **Factory Success**, not **Client Success**.

The system currently does not know:

- whether the client opened the deployment URL
- whether the client viewed the MVP
- whether the MVP matches client expectations
- whether the client is ready to pay
- what issues the client found

```text
Deployment PASS  ≠  Client PASS
```

### Decision

Introduce the concept of a **Post-Deployment Feedback Layer**:

- **Outside** the V8 pipeline
- **Not** a factory module
- **Not** a quality gate
- A separate feedback collection and measurement layer

#### Minimum feedback UI

```text
Это то, что вы хотели?

[ Да ]    [ Нет ]
```

Optional on «Нет»: short free-text reason.

#### Recommended data fields

| Field | Purpose |
|-------|---------|
| `feedback_id` | Unique feedback record identifier |
| `run_id` | Link to specific pipeline run |
| `business_type` | Aggregation by business type |
| `client_happy` | Boolean — primary outcome metric |
| `feedback_result` | `"yes"` / `"no"` |
| `feedback_reason` | Free text (required if No) |
| `timestamp` | ISO8601 submission time |

Extended fields (Phase 2, optional): `manifest_ref`, `deployment_mode`, `deployment_url`, `issue_category`, `payment_ready`.

#### Recommended artifact location (future)

```text
artifacts/factory_output/client_feedback/
  client_feedback.json
  client_success_report.json
```

#### Key metric

**Client Happy Rate** = `count(client_happy=true) / count(feedback_received)`

Separate from Factory PASS rate.

#### Client outcome states

| Status | Condition |
|--------|-----------|
| `CLIENT_PASS` | `client_happy = true` |
| `CLIENT_FAIL` | `client_happy = false` |
| `CLIENT_PENDING` | Deployment PASS, no feedback yet |

`CLIENT_PENDING` is a valid state. Factory Success is not downgraded until feedback is received.

#### Implementation approach (when approved)

Phase 1 — no new factory:

1. Feedback UI (page or link in client package README)
2. API route pattern: `POST /api/client-feedback` (same pattern as `/api/client-questionnaire`)
3. JSON artifact writer
4. Optional aggregator script for Client Happy Rate

### Consequences

| Positive | Constraints |
|----------|-------------|
| Separates Factory Success from Client Success | Not part of V8 frozen pipeline |
| Minimal feedback sufficient for first KPI | Requires `run_id` convention for manifest linking |
| No LLM required (`llm_used=false`) | `github_only` mode needs feedback link via factory UI or README |

### What must NOT change

- V8 deployment pipeline
- Existing quality gate modules (V8.1–V8.6)
- Frozen V8 archive

---

## ADR-003: Lightweight Release Package Policy

### Status

**Accepted** (policy only — not implemented as packaging factory)

### Context

V8 frozen snapshot size: **429 MB**

Project weight audit findings:

| Component | Size |
|-----------|------|
| Project on disk | ~1.5 GB |
| `artifacts/` (incl. node_modules, cache) | ~1.3 GB |
| Actual V8 deployment artifacts | ~4 MB |
| Factory source (factory, config, knowledge, src) | ~15 MB |

Primary bloat sources:

- `node_modules` embedded in artifacts (~1.2 GB)
- `.next` cache (~107 MB)
- `multi_business/runs/*` duplicate runs (~530 MB)
- Old archives in `output/` (~58 MB)
- `public/artifacts/` mirror (~115 MB)

A 429 MB archive is appropriate for **full state recovery**, not for **client or investor delivery**.

### Decision

Separate two packaging concepts:

```text
FULL FROZEN SNAPSHOT          RELEASE PACKAGE
(state archive)               (delivery bundle)
```

---

#### FULL FROZEN SNAPSHOT

**Purpose:** archive complete project state for recovery and audit checkpoints.

**May include:**

- `node_modules`
- build artifacts (`build/dist`, `.next`)
- logs
- old `*.tar.gz` archives
- cache directories
- `multi_business` experimental runs
- `public/artifacts/` mirrors

**Usage:** internal recovery, frozen checkpoints, audit reproduction.

**Example:** `SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz` (429 MB) — **do not modify**.

---

#### RELEASE PACKAGE

**Purpose:** transfer to client, investor, or external reviewer.

**Must exclude:**

| Category | Pattern / path |
|----------|----------------|
| Dependencies | `**/node_modules/**` |
| Build cache | `**/.next/**`, `**/.netlify/**` |
| Cache / temp | `**/cache/**`, `**/tmp/**`, `**/temp/**` |
| Logs | `**/logs/**` |
| Old archives | `**/*.tar.gz` (inside project tree) |
| Backups | `**/*.bak*`, `**/*backup*` |
| Duplicates | `public/artifacts/**`, `output/**` (mirrors) |
| Experimental runs | `artifacts/factory_output/multi_business/**` |
| Runtime test harness | `artifacts/runtime_test/**` |
| Temp video work | `**/video_work/**` |

**Must include:**

| Category | Examples |
|----------|----------|
| Factory source | `factory/`, `scripts/`, `config/` |
| Knowledge base | `knowledge_library/` |
| App source | `src/`, `package.json`, `package-lock.json` |
| Documentation | `README.md`, `docs/` |
| Current V8 artifact chain | `deployment_choice/`, `deployment_validation/`, `deployment_final_quality_gate/`, active branch (`github_delivery/` etc.) |
| V7 client delivery | `client_delivery/` (without `video_work/`) |

**Target size:** **25–50 MB** (compressed)

**Restore instructions:** recipient runs `npm ci` to restore dependencies.

#### Recommended exclude manifest (future)

```text
**/node_modules/**
**/.next/**
**/.netlify/**
**/video_work/**
**/runtime_test/**
artifacts/factory_output/multi_business/**
output/**
public/artifacts/**
*.tar.gz
*.bak*
**/logs/**
```

### Consequences

| Positive | Notes |
|----------|-------|
| Clear separation: checkpoint vs delivery | Policy only — no packaging tool created yet |
| Realistic client/investor bundle size | Existing frozen archives remain valid |
| Aligns with PROJECT_WEIGHT_AUDIT findings | Future RELEASE_PACKAGE factory optional (not V9) |

### What must NOT change

- Existing V8 frozen archive (429 MB)
- V6, V7, V8 pipeline
- Current artifact generation logic

---

## Governance

### Immutability of frozen checkpoints

| Archive | Action |
|---------|--------|
| `SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz` | **Do not modify** |
| V6 / V7 frozen archives | **Do not modify** |

ADR documents govern **future behavior and wording**, not retroactive changes to frozen snapshots.

### Relationship to pipeline versions

```text
V6  Full pipeline + quality gate          (frozen)
V7  Client delivery                       (frozen)
V8  Deployment pipeline                   (frozen)
──  ADR V1 architecture decisions         (this document)
??  Future implementation of ADR-002/003 (requires explicit approval)
```

ADR-001 is **retroactive clarification** — the pipeline already behaves according to the new RULE #3 interpretation.

ADR-002 and ADR-003 are **forward-looking** — accepted as architecture policy, not yet implemented.

---

## Revision history

| Version | Date | Change |
|---------|------|--------|
| ADR V1 | 2026-06-13 | Initial release: ADR-001, ADR-002, ADR-003. Basis: external audit review (DeepSeek, Gemini, Kimi, Qwen, ChatGPT). |

---

## References

| Document | ADR |
|----------|-----|
| `RULE_3_ARCHITECTURE_REVIEW.md` | ADR-001 |
| `POST_DEPLOYMENT_FEEDBACK_REVIEW.md` | ADR-002 |
| `PROJECT_WEIGHT_AUDIT_REPORT.md` | ADR-003 |
