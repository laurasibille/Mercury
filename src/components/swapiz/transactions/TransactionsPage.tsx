"use client";

import { Download, SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { swapizDemoData } from "@/data/swapiz-demo";
import { getPresetRange } from "@/lib/swapiz/date-range";
import { scopeOrganizationIds } from "@/lib/swapiz/selectors";
import { useSwapiz } from "../providers/SwapizProvider";
import { StatusBadge } from "../primitives/StatusBadge";
import { fullDate, organizationName } from "../dashboard/overview-format";
import type { DateRange, ScopeId, Transaction, TransactionStatus, TransactionType } from "@/types/swapiz";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionDetail } from "./TransactionDetail";

const amountClass = "tnum whitespace-nowrap text-right font-medium";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const typeLabel = (type: TransactionType) => type === "mass-pay" ? "Mass pay" : type.charAt(0).toUpperCase() + type.slice(1);
const compareTimestamp = (a: Transaction, b: Transaction) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`);

function csvCell(value: string | number) {
  let text = String(value);
  if (typeof value === "string" && /^\s*[=+@\-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function transactionsCsv(transactions: Transaction[]) {
  const headers = ["ID", "Date", "Time (UTC)", "Type", "Amount", "USD value", "Asset", "Network", "Company", "Wallet", "Source", "Status", "Address"];
  const rows = transactions.map(item => [item.id, item.date, item.time, typeLabel(item.type), item.amountLabel, item.usdValue.toFixed(2), item.asset, item.network, organizationName(item.organizationId), item.wallet, item.source, item.status, item.address ?? ""]);
  return [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
}

export function TransactionsPage() {
  const { state } = useSwapiz();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TransactionType | "all">("all");
  const [organizationId, setOrganizationId] = useState("all");
  const [status, setStatus] = useState<TransactionStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange>(() => getPresetRange("last-30-days"));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [exportedCount, setExportedCount] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const sortedTransactions = useMemo(() => [...state.transactions].sort(compareTimestamp), [state.transactions]);
  const organizationIds = useMemo(() => scopeOrganizationIds(organizationId as ScopeId, swapizDemoData.organizations), [organizationId]);
  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return sortedTransactions.filter(item => {
      const organization = swapizDemoData.organizations.find(org => org.id === item.organizationId)?.name ?? item.organizationId;
      const searchable = [item.id, item.type, item.amountLabel, item.asset, item.network, item.wallet, item.source, item.status, item.organizationId, organization, item.address ?? ""].join(" ").toLocaleLowerCase();
      return (type === "all" || item.type === type)
        && organizationIds.includes(item.organizationId)
        && (status === "all" || item.status === status)
        && item.date >= dateRange.from && item.date <= dateRange.to
        && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [dateRange, organizationIds, query, sortedTransactions, status, type]);
  const selectedTransaction = state.transactions.find(item => item.id === selectedId) ?? null;

  function exportCsv() {
    if (!filteredTransactions.length) return;
    const blob = new Blob(["\uFEFF", transactionsCsv(filteredTransactions)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `swapiz-transactions-${dateRange.from}-to-${dateRange.to}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setExportedCount(filteredTransactions.length);
    setAnnouncement(`Exported ${filteredTransactions.length} ${filteredTransactions.length === 1 ? "transaction" : "transactions"} to CSV.`);
  }

  function resetFilters() {
    setQuery(""); setType("all"); setOrganizationId("all"); setStatus("all"); setDateRange(getPresetRange("last-30-days"));
  }

  return <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">Transactions</h1><p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Review movement across your companies and wallets · Demo data</p></div><button type="button" onClick={exportCsv} disabled={!filteredTransactions.length} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"><Download className="size-4" aria-hidden="true" />Export CSV</button></header>
    <div role="status" aria-live="polite" className={announcement ? "rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 text-sm" : "sr-only"}>{announcement}</div>
    <section aria-label="Transaction filters" className="min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 sm:p-5">
      <TransactionFilters query={query} type={type} organizationId={organizationId} status={status} dateRange={dateRange} onQueryChange={value => { setQuery(value); setExportedCount(null); }} onTypeChange={value => { setType(value); setExportedCount(null); }} onOrganizationChange={value => { setOrganizationId(value); setExportedCount(null); }} onStatusChange={value => { setStatus(value); setExportedCount(null); }} onDateRangeChange={value => { setDateRange(value); setExportedCount(null); }} />
    </section>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-medium">Transaction history</h2><p className="text-xs leading-[18px] text-[var(--color-ink-muted)]">{filteredTransactions.length} {filteredTransactions.length === 1 ? "transaction" : "transactions"} · Export contains this filtered view</p></div>
    <div className="hidden min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] md:block">
      {filteredTransactions.length ? <div className="overflow-x-auto"><table role="table" aria-label="Transactions" className="w-full min-w-[1000px] border-collapse text-left text-sm"><thead className="bg-[var(--color-surface)] text-xs text-[var(--color-ink-muted)]"><tr>{["ID / time", "Type", "Amount", "Network", "Company / wallet", "Source", "Status", "Details"].map(label => <th key={label} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-[var(--color-border)]">{filteredTransactions.map(item => <tr key={item.id} className="align-middle hover:bg-[var(--color-surface)]/60"><td className="px-4 py-3"><div className="font-medium">#{item.id}</div><time dateTime={`${item.date}T${item.time}:00Z`} className="text-xs text-[var(--color-ink-muted)]">{fullDate.format(new Date(`${item.date}T00:00:00Z`))} · {item.time} UTC</time></td><td className="px-4 py-3">{typeLabel(item.type)}</td><td className={`${amountClass} px-4 py-3`}><span>{item.amountLabel}</span><span className="mt-1 block text-xs font-normal text-[var(--color-ink-muted)]">{money.format(item.usdValue)}</span></td><td className="px-4 py-3">{item.network}</td><td className="px-4 py-3"><span className="block">{organizationName(item.organizationId)}</span><span className="text-xs text-[var(--color-ink-muted)]">{item.wallet}</span></td><td className="max-w-48 px-4 py-3 text-xs text-[var(--color-ink-secondary)]">{item.source}</td><td className="px-4 py-3"><StatusBadge status={item.status} /></td><td className="px-4 py-3"><button type="button" ref={selectedId === item.id ? triggerRef : undefined} onClick={event => { triggerRef.current = event.currentTarget; setSelectedId(item.id); }} className="min-h-9 whitespace-nowrap rounded-lg px-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]" aria-label={`View transaction ${item.id}`}>View details</button></td></tr>)}</tbody></table></div> : <EmptyState onReset={resetFilters} />}
    </div>
    <section aria-label="Transaction cards" className="space-y-3 md:hidden">{filteredTransactions.length ? filteredTransactions.map(item => <article key={item.id} aria-label={`Transaction ${item.id}`} className="min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
      <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium">#{item.id} · {typeLabel(item.type)}</p><time dateTime={`${item.date}T${item.time}:00Z`} className="mt-1 block text-xs text-[var(--color-ink-muted)]">{fullDate.format(new Date(`${item.date}T00:00:00Z`))} · {item.time} UTC</time></div><StatusBadge status={item.status} /></div>
      <dl className="mt-4 grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-3 text-xs"><CardField label="Amount">{item.amountLabel}<span className="mt-1 block text-[var(--color-ink-muted)]">{money.format(item.usdValue)}</span></CardField><CardField label="Network">{item.network}</CardField><CardField label="Company / wallet">{organizationName(item.organizationId)} · {item.wallet}</CardField><CardField label="Source">{item.source}</CardField><CardField label="Address">{item.address ?? "—"}</CardField></dl>
      <button type="button" onClick={event => { triggerRef.current = event.currentTarget; setSelectedId(item.id); }} className="mt-4 min-h-10 w-full rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]" aria-label={`View transaction ${item.id}`}>View details</button>
    </article>) : <EmptyState onReset={resetFilters} />}</section>
    <TransactionDetail transaction={selectedTransaction} onClose={() => setSelectedId(null)} finalFocus={() => triggerRef.current?.isConnected ? triggerRef.current : true} />
    {exportedCount !== null && <span className="sr-only">Last export contained {exportedCount} records.</span>}
  </div>;
}

function CardField({ label, children }: { label: string; children: React.ReactNode }) { return <div className="min-w-0"><dt className="mb-1 text-[var(--color-ink-muted)]">{label}</dt><dd className="break-words text-[var(--color-ink)]">{children}</dd></div>; }

function EmptyState({ onReset }: { onReset: () => void }) {
  return <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-6 text-center"><SearchX className="size-7 text-[var(--color-ink-muted)]" aria-hidden="true" /><p className="text-sm">No transactions match these filters.</p><p className="text-xs text-[var(--color-ink-muted)]">Try another search, company, status, type, or date range.</p><button type="button" onClick={onReset} className="mt-2 min-h-9 rounded-lg border border-[var(--color-border)] px-3 text-sm hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">Reset filters</button></div>;
}
