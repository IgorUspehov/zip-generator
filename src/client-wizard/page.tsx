"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  buildQuestionnairePayload,
  fetchPreviewLatest,
  saveQuestionnaire,
  SECTOR_TO_BUSINESS_TYPE,
} from "@/client-wizard/api";
import { getCopy, type UiLang } from "@/client-wizard/copy";
import { getPayTranslations } from "@/client-wizard/pay-translations";
import { getTierTranslations } from "@/client-wizard/tier-translations";
import { DEFAULT_BUSINESS_TYPE } from "@/lib/sector-mapping";
import { executeRecaptcha } from "@/lib/recaptcha/client";
import type { ResultApiResponse, StepId } from "@/client-wizard/types";

import "@/client-wizard/styles.css";

const LEMONSQUEEZY_STORE_HOST = "https://mvpfactory.lemonsqueezy.com";
const LEMONSQUEEZY_VARIANT_MVP_DEMO = "1801729";
const LEMONSQUEEZY_VARIANT_MVP_PRO = "1807661";
const LEMONSQUEEZY_VARIANT_CRM_FULL = "1807671";

const PADDLE_PRODUCT_MVP_PRO = "pri_01kvwyb0r4rpvv3xrfbyths7tw";
const PADDLE_PRODUCT_CRM_FULL = "pri_01kvwyk2kmmfagkfp4am68zner";

const PROMO_CODE = "serafim01";
const POLAR_CHECKOUT_99 =
  "https://buy.polar.sh/polar_cl_uUpNQRXBAVubDpDO3zwLa5SAswkU0Jkr2835A04UF1F";

function ProgressBar({ step }: { step: "s1" | "s2" }) {
  const dots = step === "s1" ? ["active", ""] : ["done", "active"];

  return (
    <div className="progress">
      {dots.map((state, index) => (
        <div key={index} className={`progress-dot ${state}`.trim()} />
      ))}
    </div>
  );
}

function WizardStepNav({
  children,
  layout = "split",
}: {
  children: ReactNode;
  layout?: "split" | "triple" | "single";
}) {
  const layoutClass =
    layout === "triple"
      ? "wizard-step-nav wizard-step-nav--triple"
      : layout === "single"
        ? "wizard-step-nav wizard-step-nav--single"
        : "wizard-step-nav";

  return <div className={layoutClass}>{children}</div>;
}

function buildPreviewBodyHtml(
  name: string,
  sector: { icon: string; label: string },
  langAttr: string,
): string {
  return `<span class="preview-line-h">&lt;!-- ${name} --&gt;</span>
<span class="preview-line-g">&lt;html lang="${langAttr}"&gt;</span>
<span class="preview-line-y">  &lt;head&gt;</span>
    &lt;title&gt;${name}&lt;/title&gt;
    &lt;link rel="manifest" href="/manifest.json"&gt;
<span class="preview-line-y">  &lt;/head&gt;</span>
<span class="preview-line-y">  &lt;body&gt;</span>
<span class="preview-line-h">    &lt;!-- ${sector.icon} ${sector.label} Platform --&gt;</span>
    &lt;nav&gt;${name}&lt;/nav&gt;
    &lt;main&gt;...&lt;/main&gt;
    &lt;script src="/app.js"&gt;&lt;/script&gt;
<span class="preview-line-y">  &lt;/body&gt;</span>
<span class="preview-line-g">&lt;/html&gt;</span>`;
}

function resolveDeliveryOption(
  result: ResultApiResponse | null,
  key: string,
): { available: boolean; href?: string } {
  if (!result?.delivery_options) {
    return { available: false, href: undefined };
  }
  const option = result.delivery_options.find((item) => item.key === key);
  if (!option?.available || !option.href) {
    return { available: false, href: undefined };
  }
  return { available: true, href: option.href };
}

function DeliveryLink({
  result,
  optionKey,
  id,
  children,
}: {
  result: ResultApiResponse | null;
  optionKey: string;
  id?: string;
  children: ReactNode;
}) {
  if (!result?.delivery_options) {
    return (
      <div className="dl-btn disabled" id={id}>
        {children}
      </div>
    );
  }

  const { available, href } = resolveDeliveryOption(result, optionKey);

  if (!available || !href) {
    return (
      <div className="dl-btn disabled" id={id}>
        {children}
      </div>
    );
  }

  const external = href.startsWith("http");

  return (
    <a
      href={href}
      id={id}
      className="dl-btn"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={optionKey === "zip" ? "final_package.zip" : undefined}
    >
      {children}
    </a>
  );
}

