"use client";

import { useMemo, useState } from "react";
import type { Candidate } from "@/lib/types";
import { normalizeScore, isQualified } from "@/lib/score";
import { Card } from "@/components/ui/card";
import { FilterBar, type SortDir } from "./filter-bar";
import { CandidateRow } from "./candidate-row";
import { CandidateDetail } from "./candidate-detail";
import { NoCandidates, NoMatches } from "./empty-state";

export function ResultsTable({ candidates }: { candidates: Partial<Candidate>[] }) {
  const [query, setQuery] = useState("");
  const [qualifiedOnly, setQualifiedOnly] = useState(false);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Partial<Candidate> | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = candidates.filter((c) => {
      if (qualifiedOnly && !isQualified(normalizeScore(c.overall_fit_score))) return false;
      if (!q) return true;
      const haystack = `${c.full_name ?? ""} ${c.position ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });

    return [...list].sort((a, b) => {
      // Missing scores always sort to the bottom regardless of direction.
      const sa = normalizeScore(a.overall_fit_score);
      const sb = normalizeScore(b.overall_fit_score);
      if (sa === null && sb === null) return 0;
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sortDir === "desc" ? sb - sa : sa - sb;
    });
  }, [candidates, query, qualifiedOnly, sortDir]);

  const resetFilters = () => {
    setQuery("");
    setQualifiedOnly(false);
  };

  if (candidates.length === 0) {
    return <NoCandidates />;
  }

  return (
    <div className="space-y-4">
      <FilterBar
        query={query}
        onQuery={setQuery}
        qualifiedOnly={qualifiedOnly}
        onQualifiedOnly={setQualifiedOnly}
        sortDir={sortDir}
        onSortDir={setSortDir}
        total={candidates.length}
        shown={filtered.length}
      />

      {filtered.length === 0 ? (
        <NoMatches onReset={resetFilters} />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="hidden items-center gap-4 border-b border-border bg-surface-muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:flex">
            <span className="w-6 text-center">#</span>
            <span className="w-10" />
            <span className="flex-1">Candidate</span>
            <span className="hidden w-32 md:block">Fit</span>
            <span className="w-10 text-center">Score</span>
            <span className="w-4" />
          </div>
          <div className="divide-y divide-border">
            {filtered.map((c, i) => (
              <CandidateRow
                key={`${c.full_name ?? "x"}-${c.email ?? i}-${i}`}
                candidate={c}
                rank={i + 1}
                index={i}
                onClick={() => setSelected(c)}
              />
            ))}
          </div>
        </Card>
      )}

      <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
