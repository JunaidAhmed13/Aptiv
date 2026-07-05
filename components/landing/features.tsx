"use client";

import { motion } from "framer-motion";
import {
  LayoutList,
  Target,
  Clock,
  ListChecks,
  Workflow,
  MailCheck,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

// Bento rhythm: spans sum to 3 per row on lg (2+1 / 1+2 / 2+1), so the grid
// never leaves an empty cell. Wide cells get a soft brand tint for variation.
const FEATURES = [
  {
    icon: Target,
    title: "Scored against your role",
    body: "Every candidate gets a 0 to 10 fit score against the exact job description you upload, not a generic résumé grade.",
    span: "lg:col-span-2",
    tinted: true,
  },
  {
    icon: LayoutList,
    title: "Ranked, not just listed",
    body: "Results arrive sorted by fit. The strongest candidates sit at the top, and a qualified-only filter is one click away.",
    span: "",
    tinted: false,
  },
  {
    icon: ListChecks,
    title: "Reasons you can check",
    body: "Concrete strengths and gaps sit behind every score, so you can trust the ranking instead of guessing at it.",
    span: "",
    tinted: false,
  },
  {
    icon: Clock,
    title: "A whole batch at once",
    body: "Drop in a dozen CVs and one JD in a single submission. What used to be an afternoon of reading takes minutes.",
    span: "lg:col-span-2",
    tinted: true,
  },
  {
    icon: MailCheck,
    title: "Reaches out for you",
    body: "Aptiv emails each ranked candidate automatically, so the people who make your shortlist hear from you without extra steps.",
    span: "lg:col-span-2",
    tinted: false,
  },
  {
    icon: Workflow,
    title: "No role setup",
    body: "There is no role library to configure first. Upload the JD with the CVs each time and the model reads both fresh.",
    span: "",
    tinted: false,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-display-md font-bold text-foreground">
            Spend your time on the right candidates.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            High-volume hiring needs more than keyword filters. Aptiv reads like
            a recruiter and reports like an analyst.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn("h-full", f.span)}
            >
              <SpotlightCard
                className={cn(
                  "h-full p-6",
                  f.tinted &&
                    "bg-gradient-to-br from-primary/[0.045] via-surface to-accent/[0.045] dark:from-surface dark:via-surface dark:to-surface"
                )}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <f.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
