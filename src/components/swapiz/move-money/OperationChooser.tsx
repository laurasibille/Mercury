"use client";

import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Layers, Link, Repeat2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { MoveOperation } from "@/types/swapiz";

const operations: { operation: MoveOperation; title: string; detail: string; icon: typeof ArrowUpRight }[] = [
  { operation: "send", title: "Send", detail: "Pay an external wallet address", icon: ArrowUpRight },
  { operation: "receive", title: "Receive", detail: "Create a request to receive funds", icon: ArrowDownLeft },
  { operation: "transfer", title: "Internal transfer", detail: "Move between same-network wallets", icon: ArrowLeftRight },
  { operation: "swap", title: "Swap", detail: "Exchange assets with a demo quote", icon: Repeat2 },
  { operation: "mass-pay", title: "Mass Pay", detail: "Prepare a batch of up to 200 recipients", icon: Layers },
  { operation: "payment-link", title: "Payment Link", detail: "Prepare a shareable payment request", icon: Link },
];

export function OperationChooser() {
  const { dispatch } = useSwapiz();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <div className="mx-auto w-full max-w-[760px]"><p className="mb-3 text-xs font-medium text-[var(--color-ink-muted)]">YOUR MONEY, IN MOTION</p><h2 ref={heading} tabIndex={-1} className="text-[28px] leading-9 tracking-[-0.025em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">How would you like to move money?</h2><p className="mt-3 text-sm text-[var(--color-ink-muted)]">Choose an operation to prepare a demo request.</p><div className="mt-9 grid gap-3 sm:grid-cols-2">{operations.map(({ operation, title, detail, icon: Icon }) => <button key={operation} type="button" aria-label={title} onClick={() => dispatch({ type: "move/choose", operation })} className="swapiz-glass flex min-w-0 items-start gap-4 rounded-xl p-5 text-left transition-colors hover:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--swapiz-info-soft)] text-[var(--swapiz-info-ink)]"><Icon className="size-5" aria-hidden="true" /></span><span className="min-w-0"><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-xs leading-[18px] text-[var(--color-ink-muted)]">{detail}</span></span></button>)}</div><p className="mt-7 text-xs text-[var(--color-ink-muted)]">Demo only · No real funds are moved.</p></div>;
}
