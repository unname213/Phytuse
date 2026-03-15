'use client'

import { furnitureCatalog } from '@/data/furnitureCatalog'
import { FurnitureItem, FurnitureType } from '@/types/furniture'

interface FurniturePaletteProps {
  onAddFurniture: (item: FurnitureItem) => void
  furnitureColor: string
}

export default function FurniturePalette({ onAddFurniture, furnitureColor }: FurniturePaletteProps) {
  const handleAdd = (type: FurnitureType) => {
    const catalog = furnitureCatalog.find((f) => f.type === type)!
    const newItem: FurnitureItem = {
      id: `${type}-${Date.now()}`,
      type,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: catalog.defaultWidth,
      height: catalog.defaultHeight,
      rotation: 0,
      color: furnitureColor,
      label: catalog.label,
    }
    onAddFurniture(newItem)
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">เฟอร์นิเจอร์</h3>
      <div className="grid grid-cols-2 gap-2">
        {furnitureCatalog.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAdd(item.type)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group"
          >
            <span className="text-xl">{item.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{item.label}</div>
              <div className="text-xs text-gray-400 truncate">{item.labelEn}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
