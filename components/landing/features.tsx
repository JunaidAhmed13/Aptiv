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
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Target,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Scored against your role",
    body: "Every candidate gets a 0 to 10 fit score against the exact job description you upload, not a generic résumé grade.",
  },
  {
    icon: LayoutList,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Ranked, not just listed",
    body: "Results arrive sorted by fit. The strongest candidates sit at the top, and a qualified-only filter is one click away.",
  },
  {
    icon: ListChecks,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Reasons you can check",
    body: "Concrete strengths and gaps sit behind every score, so you can trust the ranking instead of guessing at it.",
  },
  {
    icon: Clock,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "A whole batch at once",
    body: "Drop in a dozen CVs and one JD in a single submission. What used to be an afternoon of reading takes minutes.",
  },
  {
    icon: Workflow,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "No role setup",
    body: "There is no role library to configure first. Upload the JD with the CVs each time and the model reads both fresh.",
  },
  {
    icon: MailCheck,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Reaches out for you",
    body: "Aptiv emails each ranked candidate automatically, so the people who make your shortlist hear from you without extra steps.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">Why Aptiv</span>
          <h2 className="mt-5 font-display text-display-md font-bold text-foreground">
            Spend your time on the right candidates.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            High-volume hiring needs more than keyword filters. Aptiv reads like a
            recruiter and reports like an analyst.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            >
              <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div
                  className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${f.iconBg} ${f.iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
