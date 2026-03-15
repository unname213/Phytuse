"use client";

import { useState, useRef, useCallback } from "react";
import type { AIAnalysis, LayoutStyle } from "@/types";

interface AIPanelProps {
  style: LayoutStyle;
  roomDimensions: { width: number; height: number };
  onRequestSnapshot?: () => string;
}

const PRIORITY_LABEL = { high: "สูง", medium: "กลาง", low: "ต่ำ" } as const;
const PRIORITY_COLOR = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
} as const;
const PRIORITY_DOT = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AIPanel({
  style,
  roomDimensions,
  onRequestSnapshot,
}: AIPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load a File object into state ─────────────────────────────────────
  const loadFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("รองรับเฉพาะไฟล์ JPG, PNG, WEBP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageDataUrl(dataUrl);
      setPreviewUrl(dataUrl);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // ── File input change ─────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  // ── Drag & Drop on the upload zone ────────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  // ── Use canvas snapshot ───────────────────────────────────────────────
  const handleUseCanvas = () => {
    if (!onRequestSnapshot) return;
    const dataUrl = onRequestSnapshot();
    if (!dataUrl) {
      setError("ยังไม่มีข้อมูลบน Canvas");
      return;
    }
    setError(null);
    setImageDataUrl(dataUrl);
    setPreviewUrl(dataUrl);
    setAnalysis(null);
  };

  // ── Clear image ────────────────────────────────────────────────────────
  const handleClear = () => {
    setImageDataUrl(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Call /api/analyze ─────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!imageDataUrl) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageDataUrl, style, roomDimensions }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error ?? "การวิเคราะห์ล้มเหลว");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-3">
        <h2 className="text-white font-semibold text-sm">✨ วิเคราะห์ด้วย AI</h2>
        <p className="text-purple-200 text-xs mt-0.5">
          Claude Vision · ผลลัพธ์เป็นภาษาไทย
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* ── Image source section ── */}
        {!previewUrl ? (
          <>
            {/* Drop zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center gap-2
                border-2 border-dashed rounded-xl p-5 cursor-pointer
                transition-all select-none
                ${
                  isDragging
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50"
                }
              `}
            >
              <span className="text-3xl">{isDragging ? "📂" : "🖼️"}</span>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {isDragging ? "วางรูปที่นี่" : "ลากรูป หรือ คลิกเพื่อเลือก"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  JPG · PNG · WEBP (ไม่เกิน 5 MB)
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Canvas snapshot button */}
            {onRequestSnapshot && (
              <button
                onClick={handleUseCanvas}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors font-medium"
              >
                📐 ใช้ภาพจาก Canvas แทน
              </button>
            )}
          </>
        ) : (
          /* ── Preview ── */
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="ภาพที่จะวิเคราะห์"
              className="w-full object-contain max-h-44"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-sm leading-none transition-colors"
              title="ลบรูป"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
              <p className="text-white text-xs font-medium truncate">
                พร้อมวิเคราะห์
              </p>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* ── Analyze button ── */}
        {previewUrl && (
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                กำลังวิเคราะห์…
              </>
            ) : (
              <>🔍 วิเคราะห์ด้วย AI</>
            )}
          </button>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <div className="space-y-2 animate-pulse">
            {[80, 60, 90, 50].map((w, i) => (
              <div
                key={i}
                className="h-3 bg-gray-200 rounded-full"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {/* ── Empty placeholder ── */}
        {!previewUrl && !isLoading && !analysis && !error && (
          <div className="text-center py-4 text-gray-400">
            <p className="text-xs leading-relaxed">
              อัปโหลดรูปแปลนห้อง หรือใช้ภาพจาก Canvas
              <br />
              แล้วกด วิเคราะห์ด้วย AI
            </p>
          </div>
        )}

        {/* ── Results ── */}
        {analysis && !isLoading && (
          <div className="space-y-4 pt-1">
            <div className="h-px bg-gray-100" />

            {/* ภาพรวม */}
            <section>
              <SectionLabel>📋 ภาพรวม</SectionLabel>
              <p className="text-sm text-gray-700 leading-relaxed mt-1">
                {analysis.summary}
              </p>
            </section>

            {/* ความเข้ากันได้ */}
            <section>
              <SectionLabel>🎨 ความเข้ากันของสไตล์</SectionLabel>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(0, analysis.styleMatch))}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-purple-600 w-10 text-right shrink-0">
                  {analysis.styleMatch}%
                </span>
              </div>
            </section>

            {/* พื้นที่ + การไหล */}
            <section className="grid grid-cols-1 gap-2">
              <InfoCard color="blue" label="📐 การใช้พื้นที่">
                {analysis.spaceUtilization}
              </InfoCard>
              <InfoCard color="green" label="🚶 การเดินทางในพื้นที่">
                {analysis.flowAssessment}
              </InfoCard>
            </section>

            {/* คำแนะนำ */}
            <section>
              <SectionLabel>💡 คำแนะนำ</SectionLabel>
              <ul className="mt-1.5 space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
                    <span className="text-purple-400 font-bold shrink-0 mt-px">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            {/* สิ่งที่ควรปรับปรุง */}
            <section>
              <SectionLabel>🔧 สิ่งที่ควรปรับปรุง</SectionLabel>
              <div className="mt-1.5 space-y-2">
                {analysis.improvements.map((imp, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 items-start text-xs px-3 py-2.5 rounded-lg border ${
                      PRIORITY_COLOR[imp.priority]
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[imp.priority]}`}
                    />
                    <span>
                      <span className="font-semibold mr-1">
                        [{PRIORITY_LABEL[imp.priority]}]
                      </span>
                      {imp.description}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* แพลเลตสี */}
            {analysis.colorPalette.length > 0 && (
              <section>
                <SectionLabel>🎨 แพลเลตสีที่แนะนำ</SectionLabel>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {analysis.colorPalette.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-9 h-9 rounded-lg border-2 border-white shadow-md"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="text-[10px] text-gray-400 font-mono">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Re-analyze */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-2 text-xs text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
            >
              🔄 วิเคราะห์ใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small shared sub-components ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {children}
    </h3>
  );
}

const INFO_CARD_STYLES = {
  blue: {
    wrap: "bg-blue-50 border-blue-100",
    head: "text-blue-600",
    body: "text-blue-700",
  },
  green: {
    wrap: "bg-emerald-50 border-emerald-100",
    head: "text-emerald-600",
    body: "text-emerald-700",
  },
} as const;

function InfoCard({
  color,
  label,
  children,
}: {
  color: keyof typeof INFO_CARD_STYLES;
  label: string;
  children: React.ReactNode;
}) {
  const s = INFO_CARD_STYLES[color];
  return (
    <div className={`rounded-lg p-3 border ${s.wrap}`}>
      <h4 className={`text-xs font-semibold mb-1 ${s.head}`}>{label}</h4>
      <p className={`text-xs leading-snug ${s.body}`}>{children}</p>
    </div>
  );
}
