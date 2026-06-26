/** A single candidate evaluation as returned by the n8n webhook. */
export interface Candidate {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  overall_fit_score: number;
  recommendation: string;
  /** Comma-separated phrases. */
  strengths: string;
  /** Comma-separated phrases. */
  concerns_or_gaps: string;
  final_notes: string;
  /** yyyyMMdd-HHmmss */
  submitted_date: string;
}

/** Raw webhook response shape. Fields may be missing/blank if upstream extraction failed. */
export interface ScreenResponse {
  candidates: Partial<Candidate>[];
}

/** A screening job persisted client-side (no backend read API exists yet — see context.md). */
export interface ScreeningJob {
  id: string;
  label: string;
  jdFileName: string;
  cvCount: number;
  createdAt: string; // ISO
  candidates: Partial<Candidate>[];
}

export const QUALIFIED_THRESHOLD = 8;
