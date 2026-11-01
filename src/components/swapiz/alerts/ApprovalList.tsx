import { ArrowUpRight, CheckCheck, Clock3 } from "lucide-react";
import type { Approval } from "@/types/swapiz";
import { eur, fullDate, organizationName } from "../dashboard/overview-format";

export function ApprovalList({ items, onReview }: { items: Approval[]; onReview: (item: Approval, trigger: HTMLButtonElement) => void }) {
  return <ul aria-label="Approval requests" className="divide-y divide-[var(--color-border)]">
    {items.map(item => <li key={item.id} className="flex min-w-0 flex-wrap items-start gap-4 p-4 sm:p-5">
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)] text-[var(--color-ink-muted)] sm:flex"><Clock3 className="size-4" aria-hidden="true" /></span>
      <div className="min-w-0 flex-1 basis-48">
        <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-medium">{item.type}</h2><span className="rounded-md bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--color-ink-secondary)]">{organizationName(item.organizationId)}</span>{item.resolved && <span className="inline-flex items-center gap-1 text-xs text-[var(--swapiz-success-ink)]"><CheckCheck className="size-3.5" aria-hidden="true" />Resolved</span>}</div>
        <p className="mt-1 break-words text-sm text-[var(--color-ink-secondary)]">{item.title}</p>
        <p className="mt-2 text-xs leading-[18px] text-[var(--color-ink-muted)]">{item.initiator} · <time dateTime={item.date}>{fullDate.format(new Date(`${item.date}T00:00:00Z`))}</time> · {item.approvals} of {item.requiredApprovals} approvals</p>
      </div>
      <div className="flex shrink-0 items-center gap-4 self-center"><span className="tnum text-right text-sm font-medium">{item.requestedAmounts?.filter(request => Number.isFinite(request.amount) && request.amount > 0).map(request => <span key={request.asset} className="block">{request.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })} {request.asset}</span>)}{item.amountEur !== undefined && <span className="block">{eur.format(item.amountEur)}</span>}{!item.requestedAmounts?.some(request => Number.isFinite(request.amount) && request.amount > 0) && item.amountEur === undefined ? "—" : null}</span><button type="button" aria-label={`Review ${item.title}`} onClick={event => onReview(item, event.currentTarget)} className="flex min-h-9 items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">Review<ArrowUpRight className="size-3.5" aria-hidden="true" /></button></div>
    </li>)}
  </ul>;
}
