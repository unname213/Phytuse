import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Posts",
  description:
    "Research-backed skincare analysis covering ingredients, routines, conditions, and the science behind them.",
};

const POSTS_PER_PAGE = 12;
const CATEGORIES = ["ingredients", "routines", "conditions", "science"];

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageStr, category } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? "1", 10));

  let posts = await getAllPosts();
  if (category && CATEGORIES.includes(category)) {
    posts = posts.filter((p) => p.category === category);
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = posts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const basePath = category ? `/posts?category=${category}` : "/posts";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-3xl font-semibold text-fg">
            All Posts
          </h1>
          <p className="mt-2 text-fg-muted">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
            {category ? ` in ${category}` : ""}
          </p>
        </header>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/posts"
            className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-colors ${
              !category
                ? "border-accent bg-accent text-white"
                : "border-border text-fg-muted hover:border-accent hover:text-accent"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/posts?category=${cat}`}
              className={`rounded-full border px-3.5 py-1 text-xs font-medium capitalize transition-colors ${
                category === cat
                  ? "border-accent bg-accent text-white"
                  : "border-border text-fg-muted hover:border-accent hover:text-accent"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-12">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </div>
          </>
        ) : (
          <p className="text-fg-muted">No posts yet. Check back soon.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
