# PROJECT_WEIGHT_AUDIT_REPORT

**Дата аудита:** 2026-06-13  
**Проект:** `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM`  
**Контрольная точка:** V8 Deployment Full Pass (frozen archive **не изменялся**)  
**Frozen archive:** `~/PROJECT_AI_AGENTS/SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz` — **429 MB**

---

## Executive Summary

| Метрика | Значение |
|---------|----------|
| Размер проекта на диске | **1.5 GB** |
| Размер V8 frozen `.tar.gz` | **429 MB** (~29% от raw size) |
| Доля `artifacts/` | **1.3 GB (87%)** |
| Суммарный вес всех `node_modules` (top-level) | **~1.2 GB** |
| Актуальные V8 deployment artifacts | **~4 MB** |
| Реалистичный целевой release package | **25–50 MB** (compressed) |

**Главный вывод:** 429 MB frozen — это не «тяжёлый factory source code», а архив **полного рабочего дерева** с накопленными build/runtime артефактами: множественные `node_modules` (~1.2 GB), `.next` cache (~107 MB), 5 дублирующих `multi_business` runs (~530 MB), зеркало `public/artifacts/` (~115 MB) и старые v5 archives в `output/` (~61 MB). Сам deterministic factory (Python modules, config, knowledge) весит **~15 MB**.

---

## 1. Общий размер проекта

```
du -sh .
1.5G    .
```

| Категория | Размер | Доля |
|-----------|--------|------|
| `artifacts/` | 1.3 GB | 87% |
| `public/` | 118 MB | 8% |
| `output/` | 61 MB | 4% |
| `factory/` | 7.5 MB | <1% |
| `knowledge_library/` | 2.5 MB | <1% |
| `src/` | 1.8 MB | <1% |
| Root `node_modules/` | 136 KB | negligible |
| Прочее (config, scripts, backups, root tar.gz) | ~12 MB | <1% |

---

## 2. Размер основных папок

```
du -sh ./* | sort -h
```

| Папка | Размер | Комментарий |
|-------|--------|-------------|
| `artifacts/` | **1.3G** | Основной источник bloat |
| `public/` | 118M | Зеркало artifacts + output для UI |
| `output/` | 61M | Старые v5 frozen archives + zip |
| `factory/` | 7.5M | Python factory modules (V5–V8) |
| `knowledge_library/` | 2.5M | Шаблоны и knowledge base |
| `src/` | 1.8M | Next.js app source |
| `scripts/` | 752K | Utility scripts |
| `config/` | 88K | Deployment/manifest config |
| `backups/` | 188K | Мелкие backup-файлы |
| `node_modules/` (root) | 136K | Минимальная установка (не полный npm install) |
| Root `*.tar.gz` (V5 pass snapshots) | ~10M | 9 мелких frozen snapshots V5.x |

### Детализация `artifacts/factory_output/` (top consumers)

| Подпапка | Размер | Назначение |
|----------|--------|------------|
| `multi_business/runs/*` | **530M** | 5 business types × ~106M (дубли node_modules) |
| `real_mvp/` | **477M** | Next.js materialization: node_modules + .next cache |
| `react_ui/` | 81M | Vite client package + node_modules |
| `react_mvp/` | 71M | React MVP build + node_modules |
| `runtime_test/` | 84M | Runtime test harness + node_modules |
| `client_delivery/` | 2.6M | V7 client delivery (актуальный) |
| `github_delivery/` | 1.5M | V8.4 GitHub delivery package |
| V8 deployment dirs | ~88K | choice, validation, final QG, netlify, custom_domain |

---

## 3. Топ-30 самых больших файлов

```
find . -type f -printf '%s %p\n' | sort -nr | head -30
```

