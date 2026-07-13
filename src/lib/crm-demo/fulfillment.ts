import fs from "fs";
import path from "path";

import { markCrmDemoEmailSent } from "@/lib/crm-demo/delivery-status";
import { sendResendEmail } from "@/lib/email/resend";
import { buildMvpRedirectUrl, loadClientManifest } from "@/lib/manifest/storage";
import { deleteTempZipForClient, runStorageCleanup } from "@/lib/manifest/storage-manager";
import { resolveTempZipPath } from "@/lib/manifest/storage-paths";
import { buildCrmDemoZipBuffer, buildCrmDemoZipFilename, readManifestJson } from "@/lib/mvp-pro/zip-stream";
import { findPendingByClientId } from "@/lib/netlify/scheduler";
import { grantSiteDownloadAccess } from "@/lib/site-delivery/download-access";
import { clientDistExists, resolveClientDistPath } from "@/lib/site-delivery/dist-store";

const CRM_DEMO_SUBJECT = "Your CRM Demo is ready";
const RESEND_MAX_ATTACHMENT_BYTES = 35 * 1024 * 1024;

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
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

function buildCrmDemoEmailText(siteUrl: string, downloadUrl?: string): string {
  const zipNote = downloadUrl
    ? `The ZIP archive is too large for email attachment. Download it here:
${downloadUrl}`
    : "The ZIP archive of your project is attached to this email.";

  return `Hello.

Your CRM Demo has been successfully created.

Website:
${siteUrl}

${zipNote}

Thank you.`;
}

function resolveSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN ?? "saas-mvp-funnel-production.up.railway.app";
  return domain.startsWith("http") ? domain : `https://${domain}`;
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
  error?: string;
}> {
  console.log("[crm-demo] fulfillment start", {
    clientId: input.clientId,
    orderId: input.orderId ?? null,
    polarEmail: pickString(input.email) || null,
    resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    resendFromConfigured: Boolean(process.env.RESEND_FROM_EMAIL?.trim()),
  });

  const manifest = loadClientManifest(input.clientId);
  const manifestEmail = resolveQuestionnaireEmail(manifest as Record<string, unknown> | null);
  const polarEmail = pickString(input.email);
  const recipient = manifestEmail || polarEmail;

  console.log("[crm-demo] clientId=", input.clientId);
  console.log("[crm-demo] recipient=", recipient || "(empty)");
  console.log("[crm-demo] recipientSource=", manifestEmail ? "manifest.email" : polarEmail ? "polar.checkout" : "none");

  const pending = findPendingByClientId(input.clientId);
  const siteUrl = pending?.siteUrl
    ? buildMvpRedirectUrl(pending.siteUrl, input.clientId)
    : undefined;
  const distPath = resolveClientDistPath(input.clientId);
  const distReady = clientDistExists(input.clientId);

  console.log("[crm-demo] siteUrl=", siteUrl ?? "(missing)");
  console.log("[crm-demo] pendingSiteUrl=", pending?.siteUrl ?? "(missing)");
  console.log("[crm-demo] distPath=", distPath);
  console.log("[crm-demo] distExists=", distReady);

  if (!recipient) {
    console.error("[crm-demo] EMAIL_MISSING", {
      clientId: input.clientId,
      orderId: input.orderId,
      manifestEmail: manifestEmail || null,
      polarEmail: polarEmail || null,
    });
    return {
      emailed: false,
      emailSent: false,
      siteUrl,
      distReady,
      zipAttached: false,
      error: "EMAIL_MISSING",
    };
  }

  if (!siteUrl) {
    console.error("[crm-demo] SITE_URL_MISSING", {
      clientId: input.clientId,
      orderId: input.orderId,
      pendingFound: Boolean(pending),
    });
    return {
      emailed: false,
      emailSent: false,
      distReady,
      zipAttached: false,
      recipient,
      error: "SITE_URL_MISSING",
    };
  }

  let zipAttached = false;
  let zipBytes = 0;
  let downloadUrl: string | undefined;
  const attachments: { filename: string; content: Buffer }[] = [];

  if (!distReady) {
    console.error("[crm-demo] DIST_MISSING", {
      clientId: input.clientId,
      orderId: input.orderId,
      distPath,
    });
  } else {
    try {
      const manifestJson = readManifestJson(input.clientId);
      const zipBuffer = await buildCrmDemoZipBuffer({
        distPath,
        manifestJson,
      });
      zipBytes = zipBuffer.length;
      console.log("[crm-demo] zipBytes=", zipBytes);

      if (zipBytes === 0) {
        console.error("[crm-demo] ZIP_EMPTY", {
          clientId: input.clientId,
          orderId: input.orderId,
          distPath,
        });
      } else if (zipBytes > RESEND_MAX_ATTACHMENT_BYTES) {
        const token = grantSiteDownloadAccess(input.clientId);
        downloadUrl = `${resolveSiteBaseUrl()}/api/download-site?clientId=${encodeURIComponent(input.clientId)}&token=${encodeURIComponent(token)}`;
        console.error("[crm-demo] ZIP_TOO_LARGE", {
          clientId: input.clientId,
          orderId: input.orderId,
          zipBytes,
          maxBytes: RESEND_MAX_ATTACHMENT_BYTES,
          downloadUrl,
        });
      } else {
        const tempZipPath = resolveTempZipPath(input.clientId);
        fs.mkdirSync(path.dirname(tempZipPath), { recursive: true });
        fs.writeFileSync(tempZipPath, zipBuffer);
        attachments.push({
          filename: buildCrmDemoZipFilename(input.clientId),
          content: zipBuffer,
        });
        zipAttached = true;
      }
    } catch (error) {
      console.error("[crm-demo] ZIP_BUILD_FAILED", {
        clientId: input.clientId,
        orderId: input.orderId,
        distPath,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  console.log("[crm-demo] resend start", {
    clientId: input.clientId,
    recipient,
    from: resolveFromAddress(),
    zipAttached,
    zipBytes,
    resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
  });

  let resendResult;
  try {
    resendResult = await sendResendEmail({
      from: resolveFromAddress(),
      to: recipient,
      subject: CRM_DEMO_SUBJECT,
      text: buildCrmDemoEmailText(siteUrl, downloadUrl),
      attachments: attachments.length > 0 ? attachments : undefined,
      logPrefix: "[crm-demo] resend",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[crm-demo] resend threw", {
      clientId: input.clientId,
      orderId: input.orderId,
      recipient,
      error: message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.log("[crm-demo] EMAIL_SENT=false");
    return {
      emailed: false,
      emailSent: false,
      siteUrl,
      distReady,
      zipAttached,
      recipient,
      error: message,
    };
  }

  console.log("[crm-demo] resend response=", {
    ok: resendResult.ok,
    status: resendResult.status ?? null,
    body: resendResult.body ?? null,
    error: resendResult.error ?? null,
    from: resendResult.from ?? null,
    resendApiKeyConfigured: resendResult.resendApiKeyConfigured,
  });

  if (!resendResult.ok) {
    console.error("[crm-demo] EMAIL_SENT=false", {
      clientId: input.clientId,
      orderId: input.orderId,
      recipient,
      siteUrl,
      distReady,
      zipAttached,
      zipBytes,
      resendStatus: resendResult.status ?? null,
      resendBody: resendResult.body ?? null,
      resendError: resendResult.error ?? null,
    });
    return {
      emailed: false,
      emailSent: false,
      siteUrl,
      distReady,
      zipAttached,
      recipient,
      error: resendResult.error ?? "RESEND_FAILED",
    };
  }

  markCrmDemoEmailSent({
    clientId: input.clientId,
    recipient,
    siteUrl,
    orderId: input.orderId,
    zipAttached,
  });

  if (zipAttached) {
    deleteTempZipForClient(input.clientId);
  }
  runStorageCleanup();

  console.log("[crm-demo] EMAIL_SENT=true", {
    clientId: input.clientId,
    orderId: input.orderId,
    recipient,
    siteUrl,
    distReady,
    zipAttached,
    zipBytes,
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
