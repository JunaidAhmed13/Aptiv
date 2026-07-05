"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LiquidBlobBackground } from "@/components/liquid-blob";
import { CursorGlow } from "@/components/effects/cursor-glow";

// Fixed first line, then a rotating value line. No buzzwords, no em dashes.
const ROTATING = [
  "Ranked in minutes, not days.",
  "The shortlist, ready to call.",
  "Hours of screening, gone.",
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

function RotatingLine() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % ROTATING.length), 2600);
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
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Layered background: fluid sim (base) + spring cursor glow + grain. */}
      <LiquidBlobBackground />
      <CursorGlow />
      <div
        aria-hidden
        className="noise pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div custom={0} variants={fade} initial="hidden" animate="show">
          <span className="pill">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            Built for high-volume recruiting
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-8 max-w-4xl font-display text-display-xl font-bold text-foreground"
        >
          Every résumé read.
          <RotatingLine />
        </motion.h1>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          Aptiv scores a full batch of CVs against your job description and
          tells you who to call first.
        </motion.p>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="group">
                Start screening free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard/new">
              <Button size="lg" className="group">
                New screening
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Button>
            </Link>
          </SignedIn>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
