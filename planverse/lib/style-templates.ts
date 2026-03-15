import type { FurnitureItem, LayoutStyle } from "@/types";
import { getFurnitureByType } from "./furniture-data";

// ── Color theme per style ────────────────────────────────────────────────────
export interface StyleTheme {
  wallColor: string;
  floorColor: string;
  palette: string[]; // hex swatches shown in StyleSelector
}

export const STYLE_THEMES: Record<LayoutStyle, StyleTheme> = {
  modern: {
    wallColor: "#374151",
    floorColor: "#F8FAFC",
    palette: ["#1E293B", "#64748B", "#E2E8F0", "#F1F5F9", "#0EA5E9"],
  },
  scandinavian: {
    wallColor: "#4B5563",
    floorColor: "#FFF8F0",
    palette: ["#F5F0E8", "#D4C5B0", "#8B9DC3", "#E8DDD0", "#6B8FAB"],
  },
  industrial: {
    wallColor: "#1C1917",
    floorColor: "#F5F0EB",
    palette: ["#292524", "#78716C", "#A8A29E", "#D6D3D1", "#DC2626"],
  },
  bohemian: {
    wallColor: "#44403C",
    floorColor: "#FFFBF5",
    palette: ["#C2410C", "#7C3AED", "#0D9488", "#CA8A04", "#BE185D"],
  },
  minimalist: {
    wallColor: "#9CA3AF",
    floorColor: "#FFFFFF",
    palette: ["#FFFFFF", "#F3F4F6", "#D1D5DB", "#6B7280", "#111827"],
  },
  japandi: {
    wallColor: "#3D3731",
    floorColor: "#FAF7F2",
    palette: ["#E8E0D5", "#8B7355", "#6B8C6B", "#C4A882", "#2D2926"],
  },
};

// ── Furniture colors overrides per style ─────────────────────────────────────
// maps FurnitureType → fill color to use when applying that template
const STYLE_FURNITURE_COLORS: Record<LayoutStyle, Partial<Record<string, string>>> = {
  modern: {
    sofa: "#334155",
    bed: "#64748B",
    desk: "#475569",
    chair: "#94A3B8",
    wardrobe: "#1E293B",
    tv: "#0F172A",
    plant: "#16A34A",
    lamp: "#FCD34D",
    dining_table: "#475569",
    bathtub: "#BAE6FD",
  },
  scandinavian: {
    sofa: "#D4C5B0",
    bed: "#E8DDD0",
    desk: "#C4A882",
    chair: "#B5A898",
    wardrobe: "#A89880",
    tv: "#4B5563",
    plant: "#4ADE80",
    lamp: "#FEF3C7",
    dining_table: "#C4A882",
    bathtub: "#E0F2FE",
  },
  industrial: {
    sofa: "#44403C",
    bed: "#57534E",
    desk: "#78716C",
    chair: "#A8A29E",
    wardrobe: "#292524",
    tv: "#1C1917",
    plant: "#365314",
    lamp: "#CA8A04",
    dining_table: "#57534E",
    bathtub: "#D6D3D1",
  },
  bohemian: {
    sofa: "#9A3412",
    bed: "#7E22CE",
    desk: "#0F766E",
    chair: "#CA8A04",
    wardrobe: "#7C2D12",
    tv: "#292524",
    plant: "#15803D",
    lamp: "#D97706",
    dining_table: "#92400E",
    bathtub: "#0E7490",
  },
  minimalist: {
    sofa: "#E5E7EB",
    bed: "#F3F4F6",
    desk: "#D1D5DB",
    chair: "#E5E7EB",
    wardrobe: "#D1D5DB",
    tv: "#374151",
    plant: "#86EFAC",
    lamp: "#FEF9C3",
    dining_table: "#D1D5DB",
    bathtub: "#DBEAFE",
  },
  japandi: {
    sofa: "#8B7355",
    bed: "#A0896B",
    desk: "#7B6B55",
    chair: "#9C8B75",
    wardrobe: "#6B5B45",
    tv: "#3D3731",
    plant: "#4B7A4B",
    lamp: "#F5DEB3",
    dining_table: "#8B7355",
    bathtub: "#C8D8C8",
  },
};

