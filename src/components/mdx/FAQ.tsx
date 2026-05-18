"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

function FAQRow({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-fg transition-colors hover:text-accent"
        aria-expanded={open}
      >
        <span>{question}</span>
        <span
          className="shrink-0 text-lg leading-none text-fg-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-fg-muted">{answer}</p>
      )}
    </div>
  );
}

export function FAQ({ items }: FAQProps) {
  return (
    <section
      aria-label="Frequently Asked Questions"
      className="not-prose my-8 rounded-lg border border-border bg-bg-subtle px-5"
    >
      <h3 className="border-b border-border py-4 font-serif text-base font-semibold text-fg">
        Frequently Asked Questions
      </h3>
      {items.map((item, i) => (
        <FAQRow key={i} {...item} />
      ))}
    </section>
  );
}
