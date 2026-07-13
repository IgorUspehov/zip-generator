export type ClientLanguage = "ru" | "de" | "en";

export function resolveClientLanguage(value: unknown): ClientLanguage {
  const language = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (language === "ru" || language === "de" || language === "en") {
    return language;
  }
  return "en";
}

export type ResendAttachment = {
  filename: string;
  content: Buffer;
};

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
  from?: string;
  attachments?: ResendAttachment[];
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = input.from ?? process.env.RESEND_FROM_EMAIL;
  if (!apiKey) {
    console.warn("[email/resend] RESEND_API_KEY is not configured");
    return false;
  }
  if (!from) {
    console.warn("[email/resend] from address is not configured");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      ...(input.attachments?.length
        ? {
            attachments: input.attachments.map((attachment) => ({
              filename: attachment.filename,
              content: attachment.content.toString("base64"),
            })),
          }
        : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[email/resend] send failed", { status: response.status, errorText });
    return false;
  }

  return true;
}
