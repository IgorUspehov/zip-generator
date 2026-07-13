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

export type ResendSendResult = {
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
  from?: string;
  resendApiKeyConfigured: boolean;
};

export async function sendResendEmail(input: {
  to: string;
  subject: string;
  text: string;
  from?: string;
  attachments?: ResendAttachment[];
  logPrefix?: string;
}): Promise<ResendSendResult> {
  const logPrefix = input.logPrefix ?? "[email/resend]";
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = input.from ?? process.env.RESEND_FROM_EMAIL?.trim();
  const resendApiKeyConfigured = Boolean(apiKey);

  if (!apiKey) {
    const error = "RESEND_API_KEY is not configured";
    console.error(`${logPrefix} ${error}`);
    return { ok: false, error, resendApiKeyConfigured };
  }
  if (!from) {
    const error = "from address is not configured";
    console.error(`${logPrefix} ${error}`);
    return { ok: false, error, from, resendApiKeyConfigured };
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

  const body = await response.text();

  if (!response.ok) {
    const error = `Resend API error (${response.status}): ${body}`;
    console.error(`${logPrefix} send failed`, {
      status: response.status,
      body,
      to: input.to,
      from,
    });
    return {
      ok: false,
      status: response.status,
      body,
      error,
      from,
      resendApiKeyConfigured,
    };
  }

  return {
    ok: true,
    status: response.status,
    body,
    from,
    resendApiKeyConfigured,
  };
}
