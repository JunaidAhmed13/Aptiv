"use client";

import Link from "next/link";
import { SearchX, Inbox, FilePlus2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** No candidates returned at all (empty webhook result). */
export function NoCandidates() {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-muted">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">No candidates returned</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The screening completed but came back with no candidate evaluations. This can
        happen if the CVs couldn&apos;t be read upstream. Try running the screening again.
      </p>
      <Link href="/dashboard/new" className="mt-6">
        <Button>
          <FilePlus2 className="h-4 w-4" />
          Run a new screening
        </Button>
      </Link>
    </Card>
  );
}

/** Candidates exist but the active filters hide them all. */
export function NoMatches({ onReset }: { onReset: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">No candidates match</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Try clearing your search or turning off the qualified-only filter.
      </p>
      <Button variant="outline" size="sm" className="mt-5" onClick={onReset}>
        Clear filters
      </Button>
    </Card>
  );
}
