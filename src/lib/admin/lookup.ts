import fs from "fs";
import path from "path";

import { extractOwnerEmail } from "@/lib/admin/site-content";
import { loadClientManifest, resolveManifestsDir, saveClientManifest } from "@/lib/manifest/storage";

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function collectOwnerEmails(record: Record<string, unknown> | null | undefined): string[] {
  if (!record) return [];
  const emails = new Set<string>();
  const add = (value: unknown) => {
    const email = normalizeEmail(value);
    if (email.includes("@")) emails.add(email);
  };

  add(record.email);
  add(record.polarEmail);
  const questionnaire =
    record.questionnaire && typeof record.questionnaire === "object"
      ? (record.questionnaire as Record<string, unknown>)
      : null;
  add(questionnaire?.email);
  const manifest =
    record.manifest && typeof record.manifest === "object"
      ? (record.manifest as Record<string, unknown>)
      : record;
  add(extractOwnerEmail(manifest));
  return [...emails];
}

export function recordOwnsEmail(
  record: Record<string, unknown> | null | undefined,
  email: string,
): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized.includes("@")) return false;
  return collectOwnerEmails(record).includes(normalized);
}

function listManifestClientIds(): string[] {
  const dir = resolveManifestsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
    .filter(Boolean);
}

async function queryFirestoreClientIdsByEmail(email: string): Promise<string[]> {
  const ids = new Set<string>();
  try {
    const { getFirestoreDb } = await import("@/lib/firebase/admin");
    const db = getFirestoreDb();
    const queries = [
      db.collection("clients").where("email", "==", email).get(),
      db.collection("clients").where("polarEmail", "==", email).get(),
    ];
    const results = await Promise.allSettled(queries);
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const doc of result.value.docs) ids.add(doc.id);
    }
  } catch {
    return [...ids];
  }
  return [...ids];
}

async function loadFirestoreClientRecord(
  clientId: string,
): Promise<Record<string, unknown> | null> {
  const id = clientId.trim();
  if (!id) return null;
  try {
    const { getFirestoreDb } = await import("@/lib/firebase/admin");
    const snap = await getFirestoreDb().collection("clients").doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function hydrateClientManifest(clientId: string): Promise<Record<string, unknown> | null> {
  const existing = loadClientManifest(clientId);
  if (existing) return existing;
  const record = await loadFirestoreClientRecord(clientId);
  const manifest =
    record?.manifest && typeof record.manifest === "object"
      ? (record.manifest as Record<string, unknown>)
      : null;
  if (!manifest) return null;
  saveClientManifest(clientId, manifest);
  return loadClientManifest(clientId) || manifest;
}

export async function findClientIdsByOwnerEmail(
  email: string,
  clientId?: string,
): Promise<string[]> {
  const normalized = normalizeEmail(email);
  if (!normalized.includes("@")) return [];

  const ids = new Set<string>();
  const hintedId = typeof clientId === "string" ? clientId.trim() : "";

  if (hintedId) {
    const hintedRecord = await loadFirestoreClientRecord(hintedId);
    const hintedManifest = loadClientManifest(hintedId);
    if (
      recordOwnsEmail(hintedRecord, normalized) ||
      extractOwnerEmail(hintedManifest) === normalized
    ) {
      ids.add(hintedId);
    }
  }

  for (const id of listManifestClientIds()) {
    const manifest = loadClientManifest(id);
    if (extractOwnerEmail(manifest) === normalized) {
      ids.add(id);
    }
  }

  const fromFirestore = await queryFirestoreClientIdsByEmail(normalized);
  for (const id of fromFirestore) {
    const record = await loadFirestoreClientRecord(id);
    const manifest = loadClientManifest(id);
    if (recordOwnsEmail(record, normalized) || extractOwnerEmail(manifest) === normalized) {
      ids.add(id);
    }
  }

  return [...ids];
}

export function manifestPathForClient(clientId: string): string {
  return path.join(resolveManifestsDir(), `${clientId}.json`);
}
