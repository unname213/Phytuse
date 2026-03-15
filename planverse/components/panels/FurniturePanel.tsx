"use client";

import { FURNITURE_CATALOG } from "@/lib/furniture-data";
import type { FurnitureItem, FurnitureType } from "@/types";

interface FurniturePanelProps {
  onAddFurniture: (item: FurnitureItem) => void;
}

export default function FurniturePanel({ onAddFurniture }: FurniturePanelProps) {
  const handleAdd = (type: FurnitureType) => {
    const catalog = FURNITURE_CATALOG.find((c) => c.type === type);
    if (!catalog) return;

    const newItem: FurnitureItem = {
      id: `${type}-${Date.now()}`,
      type: catalog.type,
      label: catalog.label,
      x: 50,
      y: 50,
      width: catalog.defaultWidth,
      height: catalog.defaultHeight,
      rotation: 0,
      color: catalog.color,
      emoji: catalog.emoji,
    };
    onAddFurniture(newItem);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3">
        <h2 className="text-white font-semibold text-sm">🛋️ Furniture</h2>
        <p className="text-slate-300 text-xs mt-0.5">Drag onto canvas or click to add</p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
        {FURNITURE_CATALOG.map((item) => (
          <button
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("furnitureType", item.type);
              e.dataTransfer.effectAllowed = "copy";
            }}
            onClick={() => handleAdd(item.type)}
            className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all group cursor-grab active:cursor-grabbing select-none"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {item.emoji}
            </span>
            <span className="text-xs text-gray-600 font-medium text-center leading-tight">
              {item.label}
            </span>
            <span className="text-xs text-gray-400">
              {item.defaultWidth}×{item.defaultHeight}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
