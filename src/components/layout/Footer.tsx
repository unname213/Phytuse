import Link from "next/link";

const EXPLORE_LINKS = [
  { href: "/posts", label: "All posts" },
  { href: "/categories/ingredients", label: "Ingredients" },
  { href: "/categories/routines", label: "Routines" },
  { href: "/categories/conditions", label: "Conditions" },
  { href: "/categories/science", label: "Science" },
];

const REFLECT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/feed.xml", label: "RSS feed" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-fg transition-colors hover:text-accent"
            >
              Reflect
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Science-backed skincare guidance. No affiliate links. No data
              sold. Ever.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-fg-muted">
                Explore
              </p>
              <ul className="space-y-2.5">
                {EXPLORE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-fg-muted">
                Reflect
              </p>
              <ul className="space-y-2.5">
                {REFLECT_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-fg-muted">
            © {new Date().getFullYear()} Reflect. Your data is never sold or
            shared.
          </p>
        </div>
      </div>
    </footer>
  );
}
