"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "./score-badge";

/**
 * LiveExamplePanel — an auto-cycling showcase of a full candidate evaluation,
 * so visitors immediately understand the kind of output Aptiv produces.
 *
 * All content here is FICTIONAL and clearly labelled "Sample output". Names are
 * invented (no real public figures). It is illustrative only — never live data.
 */

type Sample = {
  name: string;
  position: string;
  score: number;
  recommendation: string;
  strengths: string[];
  concerns: string[];
  notes: string;
  email: string;
  phone: string;
};

// Fictional demo candidates. The names are a light hook (recognizable fighters),
// the evaluations are invented but realistic for the role. Illustrative only.
const SAMPLES: Sample[] = [
  {
    name: "Conor McGregor",
    position: "Senior Tester / Quality Control Engineer",
    score: 8.7,
    recommendation: "Strongly recommend for interview. Candidate meets and exceeds core requirements.",
    strengths: [
      "6+ years of end-to-end QA/QC across web, mobile, and API",
      "Cut production bugs by 42% and regression runtime by 90%",
      "Postman, SoapUI, RestAssured, Selenium, Appium, Cypress",
      "Advanced SQL for database integrity and schema checks",
      "ISTQB certified; Scrum Master for Agile teamwork",
    ],
    concerns: [
      "No explicit mention of security testing experience",
      "Address information is missing from the CV",
    ],
    notes:
      "A well-qualified senior QA/QC professional whose experience aligns closely with the role. The minor gaps can be covered during onboarding. A strong fit to progress to interview.",
    email: "conor.mcgregor.qa@email.com",
    phone: "(555) 019-2834",
  },
  {
    name: "Amanda Nunes",
    position: "Senior Backend Engineer",
    score: 9.2,
    recommendation: "Top of the shortlist. Move to a technical interview first.",
    strengths: [
      "8 years building high-throughput Go and Python services",
      "Led a payments rewrite handling 12k requests per second",
      "Deep PostgreSQL and event-driven architecture experience",
      "Mentored four engineers to senior level",
    ],
    concerns: [
      "Most recent role was at a much larger company than ours",
      "Limited frontend exposure if the role needs full-stack",
    ],
    notes:
      "An exceptional backend hire. The scale of her past systems comfortably exceeds the role's needs, so the main question is fit with a smaller team rather than capability.",
    email: "amanda.nunes.dev@email.com",
    phone: "(555) 027-4410",
  },
  {
    name: "Khabib Nurmagomedov",
    position: "Data Analyst",
    score: 6.8,
    recommendation: "Consider for a phone screen. Solid fundamentals, some gaps to probe.",
    strengths: [
      "Strong SQL and dashboarding with Looker and Tableau",
      "Built churn models that improved retention by 9%",
      "Clear communicator with stakeholder-facing experience",
    ],
    concerns: [
      "Python depth looks lighter than the JD asks for",
      "No direct experience with the required cloud warehouse",
    ],
    notes:
      "A capable analyst who could grow into the role. Worth a screen to gauge how quickly the cloud and Python gaps could close.",
    email: "khabib.analyst@email.com",
    phone: "(555) 084-1192",
  },
];

export function LiveExamplePanel() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % SAMPLES.length), 6000);
    return () => clearInterval(id);
  }, [reduce]);

  const s = SAMPLES[i];
  const qualified = s.score >= 8;

  const dots = useMemo(() => SAMPLES.map((_, idx) => idx), []);

  return (
    <Card className="flex h-full max-h-[640px] flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Sample output
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {dots.map((d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              className={`h-1.5 rounded-full transition-all ${
                d === i ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
              }`}
              aria-label={`Show sample ${d + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-5"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <ScoreBadge score={s.score} size="lg" />
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-foreground">{s.name}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="truncate">{s.position}</span>
                </p>
                <div className="mt-2">
                  {qualified ? (
                    <Badge variant="success">Qualified</Badge>
                  ) : (
                    <Badge variant="warning">Below threshold</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <ExampleSection title="Recommendation">
              <p className="text-sm leading-relaxed text-foreground">{s.recommendation}</p>
            </ExampleSection>

            {/* Strengths */}
            <ExampleSection title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-success" />}>
              <ul className="flex flex-wrap gap-2">
                {s.strengths.map((x, idx) => (
                  <li key={idx}>
                    <Badge variant="success">{x}</Badge>
                  </li>
                ))}
              </ul>
            </ExampleSection>

            {/* Concerns */}
            <ExampleSection title="Concerns & gaps" icon={<AlertCircle className="h-4 w-4 text-warning" />}>
              <ul className="flex flex-wrap gap-2">
                {s.concerns.map((x, idx) => (
                  <li key={idx}>
                    <Badge variant="warning">{x}</Badge>
                  </li>
                ))}
              </ul>
            </ExampleSection>

            {/* Final notes */}
            <ExampleSection title="Final notes" icon={<StickyNote className="h-4 w-4 text-muted-foreground" />}>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.notes}</p>
            </ExampleSection>

            {/* Contact */}
            <ExampleSection title="Contact">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <span className="min-w-0 flex-1 truncate text-foreground">{s.email}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm">
                  <Phone className="h-4 w-4 text-indigo-600" />
                  <span className="min-w-0 flex-1 truncate text-foreground">{s.phone}</span>
                </div>
              </div>
            </ExampleSection>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}

function ExampleSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}
