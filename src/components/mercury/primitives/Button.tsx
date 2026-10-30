import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "ghost";
  size?: "sm" | "md" | "icon";
  icon?: ReactNode;
};

export function Button({ variant = "quiet", size = "md", icon, className = "", children, ...props }: Props) {
  const variants = {
    primary: "bg-[var(--button-primary-bg)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
    quiet: "bg-[var(--button-quiet-bg)] text-[var(--button-quiet-fg)] hover:bg-[var(--color-surface-hover)]",
    ghost: "bg-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]",
  };
  const sizes = {
    sm: "h-8 px-3 text-[14px]",
    md: "h-10 px-4 text-[14px]",
    icon: "h-8 w-8 p-0",
  };
  return <button className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-0 transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{icon}{children}</button>;
}

