#!/usr/bin/env node
/**
 * Deploy Firestore security rules to mvp-factory-crm.
 *
 * Primary: `firebase deploy --only firestore:rules` (requires IAM below).
 * Fallback: Firebaserules REST API when CLI fails (emergency only).
 *
 * IAM (project owner runs once):
 *   SA=firebase-adminsdk-fbsvc@mvp-factory-crm.iam.gserviceaccount.com
 *   gcloud projects add-iam-policy-binding mvp-factory-crm \
 *     --member="serviceAccount:${SA}" \
 *     --role="roles/firebaserules.admin"
 *   gcloud projects add-iam-policy-binding mvp-factory-crm \
 *     --member="serviceAccount:${SA}" \
 *     --role="roles/serviceusage.serviceUsageConsumer"
 *
 * Auth for this script:
 *   - `firebase login` (interactive), or
 *   - `GOOGLE_APPLICATION_CREDENTIALS` pointing at a key with the roles above, or
 *   - `FIREBASE_TOKEN` from `firebase login:ci`
 *
 * Usage:
 *   node scripts/deploy-firestore-rules.mjs
 *   node scripts/deploy-firestore-rules.mjs --rest-fallback
 */
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = "mvp-factory-crm";
const RULES_FILE = path.join(ROOT, "firestore.rules");
const REST_FALLBACK = process.argv.includes("--rest-fallback");

function run(cmd, opts = {}) {
  return spawnSync(cmd[0], cmd.slice(1), {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
    ...opts,
  });
}

function tryFirebaseDeploy() {
  const r = run(["npx", "firebase-tools", "deploy", "--only", "firestore:rules", "--project", PROJECT, "--non-interactive"]);
  return { ok: r.status === 0, stdout: r.stdout || "", stderr: r.stderr || "" };
}

async function restFallbackDeploy() {
  const rules = fs.readFileSync(RULES_FILE, "utf8");
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath || !fs.existsSync(credPath)) {
    throw new Error("REST fallback requires GOOGLE_APPLICATION_CREDENTIALS");
  }
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    keyFile: credPath,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;
  if (!token) throw new Error("No access token from service account");

  const base = "https://firebaserules.googleapis.com/v1";
  const createRes = await fetch(`${base}/projects/${PROJECT}/rulesets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content: rules }] } }),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    throw new Error(`rulesets.create failed: ${createRes.status} ${JSON.stringify(created)}`);
  }
  const rulesetName = created.name;
  const releaseName = `projects/${PROJECT}/releases/cloud.firestore`;
  const patchRes = await fetch(`${base}/${releaseName}?updateMask=rulesetName`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ release: { name: releaseName, rulesetName } }),
  });
  const patched = await patchRes.json();
  if (!patchRes.ok) {
    throw new Error(`release.patch failed: ${patchRes.status} ${JSON.stringify(patched)}`);
  }
  return { rulesetName, release: patched };
}

function printIamHelp(stderr) {
  console.error("\n--- IAM blocker ---");
  console.error(stderr.trim());
  console.error(`
Minimal roles for deploy SA (NOT Owner/Editor):
  roles/firebaserules.admin
  roles/serviceusage.serviceUsageConsumer

Owner command (replace SA if different):
  SA=firebase-adminsdk-fbsvc@mvp-factory-crm.iam.gserviceaccount.com
  gcloud projects add-iam-policy-binding mvp-factory-crm \\
    --member="serviceAccount:\${SA}" \\
    --role="roles/firebaserules.admin"
  gcloud projects add-iam-policy-binding mvp-factory-crm \\
    --member="serviceAccount:\${SA}" \\
    --role="roles/serviceusage.serviceUsageConsumer"

Then retry:
  firebase deploy --only firestore:rules --project mvp-factory-crm --non-interactive
`);
}

async function main() {
  if (!fs.existsSync(RULES_FILE)) {
    throw new Error(`Missing ${RULES_FILE}`);
  }
  console.log("Deploying Firestore rules from", RULES_FILE);
  const deploy = tryFirebaseDeploy();
  if (deploy.ok) {
    console.log(deploy.stdout);
    console.log("PASS: firebase deploy --only firestore:rules");
    return;
  }
  console.error(deploy.stderr || deploy.stdout);
  printIamHelp(deploy.stderr || deploy.stdout);
  if (!REST_FALLBACK) {
    console.error("\nEmergency only: node scripts/deploy-firestore-rules.mjs --rest-fallback");
    process.exit(1);
  }
  console.warn("\nAttempting REST fallback (emergency)...");
  const result = await restFallbackDeploy();
  console.log("PASS (REST fallback):", JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
