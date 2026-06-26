import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "brand";

const VARIANTS: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/20",
  brand: "bg-primary/10 text-primary border-primary/20",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
