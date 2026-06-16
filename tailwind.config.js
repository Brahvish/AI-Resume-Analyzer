/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "ui-serif", "serif"],
        hand: ["Caveat", "cursive"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Human palette — warm, editorial, curated by hand
        warm: {
          amber: "#F59E0B",
          orange: "#EA580C",
          rose: "#E11D48",
          cream: "#FEF3C7",
          sand: "#D6B87A",
          terracotta: "#C45C3A",
          sage: "#4D7C60",
          sky: "#0EA5E9",
        },
        signal: {
          violet: "#A855F7",
          cyan: "#06B6D4",
          good: "#10B981",
          warn: "#F59E0B",
          risk: "#F43F5E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        "warm-glow":
          "radial-gradient(ellipse 70% 50% at 30% 0%, rgba(245,158,11,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(196,92,58,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 50% 100%, rgba(168,85,247,0.08) 0%, transparent 60%)",
        "shimmer-gradient":
          "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)",
        "cta-gradient": "linear-gradient(135deg, #C45C3A 0%, #F59E0B 50%, #A855F7 100%)",
        "hero-underline": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 8'%3E%3Cpath d='M2 6 Q50 2 100 5 Q150 8 198 3' stroke='%23F59E0B' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "scan-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "33%": { transform: "translate(3%, -5%) scale(1.06) rotate(3deg)" },
          "66%": { transform: "translate(-2%, 3%) scale(0.97) rotate(-2deg)" },
        },
        "blob-drift-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-4%, 4%) scale(1.05)" },
        },
        "glow-breathe": {
          "0%, 100%": { opacity: "0.4", filter: "blur(48px)" },
          "50%": { opacity: "0.75", filter: "blur(60px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.65s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scan-line": "scan-line 2.4s ease-in-out infinite",
        "scan-rotate": "scan-rotate 8s linear infinite",
        "blob-drift": "blob-drift 16s ease-in-out infinite",
        "blob-drift-slow": "blob-drift-slow 22s ease-in-out infinite",
        "glow-breathe": "glow-breathe 5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "float-y": "float-y 5s ease-in-out infinite",
        "ping-soft": "ping-soft 2s cubic-bezier(0,0,0.2,1) infinite",
        "wiggle": "wiggle 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
