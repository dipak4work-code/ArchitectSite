'use client'

import { useState, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2, GripVertical, Star } from 'lucide-react'

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  folder?: string
  label?: string
  maxImages?: number
}

export function MultiImageUpload({
  values,
  onChange,
  folder = 'architect-site/portfolio',
  label = 'Images',
  maxImages = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dragIndex = useRef<number | null>(null)

  async function uploadFile(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) return null
    if (file.size > 10 * 1024 * 1024) {
      setError('Each file must be under 10 MB.')
      return null
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = maxImages - values.length
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      const toUpload = Array.from(files).slice(0, remaining)
      const urls = await Promise.all(toUpload.map(uploadFile))
      const valid = urls.filter(Boolean) as string[]
      onChange([...values, ...valid])
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removeImage(idx: number) {
    onChange(values.filter((_, i) => i !== idx))
  }

  function setAsCover(idx: number) {
    if (idx === 0) return
    const reordered = [...values]
    const [item] = reordered.splice(idx, 1)
    reordered.unshift(item)
    onChange(reordered)
  }

  function handleDragStart(idx: number) {
    dragIndex.current = idx
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === idx) return
    const reordered = [...values]
    const [item] = reordered.splice(dragIndex.current, 1)
    reordered.splice(idx, 0, item)
    dragIndex.current = idx
    onChange(reordered)
  }

  function handleDropZone(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const canAddMore = values.length < maxImages

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{values.length}/{maxImages} images</span>
      </div>

      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {values.map((url, idx) => (
            <div
              key={url + idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => handleDragOver(e, idx)}
              className="relative group rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-400 transition-all cursor-grab active:cursor-grabbing"
              style={{ aspectRatio: '4/3' }}
            >
              <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />

              {/* Cover badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Star className="h-2.5 w-2.5 fill-yellow-900" /> Cover
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded p-1">
                  <GripVertical className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsCover(idx)}
                    className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-300 transition-colors"
                  >
                    <Star className="h-3 w-3 fill-yellow-900" /> Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {canAddMore && (
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDropZone}
              onDragOver={e => e.preventDefault()}
              className="rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors"
              style={{ aspectRatio: '4/3' }}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-gray-400 text-center px-2">Add more</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty drop zone */}
      {values.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDropZone}
          onDragOver={e => e.preventDefault()}
          className={`w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${
            uploading ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-indigo-600 font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop images here or <span className="text-indigo-600">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — up to {maxImages} images, 10MB each</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="h-3 w-3" /> {error}
        </p>
      )}

      {values.length > 1 && (
        <p className="text-xs text-gray-400">Drag images to reorder. First image is used as the cover.</p>
      )}
    </div>
  )
}
