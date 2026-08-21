import fs from "fs";
import path from "path";

/**
 * Remove CRM demo paywall / watermark from a static dist before it is packed into
 * a Deployable ZIP. The SPA ships with unpaid-demo UI gated by /api/demo-access;
 * marketplace / owner exports must never show that banner on Netlify.
 */
const PAYWALL_STRING_REPLACEMENTS: Array<[string, string]> = [
  ["Демо-версия. Выберите тариф, чтобы продолжить.", ""],
  ["Demo version. Choose a plan to continue.", ""],
  ["Demo-Version. Wählen Sie einen Plan, um fortzufahren.", ""],
  ["DEMO · €199", ""],
  ["DEMO · €99", ""],
];

/**
 * CRM dashboard "Website" row only accepts funnel `/demo/` URLs. In a static
 * Deployable ZIP the real site URL is the host itself (or siteUrl from manifest).
 */
function patchShareableSiteUrlLogic(content: string): { content: string; changed: boolean } {
  let next = content;
  let changed = false;

  const demoGate = '||!c.pathname.includes("/demo/")';
  if (next.includes(demoGate)) {
    next = next.split(demoGate).join("");
    changed = true;
  }

  const siteGate = '||!a.pathname.includes("/site/")';
  if (next.includes(siteGate)) {
    next = next.split(siteGate).join("");
    changed = true;
  }

  const kvStart = "function Kv(e,n,t){const r=String(t||\"\").trim(),s=(a=>{";
  const kvPatched =
    'function Kv(e,n,t){try{var m=typeof window!=="undefined"&&(window.__DEPLOYABLE_SITE_URL__||(window.__CRM_DEMO_MANIFEST__&&window.__CRM_DEMO_MANIFEST__.siteUrl)||(window.__CRM_DEMO_MANIFEST__&&window.__CRM_DEMO_MANIFEST__.publicSiteUrl));if(m&&String(m).trim())return String(m).trim()}catch(x){}const r=String(t||"").trim(),s=(a=>{';
  if (next.includes(kvStart) && !next.includes("__DEPLOYABLE_SITE_URL__")) {
    next = next.split(kvStart).join(kvPatched);
    changed = true;
  }

  return { content: next, changed };
}

function stripPaywallFromJs(content: string): { content: string; changed: boolean } {
  let next = content;
  let changed = false;

  for (const [from, to] of PAYWALL_STRING_REPLACEMENTS) {
    if (!next.includes(from)) continue;
    next = next.split(from).join(to);
    changed = true;
  }

  if (next.includes("/api/demo-access/")) {
    const patched = next.replaceAll("/api/demo-access/", "/api/demo-access-disabled/");
    if (patched !== next) {
      next = patched;
      changed = true;
    }
  }

  const siteUrlPatch = patchShareableSiteUrlLogic(next);
  next = siteUrlPatch.content;
  changed = changed || siteUrlPatch.changed;

  return { content: next, changed };
}

/**
 * Injected into CRM SPA index.html before boot: mark export as paid and
 * short-circuit any leftover demo-access fetch.
 */
export function buildDeployablePaidBootstrap(manifestHref = "./client-manifest.json"): string {
  const href = JSON.stringify(manifestHref);
  return `<script>window.__CRM_DEPLOYABLE_PAID__=true;(function(){try{var u=new URL(window.location.href);if(u.searchParams.get("paid")!=="1"){u.searchParams.set("paid","1");window.history.replaceState(null,"",u.toString());}}catch(e){}try{var origin=window.location.origin&&window.location.origin!=="null"?window.location.origin:"";if(origin)window.__DEPLOYABLE_SITE_URL__=origin;fetch(${href},{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(m){if(!m||typeof m!=="object")return;var s=m.siteUrl||m.publicSiteUrl||m.mvpUrl||"";if(typeof s==="string"&&s.trim()){window.__DEPLOYABLE_SITE_URL__=s.trim();if(window.__CRM_DEMO_MANIFEST__&&typeof window.__CRM_DEMO_MANIFEST__==="object"){window.__CRM_DEMO_MANIFEST__.siteUrl=s.trim();}}}).catch(function(){});}catch(e){}try{var f=window.fetch.bind(window);window.fetch=function(input,init){var url=typeof input==="string"?input:(input&&input.url)||"";if(String(url).indexOf("/api/demo-access")!==-1){var site=window.__DEPLOYABLE_SITE_URL__||"";return Promise.resolve(new Response(JSON.stringify({paid:true,checkoutUrl:"",crmUrl:site,publicSiteUrl:site}),{status:200,headers:{"Content-Type":"application/json"}}));}return f(input,init);};}catch(e){}})();</script>`;
}

function isCrmSpaHtml(html: string): boolean {
  return html.includes('id="root"') && /assets\//i.test(html);
}

function ensurePaidBootstrapInHtml(
  html: string,
  manifestHref: string,
): { content: string; changed: boolean } {
  if (!isCrmSpaHtml(html)) {
    return { content: html, changed: false };
  }
  if (
    html.includes("__CRM_DEPLOYABLE_PAID__") &&
    html.includes('searchParams.set("paid"') &&
    html.includes("/api/demo-access")
  ) {
    return { content: html, changed: false };
  }
  // Replace a weaker prior bootstrap with the full one.
  if (html.includes("__CRM_DEPLOYABLE_PAID__") && !html.includes("__DEPLOYABLE_SITE_URL__")) {
    html = html.replace(
      /<script>window\.__CRM_DEPLOYABLE_PAID__=true;[\s\S]*?<\/script>\s*/,
      "",
    );
  }
  if (html.includes('searchParams.set("paid"') && html.includes("__DEPLOYABLE_SITE_URL__")) {
    return { content: html, changed: false };
  }
  const paidBoot = buildDeployablePaidBootstrap(manifestHref);
  if (html.includes('searchParams.set("paid"') && html.includes("__DEPLOYABLE_SITE_URL__")) {
    return { content: html, changed: false };
  }
  const rootIdx = html.indexOf('<div id="root">');
  if (rootIdx !== -1) {
    return {
      content: `${html.slice(0, rootIdx)}${paidBoot}\n    ${html.slice(rootIdx)}`,
      changed: true,
    };
  }
  if (html.includes("</body>")) {
    return { content: html.replace("</body>", `${paidBoot}\n</body>`), changed: true };
  }
  return { content: `${html}\n${paidBoot}\n`, changed: true };
}

export function stripDemoPaywallFromDist(distDir: string): string[] {
  const touched: string[] = [];
  if (!fs.existsSync(distDir)) return touched;

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(js|mjs|cjs|html)$/i.test(entry.name)) continue;

      const original = fs.readFileSync(full, "utf8");
      let next = original;
      let changed = false;

      if (/\.(js|mjs|cjs)$/i.test(entry.name)) {
        const result = stripPaywallFromJs(next);
        next = result.content;
        changed = result.changed;
      }

      if (entry.name.toLowerCase() === "index.html") {
        const relDir = path.relative(distDir, dir).replace(/\\/g, "/");
        const manifestHref =
          relDir && relDir !== "." ? "../client-manifest.json" : "./client-manifest.json";
        const result = ensurePaidBootstrapInHtml(next, manifestHref);
        next = result.content;
        changed = changed || result.changed;
      }

      if (changed && next !== original) {
        fs.writeFileSync(full, next, "utf8");
        touched.push(path.relative(distDir, full).replace(/\\/g, "/"));
      }
    }
  };

  walk(distDir);
  if (touched.length) {
    console.info("[deployable-zip] stripped demo paywall from dist", { files: touched.length });
  }
  return touched;
}
