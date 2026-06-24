import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

import OpenAI from "openai";
import { NextResponse } from "next/server";

import { DEFAULT_BUSINESS_TYPE, SECTOR_ID_TO_BUSINESS_TYPE } from "@/lib/sector-mapping";
import { buildCommercialData } from "@/lib/payment/payment-service";
import { cleanupClientDist, prepareClientDistWithOgImage } from "@/lib/og-image/prepare-client-dist";
import { createNetlifySite, uploadAndDeploy, deleteNetlifySite, resolveMvpDistPath } from "@/lib/netlify/deploy";
import { scheduleDeletion, startDeletionScheduler } from "@/lib/netlify/scheduler";
import {
  buildMvpRedirectUrl,
  saveClientManifest,
} from "@/lib/manifest/storage";
import { normalizeManifestMedia } from "@/lib/manifest/normalize-manifest-media";
import palettesData from "@/lib/palettes.json";
import promotionsData from "@/lib/niche-promotions.json";
import { pickRandomGalleryPhotos, pickRandomHeroPhoto } from "@/lib/manifest/niche-media";
import { pickNicheScenario } from "@/lib/manifest/niche-scenario";

const sectorMapping = { sector_id_to_business_type: SECTOR_ID_TO_BUSINESS_TYPE };

const QUESTIONNAIRE_PATH = path.join(process.cwd(), "input/client_onboarding_questionnaire.json");
const NETLIFY_TEMPLATE_URL =
  process.env.NETLIFY_TEMPLATE_URL ?? "https://harmonious-unicorn-e1596b.netlify.app";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

const BUSINESS_TYPE_TO_NICHE: Record<string, string> = {
  beauty_salon: "beauty",
  barbershop: "beauty",
  dental_clinic: "dental",
  health_clinic: "health_clinic",
  fitness_club: "fitness",
  fitness: "fitness",
  massage_salon: "massage",
  massage_salon_crm: "massage",
  car_service: "car_service",
  car_service_crm: "car_service",
  restaurant: "restaurant",
  restaurant_crm: "restaurant",
  hotel_booking: "hotel",
  real_estate: "real_estate",
  real_estate_crm: "real_estate",
  ecommerce: "ecommerce",
  ecommerce_crm: "ecommerce",
  education: "education",
  logistics: "logistics",
  logistics_crm: "logistics",
  delivery: "logistics",
  technology: "technology",
};

const BUSINESS_TYPE_DEFAULT_PAGES: Record<string, string[]> = {
  health_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  dental_clinic: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
  beauty_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  fitness_club: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  massage_salon_crm: ["dashboard", "clients", "appointments", "services", "staff", "settings"],
  restaurant: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  restaurant_crm: ["dashboard", "reservations", "tables", "menu", "staff", "settings"],
  car_service: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  car_service_crm: ["dashboard", "clients", "work_orders", "vehicles", "mechanics", "settings"],
  hotel_booking: ["dashboard", "guests", "rooms", "reservations", "housekeeping", "settings"],
  real_estate: ["dashboard", "properties", "agents", "clients", "viewings", "contracts", "settings"],
  real_estate_crm: ["dashboard", "properties", "agents", "clients", "viewings", "contracts", "settings"],
  education: ["dashboard", "students", "courses", "teachers", "appointments", "settings"],
  logistics: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  logistics_crm: ["dashboard", "routes", "drivers", "deliveries", "vehicles", "settings"],
  ecommerce: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  ecommerce_crm: ["dashboard", "products", "orders", "clients", "payments", "settings"],
  technology: ["dashboard", "products", "clients", "projects", "developers", "settings"],
};

const BUSINESS_TYPE_TO_PATTERN_DIR: Record<string, string> = {
  beauty_salon: "beauty_salon",
  barbershop: "beauty_salon",
  dental_clinic: "dental_clinic",
  health_clinic: "health_clinic",
  massage_salon: "massage_salon",
  massage_salon_crm: "massage_salon",
  fitness_club: "fitness_club",
  car_service: "car_service",
  car_service_crm: "car_service",
  restaurant: "restaurant",
  restaurant_crm: "restaurant",
  hotel_booking: "hotel_booking",
  real_estate: "real_estate",
  real_estate_crm: "real_estate",
  education: "school_management",
  logistics: "car_service",
  logistics_crm: "car_service",
  delivery: "car_service",
  ecommerce: "inventory_system",
  ecommerce_crm: "inventory_system",
  technology: "inventory_system",
};