function buildPayHref(input: {
  demoUrl: string;
  siteId?: string;
  clientId?: string;
  email: string;
  name: string;
  variantId?: string;
}) {
  const variantId = input.variantId ?? LEMONSQUEEZY_VARIANT_MVP_DEMO;

  if (variantId === LEMONSQUEEZY_VARIANT_MVP_DEMO) {
    const params = new URLSearchParams();
    params.set("demo_url", input.demoUrl);
    if (input.siteId) {
      params.set("site_id", input.siteId);
    }
    if (input.clientId) {
      params.set("client_id", input.clientId);
    }
    params.set("email", input.email);
    params.set("name", input.name);
    return `/pay?${params.toString()}`;
  }

  if (variantId === LEMONSQUEEZY_VARIANT_MVP_PRO) {
    const paddleUrl = new URL(`https://buy.paddle.com/product/${PADDLE_PRODUCT_MVP_PRO}`);
    if (input.email) paddleUrl.searchParams.set("prefilled_email", input.email);
    return paddleUrl.toString();
  }

  if (variantId === LEMONSQUEEZY_VARIANT_CRM_FULL) {
    const polarUrl = new URL("https://buy.polar.sh/polar_cl_qVHaJpa4Zon7ZJjZNAI6UNDt7vkLdV0enAUZc085fTu");
    if (input.email) polarUrl.searchParams.set("prefilled_email", input.email);
    return polarUrl.toString();
  }

  const params = new URLSearchParams();
  params.set("checkout[email]", input.email);
  params.set("checkout[name]", input.name);
  params.set("checkout[custom][demo_url]", input.demoUrl);
  if (input.siteId) {
    params.set("checkout[custom][site_id]", input.siteId);
  }
  if (input.clientId) {
    params.set("checkout[custom][client_id]", input.clientId);
  }
  if (input.clientId && typeof window !== "undefined") {
    params.set(
      "checkout[product_options][redirect_url]",
      `${window.location.origin}/success?clientId=${encodeURIComponent(input.clientId)}&tier=mvp_pro&email=${encodeURIComponent(input.email)}`,
    );
  }
  return `${LEMONSQUEEZY_STORE_HOST}/buy/${variantId}?${params.toString()}`;
}

function resolveDemoUrl(
  deployMeta: { demoUrl: string } | null,
  pendingRedirectUrl: string | null,
  result: ResultApiResponse | null,
): string | null {
  if (deployMeta?.demoUrl) {
    return deployMeta.demoUrl;
  }
  if (pendingRedirectUrl) {
    return pendingRedirectUrl;
  }
  const netlify = resolveDeliveryOption(result, "netlify");
  return netlify.href ?? null;
}

