import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubscribeForm } from "@/components/SubscribeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Get new Reflect articles delivered to your inbox. No spam, no tracking. Unsubscribe any time.",
};

export default function SubscribePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[520px] px-4 py-20">
        <header className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-semibold text-fg">
            Stay in the loop
          </h1>
          <p className="mt-4 leading-relaxed text-fg-muted">
            New articles, ingredient breakdowns, and routine guides — delivered
            when we publish. No spam. We don&apos;t track opens, and
            we&apos;ll never sell your address.
          </p>
        </header>

        <SubscribeForm />

        <p className="mt-6 text-center text-xs text-fg-muted">
          By subscribing you agree to receive occasional emails from Reflect.
          Unsubscribe any time — there&apos;s a link in every email.
        </p>
      </main>
      <Footer />
    </>
  );
}