function resolveBusinessType(body: Record<string, unknown>): string {
  const sectorId = String(body.sector_id ?? "").trim().toLowerCase();
  const mappedFromSector = sectorId
    ? sectorMapping.sector_id_to_business_type[sectorId]
    : undefined;

  return String(mappedFromSector ?? body.business_type ?? "beauty_salon").trim();
}

const DEFAULT_WORKING_HOURS = {
  monday: "09:00-18:00",
  tuesday: "09:00-18:00",
  wednesday: "09:00-18:00",
  thursday: "09:00-18:00",
  friday: "09:00-18:00",
  saturday: "10:00-15:00",
  sunday: "closed",
};

const DEFAULT_SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
  tiktok: "",
  website: "",
};

const REQUIRED_FIELDS = [
  "business_name",
  "business_type",
  "email",
  "phone",
  "telegram",
  "whatsapp",
  "address",
  "working_hours",
  "language",
  "currency",
  "website",
  "social_links",
  "logo",
] as const;

function resolvePatternDir(businessType: string): string {
  return BUSINESS_TYPE_TO_PATTERN_DIR[businessType] ?? businessType;
}

function loadPattern(businessType: string): string {
  const patternKey = resolvePatternDir(businessType);
  const patternDir = path.join(process.cwd(), "patterns", patternKey);
  const patternFile = path.join(patternDir, "pattern.json");
  if (fs.existsSync(patternFile)) {
    return fs.readFileSync(patternFile, "utf8");
  }
  const fallback = path.join(process.cwd(), "patterns", "beauty_salon", "pattern.json");
  if (fs.existsSync(fallback)) return fs.readFileSync(fallback, "utf8");
  return "{}";
}

function loadDemoData(businessType: string): string {
  const patternKey = resolvePatternDir(businessType);
  const demoFile = path.join(process.cwd(), "patterns", patternKey, "demo_data.json");
  if (fs.existsSync(demoFile)) return fs.readFileSync(demoFile, "utf8");
  return "{}";
}

