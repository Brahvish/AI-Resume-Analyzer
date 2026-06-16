import { useEffect, useState, useCallback } from "react"
import { Bot, RefreshCw, ExternalLink, ChevronDown, Wifi, WifiOff, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { listModels, checkOllamaHealth, OLLAMA_BASE, type OllamaModel } from "@/lib/ollama"

interface OllamaSettingsProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const SUGGESTED_MODELS = [
  { name: "gemma3", description: "Google's Gemma 3 — best quality for structured analysis" },
  { name: "llama3.2", description: "Meta's Llama 3.2 — fast and capable" },
  { name: "mistral", description: "Mistral 7B — great all-rounder" },
  { name: "phi4-mini", description: "Microsoft's Phi-4 Mini — tiny but smart" },
]

export function OllamaSettings({ selectedModel, onModelChange }: OllamaSettingsProps) {
  const [models, setModels] = useState<OllamaModel[]>([])
  const [isConnected, setIsConnected] = useState<boolean | null>(null) // null = checking
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const loadModels = useCallback(async () => {
    setIsLoading(true)
    const [healthy, available] = await Promise.all([checkOllamaHealth(), listModels()])
    setIsConnected(healthy)
    setModels(available)

    // Auto-select first available model if none selected
    if (!selectedModel && available.length > 0) {
      onModelChange(available[0].name)
    }
    setIsLoading(false)
  }, [selectedModel, onModelChange])

  useEffect(() => {
    loadModels()
  }, [loadModels])

  const currentModel = models.find((m) => m.name === selectedModel)
  const notConnected = isConnected === false
  const checking = isConnected === null

  return (
    <Card className="mx-auto max-w-3xl animate-fade-up paper-card paper-card-hover">
      <CardContent className="p-4 sm:p-5">

        {/* ── Header row ── */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-warm-amber/20 bg-warm-amber/[0.06]">
            <Bot className="h-4 w-4 text-warm-amber" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium">Local AI Model</p>

              {/* Connection status badge */}
              {checking ? (
                <span className="flex items-center gap-1 rounded-full bg-muted/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                  <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                  Checking…
                </span>
              ) : isConnected ? (
                <span className="flex items-center gap-1 rounded-full bg-signal-good/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-signal-good">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-signal-good" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-good" />
                  </span>
                  <Wifi className="h-2.5 w-2.5" />
                  Ollama running
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-destructive">
                  <WifiOff className="h-2.5 w-2.5" />
                  Ollama not found
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Runs 100% locally on your machine.{" "}
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-warm-amber hover:underline underline-offset-2"
              >
                Get Ollama free <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={loadModels}
            disabled={isLoading}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-warm-sand/15 text-muted-foreground transition-all hover:border-warm-amber/30 hover:text-foreground disabled:opacity-50"
            aria-label="Refresh model list"
            title="Refresh model list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* ── Ollama not running — setup instructions ── */}
        {notConnected && (
          <div className="mt-4 rounded-lg border border-warm-amber/20 bg-warm-amber/[0.04] p-4">
            <p className="text-sm font-medium text-warm-amber mb-2">Ollama isn't running yet</p>
            <p className="text-xs text-muted-foreground mb-3">
              Ollama is a free, open-source tool that runs AI models locally. Here's how to get started:
            </p>
            <ol className="flex flex-col gap-2">
              <li className="flex gap-2.5 text-xs text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-warm-amber/25 bg-warm-amber/[0.07] font-mono text-[10px] text-warm-amber">1</span>
                <span>
                  Download and install from{" "}
                  <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-warm-amber hover:underline">
                    ollama.com
                  </a>
                </span>
              </li>
              <li className="flex gap-2.5 text-xs text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-warm-amber/25 bg-warm-amber/[0.07] font-mono text-[10px] text-warm-amber">2</span>
                <span>Open a terminal and run: <code className="font-mono bg-warm-amber/[0.08] text-warm-sand px-1.5 py-0.5 rounded">ollama serve</code></span>
              </li>
              <li className="flex gap-2.5 text-xs text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-warm-amber/25 bg-warm-amber/[0.07] font-mono text-[10px] text-warm-amber">3</span>
                <span>Pull a model: <code className="font-mono bg-warm-amber/[0.08] text-warm-sand px-1.5 py-0.5 rounded">ollama pull gemma3</code></span>
              </li>
              <li className="flex gap-2.5 text-xs text-muted-foreground">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-warm-amber/25 bg-warm-amber/[0.07] font-mono text-[10px] text-warm-amber">4</span>
                <span>Click the refresh button above ↑</span>
              </li>
            </ol>
          </div>
        )}

        {/* ── Connected — model selector ── */}
        {isConnected && (
          <div className="mt-3">
            {models.length === 0 ? (
              /* No models pulled yet */
              <div className="rounded-lg border border-warm-amber/20 bg-warm-amber/[0.04] p-3">
                <p className="text-xs font-medium text-warm-amber flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" />
                  No models found — pull one first
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Ollama is running but you haven't downloaded any models yet. Recommended:
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  {SUGGESTED_MODELS.map((m) => (
                    <code key={m.name} className="text-xs font-mono text-warm-sand">
                      ollama pull {m.name}
                      <span className="ml-2 font-sans text-muted-foreground not-italic">— {m.description}</span>
                    </code>
                  ))}
                </div>
              </div>
            ) : (
              /* Model dropdown */
              <div className="relative">
                <button
                  type="button"
                  id="model-selector"
                  onClick={() => setIsOpen((o) => !o)}
                  className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-warm-sand/15 bg-warm-amber/[0.03] px-3 text-sm transition-colors hover:border-warm-amber/30 hover:bg-warm-amber/[0.06] focus:outline-none focus:ring-2 focus:ring-warm-amber/20"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className="h-3.5 w-3.5 shrink-0 text-warm-amber" />
                    <span className="truncate font-mono text-xs">
                      {currentModel?.name ?? selectedModel ?? "Select a model…"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-warm-sand/20 bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    <div className="max-h-48 overflow-y-auto p-1">
                      {models.map((model) => (
                        <button
                          key={model.name}
                          type="button"
                          role="option"
                          aria-selected={model.name === selectedModel}
                          onClick={() => {
                            onModelChange(model.name)
                            setIsOpen(false)
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-warm-amber/[0.08] ${
                            model.name === selectedModel
                              ? "bg-warm-amber/[0.1] text-warm-amber"
                              : "text-foreground"
                          }`}
                        >
                          <Bot className="h-3 w-3 shrink-0" />
                          <span className="font-mono">{model.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
