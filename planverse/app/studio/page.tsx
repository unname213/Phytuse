"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FurniturePanel from "@/components/panels/FurniturePanel";
import AIPanel from "@/components/panels/AIPanel";
import StyleSelector from "@/components/StyleSelector";
import type { FurnitureItem, LayoutStyle } from "@/types";
import type { StudioCanvasHandle } from "@/components/canvas/StudioCanvas";

// Dynamically import StudioCanvas to avoid SSR issues with Konva
const StudioCanvas = dynamic(() => import("@/components/canvas/StudioCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2 animate-pulse">🏠</div>
        <p className="text-sm">กำลังโหลด Canvas…</p>
      </div>
    </div>
  ),
});

export default function StudioPage() {
  const canvasRef = useRef<StudioCanvasHandle | null>(null);

  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [style, setStyle] = useState<LayoutStyle>("modern");
  const [roomWidth] = useState(500);
  const [roomHeight] = useState(400);

  const handleAddFurniture = useCallback((item: FurnitureItem) => {
    setFurniture((prev) => [...prev, item]);
  }, []);

  const handleFurnitureChange = useCallback((updated: FurnitureItem[]) => {
    setFurniture(updated);
  }, []);

  /** Called by AIPanel to capture the current canvas as a PNG dataUrl */
  const getCanvasSnapshot = useCallback(
    () => canvasRef.current?.getDataUrl() ?? "",
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Home
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-gray-800">planverse</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {furniture.length} item{furniture.length !== 1 ? "s" : ""} on canvas
          </span>
          <button
            onClick={() => setFurniture([])}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            Clear All
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto p-3 space-y-3 shrink-0">
          <FurniturePanel onAddFurniture={handleAddFurniture} />
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Floor Plan Editor
              </h1>
              <p className="text-sm text-gray-500">
                Room: {roomWidth}cm × {roomHeight}cm · Style:{" "}
                <span className="capitalize font-medium text-gray-700">
                  {style}
                </span>
              </p>
            </div>
          </div>

          <StudioCanvas
            ref={canvasRef}
            furniture={furniture}
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            onFurnitureChange={handleFurnitureChange}
          />

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <strong>เคล็ดลับ:</strong> ลากเฟอร์นิเจอร์จากแถบซ้ายมาวางบน
              Canvas หรือคลิกเพื่อเพิ่มที่ตำแหน่งเริ่มต้น · เลือกแล้วกด{" "}
              <kbd className="px-1 py-0.5 bg-white border border-blue-200 rounded text-blue-600 font-mono text-xs">
                Del
              </kbd>{" "}
              เพื่อลบ · ใช้แถบขวาเพื่ออัปโหลดรูปหรือดึงภาพ Canvas
              มาวิเคราะห์ด้วย AI
            </p>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 overflow-y-auto p-3 space-y-3 shrink-0">
          <StyleSelector value={style} onChange={setStyle} />
          <AIPanel
            style={style}
            roomDimensions={{ width: roomWidth, height: roomHeight }}
            onRequestSnapshot={getCanvasSnapshot}
          />
        </aside>
      </div>
    </div>
  );
}
