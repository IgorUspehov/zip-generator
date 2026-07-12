export type ClientLanguage = "ru" | "de" | "en";

export function resolveClientLanguage(value: unknown): ClientLanguage {
  const language = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (language === "ru" || language === "de" || language === "en") {
    return language;
  }
  return "en";
}

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn("[email/resend] RESEND_API_KEY or RESEND_FROM_EMAIL is not configured");
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
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[email/resend] send failed", { status: response.status, errorText });
    return false;
  }

  return true;
}
