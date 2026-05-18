import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { ArticleJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflect.skin";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/posts/${slug}`;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      ...(post.ogImage && { images: [`${SITE_URL}${post.ogImage}`] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: "wrap", properties: { className: ["anchor"] } },
          ],
          [rehypePrettyCode, { theme: "github-dark-dimmed" }],
        ],
      },
    },
    components: mdxComponents,
  });

  const url = `${SITE_URL}/posts/${slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
        url={url}
        ogImage={post.ogImage}
      />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-20">
          {/* Article */}
          <article className="min-w-0 max-w-[680px]">
            <header className="mb-10">
              <div className="mb-4">
                <Link
                  href={`/categories/${post.category}`}
                  className="text-xs font-semibold uppercase tracking-widest text-accent transition-colors hover:text-accent-hover"
                >
                  {post.category}
                </Link>
              </div>
              <h1 className="font-serif text-3xl font-semibold leading-tight text-fg md:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-6 text-sm text-fg-muted">
                <span>{post.author}</span>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <>
                    <span aria-hidden>·</span>
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span>{post.readingTime} min read</span>
              </div>
            </header>

            <div className="prose prose-base max-w-none">{content}</div>

            <footer className="mt-12 border-t border-border pt-8">
              <Link
                href="/posts"
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                ← All posts
              </Link>
            </footer>
          </article>

          {/* Sticky TOC — desktop only */}
          {post.toc.length > 0 && (
            <aside className="hidden lg:block" aria-label="Table of contents">
              <div className="sticky top-24">
                <TableOfContents items={post.toc} />
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
