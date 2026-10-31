import type { DashboardSnapshot } from "@/types/swapiz";
import { GlassCard } from "../primitives/GlassCard";
import { chartColors, headingClass, metadataClass, panelClass, ResetFilters, usd } from "./overview-format";

export function AssetAllocation({ snapshot, onReset }: { snapshot: DashboardSnapshot; onReset: () => void }) {
  // Group only the selected allocation records for the chart; never reconcile them to the headline balance.
  const grouped = new Map<string, number>();
  snapshot.assetBalances.forEach(item => grouped.set(item.asset, (grouped.get(item.asset) ?? 0) + item.usd));
  const assets = [...grouped].sort((a, b) => b[1] - a[1]);
  const total = assets.reduce((sum, [, value]) => sum + value, 0);
  const segments = assets.map(([asset, value], index) => ({ asset, value, color: chartColors[index % chartColors.length], percent: total ? value / total * 100 : 0 }));
  const gradient = segments.map((segment, index) => {
    const from = segments.slice(0, index).reduce((sum, item) => sum + item.percent, 0);
    return `${segment.color} ${from}% ${from + segment.percent}%`;
  }).join(", ");
  return <GlassCard aria-label="Asset allocation" className={panelClass}>
    <h2 className={headingClass}>Asset allocation</h2><p className={`${metadataClass} mt-1`}>Latest recorded allocation in the selected period</p>
    {total > 0 ? <>
      <div className="relative mx-auto my-6 size-40 rounded-full" style={{ background: `conic-gradient(${gradient})` }} aria-hidden="true"><div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[var(--color-canvas)]"><span className="tnum text-xl font-medium text-[var(--color-ink)]">{assets.length}</span><span className={metadataClass}>assets</span></div></div>
      <ul aria-label="Asset balances" className="space-y-3">{segments.map(({ asset, value, color, percent }) => <li key={asset} className="flex min-w-0 items-center gap-2 text-xs leading-[18px]"><span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: color }} /><span className="font-medium text-[var(--color-ink)]">{asset}</span><span className="tnum ml-auto text-[var(--color-ink-secondary)]">{usd.format(value)}</span><span className="tnum w-10 shrink-0 text-right text-[var(--color-ink-muted)]">{percent.toFixed(1)}%</span></li>)}</ul>
      <p className={`${metadataClass} mt-5 border-t border-[var(--color-border)] pt-4`}>Source allocation may differ from the observed balance and operational wallet balances.</p>
    </> : <div className="flex min-h-[280px] flex-col items-center justify-center text-center"><p className="text-sm text-[var(--color-ink-secondary)]">No asset balances for this scope and date range.</p><ResetFilters onReset={onReset} /></div>}
  </GlassCard>;
}
