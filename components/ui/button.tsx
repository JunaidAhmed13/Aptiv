"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Light: violet→indigo brand gradient. Dark: solid muted-violet --cta fill
  // (the one place a tint survives in dark mode); see globals.css.
  primary:
    "bg-gradient-to-r from-coral-500 to-indigo-500 text-white shadow-soft hover:shadow-lift hover:brightness-[1.04] active:brightness-95 dark:from-cta dark:to-cta dark:text-cta-foreground",
  outline:
    "border border-border bg-surface/70 text-foreground backdrop-blur hover:bg-surface hover:border-foreground/20",
  ghost: "text-foreground hover:bg-muted",
  subtle: "bg-muted text-foreground hover:bg-border/60",
  danger: "bg-danger text-white hover:brightness-95",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-2xl gap-2.5 py-3.5",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex cursor-pointer select-none items-center justify-center font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
