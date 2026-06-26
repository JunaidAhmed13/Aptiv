"use client";

import { ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDir = "desc" | "asc";

export function FilterBar({
  query,
  onQuery,
  qualifiedOnly,
  onQualifiedOnly,
  sortDir,
  onSortDir,
  total,
  shown,
}: {
  query: string;
  onQuery: (v: string) => void;
  qualifiedOnly: boolean;
  onQualifiedOnly: (v: boolean) => void;
  sortDir: SortDir;
  onSortDir: (v: SortDir) => void;
  total: number;
  shown: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-xs flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search candidates…"
          aria-label="Search candidates by name or position"
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {shown} of {total}
        </span>

        {/* Qualified-only toggle */}
        <button
          onClick={() => onQualifiedOnly(!qualifiedOnly)}
          role="switch"
          aria-checked={qualifiedOnly}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
            qualifiedOnly
              ? "border-success/30 bg-success/10 text-success"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "relative h-4 w-7 rounded-full transition-colors",
              qualifiedOnly ? "bg-success" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                qualifiedOnly ? "left-3.5" : "left-0.5"
              )}
            />
          </span>
          Qualified only
        </button>

        {/* Sort toggle */}
        <button
          onClick={() => onSortDir(sortDir === "desc" ? "asc" : "desc")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Sort by score ${sortDir === "desc" ? "descending" : "ascending"}`}
        >
          <ArrowUpDown className="h-4 w-4" />
          Score {sortDir === "desc" ? "high → low" : "low → high"}
        </button>
      </div>
    </div>
  );
}
