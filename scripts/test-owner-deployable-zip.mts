/**
 * OWNER Deployable ZIP auth + isolation checks.
 *
 * Usage:
 *   npx tsx scripts/test-owner-deployable-zip.mts
 */

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { GET as ownerDeployableZipGet } from "../src/app/api/owner/deployable-zip/route";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionValue,
  createAdminSession,
} from "../src/lib/admin/session";
import { clientDistExists, resolveClientDistPath } from "../src/lib/site-delivery/dist-store";
import { buildDeployableZip } from "../src/lib/deployable-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERT: ${message}`);
}

function listClientDistIds(): string[] {
  const root = path.join(ROOT, "data", "client-dists");
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(root, id, "dist", "index.html")));
}

function sessionCookie(clientId: string, email = "owner-test@example.com"): string {
  const session = createAdminSession(clientId, email);
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(buildAdminSessionValue(session))}`;
}

async function main(): Promise<void> {
  console.log("=== OWNER deployable ZIP tests ===");

  const clientIds = listClientDistIds();
  assert(clientIds.length > 0, "Need at least one client-dists snapshot (run npm run test:deployable-zip first)");
  const clientA = clientIds[0]!;
  const clientB = "ffffffff-ffff-4fff-8fff-ffffffffffff";
  assert(clientDistExists(clientA), `dist missing for ${clientA}`);
  console.log("clientA:", clientA);
  console.log("foreign clientB (should be ignored):", clientB);

  // 1) Unauthorized without cookie
  {
    const res = await ownerDeployableZipGet(
      new Request("http://localhost/api/owner/deployable-zip"),
    );
    assert(res.status === 401, `expected 401 without session, got ${res.status}`);
    console.log("PASS: no session → 401");
  }

  // 2) Session clientId wins over query clientId
  {
    const res = await ownerDeployableZipGet(
      new Request(
        `http://localhost/api/owner/deployable-zip?clientId=${encodeURIComponent(clientB)}`,
        { headers: { cookie: sessionCookie(clientA) } },
      ),
    );
    assert(res.status === 200, `expected 200 for owner session, got ${res.status}`);
    const headerClientId = res.headers.get("X-Deployable-Zip-Client-Id");
    assert(headerClientId === clientA, `ZIP clientId must be session client; got ${headerClientId}`);
    assert(res.headers.get("X-Deployable-Zip-Mode") === "owner", "mode header must be owner");
    const buf = Buffer.from(await res.arrayBuffer());
    assert(buf.length > 1000, "ZIP buffer too small");

    const outDir = path.join(ROOT, "tmp", "owner-zip-test");
    fs.mkdirSync(outDir, { recursive: true });
    const zipPath = path.join(outDir, `owner-${clientA}.zip`);
    fs.writeFileSync(zipPath, buf);
    const extractDir = path.join(outDir, "extracted");
    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.mkdirSync(extractDir, { recursive: true });
    execFileSync("unzip", ["-qo", zipPath, "-d", extractDir]);

    const entries = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    assert(entries.includes("index.html"), "index.html");
    assert(entries.includes("README.md"), "README.md");
    assert(entries.includes("client-manifest.json"), "client-manifest.json");

    const readme = fs.readFileSync(path.join(extractDir, "README.md"), "utf8");
    assert(/Owner|владельца|Owner-Export/i.test(readme), "README should reflect owner mode");
    assert(readme.includes(clientA), "README includes session clientId");
    assert(!readme.includes(clientB), "README must not mention foreign query clientId");

    const manifest = JSON.parse(
      fs.readFileSync(path.join(extractDir, "client-manifest.json"), "utf8"),
    ) as Record<string, unknown>;
    assert(
      String(manifest.clientId || "") === clientA || String(manifest.client_id || "") === clientA,
      "manifest clientId isolation",
    );
    assert(!("leadsReadSecret" in manifest), "no leadsReadSecret in ZIP");

    console.log("PASS: session clientId used; foreign query clientId ignored");
    console.log("PASS: ZIP contents + README owner mode + no secrets");
  }

  // 3) Builder directly with mode=owner
  {
    const result = await buildDeployableZip({ clientId: clientA, mode: "owner" });
    assert(result.mode === "owner", "builder mode");
    assert(result.isolation.ok, "isolation ok");
    assert(result.distPath === resolveClientDistPath(clientA), "dist path under client-dists");
    console.log("PASS: buildDeployableZip mode=owner");
  }

  // 4) Legacy routes still present (compatibility)
  for (const rel of [
    "src/app/api/download-site/route.ts",
    "src/app/api/download-zip/route.ts",
    "src/app/api/admin/download-zip/route.ts",
  ]) {
    assert(fs.existsSync(path.join(ROOT, rel)), `legacy route present: ${rel}`);
  }
  console.log("PASS: legacy download endpoints untouched");

  console.log("\n=== OWNER PASS ===");
}

main().catch((error) => {
  console.error("FAIL", error);
  process.exitCode = 1;
});
