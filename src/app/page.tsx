'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import FloorPlanUpload from '@/components/FloorPlanUpload'
import FurniturePalette from '@/components/FurniturePalette'
import StyleTemplateSelector from '@/components/StyleTemplateSelector'
import AnalysisSidebar from '@/components/AnalysisSidebar'
import { FurnitureItem, StyleTemplate } from '@/types/furniture'

// Dynamic import to avoid SSR issues with Konva
const FurnitureCanvas = dynamic(() => import('@/components/FurnitureCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-[800px] h-[600px] bg-gray-800 rounded-lg border border-gray-600">
      <div className="text-gray-400">กำลังโหลด Canvas...</div>
    </div>
  ),
})

export default function Home() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null)
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<StyleTemplate | null>(null)
  const [activeTab, setActiveTab] = useState<'furniture' | 'style' | 'analysis'>('furniture')

  const handleFloorPlanUpload = useCallback((url: string, file: File) => {
    setFloorPlanUrl(url)
    setFloorPlanFile(file)
  }, [])

  const handleAddFurniture = useCallback((item: FurnitureItem) => {
    setFurniture((prev) => [...prev, item])
  }, [])

  const handleExport = useCallback((dataUrl: string) => {
    const link = document.createElement('a')
    link.download = 'room-design.png'
    link.href = dataUrl
    link.click()
  }, [])

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: selectedTemplate?.primary || '#0f0f1a' }}
    >
      {/* Header */}
      <header
        className="px-6 py-4 border-b border-white/10 flex items-center justify-between"
        style={{ background: selectedTemplate?.secondary || '#1a1a2e' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: selectedTemplate?.accent || '#e94560' }}
            >
              Phytuse
            </h1>
            <p className="text-xs text-gray-400">AI-Powered Furniture Layout Designer</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">Claude Vision</span>
          <span className="px-2 py-1 bg-blue-900/50 rounded text-blue-300">react-konva</span>
          <span className="px-2 py-1 bg-green-900/50 rounded text-green-300">Supabase</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="w-64 border-r border-white/10 flex flex-col overflow-y-auto"
          style={{ background: selectedTemplate?.secondary || '#16213e' }}
        >
          {/* Tab navigation */}
          <div className="flex border-b border-white/10">
            {(['furniture', 'style', 'analysis'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-400 text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'furniture' ? '🛋️' : tab === 'style' ? '🎨' : '🔍'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 p-4">
            {activeTab === 'furniture' && (
              <>
                <FloorPlanUpload
                  onUpload={handleFloorPlanUpload}
                  currentUrl={floorPlanUrl}
                />
                <div className="border-t border-white/10" />
                <FurniturePalette
                  onAddFurniture={handleAddFurniture}
                  furnitureColor={selectedTemplate?.furniture || '#e94560'}
                />
              </>
            )}

            {activeTab === 'style' && (
              <StyleTemplateSelector
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            )}

            {activeTab === 'analysis' && (
              <AnalysisSidebar floorPlanFile={floorPlanFile} />
            )}
          </div>

          {/* Furniture count */}
          <div className="mt-auto p-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              เฟอร์นิเจอร์: {furniture.length} ชิ้น
              {selectedTemplate && (
                <span className="ml-2 text-gray-400">• {selectedTemplate.name}</span>
              )}
            </p>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
          <div className="flex flex-col gap-4">
            <FurnitureCanvas
              floorPlanUrl={floorPlanUrl}
              furniture={furniture}
              onFurnitureChange={setFurniture}
              selectedTemplate={selectedTemplate}
              onCanvasExport={handleExport}
            />

            {/* Quick actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setFurniture([])}
                className="text-xs px-3 py-1.5 bg-red-900/50 hover:bg-red-800/50 text-red-300 rounded transition-colors"
              >
                ล้างทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
