import { getPostsByCategory, getAllCategories } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

const CATEGORY_META: Record<
  string,
  { title: string; description: string }
> = {
  ingredients: {
    title: "Ingredients",
    description:
      "What the actives in your products actually do, supported by peer-reviewed research.",
  },
  routines: {
    title: "Routines",
    description:
      "How to build an effective routine, layer products correctly, and avoid common mistakes.",
  },
  conditions: {
    title: "Conditions",
    description:
      "Evidence-based guidance on acne, hyperpigmentation, sensitivity, and skin aging.",
  },
  science: {
    title: "The Science",
    description:
      "Deeper dives into skin biology, formulation chemistry, and how skincare products work.",
  },
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  // Include known categories even if no posts exist yet
  const known = Object.keys(CATEGORY_META);
  const all = [...new Set([...categories, ...known])];
  return all.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};
  return { title: meta.title, description: meta.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!CATEGORY_META[category]) notFound();

  const posts = await getPostsByCategory(category);
  const meta = CATEGORY_META[category];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <div className="mb-3">
            <Link
              href="/posts"
              className="text-xs uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
            >
              ← All posts
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-fg">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-xl text-fg-muted">{meta.description}</p>
          <p className="mt-2 text-sm text-fg-muted">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-fg-muted">
            No posts in this category yet. Check back soon.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
