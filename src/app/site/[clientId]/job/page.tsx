import { redirect } from "next/navigation";

import { JobForm } from "@/components/public-site/job-form";
import { resolvePublicSiteParam } from "@/lib/cloudflare/resolve-public-site";
import { normalizeLeadLang } from "@/lib/leads/niche-mode";
import { loadClientManifest } from "@/lib/manifest/storage";
import { listVacancies } from "@/lib/vacancies/store";

type JobPageProps = {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function PublicJobPage({
  params,
  searchParams,
}: JobPageProps) {
  const { clientId: raw } = await params;
  const query = await searchParams;
  const resolved = resolvePublicSiteParam(raw || "");

  if (!resolved) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
        <div>
          <h1 className="text-2xl font-bold">Site not found</h1>
          <p className="mt-2 text-slate-400">Unknown or expired site link.</p>
        </div>
      </main>
    );
  }

  const langHint = query.lang ? normalizeLeadLang(query.lang) : undefined;
  if (resolved.shouldRedirectToSlug) {
    const qs = langHint ? `?lang=${encodeURIComponent(langHint)}` : "";
    redirect(`/site/${encodeURIComponent(resolved.siteSlug)}/job${qs}`);
  }

  const { clientId } = resolved;
  const manifest = loadClientManifest(clientId) || {};
  const lang = normalizeLeadLang(
    query.lang || String(manifest.language || manifest.lang || "de"),
  );

  const vacancyRecords = await listVacancies(clientId);
  const vacancies = vacancyRecords.map((item) => ({
    id: item.id,
    title: item.title,
    salary: item.salary || "",
  }));

  return (
    <main className="flex min-h-svh items-start justify-center bg-slate-950 px-6 py-12 text-white">
      <JobForm
        clientId={clientId}
        language={lang}
        vacancies={vacancies}
        accent="#ea580c"
      />
    </main>
  );
}
