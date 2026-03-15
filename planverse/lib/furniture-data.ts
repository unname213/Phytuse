import type { FurnitureCatalogItem } from "@/types";

export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  {
    type: "sofa",
    label: "Sofa",
    defaultWidth: 160,
    defaultHeight: 80,
    color: "#6B7280",
    emoji: "🛋️",
  },
  {
    type: "bed",
    label: "Bed",
    defaultWidth: 140,
    defaultHeight: 200,
    color: "#8B5CF6",
    emoji: "🛏️",
  },
  {
    type: "desk",
    label: "Desk",
    defaultWidth: 120,
    defaultHeight: 60,
    color: "#D97706",
    emoji: "🖥️",
  },
  {
    type: "dining_table",
    label: "Dining Table",
    defaultWidth: 140,
    defaultHeight: 80,
    color: "#B45309",
    emoji: "🍽️",
  },
  {
    type: "wardrobe",
    label: "Wardrobe",
    defaultWidth: 100,
    defaultHeight: 60,
    color: "#374151",
    emoji: "🚪",
  },
  {
    type: "tv",
    label: "TV",
    defaultWidth: 100,
    defaultHeight: 20,
    color: "#1F2937",
    emoji: "📺",
  },
  {
    type: "plant",
    label: "Plant",
    defaultWidth: 40,
    defaultHeight: 40,
    color: "#059669",
    emoji: "🌿",
  },
  {
    type: "bathtub",
    label: "Bathtub",
    defaultWidth: 80,
    defaultHeight: 160,
    color: "#60A5FA",
    emoji: "🛁",
  },
  {
    type: "chair",
    label: "Chair",
    defaultWidth: 60,
    defaultHeight: 60,
    color: "#9CA3AF",
    emoji: "🪑",
  },
  {
    type: "lamp",
    label: "Lamp",
    defaultWidth: 30,
    defaultHeight: 30,
    color: "#FCD34D",
    emoji: "💡",
  },
];

export function getFurnitureByType(type: string) {
  return FURNITURE_CATALOG.find((item) => item.type === type);
}
