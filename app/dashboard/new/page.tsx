import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UploadForm } from "@/components/screening/upload-form";

export default function NewScreeningPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">New screening</h1>
        <p className="mt-1 text-muted-foreground">
          Upload one job description and the CVs you want screened.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}
