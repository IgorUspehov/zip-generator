import { FieldValue } from "firebase-admin/firestore";

import { canonicalizeEmail, hydrateClientManifest } from "@/lib/admin/lookup";
import {
  findDemoByClientId,
  findDemoByDeploymentId,
  findDemoBySlug,
  markDemoPaid,
  markDemoPaidByClientId,
  upsertDemoRecord,
  type DemoSiteRecord,
} from "@/lib/cloudflare/demo-registry";
import { cancelDeletionForClient, findPendingByClientId } from "@/lib/cloudflare/scheduler";
import { getSharedPagesProjectName } from "@/lib/cloudflare/shared-project";
import { buildDemoSlug } from "@/lib/cloudflare/deploy";
import { getClientDistProtection, markClientDistPaid } from "@/lib/site-delivery/dist-protection";

const CLIENTS_COLLECTION = "clients";
const PAID_EMAILS_COLLECTION = "paidEmails";

function paidEmailDocId(email: string): string {
  return canonicalizeEmail(email).replace(/\//g, "_");
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getDb() {
  const { getFirestoreDb } = await import("@/lib/firebase/admin");
  return getFirestoreDb();
}

/**
 * Flip local TTL records so the 10-minute Cloudflare cleaner will not delete this tenant.
 * Polar success is not enough — this flag is what the scheduler actually checks.
 */
export function markTenantPaid(clientId: string): boolean {
  const id = String(clientId || "").trim();
  if (!id) return false;
  const registryByClient = markDemoPaidByClientId(id);
  const registryById = markDemoPaid(id);
  markClientDistPaid(id);
  const pending = cancelDeletionForClient(id);
  return registryByClient || registryById || pending;
}

export async function persistTenantPaid(input: {
  clientId: string;
  email?: string;
  slug?: string;
  orderId?: string;
  source?: string;
}): Promise<void> {
  const clientId = String(input.clientId || "").trim();
  if (!clientId) return;

  const demo = findDemoByClientId(clientId);
  const slug = pickString(input.slug) || demo?.slug || "";
  const email = pickString(input.email);

  try {
    const db = await getDb();
    const batch = db.batch();
    const clientRef = db.collection(CLIENTS_COLLECTION).doc(clientId);
    batch.set(
      clientRef,
      {
        paid: true,
        paidAt: FieldValue.serverTimestamp(),
        paidSource: input.source || "polar",
        polarOrderId: pickString(input.orderId) || null,
        demoSlug: slug || null,
        deploymentId: demo?.deploymentId || null,
        deploymentUrl: demo?.deploymentUrl || null,
        updatedAt: FieldValue.serverTimestamp(),
        ...(email.includes("@") ? { polarEmail: canonicalizeEmail(email) } : {}),
      },
      { merge: true },
    );

    if (email.includes("@")) {
      const emailRef = db.collection(PAID_EMAILS_COLLECTION).doc(paidEmailDocId(email));
      batch.set(
        emailRef,
        {
          email: canonicalizeEmail(email),
          paid: true,
          lastClientId: clientId,
          lastSlug: slug || null,
          polarOrderId: pickString(input.orderId) || null,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    await batch.commit();
  } catch (error) {
    console.warn("[paid-tenant] Firestore persist failed", {
      clientId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function isEmailPaid(email: string): Promise<boolean> {
  const normalized = canonicalizeEmail(email);
  if (!normalized.includes("@")) return false;
  try {
    const db = await getDb();
    const snap = await db.collection(PAID_EMAILS_COLLECTION).doc(paidEmailDocId(normalized)).get();
    return snap.data()?.paid === true;
  } catch {
    return false;
  }
}

export async function isClientPaidInStore(clientId: string): Promise<boolean> {
  const id = String(clientId || "").trim();
  if (!id) return false;
  try {
    const db = await getDb();
    const snap = await db.collection(CLIENTS_COLLECTION).doc(id).get();
    if (snap.data()?.paid === true) return true;
    const email =
      pickString(snap.data()?.polarEmail) ||
      pickString(snap.data()?.email);
    if (email) return isEmailPaid(email);
    return false;
  } catch {
    return false;
  }
}

export async function persistDemoDeployment(input: {
  clientId: string;
  slug: string;
  deploymentId: string;
  deploymentUrl: string;
  email?: string;
}): Promise<void> {
  const clientId = String(input.clientId || "").trim();
  if (!clientId) return;
  try {
    const db = await getDb();
    await db
      .collection(CLIENTS_COLLECTION)
      .doc(clientId)
      .set(
        {
          demoSlug: input.slug,
          deploymentId: input.deploymentId,
          deploymentUrl: input.deploymentUrl,
          email: pickString(input.email) || null,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  } catch (error) {
    console.warn("[paid-tenant] demo deployment persist failed", {
      clientId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function stubDemoRecord(input: {
  slug: string;
  clientId: string;
  deploymentId?: string;
  deploymentUrl?: string;
}): DemoSiteRecord {
  const projectName = getSharedPagesProjectName();
  return {
    slug: input.slug,
    clientId: input.clientId,
    deploymentId: input.deploymentId || input.clientId,
    deploymentUrl: input.deploymentUrl || `https://${projectName}.pages.dev`,
    projectName,
    deployedAt: new Date().toISOString(),
    deleteAt: new Date(Date.now() + 365 * 864e5).toISOString(),
    paid: true,
  };
}

export async function restoreDemoBySlug(slug: string): Promise<DemoSiteRecord | undefined> {
  const existing = findDemoBySlug(slug);
  if (existing) return existing;

  try {
    const db = await getDb();
    const query = await db.collection(CLIENTS_COLLECTION).where("demoSlug", "==", slug).limit(1).get();
    const doc = query.docs[0];
    if (!doc) return undefined;
    const data = doc.data() || {};
    const clientId = doc.id;
    const email = pickString(data.polarEmail) || pickString(data.email);
    if (data.paid !== true && !(await isEmailPaid(email))) {
      return undefined;
    }
    await hydrateClientManifest(clientId);
    const record = stubDemoRecord({
      slug,
      clientId,
      deploymentId: pickString(data.deploymentId),
      deploymentUrl: pickString(data.deploymentUrl),
    });
    upsertDemoRecord(record);
    markTenantPaid(clientId);
    return findDemoBySlug(slug) || record;
  } catch (error) {
    console.warn("[paid-tenant] restore by slug failed", {
      slug,
      message: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export async function restoreDemoByClientId(clientId: string): Promise<DemoSiteRecord | undefined> {
  const id = String(clientId || "").trim();
  if (!id) return undefined;
  const existing = findDemoByClientId(id);
  // After Render /tmp wipe the registry row may come back unpaid — still re-check Firestore.
  if (existing?.paid === true) return existing;

  try {
    const db = await getDb();
    const snap = await db.collection(CLIENTS_COLLECTION).doc(id).get();
    if (!snap.exists) return existing;
    const data = snap.data() || {};
    const slug =
      pickString(data.demoSlug) ||
      existing?.slug ||
      buildDemoSlug({
        clientId: id,
        businessName: pickString(data.businessName),
        businessType: pickString(data.businessType),
      });
    if (!slug) return existing;
    const email = pickString(data.polarEmail) || pickString(data.email);
    if (data.paid !== true && !(await isEmailPaid(email))) {
      return existing;
    }
    await hydrateClientManifest(id);
    const record = stubDemoRecord({
      slug,
      clientId: id,
      deploymentId: pickString(data.deploymentId) || existing?.deploymentId,
      deploymentUrl: pickString(data.deploymentUrl) || existing?.deploymentUrl,
    });
    upsertDemoRecord(record);
    markTenantPaid(id);
    return findDemoByClientId(id) || record;
  } catch {
    return existing;
  }
}

export function isLocallyPaid(clientId: string, deploymentId?: string, slug?: string): boolean {
  if (findDemoByClientId(clientId)?.paid === true) return true;
  if (deploymentId && findDemoByDeploymentId(deploymentId)?.paid === true) return true;
  if (slug && findDemoBySlug(slug)?.paid === true) return true;
  if (findPendingByClientId(clientId)?.paid === true) return true;
  if (getClientDistProtection(clientId)?.paid === true) return true;
  return false;
}
