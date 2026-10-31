import { swapizDemoData } from "@/data/swapiz-demo";
import { getPresetRange, validateDateRange } from "@/lib/swapiz/date-range";
import type { Alert, Approval, DateRange, MoveOperation, ScopeId, Transaction } from "@/types/swapiz";

export interface SwapizState {
  scopeId: ScopeId;
  dateRange: DateRange;
  theme: "light" | "dark" | "system";
  moveMoney: { open: boolean; operation: MoveOperation | null };
  alerts: Alert[];
  approvals: Approval[];
  transactions: Transaction[];
}

export type SwapizAction =
  | { type: "scope/changed"; scopeId: ScopeId }
  | { type: "date/changed"; dateRange: DateRange }
  | { type: "theme/changed"; theme: SwapizState["theme"] }
  | { type: "move/open"; operation: MoveOperation | null }
  | { type: "move/close" }
  | { type: "alert/resolved"; alertId: string }
  | { type: "approval/resolved"; approvalId: string }
  | { type: "transaction/added"; transaction: Transaction };

export const initialSwapizState: SwapizState = {
  scopeId: "all",
  dateRange: getPresetRange("last-30-days", new Date("2026-10-31T12:00:00Z")),
  theme: "system",
  moveMoney: { open: false, operation: null },
  alerts: swapizDemoData.alerts,
  approvals: swapizDemoData.approvals,
  transactions: swapizDemoData.transactions,
};

const validScope = (scopeId: ScopeId) => scopeId === "all" || swapizDemoData.organizations.some(item => item.id === scopeId);

export function swapizReducer(state: SwapizState, action: SwapizAction): SwapizState {
  switch (action.type) {
    case "scope/changed":
      return { ...state, scopeId: validScope(action.scopeId) ? action.scopeId : "all" };
    case "date/changed":
      return { ...state, dateRange: validateDateRange(action.dateRange.from, action.dateRange.to).valid ? action.dateRange : initialSwapizState.dateRange };
    case "theme/changed":
      return { ...state, theme: action.theme };
    case "move/open":
      return { ...state, moveMoney: { open: true, operation: action.operation } };
    case "move/close":
      return { ...state, moveMoney: { open: false, operation: null } };
    case "alert/resolved":
      if (!state.alerts.some(item => item.id === action.alertId && !item.resolved)) return state;
      return { ...state, alerts: state.alerts.map(item => item.id === action.alertId ? { ...item, resolved: true } : item) };
    case "approval/resolved":
      if (!state.approvals.some(item => item.id === action.approvalId && !item.resolved)) return state;
      return { ...state, approvals: state.approvals.map(item => item.id === action.approvalId ? { ...item, resolved: true } : item) };
    case "transaction/added":
      if (!validScope(action.transaction.organizationId) || state.transactions.some(item => item.id === action.transaction.id)) return state;
      return { ...state, transactions: [action.transaction, ...state.transactions] };
  }
}
