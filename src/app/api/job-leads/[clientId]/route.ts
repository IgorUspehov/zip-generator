import { NextResponse } from "next/server";

import { getFirestoreDb } from "@/lib/firebase/admin";
import { sendTelegramMessage } from "@/lib/telegram/notify";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type JobLeadBody = {
  name?: unknown;
  phone?: unknown;
  position?: unknown;
  experience?: unknown;
  language?: unknown;
};

function asTrimmedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ clientId: string }> },
) {
  const { clientId: raw } = await context.params;
  const clientId = decodeURIComponent(raw || "").trim();

  if (!clientId) {
    return NextResponse.json(
      { error: "clientId required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  let body: JobLeadBody;
  try {
    body = (await request.json()) as JobLeadBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const name = asTrimmedString(body.name, 120);
  const phone = asTrimmedString(body.phone, 40);
  const position = asTrimmedString(body.position, 120);
  const experience = asTrimmedString(body.experience, 2000);
  const language = asTrimmedString(body.language, 8) || "de";

  if (!name || !phone || !position) {
    return NextResponse.json(
      { error: "name, phone and position are required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    id,
    clientId,
    name,
    phone,
    position,
    experience,
    language,
    status: "new" as const,
    createdAt: Date.now(),
  };

  try {
    await getFirestoreDb()
      .collection("job_applications")
      .doc(clientId)
      .collection("records")
      .doc(id)
      .set(record);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save application";
    console.error("[job-leads] firestore write failed", { clientId, message });
    return NextResponse.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS },
    );
  }

  const telegramText = [
    "🔔 Новая заявка на работу",
    `👤 ${name}`,
    `📞 ${phone}`,
    `💼 ${position}`,
    `📝 ${experience || "—"}`,
  ].join("\n");

  try {
    await sendTelegramMessage(telegramText);
  } catch (notifyError) {
    console.error("[job-leads] telegram notify failed after successful write", {
      clientId,
      message:
        notifyError instanceof Error ? notifyError.message : String(notifyError),
    });
  }

  return NextResponse.json({ ok: true }, { status: 201, headers: CORS_HEADERS });
}
