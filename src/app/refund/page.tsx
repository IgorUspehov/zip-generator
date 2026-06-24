export default function RefundPage() {
  return (
    <main className="min-h-svh bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Refund Policy</h1>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">General Policy</h2>
          <p className="leading-relaxed text-slate-700">
            All products sold by MVP Factory are digital products generated specifically for each
            customer. Due to the personalised and digital nature of these products,{" "}
            <strong>refunds are not available once delivery has been completed</strong>.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Non-Delivery Refund</h2>
          <p className="leading-relaxed text-slate-700">
            If your product has <strong>not been delivered within 24 hours</strong> of your payment
            being confirmed, you are entitled to a <strong>full refund</strong> of the purchase
            price.
          </p>
          <p className="leading-relaxed text-slate-700">
            To request a refund, please contact us at:{" "}
            <a href="mailto:support@mvpfactory.de" className="text-blue-600 underline">
              support@mvpfactory.de
            </a>
          </p>
          <p className="leading-relaxed text-slate-700">
            Please include your order details and payment confirmation in your message.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">How Refunds Are Processed</h2>
          <p className="leading-relaxed text-slate-700">
            Approved refunds are returned to the original payment method within{" "}
            <strong>5–10 business days</strong>, depending on your bank or payment provider.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Questions</h2>
          <p className="leading-relaxed text-slate-700">
            For any questions about this policy, reach out at{" "}
            <a href="mailto:support@mvpfactory.de" className="text-blue-600 underline">
              support@mvpfactory.de
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
