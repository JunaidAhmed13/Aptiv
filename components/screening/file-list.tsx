"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { formatBytes } from "@/lib/file-validation";

export function FileList({
  files,
  onRemove,
  emptyHint,
}: {
  files: File[];
  onRemove: (index: number) => void;
  emptyHint?: string;
}) {
  if (files.length === 0) {
    return emptyHint ? (
      <p className="px-1 py-3 text-sm text-muted-foreground">{emptyHint}</p>
    ) : null;
  }

  return (
    <ul className="mt-3 space-y-2">
      <AnimatePresence initial={false}>
        {files.map((file, i) => (
          <motion.li
            key={`${file.name}-${file.size}-${i}`}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral-50 text-coral-600">
              <FileText className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label={`Remove ${file.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
