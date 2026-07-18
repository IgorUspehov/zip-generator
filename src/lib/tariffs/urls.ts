import { POLAR_CHECKOUT_CRM_DEMO } from "@/lib/polar/constants";
import type { TariffContext } from "@/lib/tariffs/copy";

export function buildTariffsPagePath(ctx: Partial<TariffContext> & { lang?: string }): string {
  const params = new URLSearchParams();
  if (ctx.clientId) params.set("clientId", ctx.clientId);
  if (ctx.lang) params.set("lang", ctx.lang);
  if (ctx.businessName) params.set("businessName", ctx.businessName);
  if (ctx.ownerName) params.set("ownerName", ctx.ownerName);
  if (ctx.niche) params.set("niche", ctx.niche);
  if (ctx.city) params.set("city", ctx.city);
  if (ctx.phone) params.set("phone", ctx.phone);
  if (ctx.email) params.set("email", ctx.email);
  if (ctx.whatsapp) params.set("whatsapp", ctx.whatsapp);
  if (ctx.language) params.set("language", ctx.language);
  if (ctx.demoUrl) params.set("demo_url", ctx.demoUrl);
  const q = params.toString();
  return q ? `/tariffs?${q}` : "/tariffs";
}

export function buildTariffsPageUrl(
  ctx: Partial<TariffContext> & { lang?: string },
  siteOrigin?: string,
): string {
  const path = buildTariffsPagePath(ctx);
  const origin = (siteOrigin || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  return origin ? `${origin}${path}` : path;
}

export function buildCrmDemoPolarUrl(clientId: string, email?: string): string {
  const url = new URL(POLAR_CHECKOUT_CRM_DEMO);
  if (clientId) url.searchParams.set("reference_id", clientId);
  if (email?.trim()) url.searchParams.set("prefilled_email", email.trim());
  return url.toString();
}

export function buildFactoryBridgeApiPath(input: {
  clientId?: string;
  tier: "factory_ready" | "factory_custom";
  language?: string;
}): string {
  const params = new URLSearchParams();
  if (input.clientId) params.set("clientId", input.clientId);
  params.set("tier", input.tier);
  if (input.language) params.set("language", input.language);
  return `/api/factory-bridge?${params.toString()}`;
}
