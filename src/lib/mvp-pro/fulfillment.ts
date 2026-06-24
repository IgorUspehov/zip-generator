import { appendNotification } from "@/lib/client-notifications/notification-store";
import { loadClientManifest } from "@/lib/manifest/storage";
import { LEMONSQUEEZY_VARIANT_MVP_PRO } from "@/lib/mvp-pro/constants";
import { snapshotClientDist } from "@/lib/mvp-pro/dist-resolver";
import { grantMvpProEntitlement, type MvpProEntitlement } from "@/lib/mvp-pro/entitlement-store";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLanguage(manifest: Record<string, unknown> | null): "ru" | "de" | "en" {
  const language = pickString(manifest?.language).toLowerCase();
  if (language === "ru" || language === "de" || language === "en") {
    return language;
  }
  return "en";
}

async function sendDownloadEmail(entitlement: MvpProEntitlement, downloadUrl: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return false;
  }

  const subjects = {
    ru: "Ваш MVP Pro готов к скачиванию",
    de: "Ihr MVP Pro ist zum Download bereit",
    en: "Your MVP Pro package is ready",
  } as const;

  const bodies = {
    ru: `Оплата MVP Pro подтверждена.\n\nСкачайте ZIP:\n${downloadUrl}\n\nClient ID: ${entitlement.clientId}`,
    de: `MVP Pro Zahlung bestätigt.\n\nZIP herunterladen:\n${downloadUrl}\n\nKunden-ID: ${entitlement.clientId}`,
    en: `MVP Pro payment confirmed.\n\nDownload your ZIP:\n${downloadUrl}\n\nClient ID: ${entitlement.clientId}`,
  } as const;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [entitlement.email],
      subject: subjects[entitlement.language],
      text: bodies[entitlement.language],
    }),
  });

  return response.ok;
}

export async function fulfillMvpProOrder(input: {
  clientId: string;
  email: string;
  orderId?: string;
  variantId?: string;
}): Promise<MvpProEntitlement> {
  const manifest = loadClientManifest(input.clientId);
  const language = resolveLanguage(manifest);
  const businessName = pickString(manifest?.business_name) || pickString(manifest?.businessName) || "MVP Pro Client";
  const businessType = pickString(manifest?.business_type) || pickString(manifest?.businessType) || "business";

  snapshotClientDist(input.clientId);

  const entitlement = grantMvpProEntitlement({
    clientId: input.clientId,
    email: input.email,
    language,
    businessName,
    businessType,
    orderId: input.orderId,
    variantId: input.variantId ?? LEMONSQUEEZY_VARIANT_MVP_PRO,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const downloadUrl = `${siteUrl}/api/download-zip?clientId=${encodeURIComponent(entitlement.clientId)}&token=${encodeURIComponent(entitlement.downloadToken)}`;

  const emailed = await sendDownloadEmail(entitlement, downloadUrl);

  appendNotification({
    event: "MVP_READY",
    language: entitlement.language,
    business_name: entitlement.businessName,
    email: entitlement.email,
    order_id: entitlement.orderId ?? entitlement.clientId,
  });

  console.log("[mvp-pro] fulfillment complete", {
    clientId: entitlement.clientId,
    emailed,
    downloadUrl,
  });

  return entitlement;
}
