const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflect.skin";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  url: string;
  ogImage?: string;
}

export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  url,
  ogImage,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Reflect",
      url: SITE_URL,
    },
    url,
    ...(ogImage && { image: `${SITE_URL}${ogImage}` }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
