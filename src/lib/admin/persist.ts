import { FieldValue } from "firebase-admin/firestore";

import { extractOwnerEmail, readSiteContent } from "@/lib/admin/site-content";
import { loadClientManifest, saveClientManifest } from "@/lib/manifest/storage";

function firebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  );
}

/**
 * Admin source of truth: prefer Firestore manifest, then local disk/memory.
 * Keeps local cache in sync so /site and other readers see the same data.
 */
export async function loadAdminManifest(
  clientId: string,
): Promise<Record<string, unknown> | null> {
  if (firebaseConfigured()) {
    try {
      const { getFirestoreDb } = await import("@/lib/firebase/admin");
      const snap = await getFirestoreDb().collection("clients").doc(clientId).get();
      if (snap.exists) {
        const data = snap.data() as Record<string, unknown> | undefined;
        const fromFs =
          data?.manifest && typeof data.manifest === "object"
            ? (data.manifest as Record<string, unknown>)
            : null;
        if (fromFs) {
          saveClientManifest(clientId, fromFs);
          return fromFs;
        }
      }
    } catch (error) {
      console.warn("[admin] Firestore manifest load failed, falling back to disk", {
        clientId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return loadClientManifest(clientId);
}

export async function persistClientManifest(
  clientId: string,
  manifest: Record<string, unknown>,
): Promise<void> {
  saveClientManifest(clientId, manifest);

  const content = readSiteContent(manifest);
  if (!firebaseConfigured()) {
    return;
  }

  try {
    const { getFirestoreDb } = await import("@/lib/firebase/admin");
    await getFirestoreDb()
      .collection("clients")
      .doc(clientId)
      .set(
        {
          name: manifest.ownerName ?? content.businessName,
          businessName: content.businessName,
          email: content.email || extractOwnerEmail(manifest),
          phone: content.phone,
          whatsapp: content.whatsapp,
          city: content.city,
          address: content.address,
          postalCode: content.postalCode,
          manifest,
          adminEditedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  } catch (error) {
    console.error("[admin] Firestore manifest sync failed", {
      clientId,
      message: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      error instanceof Error
        ? `Firestore save failed: ${error.message}`
        : "Firestore save failed",
    );
  }
}

export async function requireClientManifest(clientId: string): Promise<Record<string, unknown>> {
  const manifest = await loadAdminManifest(clientId);
  if (!manifest) {
    throw new Error("Manifest not found");
  }
  return manifest;
}
