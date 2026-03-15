"use client";

import type { LayoutStyle } from "@/types";

interface StyleOption {
  value: LayoutStyle;
  label: string;
  emoji: string;
  description: string;
}

const STYLES: StyleOption[] = [
  {
    value: "modern",
    label: "Modern",
    emoji: "🏙️",
    description: "Clean lines, neutral tones",
  },
  {
    value: "scandinavian",
    label: "Scandinavian",
    emoji: "❄️",
    description: "Minimalist, functional, cozy",
  },
  {
    value: "industrial",
    label: "Industrial",
    emoji: "🏭",
    description: "Raw materials, urban feel",
  },
  {
    value: "bohemian",
    label: "Bohemian",
    emoji: "🌺",
    description: "Eclectic, vibrant, layered",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    emoji: "⬜",
    description: "Less is more",
  },
  {
    value: "japandi",
    label: "Japandi",
    emoji: "🎋",
    description: "Japanese + Scandinavian fusion",
  },
];

interface StyleSelectorProps {
  value: LayoutStyle;
  onChange: (style: LayoutStyle) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3">
        <h2 className="text-white font-semibold text-sm">🎨 Interior Style</h2>
        <p className="text-amber-100 text-xs mt-0.5">Choose your design style</p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {STYLES.map((style) => (
          <button
            key={style.value}
            onClick={() => onChange(style.value)}
            className={`flex flex-col items-start p-3 rounded-lg border transition-all text-left ${
              value === style.value
                ? "border-amber-500 bg-amber-50 shadow-sm"
                : "border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200"
            }`}
          >
            <span className="text-xl mb-1">{style.emoji}</span>
            <span
              className={`text-xs font-semibold ${
                value === style.value ? "text-amber-700" : "text-gray-700"
              }`}
            >
              {style.label}
            </span>
            <span className="text-xs text-gray-400 leading-tight mt-0.5">
              {style.description}
            </span>
            {value === style.value && (
              <span className="mt-1 text-xs text-amber-600 font-medium">
                ✓ Selected
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
