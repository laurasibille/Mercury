"use client";

import Link from "next/link";
import { ArrowLeft, Building2, CircleCheck, Clock3 } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import type { Organization } from "@/types/swapiz";
import { useSwapiz } from "../providers/SwapizProvider";
import { GlassCard } from "../primitives/GlassCard";
import { companyRecords, money, mutedClass, panelClass, tokens } from "./company-data";
import { WalletList } from "./WalletList";
import { MoneyFlowRules } from "./MoneyFlowRules";

const tabs = ["Overview", "Wallets", "Money flow"] as const;

export function CompanyDetailPage({ company }: { company: Organization }) {
  const { state } = useSwapiz();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const id = useId();
  const pageClass = "mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8";
  const records = companyRecords(company.id);
  const pending = state.approvals.filter(item => records.ids.includes(item.organizationId) && !item.resolved);
  const attention = state.alerts.filter(item => records.ids.includes(item.organizationId) && !item.resolved);
  const assetTotals = new Map<string, { amount: number; usd: number }>();
  records.balances.forEach(item => {
    const previous = assetTotals.get(item.asset) ?? { amount: 0, usd: 0 };
    assetTotals.set(item.asset, { amount: previous.amount + item.amount, usd: previous.usd + item.usd });
  });
  function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(tab);
    const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[2] : tabs[(index + (event.key === "ArrowRight" ? 1 : 2)) % tabs.length];
    setTab(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-company-tab="${next}"]`)?.focus();
  }

  return <div className={pageClass}>
    <Link href="/dashboard/companies" className="inline-flex items-center gap-2 text-xs leading-[18px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"><ArrowLeft className="size-3.5" aria-hidden="true" />All companies</Link>
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]"><Building2 className="size-5 text-[var(--color-ink-secondary)]" aria-hidden="true" /></span><div><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">{company.name}</h1><p className={mutedClass}>Company · {company.displayId} · Demo data</p></div></div><span className={`swapiz-status-badge ${company.status === "Active" ? "swapiz-status-success" : "swapiz-status-warning"}`}>{company.status === "Active" ? <CircleCheck size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}{company.status}</span></div>
    <div role="tablist" aria-label="Company details" onKeyDown={navigateTabs} className="flex gap-6 border-b border-[var(--color-border)]">{tabs.map(value => <button key={value} type="button" role="tab" id={`${id}-${value.replaceAll(" ", "-")}`} data-company-tab={value} aria-selected={tab === value} aria-controls={`${id}-${value.replaceAll(" ", "-")}-panel`} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} className={`min-h-11 border-b-2 px-0.5 text-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] ${tab === value ? "border-[var(--color-primary)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink-muted)]"}`}>{value}</button>)}</div>
    <section role="tabpanel" aria-labelledby={`${id}-Overview`} id={`${id}-Overview-panel`} hidden={tab !== "Overview"} tabIndex={0} className="min-w-0 space-y-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
        ["Operational wallet balance", money.format(records.total), "Includes recorded department wallets"],
        ["Wallet accounts", String(records.wallets.length), "Across all recorded networks"],
        ["Departments", String(records.departments.length), "Within this company"],
        ["Pending approvals", String(pending.length), `${attention.length} operational alerts`],
      ].map(([label, value, description]) => <GlassCard key={label} as="article" aria-label={label} className="min-w-0 p-5"><h2 className={mutedClass}>{label}</h2><p className="tnum mt-3 break-words text-2xl leading-8 tracking-[-0.02em]">{value}</p><p className={`${mutedClass} mt-2`}>{description}</p></GlassCard>)}</div>
      <p className={mutedClass}>Operational wallet balances are independent of dashboard observations and asset allocation; these source datasets may differ. Wallet records are dated October 31, 2026.</p>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.1fr_1fr]">
        <section aria-label="Wallet assets" className={`${panelClass} p-5 sm:p-6`}><h2 className="text-base font-medium">Wallet assets</h2><p className={`${mutedClass} mt-1`}>Native holdings across recorded wallet accounts</p><ul className="mt-5 divide-y divide-[var(--color-border)]">{[...assetTotals].sort((a, b) => b[1].usd - a[1].usd).map(([asset, value]) => <li key={asset} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="tnum font-medium">{tokens.format(value.amount)} {asset}</span><span className="tnum text-[var(--color-ink-secondary)]">{money.format(value.usd)}</span></li>)}</ul>{!assetTotals.size && <p className="mt-5 text-sm">No asset holdings recorded.</p>}</section>
        <section aria-label="Departments" className={`${panelClass} p-5 sm:p-6`}><h2 className="text-base font-medium">Departments</h2><p className={`${mutedClass} mt-1`}>Balances use recorded department wallets</p><div className="mt-5 divide-y divide-[var(--color-border)]">{records.departments.map(department => {
          const wallets = records.wallets.filter(item => item.organizationId === department.id);
          const balance = records.balances.filter(item => item.organizationId === department.id).reduce((sum, item) => sum + item.usd, 0);
          return <article aria-label={department.name} key={department.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><h3 className="text-sm font-medium">{department.name}</h3><p className={`${mutedClass} mt-0.5`}>{department.status}</p></div><div className="text-right"><p className="tnum text-sm">{wallets.length ? money.format(balance) : "No wallet recorded"}</p><p className={`${mutedClass} mt-0.5`}>{wallets.length} {wallets.length === 1 ? "wallet" : "wallets"}</p></div></article>;
        })}</div>{!records.departments.length && <p className="mt-5 text-sm text-[var(--color-ink-secondary)]">No departments recorded for {company.name}.</p>}</section>
      </div>
      <section aria-label="Company approvals" className={`${panelClass} p-5 sm:p-6`}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-medium">Pending approvals</h2><Link href="/dashboard/alerts" className="text-xs text-[var(--swapiz-info-ink)] hover:underline">Review in Alerts</Link></div>{pending.length ? <ul className="mt-4 divide-y divide-[var(--color-border)]">{pending.map(item => <li key={item.id} className="flex flex-wrap items-start justify-between gap-2 py-3 text-sm"><div className="min-w-0"><p className="break-words">{item.title}</p><p className={`${mutedClass} mt-1`}>{item.type} · {item.initiator}</p></div><span className={`${mutedClass} shrink-0`}>{item.approvals} of {item.requiredApprovals} approvals</span></li>)}</ul> : <p className="mt-4 text-sm text-[var(--color-ink-secondary)]">No pending approvals for this company.</p>}</section>
    </section>
    <section role="tabpanel" aria-labelledby={`${id}-Wallets`} id={`${id}-Wallets-panel`} hidden={tab !== "Wallets"} tabIndex={0} className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"><WalletList wallets={records.wallets} balances={records.balances} /></section>
    <section role="tabpanel" aria-labelledby={`${id}-Money-flow`} id={`${id}-Money-flow-panel`} hidden={tab !== "Money flow"} tabIndex={0} className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"><MoneyFlowRules rules={records.rules} companyName={company.name} /></section>
  </div>;
}
