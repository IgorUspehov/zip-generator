# SAAS_IDEA_AI_MVP_FACTORY_WEB

**v3.1 Web Dashboard Foundation** — полноценный UI для [SAAS_IDEA_AI_MVP_FACTORY](../SAAS_IDEA_AI_MVP_FACTORY).

## Stack

| Слой | Технология |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | [shadcn/ui](https://ui.shadcn.com) (New York) |
| Icons | lucide-react |
| Backend | FastAPI `http://127.0.0.1:8090` |

## Структура

```
src/
├── app/(dashboard)/     # Next.js routes
├── views/               # Page components (import: @/pages/*)
├── pages/README.txt     # alias note (Next.js reserves src/pages/*.tsx)
├── components/          # App shell + shadcn/ui
└── lib/                 # API clients
```

## Разделы Dashboard

- **Dashboard** — Projects, Research Runs, MVP Builds, Success Rate
- **Projects** — история проектов
- **Pipeline** — Project Type, Repository, Template, UI, Complexity, Cost, Packaging, Audit
- **Research** — RAW_IDEA и outputs
- **Options** — OPTION_1/2/3
- **Builds** — MVP status + Factory Audit
- **Artifacts** — PROJECT_TYPE.json … FACTORY_AUDIT.json, FINAL_REPORT.md
- **Settings** — API URL

## shadcn/ui components

`sidebar`, `card`, `table`, `tabs`, `badge`, `progress`, `dialog`, `scroll-area`, `accordion`, `button`, `alert`, `separator`, `sheet`, `tooltip`, `input`, `skeleton`

## Запуск

**1. Backend:**

```bash
cd ../SAAS_IDEA_AI_MVP_FACTORY
./run/api.sh
```

**2. Frontend:**

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

**Env (опционально):** `.env.local`

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8090
AI_PROVIDER=fallback
DEEPSEEK_API_KEY=your_key_here
```

### CURRENT AI MODE

```
AI_PROVIDER=fallback
```

External LLM API disabled.
Factory can be tested without paid API balance.

Set `AI_PROVIDER=deepseek` to enable DeepSeek (with automatic fallback on API errors).

**AI test (mock без ключа):**

```bash
npm run ai:test
```
