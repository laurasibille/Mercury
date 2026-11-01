"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, CircleCheck, Clock3 } from "lucide-react";
import { swapizDemoData } from "@/data/swapiz-demo";
import { useSwapiz } from "../providers/SwapizProvider";
import { companyRecords, money, mutedClass, panelClass } from "./company-data";

export function CompaniesPage() {
  const { state } = useSwapiz();
  const companies = swapizDemoData.organizations.filter(item => item.kind === "company");
  return <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
    <div><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">Companies</h1><p className={`${mutedClass} mt-1`}>Manage your companies, departments, and treasury wallets · Demo data</p></div>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-medium">Your companies <span className="ml-1 text-[var(--color-ink-muted)]">{companies.length}</span></h2><p className={mutedClass}>Operational wallet balances · USD equivalent</p></div>
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">
      {companies.map(company => {
        const records = companyRecords(company.id);
        const pending = state.approvals.filter(item => records.ids.includes(item.organizationId) && !item.resolved).length;
        const attention = state.alerts.filter(item => records.ids.includes(item.organizationId) && !item.resolved).length;
        const active = company.status === "Active";
        return <article key={company.id} aria-label={company.name} className={`${panelClass} flex flex-col p-5 sm:p-6`}>
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-xl bg-[var(--color-surface)] text-[var(--color-ink-secondary)]"><Building2 className="size-5" aria-hidden="true" /></span><span className={`swapiz-status-badge ${active ? "swapiz-status-success" : "swapiz-status-warning"}`}>{active ? <CircleCheck size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}{company.status}</span></div>
          <h3 className="mt-5 text-xl font-medium"><Link href={`/dashboard/companies/${company.id}`} className="group flex items-center justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">{company.name}<ArrowUpRight className="size-4 text-[var(--color-ink-muted)] group-hover:text-[var(--swapiz-info-ink)]" aria-hidden="true" /></Link></h3>
          <p className={`${mutedClass} mt-1`}>{company.displayId}</p>
          <p className="tnum mt-6 text-[28px] leading-9 tracking-[-0.02em]">{money.format(records.total)}</p><p className={`${mutedClass} mt-1`}>Wallet balance</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 text-sm"><span>{records.wallets.length} {records.wallets.length === 1 ? "wallet" : "wallets"}</span><span>{records.departments.length} departments</span></div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-[18px]"><Link href="/dashboard/alerts" className="text-[var(--swapiz-info-ink)] hover:underline">{pending} pending {pending === 1 ? "approval" : "approvals"}</Link><Link href="/dashboard/alerts" className="text-[var(--color-ink-secondary)] hover:underline">{attention} {attention === 1 ? "needs" : "need"} attention</Link></div>
        </article>;
      })}
    </div>
    <p className={mutedClass}>Balances include each company’s recorded department wallets. Operational wallet balances are independent of dashboard observations and asset allocation; the source totals may differ.</p>
  </div>;
}
