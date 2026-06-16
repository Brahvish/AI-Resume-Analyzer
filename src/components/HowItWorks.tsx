import { Upload, BrainCircuit, LayoutDashboard } from "lucide-react"

const STEPS = [
  {
    icon: Upload,
    title: "Drop your PDF",
    detail: "Drag it in or click to browse. Text is pulled out right in your browser — nothing leaves your machine.",
    note: "any PDF works",
  },
  {
    icon: BrainCircuit,
    title: "Your local model reads it",
    detail: "Ollama runs the model on your own hardware and scores ATS compatibility, strengths, and gaps.",
    note: "100% private",
  },
  {
    icon: LayoutDashboard,
    title: "You get the report",
    detail: "Score, strengths, missing keywords, and a rewritten summary you can paste straight in.",
    note: "copy-paste ready",
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16">
      {/* Section label in handwriting style */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="section-rule flex-1" />
        <span className="font-hand text-lg text-muted-foreground">how it works</span>
        <div className="section-rule flex-1" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="paper-card paper-card-hover group relative flex flex-col gap-4 p-6 animate-fade-up"
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              {/* Big hand-written step number — decorative, tilted */}
              <span
                className="step-number absolute right-4 top-2 select-none"
                style={{ transform: `rotate(${index % 2 === 0 ? "-2deg" : "2deg"})` }}
              >
                {index + 1}.
              </span>

              {/* Icon in warm container */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-warm-amber/20 bg-warm-amber/[0.08] text-warm-amber transition-all duration-300 group-hover:scale-105 group-hover:bg-warm-amber/[0.14]">
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>

              {/* Handwriting annotation in corner */}
              <div className="mt-auto pt-2">
                <span
                  className="font-hand text-sm text-warm-amber/60"
                  style={{ transform: `rotate(${index % 2 === 0 ? "-1deg" : "1deg"})`, display: "inline-block" }}
                >
                  ✦ {step.note}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
