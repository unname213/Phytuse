import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reflect is a privacy-first skincare blog delivering honest, science-backed guidance without affiliate links or data collection.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-4 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-semibold text-fg">
            About Reflect
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Evidence-based skincare analysis, free of commercial influence.
          </p>
        </header>

        <div className="prose prose-base max-w-none">
          <h2>Why Reflect exists</h2>
          <p>
            Most skincare content is compromised before it&apos;s written.
            Product placements, affiliate deals, and brand relationships mean
            you can&apos;t trust that &ldquo;honest review&rdquo; or
            &ldquo;science-backed guide.&rdquo; Reflect was built to be
            different.
          </p>
          <p>
            Every article at Reflect is written without affiliate links, without
            sponsored content, and without the incentive to sell you anything.
            If we reference a product or ingredient, it&apos;s because the
            evidence supports it — not because someone paid for the mention.
          </p>

          <h2>How we cover topics</h2>
          <p>
            We start with peer-reviewed literature: dermatology journals,
            clinical trials, and published reviews. We cite our sources. We
            acknowledge uncertainty when the evidence is mixed. We update
            articles when new research changes the picture.
          </p>
          <p>
            We try to be precise without being inaccessible. Skincare chemistry
            is genuinely interesting — and understanding it helps you make better
            decisions. We&apos;d rather explain a mechanism than give you a
            five-step routine to follow without context.
          </p>

          <h2>Privacy</h2>
          <p>Reflect does not sell, rent, or share your personal data.</p>
          <p>
            If you subscribe to our newsletter, we hold your email address to
            send you new articles. We don&apos;t build advertising profiles,
            sell it to third parties, or use it to track you across the web. You
            can unsubscribe at any time.
          </p>
          <p>
            We use privacy-respecting analytics that collect no personal
            identifiers — only aggregate page counts. No cross-site tracking
            cookies.
          </p>

          <h2>A note on medical advice</h2>
          <p>
            Reflect contributors are not dermatologists, and nothing published
            here constitutes medical advice. If you have a diagnosed skin
            condition or persistent symptoms, please see a board-certified
            dermatologist. We cover evidence and mechanisms — not diagnoses or
            prescriptions.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
