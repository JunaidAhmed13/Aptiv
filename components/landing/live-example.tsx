"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { LiveExamplePanel } from "@/components/results/live-example-panel";

/**
 * LiveExample — a landing section that shows the two ends of a screening
 * side by side: the ranked shortlist on the left (the input you skim) and the
 * full per-candidate write-up on the right (what Aptiv returns).
 *
 * All content is fictional and illustrative only.
 */
export function LiveExample() {
  return (
    <section id="example" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">See it end to end</span>
          <h2 className="mt-5 font-display text-display-md font-bold text-foreground">
            From a ranked list to a full write-up.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Aptiv scores the whole batch, then backs every score with the
            strengths, gaps, and contact details behind it.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ranked shortlist
            </p>
            <RankingPreview />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Full candidate write-up
            </p>
            <LiveExamplePanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Static, illustrative preview of the ranked results list. Decorative (no live data). */
function RankingPreview() {
  // Fictional demo rows. Fighter names used as a light hook; illustrative only.
  const rows = [
    { name: "Amanda Nunes", role: "Senior Backend Engineer", score: 9.2, chip: "bg-primary text-primary-foreground" },
    { name: "Conor McGregor", role: "Senior Backend Engineer", score: 8.4, chip: "bg-primary/15 text-primary" },
    { name: "Israel Adesanya", role: "Senior Backend Engineer", score: 6.8, chip: "bg-muted text-foreground" },
    { name: "Jon Jones", role: "Senior Backend Engineer", score: 4.1, chip: "bg-muted text-muted-foreground" },
  ] as const;

  return (
    <div className="glass overflow-hidden rounded-4xl shadow-card">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <Users className="h-4 w-4" />
          </span>
          12 candidates ranked
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          4 qualified
        </span>
      </div>
      <div className="divide-y divide-border/50">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-4 px-5 py-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {r.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
              <p className="truncate text-xs text-muted-foreground">{r.role}</p>
            </div>
            <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:block">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${r.score * 10}%` }}
              />
            </div>
            <span className={`tabular-nums rounded-lg px-2.5 py-1 text-sm font-bold ${r.chip}`}>
              {r.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
