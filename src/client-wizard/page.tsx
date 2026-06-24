"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  buildQuestionnairePayload,
  fetchResultLatest,
  LANG_LABEL_TO_CODE,
  saveQuestionnaire,
  SECTOR_TO_BUSINESS_TYPE,
} from "@/client-wizard/api";
import { getCopy, type UiLang } from "@/client-wizard/copy";
import { getPayTranslations } from "@/client-wizard/pay-translations";
import { getTierTranslations } from "@/client-wizard/tier-translations";
import { DEFAULT_BUSINESS_TYPE } from "@/lib/sector-mapping";
import { executeRecaptcha } from "@/lib/recaptcha/client";
import type { PreviewApiResponse, ResultApiResponse, StepId } from "@/client-wizard/types";

import "@/client-wizard/styles.css";

const LEMONSQUEEZY_STORE_HOST = "https://mvpfactory.lemonsqueezy.com";
const LEMONSQUEEZY_VARIANT_MVP_DEMO = "1801729";
const LEMONSQUEEZY_VARIANT_MVP_PRO = "1807661";
const LEMONSQUEEZY_VARIANT_CRM_FULL = "1807671";

const PADDLE_PRODUCT_MVP_PRO = "pri_01kvwyb0r4rpvv3xrfbyths7tw";

function LogoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function LogoBlock() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <LogoIcon />
      </div>
      <span className="logo-name">MVP Factory</span>
    </div>
  );
}

