import { describe, expect, it } from "vitest";
import type { DateRange, SwapizDemoData, Transaction } from "@/types/swapiz";
import { swapizDemoData } from "@/data/swapiz-demo";
import { filterTransactions, scopeOrganizationIds, selectDashboardSnapshot } from "./selectors";

const range: DateRange = { preset: "custom", from: "2026-10-01", to: "2026-10-31", label: "October" };
const tx = (id: string, organizationId: Transaction["organizationId"], date = "2026-10-31", status: Transaction["status"] = "completed"): Transaction => ({ id, organizationId, date, status, time: "12:00", type: "send", amountLabel: "30,000 USDT", usdValue: 30_000, asset: "USDT", network: "TRON", wallet: "Master", source: "payout" });
const fixture: SwapizDemoData = {
  organizations: [{ id: "amazon", name: "Amazon", kind: "company" }, { id: "marketing", name: "Marketing", kind: "department", parentId: "amazon" }, { id: "openai", name: "OpenAI", kind: "company" }],
  wallets: [], walletBalances: [], moneyFlowRules: [], users: [], roles: [],
  observations: [
    { organizationId: "marketing", date: "2026-09-30", usd: 900_000, inflow: 999_000, outflow: 0 },
    { organizationId: "marketing", date: "2026-10-01", usd: 180_000, inflow: 10_000, outflow: 5_000 },
    { organizationId: "marketing", date: "2026-10-31", usd: 200_000, inflow: 30_000, outflow: 10_000 },
    { organizationId: "amazon", date: "2026-10-31", usd: 100_000, inflow: 0, outflow: 0 },
    { organizationId: "openai", date: "2026-10-31", usd: 500_000, inflow: 99_000, outflow: 0 },
  ],
  assetBalances: [{ date: "2026-10-31", organizationId: "marketing", asset: "USDT", network: "TRON", usd: 200_000 }, { date: "2026-09-30", organizationId: "marketing", asset: "USDT", network: "TRON", usd: 900_000 }],
  transactions: [tx("amazon-1", "amazon"), tx("marketing-1", "marketing", "2026-10-01", "pending"), tx("openai-1", "openai"), tx("old", "marketing", "2026-09-30", "pending")],
  approvals: [{ id: "a1", date: "2026-10-31", organizationId: "marketing", type: "Payout", title: "Payout", amountEur: 100, initiator: "Kramer", approvals: 0, requiredApprovals: 2, resolved: false }, { id: "a2", date: "2026-09-30", organizationId: "marketing", type: "Payout", title: "Old payout", initiator: "Kramer", approvals: 0, requiredApprovals: 1, resolved: false }],
  alerts: [{ id: "n1", date: "2026-10-31", organizationId: "marketing", severity: "critical", title: "Frozen", detail: "Review", action: "Review", frozenUsd: 20_000, resolved: false }, { id: "n2", date: "2026-10-31", organizationId: "marketing", severity: "warning", title: "Resolved", detail: "Done", action: "View", frozenUsd: 90_000, resolved: true }],
  obligations: [{ id: "o1", date: "2026-10-31", organizationId: "marketing", kind: "payroll", label: "Payroll", usd: 40_000 }, { id: "o2", date: "2026-11-01", organizationId: "marketing", kind: "supplier", label: "Future", usd: 90_000 }],
};

