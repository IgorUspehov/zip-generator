"use client";

import { useMemo, useState, type FormEvent } from "react";

import {
  ctaForMode,
  leadFormCopy,
  normalizeLeadLang,
  titleForMode,
} from "@/lib/leads/niche-mode";
import type { LeadFormMode } from "@/lib/leads/types";

type BookingFormProps = {
  clientId: string;
  mode: LeadFormMode;
  language: string;
  services: string[];
  accent?: string;
};

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

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!name.trim() || !phone.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(clientId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service: service || undefined,
          comment: comment.trim() || undefined,
          preferredAt: preferredAt || undefined,
          language: lang,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        if (res.status === 429) setError(t.errorGeneric);
        else if (data.error === "invalid phone") setError(t.errorPhone);
        else if (data.error?.includes("required")) setError(t.errorRequired);
        else setError(t.errorGeneric);
        return;
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setService("");
      setComment("");
      setPreferredAt("");
    } catch {
      setError(t.errorGeneric);
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
          {error ? <p className="mt-3 text-sm font-semibold text-rose-300">{error}</p> : null}
          {success ? <p className="mt-3 text-sm font-semibold text-emerald-300">{t.success}</p> : null}
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