function PricingTiersBlock({
  payHref,
  payHrefPro,
  payHrefFull,
  lang,
  clientId,
  email,
}: {
  payHref: string;
  payHrefPro: string;
  payHrefFull: string;
  lang: UiLang;
  clientId?: string;
  email?: string;
}) {
  const payCopy = getPayTranslations(lang);
  const tierCopy = getTierTranslations(lang);
  const [proDownloadToken, setProDownloadToken] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId || !email?.trim()) {
      setProDownloadToken(null);
      return;
    }

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const params = new URLSearchParams({
          clientId,
          email: email.trim(),
        });
        const response = await fetch(`/api/mvp-pro/status?${params.toString()}`);
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { ready?: boolean; downloadToken?: string };
        if (!cancelled && data.ready && data.downloadToken) {
          setProDownloadToken(data.downloadToken);
        }
      } catch {
        /* ignore polling errors */
      }
    };

    void pollStatus();
    const timer = window.setInterval(() => {
      void pollStatus();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [clientId, email]);

  const handleDownloadProZip = () => {
    if (!clientId || !proDownloadToken) {
      return;
    }
    const params = new URLSearchParams({
      clientId,
      token: proDownloadToken,
    });
    window.open(`/api/download-zip?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pricing-tiers-section">
      <hr className="pricing-tiers-divider" />
      <h3 className="pricing-tiers-title">{tierCopy.choosePlan}</h3>
      <div className="pricing-tiers-grid">
        <article className="pricing-tier-card">
          <div className="pricing-tier-icon" aria-hidden>
            ⚡
          </div>
          <h4 className="pricing-tier-name">{tierCopy.mvpDemo.name}</h4>
          <div className="pricing-tier-price">€99</div>
          <p className="pricing-tier-desc">{tierCopy.mvpDemo.description}</p>
          <Link href={payHref} className="pricing-tier-btn pricing-tier-btn--primary">
            {payCopy.keepForever}
          </Link>
        </article>

        <article className="pricing-tier-card pricing-tier-card--popular">
          <span className="pricing-tier-badge">{tierCopy.popular}</span>
          <div className="pricing-tier-icon" aria-hidden>
            🚀
          </div>
          <h4 className="pricing-tier-name">{tierCopy.mvpPro.name}</h4>
          <div className="pricing-tier-price">€499</div>
          <p className="pricing-tier-desc">{tierCopy.mvpPro.description}</p>
          {proDownloadToken && clientId ? (
            <button type="button" className="pricing-tier-btn pricing-tier-btn--primary" onClick={handleDownloadProZip}>
              {tierCopy.downloadZip}
            </button>
          ) : (
            <a
              href={payHrefPro}
              className="pricing-tier-btn"
              target="_blank"
              rel="noreferrer"
            >
              €499
            </a>
          )}
        </article>

        <article className="pricing-tier-card">
          <div className="pricing-tier-icon" aria-hidden>
            💎
          </div>
          <h4 className="pricing-tier-name">{tierCopy.crmFull.name}</h4>
          <div className="pricing-tier-price">€999</div>
          <p className="pricing-tier-desc">{tierCopy.crmFull.description}</p>
          <a
            href={payHrefFull}
            className="pricing-tier-btn"
            target="_blank"
            rel="noreferrer"
          >
            {tierCopy.crmFull.contact}
          </a>
        </article>
      </div>
    </div>
  );
}

function buildQuestionnairePayloadFromWizard(input: {
  name: string;
  businessName: string;
  email: string;
  businessType: string;
  language: string;
}) {
  return {
    ...buildQuestionnairePayload(input),
    phone: (document.getElementById("f-phone") as HTMLInputElement)?.value || "",
    whatsapp: (document.getElementById("f-whatsapp") as HTMLInputElement)?.value || "",
    telegram: (document.getElementById("f-telegram") as HTMLInputElement)?.value || "",
  };
}

export function ClientWizardPage() {
  const [lang, setLang] = useState<UiLang>("en");
  const copy = getCopy(lang);

  const [step, setStep] = useState<StepId>("s1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selSector, setSelSector] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);
  const [deployMeta, setDeployMeta] = useState<{
    demoUrl: string;
    siteId?: string;
    clientId?: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState("https://—.netlify.app");
  const [previewTitle, setPreviewTitle] = useState("—");
  const [previewSub, setPreviewSub] = useState("—");
  const [publishCountdown, setPublishCountdown] = useState<number | null>(null);
  const [autoAdvancedToPreview, setAutoAdvancedToPreview] = useState(false);
  const [siteAccessGranted, setSiteAccessGranted] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  const livePreviewUrl = pendingRedirectUrl ?? deployMeta?.demoUrl ?? previewUrl;
  const promoApplied = promoInput.trim().toLowerCase() === PROMO_CODE;

  useEffect(() => {
    if (!siteAccessGranted || !pendingRedirectUrl) {
      setPublishCountdown(null);
      return;
    }

    setPublishCountdown(30);
    const timer = window.setInterval(() => {
      setPublishCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [siteAccessGranted, pendingRedirectUrl]);

  const publishCountdownText =
    publishCountdown !== null && publishCountdown > 0
      ? copy.s4_publishing.replace("{n}", String(publishCountdown))
      : null;

  useEffect(() => {
    if (step !== "s5") {
      return;
    }

    let active = true;
    const sector = copy.sectors.find((item) => item.id === selSector);

    setPreviewTitle(name.trim() || "—");
    setPreviewSub(sector ? `${sector.icon} ${sector.label}` : "—");
    setPreviewUrl(pendingRedirectUrl ?? deployMeta?.demoUrl ?? "https://—.netlify.app");

    void (async () => {
      try {
        const preview = await fetchPreviewLatest();
        if (!active) {
          return;
        }
        if (!preview.ok) {
          return;
        }
        if (preview.preview_url) {
          setPreviewUrl(preview.preview_url);
        }
        if (preview.business_name) {
          setPreviewTitle(preview.business_name);
        }
        if (preview.business_type) {
          const matchedSector = copy.sectors.find(
            (item) => SECTOR_TO_BUSINESS_TYPE[item.id] === preview.business_type,
          );
          setPreviewSub(
            matchedSector
              ? `${matchedSector.icon} ${matchedSector.label}`
              : preview.business_type,
          );
        }
      } catch {
        /* keep fallback preview from wizard state */
      }
    })();

    return () => {
      active = false;
    };
  }, [copy.sectors, deployMeta, name, pendingRedirectUrl, selSector, step]);

  const goTo = useCallback((id: StepId) => {
    setStep(id);
  }, []);

  useEffect(() => {
    if (step !== "s4" || isGenerating || !pendingRedirectUrl || autoAdvancedToPreview) {
      return;
    }
    setAutoAdvancedToPreview(true);
    goTo("s5");
  }, [autoAdvancedToPreview, goTo, isGenerating, pendingRedirectUrl, step]);

  const shakeInput = useCallback((setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 500);
  }, []);

  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [sectorErr, setSectorErr] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);

  const runBuild = useCallback(
    async (contactName: string) => {
      setIsGenerating(true);

      const businessType = SECTOR_TO_BUSINESS_TYPE[selSector ?? ""] ?? DEFAULT_BUSINESS_TYPE;
      const languageCode = lang;
      const payload = {
        ...buildQuestionnairePayloadFromWizard({
          name: contactName,
          businessName: contactName,
          email: email.trim(),
          businessType,
          language: languageCode,
        }),
        terms_accepted: agbAccepted,
        privacy_accepted: agbAccepted,
      };

      try {
        const recaptchaToken = await executeRecaptcha("submit_questionnaire");
        const data = await saveQuestionnaire(payload, recaptchaToken);
        if (data.redirectUrl) {
          setPendingRedirectUrl(data.redirectUrl);
          setDeployMeta({
            demoUrl: data.siteUrl || data.redirectUrl,
            siteId: data.siteId,
            clientId: data.clientId,
          });
          setIsGenerating(false);
          return;
        }
        throw new Error("No redirect URL returned");
      } catch (error) {
        console.error("POST /api/client-questionnaire failed:", error);
        setIsGenerating(false);
        goTo("s2");
      }
    },
    [agbAccepted, email, goTo, lang, selSector],
  );

  function goRestart() {
    setIsGenerating(false);
    setPendingRedirectUrl(null);
    setDeployMeta(null);
    setSelSector(null);
    setName("");
    setEmail("");
    for (const id of ["f-phone", "f-whatsapp", "f-telegram"]) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = "";
    }
    setAgbAccepted(false);
    setPublishCountdown(null);
    setAutoAdvancedToPreview(false);
    setSiteAccessGranted(false);
    setShowPromo(false);
    setPromoInput("");
    goTo("s1");
  }

  function go1() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      shakeInput(setNameErr);
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      shakeInput(setEmailErr);
      return;
    }
    void executeRecaptcha("wizard_step_1");
    goTo("s2");
  }

  function go2() {
    if (!selSector) {
      setSectorErr(true);
      setTimeout(() => setSectorErr(false), 800);
      return;
    }
    if (!agbAccepted) {
      return;
    }
    void executeRecaptcha("wizard_step_2");
    goTo("s4");
    void runBuild(name.trim());
  }

  async function handleYes() {
    setSiteAccessGranted(false);
    setShowPromo(false);
    setPromoInput("");
    goTo("s6");
  }

  function handlePayOrUnlock() {
    if (promoApplied) {
      setSiteAccessGranted(true);
      return;
    }

    const polarUrl = new URL(POLAR_CHECKOUT_99);
    if (email.trim()) {
      polarUrl.searchParams.set("prefilled_email", email.trim());
    }
    window.location.href = polarUrl.toString();
  }

  const stepClass = (id: StepId) => (step === id ? "step active" : "step");

  return (
    <div className="mf-root">
      <div className="shell">
        <div className="glow" />

        <div className="ui-lang">
          {(["en", "de", "ru"] as UiLang[]).map((code) => (
            <button
              key={code}
              type="button"
              className={`ui-lang-btn ${lang === code ? "active" : ""}`}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="card">
          {/* STEP 1 */}
          <div className={stepClass("s1")} id="s1">
            <ProgressBar step="s1" />
            <div className="step-label">{copy.s1_label}</div>
            <div className="step-h step-h-intro">{copy.s1_intro}</div>
            <div className="field">
              <label className="inp-label" htmlFor="f-name">
                {copy.lbl_name}
              </label>
              <input
                id="f-name"
                className={`inp ${nameErr ? "err shake" : ""}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.ph_name}
              />
            </div>
            <div className="field">
              <label className="inp-label" htmlFor="f-email">
                {copy.lbl_email}
              </label>
              <input
                id="f-email"
                className={`inp ${emailErr ? "err shake" : ""}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anna@example.com"
              />
            </div>
            <div className="field">
              <label className="inp-label" htmlFor="f-phone">
                Phone
              </label>
              <input id="f-phone" className="inp" type="tel" placeholder="+49 152..." />
            </div>
            <div className="field">
              <label className="inp-label" htmlFor="f-whatsapp">
                WhatsApp
              </label>
              <input id="f-whatsapp" className="inp" type="tel" placeholder="+49 152..." />
            </div>
            <div className="field">
              <label className="inp-label" htmlFor="f-telegram">
                Telegram
              </label>
              <input id="f-telegram" className="inp" type="text" placeholder="@username" />
            </div>
            <WizardStepNav>
              <Link href="/" className="btn-back btn-nav-secondary">
                <span>{copy.btn_back}</span>
              </Link>
              <button type="button" className="btn-primary btn-nav-primary" onClick={go1}>
                <span>{copy.btn_next}</span>
              </button>
            </WizardStepNav>
          </div>

          {/* STEP 2 */}
          <div className={stepClass("s2")} id="s2">
            <ProgressBar step="s2" />
            <div className="step-label">{copy.s2_label}</div>
            <div className="step-h">{copy.s2_h}</div>
            <div className="step-sub">{copy.s2_sub}</div>
            <select
              className={`inp ${sectorErr ? "err" : ""}`}
              id="sector-select"
              value={selSector ?? ""}
              onChange={(e) => setSelSector(e.target.value || null)}
              style={{ fontSize: 15, padding: "14px 16px", marginBottom: 8 }}
            >
              <option value="">{copy.s2_placeholder}</option>
              {copy.sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.icon} {sector.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <input
                type="checkbox"
                id="agb-checkbox"
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
              />
              {copy.agb_accept}{" "}
              <a href="/agb" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {copy.agb_terms}
              </a>{" "}
              {copy.agb_and}{" "}
              <a
                href="/datenschutz"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {copy.agb_privacy}
              </a>
            </label>
            <WizardStepNav>
              <button type="button" className="btn-back btn-nav-secondary" onClick={() => goTo("s1")}>
                <span>{copy.btn_back}</span>
              </button>
              <button
                type="button"
                className="btn-primary btn-nav-primary"
                onClick={go2}
                disabled={!agbAccepted}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{copy.btn_generate}</span>
              </button>
            </WizardStepNav>
          </div>

          {/* STEP 4 */}
          <div className={stepClass("s4")} id="s4">
            <div className="build-wrap">
              {isGenerating ? <div className="build-spinner" id="build-spinner" /> : null}
              <div className="step-h" style={{ textAlign: "center" }}>
                ⚡ {copy.s4_h}
              </div>
              <div className="step-sub" style={{ textAlign: "center", marginBottom: 0 }} id="s4-biz-name">
                {name.trim()}
              </div>
              {isGenerating ? (
                <p className="step-sub" style={{ textAlign: "center", marginTop: 12 }}>
                  {copy.s4_generating}
                </p>
              ) : pendingRedirectUrl ? (
                <p className="step-sub" style={{ textAlign: "center", marginTop: 12, fontWeight: 600 }}>
                  {copy.s4_build_done}
                </p>
              ) : null}
            </div>
            <WizardStepNav>
              <button
                type="button"
                className="btn-back btn-nav-secondary"
                onClick={() => goTo("s2")}
                disabled={isGenerating}
              >
                <span>{copy.btn_back}</span>
              </button>
              <button
                type="button"
                className="btn-primary btn-nav-primary"
                onClick={() => goTo("s5")}
                disabled={!pendingRedirectUrl || isGenerating}
              >
                <span>{copy.btn_review}</span>
              </button>
            </WizardStepNav>
          </div>

          {/* STEP 5 */}
          <div className={stepClass("s5")} id="s5">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span
                className="pd"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>{copy.s5_live}</span>
            </div>
            <div className="step-h" style={{ marginBottom: 6 }} id="s5-title">
              {previewTitle}
            </div>
            <div className="step-sub" id="s5-sub">
              {previewSub}
            </div>
            <div className="preview-frame" style={{ padding: 0, overflow: "hidden" }}>
              <iframe
                title="Live Website+CRM preview"
                src={livePreviewUrl}
                className="wizard-live-preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>

            <div className="step-sub" style={{ marginBottom: 16 }}>
              {copy.s5_q}
            </div>
            <WizardStepNav layout="triple">
              <button type="button" className="btn-back btn-nav-secondary" onClick={() => goTo("s4")}>
                <span>{copy.btn_back}</span>
              </button>
              <button type="button" className="btn-yes btn-nav-choice" onClick={() => void handleYes()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{copy.btn_yes}</span>
              </button>
              <button type="button" className="btn-no btn-nav-choice" onClick={goRestart}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                <span>{copy.btn_no}</span>
              </button>
            </WizardStepNav>
          </div>

          {/* STEP 6 */}
          <div className={stepClass("s6")} id="s6">
            {siteAccessGranted && pendingRedirectUrl ? (
              <>
                <div className="build-wrap">
                  <div className="step-h" style={{ textAlign: "center" }}>
                    {copy.s4_ready}
                  </div>
                  <div className="step-sub" style={{ textAlign: "center", marginBottom: 0 }}>
                    {name.trim()}
                  </div>
                  <div style={{ marginTop: 28, textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        value={pendingRedirectUrl}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid #cbd5e1",
                          background: "#f8fafc",
                          color: "#0f172a",
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="button"
                        className="btn-primary"
                        style={{
                          flexShrink: 0,
                          marginBottom: 0,
                          padding: "10px 16px",
                          fontSize: 14,
                        }}
                        onClick={() => void navigator.clipboard.writeText(pendingRedirectUrl)}
                      >
                        {copy.s4_copy_link}
                      </button>
                    </div>
                    {publishCountdownText ? (
                      <p
                        className="step-sub"
                        style={{ textAlign: "center", marginBottom: 12, fontWeight: 600 }}
                      >
                        {publishCountdownText}
                      </p>
                    ) : (
                      <a
                        href={pendingRedirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          marginBottom: 0,
                        }}
                      >
                        {copy.s4_open}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                    fontWeight: 500,
                    marginTop: 24,
                  }}
                  onClick={goRestart}
                >
                  <span>{copy.btn_restart}</span>
                </button>
              </>
            ) : (
              <>
                <div className="step-h" style={{ marginBottom: 8 }}>
                  {copy.s6_pay_h}
                </div>
                <div className="step-sub" style={{ marginBottom: 20 }}>
                  {previewTitle}
                </div>
                <div className="wizard-pay-actions">
                  <button
                    type="button"
                    className="wizard-pay-action-btn"
                    onClick={() => setShowPromo((current) => !current)}
                  >
                    {copy.s6_promo_button}
                  </button>
                  <button
                    type="button"
                    className="wizard-pay-action-btn"
                    onClick={() => handlePayOrUnlock()}
                    disabled={promoApplied && !promoInput.trim()}
                  >
                    {promoApplied ? copy.s6_promo_unlock : copy.s6_pay_button}
                  </button>
                </div>
                {showPromo ? (
                  <div style={{ marginTop: 12 }}>
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={copy.s6_promo_placeholder}
                      className={`inp ${
                        promoInput && !promoApplied
                          ? "err"
                          : promoApplied
                            ? ""
                            : ""
                      }`}
                      style={
                        promoApplied
                          ? { borderColor: "#22c55e", background: "#f0fdf4" }
                          : undefined
                      }
                    />
                    {promoInput && !promoApplied ? (
                      <p className="step-sub" style={{ marginTop: 8, color: "#ef4444" }}>
                        {copy.s6_promo_invalid}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <WizardStepNav layout="single">
                  <button type="button" className="btn-back btn-nav-secondary" onClick={() => goTo("s5")}>
                    <span>{copy.btn_back}</span>
                  </button>
                </WizardStepNav>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
