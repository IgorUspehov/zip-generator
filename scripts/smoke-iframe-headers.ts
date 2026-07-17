import { deployToCloudflarePages, resolveMvpDistPath } from "../src/lib/cloudflare/deploy";
import { cleanupClientDist, prepareClientDistWithOgImage } from "../src/lib/og-image/prepare-client-dist";

async function main() {
  const source = resolveMvpDistPath();
  const clientId = `iframe-fix-${Date.now()}`;
  const staging = await prepareClientDistWithOgImage(
    clientId,
    source,
    { businessName: "Iframe Test", businessType: "restaurant" },
  );

  try {
    const result = await deployToCloudflarePages(clientId, staging);
    const url = `${result.siteUrl}/?clientId=${clientId}`;
    console.log("RESULT", JSON.stringify(result));
    console.log("PREVIEW_URL", url);

    let lastStatus = 0;
    let csp: string | null = null;
    let xfo: string | null = null;
    let contentType: string | null = null;
    let bodyHead = "";

    for (let attempt = 1; attempt <= 8; attempt++) {
      await new Promise((r) => setTimeout(r, attempt === 1 ? 2000 : 4000));
      const response = await fetch(url, { headers: { Accept: "text/html" }, redirect: "follow" });
      lastStatus = response.status;
      csp = response.headers.get("content-security-policy");
      xfo = response.headers.get("x-frame-options");
      contentType = response.headers.get("content-type");
      const body = await response.text();
      bodyHead = body.slice(0, 160).replace(/\n/g, " ");
      console.log(`PROBE_${attempt}`, { status: lastStatus, xfo, csp, contentType });
      if (response.ok && csp?.includes("frame-ancestors")) break;
    }

    console.log("DIRECT_HTTP", lastStatus);
    console.log("CONTENT_TYPE", contentType);
    console.log("X_FRAME_OPTIONS", xfo);
    console.log("CSP", csp);
    console.log("FRAME_ANCESTORS", csp?.match(/frame-ancestors[^;]*/i)?.[0] ?? null);
    console.log("BODY_HEAD", bodyHead);
    if (!csp?.includes("saas-mvp-funnel-production.up.railway.app")) {
      throw new Error("CSP frame-ancestors for Railway not present on deployed site");
    }
    if (xfo && /deny|sameorigin/i.test(xfo)) {
      throw new Error(`Blocking X-Frame-Options still present: ${xfo}`);
    }
  } finally {
    cleanupClientDist(staging);
  }
}

main().catch((error) => {
  console.error("SMOKE_FAILED", error);
  process.exit(1);
});
