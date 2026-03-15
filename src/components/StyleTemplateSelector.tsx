'use client'

import { styleTemplates } from '@/data/styleTemplates'
import { StyleTemplate } from '@/types/furniture'

interface StyleTemplateSelectorProps {
  selected: StyleTemplate | null
  onSelect: (template: StyleTemplate) => void
}

export default function StyleTemplateSelector({ selected, onSelect }: StyleTemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">สไตล์</h3>
      <div className="grid grid-cols-2 gap-2">
        {styleTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`
              relative p-2 rounded-lg border-2 transition-all text-left
              ${selected?.id === template.id ? 'border-blue-400 scale-[1.02]' : 'border-transparent hover:border-gray-500'}
            `}
            style={{ background: template.secondary }}
          >
            {/* Color swatches */}
            <div className="flex gap-1 mb-1">
              {[template.primary, template.accent, template.furniture].map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className="text-xs font-medium" style={{ color: template.text }}>
              {template.name}
            </div>
            <div className="text-xs opacity-70" style={{ color: template.text }}>
              {template.nameEn}
            </div>
            {selected?.id === template.id && (
              <div className="absolute top-1 right-1 text-blue-400 text-xs">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
