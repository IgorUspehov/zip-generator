import fs from "fs";
import path from "path";

import { extractOwnerEmail } from "@/lib/admin/site-content";
import { loadClientManifest, resolveManifestsDir } from "@/lib/manifest/storage";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
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

async function listFirestoreClientIdsByEmail(email: string): Promise<string[]> {
  try {
    const { getFirestoreDb } = await import("@/lib/firebase/admin");
    const snap = await getFirestoreDb().collection("clients").where("email", "==", email).get();
    return snap.docs.map((doc) => doc.id);
  } catch {
    return [];
  }
}

export async function findClientIdsByOwnerEmail(email: string): Promise<string[]> {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) return [];

  const ids = new Set<string>();
  for (const clientId of listManifestClientIds()) {
    const manifest = loadClientManifest(clientId);
    if (extractOwnerEmail(manifest) === normalized) {
      ids.add(clientId);
    }
  }

  const fromFirestore = await listFirestoreClientIdsByEmail(normalized);
  for (const clientId of fromFirestore) {
    const manifest = loadClientManifest(clientId);
    if (!manifest || extractOwnerEmail(manifest) === normalized) {
      ids.add(clientId);
    }
  }

  return [...ids];
}

export function manifestPathForClient(clientId: string): string {
  return path.join(resolveManifestsDir(), `${clientId}.json`);
}
