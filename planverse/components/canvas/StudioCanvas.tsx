"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Line, Group, Text } from "react-konva";
import FurnitureItem from "./FurnitureItem";
import type { FurnitureItem as FurnitureItemType, FurnitureType } from "@/types";
import { getFurnitureByType } from "@/lib/furniture-data";

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
const WALL = 10; // wall thickness in px
const CORNER_LEN = 16; // corner mark length

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
    (CANVAS_WIDTH - 120) / roomWidth,
    (CANVAS_HEIGHT - 100) / roomHeight
  );
  const scaledRoomW = roomWidth * scale;
  const scaledRoomH = roomHeight * scale;
  const offsetX = (CANVAS_WIDTH - scaledRoomW) / 2;
  const offsetY = (CANVAS_HEIGHT - scaledRoomH) / 2;

  // ── Room bounds in stage coords (used for dragBoundFunc) ──────────────
  const stageBounds = {
    minX: offsetX,
    minY: offsetY,
    maxX: offsetX + scaledRoomW,
    maxY: offsetY + scaledRoomH,
  };

  // ── Delete key ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!selectedId) return;
      onFurnitureChange(furniture.filter((item) => item.id !== selectedId));
      setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, furniture, onFurnitureChange]);

  // ── Deselect on canvas/floor click ────────────────────────────────────
  const handleDeselect = (e: any) => {
    const name: string = e.target?.name?.() ?? "";
    if (e.target === e.target.getStage() || name === "room-floor") {
      setSelectedId(null);
    }
  };

  // ── Update item position (room coords) ────────────────────────────────
  const handleItemChange = useCallback(
    (updatedItem: FurnitureItemType) => {
      onFurnitureChange(
        furniture.map((f) => (f.id === updatedItem.id ? updatedItem : f))
      );
    },
    [furniture, onFurnitureChange]
  );

  // ── HTML5 drag-from-panel drop ─────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("furnitureType") as FurnitureType;
      if (!type) return;
      const catalog = getFurnitureByType(type);
      if (!catalog) return;

      // Convert client position → room coordinates
      const container = stageRef.current?.container() as HTMLDivElement | null;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const stageX = e.clientX - rect.left;
      const stageY = e.clientY - rect.top;

      // Centre item on cursor, clamp inside room
      const itemW = catalog.defaultWidth;
      const itemH = catalog.defaultHeight;
      const roomX = Math.max(
        0,
        Math.min((stageX - offsetX) / scale - itemW / 2, roomWidth - itemW)
      );
      const roomY = Math.max(
        0,
        Math.min((stageY - offsetY) / scale - itemH / 2, roomHeight - itemH)
      );

      const newItem: FurnitureItemType = {
        id: `${type}-${Date.now()}`,
        type: catalog.type,
        label: catalog.label,
        x: roomX,
        y: roomY,
        width: itemW,
        height: itemH,
        rotation: 0,
        color: catalog.color,
        emoji: catalog.emoji,
      };
      onFurnitureChange([...furniture, newItem]);
    },
    [furniture, onFurnitureChange, offsetX, offsetY, scale, roomWidth, roomHeight]
  );

  // ── Export ─────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (stageRef.current && onCanvasExport) {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      onCanvasExport(dataUrl);
    }
  };

  // ── Grid lines (clipped to room interior) ─────────────────────────────
  const gridLines = [];
  for (let x = GRID_SIZE; x < scaledRoomW; x += GRID_SIZE) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[offsetX + x, offsetY, offsetX + x, offsetY + scaledRoomH]}
        stroke="#E5E7EB"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }
  for (let y = GRID_SIZE; y < scaledRoomH; y += GRID_SIZE) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[offsetX, offsetY + y, offsetX + scaledRoomW, offsetY + y]}
        stroke="#E5E7EB"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }

  // ── Corner marks (L-shapes at 4 corners) ──────────────────────────────
  const corners = [
    // [startX, startY, hDir, vDir]  1 = positive, -1 = negative
    [offsetX, offsetY, 1, 1],
    [offsetX + scaledRoomW, offsetY, -1, 1],
    [offsetX, offsetY + scaledRoomH, 1, -1],
    [offsetX + scaledRoomW, offsetY + scaledRoomH, -1, -1],
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      {/* Canvas wrapper — receives HTML5 drops from FurniturePanel */}
      <div
        className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner cursor-crosshair"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleDeselect}
          onTouchStart={handleDeselect}
        >
          <Layer>
            {/* ── Outer background ── */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#F3F4F6"
              listening={false}
            />

            {/* ── Wall (outer border of room) ── */}
            <Rect
              x={offsetX - WALL}
              y={offsetY - WALL}
              width={scaledRoomW + WALL * 2}
              height={scaledRoomH + WALL * 2}
              fill="#374151"
              cornerRadius={2}
              shadowBlur={8}
              shadowColor="rgba(0,0,0,0.25)"
              shadowOffsetY={2}
              listening={false}
            />

            {/* ── Floor (inner room) ── */}
            <Rect
              name="room-floor"
              x={offsetX}
              y={offsetY}
              width={scaledRoomW}
              height={scaledRoomH}
              fill="#FAFAF8"
              listening={true}
            />

            {/* ── Grid (clipped to room) ── */}
            <Group
              clipX={offsetX}
              clipY={offsetY}
              clipWidth={scaledRoomW}
              clipHeight={scaledRoomH}
              listening={false}
            >
              {gridLines}
            </Group>

            {/* ── Corner marks ── */}
            {corners.map(([cx, cy, hd, vd], i) => (
              <Group key={i} listening={false}>
                <Line
                  points={[cx + hd * CORNER_LEN, cy, cx, cy, cx, cy + vd * CORNER_LEN]}
                  stroke="#9CA3AF"
                  strokeWidth={1.5}
                  lineCap="square"
                />
              </Group>
            ))}

            {/* ── Dimension labels ── */}
            <Text
              x={offsetX}
              y={offsetY - WALL - 16}
              width={scaledRoomW}
              text={`${roomWidth} cm`}
              fontSize={11}
              fill="#6B7280"
              align="center"
              listening={false}
            />
            <Text
              x={offsetX + scaledRoomW + WALL + 4}
              y={offsetY}
              height={scaledRoomH}
              text={`${roomHeight} cm`}
              fontSize={11}
              fill="#6B7280"
              verticalAlign="middle"
              rotation={90}
              listening={false}
            />

            {/* ── Furniture items ── */}
            {furniture.map((item) => {
              const stageItem = {
                ...item,
                x: offsetX + item.x * scale,
                y: offsetY + item.y * scale,
                width: item.width * scale,
                height: item.height * scale,
              };
              return (
                <FurnitureItem
                  key={item.id}
                  item={stageItem}
                  isSelected={selectedId === item.id}
                  stageBounds={{
                    minX: stageBounds.minX,
                    minY: stageBounds.minY,
                    maxX: stageBounds.maxX - item.width * scale,
                    maxY: stageBounds.maxY - item.height * scale,
                  }}
                  onSelect={setSelectedId}
                  onChange={(updated) =>
                    handleItemChange({
                      ...updated,
                      x: (updated.x - offsetX) / scale,
                      y: (updated.y - offsetY) / scale,
                      width: item.width,
                      height: item.height,
                    })
                  }
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* Toolbar row */}
      <div className="flex items-center justify-between">
        {selectedId ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-500 font-mono">
              Del
            </kbd>
            to remove selected item
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            Click an item to select · drag from panel or canvas
          </span>
        )}

        {onCanvasExport && (
          <button
            data-canvas-export
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            📸 Export for AI Analysis
          </button>
        )}
      </div>
    </div>
  );
}
