import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div";
}

export function GlassCard({ as: Component = "section", className, children, ...props }: GlassCardProps) {
  const label = props["aria-label"] ?? (
    !props["aria-labelledby"] && typeof children === "string" ? children : undefined
  );

  return (
    <Component {...props} aria-label={label} className={cn("swapiz-glass", className)}>
      {children}
    </Component>
  );
}
