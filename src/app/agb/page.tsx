export default function AgbPage() {
  return (
    <main className="min-h-svh bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">§1 Anbieter</h2>
          <p className="leading-relaxed text-slate-700">
            MVP Factory, Inhaber: Ihor Kriazhev, München, Deutschland
            <br />
            E-Mail:{" "}
            <a href="mailto:contact@mvpfactory.de" className="text-blue-600 underline">
              contact@mvpfactory.de
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§2 Leistungsgegenstand</h2>
          <p className="leading-relaxed text-slate-700">
            Erstellung individueller Web-MVPs und CRM-Demos für Kleinunternehmen im DACH-Raum.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§3 Preise und Zahlung</h2>
          <p className="leading-relaxed text-slate-700">
            Einmalige Zahlung von €99. Keine Abonnements oder versteckten Kosten. Die Zahlung
            erfolgt über LemonSqueezy (Stripe).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§4 Lieferung</h2>
          <p className="leading-relaxed text-slate-700">
            Nach Ausfüllen des Fragebogens wird ein Demo-Link für 48 Stunden kostenlos
            bereitgestellt. Nach Zahlung bleibt die Website dauerhaft aktiv.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§5 Widerrufsrecht</h2>
          <p className="leading-relaxed text-slate-700">
            Da es sich um digitale Inhalte handelt, die sofort bereitgestellt werden, erlischt das
            Widerrufsrecht gemäß §356 Abs. 5 BGB mit Beginn der Ausführung.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§6 Haftungsbeschränkung</h2>
          <p className="leading-relaxed text-slate-700">
            Keine Garantie für Umsätze oder geschäftlichen Erfolg des Kunden.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">§7 Gerichtsstand</h2>
          <p className="leading-relaxed text-slate-700">
            München, Deutschland. Es gilt deutsches Recht.
          </p>
        </section>
      </article>
    </main>
  );
}
