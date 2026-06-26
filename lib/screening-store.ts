"use client";

import type { ScreeningJob } from "./types";

/**
 * Client-side screening-history store.
 *
 * IMPORTANT (flagged in context.md §8): the n8n backend has no read API — it
 * writes results to a single shared Google Sheet but exposes no way to fetch a
 * recruiter's past jobs. So history is persisted in localStorage, namespaced by
 * Clerk user id. This means history is per-browser/per-device and is lost on a
 * storage clear. This is a deliberate v1 limitation, NOT a stub pretending to be
 * a real backend. When a real per-user DB exists, swap this module's internals.
 */

const keyFor = (userId: string) => `aptiv:jobs:${userId}`;

export function loadJobs(userId: string): ScreeningJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScreeningJob[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // Corrupt/incompatible data — surface to console with context, return empty.
    console.error("[aptiv] Failed to parse stored screening jobs:", err);
    return [];
  }
}

export function saveJob(userId: string, job: ScreeningJob): void {
  if (typeof window === "undefined") return;
  const jobs = loadJobs(userId);
  jobs.unshift(job);
  window.localStorage.setItem(keyFor(userId), JSON.stringify(jobs));
}

export function getJob(userId: string, id: string): ScreeningJob | undefined {
  return loadJobs(userId).find((j) => j.id === id);
}

export function deleteJob(userId: string, id: string): void {
  if (typeof window === "undefined") return;
  const jobs = loadJobs(userId).filter((j) => j.id !== id);
  window.localStorage.setItem(keyFor(userId), JSON.stringify(jobs));
}
