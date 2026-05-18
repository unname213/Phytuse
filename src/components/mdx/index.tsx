import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { IngredientCard } from "./IngredientCard";
import { Comparison } from "./Comparison";
import { References } from "./References";
import { FAQ } from "./FAQ";

export const mdxComponents: MDXComponents = {
  // Custom components available in MDX files
  Callout,
  IngredientCard,
  Comparison,
  References,
  FAQ,
  // Headings with anchor links (rehype-slug adds the id, rehype-autolink wraps with <a>)
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
};
