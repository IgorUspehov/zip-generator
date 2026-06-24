#!/usr/bin/env node
/**
 * Verify Client Questionnaire i18n fix V1.
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PASS_FILE = path.join(ROOT, "output/CLIENT_QUESTIONNAIRE_I18N_FIX_V1_PASS.txt");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function verify() {
  const copy = read("src/lib/i18n/questionnaire-copy.ts");
  const page = read("src/views/client-questionnaire-page.tsx");

  const requiredInCopy = [
    "statuses:",
    "languageOptions:",
    "messages:",
    'ru: "Russian"',
    'ru: "Russisch"',
    'ru: "Русский"',
    "Friseur / Barbershop",
    "MVP-Zusammenstellung",
    "Оркестратор сборки",
  ];

  for (const snippet of requiredInCopy) {
    if (!copy.includes(snippet)) {
      throw new Error(`questionnaire-copy.ts missing: ${snippet}`);
    }
  }

  const requiredInPage = [
    "localizeStepStatus",
    "localizeBusinessType",
    "formatQuestionnaireMessage",
    "copy.languageOptions",
    "copy.messages",
  ];

  for (const snippet of requiredInPage) {
    if (!page.includes(snippet)) {
      throw new Error(`client-questionnaire-page.tsx missing: ${snippet}`);
    }
  }

  if (page.includes('"Delivery failed"') || page.includes('"Save failed"')) {
    throw new Error("Hardcoded English runtime messages still present");
  }

  if (!page.includes("copy.languageOptions[code]")) {
    throw new Error("Language select still shows raw codes");
  }
}

try {
  verify();
  fs.mkdirSync(path.dirname(PASS_FILE), { recursive: true });
  fs.writeFileSync(
    PASS_FILE,
    [
      "CLIENT_QUESTIONNAIRE_I18N_FIX_V1_PASS",
      "Status: PASS",
      "",
      "UI i18n:",
      "  statuses.* (PENDING/RUNNING/PASS/FAIL)",
      "  languageOptions.* (ru/de/en labels)",
      "  messages.* (save/delivery errors)",
      "  localized business_type in result",
      "  partial EN strings fixed in DE/RU",
    ].join("\n") + "\n",
  );
  console.log("CLIENT_QUESTIONNAIRE_I18N_FIX_V1_PASS");
} catch (error) {
  console.error("CLIENT_QUESTIONNAIRE_I18N_FIX_V1_FAIL");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
