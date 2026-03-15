"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FurniturePanel from "@/components/panels/FurniturePanel";
import AIPanel from "@/components/panels/AIPanel";
import StyleSelector from "@/components/StyleSelector";
import type { FurnitureItem, LayoutStyle, AIAnalysis } from "@/types";

// Dynamically import StudioCanvas to avoid SSR issues with Konva
const StudioCanvas = dynamic(() => import("@/components/canvas/StudioCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2 animate-pulse">🏠</div>
        <p className="text-sm">Loading canvas...</p>
      </div>
    </div>
  ),
});

export default function StudioPage() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [style, setStyle] = useState<LayoutStyle>("modern");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roomWidth] = useState(500);
  const [roomHeight] = useState(400);

  const handleAddFurniture = useCallback((item: FurnitureItem) => {
    setFurniture((prev) => [...prev, item]);
  }, []);

  const handleFurnitureChange = useCallback((updated: FurnitureItem[]) => {
    setFurniture(updated);
  }, []);

  const handleCanvasExport = useCallback(
    async (dataUrl: string) => {
      setIsAnalyzing(true);
      try {
        const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            style,
            roomDimensions: { width: roomWidth, height: roomHeight },
          }),
        });

        const data = await res.json();
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          alert(data.error || "Analysis failed");
        }
      } catch (err) {
        alert("Failed to analyze layout");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [style, roomWidth, roomHeight]
  );

  const handleAnalyzeClick = () => {
    // Trigger canvas export from the AIPanel button
    const exportBtn = document.querySelector(
      "[data-canvas-export]"
    ) as HTMLButtonElement;
    if (exportBtn) {
      exportBtn.click();
    }
  };

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
            furniture={furniture}
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            onFurnitureChange={handleFurnitureChange}
            onCanvasExport={handleCanvasExport}
          />

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Click furniture in the left panel to add it
              to the canvas. Drag items to position them. Click{" "}
              <strong>Export for AI Analysis</strong> to get Claude feedback.
            </p>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 overflow-y-auto p-3 space-y-3 shrink-0">
          <StyleSelector value={style} onChange={setStyle} />
          <AIPanel
            analysis={analysis}
            isLoading={isAnalyzing}
            onAnalyze={handleAnalyzeClick}
          />
        </aside>
      </div>
    </div>
  );
}
