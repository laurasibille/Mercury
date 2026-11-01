"use client";

import { Dialog } from "@base-ui/react/dialog";
import { CheckCheck, CircleCheck, X } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { scopeOrganizationIds } from "@/lib/swapiz/selectors";
import { initialSwapizState } from "@/lib/swapiz/reducer";
import { swapizDemoData } from "@/data/swapiz-demo";
import type { Alert, Approval } from "@/types/swapiz";
import { useSwapiz } from "../providers/SwapizProvider";
import { ScopeSelect } from "../dashboard/ScopeSelect";
import { DateRangePopover } from "../dashboard/DateRangePopover";
import { eur, fullDate, organizationName } from "../dashboard/overview-format";
import { StatusBadge } from "../primitives/StatusBadge";
import { ApprovalList } from "./ApprovalList";
import { AttentionList } from "./AttentionList";

type Tab = "approval" | "attention";
type AttentionFilter = "All" | "Critical" | "Warning" | "Resolved / OK";
const controlClass = "min-h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]";

export function AlertsPage() {
  const { state, snapshot, dispatch } = useSwapiz();
  const [tab, setTab] = useState<Tab>("approval");
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>("All");
  const [approvalStatus, setApprovalStatus] = useState("pending");
  const [requestType, setRequestType] = useState("all");
  const [selected, setSelected] = useState<{ kind: Tab; id: string } | null>(null);
  const [message, setMessage] = useState("");
  const origin = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const ids = scopeOrganizationIds(state.scopeId, swapizDemoData.organizations);
  const inScope = (item: Alert | Approval) => ids.includes(item.organizationId) && item.date >= state.dateRange.from && item.date <= state.dateRange.to;
  const approvals = state.approvals.filter(item => inScope(item) && item.resolved === (approvalStatus === "resolved") && (requestType === "all" || item.type === requestType));
  const alerts = state.alerts.filter(item => inScope(item) && (attentionFilter === "Resolved / OK" ? item.resolved || item.severity === "ok" : !item.resolved && (attentionFilter === "All" || item.severity === attentionFilter.toLowerCase())));
  const approval = selected?.kind === "approval" ? state.approvals.find(item => item.id === selected.id) : undefined;
  const alert = selected?.kind === "attention" ? state.alerts.find(item => item.id === selected.id) : undefined;
  const detail = approval ?? alert;

  function review(kind: Tab, item: Approval | Alert, trigger: HTMLButtonElement) {
    origin.current = trigger;
    setSelected({ kind, id: item.id });
  }
  function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "approval" : event.key === "End" ? "attention" : tab === "approval" ? "attention" : "approval";
    setTab(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  }
  function resetFilters() {
    dispatch({ type: "scope/changed", scopeId: "all" });
    dispatch({ type: "date/changed", dateRange: initialSwapizState.dateRange });
    setAttentionFilter("All");
    setRequestType("all");
    setApprovalStatus("pending");
  }
  function resolve() {
    if (approval) dispatch({ type: "approval/resolved", approvalId: approval.id });
    if (alert) dispatch({ type: "alert/resolved", alertId: alert.id });
    setMessage(approval ? "Approval resolved in this demo. No real funds were moved." : "Alert resolved in this demo. No real funds were moved.");
    setSelected(null);
  }

  return <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">Alerts</h1><p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Review requests and keep your treasury moving · Demo data</p></div><div className="flex min-w-0 flex-wrap gap-2"><ScopeSelect value={state.scopeId} onChange={scopeId => dispatch({ type: "scope/changed", scopeId })} /><DateRangePopover value={state.dateRange} onChange={dateRange => dispatch({ type: "date/changed", dateRange })} /></div></div>
    <div role="status" className={message ? "rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 text-sm" : "sr-only"}>{message}</div>
    <div role="tablist" aria-label="Alert queues" onKeyDown={navigateTabs} className="flex gap-4 border-b border-[var(--color-border)] sm:gap-7">
      {([ ["approval", "Pending approval", snapshot.pendingApprovalCount], ["attention", "Needs attention", snapshot.attentionCount] ] as const).map(([value, label, count]) => <button key={value} type="button" id={`${id}-${value}`} role="tab" data-tab={value} aria-label={`${label} ${count}`} aria-selected={tab === value} aria-controls={`${id}-${value}-panel`} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} className={`flex min-h-12 min-w-0 items-center gap-2 border-b-2 px-0.5 text-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${tab === value ? "border-[var(--color-primary)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink-muted)]"}`}><span>{label}</span><span className="tnum rounded-md bg-[var(--color-surface)] px-1.5 py-0.5 text-xs">{count}</span></button>)}
    </div>
    <section role="tabpanel" id={`${id}-${tab}-panel`} aria-labelledby={`${id}-${tab}`} tabIndex={0} className="min-w-0 space-y-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {tab === "approval" ? <div className="flex flex-wrap gap-3"><label className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">Request type<select value={requestType} onChange={event => setRequestType(event.target.value)} className={controlClass}><option value="all">All types</option>{[...new Set(state.approvals.map(item => item.type))].map(type => <option key={type}>{type}</option>)}</select></label><label className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">Approval status<select value={approvalStatus} onChange={event => setApprovalStatus(event.target.value)} className={controlClass}><option value="pending">Pending</option><option value="resolved">Resolved</option></select></label></div> : <div role="group" aria-label="Alert severity" className="flex flex-wrap gap-2">{(["All", "Critical", "Warning", "Resolved / OK"] as const).map(filter => <button type="button" key={filter} aria-pressed={attentionFilter === filter} onClick={() => setAttentionFilter(filter)} className={`${controlClass} ${attentionFilter === filter ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "hover:bg-[var(--color-surface)]"}`}>{filter}</button>)}</div>}
        <p className="text-xs leading-[18px] text-[var(--color-ink-muted)]">{tab === "approval" ? approvals.length : alerts.length} {tab === "approval" ? "requests" : "alerts"} in this view</p>
      </div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]">
        {(tab === "approval" ? approvals.length : alerts.length) ? tab === "approval" ? <ApprovalList items={approvals} onReview={(item, trigger) => review("approval", item, trigger)} /> : <AttentionList items={alerts} onReview={(item, trigger) => review("attention", item, trigger)} /> : <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-6 text-center"><CircleCheck className="mb-1 size-7 text-[var(--color-ink-muted)]" aria-hidden="true" /><p className="text-sm">{tab === "approval" ? "No approval requests match these filters." : "No alerts match these filters."}</p><p className="text-xs text-[var(--color-ink-muted)]">Try another status, organization, or date range.</p><button type="button" onClick={resetFilters} className={`${controlClass} mt-2`}>Reset filters</button></div>}
      </div>
    </section>
    <p className="text-xs leading-[18px] text-[var(--color-ink-muted)]">Resolutions apply to this demo session. Requests and alerts reset when you reload.</p>
    <Dialog.Root open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}>
      <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35" /><Dialog.Popup finalFocus={() => origin.current?.isConnected ? origin.current : document.querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`) ?? true} className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 text-[var(--color-ink)] shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-xs text-[var(--color-ink-muted)]">{approval ? "Approval request" : "Operational alert"}</p><Dialog.Title className="text-xl font-medium">{approval ? `${approval.type} request` : alert?.title}</Dialog.Title></div><Dialog.Close aria-label="Close details" className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--color-surface)]"><X className="size-4" aria-hidden="true" /></Dialog.Close></div>
        <Dialog.Description className="mt-4 break-words text-sm text-[var(--color-ink-secondary)]">{approval?.title ?? alert?.wallet ?? (alert ? organizationName(alert.organizationId) : "")}</Dialog.Description>
        {detail && <dl className="mt-5 space-y-3 border-y border-[var(--color-border)] py-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Organization</dt><dd>{organizationName(detail.organizationId)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Created</dt><dd><time dateTime={detail.date}>{fullDate.format(new Date(`${detail.date}T00:00:00Z`))}</time></dd></div>{approval && <><div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Initiator</dt><dd>{approval.initiator}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Progress</dt><dd>{approval.approvals} of {approval.requiredApprovals} approvals</dd></div>{approval.amountEur !== undefined && <div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Amount</dt><dd className="tnum">{eur.format(approval.amountEur)}</dd></div>}{approval.requestedAmounts?.filter(request => Number.isFinite(request.amount) && request.amount > 0).map(request => <div key={request.asset} className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Requested amount</dt><dd className="tnum">{request.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })} {request.asset}</dd></div>)}</>}{alert && <><div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Severity</dt><dd><StatusBadge status={alert.severity} /></dd></div>{alert.amount && <div className="flex justify-between gap-4"><dt className="text-[var(--color-ink-muted)]">Amount</dt><dd className="tnum">{alert.amount}</dd></div>}<div><dt className="text-[var(--color-ink-muted)]">Check</dt><dd className="mt-1 break-words">{alert.check ?? alert.detail}</dd></div><div><dt className="text-[var(--color-ink-muted)]">Suggested action</dt><dd className="mt-1">{alert.action} · {alert.detail}</dd></div></>}</dl>}
        <p className="mt-4 text-xs leading-[18px] text-[var(--color-ink-muted)]">Demo only. Resolving closes this request in the demo session. No real funds are moved or unfrozen, and no live compliance decision is made.</p>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">{detail?.resolved ? <span className="mr-auto flex items-center gap-2 text-sm text-[var(--swapiz-success-ink)]"><CheckCheck className="size-4" aria-hidden="true" />Resolved</span> : <button type="button" onClick={resolve} className="min-h-10 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]">{approval ? "Resolve approval" : "Resolve alert"}</button>}<Dialog.Close className={controlClass}>Close</Dialog.Close></div>
      </Dialog.Popup></Dialog.Portal>
    </Dialog.Root>
  </div>;
}
