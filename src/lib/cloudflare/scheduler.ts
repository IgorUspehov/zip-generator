import fs from "fs";
import path from "path";

import { deletePagesProject, isCloudflareDeployConfigured } from "@/lib/cloudflare/deploy";
import type { PendingDeletionRecord } from "@/lib/manifest/storage-manager";
import { resolvePendingDeletionsPath } from "@/lib/manifest/storage-paths";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

export type PendingDeletion = PendingDeletionRecord;

function getPendingDeletionsPath(): string {
  return resolvePendingDeletionsPath();
}

function readPendingDeletions(): PendingDeletion[] {
  const pendingDeletionsPath = getPendingDeletionsPath();
  if (!fs.existsSync(pendingDeletionsPath)) {
    return [];
  }

  try {
    const raw = JSON.parse(fs.readFileSync(pendingDeletionsPath, "utf8")) as PendingDeletion[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writePendingDeletions(entries: PendingDeletion[]): void {
  const pendingDeletionsPath = getPendingDeletionsPath();
  fs.mkdirSync(path.dirname(pendingDeletionsPath), { recursive: true });
  fs.writeFileSync(pendingDeletionsPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export function scheduleDeletion(entry: {
  siteId: string;
  clientId: string;
  siteUrl: string;
  deployedAt: string;
  deleteAt?: string;
}): PendingDeletion {
  const deployedAt = entry.deployedAt;
  const deleteAt =
    entry.deleteAt ??
    new Date(new Date(deployedAt).getTime() + FORTY_EIGHT_HOURS_MS).toISOString();

  const record: PendingDeletion = {
    siteId: entry.siteId,
    clientId: entry.clientId,
    siteUrl: entry.siteUrl,
    deployedAt,
    deleteAt,
  };

  const entries = readPendingDeletions().filter((item) => item.siteId !== record.siteId);
  entries.push(record);
  writePendingDeletions(entries);

  return record;
}

export function cancelDeletion(siteId: string): boolean {
  const entries = readPendingDeletions();
  let updated = false;

  const next = entries.map((item) => {
    if (item.siteId !== siteId) {
      return item;
    }

    updated = true;
    return { ...item, paid: true };
  });

  if (!updated) {
    return false;
  }

  writePendingDeletions(next);
  return true;
}

export function findPendingBySiteId(siteId: string): PendingDeletion | undefined {
  return readPendingDeletions().find((item) => item.siteId === siteId);
}

export function findPendingByClientId(clientId: string): PendingDeletion | undefined {
  return readPendingDeletions().find((item) => item.clientId === clientId);
}

export function findPendingBySiteUrl(siteUrl: string): PendingDeletion | undefined {
  const normalized = siteUrl.replace(/\/$/, "");
  return readPendingDeletions().find((item) => item.siteUrl.replace(/\/$/, "") === normalized);
}

export async function processExpiredDeletions(): Promise<void> {
  if (!isCloudflareDeployConfigured()) {
    return;
  }

  const now = Date.now();
  const entries = readPendingDeletions();
  const remaining: PendingDeletion[] = [];

  for (const entry of entries) {
    if (entry.paid) {
      remaining.push(entry);
      continue;
    }

    if (new Date(entry.deleteAt).getTime() <= now) {
      try {
        await deletePagesProject(entry.siteId);
        console.info(`[cloudflare-scheduler] Deleted expired project ${entry.siteId}`);
      } catch (error) {
        console.error(`[cloudflare-scheduler] Failed to delete project ${entry.siteId}:`, error);
        remaining.push(entry);
      }
    } else {
      remaining.push(entry);
    }
  }

  writePendingDeletions(remaining);
}

let schedulerStarted = false;

export function startDeletionScheduler(): void {
  if (schedulerStarted || typeof setInterval === "undefined") {
    return;
  }

  schedulerStarted = true;

  void processExpiredDeletions();
  setInterval(() => {
    void processExpiredDeletions();
  }, CHECK_INTERVAL_MS);
}
