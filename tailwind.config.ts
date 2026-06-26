import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // `coral` is a legacy palette key, now mapped to a violet ramp so the
        // whole app renders in the unified purple identity without rewriting
        // every `coral-*` class. Treat it as "violet/accent". Safe to rename in
        // a future pass. See context.md §2 (Palette).
        coral: {
          DEFAULT: "#8B5CF6",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        indigo: {
          DEFAULT: "#6366F1",
          50: "#EEF0FF",
          100: "#E0E3FF",
          200: "#C7CBFE",
          300: "#A5A8FB",
          400: "#8385F7",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#372FA0",
          900: "#312C7E",
        },
        // Semantic tokens (CSS-variable driven for theming)
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        cta: "rgb(var(--cta) / <alpha-value>)",
        "cta-foreground": "rgb(var(--cta-foreground) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        // Editorial display scale
        "display-xl": ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)",
        card: "0 2px 8px rgba(16,24,40,0.06), 0 12px 32px rgba(16,24,40,0.08)",
        lift: "0 12px 40px rgba(99,102,241,0.18), 0 4px 12px rgba(255,107,74,0.12)",
        glow: "0 0 0 1px rgba(255,255,255,0.6) inset, 0 8px 30px rgba(99,102,241,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
