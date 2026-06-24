#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SERVICE_ACCOUNT_PATH =
  process.argv[2] ??
  "/home/igor/Загрузки/mvp-factory-crm-firebase-adminsdk-fbsvc-bacbeb3f6d.json";

const SERVICE = "saas-mvp-funnel";
const ENVIRONMENT = "production";

function railwayArgs(extra) {
  return ["variable", ...extra, "--service", SERVICE, "--environment", ENVIRONMENT, "--skip-deploys"];
}

function runSet(extra, input) {
  execFileSync("railway", railwayArgs(extra), {
    stdio: ["pipe", "inherit", "inherit"],
    input,
    encoding: "utf8",
  });
}

function runDelete(key) {
  const args = [
    "variable",
    "delete",
    "--service",
    SERVICE,
    "--environment",
    ENVIRONMENT,
  ];
  if (key.startsWith("-")) {
    args.push("--", key);
  } else {
    args.push(key);
  }
  execFileSync("railway", args, {
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf8",
  });
}

function listVariableKeys() {
  const output = execFileSync(
    "railway",
    ["variable", "list", "--service", SERVICE, "--environment", ENVIRONMENT, "--json"],
    { encoding: "utf8" },
  );
  return Object.keys(JSON.parse(output));
}

function discoverGarbageKeys(keys, clientEmail, projectId) {
  return keys.filter((key) => {
    if (key.startsWith("FIREBASE_")) {
      return false;
    }
    return (
      key === projectId ||
      key === clientEmail ||
      key.startsWith("-----BEGIN PRIVATE KEY-----")
    );
  });
}

const raw = fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8");
const account = JSON.parse(raw);

const projectId = String(account.project_id ?? "").trim();
const clientEmail = String(account.client_email ?? "").trim();
const privateKey = String(account.private_key ?? "").trim();

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(`Invalid service account JSON: ${SERVICE_ACCOUNT_PATH}`);
}

console.log(`Setting Firebase env vars on ${SERVICE} (${ENVIRONMENT}) from ${SERVICE_ACCOUNT_PATH}`);

runSet(["set", `FIREBASE_PROJECT_ID=${projectId}`]);
runSet(["set", `FIREBASE_CLIENT_EMAIL=${clientEmail}`]);
runSet(["set", "FIREBASE_PRIVATE_KEY", "--stdin"], privateKey);

console.log("Deleting garbage variables...");
const garbageKeys = discoverGarbageKeys(listVariableKeys(), clientEmail, projectId);
for (const key of garbageKeys) {
  runDelete(key);
  console.log(`  deleted: ${key.length > 64 ? `${key.slice(0, 64)}…` : key}`);
}

console.log("Done.");
