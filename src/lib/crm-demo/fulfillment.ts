import { markCrmDemoEmailSent } from "@/lib/crm-demo/delivery-status";
import { sendResendEmail } from "@/lib/email/resend";
import { loadClientManifest } from "@/lib/manifest/storage";
import { findPendingByClientId } from "@/lib/netlify/scheduler";
import { clientDistExists, resolveClientDistPath } from "@/lib/site-delivery/dist-store";
import { buildCrmDemoZipBuffer, buildCrmDemoZipFilename, readManifestJson } from "@/lib/mvp-pro/zip-stream";

const CRM_DEMO_FROM = "onboarding@resend.dev";
const CRM_DEMO_SUBJECT = "Your CRM Demo is ready";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveQuestionnaireEmail(manifest: Record<string, unknown> | null): string {
  if (!manifest) {
    return "";
  }

  const topLevel = pickString(manifest.email);
  if (topLevel) {
    return topLevel;
  }

  const contacts = manifest.client_contacts as Record<string, unknown> | undefined;
  return pickString(contacts?.email);
}

function buildCrmDemoEmailText(siteUrl: string): string {
  return `Hello.

Your CRM Demo has been successfully created.

Website:
${siteUrl}

The ZIP archive of your project is attached to this email.

Thank you.`;
}

export async function fulfillCrmDemoOrder(input: {
  clientId: string;
  email?: string;
  orderId?: string;
}): Promise<{
  emailed: boolean;
  emailSent: boolean;
  siteUrl?: string;
  distReady: boolean;
  zipAttached: boolean;
  recipient?: string;
}> {
  const manifest = loadClientManifest(input.clientId);
  const recipient =
    resolveQuestionnaireEmail(manifest as Record<string, unknown> | null) || pickString(input.email);

  const pending = findPendingByClientId(input.clientId);
  const siteUrl = pending?.siteUrl;
  const distReady = clientDistExists(input.clientId);

  if (!recipient) {
    console.warn("[crm-demo] missing recipient email from questionnaire/manifest", {
      clientId: input.clientId,
      orderId: input.orderId,
    });
    return { emailed: false, emailSent: false, siteUrl, distReady, zipAttached: false };
  }

  if (!siteUrl) {
    console.warn("[crm-demo] missing siteUrl for paid client", { clientId: input.clientId, orderId: input.orderId });
    return { emailed: false, emailSent: false, distReady, zipAttached: false, recipient };
  }

  let zipAttached = false;
  const attachments: { filename: string; content: Buffer }[] = [];

  if (distReady) {
    try {
      const distPath = resolveClientDistPath(input.clientId);
      const manifestJson = readManifestJson(input.clientId);
      const zipBuffer = await buildCrmDemoZipBuffer({
        distPath,
        manifestJson,
      });
      attachments.push({
        filename: buildCrmDemoZipFilename(input.clientId),
        content: zipBuffer,
      });
      zipAttached = true;
    } catch (error) {
      console.error("[crm-demo] failed to build ZIP attachment", {
        clientId: input.clientId,
        orderId: input.orderId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    console.warn("[crm-demo] dist snapshot missing, sending email without ZIP", {
      clientId: input.clientId,
      orderId: input.orderId,
    });
  }

  let emailed = false;
  try {
    emailed = await sendResendEmail({
      from: CRM_DEMO_FROM,
      to: recipient,
      subject: CRM_DEMO_SUBJECT,
      text: buildCrmDemoEmailText(siteUrl),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  } catch (error) {
    console.error("[crm-demo] email send threw", {
      clientId: input.clientId,
      orderId: input.orderId,
      recipient,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (!emailed) {
    console.error("[crm-demo] email send failed — order unlock is not rolled back", {
      clientId: input.clientId,
      orderId: input.orderId,
      recipient,
      siteUrl,
      distReady,
      zipAttached,
    });
    return { emailed: false, emailSent: false, siteUrl, distReady, zipAttached, recipient };
  }

  markCrmDemoEmailSent({
    clientId: input.clientId,
    recipient,
    siteUrl,
    orderId: input.orderId,
    zipAttached,
  });

  console.log("[crm-demo] fulfillment complete", {
    clientId: input.clientId,
    orderId: input.orderId,
    recipient,
    siteUrl,
    distReady,
    zipAttached,
    EMAIL_SENT: true,
  });

  return {
    emailed: true,
    emailSent: true,
    siteUrl,
    distReady,
    zipAttached,
    recipient,
  };
}
