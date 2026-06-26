import type { Metadata } from "next";
import { Inter, Geist, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

// Runs before first paint: applies the persisted (or OS) theme so there is no
// flash of the wrong colors. Kept inline and minimal on purpose.
const themeScript = `(function(){try{var t=localStorage.getItem('aptiv-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Editorial serif for the optional About / founder-story voice (LeadIQ feel).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aptiv",
  description:
    "Upload a job description and a batch of CVs. Aptiv scores each one against the role, ranks by fit, and tells you who to call first.",
  icons: { icon: "/icon" },
  openGraph: {
    title: "Aptiv — Bulk CV Screening for Recruiters",
    description:
      "Upload a JD and a batch of CVs. Aptiv scores each candidate against the role and returns a ranked shortlist.",
    siteName: "Aptiv",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${geist.variable} ${fraunces.variable}`}
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
          <ThemeProvider>
            <Providers>
              <ToastProvider>{children}</ToastProvider>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
