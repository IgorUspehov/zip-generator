import { getFirestoreDb } from "@/lib/firebase/admin";

export type VacancyRecord = {
  id: string;
  title: string;
  description: string;
  salary?: string;
  requirements?: string;
  createdAt: number;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function itemsCollection(clientId: string) {
  return getFirestoreDb().collection("vacancies").doc(clientId).collection("items");
}

function normalizeVacancy(
  data: Record<string, unknown>,
  fallbackId: string,
): VacancyRecord | null {
  const title = asString(data.title).trim();
  const description = asString(data.description).trim();
  if (!title || !description) return null;
  const salary = asString(data.salary).trim();
  const requirements = asString(data.requirements).trim();
  return {
    id: asString(data.id) || fallbackId,
    title,
    description,
    ...(salary ? { salary } : {}),
    ...(requirements ? { requirements } : {}),
    createdAt: asNumber(data.createdAt) || Date.now(),
  };
}

export async function listVacancies(clientId: string): Promise<VacancyRecord[]> {
  const id = String(clientId || "").trim();
  if (!id) return [];

  try {
    const snap = await itemsCollection(id).orderBy("createdAt", "desc").limit(100).get();
    return snap.docs
      .map((doc) => normalizeVacancy(doc.data() as Record<string, unknown>, doc.id))
      .filter((item): item is VacancyRecord => Boolean(item));
  } catch (error) {
    console.error("[vacancies] list failed", {
      clientId: id,
      message: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function createVacancy(
  clientId: string,
  input: {
    title: string;
    description: string;
    salary?: string;
    requirements?: string;
  },
): Promise<VacancyRecord> {
  const id = `vac-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  if (!title || !description) {
    throw new Error("title and description are required");
  }
  const salary = String(input.salary || "").trim();
  const requirements = String(input.requirements || "").trim();
  const record: VacancyRecord = {
    id,
    title,
    description,
    ...(salary ? { salary } : {}),
    ...(requirements ? { requirements } : {}),
    createdAt: Date.now(),
  };
  await itemsCollection(clientId).doc(id).set(record);
  return record;
}

export async function deleteVacancy(
  clientId: string,
  vacancyId: string,
): Promise<boolean> {
  const id = String(vacancyId || "").trim();
  if (!id) return false;
  await itemsCollection(clientId).doc(id).delete();
  return true;
}
