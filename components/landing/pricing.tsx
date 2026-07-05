"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sales contact for the "Talk to us" tiers. Clicking opens the visitor's mail
// client pre-addressed to us, with our automation inbox CC'd. (Billing isn't
// wired up yet, so paid plans are handled over email for now.)
const CONTACT_TO = "vynix.automate@gmail.com";
const CONTACT_CC = "vynix.automate@gmail.com";
const contactMailto = (plan: string) =>
  `mailto:${CONTACT_TO}?cc=${CONTACT_CC}&subject=${encodeURIComponent(
    `Aptiv ${plan} plan enquiry`
  )}&body=${encodeURIComponent(
    `Hi Aptiv team,\n\nWe'd like to get started on the ${plan} plan.\n\nTeam size:\nApprox. candidates / month:\n\nThanks,`
  )}`;

// NOTE (internal, not shown to users): pricing is illustrative for v1. There is
// no billing integration yet; the self-serve CTAs route to sign-up/sign-in and
// the enterprise CTA opens a mailto. Do not surface this build status in
// user-facing copy. See context.md §8.
const TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb: "For trying Aptiv on a live role.",
    cta: "Start screening free",
    action: "auth" as const,
    featured: false,
    features: [
      "Up to 25 candidates / month",
      "JD-matched scoring",
      "Ranked shortlists",
      "Strengths & gaps breakdown",
    ],
  },
  {
    name: "Agency",
    price: "$20",
    cadence: "/mo",
    blurb: "For recruiting teams hiring in volume.",
    cta: "Talk to us",
    action: "contact" as const,
    featured: true,
    features: [
      "Up to 1,500 candidates / month",
      "Everything in Starter",
      "Priority screening queue",
      "Qualified-candidate alerts",
      "Screening history",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    blurb: "For high-throughput TA organizations.",
    cta: "Talk to us",
    action: "contact" as const,
    featured: false,
    features: [
      "Unlimited candidates",
      "Everything in Agency",
      "Dedicated workspace",
      "SSO & data controls",
      "SLA & support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-bold text-foreground">
            Pricing that fits how you hire
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start on the free plan and screen a real role today. Move to a paid
            plan when your volume grows.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn(t.featured && "lg:-mt-4")}
            >
              <Card
                className={cn(
                  "relative flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
                  t.featured &&
                    "edge-hairline border-transparent bg-gradient-to-b from-primary/5 to-surface shadow-card ring-1 ring-primary/25 lg:p-8"
                )}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1 text-xs font-semibold text-white shadow-soft">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {t.price}
                  </span>
                  {t.cadence && (
                    <span className="pb-1 text-sm text-muted-foreground">{t.cadence}</span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {t.features.map((f, fi) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: 0.2 + fi * 0.05, duration: 0.35 }}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {f}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7">
                  {t.action === "contact" ? (
                    <a href={contactMailto(t.name)} className="block">
                      <Button className="w-full" variant={t.featured || t.name === "Scale" ? "primary" : "outline"}>
                        {t.cta}
                      </Button>
                    </a>
                  ) : (
                    <>
                      <SignedOut>
                        <Link href="/sign-up" className="block">
                          <Button className="w-full" variant={t.featured ? "primary" : "outline"}>
                            {t.cta}
                          </Button>
                        </Link>
                      </SignedOut>
                      <SignedIn>
                        <Link href="/dashboard/new" className="block">
                          <Button className="w-full" variant={t.featured ? "primary" : "outline"}>
                            {t.cta}
                          </Button>
                        </Link>
                      </SignedIn>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
