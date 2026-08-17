import { CrmLeadsBridge } from "@/components/crm-leads-bridge";
import { DemoSiteFrame } from "@/components/demo-site-frame";
import { DemoTenantLinksBar } from "@/components/demo-tenant-links-bar";
import { resolveDemoAccess } from "@/lib/cloudflare/demo-access";
import { buildDemoEmbedSrc } from "@/lib/cloudflare/demo-embed";
import { findDemoBySlug } from "@/lib/cloudflare/demo-registry";
import { buildReadablePublicSiteUrl } from "@/lib/cloudflare/shared-project";
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
        <p>No Website + CRM + Booking is registered for “{slug}”.</p>
      </main>
    );
  }

  const clientId = query.clientId || record.clientId;
  const access = resolveDemoAccess(clientId);
  const unpaid = !access.paid;
  const language = resolveManifestLanguage(clientId);
  /** Outer banner → tariff chooser (not Polar directly). */
  const checkoutUrl = access.checkoutUrl;
  const publicSiteUrl =
    access.publicSiteUrl || buildReadablePublicSiteUrl(record.slug);

  const src = buildDemoEmbedSrc(record, clientId);
  const iframeTitle = `Website + CRM + Booking ${slug}`;

  return (
    <>
      <CrmLeadsBridge clientId={clientId} slug={slug} iframeTitle={iframeTitle} />
      <DemoSiteFrame
        unpaid={unpaid}
        clientId={clientId}
        checkoutUrl={checkoutUrl}
        language={language}
        iframeSrc={src}
        iframeTitle={iframeTitle}
        paidBar={
          <DemoTenantLinksBar publicSiteUrl={publicSiteUrl} language={language} />
        }
      />
    </>
  );
}
