"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile logo (sidebar hidden) */}
      <div className="lg:hidden">
        <Link href="/dashboard" aria-label="Aptiv dashboard">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Mobile nav shortcut */}
      <div className="flex items-center gap-1 lg:hidden">
        <Link href="/dashboard" aria-label="Overview">
          <Button variant="ghost" size="sm">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="hidden flex-1 lg:block" />

      {/* Theme toggle (so users can switch here too) + account */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: "h-9 w-9" } }}
        />
      </div>
    </header>
  );
}
