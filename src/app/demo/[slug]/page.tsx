import { CrmLeadsBridge } from "@/components/crm-leads-bridge";
import { DemoTenantLinksBar } from "@/components/demo-tenant-links-bar";
import { DemoUnpaidBanner } from "@/components/demo-unpaid-banner";
import { resolveDemoAccess } from "@/lib/cloudflare/demo-access";
import { buildDemoEmbedSrc } from "@/lib/cloudflare/demo-embed";
import { findDemoBySlug } from "@/lib/cloudflare/demo-registry";
import {
  buildReadableDemoUrl,
  buildReadablePublicSiteUrl,
} from "@/lib/cloudflare/shared-project";
import { loadClientManifest } from "@/lib/manifest/storage";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ clientId?: string }>;
};

function resolveManifestLanguage(clientId: string): string | undefined {
  const manifest = loadClientManifest(clientId);
  if (!manifest) return undefined;
  const raw = manifest.language ?? manifest.lang;
  return typeof raw === "string" ? raw : undefined;
}

export default async function DemoPage({ params, searchParams }: DemoPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const record = findDemoBySlug(slug);

  if (!record) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Demo not found</h1>
        <p>No CRM Demo is registered for “{slug}”.</p>
      </main>
    );
  }

  const clientId = query.clientId || record.clientId;
  const access = resolveDemoAccess(clientId);
  const unpaid = !access.paid;
  const language = resolveManifestLanguage(clientId);
  /** Outer banner → tariff chooser (not Polar directly). */
  const checkoutUrl = access.checkoutUrl;
  const crmUrl = access.crmUrl || buildReadableDemoUrl(record.slug, clientId);
  const publicSiteUrl =
    access.publicSiteUrl || buildReadablePublicSiteUrl(record.slug);

  const src = buildDemoEmbedSrc(record, clientId);

  // Paid: links bar. Unpaid: paywall banner. Never both.
  const topOffset = unpaid ? 52 : 56;

  const iframeTitle = `CRM Demo ${slug}`;

  return (
    <>
      {unpaid ? (
        <DemoUnpaidBanner clientId={clientId} checkoutUrl={checkoutUrl} language={language} />
      ) : (
        <DemoTenantLinksBar
          publicSiteUrl={publicSiteUrl}
          crmUrl={crmUrl}
          language={language}
        />
      )}
      <CrmLeadsBridge clientId={clientId} slug={slug} iframeTitle={iframeTitle} />
      <iframe
        title={iframeTitle}
        src={src}
        style={{
          position: "fixed",
          top: topOffset,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: `calc(100% - ${topOffset}px)`,
          border: 0,
          margin: 0,
          padding: 0,
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
        allow="clipboard-write"
      />
    </>
  );
}
