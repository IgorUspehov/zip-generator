/**
 * Owner Integrations catalog — honest status only.
 * Do not claim clickable export/deploy for integrations that have no owner action.
 */

export type OwnerIntegrationId =
  | "zip"
  | "github"
  | "netlify"
  | "railway"
  | "soundfire"
  | "firebase"
  | "redis";

export type OwnerIntegrationStatus =
  | "ready"
  | "coming_soon"
  | "not_configured"
  | "platform";

export type OwnerIntegrationInfo = {
  id: OwnerIntegrationId;
  status: OwnerIntegrationStatus;
  /** True when Owner UI exposes a real working action. */
  actionable: boolean;
  /** Official platform site — Owner/client can open and sign in themselves. */
  siteUrl?: string;
  note?: string;
};

/** Public platform URLs for Integrations card “open site” buttons. */
export const OWNER_INTEGRATION_SITE_URLS: Partial<
  Record<OwnerIntegrationId, string>
> = {
  github: "https://github.com/login",
  netlify: "https://app.netlify.com/login",
  railway: "https://railway.app/login",
  firebase: "https://console.firebase.google.com/",
  redis: "https://cloud.redis.io/",
  /** Polar checkout/dashboard for Deployable ZIP purchases. */
  zip: "https://polar.sh/",
};

function firebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  );
}

/**
 * Server-side status for Integrations panel.
 * Redis / SoundFire: not present in codebase (audit).
 * Netlify deploy path: deprecated in favor of Cloudflare.
 * GitHub: factory generators only — no Owner one-click export.
 */
export function resolveOwnerIntegrations(): OwnerIntegrationInfo[] {
  return [
    {
      id: "zip",
      status: "ready",
      actionable: true,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.zip,
      note: "Deployable ZIP Builder V2 (mode=owner)",
    },
    {
      id: "github",
      status: "coming_soon",
      actionable: false,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.github,
      note: "Factory GitHub package helpers exist; no Owner one-click push yet",
    },
    {
      id: "netlify",
      status: "coming_soon",
      actionable: false,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.netlify,
      note: "Netlify deploy is deprecated; live path uses Cloudflare Pages",
    },
    {
      id: "railway",
      status: "platform",
      actionable: false,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.railway,
      note: "SaaS hosting runs on Railway; no separate Owner deploy button",
    },
    {
      id: "soundfire",
      status: "coming_soon",
      actionable: false,
      note: "Not found in repository",
    },
    {
      id: "firebase",
      status: firebaseConfigured() ? "platform" : "not_configured",
      actionable: false,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.firebase,
      note: firebaseConfigured()
        ? "Firebase Admin is configured for platform APIs (leads/catalog); not exported in ZIP"
        : "Firebase Admin credentials are not configured on this server",
    },
    {
      id: "redis",
      status: "coming_soon",
      actionable: false,
      siteUrl: OWNER_INTEGRATION_SITE_URLS.redis,
      note: "Not found in repository",
    },
  ];
}
