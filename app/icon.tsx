import { ImageResponse } from "next/og";

// Favicon: the Aptiv brand mark (violet tile + white ascending-"A" peak),
// matching components/logo.tsx AptivMark.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="t" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="55%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#t)" />
          <path d="M15.5 34 L24 14.5 L32.5 34" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M19.5 26.5 L28.5 26.5" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
