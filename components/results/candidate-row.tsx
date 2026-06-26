"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Candidate } from "@/lib/types";
import { normalizeScore, isQualified } from "@/lib/score";
import { ScoreBadge } from "./score-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CandidateRow({
  candidate,
  rank,
  onClick,
  index,
}: {
  candidate: Partial<Candidate>;
  rank: number;
  onClick: () => void;
  index: number;
}) {
  const score = normalizeScore(candidate.overall_fit_score);
  const qualified = isQualified(score);
  const name = candidate.full_name?.trim() || "Unnamed candidate";
  const initials =
    name === "Unnamed candidate"
      ? "?"
      : name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase())
          .join("");

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.3 }}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        qualified && "bg-success/[0.035]"
      )}
    >
      <span className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums text-muted-foreground">
        {rank}
      </span>

      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold",
          qualified ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
        )}
      >
        {initials}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">{name}</span>
          {qualified && <Badge variant="success">Qualified</Badge>}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
          {candidate.position?.trim() || "Position not specified"}
        </span>
      </span>

      {/* Score bar (desktop) */}
      <span className="hidden h-1.5 w-32 shrink-0 overflow-hidden rounded-full bg-muted md:block">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-coral-500 to-indigo-500"
          style={{ width: `${score === null ? 0 : Math.max(4, score * 10)}%` }}
        />
      </span>

      <ScoreBadge score={candidate.overall_fit_score} />

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </motion.button>
  );
}
