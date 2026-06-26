"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled
              ? "border border-border bg-surface/80 shadow-soft backdrop-blur-xl"
              : "border border-transparent"
          )}
        >
          {/* Left cluster: logo + nav links sit together */}
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Aptiv home">
              <Logo size="md" />
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right cluster: theme toggle + auth */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden items-center gap-2 md:flex">
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Start screening</Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            <button
              className="rounded-lg p-2 text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl border border-border bg-surface p-3 shadow-card md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <SignedOut>
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    Start screening
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    Go to dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
