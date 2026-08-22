import type {
  DeployableZipLanguage,
  DeployableZipMode,
  DeployableZipReadmeContext,
} from "@/lib/deployable-zip/types";

function pickLanguage(value: string | undefined): DeployableZipLanguage {
  if (value === "ru" || value === "de" || value === "en") return value;
  return "en";
}

function modeLabel(mode: DeployableZipMode, lang: DeployableZipLanguage): string {
  const labels = {
    en: {
      owner: "Owner export",
      subscription_export: "Subscription site export",
      marketplace: "Marketplace digital product",
      internal_test: "Internal test package",
    },
    de: {
      owner: "Owner-Export",
      subscription_export: "Abo-Website-Export",
      marketplace: "Marketplace-Digitalprodukt",
      internal_test: "Internes Testpaket",
    },
    ru: {
      owner: "Экспорт владельца",
      subscription_export: "Экспорт сайта подписки",
      marketplace: "Цифровой продукт Marketplace",
      internal_test: "Внутренний тестовый пакет",
    },
  } as const;
  return labels[lang][mode];
}

/**
 * Mode-aware README for Deployable ZIP V2.
 * Does not claim full SaaS autonomy — documents local vs backend-dependent features.
 */
export function buildDeployableZipReadme(input: {
  clientId: string;
  mode: DeployableZipMode;
  context?: DeployableZipReadmeContext;
}): string {
  const lang = pickLanguage(input.context?.language);
  const businessName = input.context?.businessName?.trim() || "Website + CRM";
  const businessType = input.context?.businessType?.trim() || "business";
  const support =
    input.context?.supportNote?.trim() ||
    (lang === "ru"
      ? "Сохраните этот README и Client ID для поддержки."
      : lang === "de"
        ? "Bewahren Sie diese README und die Client-ID für den Support auf."
        : "Keep this README and your Client ID for support.");

  const publicOrigin = (
    input.context?.publicOrigin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://webstudio-muenchen.com"
  )
    .trim()
    .replace(/\/$/, "");
  const slug = input.context?.slug?.trim() || "";

  const publicSiteLine =
    lang === "ru"
      ? slug
        ? `- 🌐 Публичный сайт (SaaS): ${publicOrigin}/site/${slug}`
        : `- 🌐 Публичный сайт (SaaS): ${publicOrigin}/site/{slug}`
      : lang === "de"
        ? slug
          ? `- 🌐 Öffentliche Site: ${publicOrigin}/site/${slug}`
          : `- 🌐 Öffentliche Site: ${publicOrigin}/site/{slug}`
        : slug
          ? `- 🌐 Public site: ${publicOrigin}/site/${slug}`
          : `- 🌐 Public site: ${publicOrigin}/site/{slug}`;

  const buyerLinks =
    lang === "ru"
      ? [
          "## Ваши ссылки (сайт + CRM + Admin)",
          "",
          "После заливки ZIP на Netlify:",
          "",
          "- **CRM** — URL вашего деплоя (корень сайта)",
          "- **Admin / редактирование** — кнопка «Админ» в верхней панели CRM (magic link на email)",
          "- **Сайт, вакансии, бронирование** — кнопки в той же панели",
          "",
          publicSiteLine,
          `- 🔐 Admin: ${publicOrigin}/admin/login?clientId=${input.clientId}`,
          `- 📋 Вакансии: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/job`,
          `- 📅 Бронирование: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/booking`,
          "",
          `Client ID: \`${input.clientId}\``,
        ]
      : lang === "de"
        ? [
            "## Ihre Links (Site + CRM + Admin)",
            "",
            "Nach dem Upload des ZIP auf Netlify:",
            "",
            "- **CRM** — URL Ihres Deployments",
            "- **Admin / Bearbeitung** — Schaltfläche „Admin“ in der oberen CRM-Leiste",
            "",
            publicSiteLine,
            `- 🔐 Admin: ${publicOrigin}/admin/login?clientId=${input.clientId}`,
            `- 📋 Stellen: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/job`,
            `- 📅 Buchung: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/booking`,
            "",
            `Client-ID: \`${input.clientId}\``,
          ]
        : [
            "## Your links (site + CRM + Admin)",
            "",
            "After uploading the ZIP to Netlify:",
            "",
            "- **CRM** — your deploy URL",
            "- **Admin / editing** — “Admin” button in the CRM top bar",
            "",
            publicSiteLine,
            `- 🔐 Admin: ${publicOrigin}/admin/login?clientId=${input.clientId}`,
            `- 📋 Jobs: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/job`,
            `- 📅 Booking: ${publicOrigin}/site/${encodeURIComponent(input.clientId)}/booking`,
            "",
            `Client ID: \`${input.clientId}\``,
          ];

  const title =
    lang === "ru"
      ? `# ${businessName} — Deployable ZIP`
      : lang === "de"
        ? `# ${businessName} — Deployable ZIP`
        : `# ${businessName} — Deployable ZIP`;

  const overview =
    lang === "ru"
      ? [
          "## Обзор продукта",
          "",
          `Пакет: **${modeLabel(input.mode, lang)}**.`,
          "",
          "Это **статическая** оболочка Website + CRM (Vite/React), персонализированная для одного клиента.",
          "Пакет **разблокирован** — без баннера «Выберите тариф» / DEMO paywall. Это оплаченный цифровой товар.",
          "Это **не** полный клон SaaS (Next.js Admin, SSR `/site`, серверные API) и **не** обещает полную автономность всех функций.",
        ]
      : lang === "de"
        ? [
            "## Produktübersicht",
            "",
            `Paket: **${modeLabel(input.mode, lang)}**.`,
            "",
            "Dies ist eine **statische** Website + CRM-Shell (Vite/React), personalisiert für einen Kunden.",
            "Es ist **kein** vollständiger SaaS-Klon (Next.js Admin, SSR `/site`, Server-APIs) und verspricht **keine** volle Autonomie aller Funktionen.",
          ]
        : [
            "## Product overview",
            "",
            `Package: **${modeLabel(input.mode, lang)}**.`,
            "",
            "This is a **static** Website + CRM shell (Vite/React), personalized for one client.",
            "It is **not** a full SaaS clone (Next.js Admin, SSR `/site`, server APIs) and does **not** claim full autonomy for every feature.",
          ];

  const contents =
    lang === "ru"
      ? [
          "## Содержимое архива",
          "",
          "- `index.html` — точка входа UI",
          "- `assets/` — JS/CSS и статические ресурсы сборки",
          "- `image-library/` — изображения ниши (если есть)",
          "- `client-manifest.json` — публичная персонализация (без секретов)",
          "- `_headers` — опциональные заголовки для Cloudflare Pages",
          "- `netlify.toml` / `_redirects` — подсказки для static-хостинга (Netlify и аналоги)",
          "- `README.md` — эта инструкция",
        ]
      : lang === "de"
        ? [
            "## Inhalt des Archivs",
            "",
            "- `index.html` — UI-Einstieg",
            "- `assets/` — JS/CSS und Build-Assets",
            "- `image-library/` — Branchenbilder (falls vorhanden)",
            "- `client-manifest.json` — öffentliche Personalisierung (ohne Secrets)",
            "- `_headers` — optionale Cloudflare-Pages-Header",
            "- `netlify.toml` / `_redirects` — Hinweise für Static-Hosting (Netlify u.a.)",
            "- `README.md` — diese Anleitung",
          ]
        : [
            "## Package contents",
            "",
            "- `index.html` — UI entry point",
            "- `assets/` — built JS/CSS and static assets",
            "- `image-library/` — niche images (when present)",
            "- `client-manifest.json` — public personalization (secrets stripped)",
            "- `_headers` — optional Cloudflare Pages headers",
            "- `netlify.toml` / `_redirects` — static-host hints (Netlify and similar)",
            "- `README.md` — this guide",
          ];

  const requirements =
    lang === "ru"
      ? [
          "## Требования",
          "",
          "- Современный браузер",
          "- Любой static host **или** Node.js для локального `npx serve`",
          "- Для облачной синхронизации каталога/вакансий/лидов — **свой backend** (см. ниже)",
        ]
      : lang === "de"
        ? [
            "## Anforderungen",
            "",
            "- Moderner Browser",
            "- Beliebiger Static Host **oder** Node.js für lokales `npx serve`",
            "- Für Cloud-Sync von Katalog/Stellen/Leads — **eigenes Backend** (siehe unten)",
          ]
        : [
            "## Requirements",
            "",
            "- A modern browser",
            "- Any static host **or** Node.js for local `npx serve`",
            "- For cloud sync of catalog / vacancies / leads — **your own backend** (see below)",
          ];

  const runLocal =
    lang === "ru"
      ? [
          "## Локальный запуск",
          "",
          "1. Распакуйте ZIP.",
          "2. Откройте терминал в папке с `index.html`.",
          "3. Запустите:",
          "",
          "```bash",
          "npx serve .",
          "```",
          "",
          "4. Откройте напечатанный URL в браузере.",
        ]
      : lang === "de"
        ? [
            "## Lokal starten",
            "",
            "1. ZIP entpacken.",
            "2. Terminal im Ordner mit `index.html` öffnen.",
            "3. Starten:",
            "",
            "```bash",
            "npx serve .",
            "```",
            "",
            "4. Die angezeigte URL im Browser öffnen.",
          ]
        : [
            "## Run locally",
            "",
            "1. Unzip the archive.",
            "2. Open a terminal in the folder that contains `index.html`.",
            "3. Run:",
            "",
            "```bash",
            "npx serve .",
            "```",
            "",
            "4. Open the printed URL in your browser.",
          ];

  const deploy =
    lang === "ru"
      ? [
          "## Как это работает (простая формула)",
          "",
          "1. В Admin внесли изменения и сохранили сайт.",
          "2. Скачали этот ZIP.",
          "3. Залили содержимое на **любой static-хостинг** — сайт онлайн.",
          "",
          "Это уже **готовые файлы сайта** (`index.html` + `assets/`), а не серверный SaaS.",
          "Поэтому хост может быть любым: Netlify, Cloudflare Pages, Vercel, Render (Static Site),",
          "GitHub Pages, Firebase Hosting, S3+CDN, nginx, cPanel, Timeweb и т.д.",
          "",
          "## Куда заливать (правило одно)",
          "",
          "Корень сайта = папка, где лежит `index.html` (вместе с `assets/`, `README.md`, манифестом).",
          "Загружайте **все** файлы из ZIP, не только README.",
          "",
          "### Быстрые варианты",
          "",
          "- **Netlify Drop:** [app.netlify.com/drop](https://app.netlify.com/drop) — перетащить папку или ZIP.",
          "- **Cloudflare Pages / Vercel:** New project → Upload / Direct upload → та же папка.",
          "- **Render:** New → Static Site → указать папку с `index.html` (build command пустой, publish = `.`).",
          "- **Railway / любой Node-хост:** в папке с сайтом `npx serve .` (или Docker с `serve`).",
          "- **Свой VPS / nginx / cPanel:** скопировать файлы в `public_html` / document root.",
          "",
          "В пакете есть `netlify.toml` и `_redirects` — удобно для Netlify; на других хостах их можно игнорировать.",
          "",
          "## bolt.new и похожие AI-редакторы",
          "",
          "Этот ZIP — **готовый сайт**, не исходники с `package.json`.",
          "Если нужно править в bolt.new / Lovable / v0: импортируйте ZIP как static files",
          "или используйте файлы как референс. Для «сайт онлайн за минуту» достаточно любого static-хоста выше.",
          "Полный SaaS (Admin, API, оплата) живёт у продавца; в ZIP — клиентский сайт + CRM shell.",
        ]
      : lang === "de"
        ? [
            "## So funktioniert es (einfache Formel)",
            "",
            "1. Im Admin Änderungen speichern.",
            "2. Dieses ZIP herunterladen.",
            "3. Inhalt auf **beliebiges Static-Hosting** hochladen — Site ist live.",
            "",
            "Das sind **fertige Website-Dateien** (`index.html` + `assets/`), kein Server-SaaS.",
            "Hosting kann sein: Netlify, Cloudflare Pages, Vercel, Render (Static Site),",
            "GitHub Pages, Firebase Hosting, S3+CDN, nginx, cPanel usw.",
            "",
            "## Wohin hochladen (eine Regel)",
            "",
            "Document Root = Ordner mit `index.html` (inkl. `assets/`, README, Manifest).",
            "Alle Dateien aus dem ZIP hochladen — nicht nur die README.",
            "",
            "### Schnelle Optionen",
            "",
            "- **Netlify Drop:** [app.netlify.com/drop](https://app.netlify.com/drop) — Ordner oder ZIP ziehen.",
            "- **Cloudflare Pages / Vercel:** New project → Upload — gleicher Ordner.",
            "- **Render:** New → Static Site — Publish-Verzeichnis `.`, kein Build.",
            "- **Railway / Node-Host:** im Site-Ordner `npx serve .`.",
            "- **VPS / nginx / cPanel:** Dateien in `public_html` / Document Root kopieren.",
            "",
            "`netlify.toml` und `_redirects` helfen bei Netlify; auf anderen Hosts optional ignorieren.",
            "",
            "## bolt.new und ähnliche AI-Editoren",
            "",
            "Dieses ZIP ist eine **fertige Site**, kein Quellprojekt mit `package.json`.",
            "Für bolt.new / Lovable / v0: ZIP als Static Files importieren oder als Referenz nutzen.",
            "Für „Site in einer Minute live“ reicht jedes Static-Hosting oben.",
            "Volles SaaS (Admin, API, Zahlung) bleibt beim Anbieter; im ZIP: Kundensite + CRM-Shell.",
          ]
        : [
            "## How it works (simple formula)",
            "",
            "1. Edit and save the site in Admin.",
            "2. Download this ZIP.",
            "3. Upload the contents to **any static host** — the site is live.",
            "",
            "These are **ready website files** (`index.html` + `assets/`), not a server SaaS.",
            "Host anywhere: Netlify, Cloudflare Pages, Vercel, Render (Static Site),",
            "GitHub Pages, Firebase Hosting, S3+CDN, nginx, cPanel, etc.",
            "",
            "## Where to upload (one rule)",
            "",
            "Site root = the folder that contains `index.html` (with `assets/`, README, manifest).",
            "Upload **all** files from the ZIP — not only the README.",
            "",
            "### Quick options",
            "",
            "- **Netlify Drop:** [app.netlify.com/drop](https://app.netlify.com/drop) — drag the folder or ZIP.",
            "- **Cloudflare Pages / Vercel:** New project → Upload — same folder.",
            "- **Render:** New → Static Site — publish directory `.`, empty build command.",
            "- **Railway / any Node host:** in the site folder run `npx serve .`.",
            "- **VPS / nginx / cPanel:** copy files into `public_html` / document root.",
            "",
            "`netlify.toml` and `_redirects` help on Netlify; on other hosts you can ignore them.",
            "",
            "## bolt.new and similar AI editors",
            "",
            "This ZIP is a **finished site**, not a `package.json` source repo.",
            "For bolt.new / Lovable / v0: import the ZIP as static files or use it as reference.",
            "For “live in a minute”, any static host above is enough.",
            "Full SaaS (Admin, API, billing) stays with the seller; this ZIP is the customer site + CRM shell.",
          ];

  const localFeatures =
    lang === "ru"
      ? [
          "## Что работает локально (без backend)",
          "",
          "- Отрисовка UI / CRM shell",
          "- Записи CRM в **localStorage** браузера",
          "- Контакты и контент из `client-manifest.json` / baked bootstrap",
          "- Упакованные изображения `image-library/`",
        ]
      : lang === "de"
        ? [
            "## Was lokal funktioniert (ohne Backend)",
            "",
            "- UI / CRM-Shell",
            "- CRM-Datensätze im Browser-**localStorage**",
            "- Kontakte/Inhalte aus `client-manifest.json` / baked Bootstrap",
            "- Mitgelieferte Bilder unter `image-library/`",
          ]
        : [
            "## What works locally (no backend)",
            "",
            "- UI / CRM shell rendering",
            "- CRM records in browser **localStorage**",
            "- Contacts/content from `client-manifest.json` / baked bootstrap",
            "- Packaged `image-library/` images",
          ];

  const backendFeatures =
    lang === "ru"
      ? [
          "## Что требует внешнего backend",
          "",
          "- Синхронизация **каталога** и **вакансий** (`/api/crm/catalog`, `/api/crm/vacancies`)",
          "- Облачные **лиды** / booking capture (`/api/leads`, `/api/crm/leads`)",
          "- Live-обновление манифеста через `/api/manifest/{clientId}`",
          "- Проверка оплаты демо `/api/demo-access`",
          "- Next.js **Admin**, публичный SSR `/site`, формы booking/job на SaaS",
          "",
          "В текущей сборке клиентский код может по умолчанию обращаться к",
          "`https://webstudio-muenchen.com`, если не задан другой `VITE_MANIFEST_API_BASE` на этапе сборки.",
          "**Не считайте это вашей инфраструктурой.** Для независимого продукта укажите свой API base",
          "или отключите sync-функции.",
        ]
      : lang === "de"
        ? [
            "## Was ein externes Backend braucht",
            "",
            "- Sync von **Katalog** und **Stellen** (`/api/crm/catalog`, `/api/crm/vacancies`)",
            "- Cloud-**Leads** / Booking-Capture (`/api/leads`, `/api/crm/leads`)",
            "- Live-Manifest über `/api/manifest/{clientId}`",
            "- Demo-Paid-Check `/api/demo-access`",
            "- Next.js **Admin**, öffentliches SSR `/site`, Booking/Job-Formulare der SaaS",
            "",
            "In der aktuellen Build kann der Client standardmäßig",
            "`https://webstudio-muenchen.com` aufrufen, wenn kein anderes `VITE_MANIFEST_API_BASE` gesetzt wurde.",
            "**Das ist nicht Ihre Infrastruktur.** Für ein unabhängiges Produkt eigenen API-Base setzen",
            "oder Sync-Funktionen deaktivieren.",
          ]
        : [
            "## What requires an external backend",
            "",
            "- **Catalog** and **vacancies** sync (`/api/crm/catalog`, `/api/crm/vacancies`)",
            "- Cloud **leads** / booking capture (`/api/leads`, `/api/crm/leads`)",
            "- Live manifest refresh via `/api/manifest/{clientId}`",
            "- Demo paid-gate `/api/demo-access`",
            "- Next.js **Admin**, public SSR `/site`, SaaS booking/job forms",
            "",
            "In the current build, client JS may default to",
            "`https://webstudio-muenchen.com` unless `VITE_MANIFEST_API_BASE` was set at build time.",
            "**That is not your infrastructure.** For an independent product, point API calls at your own backend",
            "or treat sync features as unavailable.",
          ];

  const envVars =
    lang === "ru"
      ? [
          "## Environment variables",
          "",
          "**Для static hosting секреты не нужны.**",
          "",
          "| Переменная | Где | Зачем |",
          "|---|---|---|",
          "| _(нет)_ | ZIP | Открыть UI на static host |",
          "| `VITE_MANIFEST_API_BASE` | Только при **пересборке** `react_mvp` | Свой API вместо дефолтного хоста |",
          "",
          "Firebase / Polar / Railway / Redis credentials **не входят** в этот ZIP и не требуются для static UI.",
        ]
      : lang === "de"
        ? [
            "## Umgebungsvariablen",
            "",
            "**Für Static Hosting sind keine Secrets nötig.**",
            "",
            "| Variable | Wo | Wofür |",
            "|---|---|---|",
            "| _(keine)_ | ZIP | UI auf Static Host öffnen |",
            "| `VITE_MANIFEST_API_BASE` | Nur bei **Rebuild** von `react_mvp` | Eigene API statt Default-Host |",
            "",
            "Firebase / Polar / Railway / Redis Credentials sind **nicht** im ZIP und für die Static-UI nicht nötig.",
          ]
        : [
            "## Environment variables",
            "",
            "**No secrets are required for static hosting.**",
            "",
            "| Variable | Where | Purpose |",
            "|---|---|---|",
            "| _(none)_ | ZIP | Open the UI on a static host |",
            "| `VITE_MANIFEST_API_BASE` | Only when **rebuilding** `react_mvp` | Point API calls at your backend |",
            "",
            "Firebase / Polar / Railway / Redis credentials are **not** included and are not required for the static UI.",
          ];

  const identity =
    lang === "ru"
      ? [
          "## Идентификация клиента",
          "",
          `- Client ID: \`${input.clientId}\``,
          `- Тип бизнеса: ${businessType}`,
          "",
          "Этот ZIP должен содержать данные **только** этого Client ID.",
        ]
      : lang === "de"
        ? [
            "## Kundenidentität",
            "",
            `- Client-ID: \`${input.clientId}\``,
            `- Branche: ${businessType}`,
            "",
            "Dieses ZIP darf nur Daten **dieser** Client-ID enthalten.",
          ]
        : [
            "## Client identity",
            "",
            `- Client ID: \`${input.clientId}\``,
            `- Business type: ${businessType}`,
            "",
            "This ZIP must contain data for **this** Client ID only.",
          ];

  const troubleshooting =
    lang === "ru"
      ? [
          "## Troubleshooting",
          "",
          "- Пустой CRM / Loading: проверьте `client-manifest.json` и baked bootstrap в `index.html`.",
          "- Каталог/вакансии не грузятся: нужен backend или отключение sync (см. зависимости выше).",
          "- CORS ошибки: ваш API должен разрешать origin static host.",
          "- Неверный контент: убедитесь, что Client ID в манифесте совпадает с ожидаемым.",
        ]
      : lang === "de"
        ? [
            "## Troubleshooting",
            "",
            "- Leeres CRM / Loading: `client-manifest.json` und baked Bootstrap in `index.html` prüfen.",
            "- Katalog/Stellen laden nicht: Backend nötig oder Sync deaktivieren.",
            "- CORS-Fehler: API muss den Static-Host-Origin erlauben.",
            "- Falscher Inhalt: Client-ID im Manifest muss zur erwarteten ID passen.",
          ]
        : [
            "## Troubleshooting",
            "",
            "- Blank CRM / Loading: check `client-manifest.json` and baked bootstrap in `index.html`.",
            "- Catalog/vacancies fail: you need a backend or must treat sync as unavailable.",
            "- CORS errors: your API must allow the static host origin.",
            "- Wrong content: ensure the Client ID in the manifest matches the expected id.",
          ];

  const supportSection =
    lang === "ru"
      ? ["## Поддержка", "", support]
      : lang === "de"
        ? ["## Support", "", support]
        : ["## Support", "", support];

  return [
    title,
    "",
    ...overview,
    "",
    ...buyerLinks,
    "",
    ...identity,
    "",
    ...contents,
    "",
    ...requirements,
    "",
    ...runLocal,
    "",
    ...deploy,
    "",
    ...localFeatures,
    "",
    ...backendFeatures,
    "",
    ...envVars,
    "",
    ...troubleshooting,
    "",
    ...supportSection,
    "",
    `---`,
    `Deployable ZIP V2 · ${input.mode} · ${new Date().toISOString()}`,
    "",
  ].join("\n");
}
