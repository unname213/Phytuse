"use client";

import { useRef, useState, useCallback } from "react";
import type { ReactElement } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import FurnitureItem from "./FurnitureItem";
import type { FurnitureItem as FurnitureItemType } from "@/types";

interface StudioCanvasProps {
  furniture: FurnitureItemType[];
  roomWidth: number;
  roomHeight: number;
  onFurnitureChange: (furniture: FurnitureItemType[]) => void;
  onCanvasExport?: (dataUrl: string) => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 20;

export default function StudioCanvas({
  furniture,
  roomWidth,
  roomHeight,
  onFurnitureChange,
  onCanvasExport,
}: StudioCanvasProps) {
  const stageRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scale = Math.min(
    (CANVAS_WIDTH - 40) / roomWidth,
    (CANVAS_HEIGHT - 40) / roomHeight
  );
  const scaledRoomWidth = roomWidth * scale;
  const scaledRoomHeight = roomHeight * scale;
  const offsetX = (CANVAS_WIDTH - scaledRoomWidth) / 2;
  const offsetY = (CANVAS_HEIGHT - scaledRoomHeight) / 2;

  // Generate grid lines
  const gridLines: ReactElement[] = [];
  const gridStep = GRID_SIZE;
  for (let x = 0; x <= scaledRoomWidth; x += gridStep) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[offsetX + x, offsetY, offsetX + x, offsetY + scaledRoomHeight]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />
    );
  }
  for (let y = 0; y <= scaledRoomHeight; y += gridStep) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[offsetX, offsetY + y, offsetX + scaledRoomWidth, offsetY + y]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />
    );
  }

  const handleDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleItemChange = useCallback(
    (updatedItem: FurnitureItemType) => {
      onFurnitureChange(
        furniture.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    },
    [furniture, onFurnitureChange]
  );

  const handleExport = () => {
    if (stageRef.current && onCanvasExport) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      onCanvasExport(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleDeselect}
          onTouchStart={handleDeselect}
        >
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#F9FAFB"
            />

            {/* Grid lines */}
            {gridLines}

            {/* Room boundary */}
            <Rect
              x={offsetX}
              y={offsetY}
              width={scaledRoomWidth}
              height={scaledRoomHeight}
              fill="#FFFFFF"
              stroke="#374151"
              strokeWidth={2}
              shadowBlur={4}
              shadowColor="rgba(0,0,0,0.1)"
            />

            {/* Furniture items */}
            {furniture.map((item) => (
              <FurnitureItem
                key={item.id}
                item={{
                  ...item,
                  x: offsetX + item.x * scale,
                  y: offsetY + item.y * scale,
                  width: item.width * scale,
                  height: item.height * scale,
                }}
                isSelected={selectedId === item.id}
                onSelect={setSelectedId}
                onChange={(updatedItem) => {
                  handleItemChange({
                    ...updatedItem,
                    x: (updatedItem.x - offsetX) / scale,
                    y: (updatedItem.y - offsetY) / scale,
                    width: item.width,
                    height: item.height,
                  });
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {onCanvasExport && (
        <button
          onClick={handleExport}
          className="self-end px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          📸 Export for AI Analysis
        </button>
      )}
    </div>
  );
}
