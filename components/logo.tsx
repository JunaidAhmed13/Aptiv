"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const MARK_PX: Record<LogoSize, number> = { sm: 26, md: 32, lg: 44 };
const TEXT_CLS: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

/**
 * AptivMark — a geometric "A" rendered as an ascending peak inside a rounded
 * violet tile. The upward apex reads both as the letter A and as a rank/ascent
 * cue (the product ranks candidates). Flat and intentional, with one soft
 * depth cue (top sheen + drop shadow) rather than heavy 3D.
 */
export function AptivMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Aptiv"
    >
      <defs>
        <linearGradient id="aptiv-tile" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="aptiv-sheen" x1="24" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="aptiv-shadow" x="-25%" y="-15%" width="150%" height="155%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4C1D95" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Tile */}
      <g filter="url(#aptiv-shadow)">
        <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#aptiv-tile)" />
        <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#aptiv-sheen)" />
        <rect
          x="3.5"
          y="3.5"
          width="41"
          height="41"
          rx="12.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.18"
        />
      </g>

      {/* Ascending "A" peak — clean white strokes */}
      <g
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M15.5 34 L24 14.5 L32.5 34" />
        <path d="M19.5 26.5 L28.5 26.5" strokeOpacity="0.95" />
      </g>
    </svg>
  );
}

/**
 * Full Aptiv lockup (mark + wordmark). Subtle hover float with a slight 3D tilt
 * and violet glow. For favicons / compact spots use <AptivMark /> directly.
 */
export function Logo({
  size = "md",
  className,
  showText = true,
  showMark = true,
}: {
  size?: LogoSize;
  className?: string;
  showText?: boolean;
  /** Set false for a clean text-only wordmark (e.g. the navbar). */
  showMark?: boolean;
}) {
  return (
    <motion.span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      style={{ perspective: 600 }}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {showMark && (
      <motion.span
        variants={{
          rest: {
            y: 0,
            rotateX: 0,
            rotateY: 0,
            filter: "drop-shadow(0 4px 10px rgba(124,58,237,0))",
          },
          hover: {
            y: -3,
            rotateX: 8,
            rotateY: -10,
            filter: "drop-shadow(0 12px 22px rgba(124,58,237,0.35))",
          },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="grid place-items-center [transform-style:preserve-3d]"
      >
        <AptivMark size={MARK_PX[size]} />
      </motion.span>
      )}
      {showText && (
        <span
          className={cn(
            "font-display font-semibold tracking-tight text-foreground",
            TEXT_CLS[size]
          )}
        >
          Aptiv
        </span>
      )}
    </motion.span>
  );
}

export default Logo;
