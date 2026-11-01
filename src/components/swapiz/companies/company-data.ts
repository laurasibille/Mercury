import { swapizDemoData } from "@/data/swapiz-demo";
import { scopeOrganizationIds } from "@/lib/swapiz/selectors";
import type { OrganizationId, WalletBalance } from "@/types/swapiz";

export const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const tokens = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });
export const controlClass = "min-h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]";
export const panelClass = "min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]";
export const mutedClass = "text-xs leading-[18px] text-[var(--color-ink-muted)]";

export function companyRecords(companyId: OrganizationId) {
  const ids = scopeOrganizationIds(companyId, swapizDemoData.organizations);
  const wallets = swapizDemoData.wallets.filter(item => ids.includes(item.organizationId));
  const latest = new Map<string, WalletBalance>();
  for (const item of swapizDemoData.walletBalances.filter(item => wallets.some(wallet => wallet.id === item.walletId))) {
    const key = `${item.walletId}:${item.asset}`;
    if (!latest.has(key) || latest.get(key)!.date < item.date) latest.set(key, item);
  }
  const balances = [...latest.values()];
  return {
    ids, wallets, balances,
    total: balances.reduce((sum, item) => sum + item.usd, 0),
    departments: swapizDemoData.organizations.filter(item => item.kind === "department" && item.parentId === companyId),
    rules: swapizDemoData.moneyFlowRules.filter(item => ids.includes(item.organizationId)),
  };
}
