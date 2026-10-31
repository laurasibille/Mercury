export type ScopeId = "all" | "amazon" | "openai" | "hooli" | "marketing" | "development" | "operations" | "support";
export type DatePreset = "today" | "last-7-days" | "last-30-days" | "this-month" | "last-90-days" | "this-year" | "custom";
export type MoveOperation = "send" | "receive" | "transfer" | "swap" | "mass-pay" | "payment-link";
export type TransactionType = "send" | "receive" | "transfer" | "swap" | "mass-pay";
export type TransactionStatus = "processing" | "completed" | "failed" | "pending" | "quarantine";
export type Severity = "critical" | "warning" | "ok";
export type Asset = "USDT" | "USDC" | "ETH" | "BTC" | "SOL" | "TRX" | "XRP";
export type OrganizationId = Exclude<ScopeId, "all">;

export interface DateRange { preset: DatePreset; from: string; to: string; label: string }
export interface Organization { id: OrganizationId; name: string; kind: "company" | "department"; parentId?: "amazon" | "openai" | "hooli"; status?: string; displayId?: string }
export interface BalanceObservation { date: string; organizationId: Organization["id"]; usd: number; inflow: number; outflow: number }
export interface AssetBalance { date: string; organizationId: Organization["id"]; asset: Asset; network: string; usd: number }
export interface Approval { id: string; date: string; organizationId: Organization["id"]; type: string; title: string; amountEur?: number; initiator: string; approvals: number; requiredApprovals: number; resolved: boolean }
export interface Alert { id: string; date: string; organizationId: Organization["id"]; severity: Severity; title: string; detail: string; amount?: string; action: string; resolved: boolean; frozenUsd?: number; wallet?: string; check?: string }
export interface Transaction { id: string; date: string; time: string; organizationId: Organization["id"]; type: TransactionType; amountLabel: string; usdValue: number; asset: string; network: string; wallet: string; source: string; status: TransactionStatus; address?: string }
export interface Obligation { id: string; date: string; organizationId: Organization["id"]; kind: "payroll" | "supplier" | "batch"; label: string; usd: number }
export type WalletType = "Master" | "Sub Master" | "Company wallet (cold)" | "Fee wallet" | "Exchange" | "Client wallet" | "Mid Master" | "Mid Send";
export interface Wallet { id: string; date: string; organizationId: OrganizationId; type: WalletType; name: string; network: string; address: string; cold: boolean; autoSweep: boolean }
export interface WalletBalance { id: string; date: string; organizationId: OrganizationId; walletId: string; asset: Asset; amount: number; usd: number }
export interface MoneyFlowRule { id: string; date: string; organizationId: OrganizationId; kind: "receive" | "exchange"; name: string; source: string; target: string; status: "active" | "pending" | "rejected" | "draft"; sharePercent?: number; minimum?: string; maximum?: string; approvedBy?: string; trigger?: string; action?: string; amount?: string }
export type RoleId = "owner" | "admin" | "finance" | "compliance" | "viewer";
export interface Role { id: RoleId; name: string; description: string; system: boolean; permissions: string[] }
export interface User { id: string; date: string; name: string; email: string; initials: string; roleId: RoleId; scopeIds: ScopeId[]; limitEur: number | null; twoFactorEnabled: boolean; invitationStatus: "active" | "pending"; lastActivity: string }
export interface SwapizDemoData { organizations: Organization[]; wallets: Wallet[]; walletBalances: WalletBalance[]; moneyFlowRules: MoneyFlowRule[]; observations: BalanceObservation[]; assetBalances: AssetBalance[]; approvals: Approval[]; alerts: Alert[]; transactions: Transaction[]; obligations: Obligation[]; users: User[]; roles: Role[] }
export interface DashboardSnapshot { totalBalance: number; availableToMove: number; netFlow: number; inflow: number; outflow: number; upcomingObligations: number; pendingApprovalCount: number; pendingApprovalTotalEur: number; attentionCount: number; unresolvedFrozenUsd: number; unresolvedPendingOutboundUsd: number; observations: BalanceObservation[]; assetBalances: AssetBalance[]; approvals: Approval[]; alerts: Alert[]; transactions: Transaction[]; obligations: Obligation[] }
