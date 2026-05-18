import { ReactNode } from "react";

type CalloutType = "note" | "warning" | "science";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const CONFIG: Record<
  CalloutType,
  { label: string; icon: string; className: string }
> = {
  note: {
    label: "Note",
    icon: "◆",
    className: "border-border bg-bg-subtle",
  },
  warning: {
    label: "Caution",
    icon: "△",
    className:
      "border-amber-300 bg-amber-50 dark:border-amber-700/60 dark:bg-amber-950/20",
  },
  science: {
    label: "The Science",
    icon: "⬡",
    className: "border-accent/40 bg-accent/5",
  },
};

export function Callout({ type = "note", children }: CalloutProps) {
  const { label, icon, className } = CONFIG[type];
  return (
    <aside
      className={`my-8 rounded-md border-l-4 px-5 py-4 ${className}`}
      role="note"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-fg-muted">
        <span aria-hidden>{icon} </span>
        {label}
      </p>
      <div className="text-sm leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
