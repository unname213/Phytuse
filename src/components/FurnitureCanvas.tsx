'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import Konva from 'konva'
import { FurnitureItem, FurnitureType } from '@/types/furniture'
import { StyleTemplate } from '@/types/furniture'

interface FurnitureCanvasProps {
  floorPlanUrl: string | null
  furniture: FurnitureItem[]
  onFurnitureChange: (items: FurnitureItem[]) => void
  selectedTemplate: StyleTemplate | null
  onCanvasExport?: (dataUrl: string) => void
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

function FloorPlanBackground({ url, opacity }: { url: string; opacity: number }) {
  const [image] = useImage(url)
  if (!image) return null
  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      opacity={opacity}
    />
  )
}

function FurnitureShape({
  item,
  isSelected,
  onSelect,
  onChange,
  templateColor,
}: {
  item: FurnitureItem
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttrs: Partial<FurnitureItem>) => void
  templateColor: string
}) {
  const shapeRef = useRef<Konva.Rect>(null)
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Group
        x={item.x}
        y={item.y}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() })
        }}
      >
        <Rect
          ref={shapeRef}
          width={item.width}
          height={item.height}
          fill={templateColor || item.color}
          stroke={isSelected ? '#ffffff' : '#00000033'}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={4}
          shadowColor="black"
          shadowBlur={isSelected ? 8 : 3}
          shadowOpacity={0.3}
        />
        <Text
          text={item.label}
          width={item.width}
          height={item.height}
          align="center"
          verticalAlign="middle"
          fontSize={11}
          fill="#ffffff"
          fontStyle="bold"
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox
            return newBox
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current
            if (!node) return
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
              rotation: node.rotation(),
            })
          }}
        />
      )}
    </>
  )
}

export default function FurnitureCanvas({
  floorPlanUrl,
  furniture,
  onFurnitureChange,
  selectedTemplate,
  onCanvasExport,
}: FurnitureCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [floorOpacity, setFloorOpacity] = useState(0.4)
  const stageRef = useRef<Konva.Stage>(null)

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleChange = useCallback(
    (id: string, newAttrs: Partial<FurnitureItem>) => {
      onFurnitureChange(furniture.map((item) => (item.id === id ? { ...item, ...newAttrs } : item)))
    },
    [furniture, onFurnitureChange]
  )

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }, [])

  const handleDeleteSelected = useCallback(() => {
    if (selectedId) {
      onFurnitureChange(furniture.filter((item) => item.id !== selectedId))
      setSelectedId(null)
    }
  }, [selectedId, furniture, onFurnitureChange])

  const handleExport = useCallback(() => {
    if (stageRef.current && onCanvasExport) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 })
      onCanvasExport(dataUrl)
    }
  }, [onCanvasExport])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        handleDeleteSelected()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, handleDeleteSelected])

  return (
    <div className="flex flex-col gap-2">
      {floorPlanUrl && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded-lg text-sm">
          <span className="text-gray-400">ความโปร่งใสแปลน:</span>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={floorOpacity}
            onChange={(e) => setFloorOpacity(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-white w-10 text-right">{Math.round(floorOpacity * 100)}%</span>
        </div>
      )}

      <div
        className="border border-gray-600 rounded-lg overflow-hidden cursor-crosshair"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleStageClick}
          style={{ background: selectedTemplate?.background || '#f5f5f5' }}
        >
          <Layer>
            {/* Grid */}
            {Array.from({ length: Math.floor(CANVAS_WIDTH / 40) }).map((_, i) => (
              <Rect
                key={`vg-${i}`}
                x={i * 40}
                y={0}
                width={1}
                height={CANVAS_HEIGHT}
                fill="#00000010"
              />
            ))}
            {Array.from({ length: Math.floor(CANVAS_HEIGHT / 40) }).map((_, i) => (
              <Rect
                key={`hg-${i}`}
                x={0}
                y={i * 40}
                width={CANVAS_WIDTH}
                height={1}
                fill="#00000010"
              />
            ))}

            {/* Floor plan background */}
            {floorPlanUrl && <FloorPlanBackground url={floorPlanUrl} opacity={floorOpacity} />}

            {/* Furniture items */}
            {furniture.map((item) => (
              <FurnitureShape
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={() => handleSelect(item.id)}
                onChange={(attrs) => handleChange(item.id, attrs)}
                templateColor={selectedTemplate?.furniture || item.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-gray-500">
          คลิกเฟอร์นิเจอร์เพื่อเลือก • ลาก เพื่อย้าย • Delete เพื่อลบ
        </span>
        {onCanvasExport && (
          <button
            onClick={handleExport}
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Export PNG
          </button>
        )}
      </div>
    </div>
  )
}
