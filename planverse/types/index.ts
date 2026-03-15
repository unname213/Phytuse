export type LayoutStyle =
  | "modern"
  | "scandinavian"
  | "industrial"
  | "bohemian"
  | "minimalist"
  | "japandi";

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  emoji: string;
}

export type FurnitureType =
  | "sofa"
  | "bed"
  | "desk"
  | "dining_table"
  | "wardrobe"
  | "tv"
  | "plant"
  | "bathtub"
  | "chair"
  | "lamp";

export interface FurnitureCatalogItem {
  type: FurnitureType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  color: string;
  emoji: string;
}

export interface Room {
  width: number;
  height: number;
  name: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  roomWidth: number;
  roomHeight: number;
  furniture: FurnitureItem[];
  style: LayoutStyle;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  summary: string;
  suggestions: string[];
  styleMatch: number; // 0-100 score
  spaceUtilization: string;
  flowAssessment: string;
  colorPalette: string[];
  improvements: {
    priority: "high" | "medium" | "low";
    description: string;
  }[];
}

export interface AnalyzeRequest {
  imageBase64: string;
  style: LayoutStyle;
  roomDimensions: {
    width: number;
    height: number;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  analysis?: AIAnalysis;
  error?: string;
}
