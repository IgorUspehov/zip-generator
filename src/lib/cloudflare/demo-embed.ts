import type { DemoSiteRecord } from "@/lib/cloudflare/demo-registry";

/** Build the Cloudflare Pages iframe src with clientId for CRM bootstrap. */
export function buildDemoEmbedSrc(
  record: Pick<DemoSiteRecord, "deploymentUrl" | "clientId">,
  clientIdOverride?: string,
): string {
  const clientId = clientIdOverride || record.clientId;
  try {
    const url = new URL(record.deploymentUrl);
    if (clientId) url.searchParams.set("clientId", clientId);
    return url.toString();
  } catch {
    return record.deploymentUrl;
  }
}
