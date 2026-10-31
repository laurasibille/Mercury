import { ArrowUpRight, CheckCheck } from "lucide-react";
import type { Alert } from "@/types/swapiz";
import { fullDate, organizationName } from "../dashboard/overview-format";
import { StatusBadge } from "../primitives/StatusBadge";

export function AttentionList({ items, onReview }: { items: Alert[]; onReview: (item: Alert, trigger: HTMLButtonElement) => void }) {
  return <ul aria-label="Operational alerts" className="divide-y divide-[var(--color-border)]">
    {items.map(item => <li key={item.id} className="flex min-w-0 flex-wrap items-start gap-4 p-4 sm:p-5">
      <div className="min-w-0 flex-1 basis-48">
        <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-medium">{item.title}</h3>{item.resolved ? <span className="inline-flex items-center gap-1 text-xs text-[var(--swapiz-success-ink)]"><CheckCheck className="size-3.5" aria-hidden="true" />Resolved</span> : <StatusBadge status={item.severity} />}</div>
        <p className="mt-1 break-words text-sm text-[var(--color-ink-secondary)]">{item.wallet ?? organizationName(item.organizationId)}</p>
        <p className="mt-1 break-words text-xs leading-[18px] text-[var(--color-ink-muted)]">{item.detail}</p>
        <p className="mt-2 text-xs leading-[18px] text-[var(--color-ink-muted)]"><time dateTime={item.date}>{fullDate.format(new Date(`${item.date}T00:00:00Z`))}</time> · {item.action}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4 self-center"><span className="tnum text-sm font-medium">{item.amount}</span><button type="button" aria-label={`Review ${item.wallet ?? organizationName(item.organizationId)}`} onClick={event => onReview(item, event.currentTarget)} className="flex min-h-9 items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">Review<ArrowUpRight className="size-3.5" aria-hidden="true" /></button></div>
    </li>)}
  </ul>;
}
