"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, ListOrdered } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    body: "Add one job description and the CVs you want screened.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Aptiv scores each one",
    body: "Every CV is read and rated against the role.",
  },
  {
    icon: ListOrdered,
    step: "03",
    title: "Review and reach out",
    body: "Open the ranked list, filter to qualified, and contact your shortlist.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-surface-muted/60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">How it works</span>
          <h2 className="mt-5 font-display text-display-md font-bold text-foreground">
            Three steps to a shortlist.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connector line on desktop */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface shadow-soft">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="mt-5">
                <span className="font-display text-sm font-bold tracking-widest text-accent">
                  {s.step}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-foreground">{s.title}</h3>
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
