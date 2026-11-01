import Link from "next/link";
import type { DashboardSnapshot } from "@/types/swapiz";
import { StatusBadge } from "../primitives/StatusBadge";
import { headingClass, linkClass, metadataClass, organizationName, ResetFilters, shortDate } from "./overview-format";

const types = { send: "Send", receive: "Receive", transfer: "Transfer", swap: "Swap", "mass-pay": "Mass Pay" };

export function RecentTransactions({ snapshot, onReset }: { snapshot: DashboardSnapshot; onReset: () => void }) {
  const transactions = [...snapshot.transactions].sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`)).slice(0, 6);
  return <section aria-label="Recent transactions" className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]">
    <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-5 sm:px-6"><h2 className={headingClass}><Link href="/dashboard/transactions" className="hover:underline">Recent transactions</Link></h2><Link href="/dashboard/transactions" className={linkClass}>View all transactions</Link></div>
    {transactions.length ? <div role="region" aria-label="Recent transaction table" tabIndex={0} className="max-w-full overflow-x-auto"><table aria-label="Recent transactions" className="w-full min-w-[760px] border-collapse text-left text-sm leading-5">
      <thead className={`border-y border-[var(--color-border)] bg-[var(--color-canvas-subtle)] ${metadataClass}`}><tr>{["Transaction", "Type", "Amount", "Company / wallet", "Network / source", "Status"].map(label => <th key={label} scope="col" className="px-5 py-3 font-medium first:pl-6 last:pr-6">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-[var(--color-border)]">{transactions.map(transaction => <tr key={transaction.id}>
        <td className="px-5 py-4 pl-6"><span className="tnum font-medium">#{transaction.id}</span><span className={`tnum mt-1 block ${metadataClass}`}>{shortDate.format(new Date(`${transaction.date}T00:00:00Z`))} · {transaction.time}</span></td>
        <td className="px-5 py-4">{types[transaction.type]}</td><td className="tnum px-5 py-4 font-medium">{transaction.amountLabel}</td>
        <td className="px-5 py-4">{organizationName(transaction.organizationId)}<span className={`mt-1 block ${metadataClass}`}>{transaction.wallet}</span></td>
        <td className="max-w-64 px-5 py-4">{transaction.network}<span className={`mt-1 block ${metadataClass}`}>{transaction.source}</span></td><td className="px-5 py-4 pr-6"><StatusBadge status={transaction.status} /></td>
      </tr>)}</tbody>
    </table></div> : <div className="flex min-h-48 flex-col items-center justify-center px-5 pb-5 text-center"><p className="text-sm text-[var(--color-ink-secondary)]">No transactions for this scope and date range.</p><ResetFilters onReset={onReset} /></div>}
  </section>;
}
