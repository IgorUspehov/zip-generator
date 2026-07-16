/** Allowed parent for CRM Demo Live Preview iframe. */
export const RAILWAY_FRAME_ANCESTOR = "https://saas-mvp-funnel-production.up.railway.app";

/**
 * True when Pages edge serves a real response that Railway may embed:
 * HTTP 2xx, no blocking X-Frame-Options, CSP frame-ancestors includes Railway.
 */
export function isPagesIframeEmbedReady(response: {
  ok: boolean;
  headers: Headers;
}): boolean {
  if (!response.ok) {
    return false;
  }

  const xFrameOptions = response.headers.get("x-frame-options");
  if (xFrameOptions && /deny|sameorigin/i.test(xFrameOptions)) {
    return false;
  }

  const csp = response.headers.get("content-security-policy") ?? "";
  if (!/frame-ancestors/i.test(csp)) {
    return false;
  }

  return csp.includes(RAILWAY_FRAME_ANCESTOR);
}
