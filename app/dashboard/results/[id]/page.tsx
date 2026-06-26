"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, FileText, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ScreeningJob } from "@/lib/types";
import { getJob } from "@/lib/screening-store";
import { normalizeScore, isQualified } from "@/lib/score";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/results/results-table";
import { LiveExamplePanel } from "@/components/results/live-example-panel";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoaded } = useUser();
  const [job, setJob] = useState<ScreeningJob | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    if (!isLoaded || !user) return;
    setJob(getJob(user.id, id) ?? null);
  }, [isLoaded, user, id]);

  // Loading
  if (job === undefined) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-6 w-40 rounded-md" />
        <div className="skeleton mt-6 h-28 rounded-3xl" />
        <div className="skeleton mt-6 h-80 rounded-3xl" />
      </div>
    );
  }

  // Not found (e.g. different device/browser — history is local-only)
  if (job === null) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-warning/10">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <h1 className="mt-5 text-lg font-semibold text-foreground">Screening not found</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            This screening isn&apos;t available on this device. Screening history is stored
            locally in your browser, so it won&apos;t appear on a different device or after
            clearing site data.
          </p>
          <Link href="/dashboard" className="mt-6">
            <Button>Back to dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const candidates = job.candidates;
  const qualifiedCount = candidates.filter((c) =>
    isQualified(normalizeScore(c.overall_fit_score))
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Summary header */}
      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold text-foreground">{job.label}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="truncate">{job.jdFileName}</span>
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button variant="outline" size="sm">
              New screening
            </Button>
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Stat icon={Users} label="Candidates" value={candidates.length} />
          <Stat icon={CheckCircle2} label="Qualified (≥ 8.0)" value={qualifiedCount} accent />
        </div>
      </Card>

      {/* Ranked list on the left, sample-output showcase on the right. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <ResultsTable candidates={candidates} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What Aptiv returns
            </h2>
            <LiveExamplePanel />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface-muted px-4 py-2.5">
      <Icon className={`h-5 w-5 ${accent ? "text-success" : "text-muted-foreground"}`} />
      <div>
        <span className="tabular-nums text-lg font-bold text-foreground">{value}</span>
        <span className="ml-1.5 text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
