import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
}

const SIZE = 200
const STROKE = 12
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getTier(score: number) {
  if (score >= 80) {
    return {
      label: "Strong match",
      from: "#10B981",
      to: "#34D399",
      text: "text-signal-good",
      glow: "rgba(16,185,129,0.3)",
      handNote: "looking good!",
    }
  }
  if (score >= 50) {
    return {
      label: "Needs improvement",
      from: "#F59E0B",
      to: "#FBBF24",
      text: "text-signal-warn",
      glow: "rgba(245,158,11,0.3)",
      handNote: "fixable!",
    }
  }
  return {
    label: "High risk",
    from: "#F43F5E",
    to: "#FB7185",
    text: "text-signal-risk",
    glow: "rgba(244,63,94,0.3)",
    handNote: "let's fix this",
  }
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const tier = getTier(score)
  const gradientId = "score-gauge-gradient"

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 200)
    return () => clearTimeout(timeout)
  }, [score])

  const offset = CIRCUMFERENCE * (1 - animatedScore / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-6 rounded-full transition-all duration-1000"
          style={{ background: tier.glow, filter: "blur(24px)" }}
          aria-hidden
        />

        <svg width={SIZE} height={SIZE} className="relative rotate-[-90deg]">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tier.from} />
              <stop offset="100%" stopColor={tier.to} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-warm-sand/10"
          />

          {/* Progress arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            stroke={`url(#${gradientId})`}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out-expo"
            style={{ filter: `drop-shadow(0 0 6px ${tier.glow})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-display text-5xl font-semibold tabular-nums leading-none">
            {Math.round(animatedScore)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <p className={cn("text-sm font-medium animate-fade-in", tier.text)}>{tier.label}</p>
        <span
          className="font-hand text-sm text-muted-foreground animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {tier.handNote}
        </span>
      </div>
    </div>
  )
}
