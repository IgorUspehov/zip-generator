import path from "path";

import { deployDistToPages } from "../src/lib/cloudflare/deploy";
import {
  findDemoByClientId,
  upsertDemoRecord,
} from "../src/lib/cloudflare/demo-registry";
import { getSharedPagesProjectName } from "../src/lib/cloudflare/shared-project";
import { loadClientManifest } from "../src/lib/manifest/storage";
import {
  cleanupClientDist,
  prepareClientDistWithOgImage,
} from "../src/lib/og-image/prepare-client-dist";

const clients = [
  "b475392b-3c84-4dca-82b4-b6cf780f1e31",
  "03de11de-f488-45e1-a967-550beaca73dc",
];

async function main() {
  const source = path.join(process.cwd(), "artifacts/factory_output/react_mvp/dist");
  const project = getSharedPagesProjectName();

  for (const clientId of clients) {
    const manifest = loadClientManifest(clientId);
    if (!manifest) {
      console.error("no manifest", clientId);
      continue;
    }
    const existing = findDemoByClientId(clientId);
    console.log("preparing", clientId, existing?.slug);
    const staging = await prepareClientDistWithOgImage(
      clientId,
      source,
      manifest as Record<string, unknown>,
    );
    try {
      const result = await deployDistToPages(project, staging, {
        previewBranch: existing?.slug || clientId.slice(0, 8),
      });
      console.log("deployed", clientId, result.deploymentUrl, result.deploymentId);
      if (existing) {
        upsertDemoRecord({
          ...existing,
          deploymentId: result.deploymentId,
          deploymentUrl: result.deploymentUrl,
          deployedAt: new Date().toISOString(),
          deleteAt: new Date(Date.now() + 365 * 864e5).toISOString(),
          paid: true,
        });
      }
    } finally {
      cleanupClientDist(staging);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
