import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`rounded-[12px] border border-[var(--card-border)] bg-[var(--card-bg)] ${className}`} {...props} />;
}