describe("dashboard selectors", () => {
  it("includes department records when Amazon is selected", () => {
    expect(filterTransactions(fixture.transactions, "amazon", range).map(item => item.id)).toEqual(["amazon-1", "marketing-1"]);
  });
  it("filters every dashboard metric by the same scope and range", () => {
    const snapshot = selectDashboardSnapshot(fixture, "marketing", range);
    expect(snapshot.totalBalance).toBe(200_000);
    expect(snapshot.availableToMove).toBe(150_000);
    expect(snapshot.netFlow).toBe(25_000);
    expect(snapshot.upcomingObligations).toBe(40_000);
    expect(snapshot.pendingApprovalCount).toBe(1);
    expect(snapshot.pendingApprovalTotalEur).toBe(100);
    expect(snapshot.pendingApprovalRequestedTotals).toEqual([]);
    expect(snapshot.attentionCount).toBe(1);
    expect(snapshot.assetBalances.map(item => item.usd)).toEqual([200_000]);
    expect(snapshot.transactions.every(item => item.organizationId === "marketing")).toBe(true);
  });
  it("totals structured requests by asset while preserving EUR totals and skipping invalid amounts", () => {
    const data = { ...fixture, approvals: [
      { ...fixture.approvals[0], requestedAmounts: [{ amount: 25, asset: "EUR" as const }, { amount: 100, asset: "USDT" as const }, { amount: 2, asset: "ETH" as const }, { amount: 0, asset: "BTC" as const }, { amount: Number.NaN, asset: "SOL" as const }] },
      { ...fixture.approvals[0], id: "a3", requestedAmounts: [{ amount: 50, asset: "USDT" as const }] },
    ] };
    const snapshot = selectDashboardSnapshot(data, "marketing", range);
    expect(snapshot.pendingApprovalTotalEur).toBe(225);
    expect(snapshot.pendingApprovalRequestedTotals).toEqual([{ asset: "EUR", amount: 25 }, { asset: "USDT", amount: 150 }, { asset: "ETH", amount: 2 }]);
  });
  it("sums the latest balance per organization, independent of input order", () => {
    expect(selectDashboardSnapshot({ ...fixture, observations: [...fixture.observations].reverse() }, "all", range).totalBalance).toBe(800_000);
  });
  it("clamps unavailable funds to zero and clears reservations when resolved", () => {
    const data = { ...fixture, transactions: [tx("large", "marketing", "2026-10-31", "processing"), { ...tx("huge", "marketing", "2026-10-31", "pending"), usdValue: 300_000 }] };
    expect(selectDashboardSnapshot(data, "marketing", range).availableToMove).toBe(0);
    expect(selectDashboardSnapshot({ ...fixture, transactions: [], alerts: fixture.alerts.map(item => ({ ...item, resolved: true })) }, "marketing", range).availableToMove).toBe(200_000);
  });
  it("returns empty metrics for a range without records", () => {
    const snapshot = selectDashboardSnapshot(fixture, "all", { ...range, from: "2025-01-01", to: "2025-01-31" });
    expect([snapshot.totalBalance, snapshot.availableToMove, snapshot.netFlow, snapshot.pendingApprovalCount, snapshot.attentionCount, snapshot.upcomingObligations]).toEqual([0, 0, 0, 0, 0, 0]);
    expect(snapshot.transactions).toEqual([]);
  });
  it("does not include an orphan department in company or all scopes", () => {
    const organizations = fixture.organizations.filter(item => item.id !== "amazon");
    expect(scopeOrganizationIds("all", organizations)).toEqual(["openai"]);
    expect(scopeOrganizationIds("amazon", organizations)).toEqual([]);
  });
  it("provides a coherent normalized demo ledger for downstream screens", () => {
    const ids = new Set(swapizDemoData.organizations.map(item => item.id));
    for (const rows of [swapizDemoData.wallets, swapizDemoData.walletBalances, swapizDemoData.moneyFlowRules, swapizDemoData.observations, swapizDemoData.assetBalances, swapizDemoData.approvals, swapizDemoData.alerts, swapizDemoData.transactions, swapizDemoData.obligations]) {
      expect(rows.every(item => ids.has(item.organizationId) && /^\d{4}-\d{2}-\d{2}$/.test(item.date))).toBe(true);
    }
    expect(swapizDemoData.approvals).toHaveLength(7);
    expect(swapizDemoData.alerts).toHaveLength(7);
    expect(swapizDemoData.transactions).toHaveLength(12);
    expect(swapizDemoData.walletBalances.every(balance => swapizDemoData.wallets.some(wallet => wallet.id === balance.walletId && wallet.organizationId === balance.organizationId))).toBe(true);
    expect(swapizDemoData.roles.filter(role => role.id !== "owner").every(role => !role.permissions.includes("Fee income & Sweep"))).toBe(true);
  });
});
