"use client";

import { useMemo, useState, type FormEvent } from "react";

import {
  ctaForMode,
  leadFormCopy,
  normalizeLeadLang,
  titleForMode,
} from "@/lib/leads/niche-mode";
import {
  isRetryableLeadError,
  LeadRequestError,
  withRetries,
} from "@/lib/leads/retry";
import type { LeadFormMode } from "@/lib/leads/types";

type BookingFormProps = {
  clientId: string;
  mode: LeadFormMode;
  language: string;
  services: string[];
  accent?: string;
};

const FETCH_TIMEOUT_MS = 12_000;
const FRONT_RETRY_ATTEMPTS = 3;
const FRONT_BASE_DELAY_MS = 400;

async function postLeadOnce(
  clientId: string,
  body: Record<string, unknown>,
): Promise<void> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`/api/leads/${encodeURIComponent(clientId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
    if (!res.ok) {
      throw new LeadRequestError(
        data.error || `HTTP ${res.status}`,
        res.status,
        data,
      );
    }
    if (data.ok !== true) {
      // Defensive: never treat ambiguous bodies as success.
      throw new LeadRequestError("invalid_success_payload", 502, data);
    }
  } catch (error) {
    if (error instanceof LeadRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new LeadRequestError("timeout", 408);
    }
    throw new LeadRequestError(
      error instanceof Error ? error.message : "network_error",
      0,
    );
  } finally {
    window.clearTimeout(timer);
  }
}

export function PublicBookingForm({
  clientId,
  mode,
  language,
  services,
  accent = "#c2410c",
}: BookingFormProps) {
  const lang = normalizeLeadLang(language);
  const t = leadFormCopy[lang];
  const title = titleForMode(mode, lang);
  const cta = ctaForMode(mode, lang);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [preferredAt, setPreferredAt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const showPreferred = mode === "appointment";
  const serviceOptions = useMemo(() => services.filter(Boolean), [services]);

  function mapError(err: unknown): string {
    if (err instanceof LeadRequestError) {
      if (err.status === 429) return t.errorGeneric;
      if (err.status === 0 || err.status === 408) return t.errorNetwork;
      const body = err.body as { error?: string } | undefined;
      if (body?.error === "invalid phone") return t.errorPhone;
      if (body?.error?.includes("required")) return t.errorRequired;
      return t.errorGeneric;
    }
    return t.errorNetwork;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!name.trim() || !phone.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSending(true);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      service: service || undefined,
      comment: comment.trim() || undefined,
      preferredAt: preferredAt || undefined,
      language: lang,
    };
    try {
      await withRetries(() => postLeadOnce(clientId, payload), {
        attempts: FRONT_RETRY_ATTEMPTS,
        baseDelayMs: FRONT_BASE_DELAY_MS,
        maxDelayMs: 2_000,
        shouldRetry: (err) => isRetryableLeadError(err),
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setService("");
      setComment("");
      setPreferredAt("");
    } catch (err) {
      // Final failure only — never show success for a failed / timed-out request.
      setSuccess(false);
      setError(mapError(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-10">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl px-6 py-4 text-lg font-black text-white shadow-lg transition hover:opacity-95 sm:w-auto"
          style={{ background: accent }}
        >
          {cta}
        </button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur"
        >
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <div className="mt-5 grid gap-3">
            <label className="grid gap-1 text-sm text-slate-200">
              {t.name} *
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-200">
              {t.phone} *
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={40}
                inputMode="tel"
                className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
              />
            </label>
            {serviceOptions.length > 0 ? (
              <label className="grid gap-1 text-sm text-slate-200">
                {t.service}
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
                >
                  <option value="">{t.servicePlaceholder}</option>
                  {serviceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {showPreferred ? (
              <label className="grid gap-1 text-sm text-slate-200">
                {t.preferredAt}
                <input
                  type="datetime-local"
                  value={preferredAt}
                  onChange={(e) => setPreferredAt(e.target.value)}
                  className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
                />
              </label>
            ) : null}
            <label className="grid gap-1 text-sm text-slate-200">
              {t.comment}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={3}
                className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
              />
            </label>
          </div>
          {error ? (
            <p className="mt-3 text-sm font-semibold text-rose-300" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-3 text-sm font-semibold text-emerald-300" role="status">
              {t.success}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl px-5 py-3 text-base font-black text-white disabled:opacity-60"
              style={{ background: accent }}
            >
              {sending ? t.sending : t.submit}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-white/25 px-5 py-3 text-base font-semibold text-slate-200"
            >
              ×
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
