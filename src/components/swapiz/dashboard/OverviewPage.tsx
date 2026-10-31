import { DashboardControls } from "./DashboardControls";

export function OverviewPage() {
  return <div className="mx-auto w-full max-w-[1600px] px-4 py-7 md:px-6 lg:px-8">
    <h1 className="mb-6 text-[28px] font-normal leading-9 tracking-[-0.02em] text-[var(--color-ink)]">Overview</h1>
    <DashboardControls />
  </div>;
}
