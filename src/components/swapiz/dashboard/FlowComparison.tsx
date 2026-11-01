import { useId } from "react";
import type { DashboardSnapshot } from "@/types/swapiz";
import { GlassCard } from "../primitives/GlassCard";
import { headingClass, metadataClass, panelClass, ResetFilters, usd } from "./overview-format";

export function FlowComparison({ snapshot, onReset }: { snapshot: DashboardSnapshot; onReset: () => void }) {
  const descriptionId = useId();
  const patternId = useId();
  const max = Math.max(1, snapshot.inflow, snapshot.outflow);
  return <GlassCard aria-label="Inflow versus outflow" className={panelClass}>
    <h2 className={headingClass}>Inflow versus outflow</h2><p className={`${metadataClass} mt-1`}>Observed movement during the selected period</p>
    {snapshot.observations.length ? <>
      <dl className="mt-5 grid grid-cols-2 gap-4"><div><dt className={`flex items-center gap-2 ${metadataClass}`}><span aria-hidden="true" className="size-2 rounded-full bg-[var(--color-primary)]" />Inflow</dt><dd className="tnum mt-1 text-xl font-medium">{usd.format(snapshot.inflow)}</dd></div><div><dt className={`flex items-center gap-2 ${metadataClass}`}><span aria-hidden="true" className="size-2 border border-[var(--color-ink-muted)]" />Outflow</dt><dd className="tnum mt-1 text-xl font-medium">{usd.format(snapshot.outflow)}</dd></div></dl>
      <svg role="img" aria-label="Inflow versus outflow for the selected period" aria-describedby={descriptionId} viewBox="0 0 500 145" preserveAspectRatio="none" className="mt-5 h-[145px] w-full">
        <defs><pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="var(--color-surface)" /><line x1="0" x2="0" y1="0" y2="8" stroke="var(--color-ink-muted)" strokeWidth="3" /></pattern></defs>
        {[30, 65, 100, 135].map(y => <line key={y} x1="0" x2="500" y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="3 5" />)}
        <rect x="75" y={135 - snapshot.inflow / max * 125} width="130" height={snapshot.inflow / max * 125} rx="4" fill="var(--color-primary)" />
        <rect x="295" y={135 - snapshot.outflow / max * 125} width="130" height={snapshot.outflow / max * 125} rx="4" fill={`url(#${patternId})`} stroke="var(--color-ink-muted)" />
      </svg>
      <p id={descriptionId} className="sr-only">Inflow {usd.format(snapshot.inflow)}, shown as a solid bar. Outflow {usd.format(snapshot.outflow)}, shown as a striped bar. Net flow {usd.format(snapshot.netFlow)}.</p>
      <div aria-hidden="true" className={`grid grid-cols-2 text-center ${metadataClass}`}><span>Inflow · solid</span><span>Outflow · striped</span></div>
    </> : <div className="flex min-h-[230px] flex-col items-center justify-center text-center"><p className="text-sm text-[var(--color-ink-secondary)]">No flow observations for this scope and date range.</p><ResetFilters onReset={onReset} /></div>}
  </GlassCard>;
}