// ── Template layouts (room coords in cm, for 500×400 room) ───────────────────
type TemplateEntry = {
  type: Parameters<typeof getFurnitureByType>[0];
  x: number;
  y: number;
};

const TEMPLATES: Record<LayoutStyle, TemplateEntry[]> = {
  modern: [
    { type: "sofa",         x: 40,  y: 160 },
    { type: "tv",           x: 160, y: 20  },
    { type: "chair",        x: 260, y: 170 },
    { type: "desk",         x: 360, y: 20  },
    { type: "plant",        x: 430, y: 320 },
    { type: "lamp",         x: 30,  y: 80  },
  ],
  scandinavian: [
    { type: "bed",          x: 150, y: 30  },
    { type: "wardrobe",     x: 20,  y: 20  },
    { type: "desk",         x: 360, y: 30  },
    { type: "chair",        x: 370, y: 110 },
    { type: "plant",        x: 420, y: 320 },
    { type: "lamp",         x: 32,  y: 220 },
  ],
  industrial: [
    { type: "sofa",         x: 30,  y: 160 },
    { type: "tv",           x: 30,  y: 20  },
    { type: "desk",         x: 300, y: 30  },
    { type: "chair",        x: 310, y: 120 },
    { type: "lamp",         x: 245, y: 30  },
    { type: "plant",        x: 420, y: 330 },
  ],
  bohemian: [
    { type: "sofa",         x: 30,  y: 190 },
    { type: "dining_table", x: 220, y: 60  },
    { type: "chair",        x: 180, y: 70  },
    { type: "plant",        x: 380, y: 20  },
    { type: "plant",        x: 20,  y: 310 },
    { type: "lamp",         x: 30,  y: 20  },
  ],
  minimalist: [
    { type: "sofa",         x: 100, y: 210 },
    { type: "desk",         x: 340, y: 50  },
    { type: "plant",        x: 410, y: 310 },
    { type: "tv",           x: 150, y: 30  },
  ],
  japandi: [
    { type: "bed",          x: 160, y: 40  },
    { type: "wardrobe",     x: 20,  y: 30  },
    { type: "desk",         x: 360, y: 40  },
    { type: "plant",        x: 30,  y: 300 },
    { type: "plant",        x: 430, y: 300 },
    { type: "lamp",         x: 300, y: 255 },
  ],
};

// ── Public helper ────────────────────────────────────────────────────────────
export function buildTemplateItems(
  style: LayoutStyle,
  roomWidth: number,
  roomHeight: number
): FurnitureItem[] {
  const entries = TEMPLATES[style];
  const colorMap = STYLE_FURNITURE_COLORS[style];
  const scaleX = roomWidth / 500;
  const scaleY = roomHeight / 400;

  return entries.map((entry, idx) => {
    const catalog = getFurnitureByType(entry.type);
    if (!catalog) return null;

    const itemW = catalog.defaultWidth;
    const itemH = catalog.defaultHeight;
    // Scale position, clamp inside room
    const x = Math.max(0, Math.min(entry.x * scaleX, roomWidth - itemW));
    const y = Math.max(0, Math.min(entry.y * scaleY, roomHeight - itemH));

    return {
      id: `${entry.type}-tpl-${idx}-${Date.now()}`,
      type: catalog.type,
      label: catalog.label,
      x,
      y,
      width: itemW,
      height: itemH,
      rotation: 0,
      color: colorMap[catalog.type] ?? catalog.color,
      emoji: catalog.emoji,
    } satisfies FurnitureItem;
  }).filter((item): item is FurnitureItem => item !== null);
}
