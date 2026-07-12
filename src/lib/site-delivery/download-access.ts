import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

import { resolvePersistentDataDir } from "@/lib/site-delivery/data-dir";

type SiteDownloadAccess = {
  clientId: string;
  token: string;
  grantedAt: string;
};

const ACCESS_PATH = () => path.join(resolvePersistentDataDir(), "site-download-access.json");

function readAccessRecords(): SiteDownloadAccess[] {
  const filePath = ACCESS_PATH();
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteDownloadAccess[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAccessRecords(records: SiteDownloadAccess[]): void {
  const filePath = ACCESS_PATH();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

export function grantSiteDownloadAccess(clientId: string): string {
  const token = randomUUID();
  const records = readAccessRecords().filter((item) => item.clientId !== clientId);
  records.push({
    clientId,
    token,
    grantedAt: new Date().toISOString(),
  });
  writeAccessRecords(records);
  return token;
}

export function verifySiteDownloadAccess(clientId: string, token: string): boolean {
  const record = readAccessRecords().find((item) => item.clientId === clientId);
  return Boolean(record && record.token === token);
}
