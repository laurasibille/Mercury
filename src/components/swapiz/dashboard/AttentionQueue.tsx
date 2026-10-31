import Link from "next/link";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import type { DashboardSnapshot } from "@/types/swapiz";
import { StatusBadge } from "../primitives/StatusBadge";
import { headingClass, linkClass, metadataClass, organizationName, panelClass, ResetFilters } from "./overview-format";

export function AttentionQueue({ snapshot, onReset }: { snapshot: DashboardSnapshot; onReset: () => void }) {
  return <section aria-label="Priority attention" className={`${panelClass} rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]`}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className={headingClass}><Link href="/dashboard/alerts" className="hover:underline">Priority attention</Link></h2><Link href="/dashboard/alerts" className={linkClass}>View all alerts</Link></div>
    <p className={`${metadataClass} mt-1`}>{snapshot.attentionCount} unresolved alerts in this view</p>
    {snapshot.alerts.length ? <ul className="mt-3 divide-y divide-[var(--color-border)]">{snapshot.alerts.slice(0, 4).map(alert => <li key={alert.id} className="py-3"><Link href="/dashboard/alerts" aria-label={`${alert.action}: ${alert.wallet ?? organizationName(alert.organizationId)} · ${alert.title}`} className="flex min-w-0 items-start justify-between gap-3 rounded-lg">
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium leading-5">{alert.title}</span><StatusBadge status={alert.severity} /></div><p className={`mt-1 break-words ${metadataClass}`}>{alert.wallet ?? organizationName(alert.organizationId)}</p><p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-secondary)]">{alert.detail}{alert.amount ? ` · ${alert.amount}` : ""}</p></div><ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[var(--color-ink-muted)]" />
    </Link></li>)}</ul> : <div className="flex min-h-[230px] flex-col items-center justify-center text-center"><CircleCheck aria-hidden="true" className="mb-3 size-6 text-[var(--swapiz-success-ink)]" /><p className="text-sm text-[var(--color-ink-secondary)]">No unresolved alerts for this scope and date range.</p><ResetFilters onReset={onReset} /></div>}
  </section>;
}
