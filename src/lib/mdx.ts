import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "./reading-time";
import { extractToc, TocItem } from "./toc";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  tags: string[];
  ogImage?: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: number;
  toc: TocItem[];
}

export interface Post extends PostMeta {
  content: string;
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const raw = await readFile(
      path.join(POSTS_DIR, `${slug}.mdx`),
      "utf-8"
    );
    const { data, content } = matter(raw);
    return {
      slug,
      ...(data as PostFrontmatter),
      content,
      readingTime: calculateReadingTime(content),
      toc: extractToc(content),
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const files = await readdir(POSTS_DIR);
    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(".mdx", "");
          const raw = await readFile(path.join(POSTS_DIR, file), "utf-8");
          const { data, content } = matter(raw);
          return {
            slug,
            ...(data as PostFrontmatter),
            readingTime: calculateReadingTime(content),
            toc: extractToc(content),
          } as PostMeta;
        })
    );
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function getPostsByCategory(
  category: string
): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return [...new Set(posts.map((p) => p.category))];
}
