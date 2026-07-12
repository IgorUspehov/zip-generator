import { sendResendEmail, resolveClientLanguage, type ClientLanguage } from "@/lib/email/resend";
import { loadClientManifest } from "@/lib/manifest/storage";
import { findPendingByClientId } from "@/lib/netlify/scheduler";
import { grantSiteDownloadAccess } from "@/lib/site-delivery/download-access";
import { clientDistExists } from "@/lib/site-delivery/dist-store";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN ?? "saas-mvp-funnel-production.up.railway.app";
  return domain.startsWith("http") ? domain : `https://${domain}`;
}

function buildEmailCopy(language: ClientLanguage, siteUrl: string, downloadUrl: string) {
  const subjects = {
    ru: "Ваш сайт готов",
    de: "Ihre Website ist bereit",
    en: "Your site is ready",
  } as const;

  const zipNotes = {
    ru: "На всякий случай — файлы вашего сайта, если захотите перенести его на другой хостинг:",
    de: "Für alle Fälle — Ihre Website-Dateien, falls Sie sie später auf ein anderes Hosting umziehen möchten:",
    en: "Just in case — your site files if you ever want to move to another host:",
  } as const;

  const intros = {
    ru: "Оплата подтверждена. Ваш Website+CRM уже опубликован.",
    de: "Zahlung bestätigt. Ihr Website+CRM ist live.",
    en: "Payment confirmed. Your Website+CRM is live.",
  } as const;

  const bodies = {
    ru: `${intros.ru}\n\nСайт:\n${siteUrl}\n\n${zipNotes.ru}\n${downloadUrl}`,
    de: `${intros.de}\n\nWebsite:\n${siteUrl}\n\n${zipNotes.de}\n${downloadUrl}`,
    en: `${intros.en}\n\nSite:\n${siteUrl}\n\n${zipNotes.en}\n${downloadUrl}`,
  } as const;

  return {
    subject: subjects[language],
    text: bodies[language],
  };
}

export async function fulfillPaidSiteDelivery(input: {
  clientId: string;
  email?: string;
  orderId?: string;
  productName?: string;
}): Promise<{ emailed: boolean; siteUrl?: string; downloadUrl?: string; distReady: boolean }> {
  const manifest = loadClientManifest(input.clientId);
  const language = resolveClientLanguage(manifest?.language);
  const recipient =
    pickString(input.email) ||
    pickString(manifest?.email) ||
    pickString((manifest?.client_contacts as Record<string, unknown> | undefined)?.email);

  const pending = findPendingByClientId(input.clientId);
  const siteUrl = pending?.siteUrl;
  const distReady = clientDistExists(input.clientId);

  if (!recipient) {
    console.warn("[site-delivery] missing recipient email", { clientId: input.clientId });
    return { emailed: false, siteUrl, distReady };
  }

  if (!siteUrl) {
    console.warn("[site-delivery] missing siteUrl for paid client", { clientId: input.clientId });
    return { emailed: false, distReady };
  }

  const token = grantSiteDownloadAccess(input.clientId);
  const siteBaseUrl = resolveSiteBaseUrl();
  const downloadUrl = `${siteBaseUrl}/api/download-site?clientId=${encodeURIComponent(input.clientId)}&token=${encodeURIComponent(token)}`;
  const emailCopy = buildEmailCopy(language, siteUrl, downloadUrl);
  const emailed = await sendResendEmail({
    to: recipient,
    subject: emailCopy.subject,
    text: emailCopy.text,
  });

  console.log("[site-delivery] post-payment email", {
    clientId: input.clientId,
    orderId: input.orderId,
    productName: input.productName,
    recipient,
    siteUrl,
    downloadUrl,
    distReady,
    emailed,
  });

  return { emailed, siteUrl, downloadUrl, distReady };
}
