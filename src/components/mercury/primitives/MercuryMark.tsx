import type { SVGProps } from "react";

export function MercuryMark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} {...props}>
      <circle cx="16" cy="16" r="15.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4.5c4.3 0 7.8 3.5 7.8 7.8S20.3 20 16 20s-7.8-3.5-7.8-7.8S11.7 4.5 16 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 16c0-4.3 3.5-7.8 7.8-7.8s7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8S5 20.3 5 16Zm6-11c4.3 0 7.8 3.5 7.8 7.8s-3.5 7.8-7.8 7.8" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

