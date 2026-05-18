import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageHref(basePath: string, page: number): string {
  if (page === 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-border pt-8"
    >
      <div>
        {prev !== null && (
          <Link
            href={pageHref(basePath, prev)}
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Previous
          </Link>
        )}
      </div>
      <p className="text-sm text-fg-muted">
        Page {currentPage} of {totalPages}
      </p>
      <div>
        {next !== null && (
          <Link
            href={pageHref(basePath, next)}
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            Next →
          </Link>
        )}
      </div>
    </nav>
  );
}
