/**
 * Redeploy shared CRM SPA (react_mvp dist) to Cloudflare Pages production.
 * Usage: railway run -- npx tsx scripts/redeploy-shared-crm-pages.ts
 */
import path from "path";

import {
  deployDistToPages,
  ensureSharedPagesProject,
} from "../src/lib/cloudflare/deploy";

async function main() {
  const source = path.join(process.cwd(), "artifacts/factory_output/react_mvp/dist");
  const project = await ensureSharedPagesProject();
  console.log("project", project);
  const result = await deployDistToPages(project.projectName, source);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
