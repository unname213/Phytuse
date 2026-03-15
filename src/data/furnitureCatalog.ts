import { FurnitureType } from '@/types/furniture'

export interface FurnitureCatalogItem {
  type: FurnitureType
  label: string
  labelEn: string
  defaultWidth: number
  defaultHeight: number
  emoji: string
}

export const furnitureCatalog: FurnitureCatalogItem[] = [
  { type: 'sofa', label: 'โซฟา', labelEn: 'Sofa', defaultWidth: 120, defaultHeight: 60, emoji: '🛋️' },
  { type: 'chair', label: 'เก้าอี้', labelEn: 'Chair', defaultWidth: 50, defaultHeight: 50, emoji: '🪑' },
  { type: 'table', label: 'โต๊ะ', labelEn: 'Table', defaultWidth: 80, defaultHeight: 80, emoji: '🟫' },
  { type: 'bed', label: 'เตียง', labelEn: 'Bed', defaultWidth: 120, defaultHeight: 160, emoji: '🛏️' },
  { type: 'desk', label: 'โต๊ะทำงาน', labelEn: 'Desk', defaultWidth: 100, defaultHeight: 60, emoji: '🖥️' },
  { type: 'wardrobe', label: 'ตู้เสื้อผ้า', labelEn: 'Wardrobe', defaultWidth: 90, defaultHeight: 50, emoji: '🚪' },
  { type: 'tv_stand', label: 'ตู้ทีวี', labelEn: 'TV Stand', defaultWidth: 120, defaultHeight: 40, emoji: '📺' },
  { type: 'bookshelf', label: 'ชั้นหนังสือ', labelEn: 'Bookshelf', defaultWidth: 80, defaultHeight: 30, emoji: '📚' },
  { type: 'dining_table', label: 'โต๊ะกินข้าว', labelEn: 'Dining Table', defaultWidth: 100, defaultHeight: 80, emoji: '🍽️' },
  { type: 'coffee_table', label: 'โต๊ะกาแฟ', labelEn: 'Coffee Table', defaultWidth: 70, defaultHeight: 50, emoji: '☕' },
]
