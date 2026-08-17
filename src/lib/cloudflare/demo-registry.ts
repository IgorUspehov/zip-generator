import fs from "fs";
import path from "path";

import { resolvePersistentDataDir } from "@/lib/site-delivery/data-dir";
import {
  readCachedDemoRegistry,
  writeCachedDemoRegistry,
} from "@/lib/runtime-session-store";

export type DemoSiteRecord = {
  slug: string;
  clientId: string;
  deploymentId: string;
  deploymentUrl: string;
  projectName: string;
  deployedAt: string;
  deleteAt: string;
  paid?: boolean;
};

function getDemoRegistryPath(): string {
  return path.join(resolvePersistentDataDir(), "demo-registry.json");
}

function readRegistryFromDisk(): DemoSiteRecord[] {
  const filePath = getDemoRegistryPath();
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as DemoSiteRecord[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeRegistryToDisk(entries: DemoSiteRecord[]): void {
  const filePath = getDemoRegistryPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

function readRegistry(): DemoSiteRecord[] {
  const cached = readCachedDemoRegistry();
  if (cached) {
    return cached;
  }
  const fromDisk = readRegistryFromDisk();
  writeCachedDemoRegistry(fromDisk);
  return fromDisk;
}

function writeRegistry(entries: DemoSiteRecord[]): void {
  writeCachedDemoRegistry(entries);
  try {
    writeRegistryToDisk(entries);
  } catch (error) {
    console.warn("[demo-registry] disk write failed — using memory only", {
      message: error instanceof Error ? error.message : String(error),
      entries: entries.length,
    });
  }
}

export function upsertDemoRecord(record: DemoSiteRecord): void {
  const entries = readRegistry().filter(
    (item) => item.slug !== record.slug && item.deploymentId !== record.deploymentId,
  );
  entries.push(record);
  writeRegistry(entries);
}

export function findDemoBySlug(slug: string): DemoSiteRecord | undefined {
  return readRegistry().find((item) => item.slug === slug);
}

export function findDemoByShortId(shortId: string): DemoSiteRecord | undefined {
  return readRegistry().find((item) => item.slug.endsWith(`-${shortId}`));
}

export function findDemoByClientId(clientId: string): DemoSiteRecord | undefined {
  return readRegistry().find((item) => item.clientId === clientId);
}

export function findDemoByDeploymentId(deploymentId: string): DemoSiteRecord | undefined {
  return readRegistry().find((item) => item.deploymentId === deploymentId);
}

export function markDemoPaid(deploymentId: string): boolean {
  const entries = readRegistry();
  let updated = false;
  const next = entries.map((item) => {
    if (item.deploymentId !== deploymentId && item.slug !== deploymentId) {
      return item;
    }
    updated = true;
    return { ...item, paid: true };
  });
  if (updated) writeRegistry(next);
  return updated;
}

/** Mark paid by tenant clientId (Polar/LemonSqueezy webhooks). */
export function markDemoPaidByClientId(clientId: string): boolean {
  const id = String(clientId || "").trim();
  if (!id) return false;
  const entries = readRegistry();
  let updated = false;
  const next = entries.map((item) => {
    if (item.clientId !== id) return item;
    updated = true;
    return { ...item, paid: true };
  });
  if (updated) writeRegistry(next);
  return updated;
}

export function removeDemoByDeploymentId(deploymentId: string): void {
  writeRegistry(readRegistry().filter((item) => item.deploymentId !== deploymentId));
}

export function listDemoRecords(): DemoSiteRecord[] {
  return readRegistry();
}
