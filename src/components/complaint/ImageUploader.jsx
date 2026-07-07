// ─────────────────────────────────────────────────────────────────────────────
// ImageUploader — drag-and-drop image upload with instant preview
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react'
import { Upload, ImageIcon, X, ZoomIn, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

export default function ImageUploader({
  file,
  preview,
  error,
  isDragging,
  onChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onClear,
}) {
  const inputRef = useRef(null)

  return (
    <div className="space-y-3">
      {preview ? (
        // ── Preview mode ──────────────────────────────────────────────────────
        <div className="relative group">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-primary-500/40 bg-surface-800">
            <img
              src={preview}
              alt="Complaint evidence preview"
              className="w-full max-h-64 object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.open(preview, '_blank')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium backdrop-blur-sm transition-all"
                aria-label="View full image"
              >
                <ZoomIn size={14} />
                View Full
              </button>
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-all"
                aria-label="Remove image"
              >
                <X size={14} />
                Remove
              </button>
            </div>
          </div>

          {/* File info bar */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-accent-400" />
              <span className="text-surface-300 text-xs truncate max-w-[200px]">{file?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-surface-500 text-xs">
                {(file?.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={onClear}
                className="w-5 h-5 rounded-full bg-surface-700 hover:bg-red-500/80 flex items-center justify-center text-surface-400 hover:text-white transition-all"
                aria-label="Remove image"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ── Drop zone ─────────────────────────────────────────────────────────
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image — click or drag and drop"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
          className={clsx(
            'relative flex flex-col items-center justify-center gap-3',
            'border-2 border-dashed rounded-2xl p-8 cursor-pointer',
            'transition-all duration-200',
            isDragging
              ? 'border-primary-400 bg-primary-500/10 scale-[1.01]'
              : 'border-surface-600 hover:border-primary-500/60 hover:bg-surface-800/60 bg-surface-800/30'
          )}
        >
          {/* Animated upload icon */}
          <div
            className={clsx(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
              isDragging ? 'bg-primary-500/20 scale-110' : 'bg-surface-700/60'
            )}
          >
            <Upload
              size={24}
              className={clsx(
                'transition-colors',
                isDragging ? 'text-primary-400' : 'text-surface-500'
              )}
            />
          </div>

          <div className="text-center">
            <p className="text-surface-200 font-medium text-sm mb-1">
              {isDragging ? 'Drop your image here' : 'Upload Evidence Photo'}
            </p>
            <p className="text-surface-500 text-xs">
              Drag & drop or click to browse
            </p>
            <p className="text-surface-600 text-[11px] mt-1">
              JPG, PNG, WebP · Max 5 MB
            </p>
          </div>

          {/* Decorative border animation when dragging */}
          {isDragging && (
            <div
              className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-pulse pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={onChange}
        className="hidden"
        aria-label="Select image file"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
