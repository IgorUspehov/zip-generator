import { buildDemoEmbedSrc } from "@/lib/cloudflare/demo-embed";
import { findDemoByShortId } from "@/lib/cloudflare/demo-registry";

type ShortDemoPageProps = {
  params: Promise<{ shortId: string }>;
};

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

  const src = buildDemoEmbedSrc(record);

  return (
    <iframe
      title={`CRM Demo ${shortId}`}
      src={src}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        margin: 0,
        padding: 0,
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      allow="clipboard-write"
    />
  );
}
