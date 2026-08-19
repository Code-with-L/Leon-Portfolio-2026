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
        "inline-flex items-center rounded border border-border px-2 py-0.5 font-mono text-xs leading-tight text-muted transition-colors duration-150 hover:border-foreground/20",
        className,
      )}
    >
      {children}
    </span>
  );
}