| # | Размер | Файл |
|---|--------|------|
| 1 | 136.5 MB | `artifacts/factory_output/real_mvp/node_modules/@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node` |
| 2 | 32.3 MB | `artifacts/factory_output/real_mvp/.next/cache/webpack/server-production/0.pack` |
| 3 | 30.3 MB | `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.4_PROJECT_SELECTOR_FACTORY_FROZEN.tar.gz` |
| 4 | 23.7 MB | `artifacts/factory_output/real_mvp/.next/cache/webpack/client-production/0.pack` |
| 5 | 15.9 MB | `artifacts/factory_output/real_mvp/node_modules/@img/sharp-libvips-linux-x64/lib/libvips-cpp.so.8.17.3` |
| 6 | 15.1 MB | `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.2_ZIP_FACTORY_FROZEN.tar.gz` |
| 7 | 10.9 MB | `artifacts/factory_output/real_mvp/.next/cache/webpack/client-development/1.pack.gz` |
| 8 | 10.7 MB | `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.1_PACKAGE_FACTORY_FROZEN.tar.gz` |
| 9 | 10.5 MB | `artifacts/factory_output/real_mvp/.next/cache/webpack/server-development/3.pack.gz` |
| 10 | 9.6 MB | `SAAS_IDEA_AI_MVP_FACTORY_V5.4_REACT_MVP_BUILD_EXECUTOR_PASS_FROZEN.tar.gz` (root) |
| 11–30 | 9.3 MB × 20 | `esbuild` binaries — дублируются в 7+ `node_modules` trees |

**Паттерн:** топ файлов — это (a) Next.js SWC/sharp native binaries, (b) webpack `.next/cache` packs, (c) старые v5 tar.gz, (d) повторяющиеся esbuild binaries в разных client packages.

---

## 4. Количество `node_modules` папок

```
find . -name "node_modules" -type d
```

| Метрика | Значение |
|---------|----------|
| Всего директорий `node_modules` (включая nested) | **56** |
| Top-level `node_modules` (не внутри другого node_modules) | **12** |
| Суммарный размер top-level `node_modules` | **~1.2 GB** |

### Top-level `node_modules` по размеру

| Путь | Размер |
|------|--------|
| `artifacts/factory_output/real_mvp/node_modules` | **370M** |
| `artifacts/factory_output/multi_business/runs/beauty_salon/.../node_modules` | 102M |
| `artifacts/factory_output/multi_business/runs/car_service_crm/.../node_modules` | 102M |
| `artifacts/factory_output/multi_business/runs/dental_clinic/.../node_modules` | 102M |
| `artifacts/factory_output/multi_business/runs/fitness_club/.../node_modules` | 102M |
| `artifacts/factory_output/multi_business/runs/massage_salon/.../node_modules` | 102M |
| `public/artifacts/factory_output/react_ui/client_package/node_modules` | 99M |
| `artifacts/runtime_test/.../node_modules` | 82M |
| `artifacts/factory_output/react_ui/client_package/node_modules` | 81M |
| `artifacts/factory_output/react_mvp/node_modules` | 70M |
| `.netlify/plugins/node_modules` | 3.9M |
| `./node_modules` (root) | 136K |

**Вывод:** root `node_modules` почти пуст — основной bloat в **artifact-embedded** npm installs (7 полноценных деревьев + 5 multi_business копий).

---

## 5. Список всех `*.tar.gz` внутри проекта

```
find . -name "*.tar.gz" -type f -exec ls -lh {} \;
```

