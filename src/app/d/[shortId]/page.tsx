import { DemoUnpaidBanner } from "@/components/demo-unpaid-banner";
import { buildCrmDemoCheckoutUrl, resolveDemoAccess } from "@/lib/cloudflare/demo-access";
import { buildDemoEmbedSrc } from "@/lib/cloudflare/demo-embed";
import { findDemoByShortId } from "@/lib/cloudflare/demo-registry";
import { loadClientManifest } from "@/lib/manifest/storage";

type ShortDemoPageProps = {
  params: Promise<{ shortId: string }>;
};

function resolveManifestLanguage(clientId: string): string | undefined {
  const manifest = loadClientManifest(clientId);
  if (!manifest) return undefined;
  const raw = manifest.language ?? manifest.lang;
  return typeof raw === "string" ? raw : undefined;
}

export default async function ShortDemoPage({ params }: ShortDemoPageProps) {
  const { shortId } = await params;
  const record = findDemoByShortId(shortId);

  if (!record) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Demo not found</h1>
        <p>No CRM Demo is registered for “{shortId}”.</p>
      </main>
    );
  }

  const access = resolveDemoAccess(record.clientId);
  const unpaid = !access.paid;
  const language = resolveManifestLanguage(record.clientId);
  const checkoutUrl = buildCrmDemoCheckoutUrl(record.clientId);
  const src = buildDemoEmbedSrc(record);
  const bannerOffset = unpaid ? 52 : 0;

  return (
    <>
      {unpaid ? (
        <DemoUnpaidBanner
          clientId={record.clientId}
          checkoutUrl={checkoutUrl}
          language={language}
        />
      ) : null}
      <iframe
        title={`CRM Demo ${shortId}`}
        src={src}
        style={{
          position: "fixed",
          top: bannerOffset,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: `calc(100% - ${bannerOffset}px)`,
          border: 0,
          margin: 0,
          padding: 0,
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        allow="clipboard-write"
      />
    </>
  );
}
