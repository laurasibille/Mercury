"use client";

import { initialSwapizState } from "@/lib/swapiz/reducer";
import { useSwapiz } from "../providers/SwapizProvider";
import { DashboardControls } from "./DashboardControls";
import { KpiGrid } from "./KpiGrid";
import { BalanceTrend } from "./BalanceTrend";
import { AssetAllocation } from "./AssetAllocation";
import { FlowComparison } from "./FlowComparison";
import { AttentionQueue } from "./AttentionQueue";
import { RecentTransactions } from "./RecentTransactions";

export function OverviewPage() {
  const { snapshot, dispatch } = useSwapiz();
  const resetFilters = () => {
    dispatch({ type: "scope/changed", scopeId: "all" });
    dispatch({ type: "date/changed", dateRange: initialSwapizState.dateRange });
  };
  return <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 md:px-6 lg:px-8">
    <div><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em] text-[var(--color-ink)]">Overview</h1><p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Your treasury at a glance · Demo data</p></div>
    <DashboardControls />
    <KpiGrid snapshot={snapshot} />
    <div className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"><BalanceTrend snapshot={snapshot} onReset={resetFilters} /><AssetAllocation snapshot={snapshot} onReset={resetFilters} /></div>
    <div className="grid min-w-0 items-start gap-5 xl:grid-cols-2"><FlowComparison snapshot={snapshot} onReset={resetFilters} /><AttentionQueue snapshot={snapshot} onReset={resetFilters} /></div>
    <RecentTransactions snapshot={snapshot} onReset={resetFilters} />
  </div>;
}
