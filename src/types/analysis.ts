export interface ResumeAnalysis {
  /** Overall ATS compatibility score, 0–100 */
  atsScore: number
  /** What the resume already does well */
  strengths: string[]
  /** Gaps, unclear sections, or weak phrasing */
  weaknesses: string[]
  /** Relevant keywords/skills the resume appears to be missing */
  missingKeywords: string[]
  /** Specific, actionable improvements */
  improvements: string[]
  /** A rewritten, polished professional summary */
  professionalSummary: string
}

export type AppStatus =
  | "idle"
  | "extracting"
  | "analyzing"
  | "success"
  | "error"

export interface UploadedFileInfo {
  name: string
  sizeKB: number
}
