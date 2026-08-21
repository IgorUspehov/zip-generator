import type { Metadata } from "next";

import { CrmLeadsBridge } from "@/components/crm-leads-bridge";
import { DemoSiteFrame } from "@/components/demo-site-frame";
import { DemoTenantLinksBar } from "@/components/demo-tenant-links-bar";
import { restoreDemoByClientId } from "@/lib/billing/paid-tenant";
import { resolveDemoAccess } from "@/lib/cloudflare/demo-access";
import { buildDemoEmbedSrc } from "@/lib/cloudflare/demo-embed";
import { hydrateDemoRecord } from "@/lib/cloudflare/demo-registry";
import { buildReadablePublicSiteUrl } from "@/lib/cloudflare/shared-project";
import { loadClientManifest } from "@/lib/manifest/storage";
import { buildPublicSiteMetadata } from "@/lib/site/public-site-metadata";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ clientId?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  return buildPublicSiteMetadata(slug, "demo", undefined, {
    clientId: query.clientId,
  });
}

function resolveManifestLanguage(clientId: string): string | undefined {
  const manifest = loadClientManifest(clientId);
  if (!manifest) return undefined;
  const raw = manifest.language ?? manifest.lang;
  return typeof raw === "string" ? raw : undefined;
}

export default async function DemoPage({ params, searchParams }: DemoPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  let record = await hydrateDemoRecord({ slug, clientId: query.clientId });

  if (!record) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Demo not found</h1>
        <p>No Website + CRM + Booking is registered for “{slug}”.</p>
      </main>
    );
  }

  const clientId = query.clientId || record.clientId;
  // Registry lives in /tmp on Render — re-check Firestore paid after every deploy wipe.
  if (!record.paid && clientId) {
    record = (await restoreDemoByClientId(clientId)) || record;
  }
  const access = resolveDemoAccess(clientId);
  const language = resolveManifestLanguage(clientId);
  const publicSiteUrl =
    access.publicSiteUrl || buildReadablePublicSiteUrl(record.slug);

  const src = buildDemoEmbedSrc(record, clientId);
  const iframeTitle = `Website + CRM + Booking ${slug}`;

  return (
    <>
      <CrmLeadsBridge clientId={clientId} slug={slug} iframeTitle={iframeTitle} />
      <DemoSiteFrame
        clientId={clientId}
        language={language}
        iframeSrc={src}
        iframeTitle={iframeTitle}
        paidBar={
          <DemoTenantLinksBar publicSiteUrl={publicSiteUrl} language={language} clientId={clientId} />
        }
      />
    </>
  );
}
