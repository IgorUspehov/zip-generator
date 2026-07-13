import fs from "fs";
import path from "path";

import { markCrmDemoEmailSent } from "@/lib/crm-demo/delivery-status";
import { sendResendEmail } from "@/lib/email/resend";
import { buildMvpRedirectUrl, loadClientManifest } from "@/lib/manifest/storage";
import { deleteTempZipForClient, runStorageCleanup } from "@/lib/manifest/storage-manager";
import { resolveTempZipPath } from "@/lib/manifest/storage-paths";
import { findPendingByClientId } from "@/lib/netlify/scheduler";
import { clientDistExists, resolveClientDistPath } from "@/lib/site-delivery/dist-store";
import { buildCrmDemoZipBuffer, buildCrmDemoZipFilename, readManifestJson } from "@/lib/mvp-pro/zip-stream";

const CRM_DEMO_SUBJECT = "Your CRM Demo is ready";

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
      text: buildCrmDemoEmailText(siteUrl),
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
