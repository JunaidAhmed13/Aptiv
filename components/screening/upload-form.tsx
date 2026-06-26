"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { UploadZone } from "./upload-zone";
import { FileList } from "./file-list";
import { ProcessingState } from "./processing-state";
import { useScreening } from "@/lib/use-screening";
import { saveJob } from "@/lib/screening-store";
import { validatePdfs, MAX_CV_COUNT } from "@/lib/file-validation";
import type { ScreeningJob } from "@/lib/types";

export function UploadForm() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const screening = useScreening();

  const [jd, setJd] = useState<File | null>(null);
  const [cvs, setCvs] = useState<File[]>([]);
  const [label, setLabel] = useState("");

  const canSubmit = jd !== null && cvs.length > 0 && !screening.isPending;

  const defaultLabel = useMemo(() => {
    if (!jd) return "";
    return jd.name.replace(/\.pdf$/i, "");
  }, [jd]);

  function handleJd(files: File[]) {
    const { accepted, rejected } = validatePdfs(files);
    rejected.forEach((r) =>
      toast({
        title: `Couldn't add ${r.file.name}`,
        description: `${r.reason}. Job descriptions must be a PDF under 10 MB.`,
        variant: "error",
      })
    );
    if (accepted[0]) setJd(accepted[0]); // only one JD
  }

  function handleCvs(files: File[]) {
    const { accepted, rejected } = validatePdfs(files);
    rejected.forEach((r) =>
      toast({
        title: `Skipped ${r.file.name}`,
        description: `${r.reason}. CVs must be PDFs under 10 MB.`,
        variant: "error",
      })
    );
    setCvs((prev) => {
      // De-dupe by name+size; cap at MAX_CV_COUNT.
      const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
      const merged = [...prev];
      for (const f of accepted) {
        const key = `${f.name}:${f.size}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(f);
        }
      }
      if (merged.length > MAX_CV_COUNT) {
        toast({
          title: "Batch limit reached",
          description: `You can screen up to ${MAX_CV_COUNT} CVs at once. Extra files were not added.`,
          variant: "info",
        });
      }
      return merged.slice(0, MAX_CV_COUNT);
    });
  }

  async function handleSubmit() {
    if (!jd) {
      toast({ title: "Add a job description", description: "Upload one JD PDF to screen against.", variant: "error" });
      return;
    }
    if (cvs.length === 0) {
      toast({ title: "Add at least one CV", description: "Upload candidate CVs to screen.", variant: "error" });
      return;
    }

    try {
      const result = await screening.mutateAsync({ jd, cvs });

      const job: ScreeningJob = {
        id: crypto.randomUUID(),
        label: label.trim() || defaultLabel || "Untitled screening",
        jdFileName: jd.name,
        cvCount: cvs.length,
        createdAt: new Date().toISOString(),
        candidates: result.candidates,
      };

      if (user) saveJob(user.id, job);

      if (result.candidates.length === 0) {
        toast({
          title: "Screening finished — no candidates returned",
          description: "The backend returned an empty result. Open the screening to retry or review.",
          variant: "info",
        });
      } else {
        toast({
          title: "Screening complete",
          description: `${result.candidates.length} candidate${result.candidates.length === 1 ? "" : "s"} evaluated.`,
          variant: "success",
        });
      }

      router.push(`/dashboard/results/${job.id}`);
    } catch (err) {
      // ScreenError carries a user-facing message; surface it (no silent swallow).
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Screening failed", description: message, variant: "error" });
    }
  }

  if (screening.isPending) {
    return (
      <Card className="p-8 sm:p-12">
        <ProcessingState cvCount={cvs.length} />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left: uploads */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral-50 text-coral-600">
              <FileText className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-base font-semibold text-foreground">Job description</h2>
          </div>
          {jd ? (
            <FileList files={[jd]} onRemove={() => setJd(null)} />
          ) : (
            <UploadZone
              label="Drop a JD here, or click to browse"
              hint="One PDF, up to 10 MB"
              onFiles={handleJd}
            />
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-base font-semibold text-foreground">Candidate CVs</h2>
            </div>
            {cvs.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {cvs.length}/{MAX_CV_COUNT}
              </span>
            )}
          </div>
          <UploadZone
            label="Drop CVs here, or click to browse"
            hint={`Multiple PDFs, up to ${MAX_CV_COUNT} files · 10 MB each`}
            multiple
            onFiles={handleCvs}
          />
          <FileList files={cvs} onRemove={(i) => setCvs((prev) => prev.filter((_, idx) => idx !== i))} />
        </Card>
      </div>

      {/* Right: details + submit */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Card className="p-6">
          <h2 className="text-base font-semibold text-foreground">Screening details</h2>

          <label htmlFor="job-label" className="mt-5 block text-sm font-medium text-foreground">
            Label <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="job-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={defaultLabel || "e.g. Senior Backend Engineer — June"}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Helps you find this screening later in your history.
          </p>

          <div className="mt-6 space-y-2 rounded-2xl bg-surface-muted p-4 text-sm">
            <Row label="Job description" value={jd ? jd.name : "Not added"} ok={!!jd} />
            <Row
              label="Candidate CVs"
              value={cvs.length > 0 ? `${cvs.length} file${cvs.length === 1 ? "" : "s"}` : "None added"}
              ok={cvs.length > 0}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-6 w-full"
            size="lg"
          >
            Run screening
            <ArrowRight className="h-4 w-4" />
          </Button>

          {!canSubmit && (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              Add a job description and at least one CV to run a screening.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`max-w-[60%] truncate font-medium ${ok ? "text-foreground" : "text-muted-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
