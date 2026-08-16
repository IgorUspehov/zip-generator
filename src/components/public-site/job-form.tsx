"use client";

import { useEffect, useState, type FormEvent } from "react";

type JobFormProps = {
  clientId: string;
  language: string;
  accent?: string;
};

type VacancyOption = {
  id: string;
  title: string;
  salary?: string;
};

const COPY = {
  de: {
    title: "Wir suchen Mitarbeiter",
    subtitle: "Bewerben Sie sich jetzt",
    name: "Vollständiger Name",
    phone: "Telefon",
    position: "Position",
    positionPlaceholder: "Position wählen",
    salary: "Gehalt",
    experience: "Erfahrung (optional)",
    cta: "Jetzt bewerben",
    success: "Bewerbung eingegangen! Wir melden uns bald.",
    sending: "Senden…",
    loading: "Stellen werden geladen…",
    noVacancies: "Derzeit keine offenen Stellen.",
    errorRequired: "Bitte alle Pflichtfelder ausfüllen.",
    errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  ru: {
    title: "Вакансии",
    subtitle: "Отправьте заявку",
    name: "Полное имя",
    phone: "Телефон",
    position: "Должность",
    positionPlaceholder: "Выберите должность",
    salary: "Ставка",
    experience: "Опыт работы (необязательно)",
    cta: "Отправить заявку",
    success: "Заявка принята! Скоро свяжемся.",
    sending: "Отправка…",
    loading: "Загрузка вакансий…",
    noVacancies: "Сейчас нет открытых вакансий.",
    errorRequired: "Заполните обязательные поля.",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  en: {
    title: "We Are Hiring",
    subtitle: "Apply now",
    name: "Full name",
    phone: "Phone",
    position: "Position",
    positionPlaceholder: "Select a position",
    salary: "Rate",
    experience: "Experience (optional)",
    cta: "Apply Now",
    success: "Application received! We'll be in touch.",
    sending: "Sending…",
    loading: "Loading positions…",
    noVacancies: "No open positions right now.",
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

  const [vacancies, setVacancies] = useState<VacancyOption[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingVacancies(true);
    fetch(`/api/crm/vacancies/${encodeURIComponent(clientId)}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          items?: Array<{
            id?: string;
            title?: string;
            salary?: string;
          }>;
        };
        if (!res.ok || data.ok !== true || !Array.isArray(data.items)) {
          return [] as VacancyOption[];
        }
        return data.items
          .map((item) => {
            const title = String(item.title || "").trim();
            if (!title) return null;
            const salary = String(item.salary || "").trim();
            return {
              id: String(item.id || title),
              title,
              ...(salary ? { salary } : {}),
            } satisfies VacancyOption;
          })
          .filter((item): item is VacancyOption => Boolean(item));
      })
      .catch(() => [] as VacancyOption[])
      .then((items) => {
        if (cancelled) return;
        setVacancies(items);
        setLoadingVacancies(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const selected = vacancies.find((item) => item.title === position);

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
          salary: selected?.salary || undefined,
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
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            disabled={loadingVacancies || vacancies.length === 0}
            className="rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400 disabled:opacity-60"
          >
            <option value="">
              {loadingVacancies ? t.loading : t.positionPlaceholder}
            </option>
            {vacancies.map((item) => (
              <option key={item.id} value={item.title}>
                {item.salary ? `${item.title} — ${item.salary}` : item.title}
              </option>
            ))}
          </select>
        </label>
        {!loadingVacancies && vacancies.length === 0 ? (
          <p className="text-sm text-slate-300">{t.noVacancies}</p>
        ) : null}
        {selected?.salary ? (
          <p className="text-sm font-semibold text-orange-200">
            {t.salary}: {selected.salary}
          </p>
        ) : null}
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
          disabled={sending || loadingVacancies || vacancies.length === 0}
          className="rounded-2xl px-5 py-3 text-base font-black text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          {sending ? t.sending : t.cta}
        </button>
      </div>
    </form>
  );
}
