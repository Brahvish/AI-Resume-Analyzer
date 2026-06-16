import type { ResumeAnalysis } from "@/types/analysis"

/** Base URL of the locally-running Ollama server */
export const OLLAMA_BASE = "http://localhost:11434"

// ─── Model list ────────────────────────────────────────────────────────────

export interface OllamaModel {
  name: string
  /** Human-readable display label */
  label: string
}

/**
 * Fetches the list of models currently pulled in the local Ollama instance.
 * Returns an empty array (and does NOT throw) if Ollama isn't running — the
 * UI will show a friendly setup prompt instead.
 */
export async function listModels(): Promise<OllamaModel[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return []
    const data = await res.json()
    const models: OllamaModel[] = (data?.models ?? []).map((m: { name: string }) => ({
      name: m.name,
      label: m.name,
    }))
    return models
  } catch {
    return []
  }
}

/**
 * Checks whether Ollama is currently reachable on localhost.
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}

// ─── Prompt ────────────────────────────────────────────────────────────────

function buildPrompt(resumeText: string): string {
  return `You are a three-person resume review panel evaluating a candidate's resume. Each persona contributes a distinct perspective:

PERSONA 1 — ATS PARSING ENGINE
You are a literal Applicant Tracking System (ATS). You only see: keywords, section headers, date formats, and structural parsability. Flag anything that would cause a real ATS (Workday, Greenhouse, Taleo) to misparse or fail to credit content.

PERSONA 2 — TECHNICAL RECRUITER
You screen 100+ resumes a week. You spend ~7 seconds on first pass. Evaluate: is seniority clear, are titles/companies easy to scan, is impact quantified (numbers, %, scale), is there evidence of relevant tools/technologies?

PERSONA 3 — HIRING MANAGER
You evaluate substance over formatting: does experience show real ownership, is there a coherent career narrative, are claims specific and credible vs. generic buzzwords?

SCORING RUBRIC FOR atsScore (0-100, integer):
- Keyword & skills relevance to apparent target role (30%)
- ATS parseability: standard headers, consistent formatting (20%)
- Quantified specific achievements vs. vague task descriptions (25%)
- Completeness: contact info, skills section, work history with dates, education (15%)
- Overall clarity and professional presentation (10%)

Score anchors:
- 90-100: Exceptional — strong keyword match, fully parseable, achievements consistently quantified
- 75-89: Strong — minor gaps only
- 60-74: Average — solid but multiple weaknesses
- 40-59: Below average — significant gaps
- 0-39: Poor — missing core sections or unparseable structure

STRICT RULES:
1. Base every claim ONLY on text actually present in the resume. Never invent metrics or skills the candidate didn't write.
2. Score against the rubric weights — not vibes.
3. Be specific: every bullet must reference something concrete from THIS resume.
4. "missingKeywords" must be relevant to the candidate's apparent target role.

Resume text:
"""
${resumeText}
"""

You MUST respond with ONLY a valid JSON object in this exact format — no markdown, no code blocks, no commentary, just the raw JSON:
{
  "atsScore": <integer 0-100>,
  "strengths": [<3-6 strings>],
  "weaknesses": [<3-6 strings>],
  "missingKeywords": [<5-12 strings>],
  "improvements": [<4-8 strings>],
  "professionalSummary": "<3-4 sentence polished summary>"
}`
}

// ─── Main analysis function ─────────────────────────────────────────────────

/**
 * Sends extracted resume text to the local Ollama instance and returns a
 * structured ResumeAnalysis. Throws a user-friendly Error on any failure.
 */
export async function analyzeResume(
  resumeText: string,
  model: string
): Promise<ResumeAnalysis> {
  if (!model.trim()) {
    throw new Error("No model selected. Pick a model from the dropdown above.")
  }

  const endpoint = `${OLLAMA_BASE}/api/chat`

  const requestBody = {
    model: model.trim(),
    messages: [
      {
        role: "user",
        content: buildPrompt(resumeText),
      },
    ],
    stream: false,
    options: {
      // Low temperature for consistent, structured output on evaluation tasks
      temperature: 0.1,
      top_p: 0.9,
    },
    format: "json",
  }

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      // Resume analysis can take a while on slower hardware — give it 3 minutes
      signal: AbortSignal.timeout(180_000),
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        "The analysis timed out. This can happen with large resumes or slow models — try a smaller model like llama3.2 or phi4-mini."
      )
    }
    throw new Error(
      "Couldn't reach Ollama. Make sure Ollama is running (try: ollama serve) and try again."
    )
  }

  if (!response.ok) {
    let message = `Ollama request failed (HTTP ${response.status}).`
    try {
      const errorBody = await response.json()
      if (errorBody?.error) {
        message = String(errorBody.error)
      }
    } catch {
      // ignore JSON parse failure on error body
    }

    if (response.status === 404 && message.toLowerCase().includes("model")) {
      throw new Error(
        `Model "${model}" not found. Pull it first with: ollama pull ${model}`
      )
    }

    throw new Error(message)
  }

  const data = await response.json()
  const text: string | undefined = data?.message?.content

  if (!text) {
    throw new Error("Ollama returned an empty response. Please try again.")
  }

  // Strip any accidental markdown fences the model might wrap around the JSON
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim()

  let parsed: Partial<ResumeAnalysis>
  try {
    parsed = JSON.parse(cleaned) as Partial<ResumeAnalysis>
  } catch {
    // If JSON parsing fails, try to extract the JSON object from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]) as Partial<ResumeAnalysis>
      } catch {
        throw new Error(
          "The AI response wasn't valid JSON. Try running the analysis again, or switch to a different model."
        )
      }
    } else {
      throw new Error(
        "The AI response wasn't valid JSON. Try running the analysis again, or switch to a different model."
      )
    }
  }

  return normalizeAnalysis(parsed)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeAnalysis(raw: Partial<ResumeAnalysis>): ResumeAnalysis {
  const clampScore = Math.round(Number(raw.atsScore) || 0)

  return {
    atsScore: Math.max(0, Math.min(100, clampScore)),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.filter(Boolean) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.filter(Boolean) : [],
    missingKeywords: Array.isArray(raw.missingKeywords) ? raw.missingKeywords.filter(Boolean) : [],
    improvements: Array.isArray(raw.improvements) ? raw.improvements.filter(Boolean) : [],
    professionalSummary:
      typeof raw.professionalSummary === "string" ? raw.professionalSummary.trim() : "",
  }
}
