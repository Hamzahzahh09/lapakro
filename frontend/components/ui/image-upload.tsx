"use client"
import { useState, useRef, type ChangeEvent } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxFiles?: number
  maxSizeMB?: number
  disabled?: boolean
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [previews, setPreviews] = useState<string[]>(value)

  const handleFiles = (files: FileList) => {
    const remaining = maxFiles - previews.length
    if (remaining <= 0) return

    const newFiles = Array.from(files).slice(0, remaining)
    const validFiles = newFiles.filter((f) => {
      if (!f.type.startsWith("image/")) return false
      if (f.size > maxSizeMB * 1024 * 1024) return false
      return true
    })

    const newPreviews = validFiles.map((f) => URL.createObjectURL(f))
    const updated = [...previews, ...newPreviews]
    setPreviews(updated)
    onChange?.(updated)
  }

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onChange?.(updated)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all",
          dragOver
            ? "border-[#FFD700] bg-[#FFFBEB]"
            : "border-gray-200 bg-gray-50 hover:border-[#D4A017] hover:bg-[#FFFBEB]/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInput}
          className="hidden"
          disabled={disabled}
        />
        <div className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
          <Upload className="h-5 w-5 text-[#6B7280]" />
        </div>
        <p className="text-sm font-bold text-[#0F172A]">Upload Gambar</p>
        <p className="text-xs text-[#6B7280] mt-1">
          PNG, JPG, WEBP maks {maxSizeMB}MB
        </p>
        <p className="text-xs text-[#6B7280]">
          {previews.length}/{maxFiles} file
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {previews.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {url.startsWith("blob:") || url.startsWith("http") ? (
                <img src={url} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[#6B7280]">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
