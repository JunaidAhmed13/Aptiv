export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_CV_COUNT = 30; // aligned to Groq free-tier batch sanity (see context.md)

export type FileRejection = { file: File; reason: string };

export function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

/** Validate a list of incoming files; returns accepted files + per-file rejections. */
export function validatePdfs(files: File[]): {
  accepted: File[];
  rejected: FileRejection[];
} {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];

  for (const file of files) {
    if (!isPdf(file)) {
      rejected.push({ file, reason: "Not a PDF" });
      continue;
    }
    if (file.size === 0) {
      rejected.push({ file, reason: "File is empty" });
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      rejected.push({ file, reason: "Larger than 10 MB" });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
