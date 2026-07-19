import fs from "fs";
import path from "path";

import { FieldValue } from "firebase-admin/firestore";

import { getFirestoreDb } from "@/lib/firebase/admin";
import { leadStatusLabel, normalizeLeadLang, resolveLeadFormMode } from "@/lib/leads/niche-mode";
import type {
  LeadBookingRecord,
  LeadClientRecord,
  LeadFormMode,
  LeadLang,
  LeadOrderRecord,
  LeadPayload,
} from "@/lib/leads/types";
import { normalizePhoneKey } from "@/lib/leads/validate";

function newRecId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `rec-${prefix}-${Date.now()}-${rand}`;
}

function pickLocalized(
  value: unknown,
  language: LeadLang,
): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const obj = value as Record<string, unknown>;
  const direct = obj[language] ?? obj.en ?? obj.de ?? obj.ru;
  return typeof direct === "string" ? direct : "";
}

export function loadNicheServiceOptions(
  businessType: string,
  language: LeadLang,
): string[] {
  try {
    const filePath = path.join(
      process.cwd(),
      "artifacts/factory_output/react_mvp/src/data/niche-scenarios.json",
    );
    if (!fs.existsSync(filePath)) return [];
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<
      string,
      { popular_services?: Record<string, string[]>; records?: { services?: unknown[] } }
    >;
    const key = businessType.replace(/_crm$/, "");
    const scenario = raw[key] ?? raw[businessType];
    if (!scenario) return [];
    const popular = scenario.popular_services?.[language] ?? scenario.popular_services?.en;
    if (Array.isArray(popular) && popular.length) return popular.slice(0, 12);
    const services = scenario.records?.services;
    if (!Array.isArray(services)) return [];
    return services
      .map((item) => pickLocalized((item as { name?: unknown }).name, language))
      .filter(Boolean)
      .slice(0, 12);
  } catch {
    return [];
  }
}

export async function ensureClientRoot(clientId: string, meta: Record<string, unknown>) {
  const ref = getFirestoreDb().collection("clients").doc(clientId);
  await ref.set(
    {
      ...meta,
      updatedAt: FieldValue.serverTimestamp(),
      saasLeadCapture: true,
    },
    { merge: true },
  );
}

async function findClientByPhone(
  clientId: string,
  phoneKey: string,
): Promise<LeadClientRecord | null> {
  const snap = await getFirestoreDb()
    .collection("clients")
    .doc(clientId)
    .collection("clients")
    .where("phoneKey", "==", phoneKey)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  const data = doc.data();
  return {
    id: String(data.id || doc.id),
    name: String(data.name || ""),
    phone: String(data.phone || ""),
    note: String(data.note || ""),
    visits: Number(data.visits || 0),
    source: "site_form",
    status: String(data.status || ""),
    createdAt: Number(data.createdAt || Date.now()),
  };
}

