import { FieldValue } from "firebase-admin/firestore";

import { extractOwnerEmail, readSiteContent } from "@/lib/admin/site-content";
import { loadClientManifest, saveClientManifest } from "@/lib/manifest/storage";

export async function persistClientManifest(
  clientId: string,
  manifest: Record<string, unknown>,
): Promise<void> {
  saveClientManifest(clientId, manifest);

  const content = readSiteContent(manifest);
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
    console.warn("[admin] Firestore manifest sync failed", {
      clientId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export function requireClientManifest(clientId: string): Record<string, unknown> {
  const manifest = loadClientManifest(clientId);
  if (!manifest) {
    throw new Error("Manifest not found");
  }
  return manifest;
}
