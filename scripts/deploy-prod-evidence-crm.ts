/**
 * Deploy current react_mvp dist to CF Pages (prod evidence CRM).
 * railway run -- npx tsx scripts/deploy-prod-evidence-crm.ts
 */
import path from "path";

import { deployDistToPages } from "../src/lib/cloudflare/deploy";
import { getSharedPagesProjectName } from "../src/lib/cloudflare/shared-project";
import {
  cleanupClientDist,
  prepareClientDistWithOgImage,
} from "../src/lib/og-image/prepare-client-dist";

async function main() {
  const clientId = "404db994-66e1-4795-b419-d8e8e72bba38";
  const source = path.join(process.cwd(), "artifacts/factory_output/react_mvp/dist");
  const project = getSharedPagesProjectName();
  const staging = await prepareClientDistWithOgImage(clientId, source, {
    clientId,
    sectorId: "car_wash",
    businessType: "car_wash",
    businessName: "Автомойка Local Wash",
    language: "ru",
    city: "Berlin",
    phone: "+49 30 1234567",
    email: "evidence@prod.test",
  });
  try {
    const result = await deployDistToPages(project, staging, {
      previewBranch: "prod-evidence-canonical",
    });
    console.log(JSON.stringify(result, null, 2));
  } finally {
    cleanupClientDist(staging);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