| Файл | Размер |
|------|--------|
| `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.4_PROJECT_SELECTOR_FACTORY_FROZEN.tar.gz` | **31M** |
| `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.2_ZIP_FACTORY_FROZEN.tar.gz` | **16M** |
| `output/SAAS_IDEA_AI_MVP_FACTORY_WEB_v5.1_PACKAGE_FACTORY_FROZEN.tar.gz` | **11M** |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.4_REACT_MVP_BUILD_EXECUTOR_PASS_FROZEN.tar.gz` | 9.6M |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.5_CLIENT_PACKAGE_FROM_REACT_MVP_PASS_FROZEN.tar.gz` | 43K |
| `SAAS_IDEA_AI_MVP_FACTORY_V5_FINAL_QUALITY_GATE_PASS_FROZEN.tar.gz` | 24K |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.6_FULL_V5_PIPELINE_RUNNER_PASS_FROZEN.tar.gz` | 23K |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.1_MVP_ASSEMBLY_INTELLIGENCE_PASS_FROZEN.tar.gz` | 21K |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.3_MVP_BUILD_ORCHESTRATOR_PASS_FROZEN.tar.gz` | 17K |
| `SAAS_IDEA_AI_MVP_FACTORY_V5.2_TEMPLATE_SELECTION_INTEGRATION_PASS_FROZEN.tar.gz` | 16K |
| `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_PIPELINE_KNOWLEDGE_INTEGRATION_V1_PASS_FROZEN.tar.gz` | 21K |
| `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_I18N_FACTORY_V1_PASS_FROZEN.tar.gz` | 27K |
| `SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_MULTI_UI_FACTORY_V1_PASS_FROZEN.tar.gz` | 14K |

**Итого внутри проекта:** ~**66 MB** (из них ~58 MB — 3 больших v5 archives в `output/`).

> **Примечание:** V8 frozen (`SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz`, 429 MB) находится **вне** проекта в `~/PROJECT_AI_AGENTS/` и в этот список не входит.

---

## 6. Список всех `*.zip` внутри проекта

```
find . -name "*.zip" -type f -exec ls -lh {} \;
```

**Итого:** 29 файлов, **~14 MB** суммарно.

| Категория | Примеры | Размер |
|-----------|---------|--------|
| Multi-business final packages (×5) | `artifacts/factory_output/multi_business/runs/*/final_package.zip` | 1.2M × 5 = **6M** |
| Client delivery duplicates | `output/final_package.zip`, `public/output/final_package.zip` | 1.2M × 2 |
| Актуальный V7/V8 client package | `artifacts/factory_output/client_delivery/client_package.zip` | 604K |
| GitHub delivery package | `artifacts/factory_output/github_delivery/.../client_package.zip` | 604K |
| Legacy bundles | `project_bundle.zip`, `mvp_package.zip` (×multiple mirrors) | 38K–532K each |

**Вывод:** zip-файлы сами по себе не критичны (~14 MB), но **дублируются** между `artifacts/`, `public/`, `output/`.

---

## 7. Список всех `*.mp4` внутри проекта

```
find . -name "*.mp4" -type f -exec ls -lh {} \;
```

**Итого:** 33 файла, **~7 MB** суммарно.

| Категория | Кол-во | Типичный размер |
|-----------|--------|-----------------|
| Актуальный client delivery demo | 3 | 214K |
| Video work segments (temp) | 6 | 19K–61K |
| Multi-business demo copies (×5 runs × 2) | 10 | 279K each |
| Legacy/mirror demos | 14 | 145K–279K |

**Вывод:** demo video не раздувает проект (~7 MB total). `video_work/` segments — **240K** (кандидат на исключение из release).

---

## 8. Список cache/temp/log папок

```
find . -type d \( -name ".cache" -o -name "cache" -o -name "tmp" -o -name "temp" -o -name "logs" \)
```

| Путь | Размер | Тип |
|------|--------|-----|
| `artifacts/factory_output/real_mvp/.next/cache` | **89M** | Next.js webpack cache |
| `artifacts/factory_output/real_mvp/.next/` (total) | **107M** | Build cache + traces |
| `artifacts/factory_output/client_delivery/video_work/` | 240K | Temp video segments |
| `artifacts/execution/logs` | 20K | Factory logs |
| `artifacts/factory_output/execution/logs` | 20K | Factory logs |
| `public/artifacts/execution/logs` | 20K | Mirror logs |
| `public/artifacts/factory_output/client_package/logs` | 20K | Mirror logs |
| `public/artifacts/factory_output/execution/logs` | 20K | Mirror logs |
| `.netlify/` | 3.9M | Netlify CLI plugins cache |

**Вывод:** `.next/cache` (89M) — второй по значимости bloat после node_modules. Logs negligible.

---

## 9. Список backup-файлов

```
find . -type f \( -name "*.bak*" -o -name "*.backup*" -o -name "*backup*" \)
```

**Итого:** 20 файлов, **~84 KB** суммарно.

| Категория | Файлы |
|-----------|-------|
| `.env.local.bak_*` (7 файлов) | Старые env snapshots (Jun 11) |
| `src/lib/ai-orchestrator/*.bak_*` (11 файлов) | Orchestrator migration backups |
| `src/lib/factory-api.ts.bak` | 1 файл |
| `src/app/api/ai/analyze/route.ts.bak_*` | 1 файл |
| `backups/` directory | 188K |

**Вывод:** backup-файлы **не влияют** на 429 MB (84K total). Кандидаты на исключение из release по гигиене, не по размеру.

---

## 10. Предполагаемые кандидаты на удаление / исключение

> **Важно:** это рекомендации для **будущего** release package. Сейчас ничего не удалялось.

### Tier 1 — High impact (~1.1 GB savings)

| Кандидат | Размер | Причина |
|----------|--------|---------|
| `artifacts/factory_output/multi_business/` | **530M** | 5 experimental runs; не часть V8 control path (`beauty_salon` only) |
| `artifacts/factory_output/real_mvp/node_modules/` | **370M** | Embedded npm install; восстанавливается через `npm ci` |
| `artifacts/factory_output/real_mvp/.next/` | **107M** | Build cache; пересобирается |
| `public/artifacts/` | **115M** | Зеркало `artifacts/` для Next.js static serving |
| `artifacts/runtime_test/` | **84M** | Test harness, не production artifact |
| `artifacts/factory_output/react_ui/` node_modules | **81M** | Embedded in client package |
| `artifacts/factory_output/react_mvp/node_modules` | **70M** | Embedded in React MVP build |

### Tier 2 — Medium impact (~75 MB savings)

| Кандидат | Размер | Причина |
|----------|--------|---------|
| `output/*.tar.gz` (v5.1, v5.2, v5.4) | **58M** | Superseded frozen snapshots |
| Root V5 `*.tar.gz` snapshots | **~10M** | Historical pass markers |
| Duplicate zip/mp4 mirrors in `public/output/` | **~5M** | Duplicates of `artifacts/` |
| `.netlify/plugins/node_modules` | **3.9M** | Local Netlify CLI cache |

### Tier 3 — Low impact (hygiene)

| Кандидат | Размер | Причина |
|----------|--------|---------|
| `client_delivery/video_work/` | 240K | Temp ffmpeg segments |
| `*.bak*` files | 84K | Dev migration backups |
| Execution logs | ~80K | Runtime logs |
| Legacy presentation screenshots | ~5M total | Superseded by V7 client_delivery |

### Estimated savings table

| Scope | Uncompressed savings | Expected compressed release |
|-------|---------------------|----------------------------|
| Tier 1 only | ~1.1 GB | ~80–120 MB |
| Tier 1 + Tier 2 | ~1.2 GB | ~30–50 MB |
| Minimal V8 release (source + V8 artifacts only) | ~1.45 GB | **~15–30 MB** |

---

## 11. Что нельзя удалять

### Обязательно сохранять (V8 control path)

| Ресурс | Размер | Причина |
|--------|--------|---------|
| `factory/` (all modules V5–V8.6) | 7.5M | Deterministic factory source |
| `config/` | 88K | deployment_config, manifest |
| `knowledge_library/` | 2.5M | Business templates |
| `src/`, `package.json`, `package-lock.json` | ~2M | Next.js factory UI |
| `scripts/`, `README.md` | ~760K | Tooling and docs |
| `artifacts/factory_output/deployment_choice/` | 16K | V8.1 PASS artifacts |
| `artifacts/factory_output/deployment_validation/` | 20K | V8.5 PASS artifacts |
| `artifacts/factory_output/deployment_final_quality_gate/` | 20K | V8.6 PASS artifacts |
| `artifacts/factory_output/github_delivery/` | 1.5M | V8.4 active branch (github_only) |
| `artifacts/factory_output/client_delivery/` | 2.6M | V7 client delivery chain |
| V6/V7 pipeline JSON reports & manifests | ~1M | Upstream validation chain |
| `SAAS_IDEA_AI_MVP_FACTORY_V8_DEPLOYMENT_FULL_PASS_FROZEN.tar.gz` | 429M | **Frozen checkpoint — не трогать** |

### Не удалять без явного решения

- `artifacts/factory_output/react_mvp/` source (без node_modules) — нужен для pipeline re-run
- `netlify_deploy/`, `custom_domain/` dirs — inactive branches, но часть V8 audit trail (~50K total)
- `patterns/`, `input/`, `mock/` — factory inputs

---

## 12. Рекомендации для будущего RELEASE_PACKAGE

### A. Структура lightweight release

```
RELEASE_PACKAGE/
├── factory/                    # Python modules (~7.5M)
├── config/                     # (~88K)
├── knowledge_library/          # (~2.5M)
├── src/                        # Next.js UI (~1.8M)
├── scripts/                    # (~752K)
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json, next.config.ts, ...
└── artifacts/factory_output/
    ├── deployment_choice/      # V8.1
    ├── deployment_validation/  # V8.5
    ├── deployment_final_quality_gate/  # V8.6
    ├── github_delivery/        # V8.4 (active branch)
    ├── client_delivery/        # V7 (without video_work/)
    └── [V6/V7 JSON manifests only]
```

**Исключить из release:**
- все `node_modules/` (включая artifact-embedded)
- `.next/`, `.netlify/`
- `multi_business/`
- `real_mvp/` (или только source без node_modules/.next)
- `runtime_test/`
- `public/artifacts/` (regenerate or serve from `artifacts/`)
- `output/`
- root `*.tar.gz` snapshots
- `video_work/`, logs, `*.bak*`

### B. `.tarignore` / release manifest

Создать `release_exclude.txt`:

```
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

### C. Целевые размеры

| Package type | Содержимое | Realistic size |
|--------------|------------|----------------|
| **Full dev checkout** | Source + npm install instructions, no artifacts bloat | 15–25 MB compressed |
| **V8 PASS snapshot** | Source + V8 artifact chain (JSON + client package) | 25–50 MB compressed |
| **Factory-only** | Python factory + config + knowledge (no React) | 10–15 MB compressed |
| **Current V8 frozen** (reference) | Everything as-is | **429 MB** (baseline) |

### D. Pipeline hygiene rules (future)

1. **Never commit `node_modules` into artifacts** — store `package-lock.json` + `npm ci` in factory step
2. **Exclude `.next/cache`** from any materialization output
3. **Single business run** in release — don't accumulate `multi_business/runs/*`
4. **No nested frozen tar.gz** inside project tree — store in `~/PROJECT_AI_AGENTS/` only
5. **Deduplicate `public/artifacts/`** — symlink or build-time copy, not full mirror
6. **Clean `video_work/`** after demo.mp4 assembly
7. **Separate RELEASE_PACKAGE factory** (future) — explicit allowlist, not `tar` of entire tree

---

## Почему frozen = 429 MB при factory без LLM

```
Business Idea → ... → DEPLOYMENT FINAL PASS
                         ↑
              429 MB frozen archive
                         ↑
        tar of entire 1.5 GB project tree
                         ↑
    87% = artifacts with 1.2 GB node_modules
```

| Компонент | В проекте | В frozen (est.) | % frozen |
|-----------|-----------|-----------------|----------|
| node_modules (all trees) | 1.2 GB | ~350 MB | ~82% |
| .next cache | 107 MB | ~40 MB | ~9% |
| multi_business runs | 530 MB | ~25 MB | ~6% (good compression of duplicates) |
| V8 actual artifacts | ~4 MB | ~2 MB | <1% |
| Factory source + config | ~15 MB | ~8 MB | ~2% |
| Old v5 archives + output | ~66 MB | ~4 MB | ~1% |

**Ответ на ключевой вопрос:** 429 MB — это не «тяжёлый deterministic factory», а **7+ embedded npm installs + Next.js build cache + 5 multi_business duplicates + mirrors**, упакованные целиком в frozen snapshot. Сам V8 deployment pipeline artifacts весят **~4 MB**.

---

## Audit metadata

- **Метод:** read-only analysis (`du`, `find`, `ls`)
- **Изменения в проекте:** none
- **Frozen archive:** not modified
- **Аудитор:** automated PROJECT_WEIGHT_AUDIT
