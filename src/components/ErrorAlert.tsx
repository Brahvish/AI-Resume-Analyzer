import { AlertTriangle, RotateCcw, Terminal } from "lucide-react"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorAlertProps {
  message: string
  onRetry?: () => void
}

function getOllamaHint(message: string): string | null {
  const msg = message.toLowerCase()
  if (msg.includes("couldn't reach ollama") || msg.includes("ollama")) {
    return "ollama serve"
  }
  if (msg.includes("not found") || msg.includes("model")) {
    return "ollama pull gemma3"
  }
  if (msg.includes("timed out") || msg.includes("timeout")) {
    return "ollama pull llama3.2"
  }
  return null
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  const hint = getOllamaHint(message)

  return (
    <Alert
      variant="destructive"
      className="mx-auto max-w-3xl animate-fade-up shadow-[0_8px_40px_-12px_rgba(244,63,94,0.2)]"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>

        {/* Ollama-specific terminal hint */}
        {hint && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Try running: </span>
            <code className="font-mono text-xs text-foreground">{hint}</code>
          </div>
        )}

        {onRetry && (
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              className="shrink-0 border border-warm-sand/15 hover:border-warm-amber/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
