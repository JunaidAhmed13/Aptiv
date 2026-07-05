"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * CursorGlow — a large radial glow that eases toward the pointer with spring
 * lag, layered above the fluid sim so the hero stays alive even when the
 * cursor is still or the WebGL sim has fallen back.
 *
 * Light mode: soft violet-core / lavender-falloff orb (brand palette only).
 * Dark mode: a faint neutral white spotlight (~4%) so dark stays colorless
 * but still feels responsive.
 *
 * Touch devices (no hover) get a slow ambient drift instead of pointer
 * tracking. Reduced motion renders a static centered glow.
 */
export function CursorGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [canHover, setCanHover] = useState(true);

  // Motion values keep pointer tracking out of the React render cycle.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 55, damping: 18, mass: 0.6 });

  useEffect(() => {
    const hoverable = window.matchMedia("(hover: hover)").matches;
    setCanHover(hoverable);
    if (!hoverable || reduce) return;

    const el = ref.current;
    if (!el) return;

    // Start centered in the section rather than at 0,0.
    const rect = el.getBoundingClientRect();
    x.set(rect.width / 2);
    y.set(rect.height / 2.4);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  const glowBackground = isDark
    ? "radial-gradient(closest-side, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 45%, transparent 70%)"
    : "radial-gradient(closest-side, rgba(139,92,246,0.22), rgba(167,139,250,0.12) 42%, rgba(99,102,241,0.05) 65%, transparent 75%)";

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {reduce || !canHover ? (
        // Ambient fallback: centered orb, slow float when motion is allowed.
        <div
          className={cn(
            "absolute left-1/2 top-[38%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full",
            !reduce && "animate-float"
          )}
          style={{ background: glowBackground }}
        />
      ) : (
        <motion.div
          // Negative margins center the orb on the pointer (x/y are the
          // pointer coordinates; mixing x with translateX would conflict).
          className="absolute left-0 top-0 -ml-[22rem] -mt-[22rem] h-[44rem] w-[44rem] rounded-full will-change-transform"
          style={{ x: sx, y: sy, background: glowBackground }}
        />
      )}
    </div>
  );
}
