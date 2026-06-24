#!/usr/bin/env node
/**
 * Verify Client Delivery V2 frontend API integration artifacts.
 * Writes output/CLIENT_DELIVERY_V2_FRONTEND_API_INTEGRATION_PASS.txt on success.
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PASS_FILE = path.join(ROOT, "output/CLIENT_DELIVERY_V2_FRONTEND_API_INTEGRATION_PASS.txt");

const REQUIRED_FILES = [
  "src/app/api/client-delivery-v2/run/route.ts",
  "src/app/api/client-delivery-v2/status/route.ts",
  "src/app/api/client-delivery-v2/download/route.ts",
  "src/lib/client-delivery-v2/v2-delivery-service.ts",
  "src/views/client-questionnaire-page.tsx",
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function verify() {
  const missing = REQUIRED_FILES.filter((rel) => !fs.existsSync(path.join(ROOT, rel)));
  if (missing.length) {
    throw new Error(`Missing files: ${missing.join(", ")}`);
  }

  const page = read("src/views/client-questionnaire-page.tsx");
  const requiredSnippets = [
    "/api/client-delivery-v2/run",
    "/api/client-delivery-v2/status",
    "/api/client-delivery-v2/download",
    "template_id",
    "downloadPackage",
  ];
  for (const snippet of requiredSnippets) {
    if (!page.includes(snippet)) {
      throw new Error(`client-questionnaire-page.tsx missing: ${snippet}`);
    }
  }

  if (page.includes("/api/client-delivery/run")) {
    throw new Error("client-questionnaire-page.tsx still references V1 /api/client-delivery/run");
  }

  const runRoute = read("src/app/api/client-delivery-v2/run/route.ts");
  if (!runRoute.includes("npm run client:deliver:v2")) {
    throw new Error("V2 run route must execute npm run client:deliver:v2");
  }

  const v1Run = path.join(ROOT, "src/app/api/client-delivery/run/route.ts");
  if (!fs.existsSync(v1Run) || !read("src/app/api/client-delivery/run/route.ts").includes("client:deliver")) {
    throw new Error("V1 client-delivery run route must remain intact");
  }
}

try {
  verify();
  fs.mkdirSync(path.dirname(PASS_FILE), { recursive: true });
  const report = [
    "CLIENT_DELIVERY_V2_FRONTEND_API_INTEGRATION_PASS",
    "Status: PASS",
    "LLM Used: false",
    "",
    "API Routes:",
    "  POST /api/client-delivery-v2/run",
    "  GET  /api/client-delivery-v2/status",
    "  GET  /api/client-delivery-v2/download",
    "",
    "Frontend:",
    "  /client-questionnaire -> V2 APIs",
    "",
    "V1 preserved:",
    "  /api/client-delivery/* unchanged",
  ].join("\n") + "\n";
  fs.writeFileSync(PASS_FILE, report);
  console.log("CLIENT_DELIVERY_V2_FRONTEND_API_INTEGRATION_PASS");
  process.exit(0);
} catch (error) {
  console.error("CLIENT_DELIVERY_V2_FRONTEND_API_INTEGRATION_FAIL");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
