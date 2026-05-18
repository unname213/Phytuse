# Reflect — Skincare Blog

Privacy-first skincare guidance. Science-backed, affiliate-link-free.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and MDX.

---

## Getting started

### Prerequisites

- Node.js 18.17+
- npm 9+

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url> reflect
cd reflect
npm install

# 2. Create your environment file
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_SITE_URL

# 3. Start the dev server
npm run dev
```

The site will be available at `http://localhost:3000`.

---

## Adding a new post

1. Create a new `.mdx` file in `content/posts/`:

```
content/posts/your-post-slug.mdx
```

The filename becomes the URL slug: `content/posts/retinol-guide.mdx` → `/posts/retinol-guide`.

2. Add frontmatter at the top:

```mdx
---
title: "Your Post Title"
description: "A one- or two-sentence summary (used in SEO, cards, and RSS)."
publishedAt: "2024-12-15"
updatedAt: "2024-12-20"        # optional
author: "Reflect Editorial"
category: "ingredients"         # ingredients | routines | conditions | science
tags: ["tag1", "tag2"]
ogImage: "/og/your-post.png"   # optional; relative to /public
---
```

3. Write your content in MDX below the frontmatter.

### Available MDX components

#### `<Callout type="note|warning|science">`

```mdx
<Callout type="science">
  A 2022 RCT found that 4% niacinamide reduced PIH by 35% after 8 weeks.
</Callout>
```

#### `<IngredientCard>`

```mdx
<IngredientCard
  name="Azelaic Acid"
  inci="Azelaic Acid"
  function="Tyrosinase inhibitor and anti-keratinising agent"
  concentration="10–20%"
  bestFor={["Rosacea", "Hyperpigmentation", "Acne"]}
  avoidWith={["Compromised barrier at high concentrations"]}
/>
```

#### `<Comparison>`

```mdx
<Comparison
  left={{
    title: "Option A",
    description: "Brief description.",
    pros: ["Advantage 1", "Advantage 2"],
    cons: ["Disadvantage 1"]
  }}
  right={{
    title: "Option B",
    description: "Brief description.",
    pros: ["Advantage 1"],
    cons: ["Disadvantage 1", "Disadvantage 2"]
  }}
/>
```

#### `<FAQ>`

```mdx
<FAQ items={[
  {
    question: "Is this safe for sensitive skin?",
    answer: "Yes, because..."
  }
]} />
```

#### `<References>`

```mdx
<References items={[
  "Author, A. et al. (2023). Title of study. Journal Name, 10(2), 100–110."
]} />
```

---

## Project structure

```
reflect/
├── content/
│   └── posts/           # MDX blog posts — one file per post
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── posts/page.tsx        # /posts (all posts + category filter)
│   │   ├── posts/[slug]/page.tsx # Individual post
│   │   ├── categories/[category]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── subscribe/page.tsx
│   │   ├── api/subscribe/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── feed.xml/route.ts     # RSS at /feed.xml
│   ├── components/
│   │   ├── mdx/                  # Callout, IngredientCard, Comparison, References, FAQ
│   │   ├── layout/               # Header, Footer, TableOfContents
│   │   ├── PostCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── SubscribeForm.tsx
│   │   ├── JsonLd.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeProvider.tsx
│   └── lib/
│       ├── mdx.ts                # Post reading/parsing utilities
│       ├── reading-time.ts
│       └── toc.ts                # Heading extraction for sticky TOC
└── public/
    └── og/                       # OG images (optional)
```

---

## Deploying to Vercel

1. Push your repository to GitHub/GitLab/Bitbucket.

2. Import the project at [vercel.com/new](https://vercel.com/new):
   - Framework: **Next.js** (auto-detected)
   - Root directory: `.` (default)

3. Set environment variables:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL, no trailing slash |
| `CONVERTKIT_API_KEY` | No | ConvertKit public API key |
| `CONVERTKIT_FORM_ID` | No | ConvertKit form ID |
| `RESEND_API_KEY` | No | Resend API key |
| `RESEND_AUDIENCE_ID` | No | Resend audience ID |

4. Deploy. All post pages are statically generated at build time.

---

## Newsletter setup

Configure **one** provider in your environment:

**ConvertKit:** Get your API key from Account → API Key. Get the form ID from the form URL in your ConvertKit dashboard. Set `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID`.

**Resend:** Create an audience, copy the ID. Create an API key with `audiences:write`. Set `RESEND_API_KEY` and `RESEND_AUDIENCE_ID`.

If neither provider is configured, subscribe requests succeed silently and log to stdout — useful during local development.

---

## Categories

Built-in categories: `ingredients`, `routines`, `conditions`, `science`.

To add a category, add an entry to `CATEGORY_META` in `src/app/categories/[category]/page.tsx` and add it to the `CATEGORIES` array in `src/app/posts/page.tsx`.

---

## Dark mode

Implemented with [next-themes](https://github.com/pacocoursey/next-themes). Respects system preference by default; user toggle persisted in `localStorage`. The `.dark` class on `<html>` drives the Tailwind `dark:` variant.

---

## Performance notes

- Post pages use `generateStaticParams` for full SSG.
- Fonts (Fraunces + Inter) are self-hosted by Next.js via `next/font/google`.
- Code syntax highlighting is server-side only (rehype-pretty-code + shiki) — zero client JS for code blocks.
- OG images are served as static files from `/public/og/`.
- Sitemap and RSS are generated at request time with aggressive cache headers.
