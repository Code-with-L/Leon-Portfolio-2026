import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-muted transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {children}
    </span>
  );
}
