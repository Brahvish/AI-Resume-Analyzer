# ResumeScan — Local AI Resume Analyzer

A free, private resume scanner that gives you an honest ATS score and actionable feedback — all running locally on your machine. No API key, no cloud, no cost.

![ResumeScan Screenshot](https://raw.githubusercontent.com/yourusername/resumescan/main/preview.png)

## Features

- **ATS Score (0–100)** — weighted scoring across keyword relevance, parseability, quantified achievements, completeness, and clarity
- **Strengths & Weaknesses** — what's working and what's holding your resume back
- **Missing Keywords** — terms ATS systems look for that aren't in your resume
- **Suggested Fixes** — specific, actionable improvements
- **Rewritten Summary** — a polished professional summary ready to paste in
- **100% Local & Private** — your resume never leaves your machine

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with a warm editorial design (Fraunces + Caveat fonts)
- **AI**: [Ollama](https://ollama.com) — runs open-source models like Gemma 3, Llama 3, Mistral locally
- **PDF Parsing**: pdf.js (runs in-browser, no server needed)

## Getting Started

### 1. Install Ollama

Download and install from **[ollama.com](https://ollama.com)** (free, works on Windows/Mac/Linux).

### 2. Start Ollama and pull a model

```bash
ollama serve

# In another terminal, pull a model (pick one):
ollama pull gemma3      # Google's Gemma 3 — best quality (5.5 GB)
ollama pull llama3.2    # Meta's Llama 3.2 — fast and lightweight (2 GB)
ollama pull mistral     # Mistral 7B — great all-rounder (4 GB)
```

### 3. Clone and run the app

```bash
git clone https://github.com/yourusername/resumescan.git
cd resumescan
npm install
npm run dev
```

Open **http://localhost:5174** in your browser.

The app will auto-detect your pulled models. Select one, drop in a PDF, and click **Scan my resume**.

## No Ollama? No problem

The app runs fine without Ollama — you'll just see a setup guide in the model selector panel. Follow the steps there to get up and running.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          — hero section
│   ├── HowItWorks.tsx      — 3-step explainer
│   ├── OllamaSettings.tsx  — model picker + connection status
│   ├── FileUpload.tsx      — drag & drop PDF upload
│   ├── LoadingState.tsx    — analysis progress
│   ├── AnalysisResults.tsx — full results dashboard
│   ├── ScoreGauge.tsx      — animated score ring
│   └── ErrorAlert.tsx      — error display with Ollama hints
├── lib/
│   ├── ollama.ts           — Ollama API integration
│   └── pdfParser.ts        — client-side PDF text extraction
└── types/
    └── analysis.ts         — TypeScript types
```

## License

MIT
