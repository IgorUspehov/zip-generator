"use client";

import { useMemo, useState, type FormEvent } from "react";

export type JobVacancyOption = {
  id: string;
  title: string;
  salary: string;
};

type JobFormProps = {
  clientId: string;
  language: string;
  vacancies: JobVacancyOption[];
  accent?: string;
};

const COPY = {
  de: {
    title: "Wir suchen Mitarbeiter",
    subtitle: "Bewerben Sie sich jetzt",
    position: "Position",
    salary: "Gehalt",
    name: "Vollständiger Name",
    phone: "Telefon",
    cta: "Bewerbung senden",
    success: "Bewerbung eingegangen! Wir melden uns bald.",
    sending: "Senden…",
    empty: "Вакансий пока нет",
    selectPosition: "Position wählen",
    selectSalary: "Gehalt wählen",
    errorRequired: "Bitte alle Pflichtfelder ausfüllen.",
    errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  ru: {
    title: "Вакансии",
    subtitle: "Отправьте заявку",
    position: "Должность",
    salary: "Ставка",
    name: "Полное имя",
    phone: "Телефон",
    cta: "Отправить заявку",
    success: "Заявка принята! Скоро свяжемся.",
    sending: "Отправка…",
    empty: "Вакансий пока нет",
    selectPosition: "Выберите должность",
    selectSalary: "Выберите ставку",
    errorRequired: "Заполните обязательные поля.",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  en: {
    title: "We Are Hiring",
    subtitle: "Apply now",
    position: "Position",
    salary: "Rate",
    name: "Full name",
    phone: "Phone",
    cta: "Submit application",
    success: "Application received! We'll be in touch.",
    sending: "Sending…",
    empty: "Вакансий пока нет",
    selectPosition: "Select position",
    selectSalary: "Select rate",
    errorRequired: "Please fill in all required fields.",
    errorGeneric: "Something went wrong. Please try again.",
  },
} as const;

type JobLang = keyof typeof COPY;

const fieldClassName =
  "rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2.5 text-base text-white outline-none focus:border-orange-400";

function normalizeJobLang(language: string): JobLang {
  const code = language.trim().toLowerCase().slice(0, 2);
  if (code === "ru" || code === "en" || code === "de") return code;
  return "de";
}

export function JobForm({
  clientId,
  language,
  vacancies,
  accent = "#c2410c",
}: JobFormProps) {
  const lang = normalizeJobLang(language);
  const t = COPY[lang];

  const [vacancyId, setVacancyId] = useState("");
  const [salary, setSalary] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedVacancy = useMemo(
    () => vacancies.find((item) => item.id === vacancyId) ?? null,
    [vacancies, vacancyId],
  );

  const salaryOptions = useMemo(() => {
    if (!selectedVacancy?.salary) return [] as string[];
    return [selectedVacancy.salary];
  }, [selectedVacancy]);

  function onVacancyChange(nextId: string) {
    setVacancyId(nextId);
    const next = vacancies.find((item) => item.id === nextId);
    setSalary(next?.salary ?? "");
    setError("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const position = selectedVacancy?.title?.trim() ?? "";
    if (!position || !name.trim() || !phone.trim()) {
      setError(t.errorRequired);
      return;
    }
    if (salaryOptions.length > 0 && !salary.trim()) {
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
          position,
          salary: salary.trim() || undefined,
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
      setVacancyId("");
      setSalary("");
      setName("");
      setPhone("");
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

  if (vacancies.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-black text-white">{t.title}</h2>
        <p className="mt-3 text-base text-slate-200" role="status">
          {t.empty}
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
          {t.position} *
          <select
            value={vacancyId}
            onChange={(e) => onVacancyChange(e.target.value)}
            required
            className={fieldClassName}
          >
            <option value="">{t.selectPosition}</option>
            {vacancies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-200">
          {t.salary}
          {salaryOptions.length > 0 ? " *" : ""}
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required={salaryOptions.length > 0}
            disabled={!vacancyId || salaryOptions.length === 0}
            className={`${fieldClassName} disabled:opacity-50`}
          >
            <option value="">
              {!vacancyId
                ? t.selectPosition
                : salaryOptions.length === 0
                  ? "—"
                  : t.selectSalary}
            </option>
            {salaryOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-200">
          {t.name} *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            className={fieldClassName}
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
            className={fieldClassName}
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
