import { normalizeScore, scoreTone, type ScoreTone } from "@/lib/score";
import { cn } from "@/lib/utils";

const TONE: Record<ScoreTone, string> = {
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/25",
  danger: "bg-danger/10 text-danger ring-danger/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

/** Compact, emphasized fit-score chip. Shows "—" for missing scores. */
export function ScoreBadge({
  score,
  size = "md",
  className,
}: {
  score: unknown;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const n = normalizeScore(score);
  const tone = scoreTone(n);
  const sizeCls =
    size === "lg"
      ? "h-12 w-12 text-lg"
      : size === "sm"
        ? "h-8 min-w-8 px-1.5 text-xs"
        : "h-10 min-w-10 px-2 text-sm";

  return (
    <span
      className={cn(
        "tabular-nums inline-flex items-center justify-center rounded-xl font-bold ring-1",
        TONE[tone],
        sizeCls,
        className
      )}
      aria-label={n === null ? "No score" : `Fit score ${n.toFixed(1)} out of 10`}
    >
      {n === null ? "—" : n.toFixed(1)}
    </span>
  );
}
