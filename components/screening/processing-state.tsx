"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Brain, ListOrdered, Sparkles } from "lucide-react";

/**
 * Reassuring processing UI for the 30s–2min screening wait.
 *
 * NOTE: the n8n webhook is a single blocking request with no progress stream,
 * so true per-candidate progress isn't available. This shows *estimated* stage
 * messaging based on elapsed time and the known CV count — it is clearly framed
 * as an estimate ("Analyzing candidate ~N of M") and never claims a real
 * server-reported count. This is honest UX, not faked progress data.
 */

const STAGES = [
  { icon: FileSearch, label: "Reading the job description" },
  { icon: Brain, label: "Evaluating candidates against the role" },
  { icon: ListOrdered, label: "Scoring and ranking your shortlist" },
];

export function ProcessingState({ cvCount }: { cvCount: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // Rough stage selection by elapsed time.
  const stageIndex = elapsed < 6 ? 0 : elapsed < 18 ? 1 : 2;

  // Estimated candidate position — capped so it never exceeds the batch size and
  // never claims completion. Purely an elapsed-time heuristic.
  const estCandidate = Math.min(
    cvCount,
    Math.max(1, Math.floor((elapsed / Math.max(cvCount * 7, 30)) * cvCount) + 1)
  );

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="relative mx-auto h-24 w-24">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-coral-400 to-indigo-500 opacity-20 blur-xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-coral-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <Sparkles className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      <h2 className="mt-7 font-display text-2xl font-bold text-foreground">
        Screening in progress
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {cvCount > 0 ? (
          <>
            Analyzing candidate ~{estCandidate} of {cvCount}. This can take up to a
            couple of minutes for large batches — you can keep this tab open.
          </>
        ) : (
          "Working through your batch…"
        )}
      </p>

      <div className="mt-8 space-y-3 text-left">
        {STAGES.map((stage, i) => {
          const active = i === stageIndex;
          const done = i < stageIndex;
          return (
            <div
              key={stage.label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                active
                  ? "border-indigo-200 bg-indigo-50"
                  : done
                    ? "border-success/20 bg-success/5"
                    : "border-border bg-surface-muted"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ${
                  active
                    ? "bg-indigo-500 text-white"
                    : done
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <stage.icon className="h-4.5 w-4.5" />
              </span>
              <span
                className={`text-sm font-medium ${
                  active || done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
              {active && (
                <motion.span
                  className="ml-auto h-2 w-2 rounded-full bg-indigo-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 tabular-nums text-xs text-muted-foreground">
        Elapsed: {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
      </p>
    </div>
  );
}
