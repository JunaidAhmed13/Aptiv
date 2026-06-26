import { QUALIFIED_THRESHOLD } from "./types";

export type ScoreTone = "success" | "warning" | "danger" | "neutral";

/** Normalize a possibly-missing/string score into a number or null. */
export function normalizeScore(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function scoreTone(score: number | null): ScoreTone {
  if (score === null) return "neutral";
  if (score >= QUALIFIED_THRESHOLD) return "success";
  if (score >= 6) return "warning";
  return "danger";
}

export function isQualified(score: number | null): boolean {
  return score !== null && score >= QUALIFIED_THRESHOLD;
}

/** Split a comma-separated phrase string into trimmed, non-empty items. */
export function splitPhrases(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse the backend's yyyyMMdd-HHmmss date into a JS Date, or null if unparseable. */
export function parseSubmittedDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s)
  );
  return Number.isNaN(date.getTime()) ? null : date;
}
