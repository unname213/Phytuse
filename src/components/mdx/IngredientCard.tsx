interface IngredientCardProps {
  name: string;
  inci: string;
  function: string;
  concentration?: string;
  bestFor?: string[];
  avoidWith?: string[];
}

export function IngredientCard({
  name,
  inci,
  function: fn,
  concentration,
  bestFor,
  avoidWith,
}: IngredientCardProps) {
  return (
    <div className="not-prose my-8 rounded-lg border border-border bg-bg-subtle p-6">
      <div className="mb-5 border-b border-border pb-4">
        <h3 className="font-serif text-xl font-semibold text-fg">{name}</h3>
        <p className="mt-0.5 font-mono text-xs text-fg-muted">{inci}</p>
      </div>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Function
          </dt>
          <dd className="text-fg">{fn}</dd>
        </div>

        {concentration && (
          <div>
            <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Effective Concentration
            </dt>
            <dd className="text-fg">{concentration}</dd>
          </div>
        )}

        {bestFor && bestFor.length > 0 && (
          <div>
            <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Best For
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {bestFor.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {avoidWith && avoidWith.length > 0 && (
          <div>
            <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Use Caution With
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {avoidWith.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
