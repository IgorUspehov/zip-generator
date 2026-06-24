import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

import { MVP_PRO_ENTITLEMENTS_DIR } from "@/lib/mvp-pro/constants";

export type MvpProEntitlementStatus = "ready_to_download" | "downloaded";

export type MvpProEntitlement = {
  clientId: string;
  email: string;
  variantId: string;
  status: MvpProEntitlementStatus;
  downloadToken: string;
  paidAt: string;
  language: "ru" | "de" | "en";
  businessName: string;
  businessType: string;
  orderId?: string;
};

function entitlementPath(clientId: string): string {
  return path.join(process.cwd(), MVP_PRO_ENTITLEMENTS_DIR, `${clientId}.json`);
}

function ensureDir(): void {
  fs.mkdirSync(path.join(process.cwd(), MVP_PRO_ENTITLEMENTS_DIR), { recursive: true });
}

export function loadMvpProEntitlement(clientId: string): MvpProEntitlement | null {
  const filePath = entitlementPath(clientId);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as MvpProEntitlement;
  } catch {
    return null;
  }
}

export function saveMvpProEntitlement(entitlement: MvpProEntitlement): void {
  ensureDir();
  fs.writeFileSync(entitlementPath(entitlement.clientId), `${JSON.stringify(entitlement, null, 2)}\n`, "utf8");
}

export function grantMvpProEntitlement(input: {
  clientId: string;
  email: string;
  language?: string;
  businessName?: string;
  businessType?: string;
  orderId?: string;
  variantId?: string;
}): MvpProEntitlement {
  const language = ["ru", "de", "en"].includes(String(input.language ?? ""))
    ? (input.language as "ru" | "de" | "en")
    : "en";

  const entitlement: MvpProEntitlement = {
    clientId: input.clientId,
    email: input.email.trim().toLowerCase(),
    variantId: input.variantId ?? "1807661",
    status: "ready_to_download",
    downloadToken: randomUUID(),
    paidAt: new Date().toISOString(),
    language,
    businessName: input.businessName ?? "MVP Pro Client",
    businessType: input.businessType ?? "business",
    orderId: input.orderId,
  };

  saveMvpProEntitlement(entitlement);
  return entitlement;
}

export function verifyMvpProDownloadAccess(input: {
  clientId: string;
  token: string;
  email?: string;
}): { ok: true; entitlement: MvpProEntitlement } | { ok: false; reason: string } {
  const entitlement = loadMvpProEntitlement(input.clientId);
  if (!entitlement) {
    return { ok: false, reason: "Entitlement not found" };
  }

  if (entitlement.downloadToken !== input.token) {
    return { ok: false, reason: "Invalid download token" };
  }

  if (input.email && entitlement.email !== input.email.trim().toLowerCase()) {
    return { ok: false, reason: "Email does not match entitlement owner" };
  }

  return { ok: true, entitlement };
}

export function verifyMvpProStatusAccess(input: {
  clientId: string;
  email: string;
}): { ok: true; entitlement: MvpProEntitlement } | { ok: false; reason: string } {
  const entitlement = loadMvpProEntitlement(input.clientId);
  if (!entitlement) {
    return { ok: false, reason: "Entitlement not found" };
  }

  if (entitlement.email !== input.email.trim().toLowerCase()) {
    return { ok: false, reason: "Email does not match entitlement owner" };
  }

  return { ok: true, entitlement };
}