export async function createSiteLead(input: {
  clientId: string;
  businessType: string;
  payload: LeadPayload;
  mode: LeadFormMode;
}): Promise<{
  client: LeadClientRecord;
  booking?: LeadBookingRecord;
  order?: LeadOrderRecord;
  createdClient: boolean;
}> {
  const language = normalizeLeadLang(input.payload.language);
  const status = leadStatusLabel(language);
  const phoneKey = normalizePhoneKey(input.payload.phone);
  const db = getFirestoreDb();
  const root = db.collection("clients").doc(input.clientId);

  await ensureClientRoot(input.clientId, {
    businessType: input.businessType,
    leadMode: input.mode,
  });

  let client = await findClientByPhone(input.clientId, phoneKey);
  let createdClient = false;

  if (!client) {
    const id = newRecId("cli");
    client = {
      id,
      name: input.payload.name,
      phone: input.payload.phone,
      note: status,
      visits: 0,
      source: "site_form",
      status,
      createdAt: Date.now(),
    };
    await root.collection("clients").doc(id).set({
      ...client,
      phoneKey,
      createdAtServer: FieldValue.serverTimestamp(),
    });
    createdClient = true;
  }

  const service =
    input.payload.service?.trim() ||
    (language === "ru" ? "Заявка с сайта" : language === "de" ? "Website-Anfrage" : "Website request");
  const note = input.payload.comment?.trim() || status;
  const timeLabel =
    input.payload.preferredAt?.trim() ||
    new Date().toLocaleString(language === "de" ? "de-DE" : language === "ru" ? "ru-RU" : "en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });

  if (input.mode === "order") {
    const id = newRecId("ord");
    const order: LeadOrderRecord = {
      id,
      client: client.name,
      phone: client.phone,
      item: service,
      status,
      note,
      source: "site_form",
      createdAt: Date.now(),
    };
    await root.collection("orders").doc(id).set({
      ...order,
      clientId: client.id,
      createdAtServer: FieldValue.serverTimestamp(),
    });
    // Mirror into appointments so CRM booking tabs (incl. orders) pick it up.
    const booking: LeadBookingRecord = {
      id,
      client: client.name,
      phone: client.phone,
      service,
      time: timeLabel,
      status,
      note,
      source: "site_form",
      createdAt: order.createdAt,
    };
    await root.collection("appointments").doc(id).set({
      ...booking,
      clientId: client.id,
      kind: "order",
      createdAtServer: FieldValue.serverTimestamp(),
    });
    return { client, order, booking, createdClient };
  }

  const id = newRecId("apt");
  const booking: LeadBookingRecord = {
    id,
    client: client.name,
    phone: client.phone,
    service,
    time: timeLabel,
    status,
    note,
    source: "site_form",
    createdAt: Date.now(),
  };
  if (input.payload.preferredAt) {
    booking.preferredAt = input.payload.preferredAt;
  }
  await root.collection("appointments").doc(id).set({
    ...booking,
    clientId: client.id,
    createdAtServer: FieldValue.serverTimestamp(),
  });
  return { client, booking, createdClient };
}

export async function listSiteLeads(clientId: string): Promise<{
  clients: LeadClientRecord[];
  appointments: LeadBookingRecord[];
  orders: LeadOrderRecord[];
}> {
  const root = getFirestoreDb().collection("clients").doc(clientId);
  const [clientsSnap, appointmentsSnap, ordersSnap] = await Promise.all([
    root.collection("clients").where("source", "==", "site_form").get(),
    root.collection("appointments").where("source", "==", "site_form").get(),
    root.collection("orders").where("source", "==", "site_form").get(),
  ]);

  const mapClient = (data: Record<string, unknown>, fallbackId: string): LeadClientRecord => ({
    id: String(data.id || fallbackId || ""),
    name: String(data.name || ""),
    phone: String(data.phone || ""),
    note: String(data.note || ""),
    visits: Number(data.visits || 0),
    source: "site_form",
    status: String(data.status || ""),
    createdAt: Number(data.createdAt || 0),
  });

  return {
    clients: clientsSnap.docs
      .map((d) => mapClient(d.data() as Record<string, unknown>, d.id))
      .filter((c) => c.id),
    appointments: appointmentsSnap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: String(data.id || d.id),
        client: String(data.client || ""),
        phone: String(data.phone || ""),
        service: String(data.service || ""),
        time: String(data.time || ""),
        status: String(data.status || ""),
        note: String(data.note || ""),
        source: "site_form" as const,
        createdAt: Number(data.createdAt || 0),
        preferredAt: data.preferredAt ? String(data.preferredAt) : undefined,
      };
    }),
    orders: ordersSnap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: String(data.id || d.id),
        client: String(data.client || ""),
        phone: String(data.phone || ""),
        item: String(data.item || ""),
        status: String(data.status || ""),
        note: String(data.note || ""),
        source: "site_form" as const,
        createdAt: Number(data.createdAt || 0),
      };
    }),
  };
}

export { resolveLeadFormMode };
