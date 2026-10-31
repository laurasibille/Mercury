import Link from "next/link";
import { ArrowDownUp, CalendarClock, CircleDollarSign, Clock3, ShieldAlert, Wallet } from "lucide-react";
import type { DashboardSnapshot } from "@/types/swapiz";
import { GlassCard } from "../primitives/GlassCard";
import { eur, fullDate, metadataClass, usd } from "./overview-format";

export function KpiGrid({ snapshot }: { snapshot: DashboardSnapshot }) {
  const latest = snapshot.observations.at(-1)?.date;
  const metrics = [
    { label: "Total balance", value: usd.format(snapshot.totalBalance), detail: latest ? `Observed ${fullDate.format(new Date(`${latest}T00:00:00Z`))}` : "No observations in range", icon: Wallet },
    { label: "Available to move", value: usd.format(snapshot.availableToMove), detail: "Excludes frozen & pending outbound", icon: CircleDollarSign },
    { label: "Net flow", value: `${snapshot.netFlow > 0 ? "+" : ""}${usd.format(snapshot.netFlow)}`, detail: "Inflow minus outflow · selected period", icon: ArrowDownUp },
    { label: "Upcoming obligations", value: usd.format(snapshot.upcomingObligations), detail: "Demo commitments · selected period", icon: CalendarClock },
    { label: "Pending approvals", value: String(snapshot.pendingApprovalCount), detail: `${eur.format(snapshot.pendingApprovalTotalEur)} in requests`, icon: Clock3, tone: "warning", href: "/dashboard/alerts" },
    { label: "Needs attention", value: String(snapshot.attentionCount), detail: "Unresolved operational alerts", icon: ShieldAlert, tone: "critical", href: "/dashboard/alerts" },
  ];
  return <section aria-label="Treasury metrics" className="grid min-w-0 grid-cols-1 gap-3 min-[24rem]:grid-cols-2 md:grid-cols-3 min-[90rem]:grid-cols-6">
    {metrics.map(({ label, value, detail, icon: Icon, tone, href }) => <GlassCard as="article" key={label} aria-label={label} className="min-w-0 p-4" style={tone ? { background: `var(--swapiz-${tone}-soft)` } : undefined}>
      <div className="mb-4 flex items-start justify-between gap-2"><h2 className="text-xs font-medium leading-[18px] text-[var(--color-ink-secondary)]">{href ? <Link href={href} className="hover:underline">{label}</Link> : label}</h2><Icon aria-hidden="true" className="size-4 shrink-0 text-[var(--color-ink-muted)]" /></div>
      <p className="tnum whitespace-nowrap text-[22px] font-medium leading-8 tracking-[-0.035em] text-[var(--color-ink)]">{value}</p>
      <p className={`${metadataClass} mt-2`}>{detail}</p>
    </GlassCard>)}
  </section>;
}
