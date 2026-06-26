"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Users, ChevronRight, Trash2 } from "lucide-react";
import type { ScreeningJob } from "@/lib/types";
import { normalizeScore, isQualified } from "@/lib/score";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ScreeningCard({
  job,
  onDelete,
}: {
  job: ScreeningJob;
  onDelete: (id: string) => void;
}) {
  const qualified = job.candidates.filter((c) =>
    isQualified(normalizeScore(c.overall_fit_score))
  ).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
        <Link
          href={`/dashboard/results/${job.id}`}
          className="absolute inset-0 z-10 cursor-pointer rounded-3xl"
          aria-label={`Open screening: ${job.label}`}
        />
        <div className="pointer-events-none relative z-20 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {job.label}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(job.createdAt)}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(job.id);
            }}
            className="pointer-events-auto relative z-30 cursor-pointer rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
            aria-label="Delete screening"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="pointer-events-none relative z-20 mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            <Users className="h-3 w-3" />
            {job.cvCount} {job.cvCount === 1 ? "candidate" : "candidates"}
          </Badge>
          {qualified > 0 && (
            <Badge variant="success">{qualified} qualified</Badge>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span className="max-w-[12rem] truncate">{job.jdFileName}</span>
          </span>
        </div>

        <div className="pointer-events-none relative z-20 mt-4 flex items-center justify-end text-sm font-medium text-indigo-600 dark:text-foreground/80">
          View results
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Card>
    </motion.div>
  );
}
