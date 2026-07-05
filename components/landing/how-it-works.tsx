"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Upload, Cpu, ListOrdered } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    numeral: "1",
    title: "Upload",
    body: "Add one job description and the CVs you want screened.",
  },
  {
    icon: Cpu,
    numeral: "2",
    title: "Aptiv scores each one",
    body: "Every CV is read and rated against the role.",
  },
  {
    icon: ListOrdered,
    numeral: "3",
    title: "Review and reach out",
    body: "Open the ranked list, filter to qualified, and contact your shortlist.",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-surface-muted/60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-bold text-foreground">
            Three steps to a shortlist.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connector line draws itself in as the section enters the viewport. */}
          <motion.div
            aria-hidden
            className="absolute left-[8%] right-[8%] top-8 hidden h-px origin-left bg-gradient-to-r from-transparent via-accent/40 to-transparent dark:via-foreground/25 md:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center"
            >
              {/* Ghosted display numeral behind the card gives each step weight. */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 select-none font-display text-[7rem] font-bold leading-none text-foreground/[0.045]"
              >
                {s.numeral}
              </span>

              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <s.icon className="h-7 w-7 text-primary" aria-hidden />
              </div>
              <div className="relative mt-6">
                <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
