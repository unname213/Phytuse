export function calculateReadingTime(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, "") // strip code blocks
    .replace(/<[^>]+>/g, "") // strip HTML tags
    .replace(/[#*_~`[\]()!]/g, ""); // strip markdown syntax
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
