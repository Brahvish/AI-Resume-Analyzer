import { Loader2, FileSearch, BrainCircuit, CheckCircle2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { AppStatus } from "@/types/analysis"

interface LoadingStateProps {
  status: AppStatus
  model?: string
}

const STAGES = [
  {
    key: "extracting",
    label: "Reading your PDF",
    detail: "Pulling out all the text content locally in your browser…",
    icon: FileSearch,
    note: "all local, nothing sent yet",
  },
  {
    key: "analyzing",
    label: "Asking the model",
    detail: "Sending resume text to your local Ollama instance…",
    icon: BrainCircuit,
    note: "this may take a moment",
  },
] as const

export function LoadingState({ status, model }: LoadingStateProps) {
  const activeIndex = STAGES.findIndex((stage) => stage.key === status)

  return (
    <Card className="mx-auto max-w-3xl animate-fade-up glow-ring paper-card">
      <CardContent className="p-6 sm:p-8">

        <div className="mb-6">
          <h3 className="font-display text-lg font-semibold">Working on it…</h3>
          <p className="font-hand text-sm text-muted-foreground mt-0.5">
            {model ? (
              <>running <span className="text-warm-amber font-mono">{model}</span> locally — hang tight</>
            ) : (
              "hang tight, this only takes a moment"
            )}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon
            const isActive = index === activeIndex
            const isDone = activeIndex > index

            return (
              <div
                key={stage.key}
                className="flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "scale-105 border-warm-amber/40 bg-warm-amber/10 text-warm-amber shadow-[0_0_20px_-4px_rgba(245,158,11,0.4)]"
                      : isDone
                        ? "border-signal-good/30 bg-signal-good/10 text-signal-good"
                        : "border-warm-sand/10 bg-warm-amber/[0.02] text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isActive || isDone ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                    {isActive && (
                      <span className="ml-2 font-hand text-xs text-warm-amber/70">{stage.note}</span>
                    )}
                  </p>
                  {isActive && (
                    <p className="mt-0.5 text-xs text-muted-foreground animate-fade-in">
                      {stage.detail}
                    </p>
                  )}
                </div>

                {isDone && (
                  <span className="font-hand text-sm text-signal-good animate-fade-in">done ✓</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Skeleton preview */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative h-20 overflow-hidden rounded-lg border border-warm-sand/5 bg-warm-amber/[0.02]"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-shimmer-gradient bg-[length:200%_100%]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
