import { Cpu, Lock, Zap } from "lucide-react"

const FEATURE_PILLS = [
  { icon: Cpu, label: "Runs 100% locally" },
  { icon: Lock, label: "No API key needed" },
  { icon: Zap, label: "Free forever" },
]

export function Header() {
  return (
    <header className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 pb-16 pt-20 text-center sm:pt-28">

      {/* Eyebrow tag */}
      <div className="craft-pill animate-fade-up">
        <span className="h-1.5 w-1.5 rounded-full bg-warm-amber animate-ping-soft" />
        Resume Scanner · Powered by Ollama
      </div>

      {/* Main headline — expressive serif + handwriting accent */}
      <div className="animate-fade-up [animation-delay:80ms]">
        <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-tight sm:text-[4.25rem]">
          Does your resume{" "}
          <br className="hidden sm:block" />
          <span className="italic font-normal text-warm-amber/90">actually</span>{" "}
          make it past{" "}
          <span className="relative inline-block">
            <span className="text-gradient-animated">the bots?</span>
          </span>
        </h1>

        {/* Caveat handwriting annotation */}
        <div className="mt-3 flex justify-center">
          <span className="font-hand text-lg text-warm-sand/70 -rotate-1 inline-block animate-wiggle">
            ← let's find out →
          </span>
        </div>
      </div>

      {/* Subheadline */}
      <p className="max-w-lg animate-fade-up text-base text-muted-foreground [animation-delay:160ms] sm:text-lg leading-relaxed">
        Drop your PDF. The text gets extracted locally, then your own{" "}
        <span className="text-warm-amber font-medium">Ollama</span> instance scores it for ATS
        compatibility — completely free, no cloud, no API key.
        <span className="font-hand text-warm-amber ml-1">Private by default.</span>
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 animate-fade-up [animation-delay:240ms]">
        {FEATURE_PILLS.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-full border border-warm-sand/15 bg-warm-amber/[0.05] px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-warm-amber/30 hover:text-foreground hover:bg-warm-amber/[0.08]"
            style={{ animationDelay: `${i * 60 + 280}ms` }}
          >
            <Icon className="h-3.5 w-3.5 text-warm-amber" />
            {label}
          </div>
        ))}
      </div>

      {/* Decorative circles */}
      <div
        className="circle-deco h-64 w-64 animate-scan-rotate"
        style={{ top: "2rem", right: "-5rem", animationDuration: "30s" }}
        aria-hidden
      />
      <div
        className="circle-deco h-32 w-32"
        style={{ bottom: "3rem", left: "-3rem", borderStyle: "solid", borderColor: "rgba(196,92,58,0.08)" }}
        aria-hidden
      />
    </header>
  )
}