function readQuestionnaire() {
  if (!fs.existsSync(QUESTIONNAIRE_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(QUESTIONNAIRE_PATH, "utf8")) as Record<string, unknown>;
}

function normalizePayload(body: Record<string, unknown>) {
  const website = String(body.website ?? "").trim();
  const socialLinks =
    typeof body.social_links === "object" && body.social_links !== null
      ? (body.social_links as Record<string, string>)
      : {};

  const payload = {
    business_name: String(body.business_name ?? "").trim(),
    business_type: resolveBusinessType(body),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    telegram: String(body.telegram ?? "").trim(),
    whatsapp: String(body.whatsapp ?? "").trim(),
    address: String(body.address ?? "").trim(),
    working_hours:
      typeof body.working_hours === "object" && body.working_hours !== null
        ? body.working_hours
        : DEFAULT_WORKING_HOURS,
    language: String(body.language ?? "ru").trim().toLowerCase(),
    currency: String(body.currency ?? "EUR").trim().toUpperCase(),
    website,
    social_links: {
      instagram: String(socialLinks.instagram ?? DEFAULT_SOCIAL_LINKS.instagram).trim(),
      facebook: String(socialLinks.facebook ?? DEFAULT_SOCIAL_LINKS.facebook).trim(),
      tiktok: String(socialLinks.tiktok ?? DEFAULT_SOCIAL_LINKS.tiktok).trim(),
      website: String(socialLinks.website ?? website).trim(),
    },
    logo: String(body.logo ?? "assets/logo.png").trim() || "assets/logo.png",
    business_questions:
      typeof body.business_questions === "object" && body.business_questions !== null
        ? (body.business_questions as Record<string, boolean>)
        : {},
    delivery_method: String(body.delivery_method ?? "zip").trim().toLowerCase() || "zip",
    plan_id: String(body.plan_id ?? "free").trim() || "free",
  };

  const planId = payload.plan_id;
  const commercial = buildCommercialData(planId, payload.currency, false);

  return {
    ...payload,
    plan_id: commercial.plan_id,
    plan: body.plan ? String(body.plan) : commercial.plan,
    amount: typeof body.amount === "number" ? body.amount : commercial.amount,
    currency: commercial.currency,
    payment_status: body.payment_status ? String(body.payment_status) : commercial.payment_status,
    terms_accepted: body.terms_accepted !== undefined ? Boolean(body.terms_accepted) : true,
    privacy_accepted: body.privacy_accepted !== undefined ? Boolean(body.privacy_accepted) : true,
    accepted_at:
      (body.terms_accepted !== undefined ? Boolean(body.terms_accepted) : true) &&
      (body.privacy_accepted !== undefined ? Boolean(body.privacy_accepted) : true)
        ? String(body.accepted_at ?? new Date().toISOString())
        : null,
  };
}

type MvpTheme = {
  primary: string;
  secondary: string;
  accent: string;
  hero_bg: string;
  text: string;
  border: string;
};

const palettes = palettesData as Record<string, MvpTheme[]>;

type PromoText = { ru: string; de: string; en: string };

const promotions = promotionsData as Record<string, PromoText[]>;

const PROMOTION_KEY_MAP: Record<string, string> = {
  restaurant_crm: "restaurant",
  massage_salon_crm: "massage_salon",
  car_service_crm: "car_service",
  fitness: "fitness_club",
  barbershop: "beauty_salon",
  ecommerce_crm: "ecommerce",
  logistics_crm: "logistics",
  delivery: "logistics",
};

function resolvePromotionKey(businessType: string): string {
  if (promotions[businessType]) {
    return businessType;
  }
  return PROMOTION_KEY_MAP[businessType] ?? businessType;
}

function pickRandomPromotion(businessType: string): PromoText {
  const key = resolvePromotionKey(businessType);
  const nichePromotions = promotions[key] ?? promotions.beauty_salon;
  return nichePromotions[Math.floor(Math.random() * nichePromotions.length)];
}

function pickRandomTheme(businessType: string): MvpTheme {
  const nichePalettes = palettes[businessType] ?? palettes.restaurant;
  return nichePalettes[Math.floor(Math.random() * nichePalettes.length)];
}

function buildMvpManifest(payload: Record<string, unknown>) {
  const businessType = String(payload.business_type ?? DEFAULT_BUSINESS_TYPE);
  const address = String(payload.address ?? "").trim();
  const city = address.split(",").pop()?.trim() || "München";
  const defaultPages =
    BUSINESS_TYPE_DEFAULT_PAGES[businessType] ?? [
      "dashboard",
      "clients",
      "appointments",
      "services",
      "settings",
    ];

  const theme = pickRandomTheme(businessType);
  const promotion = pickRandomPromotion(businessType);
  const galleryPhotos = pickRandomGalleryPhotos(businessType);
  const heroPhoto = pickRandomHeroPhoto(businessType);
  const scenario = pickNicheScenario(businessType);

  return {
    businessName: String(payload.business_name ?? "MVP Business"),
    niche: BUSINESS_TYPE_TO_NICHE[businessType] ?? "beauty",
    businessType,
    language: String(payload.language ?? "ru"),
    primaryColor: theme.accent,
    theme,
    promotion,
    scenario,
    galleryPhotos,
    heroPhoto,
    phone: String(payload.phone ?? ""),
    email: String(payload.email ?? ""),
    city,
    features: ["booking", "clients", "analytics"],
    pages: defaultPages,
    demoData: JSON.parse(loadDemoData(businessType) || "{}"),
    workingHours: payload.working_hours ?? DEFAULT_WORKING_HOURS,
  };
}

function normalizeManifestForTemplate(
  manifest: Record<string, unknown>,
  payload: Record<string, unknown>,
) {
  const fallback = buildMvpManifest(payload);
  const businessType = String(payload.business_type ?? fallback.businessType);
  const theme = pickRandomTheme(businessType);
  const promotion = pickRandomPromotion(businessType);
  const galleryPhotos = pickRandomGalleryPhotos(businessType);
  const heroPhoto = pickRandomHeroPhoto(businessType);
  const scenario = pickNicheScenario(businessType);

  return {
    ...fallback,
    ...manifest,
    businessName: String(manifest.businessName ?? fallback.businessName),
    niche: BUSINESS_TYPE_TO_NICHE[businessType] ?? String(manifest.niche ?? fallback.niche),
    businessType,
    language: String(manifest.language ?? payload.language ?? fallback.language),
    primaryColor: theme.accent,
    theme,
    promotion,
    scenario,
    galleryPhotos,
    heroPhoto,
    phone: String(manifest.phone ?? fallback.phone),
    email: String(manifest.email ?? fallback.email),
    city: String(manifest.city ?? fallback.city),
    features: Array.isArray(manifest.features) ? manifest.features : fallback.features,
    pages: BUSINESS_TYPE_DEFAULT_PAGES[businessType] ?? fallback.pages,
    demoData:
      typeof manifest.demoData === "object" && manifest.demoData !== null
        ? manifest.demoData
        : fallback.demoData,
    workingHours: manifest.workingHours ?? payload.working_hours ?? fallback.workingHours,
  };
}

function parseOrchestratorJson(raw: string): Record<string, unknown> {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(stripped) as Record<string, unknown>;
  } catch (firstError) {
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(stripped.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        throw firstError;
      }
    }
    throw firstError;
  }
}

