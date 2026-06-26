"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { FilePlus2, Inbox, Users, CheckCircle2 } from "lucide-react";
import type { ScreeningJob } from "@/lib/types";
import { loadJobs, deleteJob } from "@/lib/screening-store";
import { normalizeScore, isQualified } from "@/lib/score";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreeningCard } from "@/components/dashboard/screening-card";
import { useToast } from "@/components/ui/toast";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<ScreeningJob[] | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setJobs(loadJobs(user.id));
  }, [isLoaded, user]);

  const handleDelete = (id: string) => {
    if (!user) return;
    deleteJob(user.id, id);
    setJobs((prev) => (prev ? prev.filter((j) => j.id !== id) : prev));
    toast({ title: "Screening deleted", variant: "info" });
  };

  const totalCandidates =
    jobs?.reduce((sum, j) => sum + j.candidates.length, 0) ?? 0;
  const totalQualified =
    jobs?.reduce(
      (sum, j) =>
        sum +
        j.candidates.filter((c) => isQualified(normalizeScore(c.overall_fit_score)))
          .length,
      0
    ) ?? 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {isLoaded && user?.firstName
            ? `Welcome back, ${user.firstName}`
            : "Your screenings"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload a job description and your first batch of CVs. Your results show up here.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Inbox}
          label="Screenings"
          value={jobs?.length ?? 0}
          ready={jobs !== null}
        />
        <StatCard
          icon={Users}
          label="Candidates evaluated"
          value={totalCandidates}
          ready={jobs !== null}
        />
        <StatCard
          icon={CheckCircle2}
          label="Qualified (≥ 8.0)"
          value={totalQualified}
          ready={jobs !== null}
          accent
        />
      </div>

      {/* History */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Recent screenings</h2>

        {jobs === null ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40 rounded-3xl" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {jobs.map((job) => (
                <ScreeningCard key={job.id} job={job} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  ready,
  accent,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  ready: boolean;
  accent?: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={`grid h-12 w-12 place-items-center rounded-2xl ${
          accent
            ? "bg-gradient-to-br from-coral-100 to-indigo-100 text-indigo-600"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {ready ? (
          <p className="tabular-nums text-2xl font-bold text-foreground">{value}</p>
        ) : (
          <div className="skeleton mt-1 h-7 w-10 rounded-md" />
        )}
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-coral-100 to-indigo-100">
          <Inbox className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-foreground">
          No screenings yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Start your first screening by uploading a job description and a batch of
          candidate CVs. Results appear here.
        </p>
        <Link href="/dashboard/new" className="mt-6">
          <Button>
            <FilePlus2 className="h-4 w-4" />
            New screening
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
