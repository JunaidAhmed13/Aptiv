import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Server-side proxy to the n8n screening webhook.
 *
 * Why this exists (see context.md §5): the webhook URL is kept server-only
 * (WEBHOOK_URL, no NEXT_PUBLIC_ prefix) so it is never shipped to the browser.
 * This route forwards the recruiter's multipart upload to n8n and normalizes
 * the response/errors before they reach the client. It also gates the call
 * behind Clerk auth.
 *
 * The screening can take 30s–2min upstream, so we set a generous timeout and
 * surface a clear, typed error on failure (no silent swallowing).
 */

export const runtime = "nodejs";
// Allow long-running upstream processing (Vercel hobby caps lower; documented in context.md).
export const maxDuration = 300;

const UPSTREAM_TIMEOUT_MS = 4 * 60 * 1000; // 4 minutes

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    // Misconfiguration — fail loudly, don't pretend to work.
    console.error("[api/screen] WEBHOOK_URL is not set in the environment.");
    return NextResponse.json(
      { error: "Screening service is not configured. Please contact support." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error("[api/screen] Failed to parse multipart form data:", err);
    return NextResponse.json(
      { error: "Invalid upload. Expected multipart form data." },
      { status: 400 }
    );
  }

  // Validate the payload server-side too (defense in depth; the UI also guards).
  const entries = Array.from(formData.entries());
  const fileEntries = entries.filter(([, v]) => v instanceof File) as [string, File][];
  const cvFiles = fileEntries.filter(([name]) => name.toLowerCase().startsWith("cv"));
  const hasJd = fileEntries.some(([name]) => !name.toLowerCase().startsWith("cv"));

  if (cvFiles.length === 0) {
    return NextResponse.json(
      { error: "At least one CV file (field name starting with 'CV') is required." },
      { status: 400 }
    );
  }
  if (!hasJd) {
    return NextResponse.json(
      { error: "A job description file is required." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      body: formData, // forward as-is (preserves field names + binaries)
      signal: controller.signal,
    });

    const rawText = await upstream.text();

    if (!upstream.ok) {
      console.error(
        `[api/screen] Upstream returned ${upstream.status}: ${rawText.slice(0, 500)}`
      );
      return NextResponse.json(
        {
          error: `The screening service returned an error (${upstream.status}). Please try again.`,
        },
        { status: 502 }
      );
    }

    // n8n returns JSON; parse defensively in case of an unexpected body.
    let data: unknown;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (err) {
      console.error("[api/screen] Upstream response was not valid JSON:", err, rawText.slice(0, 500));
      return NextResponse.json(
        { error: "The screening service returned an unexpected response." },
        { status: 502 }
      );
    }

    // Normalize: ensure a { candidates: [] } shape regardless of upstream quirks.
    const candidates = normalizeCandidates(data);
    return NextResponse.json({ candidates });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[api/screen] Upstream request timed out.");
      return NextResponse.json(
        {
          error:
            "Screening timed out. Large batches can take a couple of minutes — please try again, or reduce the number of CVs.",
        },
        { status: 504 }
      );
    }
    console.error("[api/screen] Unexpected error calling upstream:", err);
    return NextResponse.json(
      { error: "Could not reach the screening service. Please try again." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** Coerce upstream payload into a candidates array. Accepts a few plausible shapes. */
function normalizeCandidates(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.candidates)) return obj.candidates;
    // Some n8n setups wrap the body in a single-item array under `json`.
    if (Array.isArray(obj.json)) return obj.json;
  }
  return [];
}
