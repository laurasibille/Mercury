"use client";

import type { DateRange, TransactionStatus, TransactionType } from "@/types/swapiz";
import type { KeyboardEvent } from "react";
import { swapizDemoData } from "@/data/swapiz-demo";
import { DateRangePopover } from "../dashboard/DateRangePopover";

const types: Array<{ value: TransactionType | "all"; label: string }> = [
  { value: "all", label: "All transactions" },
  { value: "send", label: "Send" },
  { value: "receive", label: "Receive" },
  { value: "transfer", label: "Transfer" },
  { value: "swap", label: "Swap" },
  { value: "mass-pay", label: "Mass pay" },
];
const statuses: Array<{ value: TransactionStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "quarantine", label: "Quarantine" },
];
const controlClass = "min-h-10 min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

interface TransactionFiltersProps {
  query: string;
  type: TransactionType | "all";
  organizationId: string;
  status: TransactionStatus | "all";
  dateRange: DateRange;
  onQueryChange: (value: string) => void;
  onTypeChange: (value: TransactionType | "all") => void;
  onOrganizationChange: (value: string) => void;
  onStatusChange: (value: TransactionStatus | "all") => void;
  onDateRangeChange: (value: DateRange) => void;
}

export function TransactionFilters({ query, type, organizationId, status, dateRange, onQueryChange, onTypeChange, onOrganizationChange, onStatusChange, onDateRangeChange }: TransactionFiltersProps) {
  function navigateTypes(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='radio']")];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next]?.focus();
    tabs[next]?.click();
  }
  return <div className="space-y-4">
    <div role="radiogroup" aria-label="Transaction type" onKeyDown={navigateTypes} className="flex min-w-0 gap-1 overflow-x-auto border-b border-[var(--color-border)]">
      {types.map(item => <button key={item.value} type="button" role="radio" tabIndex={type === item.value ? 0 : -1} aria-checked={type === item.value} onClick={() => onTypeChange(item.value)} className={`min-h-11 shrink-0 border-b-2 px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${type === item.value ? "border-[var(--color-primary)] font-medium text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"}`}>{item.label}</button>)}
    </div>
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)]">
      <label className="relative min-w-0"><span className="sr-only">Search transactions</span><input type="search" aria-label="Search transactions" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search ID, wallet, or source" className={`${controlClass} w-full pl-3`} /></label>
      <label className="grid min-w-0 gap-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Company<select aria-label="Company" value={organizationId} onChange={event => onOrganizationChange(event.target.value)} className={controlClass}><option value="all">All companies</option>{swapizDemoData.organizations.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="grid min-w-0 gap-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Status<select aria-label="Status" value={status} onChange={event => onStatusChange(event.target.value as TransactionStatus | "all")} className={controlClass}>{statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <div className="flex min-w-0 flex-col gap-1 text-xs leading-[18px] text-[var(--color-ink-muted)]"><span>Date range</span><DateRangePopover value={dateRange} onChange={onDateRangeChange} /></div>
    </div>
  </div>;
}

export type { TransactionType };
