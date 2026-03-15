export interface FurnitureItem {
  id: string
  type: FurnitureType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
  label: string
}

export type FurnitureType =
  | 'sofa'
  | 'chair'
  | 'table'
  | 'bed'
  | 'desk'
  | 'wardrobe'
  | 'tv_stand'
  | 'bookshelf'
  | 'dining_table'
  | 'coffee_table'

export interface StyleTemplate {
  id: string
  name: string
  nameEn: string
  primary: string
  secondary: string
  accent: string
  background: string
  furniture: string
  text: string
}
