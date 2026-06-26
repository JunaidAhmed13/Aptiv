import Link from "next/link";
import { Quote } from "lucide-react";
import { Logo } from "@/components/logo";
import { LiquidBlobBackground } from "@/components/liquid-blob";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Branded panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-surface-muted p-10 lg:flex">
        <LiquidBlobBackground />
        <div className="relative">
          <Link href="/" aria-label="Aptiv home">
            <Logo size="lg" />
          </Link>
        </div>
        <div className="relative max-w-md">
          <Quote className="h-8 w-8 text-coral-500" />
          <p className="mt-4 font-display text-2xl font-semibold leading-snug text-foreground">
            &ldquo;We used to spend a full day reading résumés for a single role.
            Aptiv hands us a ranked shortlist before the morning standup.&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
              RA
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Rana Ahsan</p>
              <p className="text-xs text-muted-foreground">
                Head of Talent, Northbridge Recruiting
              </p>
            </div>
          </div>
        </div>
        <div className="relative text-sm text-muted-foreground">
          AI résumé screening, built for high-volume recruiting.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="mb-8 lg:hidden">
          <Link href="/" aria-label="Aptiv home">
            <Logo size="md" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
