export default function DatenschutzPage() {
  return (
    <main className="min-h-svh bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Datenschutzerklärung</h1>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">1. Verantwortlicher</h2>
          <p className="leading-relaxed text-slate-700">
            Ihor Kriazhev, München, Deutschland
            <br />
            E-Mail:{" "}
            <a href="mailto:contact@mvpfactory.de" className="text-blue-600 underline">
              contact@mvpfactory.de
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">2. Welche Daten wir erheben</h2>
          <p className="leading-relaxed text-slate-700">
            Name, E-Mail-Adresse, Branche und Unternehmensbeschreibung (aus dem Fragebogen).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">3. Zweck der Verarbeitung</h2>
          <p className="leading-relaxed text-slate-700">
            Erstellung des CRM Demo und Kommunikation mit dem Kunden.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">4. Speicherdauer</h2>
          <p className="leading-relaxed text-slate-700">
            Demo-Daten werden nach 48 Stunden automatisch gelöscht. Zahlungsdaten werden gemäß
            gesetzlicher Aufbewahrungspflicht 10 Jahre gespeichert.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">5. Weitergabe an Dritte</h2>
          <p className="leading-relaxed text-slate-700">
            Keine Weitergabe an Dritte, außer zur Zahlungsabwicklung (LemonSqueezy/Stripe).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">6. Ihre Rechte</h2>
          <p className="leading-relaxed text-slate-700">
            Auskunft, Berichtigung und Löschung Ihrer Daten per E-Mail möglich:{" "}
            <a href="mailto:contact@mvpfactory.de" className="text-blue-600 underline">
              contact@mvpfactory.de
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">7. Google reCAPTCHA</h2>
          <p className="leading-relaxed text-slate-700">
            Wir verwenden Google reCAPTCHA v3 zum Schutz vor Spam. Es gelten die
            Datenschutzbestimmungen von Google:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              https://policies.google.com/privacy
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
