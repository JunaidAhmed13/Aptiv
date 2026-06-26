"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drag-and-drop + click-to-browse PDF dropzone. Validation is delegated to the
 * caller (it owns the accepted/rejected split and messaging).
 */
export function UploadZone({
  onFiles,
  multiple = false,
  label,
  hint,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label: string;
  hint: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles, disabled]
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={label}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-border bg-surface-muted hover:border-indigo-300 hover:bg-indigo-50/40",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          // Reset so re-selecting the same file fires change again.
          e.target.value = "";
        }}
      />
      <div
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
          dragging
            ? "bg-indigo-500 text-white"
            : "bg-gradient-to-br from-coral-100 to-indigo-100 text-indigo-600"
        )}
      >
        <UploadCloud className="h-7 w-7" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