function ProgressBar({ step }: { step: "s1" | "s2" | "s3" }) {
  const dots =
    step === "s1"
      ? ["active", "", ""]
      : step === "s2"
        ? ["done", "active", ""]
        : ["done", "done", "active"];

  return (
    <div className="progress">
      {dots.map((state, index) => (
        <div key={index} className={`progress-dot ${state}`.trim()} />
      ))}
    </div>
  );
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
  const [selLang, setSelLang] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);
  const [deployMeta, setDeployMeta] = useState<{
    demoUrl: string;
    siteId?: string;
    clientId?: string;
  } | null>(null);
  const [resultData, setResultData] = useState<ResultApiResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState("https://—.netlify.app");
  const [previewTitle, setPreviewTitle] = useState("—");
  const [previewSub, setPreviewSub] = useState("—");
  const [previewBodyHtml, setPreviewBodyHtml] = useState("");
  const [s6Sub, setS6Sub] = useState("—");
  const [publishCountdown, setPublishCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!pendingRedirectUrl) {
      setPublishCountdown(null);
      return;
    }

    setPublishCountdown(30);
    const timer = window.setInterval(() => {
      setPublishCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [pendingRedirectUrl]);

  const publishCountdownText =
    publishCountdown !== null && publishCountdown > 0
      ? lang === "ru"
        ? `⏳ MVP публикуется... осталось ${publishCountdown} сек`
        : lang === "de"
          ? `⏳ MVP wird veröffentlicht... noch ${publishCountdown} Sek`
          : `⏳ MVP is publishing... ${publishCountdown} sec left`
      : null;

  const copyLinkLabel =
    lang === "ru" ? "Копировать ссылку" : lang === "de" ? "Link kopieren" : "Copy link";

  const openMvpLabel =
    lang === "ru" ? "Открыть MVP" : lang === "de" ? "MVP öffnen" : "Open MVP";

  const goTo = useCallback((id: StepId) => {
    setStep(id);
  }, []);

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
      const languageCode = LANG_LABEL_TO_CODE[selLang ?? ""] ?? "en";
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
        goTo("s3");
      }
    },
    [agbAccepted, email, goTo, selLang, selSector],
  );

  function goRestart() {
    setIsGenerating(false);
    setPendingRedirectUrl(null);
    setDeployMeta(null);
    setSelSector(null);
    setSelLang(null);
    setName("");
    setEmail("");
    for (const id of ["f-phone", "f-whatsapp", "f-telegram"]) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = "";
    }
    setResultData(null);
    setAgbAccepted(false);
    setPublishCountdown(null);
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
    void executeRecaptcha("wizard_step_2");
    goTo("s3");
  }

  function go3() {
    console.log("GO3 triggered");
    if (!selLang) {
      console.log("GO3 blocked: no language selected");
      document.querySelectorAll(".lang-pill").forEach((pill) => {
        const el = pill as HTMLElement;
        el.style.borderColor = "#EF4444";
        setTimeout(() => {
          el.style.borderColor = "";
        }, 800);
      });
      return;
    }
    goTo("s4");
    console.log("GO3 -> runBuild", { name: name.trim(), selSector, selLang });
    void runBuild(name.trim());
  }

  async function handleYes() {
    try {
      const result = await fetchResultLatest();
      if (!result.ok) return;
      setResultData(result);
      setS6Sub(result.business_name || previewTitle);
      goTo("s6");
    } catch {
      /* keep on s5 */
    }
  }

  const stepClass = (id: StepId) => (step === id ? "step active" : "step");

  const demoUrl = resolveDemoUrl(deployMeta, pendingRedirectUrl, resultData);
  const payInput =
    demoUrl && email.trim() && name.trim()
      ? {
          demoUrl,
          siteId: deployMeta?.siteId,
          clientId: deployMeta?.clientId,
          email: email.trim(),
          name: name.trim(),
        }
      : null;
  const payHref = payInput ? buildPayHref(payInput) : null;
  const payHrefPro = payInput
    ? buildPayHref({ ...payInput, variantId: LEMONSQUEEZY_VARIANT_MVP_PRO })
    : null;
  const payHrefFull = payInput
    ? buildPayHref({ ...payInput, variantId: LEMONSQUEEZY_VARIANT_CRM_FULL })
    : null;

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

        <div className={`card${step === "s4" && pendingRedirectUrl ? " card--wide" : ""}`}>
          {/* STEP 1 */}
          <div className={stepClass("s1")} id="s1">
            <LogoBlock />
            <ProgressBar step="s1" />
            <div className="step-label">{copy.s1_label}</div>
            <div className="step-h">{copy.s1_h}</div>
            <div className="step-slogan" id="s1-slogan">
              <span>{copy.no1}</span>
              <span>{copy.no2}</span>
              <span>{copy.no3}</span>
            </div>
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
            <button type="button" className="btn-primary" onClick={go1}>
              <span>{copy.btn_next}</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* STEP 2 */}
          <div className={stepClass("s2")} id="s2">
            <LogoBlock />
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
            <button type="button" className="btn-primary" style={{ marginTop: 20 }} onClick={go2}>
              <span>{copy.btn_next}</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button type="button" className="btn-back" onClick={() => goTo("s1")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span>{copy.btn_back}</span>
            </button>
          </div>

          {/* STEP 3 */}
          <div className={stepClass("s3")} id="s3">
            <LogoBlock />
            <ProgressBar step="s3" />
            <div className="step-label">{copy.s3_label}</div>
            <div className="step-h">{copy.s3_h}</div>
            <div className="step-sub">{copy.s3_sub}</div>
            <div className="lang-grid" id="lang-grid">
              {copy.langs.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`lang-pill${selLang === label ? " sel" : ""}`}
                  onClick={() => setSelLang(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <input
                type="checkbox"
                id="agb-checkbox"
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
              />
              Ich akzeptiere die{" "}
              <a href="/agb" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                AGB
              </a>{" "}
              und die{" "}
              <a
                href="/datenschutz"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Datenschutzerklärung
              </a>
            </label>
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: 24 }}
              onClick={go3}
              disabled={!agbAccepted}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{copy.btn_generate}</span>
            </button>
            <button type="button" className="btn-back" onClick={() => goTo("s2")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span>{copy.btn_back}</span>
            </button>
          </div>

          {/* STEP 4 */}
          <div className={stepClass("s4")} id="s4">
            <LogoBlock />
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
                  {lang === "ru"
                    ? "Генерируем ваш MVP..."
                    : lang === "de"
                      ? "Wir erstellen Ihr MVP..."
                      : "Generating your MVP..."}
                </p>
              ) : null}
              {pendingRedirectUrl ? (
                <div style={{ marginTop: 28, textAlign: "left" }}>
                  <p className="step-sub" style={{ marginBottom: 12, fontWeight: 600, textAlign: "center" }}>
                    {lang === "ru"
                      ? "Ваш персональный MVP готов"
                      : lang === "de"
                        ? "Ihr persönliches MVP ist bereit"
                        : "Your personal MVP is ready"}
                  </p>
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
                      {copyLinkLabel}
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
                      {openMvpLabel}
                    </a>
                  )}
                  {payHref && payHrefPro && payHrefFull ? (
                    <PricingTiersBlock
                      payHref={payHref}
                      payHrefPro={payHrefPro}
                      payHrefFull={payHrefFull}
                      lang={lang}
                      clientId={deployMeta?.clientId}
                      email={email.trim()}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {/* STEP 5 */}
          <div className={stepClass("s5")} id="s5">
            <LogoBlock />
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
            <div className="preview-frame">
              <div className="preview-bar">
                <span style={{ background: "#EF4444" }} />
                <span style={{ background: "#F59E0B" }} />
                <span style={{ background: "#10B981" }} />
                <div className="preview-url" id="preview-url">
                  {previewUrl}
                </div>
              </div>
              <div className="preview-body" id="preview-body" dangerouslySetInnerHTML={{ __html: previewBodyHtml }} />
            </div>
            <div className="step-sub" style={{ marginBottom: 16 }}>
              {copy.s5_q}
            </div>
            <div className="decision">
              <button type="button" className="btn-yes" onClick={() => void handleYes()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{copy.btn_yes}</span>
              </button>
              <button type="button" className="btn-no" onClick={goRestart}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                <span>{copy.btn_no}</span>
              </button>
            </div>
            <button type="button" className="btn-back" onClick={() => goTo("s3")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span>{copy.btn_back}</span>
            </button>
          </div>

          {/* STEP 6 */}
          <div className={stepClass("s6")} id="s6">
            <div className="logo">
              <div className="logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="logo-name">MVP Factory</span>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 18px",
                  borderRadius: 100,
                  background: "rgba(16,185,129,.12)",
                  border: "1px solid rgba(16,185,129,.3)",
                  marginBottom: 20,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>{copy.s6_badge}</span>
              </div>
              <div className="step-h grad-em">{copy.s6_h}</div>
              <div className="step-sub" style={{ marginBottom: 0 }} id="s6-sub">
                {s6Sub}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#71717A",
                marginBottom: 12,
              }}
            >
              {copy.s6_dl}
            </div>
            <div className="dl-grid">
              <DeliveryLink result={resultData} optionKey="zip">
                <div className="dl-icon" style={{ background: "rgba(99,102,241,.15)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                ZIP
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="netlify" id="dl-netlify">
                <div className="dl-icon" style={{ background: "rgba(16,185,129,.15)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                Netlify
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="custom_domain">
                <div className="dl-icon" style={{ background: "rgba(139,92,246,.15)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <span>{copy.dl_domain}</span>
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="github">
                <div className="dl-icon" style={{ background: "rgba(255,255,255,.08)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                </div>
                GitHub
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="apk">
                <div className="dl-icon" style={{ background: "rgba(16,185,129,.12)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                APK
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="pwa">
                <div className="dl-icon" style={{ background: "rgba(99,102,241,.12)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </div>
                PWA
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="readme">
                <div className="dl-icon" style={{ background: "rgba(245,158,11,.12)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                README
              </DeliveryLink>
              <DeliveryLink result={resultData} optionKey="demo_mp4">
                <div className="dl-icon" style={{ background: "rgba(239,68,68,.12)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                demo.mp4
              </DeliveryLink>
            </div>
            {payHref && payHrefPro && payHrefFull ? (
              <PricingTiersBlock
                payHref={payHref}
                payHrefPro={payHrefPro}
                payHrefFull={payHrefFull}
                lang={lang}
                clientId={deployMeta?.clientId}
                email={email.trim()}
              />
            ) : null}
            <button
              type="button"
              className="btn-primary"
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#64748b",
                fontWeight: 500,
              }}
              onClick={goRestart}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
              <span>{copy.btn_restart}</span>
            </button>
            <button type="button" className="btn-back" onClick={() => goTo("s5")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span>{copy.btn_back}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
