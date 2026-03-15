'use client'

import { useRef, useState, useCallback } from 'react'

interface FloorPlanUploadProps {
  onUpload: (url: string, file: File) => void
  currentUrl: string | null
}

export default function FloorPlanUpload({ onUpload, currentUrl }: FloorPlanUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      onUpload(url, file)
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">แปลนห้อง</h3>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 hover:border-gray-400'}
        `}
      >
        {currentUrl ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt="floor plan" className="max-h-20 object-contain rounded opacity-80" />
            <p className="text-xs text-gray-400">คลิกหรือลากเพื่อเปลี่ยนแปลน</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-3xl">🏠</span>
            <p className="text-sm text-gray-400">อัปโหลดแปลนห้อง</p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {currentUrl && (
        <p className="text-xs text-green-400 text-center">✓ โหลดแปลนแล้ว (semi-transparent บน canvas)</p>
      )}
    </div>
  )
}
