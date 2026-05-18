import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = [
  {
    slug: "ingredients",
    label: "Ingredients",
    description: "What the actives in your products actually do",
  },
  {
    slug: "routines",
    label: "Routines",
    description: "Building a routine that works for your skin",
  },
  {
    slug: "conditions",
    label: "Conditions",
    description: "Acne, hyperpigmentation, aging, sensitivity",
  },
  {
    slug: "science",
    label: "The Science",
    description: "How skin biology and formulation chemistry work",
  },
];

export default async function HomePage() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 6);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-20 md:py-28">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
              Privacy-first skincare
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-fg md:text-5xl lg:text-[3.25rem]">
              Skincare guidance built on evidence,
              <br className="hidden md:block" /> not affiliate links.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Reflect breaks down the chemistry behind your routine. No
              sponsored content, no hype — just honest analysis grounded in
              peer-reviewed research.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/posts"
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Read the research
              </Link>
              <Link
                href="/about"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                About Reflect →
              </Link>
            </div>
          </div>
        </section>

        {/* Latest posts */}
        {latestPosts.length > 0 && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-5xl px-4 py-16">
              <div className="mb-10 flex items-baseline justify-between">
                <h2 className="font-serif text-2xl font-semibold text-fg">
                  Latest
                </h2>
                <Link
                  href="/posts"
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  All posts →
                </Link>
              </div>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category grid */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="mb-10 font-serif text-2xl font-semibold text-fg">
              Browse by topic
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map(({ slug, label, description }) => (
                <Link
                  key={slug}
                  href={`/categories/${slug}`}
                  className="group rounded-lg border border-border bg-bg-subtle p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
                >
                  <h3 className="font-serif text-base font-semibold text-fg transition-colors group-hover:text-accent">
                    {label}
                  </h3>
                  <p className="mt-1.5 text-sm text-fg-muted">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy brand statement */}
        <section>
          <div className="mx-auto max-w-2xl px-4 py-20 text-center">
            <h2 className="font-serif text-2xl font-semibold text-fg md:text-3xl">
              Your skin data stays yours.
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-fg-muted">
              Reflect is built on a simple premise: honest skincare advice
              shouldn&apos;t cost you your privacy. We don&apos;t track you,
              sell your data, or take affiliate commissions. Just evidence,
              clearly explained.
            </p>
            <Link
              href="/subscribe"
              className="mt-8 inline-block rounded-md border border-border px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Get new posts by email
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
