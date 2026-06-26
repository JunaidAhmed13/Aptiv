"use client";

import { useMutation } from "@tanstack/react-query";
import type { Candidate } from "./types";

export interface ScreenInput {
  jd: File;
  cvs: File[];
}

export interface ScreenResult {
  candidates: Partial<Candidate>[];
}

/** Thrown when the /api/screen proxy returns a non-2xx response. */
export class ScreenError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ScreenError";
    this.status = status;
  }
}

async function postScreening({ jd, cvs }: ScreenInput): Promise<ScreenResult> {
  const form = new FormData();
  // JD field — distinct name so the backend feeds it to "Extract Job Description".
  form.append("job_description", jd, jd.name);
  // CV fields — names must start with "CV" per the backend contract.
  cvs.forEach((cv, i) => form.append(`CV_${i + 1}`, cv, cv.name));

  let res: Response;
  try {
    res = await fetch("/api/screen", { method: "POST", body: form });
  } catch (err) {
    // Network-level failure (offline, DNS, etc.) — surface, don't swallow.
    throw new ScreenError(
      "Network error — could not reach Aptiv. Check your connection and try again.",
      0
    );
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON body on error is possible; fall through to status-based message.
  }

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? (body.error as string)
        : null) ?? `Screening failed (${res.status}).`;
    throw new ScreenError(message, res.status);
  }

  const candidates =
    body && typeof body === "object" && "candidates" in body && Array.isArray(body.candidates)
      ? (body.candidates as Partial<Candidate>[])
      : [];

  return { candidates };
}

export function useScreening() {
  return useMutation<ScreenResult, ScreenError, ScreenInput>({
    mutationFn: postScreening,
  });
}
