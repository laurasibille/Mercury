"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { useSwapiz } from "../providers/SwapizProvider";
import { GlassCard } from "../primitives/GlassCard";
import { getDemoNow } from "@/lib/swapiz/demo-clock";
import type { Asset, MoveOperation, OrganizationId } from "@/types/swapiz";
import { newDemoId, organizationName, organizations, walletName } from "./flow-utils";

export const controlClass = "w-full min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm leading-5 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] aria-invalid:border-[var(--color-negative)] disabled:opacity-50";
export const quietButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50";
export const primaryButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50";
export type Errors = Record<string, string | undefined>;

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode }) {
  const id = useId();
  return <div className="min-w-0 space-y-1.5"><label className="block text-sm font-medium" htmlFor={id}>{label}</label>{children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": error || hint ? `${id}-detail` : undefined })}{(error || hint) && <p id={`${id}-detail`} className={`text-xs leading-[18px] ${error ? "text-[var(--color-negative)]" : "text-[var(--color-ink-muted)]"}`}>{error || hint}</p>}</div>;
}

export function OrganizationField({ value, onChange, label = "Organization" }: { value: OrganizationId; onChange: (id: OrganizationId) => void; label?: string }) {
  return <Field label={label}>{props => <select {...props} className={controlClass} value={value} onChange={event => onChange(event.target.value as OrganizationId)}>{organizations.map(item => <option key={item.id} value={item.id}>{item.name}{item.kind === "department" ? " · Department of Amazon" : ""}</option>)}</select>}</Field>;
}
export function WalletField({ label, value, options, onChange, error, disabledIds = [] }: { label: string; value: string; options: { id: string }[]; onChange: (id: string) => void; error?: string; disabledIds?: string[] }) {
  return <Field label={label} error={error}>{props => <select {...props} className={controlClass} value={value} onChange={event => onChange(event.target.value)}><option value="">Choose a wallet</option>{options.map(wallet => <option key={wallet.id} value={wallet.id} disabled={disabledIds.includes(wallet.id)}>{walletName(wallet.id)}</option>)}</select>}</Field>;
}
export function AssetField({ label, value, options, onChange, error }: { label: string; value: string; options: Asset[]; onChange: (asset: Asset) => void; error?: string }) {
  return <Field label={label} error={error}>{props => <select {...props} className={controlClass} value={options.length ? value : ""} onChange={event => onChange(event.target.value as Asset)}>{!options.length && <option value="">No compatible asset available</option>}{options.map(asset => <option key={asset}>{asset}</option>)}</select>}</Field>;
}
export function AmountField({ label = "Amount", value, onChange, error, hint }: { label?: string; value: string; onChange: (value: string) => void; error?: string; hint?: string }) {
  return <Field label={label} error={error} hint={hint}>{props => <input {...props} className={`${controlClass} tnum`} type="number" inputMode="decimal" step="any" min="0" value={value} onChange={event => onChange(event.target.value)} />}</Field>;
}
export function CommentField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Field label="Comment" hint="Optional · visible to your approval team.">{props => <textarea {...props} className={controlClass} rows={2} maxLength={500} value={value} onChange={event => onChange(event.target.value)} />}</Field>;
}

export function useFlow() {
  const [step, setStep] = useState<"details" | "review" | "done">("details");
  const [errors, setErrors] = useState<Errors>({});
  const submitted = useRef(false);
  return { step, errors, edit: () => setStep("details"), review: (next: Errors) => {
    setErrors(next);
    if (!Object.values(next).some(Boolean)) setStep("review");
    else requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }, complete: (commit: () => void) => { if (!submitted.current) { submitted.current = true; commit(); setStep("done"); } } };
}

export function useCreateApproval() {
  const { dispatch } = useSwapiz();
  return (operation: MoveOperation, organizationId: OrganizationId, title: string) => dispatch({ type: "approval/added", approval: {
    id: newDemoId(), date: getDemoNow().toISOString().slice(0, 10), organizationId, type: operation, title,
    initiator: "Kramer · demo", approvals: 0, requiredApprovals: 2, resolved: false,
  } });
}

export function FlowFrame({ title, description, flow, children, summary, onReview, onConfirm, reviewLabel = "Review request", confirmLabel = "Create demo approval", confirmation }: {
  title: string; description: string; flow: ReturnType<typeof useFlow>; children: ReactNode; summary: [string, ReactNode][]; onReview: () => void; onConfirm: () => void; reviewLabel?: string; confirmLabel?: string; confirmation?: ReactNode;
}) {
  const { dispatch } = useSwapiz();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [flow.step]);
  const name = flow.step === "done" ? "Demo request created" : flow.step === "review" ? `Review ${title}` : title;
  return <div className="mx-auto w-full max-w-[640px]">
    <button type="button" className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]" onClick={() => flow.step === "review" ? flow.edit() : dispatch({ type: "move/choose", operation: null })}><ArrowLeft className="size-4" aria-hidden="true" />{flow.step === "review" ? "Edit details" : "All operations"}</button>
    <p className="mb-2 text-xs font-medium text-[var(--color-ink-muted)]">{flow.step === "done" ? "3 of 3 · Confirmation" : flow.step === "review" ? "2 of 3 · Review" : "1 of 3 · Details"}</p>
    <h2 ref={heading} tabIndex={-1} className="text-[28px] leading-9 tracking-[-0.025em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">{name}</h2>
    <p className="mt-2 mb-7 text-sm leading-5 text-[var(--color-ink-muted)]">{flow.step === "done" ? "This request is saved in this demo session. No funds have moved." : description}</p>
    <GlassCard className="rounded-xl p-5 sm:p-7">
      {flow.step === "details" ? <form noValidate onSubmit={event => { event.preventDefault(); onReview(); }} className="space-y-5">{children}<div className="border-t border-[var(--color-border)] pt-5"><button className={`${primaryButton} w-full sm:w-auto`} type="submit">{reviewLabel}</button></div></form> : flow.step === "review" ? <div className="space-y-6"><dl className="space-y-4">{summary.map(([label, value]) => <div key={label} className="grid min-w-0 gap-1 sm:grid-cols-[145px_1fr]"><dt className="text-sm text-[var(--color-ink-muted)]">{label}</dt><dd className="min-w-0 break-words text-sm [overflow-wrap:anywhere]">{value || "—"}</dd></div>)}</dl><div className="flex items-start gap-2 rounded-lg bg-[var(--swapiz-info-soft)] p-3 text-xs leading-[18px] text-[var(--swapiz-info-ink)]"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />Demo only. Review creates a local request; it does not execute a payment, perform an AML check, or send a message.</div><button type="button" className={`${primaryButton} w-full sm:w-auto`} onClick={() => flow.complete(onConfirm)}>{confirmLabel}</button></div> : <div className="space-y-5"><span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--swapiz-success-soft)] text-[var(--swapiz-success-ink)]"><Check aria-hidden="true" className="size-5" /></span><p role="status" className="text-sm">Your demo request is ready. Approval requests appear in the local approval queue.</p>{confirmation}<button type="button" className={primaryButton} onClick={() => dispatch({ type: "move/close" })}>Return to dashboard</button></div>}
    </GlassCard>
    <p className="mt-5 text-center text-xs leading-[18px] text-[var(--color-ink-muted)]">Swapiz demo · Nothing is submitted to a bank or blockchain.</p>
  </div>;
}

export const organizationSummary = (organizationId: OrganizationId): [string, ReactNode] => ["Organization", organizationName(organizationId)];
