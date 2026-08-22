import fs from "fs";
import path from "path";

/**
 * Remove CRM demo paywall / watermark from a static dist before it is packed into
 * a Deployable ZIP. The SPA ships with unpaid-demo UI gated by /api/demo-access;
 * marketplace / owner / paid exports must never show that banner on Netlify.
 */
const PAYWALL_STRING_REPLACEMENTS: Array<[string, string]> = [
  ["Демо-версия. Выберите тариф, чтобы продолжить.", ""],
  ["Demo version. Choose a plan to continue.", ""],
  ["Demo-Version. Wählen Sie einen Plan, um fortzufahren.", ""],
  ["DEMO · €199", ""],
  ["DEMO · €99", ""],
  ['paywallCta:"Выбрать тариф"', 'paywallCta:""'],
  ['paywallCta:"Choose plan"', 'paywallCta:""'],
  ['paywallCta:"Plan wählen"', 'paywallCta:""'],
];

/** Strings that must be gone after strip — builder fails the ZIP if any remain. */
export const FORBIDDEN_PAYWALL_MARKERS = [
  "Демо-версия. Выберите тариф, чтобы продолжить.",
  "Demo version. Choose a plan to continue.",
  "Demo-Version. Wählen Sie einen Plan, um fortzufahren.",
  "DEMO · €199",
  "DEMO · €99",
] as const;

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

function patchBakedManifestPaidFlags(html: string): { content: string; changed: boolean } {
  const marker = "window.__CRM_DEMO_MANIFEST__=";
  const start = html.indexOf(marker);
  if (start === -1) {
    return { content: html, changed: false };
  }

  const jsonStart = start + marker.length;
  if (html[jsonStart] !== "{") {
    return { content: html, changed: false };
  }

  let depth = 0;
  let end = -1;
  for (let i = jsonStart; i < html.length; i += 1) {
    const ch = html[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) {
    return { content: html, changed: false };
  }

  const rawJson = html.slice(jsonStart, end);
  try {
    const parsed = JSON.parse(rawJson) as Record<string, unknown>;
    if (parsed.paid === true && parsed.deployablePaid === true) {
      return { content: html, changed: false };
    }
    parsed.paid = true;
    parsed.deployablePaid = true;
    const nextJson = JSON.stringify(parsed);
    return {
      content: `${html.slice(0, jsonStart)}${nextJson}${html.slice(end)}`,
      changed: true,
    };
  } catch {
    return { content: html, changed: false };
  }
}

export function buildDeployablePaidBootstrap(
  manifestHref = "./client-manifest.json",
  saasOrigin = "https://webstudio-muenchen.com",
): string {
  const href = JSON.stringify(manifestHref);
  const originJson = JSON.stringify(String(saasOrigin || "").trim().replace(/\/$/, "") || "https://webstudio-muenchen.com");
  return `<script>window.__CRM_ZIP_UNLOCKED__=true;window.__CRM_DEPLOYABLE_PAID__=true;window.__CRM_SAAS_ORIGIN__=${originJson};(function(){try{if(window.__CRM_DEMO_MANIFEST__&&typeof window.__CRM_DEMO_MANIFEST__==="object"){window.__CRM_DEMO_MANIFEST__.paid=true;window.__CRM_DEMO_MANIFEST__.deployablePaid=true;}}catch(e0){}try{var u=new URL(window.location.href);if(u.searchParams.get("paid")!=="1"){u.searchParams.set("paid","1");window.history.replaceState(null,"",u.toString());}}catch(e){}try{var origin=window.location.origin&&window.location.origin!=="null"?window.location.origin:"";if(origin)window.__DEPLOYABLE_SITE_URL__=origin;fetch(${href},{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(m){if(!m||typeof m!=="object")return;if(window.__CRM_DEMO_MANIFEST__&&typeof window.__CRM_DEMO_MANIFEST__==="object"){window.__CRM_DEMO_MANIFEST__.paid=true;window.__CRM_DEMO_MANIFEST__.deployablePaid=true;for(var k in m){if(Object.prototype.hasOwnProperty.call(m,k)&&m[k]!=null)window.__CRM_DEMO_MANIFEST__[k]=m[k];}window.__CRM_DEMO_MANIFEST__.paid=true;window.__CRM_DEMO_MANIFEST__.deployablePaid=true;}var s=m.siteUrl||m.publicSiteUrl||m.mvpUrl||"";if(typeof s==="string"&&s.trim()){window.__DEPLOYABLE_SITE_URL__=s.trim();if(window.__CRM_DEMO_MANIFEST__)window.__CRM_DEMO_MANIFEST__.siteUrl=s.trim();}}).catch(function(){});}catch(e){}try{var f=window.fetch.bind(window);window.fetch=function(input,init){var url=typeof input==="string"?input:(input&&input.url)||"";if(String(url).indexOf("/api/demo-access")!==-1){var site=window.__DEPLOYABLE_SITE_URL__||"";return Promise.resolve(new Response(JSON.stringify({paid:true,checkoutUrl:"",crmUrl:site,publicSiteUrl:site}),{status:200,headers:{"Content-Type":"application/json"}}));}return f(input,init);};}catch(e){}})();</script>`;
}

function isCrmSpaHtml(html: string): boolean {
  return html.includes('id="root"') && /assets\//i.test(html);
}

const PAID_BOOT_RE = /<script>window\.__CRM_DEPLOYABLE_PAID__=true;[\s\S]*?<\/script>\s*/g;

function ensurePaidBootstrapInHtml(
  html: string,
  manifestHref: string,
  saasOrigin: string,
): { content: string; changed: boolean } {
  if (!isCrmSpaHtml(html)) {
    return { content: html, changed: false };
  }

  const baked = patchBakedManifestPaidFlags(html);
  html = baked.content;
  let changed = baked.changed;

  const paidBoot = buildDeployablePaidBootstrap(manifestHref, saasOrigin);
  const hasLatestBoot =
    html.includes("__CRM_DEPLOYABLE_PAID__") &&
    html.includes("__CRM_ZIP_UNLOCKED__") &&
    html.includes("__CRM_SAAS_ORIGIN__") &&
    html.includes('searchParams.set("paid"') &&
    html.includes("__DEPLOYABLE_SITE_URL__") &&
    html.includes("__CRM_DEMO_MANIFEST__.paid=true") &&
    html.includes("/api/demo-access");

  if (hasLatestBoot) {
    return { content: html, changed };
  }

  html = html.replace(PAID_BOOT_RE, "");
  html = html.replace(/<script>window\.__CRM_ZIP_UNLOCKED__[\s\S]*?<\/script>\s*/g, "");

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

export function findRemainingPaywallMarkers(distDir: string): string[] {
  const hits: string[] = [];
  if (!fs.existsSync(distDir)) return hits;

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(js|mjs|cjs|html)$/i.test(entry.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const marker of FORBIDDEN_PAYWALL_MARKERS) {
        if (text.includes(marker)) {
          hits.push(`${path.relative(distDir, full).replace(/\\/g, "/")}: ${marker}`);
        }
      }
    }
  };

  walk(distDir);
  return hits;
}

export function stripDemoPaywallFromDist(distDir: string, saasOrigin?: string): string[] {
  const touched: string[] = [];
  if (!fs.existsSync(distDir)) return touched;
  const origin = String(saasOrigin || "").trim().replace(/\/$/, "") || "https://webstudio-muenchen.com";

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
        const result = ensurePaidBootstrapInHtml(next, manifestHref, origin);
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
