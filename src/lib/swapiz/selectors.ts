import { swapizDemoData } from "@/data/swapiz-demo";
import type { ApprovalAsset, DashboardSnapshot, DateRange, Organization, ScopeId, SwapizDemoData, Transaction } from "@/types/swapiz";

export function scopeOrganizationIds(scopeId: ScopeId, organizations: Organization[]): Organization["id"][] {
  const represented = organizations.filter(item => item.kind === "company" || organizations.some(parent => parent.kind === "company" && parent.id === item.parentId));
  if (scopeId === "all") return represented.map(item => item.id);
  if (!represented.some(item => item.id === scopeId)) return [];
  return represented.filter(item => item.id === scopeId || item.parentId === scopeId).map(item => item.id);
}

function scopedRecords<T extends { organizationId: Organization["id"]; date: string }>(items: T[], ids: Organization["id"][], range: DateRange): T[] {
  return items.filter(item => ids.includes(item.organizationId) && item.date >= range.from && item.date <= range.to);
}

export function filterTransactions(items: Transaction[], scopeId: ScopeId, range: DateRange): Transaction[] {
  return scopedRecords(items, scopeOrganizationIds(scopeId, swapizDemoData.organizations), range);
}

function latestRecords<T extends { date: string }>(items: T[], key: (item: T) => string): T[] {
  const latest = new Map<string, T>();
  for (const item of items) {
    const previous = latest.get(key(item));
    if (!previous || item.date > previous.date) latest.set(key(item), item);
  }
  return [...latest.values()];
}

export function selectDashboardSnapshot(data: SwapizDemoData, scopeId: ScopeId, range: DateRange): DashboardSnapshot {
  const ids = scopeOrganizationIds(scopeId, data.organizations);
  const observations = scopedRecords(data.observations, ids, range).sort((a, b) => a.date.localeCompare(b.date));
  const transactions = scopedRecords(data.transactions, ids, range);
  const approvals = scopedRecords(data.approvals, ids, range).filter(item => !item.resolved);
  const alerts = scopedRecords(data.alerts, ids, range).filter(item => !item.resolved);
  const obligations = scopedRecords(data.obligations, ids, range);
  const requestedTotals = new Map<ApprovalAsset, number>();
  for (const approval of approvals) {
    for (const requested of approval.requestedAmounts ?? []) {
      if (!Number.isFinite(requested.amount) || requested.amount <= 0) continue;
      requestedTotals.set(requested.asset, (requestedTotals.get(requested.asset) ?? 0) + requested.amount);
    }
  }
  const assetBalances = latestRecords(scopedRecords(data.assetBalances, ids, range), item => `${item.organizationId}:${item.asset}:${item.network}`);
  const totalBalance = latestRecords(observations, item => item.organizationId).reduce((sum, item) => sum + item.usd, 0);
  const unresolvedFrozenUsd = alerts.reduce((sum, item) => sum + (item.frozenUsd ?? 0), 0);
  const unresolvedPendingOutboundUsd = transactions.filter(item => (item.type === "send" || item.type === "transfer" || item.type === "mass-pay") && (item.status === "pending" || item.status === "processing")).reduce((sum, item) => sum + Math.abs(item.usdValue), 0);
  const inflow = observations.reduce((sum, item) => sum + item.inflow, 0);
  const outflow = observations.reduce((sum, item) => sum + item.outflow, 0);
  return {
    totalBalance,
    availableToMove: Math.max(0, totalBalance - unresolvedFrozenUsd - unresolvedPendingOutboundUsd),
    inflow, outflow, netFlow: inflow - outflow,
    upcomingObligations: obligations.reduce((sum, item) => sum + item.usd, 0),
    pendingApprovalCount: approvals.length,
    pendingApprovalTotalEur: approvals.reduce((sum, item) => sum + (item.amountEur ?? 0) + (item.requestedAmounts ?? []).filter(amount => amount.asset === "EUR" && Number.isFinite(amount.amount) && amount.amount > 0).reduce((total, amount) => total + amount.amount, 0), 0),
    pendingApprovalRequestedTotals: [...requestedTotals].map(([asset, amount]) => ({ asset, amount })),
    attentionCount: alerts.length,
    unresolvedFrozenUsd, unresolvedPendingOutboundUsd,
    observations, assetBalances, approvals, alerts, transactions, obligations,
  };
}
