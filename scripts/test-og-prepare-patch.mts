import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  cleanupClientDist,
  prepareClientDistWithOgImage,
} from "../src/lib/og-image/prepare-client-dist.ts";
import { getOgImagePath } from "../src/lib/image-library/index.ts";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distPath = path.join(projectRoot, "mvp-template/dist");

const cases = [
  { clientId: "test-og-real-estate", businessType: "real_estate", businessName: "Test Realty" },
  { clientId: "test-og-car-dealer", businessType: "car_dealer", businessName: "Test Motors" },
] as const;

for (const testCase of cases) {
  const stagingDir = await prepareClientDistWithOgImage(testCase.clientId, distPath, {
    businessName: testCase.businessName,
    businessType: testCase.businessType,
  });

  try {
    const html = fs.readFileSync(path.join(stagingDir, "index.html"), "utf8");
    const ogImageUrl = getOgImagePath(testCase.businessType);
    const ogFile = path.join(stagingDir, ogImageUrl.replace(/^\//, ""));

    if (!html.includes(`property="og:image" content="${ogImageUrl}"`)) {
      throw new Error(`og:image meta mismatch for ${testCase.businessType}`);
    }
    if (html.includes("og-preview.png")) {
      throw new Error(`still references og-preview.png for ${testCase.businessType}`);
    }
    if (html.includes("Ваш персональный") || html.includes("готов за минуты")) {
      throw new Error(`russian og text for ${testCase.businessType}`);
    }
    if (!fs.existsSync(ogFile)) {
      throw new Error(`missing staged og file: ${ogFile}`);
    }
  } finally {
    cleanupClientDist(stagingDir);
  }

  console.log(`[PASS] patched index.html og meta — ${testCase.businessType}`);
}
