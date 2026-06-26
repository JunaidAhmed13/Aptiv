"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, FileCheck2, Gauge, Users, Layers } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LiquidBlobBackground } from "@/components/liquid-blob";

const PILLS = [
  { icon: Gauge, label: "Fit scored 0 to 10" },
  { icon: Users, label: "Strengths and gaps, spelled out" },
  { icon: FileCheck2, label: "Works with any job description" },
  { icon: Layers, label: "Screens the whole batch at once" },
];

// Fixed first line, then a rotating value line. No buzzwords, no em dashes.
const ROTATING = [
  "Ranked in minutes, not days.",
  "The shortlist, ready to call.",
  "Hours of screening, gone.",
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function RotatingLine() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % ROTATING.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    // Reserve a full line of vertical space (with leading) using an invisible
    // sizer, then absolutely position the animated phrases inside it. This way
    // the rotating line never clips its glyphs and never overlaps the badge or
    // the paragraph below, regardless of which phrase is showing.
    <span className="relative mt-2 block leading-[1.12]">
      {/* Invisible sizer: holds the height of the longest phrase. */}
      <span aria-hidden className="invisible block">
        {ROTATING.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={reduce ? false : { y: "0.5em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-0.5em", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-brand-gradient absolute inset-0 block"
        >
          {ROTATING[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-28">
      <LiquidBlobBackground />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div custom={0} variants={fade} initial="hidden" animate="show">
          <span className="pill">
            <Sparkles className="h-4 w-4 text-primary" />
            Built for high-volume recruiting
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-7 max-w-4xl font-display text-display-xl font-bold text-foreground"
        >
          Every résumé read.
          <RotatingLine />
        </motion.h1>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Aptiv scores a full batch of CVs against your job description and tells
          you who to call first.
        </motion.p>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="group">
                Start screening free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard/new">
              <Button size="lg" className="group">
                New screening
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </SignedIn>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </a>
        </motion.div>

        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
        >
          {PILLS.map((p) => (
            <span key={p.label} className="pill">
              <p.icon className="h-4 w-4 text-primary" />
              {p.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Floating product preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto mt-16 max-w-4xl px-4 sm:px-6"
      >
        <HeroPreview />
      </motion.div>
    </section>
  );
}

/** Static, illustrative preview of the results table. Clearly decorative (no live data). */
function HeroPreview() {
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
          <div key={r.name} className="flex items-center gap-4 px-5 py-3.5">
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
