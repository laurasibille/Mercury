import { describe, expect, it } from "vitest";
import { initialSwapizState, swapizReducer } from "./reducer";
import type { ScopeId } from "@/types/swapiz";

describe("shared dashboard state", () => {
  it("changes movement steps only while open and preserves filters", () => {
    const state = { ...initialSwapizState, scopeId: "marketing" as const };
    expect(swapizReducer(state, { type: "move/choose", operation: "swap" })).toBe(state);
    const open = swapizReducer(state, { type: "move/open", operation: "send" });
    const choose = swapizReducer(open, { type: "move/choose", operation: null });
    expect(choose.moveMoney).toEqual({ open: true, operation: null });
    expect(choose.scopeId).toBe("marketing");
  });

  it("adds a demo approval once and rejects unknown organizations", () => {
    const approval = { ...initialSwapizState.approvals[0], id: "demo-approval" };
    const next = swapizReducer(initialSwapizState, { type: "approval/added", approval });
    expect(next.approvals[0].id).toBe("demo-approval");
    expect(initialSwapizState.approvals).toHaveLength(7);
    expect(swapizReducer(next, { type: "approval/added", approval })).toBe(next);
    expect(swapizReducer(next, { type: "approval/added", approval: { ...approval, id: "invalid", organizationId: "all" as never } })).toBe(next);
  });
  it("changes scope and resets an invalid scope to all", () => {
    const scoped = swapizReducer(initialSwapizState, { type: "scope/changed", scopeId: "marketing" });
    expect(scoped.scopeId).toBe("marketing");
    expect(swapizReducer(scoped, { type: "scope/changed", scopeId: "missing" as ScopeId }).scopeId).toBe("all");
  });

  it("changes dates and resets invalid ranges to the demo default", () => {
    const range = { preset: "custom" as const, from: "2026-10-01", to: "2026-10-20", label: "October" };
    const changed = swapizReducer(initialSwapizState, { type: "date/changed", dateRange: range });
    expect(changed.dateRange).toEqual(range);
    expect(swapizReducer(changed, { type: "date/changed", dateRange: { ...range, from: "2026-10-25" } }).dateRange).toEqual({ preset: "last-30-days", from: "2026-10-02", to: "2026-10-31", label: "Last 30 days" });
  });

  it("closing move money retains dashboard filters", () => {
    const open = swapizReducer({ ...initialSwapizState, scopeId: "marketing" }, { type: "move/open", operation: "send" });
    expect(open.moveMoney).toEqual({ open: true, operation: "send" });
    const closed = swapizReducer(open, { type: "move/close" });
    expect(closed.scopeId).toBe("marketing");
    expect(closed.moveMoney).toEqual({ open: false, operation: null });
  });

  it("opens the operation picker without selecting an operation", () => {
    expect(swapizReducer(initialSwapizState, { type: "move/open", operation: null }).moveMoney).toEqual({ open: true, operation: null });
  });

  it("resolving an alert reduces the unresolved count without mutating demo state", () => {
    const next = swapizReducer(initialSwapizState, { type: "alert/resolved", alertId: "n1" });
    expect(next.alerts.find(item => item.id === "n1")?.resolved).toBe(true);
    expect(next.alerts.filter(item => !item.resolved)).toHaveLength(6);
    expect(initialSwapizState.alerts.find(item => item.id === "n1")?.resolved).toBe(false);
  });

  it("resolves an approval and safely ignores unknown approval or alert identifiers", () => {
    const approvalId = initialSwapizState.approvals[0].id;
    const next = swapizReducer(initialSwapizState, { type: "approval/resolved", approvalId });
    expect(next.approvals[0].resolved).toBe(true);
    expect(initialSwapizState.approvals[0].resolved).toBe(false);
    expect(swapizReducer(next, { type: "approval/resolved", approvalId: "missing" })).toBe(next);
    expect(swapizReducer(next, { type: "alert/resolved", alertId: "missing" })).toBe(next);
  });

  it("changes theme without changing filters", () => {
    const next = swapizReducer(initialSwapizState, { type: "theme/changed", theme: "dark" });
    expect(next.theme).toBe("dark");
    expect(next.scopeId).toBe("all");
  });

  it("adds a transaction once and ignores unknown organizations", () => {
    const transaction = { ...initialSwapizState.transactions[0], id: "demo-new" };
    const next = swapizReducer(initialSwapizState, { type: "transaction/added", transaction });
    expect(next.transactions[0].id).toBe("demo-new");
    expect(swapizReducer(next, { type: "transaction/added", transaction })).toBe(next);
    expect(swapizReducer(next, { type: "transaction/added", transaction: { ...transaction, id: "invalid", organizationId: "missing" as Exclude<ScopeId, "all"> } })).toBe(next);
  });

  it("keeps settings, user, and role demo edits in the shared session state", () => {
    const updated = swapizReducer(initialSwapizState, {
      type: "settings/updated",
      settings: { companyName: "Northstar" },
    });
    expect(updated.settings.companyName).toBe("Northstar");
    expect(updated.users.find(person => person.id === "user-3")?.scopeIds).toEqual(["amazon", "marketing", "development"]);

    const user = updated.users.find(person => person.id === "user-3")!;
    const withUserEdit = swapizReducer(updated, {
      type: "user/updated",
      user: { ...user, scopeIds: [...user.scopeIds, "operations"] },
    });
    expect(withUserEdit.users.find(person => person.id === "user-3")?.scopeIds).toEqual(["amazon", "marketing", "development", "operations"]);
    expect(initialSwapizState.users.find(person => person.id === "user-3")?.scopeIds).toEqual(["amazon", "marketing", "development"]);

    const finance = withUserEdit.roles.find(role => role.id === "finance")!;
    const withRoleEdit = swapizReducer(withUserEdit, {
      type: "role/permission-toggled",
      roleId: "finance",
      permission: "Approve money flow rules",
      enabled: true,
    });
    expect(withRoleEdit.roles.find(role => role.id === "finance")?.permissions).toContain("Approve money flow rules");
    expect(withRoleEdit.roles.find(role => role.id === "finance")).not.toBe(finance);
  });
});
