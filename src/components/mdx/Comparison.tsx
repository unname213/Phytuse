interface ComparisonSide {
  title: string;
  description?: string;
  pros?: string[];
  cons?: string[];
}

interface ComparisonProps {
  left: ComparisonSide;
  right: ComparisonSide;
}

export function Comparison({ left, right }: ComparisonProps) {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[left, right].map((side, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-bg-subtle p-5"
        >
          <h4 className="font-serif text-lg font-semibold text-fg">
            {side.title}
          </h4>
          {side.description && (
            <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
              {side.description}
            </p>
          )}
          {side.pros && side.pros.length > 0 && (
            <ul className="mt-4 space-y-2">
              {side.pros.map((pro, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-0.5 shrink-0 font-bold text-accent"
                    aria-hidden
                  >
                    +
                  </span>
                  <span className="text-fg">{pro}</span>
                </li>
              ))}
            </ul>
          )}
          {side.cons && side.cons.length > 0 && (
            <ul className="mt-2 space-y-2">
              {side.cons.map((con, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-0.5 shrink-0 text-fg-muted"
                    aria-hidden
                  >
                    −
                  </span>
                  <span className="text-fg-muted">{con}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