async function buildMvpManifestWithOpenAI(payload: Record<string, unknown>) {
  const openai = getOpenAIClient();
  if (!openai) {
    return buildMvpManifest(payload);
  }

  const businessType = String(payload.business_type ?? DEFAULT_BUSINESS_TYPE);
  const pattern = loadPattern(businessType);
  const demoData = loadDemoData(businessType);

  const systemPrompt = `Ты оркестрант MVP Factory. 
Твоя задача — собрать конфигурацию CRM для клиента на основе его данных.
НЕ генерируй контент сам — используй только данные из опросника и паттерна.
Return ONLY valid JSON. No markdown, no backticks, no explanations.
Keep all string values under 100 characters.
Do NOT include demoData in the JSON — it is injected server-side.
Верни ТОЛЬКО валидный JSON без пояснений.`;

  const userPrompt = `
КРИТИЧЕСКОЕ ПРАВИЛО: Значение businessType в JSON СТРОГО равно "${payload.business_type}".
Запрещено менять его. Если business_type="${payload.business_type}" — возвращай только ${payload.business_type}.

Данные клиента из опросника:
${JSON.stringify(payload, null, 2)}

business_type клиента: ${payload.business_type}
Используй ИМЕННО эту нишу. Не меняй её.
СТРОГО используй businessType: '${businessType}'. Не меняй его.

Паттерн для ниши ${businessType}:
${pattern}

Demo данные для ниши:
${demoData}

Собери JSON конфигурацию MVP:
{
  "businessName": "имя из опросника",
  "niche": "ниша из опросника",
  "businessType": "business_type из опросника",
  "language": "язык из опросника",
  "phone": "телефон из опросника",
  "email": "email из опросника",
  "city": "город из адреса опросника",
  "features": ["модули из паттерна"],
  "pages": ["страницы из паттерна"],
  "workingHours": "часы работы из опросника"
}

НЕ включай поле demoData в ответ — демо-данные подставятся на сервере.
НЕ включай поля theme и primaryColor — цветовая схема подставится на сервере.

ОБЯЗАТЕЛЬНО верни поля:
- niche: точно одно из: beauty, dental, fitness, massage, car_service, health_clinic
- city: извлечь из поля address (последнее слово после запятой, или München если пусто)
- businessType: скопировать из опросника без изменений
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const rawJson = completion.choices[0]?.message?.content ?? "{}";
    const manifest = parseOrchestratorJson(rawJson);

    const businessTypeKey = String(payload.business_type ?? DEFAULT_BUSINESS_TYPE);
    manifest.businessType = businessTypeKey;
    delete manifest.demoData;
    manifest.niche = BUSINESS_TYPE_TO_NICHE[businessTypeKey] ?? "beauty";
    if (!manifest.city) {
      manifest.city =
        String(payload.address ?? "")
          .split(",")
          .pop()
          ?.trim() || "München";
    }

    const normalized = normalizeManifestForTemplate(manifest, payload);
    console.log("[client-questionnaire] manifest ready");
    return normalized;
  } catch (error) {
    console.error("[client-questionnaire] OpenAI orchestrator failed, using fallback manifest:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return buildMvpManifest(payload);
  }
}

export const runtime = "nodejs";

export async function GET() {
  const questionnaire = readQuestionnaire();
  if (!questionnaire) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }
  return NextResponse.json(questionnaire);
}

export async function POST(request: Request) {
  try {
    console.log("[client-questionnaire] POST started");
    const body = (await request.json()) as Record<string, unknown>;

    const payload = normalizePayload(body);
    console.log("[client-questionnaire] payload normalized:", {
      business_name: payload.business_name,
      business_type: payload.business_type,
      email: payload.email,
    });

    for (const field of REQUIRED_FIELDS) {
      if (!(field in payload)) {
        console.error("[client-questionnaire] missing required field:", field);
        return NextResponse.json({ ok: false, error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    fs.mkdirSync(path.dirname(QUESTIONNAIRE_PATH), { recursive: true });
    fs.writeFileSync(QUESTIONNAIRE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log("[client-questionnaire] questionnaire saved");

    const manifest = normalizeManifestMedia(
      (await buildMvpManifestWithOpenAI(payload)) as Record<string, unknown>,
    );
    const clientId = randomUUID();
    saveClientManifest(clientId, manifest);
    console.log("[client-questionnaire] manifest saved, clientId:", clientId);

    let siteId: string | undefined;
    let siteUrl: string | undefined;
    let deployId: string | undefined;
    let redirectUrl = buildMvpRedirectUrl(NETLIFY_TEMPLATE_URL, clientId);

    if (process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN) {
      try {
        const distPath = resolveMvpDistPath();
        console.log("[client-questionnaire] Netlify deploy starting:", { clientId, distPath });

        const netlifySite = await createNetlifySite(clientId);

        const clientDistPath = await prepareClientDistWithOgImage(
          clientId,
          distPath,
          manifest as Record<string, unknown>,
          netlifySite.siteUrl,
        );

        let deployResult: { deployId: string };
        try {
          deployResult = await uploadAndDeploy(netlifySite.siteId, clientDistPath);
        } catch (uploadError) {
          await deleteNetlifySite(netlifySite.siteId).catch((deleteError) => {
            console.error("[client-questionnaire] failed to delete orphaned site:", deleteError);
          });
          throw uploadError;
        } finally {
          cleanupClientDist(clientDistPath);
        }

        siteId = netlifySite.siteId;
        siteUrl = netlifySite.siteUrl;
        deployId = deployResult.deployId;
        redirectUrl = buildMvpRedirectUrl(siteUrl, clientId);
        console.log("[client-questionnaire] Netlify deploy success:", { siteId, siteUrl, deployId });

        scheduleDeletion({
          siteId,
          clientId,
          siteUrl,
          deployedAt: new Date().toISOString(),
        });
        startDeletionScheduler();
      } catch (netlifyError) {
        console.error("[client-questionnaire] Netlify deploy failed, falling back to shared template:", {
          error: netlifyError,
          message: netlifyError instanceof Error ? netlifyError.message : String(netlifyError),
          stack: netlifyError instanceof Error ? netlifyError.stack : undefined,
        });
      }
    } else {
      console.log("[client-questionnaire] Netlify token missing, using shared template URL");
    }

    console.log("[client-questionnaire] POST success:", { redirectUrl, siteId, siteUrl, deployId, clientId });

    return NextResponse.json({
      ok: true,
      success: true,
      redirectUrl,
      clientId,
      siteId,
      siteUrl,
      deployId,
      path: "input/client_onboarding_questionnaire.json",
    });
  } catch (error) {
    console.error("[client-questionnaire] POST failed:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const message = error instanceof Error ? error.message : "Failed to save questionnaire";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
