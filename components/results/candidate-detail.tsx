"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  StickyNote,
  Copy,
} from "lucide-react";
import type { Candidate } from "@/lib/types";
import { normalizeScore, isQualified, splitPhrases } from "@/lib/score";
import { ScoreBadge } from "./score-badge";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

/** Slide-over detail panel for a single candidate. */
export function CandidateDetail({
  candidate,
  onClose,
}: {
  candidate: Partial<Candidate> | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const open = candidate !== null;

  const score = normalizeScore(candidate?.overall_fit_score);
  const qualified = isQualified(score);
  const strengths = splitPhrases(candidate?.strengths);
  const concerns = splitPhrases(candidate?.concerns_or_gaps);
  const name = candidate?.full_name?.trim() || "Unnamed candidate";

  const copy = async (value: string | undefined, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, variant: "success" });
    } catch (err) {
      console.error("[aptiv] clipboard write failed:", err);
      toast({ title: "Couldn't copy", description: "Your browser blocked clipboard access.", variant: "error" });
    }
  };

  return (
    <AnimatePresence>
      {open && candidate && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-card"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Candidate detail: ${name}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div className="flex items-start gap-3">
                <ScoreBadge score={candidate.overall_fit_score} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-foreground">{name}</h2>
                  {candidate.position && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span className="truncate">{candidate.position}</span>
                    </p>
                  )}
                  <div className="mt-2">
                    {score === null ? (
                      <Badge variant="neutral">No score</Badge>
                    ) : qualified ? (
                      <Badge variant="success">Qualified</Badge>
                    ) : (
                      <Badge variant="warning">Below threshold</Badge>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close detail"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Recommendation */}
              {candidate.recommendation && (
                <Section title="Recommendation">
                  <p className="text-sm leading-relaxed text-foreground">
                    {candidate.recommendation}
                  </p>
                </Section>
              )}

              {/* Strengths */}
              <Section title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-success" />}>
                {strengths.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {strengths.map((s, i) => (
                      <li key={i}>
                        <Badge variant="success">{s}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty />
                )}
              </Section>

              {/* Concerns */}
              <Section title="Concerns & gaps" icon={<AlertCircle className="h-4 w-4 text-warning" />}>
                {concerns.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {concerns.map((c, i) => (
                      <li key={i}>
                        <Badge variant="warning">{c}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty />
                )}
              </Section>

              {/* Final notes */}
              {candidate.final_notes && (
                <Section title="Final notes" icon={<StickyNote className="h-4 w-4 text-muted-foreground" />}>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {candidate.final_notes}
                  </p>
                </Section>
              )}

              {/* Contact */}
              <Section title="Contact">
                <div className="space-y-2">
                  <ContactRow
                    icon={<Mail className="h-4 w-4" />}
                    value={candidate.email}
                    href={candidate.email ? `mailto:${candidate.email}` : undefined}
                    onCopy={() => copy(candidate.email, "Email")}
                  />
                  <ContactRow
                    icon={<Phone className="h-4 w-4" />}
                    value={candidate.phone}
                    href={candidate.phone ? `tel:${candidate.phone}` : undefined}
                    onCopy={() => copy(candidate.phone, "Phone")}
                  />
                </div>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function ContactRow({
  icon,
  value,
  href,
  onCopy,
}: {
  icon: React.ReactNode;
  value: string | undefined;
  href?: string;
  onCopy: () => void;
}) {
  if (!value) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-muted px-3.5 py-2.5 text-sm text-muted-foreground">
        <span className="text-muted-foreground">{icon}</span>
        Not provided
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm">
      <span className="text-indigo-600">{icon}</span>
      {href ? (
        <a href={href} className="min-w-0 flex-1 truncate text-foreground hover:text-indigo-600">
          {value}
        </a>
      ) : (
        <span className="min-w-0 flex-1 truncate text-foreground">{value}</span>
      )}
      <button
        onClick={onCopy}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Copy"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground">Not available for this candidate.</p>;
}
