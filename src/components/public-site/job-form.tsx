"use client";

import { useState, type FormEvent } from "react";

type JobFormProps = {
  clientId: string;
  language: string;
  accent?: string;
};

const COPY = {
  de: {
    title: "Wir suchen Mitarbeiter",
    subtitle: "Bewerben Sie sich jetzt",
    name: "Vollständiger Name",
    phone: "Telefon",
    position: "Position",
    experience: "Erfahrung (optional)",
    cta: "Jetzt bewerben",
    success: "Bewerbung eingegangen! Wir melden uns bald.",
    sending: "Senden…",
    errorRequired: "Bitte alle Pflichtfelder ausfüllen.",
    errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  ru: {
    title: "Вакансии",
    subtitle: "Отправьте заявку",
    name: "Полное имя",
    phone: "Телефон",
    position: "Должность",
    experience: "Опыт работы (необязательно)",
    cta: "Отправить заявку",
    success: "Заявка принята! Скоро свяжемся.",
    sending: "Отправка…",
    errorRequired: "Заполните обязательные поля.",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  en: {
    title: "We Are Hiring",
    subtitle: "Apply now",
    name: "Full name",
    phone: "Phone",
    position: "Position",
    experience: "Experience (optional)",
    cta: "Apply Now",
    success: "Application received! We'll be in touch.",
    sending: "Sending…",
    errorRequired: "Please fill in all required fields.",
    errorGeneric: "Something went wrong. Please try again.",
  },
} as const;

type JobLang = keyof typeof COPY;

function normalizeJobLang(language: string): JobLang {
  const code = language.trim().toLowerCase().slice(0, 2);
  if (code === "ru" || code === "en" || code === "de") return code;
  return "de";
}

export function JobForm({
  clientId,
  language,
  accent = "#c2410c",
}: JobFormProps) {
  const lang = normalizeJobLang(language);
  const t = COPY[lang];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !position.trim()) {
      setError(t.errorRequired);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/job-leads/${encodeURIComponent(clientId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          position: position.trim(),
          experience: experience.trim() || undefined,
          language: lang,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || data.ok !== true) {
        setError(t.errorGeneric);
        return;
      }
      setSuccess(true);
      setName("");
      setPhone("");
      setPosition("");
      setExperience("");
    } catch {
      setError(t.errorGeneric);
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur">
        <p className="text-lg font-semibold text-emerald-300" role="status">
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur"
    >
      <h2 className="text-2xl font-black text-white">{t.title}</h2>
      <p className="mt-1 text-sm text-slate-300">{t.subtitle}</p>
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
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={40}
            inputMode="tel"
            className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-200">
          {t.position} *
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            maxLength={120}
            className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400"
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-200">
          {t.experience}
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            maxLength={2000}
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
      <div className="mt-5">
        <button
          type="submit"
          disabled={sending}
          className="rounded-2xl px-5 py-3 text-base font-black text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          {sending ? t.sending : t.cta}
        </button>
      </div>
    </form>
  );
}
