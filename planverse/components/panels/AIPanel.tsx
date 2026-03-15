"use client";

import type { AIAnalysis } from "@/types";

interface AIPanelProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

export default function AIPanel({ analysis, isLoading, onAnalyze }: AIPanelProps) {
  const priorityColor = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-3">
        <h2 className="text-white font-semibold text-sm">✨ AI Analysis</h2>
        <p className="text-purple-200 text-xs mt-0.5">Claude Vision insights</p>
      </div>

      <div className="p-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              Analyzing...
            </>
          ) : (
            <>
              🔍 Analyze Layout
            </>
          )}
        </button>

        {!analysis && !isLoading && (
          <div className="mt-4 text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-sm">
              Add furniture to your canvas and click{" "}
              <strong>Analyze Layout</strong> for AI feedback
            </p>
          </div>
        )}

        {analysis && (
          <div className="mt-4 space-y-4">
            {/* Summary */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Summary
              </h3>
              <p className="text-sm text-gray-700">{analysis.summary}</p>
            </div>

            {/* Style Match Score */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Style Match
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.styleMatch}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {analysis.styleMatch}%
                </span>
              </div>
            </div>

            {/* Space & Flow */}
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-blue-600 mb-1">
                  Space Utilization
                </h4>
                <p className="text-xs text-blue-700">{analysis.spaceUtilization}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-green-600 mb-1">
                  Flow Assessment
                </h4>
                <p className="text-xs text-green-700">{analysis.flowAssessment}</p>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Suggestions
              </h3>
              <ul className="space-y-1.5">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 font-bold shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Improvements
              </h3>
              <div className="space-y-2">
                {analysis.improvements.map((imp, i) => (
                  <div
                    key={i}
                    className={`text-xs px-3 py-2 rounded-lg border ${priorityColor[imp.priority]}`}
                  >
                    <span className="font-semibold capitalize">
                      [{imp.priority}]
                    </span>{" "}
                    {imp.description}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            {analysis.colorPalette.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Suggested Colors
                </h3>
                <div className="flex gap-2">
                  {analysis.colorPalette.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
