"use client";

import type { LayoutStyle } from "@/types";
import { STYLE_THEMES } from "@/lib/style-templates";

interface StyleOption {
  value: LayoutStyle;
  label: string;
  emoji: string;
  description: string;
}

const STYLES: StyleOption[] = [
  { value: "modern",       label: "Modern",        emoji: "🏙️", description: "Clean lines, neutral tones"         },
  { value: "scandinavian", label: "Scandinavian",  emoji: "❄️", description: "Minimalist, functional, cozy"       },
  { value: "industrial",   label: "Industrial",    emoji: "🏭", description: "Raw materials, urban feel"          },
  { value: "bohemian",     label: "Bohemian",      emoji: "🌺", description: "Eclectic, vibrant, layered"         },
  { value: "minimalist",   label: "Minimalist",    emoji: "⬜", description: "Less is more"                       },
  { value: "japandi",      label: "Japandi",       emoji: "🎋", description: "Japanese + Scandi fusion"           },
];

interface StyleSelectorProps {
  value: LayoutStyle;
  onChange: (style: LayoutStyle) => void;
  onApplyTemplate?: (style: LayoutStyle) => void;
}

export default function StyleSelector({
  value,
  onChange,
  onApplyTemplate,
}: StyleSelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3">
        <h2 className="text-white font-semibold text-sm">🎨 Interior Style</h2>
        <p className="text-amber-100 text-xs mt-0.5">Choose your design style</p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {STYLES.map((style) => {
          const theme = STYLE_THEMES[style.value];
          const isSelected = value === style.value;
          return (
            <button
              key={style.value}
              onClick={() => onChange(style.value)}
              className={`flex flex-col items-start p-2.5 rounded-lg border transition-all text-left ${
                isSelected
                  ? "border-amber-500 bg-amber-50 shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200"
              }`}
            >
              <span className="text-xl mb-1">{style.emoji}</span>
              <span className={`text-xs font-semibold ${isSelected ? "text-amber-700" : "text-gray-700"}`}>
                {style.label}
              </span>
              <span className="text-xs text-gray-400 leading-tight mt-0.5">
                {style.description}
              </span>

              {/* Color palette swatches */}
              <div className="flex gap-1 mt-2">
                {theme.palette.slice(0, 5).map((hex, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>

              {isSelected && (
                <span className="mt-1.5 text-xs text-amber-600 font-medium">✓ Selected</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Apply Template button */}
      {onApplyTemplate && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onApplyTemplate(value)}
            className="w-full py-2 px-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            ✨ Apply {STYLES.find((s) => s.value === value)?.label} Template
          </button>
          <p className="text-xs text-gray-400 text-center mt-1.5 leading-tight">
            Replaces canvas with a curated furniture arrangement
          </p>
        </div>
      )}
    </div>
  );
}
