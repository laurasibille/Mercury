import { swapizDemoData } from "@/data/swapiz-demo";
import { getPresetRange, validateDateRange } from "@/lib/swapiz/date-range";
import type { Alert, Approval, DateRange, MoveOperation, Role, RoleId, ScopeId, Transaction, User } from "@/types/swapiz";

export interface WorkspaceSettings {
  language: string;
  currency: string;
  timezone: string;
  companyName: string;
  approverThreshold: string;
  twoFactor: boolean;
  emailAlerts: boolean;
  telegramAlerts: boolean;
}

export interface SwapizState {
  scopeId: ScopeId;
  dateRange: DateRange;
  theme: "light" | "dark" | "system";
  moveMoney: { open: boolean; operation: MoveOperation | null };
  alerts: Alert[];
  approvals: Approval[];
  transactions: Transaction[];
  settings: WorkspaceSettings;
  users: User[];
  roles: Role[];
}

export type SwapizAction =
  | { type: "scope/changed"; scopeId: ScopeId }
  | { type: "date/changed"; dateRange: DateRange }
  | { type: "theme/changed"; theme: SwapizState["theme"] }
  | { type: "move/open"; operation: MoveOperation | null }
  | { type: "move/choose"; operation: MoveOperation | null }
  | { type: "move/close" }
  | { type: "alert/resolved"; alertId: string }
  | { type: "approval/resolved"; approvalId: string }
  | { type: "approval/added"; approval: Approval }
  | { type: "transaction/added"; transaction: Transaction }
  | { type: "settings/updated"; settings: Partial<WorkspaceSettings> }
  | { type: "user/added"; user: User }
  | { type: "user/updated"; user: User }
  | { type: "user/deleted"; userId: string }
  | { type: "role/permission-toggled"; roleId: RoleId; permission: string; enabled: boolean };

export const initialSwapizState: SwapizState = {
  scopeId: "all",
  dateRange: getPresetRange("last-30-days"),
  theme: "system",
  moveMoney: { open: false, operation: null },
  alerts: swapizDemoData.alerts,
  approvals: swapizDemoData.approvals,
  transactions: swapizDemoData.transactions,
  settings: {
    language: "en",
    currency: "EUR",
    timezone: "Europe/Nicosia",
    companyName: "Starclick",
    approverThreshold: "5000",
    twoFactor: true,
    emailAlerts: true,
    telegramAlerts: false,
  },
  users: swapizDemoData.users.map(user => ({ ...user, scopeIds: [...user.scopeIds] })),
  roles: swapizDemoData.roles.map(role => ({ ...role, permissions: [...role.permissions] })),
};

const ownerOnlyPermissions = new Set(["View fee settings", "Change fees", "Fee income & Sweep"]);

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
    case "move/choose":
      return state.moveMoney.open ? { ...state, moveMoney: { open: true, operation: action.operation } } : state;
    case "alert/resolved":
      if (!state.alerts.some(item => item.id === action.alertId && !item.resolved)) return state;
      return { ...state, alerts: state.alerts.map(item => item.id === action.alertId ? { ...item, resolved: true } : item) };
    case "approval/resolved":
      if (!state.approvals.some(item => item.id === action.approvalId && !item.resolved)) return state;
      return { ...state, approvals: state.approvals.map(item => item.id === action.approvalId ? { ...item, resolved: true } : item) };
    case "approval/added":
      if (!swapizDemoData.organizations.some(item => item.id === action.approval.organizationId) || state.approvals.some(item => item.id === action.approval.id)) return state;
      return { ...state, approvals: [action.approval, ...state.approvals] };
    case "transaction/added":
      if (!validScope(action.transaction.organizationId) || state.transactions.some(item => item.id === action.transaction.id)) return state;
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case "settings/updated":
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case "user/added":
      if (state.users.some(user => user.id === action.user.id)) return state;
      return { ...state, users: [...state.users, { ...action.user, scopeIds: [...action.user.scopeIds] }] };
    case "user/updated":
      if (!state.users.some(user => user.id === action.user.id)) return state;
      return { ...state, users: state.users.map(user => user.id === action.user.id ? { ...action.user, scopeIds: [...action.user.scopeIds] } : user) };
    case "user/deleted":
      if (!state.users.some(user => user.id === action.userId)) return state;
      return { ...state, users: state.users.filter(user => user.id !== action.userId) };
    case "role/permission-toggled":
      if (action.roleId !== "owner" && ownerOnlyPermissions.has(action.permission)) return state;
      if (!state.roles.some(role => role.id === action.roleId)) return state;
      return { ...state, roles: state.roles.map(role => {
        if (role.id !== action.roleId) return role;
        const permissions = new Set(role.permissions);
        if (action.enabled) permissions.add(action.permission);
        else permissions.delete(action.permission);
        return { ...role, permissions: [...permissions] };
      }) };
  }
}
