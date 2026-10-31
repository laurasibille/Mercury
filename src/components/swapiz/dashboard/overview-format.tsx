import { swapizDemoData } from "@/data/swapiz-demo";

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const eur = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const compactUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
export const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const fullDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const organizationName = (id: string) => swapizDemoData.organizations.find(item => item.id === id)?.name ?? id;
export const chartColors = ["var(--color-primary)", "#239b83", "#a179d3", "#bb7e32", "#db7093", "#448fc4", "#768599"];
export const panelClass = "min-w-0 p-5 sm:p-6";
export const headingClass = "text-base font-medium leading-6 text-[var(--color-ink)]";
export const metadataClass = "text-xs leading-[18px] text-[var(--color-ink-muted)]";
export const linkClass = "text-xs font-medium leading-[18px] text-[var(--color-primary)] hover:underline";

export function ResetFilters({ onReset }: { onReset: () => void }) {
  return <button type="button" onClick={onReset} className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2 text-sm leading-5 text-[var(--color-ink)] hover:bg-[var(--color-surface)]">Reset filters</button>;
}
