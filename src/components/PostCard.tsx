import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <Link href={`/posts/${post.slug}`} className="group block">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {post.category}
          </span>
        </div>
        <h2 className="font-serif text-xl font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
          {post.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-fg-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </Link>
    </article>
  );
}
