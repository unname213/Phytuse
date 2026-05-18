interface ReferencesProps {
  items: string[];
}

export function References({ items }: ReferencesProps) {
  return (
    <section
      aria-label="References"
      className="not-prose mt-12 border-t border-border pt-8"
    >
      <h2 className="font-serif text-sm font-semibold uppercase tracking-widest text-fg-muted">
        References
      </h2>
      <ol className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-fg-muted">
            <span className="shrink-0 tabular-nums text-fg-muted/50">
              {i + 1}.
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
