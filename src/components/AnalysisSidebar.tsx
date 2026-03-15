'use client'

import { useState, useCallback } from 'react'

interface FloorPlanAnalysis {
  roomType: string
  estimatedSize: string
  shape: string
  features: string[]
  suggestions: string[]
  furnitureRecommendations: string[]
  styleAdvice: string
  summary: string
}

interface AnalysisSidebarProps {
  floorPlanFile: File | null
}

export default function AnalysisSidebar({ floorPlanFile }: AnalysisSidebarProps) {
  const [analysis, setAnalysis] = useState<FloorPlanAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeFloorPlan = useCallback(async () => {
    if (!floorPlanFile) return

    setIsLoading(true)
    setError(null)

    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(floorPlanFile)
      })

      const response = await fetch('/api/analyze-floor-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mediaType: floorPlanFile.type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
  }, [floorPlanFile])

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
        วิเคราะห์แปลน (Claude Vision)
      </h3>

      {!floorPlanFile ? (
        <p className="text-xs text-gray-500 text-center py-4">อัปโหลดแปลนก่อนเพื่อวิเคราะห์</p>
      ) : (
        <button
          onClick={analyzeFloorPlan}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              กำลังวิเคราะห์...
            </>
          ) : (
            <>🔍 วิเคราะห์ด้วย Claude AI</>
          )}
        </button>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      {analysis && (
        <div className="flex flex-col gap-3 text-sm">
          {/* Summary */}
          <div className="p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
            <p className="text-xs text-purple-300 font-medium mb-1">สรุป</p>
            <p className="text-gray-200 text-xs leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Room info */}
          <div className="grid grid-cols-2 gap-2">
            <InfoCard label="ประเภท" value={analysis.roomType} />
            <InfoCard label="ขนาด" value={analysis.estimatedSize} />
            <InfoCard label="รูปทรง" value={analysis.shape} />
          </div>

          {/* Features */}
          {analysis.features?.length > 0 && (
            <Section title="คุณสมบัติ" items={analysis.features} color="blue" />
          )}

          {/* Suggestions */}
          {analysis.suggestions?.length > 0 && (
            <Section title="คำแนะนำการจัด" items={analysis.suggestions} color="green" />
          )}

          {/* Furniture recommendations */}
          {analysis.furnitureRecommendations?.length > 0 && (
            <Section title="เฟอร์นิเจอร์แนะนำ" items={analysis.furnitureRecommendations} color="yellow" />
          )}

          {/* Style advice */}
          {analysis.styleAdvice && (
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-400 font-medium mb-1">คำแนะนำสไตล์</p>
              <p className="text-gray-200 text-xs leading-relaxed">{analysis.styleAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-gray-700/50 rounded-lg">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xs text-white font-medium">{value}</p>
    </div>
  )
}

function Section({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: 'blue' | 'green' | 'yellow'
}) {
  const colorMap = {
    blue: 'text-blue-300 border-blue-700 bg-blue-900/20',
    green: 'text-green-300 border-green-700 bg-green-900/20',
    yellow: 'text-yellow-300 border-yellow-700 bg-yellow-900/20',
  }
  const dotMap = {
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
  }

  return (
    <div className={`p-3 border rounded-lg ${colorMap[color]}`}>
      <p className={`text-xs font-medium mb-2 ${colorMap[color].split(' ')[0]}`}>{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotMap[color]}`} />
            <span className="text-xs text-gray-200 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
