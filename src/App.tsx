import { useCallback, useState } from "react"

import { BlobBackground } from "@/components/BlobBackground"
import { Header } from "@/components/Header"
import { HowItWorks } from "@/components/HowItWorks"
import { OllamaSettings } from "@/components/OllamaSettings"
import { FileUpload } from "@/components/FileUpload"
import { LoadingState } from "@/components/LoadingState"
import { ErrorAlert } from "@/components/ErrorAlert"
import { AnalysisResults } from "@/components/AnalysisResults"
import { extractTextFromPDF } from "@/lib/pdfParser"
import { analyzeResume } from "@/lib/ollama"
import type { AppStatus, ResumeAnalysis } from "@/types/analysis"

const DEFAULT_MODEL = "gemma3"

function App() {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<AppStatus>("idle")
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFileSelect(selected: File | null) {
    setFile(selected)
    setError(null)
    if (status !== "idle") {
      setStatus("idle")
      setAnalysis(null)
    }
  }

  const runAnalysis = useCallback(async () => {
    if (!file) return

    setError(null)
    setAnalysis(null)

    try {
      setStatus("extracting")
      const resumeText = await extractTextFromPDF(file)

      setStatus("analyzing")
      const result = await analyzeResume(resumeText, selectedModel)

      setAnalysis(result)
      setStatus("success")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(message)
      setStatus("error")
    }
  }, [file, selectedModel])

  function handleReset() {
    setFile(null)
    setAnalysis(null)
    setError(null)
    setStatus("idle")
  }

  const showUpload = status !== "success"
  const isBusy = status === "extracting" || status === "analyzing"
  const showHowItWorks = status === "idle"

  return (
    <div className="relative min-h-screen">
      <BlobBackground />

      <main className="container">
        <Header />

        {showHowItWorks && <HowItWorks />}

        <div className="flex flex-col gap-6 pb-24">
          <OllamaSettings
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />

          {showUpload && (
            <FileUpload
              selectedFile={file}
              status={status}
              onFileSelect={handleFileSelect}
              onAnalyze={runAnalysis}
            />
          )}

          {isBusy && <LoadingState status={status} model={selectedModel} />}

          {status === "error" && error && (
            <ErrorAlert message={error} onRetry={runAnalysis} />
          )}

          {status === "success" && analysis && file && (
            <AnalysisResults
              analysis={analysis}
              fileName={file.name}
              onReset={handleReset}
            />
          )}
        </div>

        <footer className="mx-auto max-w-3xl pb-12 text-center">
          <p className="text-xs text-muted-foreground">
            Your PDF is parsed locally in the browser. Resume text is sent only to your
            local Ollama instance — nothing leaves your machine.
          </p>
          <p className="font-hand text-sm text-warm-amber/40 mt-1">made with curiosity ✦</p>
        </footer>
      </main>
    </div>
  )
}

export default App
