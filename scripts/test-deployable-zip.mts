/**
 * Build + inspect a Deployable ZIP V2 for a real (or fixture) clientId.
 *
 * Usage:
 *   npx tsx scripts/test-deployable-zip.mts
 *   npx tsx scripts/test-deployable-zip.mts --clientId=<uuid>
 *
 * If client-dists/{id} is missing, creates a fixture snapshot from
 * client-template/dist + data/manifests/{id}.json (or a synthetic manifest).
 */

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { prepareClientDistWithOgImage, cleanupClientDist } from "../src/lib/og-image/prepare-client-dist";
import { loadClientManifest, saveClientManifest } from "../src/lib/manifest/storage";
import {
  persistClientDistSnapshot,
  resolveClientDistPath,
  clientDistExists,
} from "../src/lib/site-delivery/dist-store";
import { resolveMvpDistPath } from "../src/lib/cloudflare/deploy";
import { buildDeployableZip, DeployableZipError } from "../src/lib/deployable-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function parseArgs(argv: string[]): { clientId?: string } {
  let clientId: string | undefined;
  for (const arg of argv) {
    if (arg.startsWith("--clientId=")) clientId = arg.slice("--clientId=".length).trim();
  }
  return { clientId };
}

function listManifestClientIds(): string[] {
  const dir = path.join(ROOT, "data", "manifests");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ASSERT: ${message}`);
  }
}

function listZipEntries(zipPath: string): string[] {
  const listing = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" });
  return listing
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((name) => !name.endsWith("/"));
}

async function ensureClientDist(clientId: string): Promise<void> {
  if (!clientDistExists(clientId)) {
    let manifest = loadClientManifest(clientId);
    if (!manifest) {
      manifest = {
        clientId,
        businessName: "Deployable ZIP Test Business",
        businessType: "logistics_delivery",
        language: "en",
      };
      saveClientManifest(clientId, manifest);
      console.log("[test] wrote synthetic manifest");
    }

    const sourceDist = resolveMvpDistPath();
    console.log("[test] preparing fixture dist from", sourceDist);
    const staging = await prepareClientDistWithOgImage(
      clientId,
      sourceDist,
      manifest as {
        businessName?: unknown;
        businessType?: unknown;
        [key: string]: unknown;
      },
    );
    try {
      persistClientDistSnapshot(clientId, staging);
      console.log("[test] persisted fixture client-dists", resolveClientDistPath(clientId));
    } finally {
      cleanupClientDist(staging);
    }
  } else {
    console.log("[test] using existing client-dists snapshot", resolveClientDistPath(clientId));
  }

  // Always inject secrets into server manifest + dist so sanitizer assertions are meaningful.
  const existing = loadClientManifest(clientId) || { clientId };
  saveClientManifest(clientId, {
    ...existing,
    leadsReadSecret: "test-leads-read-secret-should-never-appear-in-zip-0123456789abcdef",
    polarAccessToken: "polar_test_token_should_be_stripped",
  });

  const distPath = resolveClientDistPath(clientId);
  fs.writeFileSync(path.join(distPath, ".env"), "POLAR_WEBHOOK_SECRET=super-secret\n", "utf8");
  fs.writeFileSync(
    path.join(distPath, "service-account.json"),
    JSON.stringify(
      {
        type: "service_account",
        private_key: "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----\n",
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log("[test] planted secret files + manifest secrets for sanitizer check");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const clientId =
    args.clientId || listManifestClientIds()[0] || "00000000-0000-4000-8000-000000000001";

  console.log("=== Deployable ZIP V2 test ===");
  console.log("clientId:", clientId);

  await ensureClientDist(clientId);

  const result = await buildDeployableZip({
    clientId,
    mode: "internal_test",
  });

  const outDir = path.join(ROOT, "tmp", "deployable-zip-test");
  fs.mkdirSync(outDir, { recursive: true });
  const zipPath = path.join(outDir, result.filename);
  fs.writeFileSync(zipPath, result.buffer);
  console.log("[test] wrote ZIP", zipPath, `(${result.buffer.length} bytes)`);

  const extractDir = path.join(outDir, "extracted", clientId);
  fs.rmSync(extractDir, { recursive: true, force: true });
  fs.mkdirSync(extractDir, { recursive: true });
  execFileSync("unzip", ["-qo", zipPath, "-d", extractDir]);

  const entryNames = listZipEntries(zipPath);
  console.log("[test] entries:", entryNames.length);
  console.log("[test] sample entries:", entryNames.slice(0, 15));

  assert(entryNames.includes("index.html"), "ZIP must contain index.html (dist)");
  assert(entryNames.includes("README.md"), "ZIP must contain README.md");
  assert(entryNames.includes("client-manifest.json"), "ZIP must contain client-manifest.json");
  assert(
    entryNames.some((name) => name.startsWith("assets/")),
    "ZIP must contain assets/",
  );

  const readme = fs.readFileSync(path.join(extractDir, "README.md"), "utf8");
  assert(readme.includes("Deployable ZIP"), "README title");
  assert(
    /external backend|externes Backend|внешнего backend/i.test(readme),
    "README must document backend-dependent features",
  );
  assert(
    /webstudio-muenchen\.com/i.test(readme),
    "README must disclose default SaaS API host dependency",
  );
  assert(readme.includes(clientId), "README must include clientId");

  const manifestRaw = fs.readFileSync(path.join(extractDir, "client-manifest.json"), "utf8");
  const manifest = JSON.parse(manifestRaw) as Record<string, unknown>;
  assert(
    String(manifest.clientId || "") === clientId || String(manifest.client_id || "") === clientId,
    "manifest clientId must match",
  );
  assert(!("leadsReadSecret" in manifest), "leadsReadSecret must not be in ZIP manifest");
  assert(!("polarAccessToken" in manifest), "polarAccessToken must not be in ZIP manifest");
  assert(!manifestRaw.includes("should-never-appear"), "secret values must not appear in manifest");

  assert(!entryNames.some((n) => /(^|\/)\.env(\.|$)/i.test(n)), ".env must be excluded");
  assert(
    !entryNames.some((n) => /service-account/i.test(n)),
    "service-account file must be excluded",
  );

  const joinedSample = `${entryNames.join("\n")}\n${readme}\n${manifestRaw}`;
  assert(!/BEGIN PRIVATE KEY/.test(joinedSample), "no private keys in inspected content");
  assert(!/POLAR_WEBHOOK_SECRET=super-secret/.test(joinedSample), "planted .env secret not present");

  assert(result.isolation.ok, `isolation must be ok: ${JSON.stringify(result.isolation)}`);
  assert(
    String(result.isolation.manifestClientId || "") === clientId,
    "isolation manifestClientId mismatch",
  );

  for (const rel of [
    "src/app/api/download-site/route.ts",
    "src/app/api/download-zip/route.ts",
    "src/app/api/admin/download-zip/route.ts",
  ]) {
    assert(fs.existsSync(path.join(ROOT, rel)), `legacy route still present: ${rel}`);
  }

  console.log("\n=== Security report ===");
  console.log(JSON.stringify(result.security, null, 2));
  console.log("\n=== Isolation report ===");
  console.log(JSON.stringify(result.isolation, null, 2));

  console.log("\n=== PASS ===");
  console.log("ZIP:", zipPath);
  console.log("Extracted:", extractDir);
}

main().catch((error) => {
  if (error instanceof DeployableZipError) {
    console.error("FAIL", error.code, error.message);
  } else {
    console.error("FAIL", error);
  }
  process.exitCode = 1;
});
