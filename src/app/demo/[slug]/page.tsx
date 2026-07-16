import { findDemoBySlug } from "@/lib/cloudflare/demo-registry";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ clientId?: string }>;
};

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
  const src = (() => {
    try {
      const url = new URL(record.deploymentUrl);
      if (clientId) url.searchParams.set("clientId", clientId);
      return url.toString();
    } catch {
      return record.deploymentUrl;
    }
  })();

  return (
    <iframe
      title={`CRM Demo ${slug}`}
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
