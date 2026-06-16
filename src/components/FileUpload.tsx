import { useCallback, useRef, useState } from "react"
import { FileText, Upload, X, Search, FileCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AppStatus } from "@/types/analysis"

interface FileUploadProps {
  selectedFile: File | null
  status: AppStatus
  onFileSelect: (file: File | null) => void
  onAnalyze: () => void
}

const MAX_SIZE_MB = 10

export function FileUpload({ selectedFile, status, onFileSelect, onAnalyze }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isBusy = status === "extracting" || status === "analyzing"

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setSizeError("Only PDF files are supported.")
        return
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setSizeError(`File too large — max size is ${MAX_SIZE_MB}MB.`)
        return
      }

      setSizeError(null)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (isBusy) return
    handleFiles(e.dataTransfer.files)
  }

  function formatSize(bytes: number) {
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(0)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  return (
    <Card className="mx-auto max-w-3xl animate-fade-up glow-ring paper-card">
      <CardContent className="p-6 sm:p-8">

        {/* Drop zone — warm border style, not cold dashed */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!isBusy) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isBusy && inputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-xl px-6 py-14 text-center transition-all duration-300 ease-out-expo",
            "border-2 border-dashed",
            isBusy
              ? "cursor-not-allowed border-warm-sand/10 bg-warm-amber/[0.01]"
              : "cursor-pointer border-warm-sand/20 hover:border-warm-amber/40 hover:bg-warm-amber/[0.03]",
            isDragging && "scale-[1.01] border-warm-amber/60 bg-warm-amber/[0.05] shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]"
          )}
        >
          {status === "extracting" && <div className="scan-sweep" />}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={isBusy}
          />

          {selectedFile ? (
            <>
              {/* File selected state — warm confirmation */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-signal-good/30 bg-signal-good/10 transition-transform duration-300 group-hover:scale-105">
                <FileCheck className="h-7 w-7 text-signal-good" />
              </div>

              <div>
                <p className="break-all text-sm font-medium">{selectedFile.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatSize(selectedFile.size)} · PDF
                </p>
                <p className="mt-1 font-hand text-sm text-warm-amber/70">ready to scan ✓</p>
              </div>

              {!isBusy && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileSelect(null)
                    setSizeError(null)
                  }}
                  className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-warm-sand/15 bg-warm-amber/[0.04] text-muted-foreground transition-all hover:bg-warm-amber/[0.1] hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          ) : (
            <>
              {/* Empty state — inviting, not sterile */}
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-xl border transition-all duration-300 ease-out-expo animate-float-y",
                  isDragging
                    ? "scale-110 border-warm-amber/50 bg-warm-amber/15"
                    : "border-warm-sand/20 bg-warm-amber/[0.05] group-hover:scale-105 group-hover:border-warm-amber/35"
                )}
              >
                {isDragging ? (
                  <FileText className="h-7 w-7 text-warm-amber" />
                ) : (
                  <Upload className="h-7 w-7 text-warm-sand transition-colors group-hover:text-warm-amber" />
                )}
              </div>

              <div>
                <p className="text-base font-medium">
                  {isDragging ? (
                    <span className="font-hand text-lg text-warm-amber">yes, drop it right here!</span>
                  ) : (
                    <>
                      Drag your resume here, or{" "}
                      <span className="text-warm-amber underline decoration-dotted underline-offset-2">
                        click to browse
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF only · up to {MAX_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </div>

        {sizeError && (
          <p className="mt-3 text-center text-sm text-destructive animate-fade-in">{sizeError}</p>
        )}

        {/* Analyze button — warm, inviting */}
        <Button
          onClick={onAnalyze}
          disabled={!selectedFile || isBusy}
          size="lg"
          className="mt-6 w-full bg-gradient-to-r from-warm-terracotta to-warm-amber text-white hover:opacity-90 transition-opacity font-sans font-semibold tracking-wide"
        >
          <Search className="h-4 w-4" />
          {status === "extracting"
            ? "Reading the PDF…"
            : status === "analyzing"
              ? "Running model…"
              : "Scan my resume"}
        </Button>
      </CardContent>
    </Card>
  )
}
