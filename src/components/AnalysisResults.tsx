import { useState } from "react"
import {
  CheckCircle2,
  AlertCircle,
  Tags,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreGauge } from "@/components/ScoreGauge"
import { cn } from "@/lib/utils"
import type { ResumeAnalysis } from "@/types/analysis"

interface AnalysisResultsProps {
  analysis: ResumeAnalysis
  fileName: string
  onReset: () => void
}

function getTierCopy(score: number) {
  if (score >= 80) {
    return "Solid. Most ATS systems will parse this just fine — you're doing the important things right."
  }
  if (score >= 50) {
    return "Not bad, but there are gaps worth fixing. A few tweaks could land you a lot more callbacks."
  }
  return "This resume is getting filtered out before a human ever sees it. Let's fix that."
}

function getTierNote(score: number) {
  if (score >= 80) return "nice work 👏"
  if (score >= 50) return "room to grow"
  return "needs work"
}

function SectionChip({
  icon: Icon,
  className,
}: {
  icon: React.ElementType
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  )
}

export function AnalysisResults({ analysis, fileName, onReset }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(analysis.professionalSummary)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — fail silently.
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">

      {/* ── Score overview ── */}
      <Card className="animate-fade-up glow-ring paper-card">
        <CardContent className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:p-8">
          <ScoreGauge score={analysis.atsScore} />

          <div className="flex-1 text-center sm:text-left">
            {/* Label */}
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              ATS Score Report
            </p>

            {/* Filename */}
            <h2 className="mt-1 break-all font-display text-2xl font-semibold leading-snug">
              {fileName}
            </h2>

            {/* Verdict copy */}
            <p className="mt-2 text-sm text-muted-foreground sm:max-w-md leading-relaxed">
              {getTierCopy(analysis.atsScore)}
            </p>

            {/* Handwriting note */}
            <span
              className="mt-2 inline-block font-hand text-base text-warm-amber/70"
              style={{ transform: "rotate(-1deg)" }}
            >
              {getTierNote(analysis.atsScore)}
            </span>

            <div className="mt-5">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                className="border border-warm-sand/15 hover:border-warm-amber/30"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try another resume
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Strengths & Weaknesses ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Strengths */}
        <Card className="paper-card paper-card-hover animate-fade-up [animation-delay:80ms]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <SectionChip
                icon={CheckCircle2}
                className="border-signal-good/25 bg-signal-good/10 text-signal-good"
              />
              <div>
                <CardTitle className="text-base">What's working</CardTitle>
                <CardDescription className="text-xs">things this resume does well</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-good" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="paper-card paper-card-hover animate-fade-up [animation-delay:140ms]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <SectionChip
                icon={AlertCircle}
                className="border-signal-risk/25 bg-signal-risk/10 text-signal-risk"
              />
              <div>
                <CardTitle className="text-base">What's holding it back</CardTitle>
                <CardDescription className="text-xs">gaps worth fixing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {analysis.weaknesses.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-risk" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ── Missing keywords ── */}
      <Card className="paper-card paper-card-hover animate-fade-up [animation-delay:200ms]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SectionChip
              icon={Tags}
              className="border-warm-amber/25 bg-warm-amber/10 text-warm-amber"
            />
            <div>
              <CardTitle className="text-base">Missing keywords</CardTitle>
              <CardDescription className="text-xs">
                words ATS systems look for that aren't in here
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-full border border-warm-amber/20 bg-warm-amber/[0.07] px-3 py-1 text-xs font-medium text-warm-sand transition-colors hover:bg-warm-amber/[0.14] hover:border-warm-amber/35"
              >
                {keyword}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Suggestions ── */}
      <Card className="paper-card paper-card-hover animate-fade-up [animation-delay:260ms]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SectionChip
              icon={Lightbulb}
              className="border-signal-warn/25 bg-signal-warn/10 text-signal-warn"
            />
            <div>
              <CardTitle className="text-base">Suggested fixes</CardTitle>
              <CardDescription className="text-xs">specific changes to raise your score</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {analysis.improvements.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-warm-sand/15 bg-warm-amber/[0.05] font-mono text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* ── Rewritten summary — the hero deliverable ── */}
      <div className="doodle-border rounded-xl animate-fade-up [animation-delay:320ms]">
        <Card className="border-transparent shadow-[0_8px_40px_-12px_rgba(196,92,58,0.3)]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <SectionChip
                  icon={Sparkles}
                  className="border-warm-amber/25 bg-warm-amber/10 text-warm-amber"
                />
                <div>
                  <CardTitle className="text-base">Rewritten summary</CardTitle>
                  <CardDescription className="text-xs">
                    drop this at the top of your resume
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 border-warm-sand/20 hover:border-warm-amber/30 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-signal-good" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Handwriting label */}
            <span className="font-hand text-sm text-warm-amber/60 ml-11" style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}>
              ✦ paste this in
            </span>
          </CardHeader>
          <CardContent>
            <hr className="mb-4 border-warm-sand/10" />
            <p className="text-sm leading-relaxed text-foreground/85 font-sans">
              {analysis.professionalSummary}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <div className="text-center pb-4">
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3.5 w-3.5" />
          Scan a different resume
        </Button>
      </div>
    </div>
  )
}
