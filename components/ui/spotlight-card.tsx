"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a card whose border and interior pick up a soft radial
 * highlight under the cursor. The highlight position is written straight to
 * CSS variables (no React state, no re-renders on mousemove).
 *
 * In dark mode the accent token is a light neutral, so the spotlight reads as
 * a faint white sheen, keeping dark strictly colorless.
 */
export function SpotlightCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-card",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--sx, 50%) var(--sy, 50%), rgb(var(--accent) / 0.08), transparent 65%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
