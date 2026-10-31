import { swapizDemoData } from "@/data/swapiz-demo";
import type { Asset, OrganizationId, ScopeId } from "@/types/swapiz";

export const organizations = swapizDemoData.organizations;
export const wallets = swapizDemoData.wallets;
export const networks = [...new Set(wallets.map(wallet => wallet.network))];
export const assets: Asset[] = ["USDT", "USDC", "ETH", "BTC", "SOL", "TRX", "XRP"];
export const prices: Record<Asset, number> = { USDT: 1, USDC: 1, ETH: 2500, BTC: 65000, SOL: 150, TRX: 0.25, XRP: 0.5 };
export const organizationName = (id: string) => organizations.find(item => item.id === id)?.name ?? id;
export const walletName = (id: string) => { const wallet = wallets.find(item => item.id === id); return wallet ? `${wallet.name} · ${wallet.network}` : "No wallet available"; };
export const initialOrganization = (scope: ScopeId): OrganizationId => scope === "all" ? "amazon" : scope;
export const organizationWallets = (id: string) => wallets.filter(wallet => wallet.organizationId === id);
export const networkAssets = (network: string): Asset[] => {
  if (network.startsWith("TRON")) return ["USDT", "USDC", "TRX"];
  if (network.startsWith("Ethereum")) return ["USDT", "USDC", "ETH"];
  if (network.startsWith("Solana")) return ["USDT", "USDC", "SOL"];
  return network === "Bitcoin" ? ["BTC"] : [];
};
export const walletAssets = (id: string) => swapizDemoData.walletBalances.filter(balance => balance.walletId === id && balance.amount > 0).map(balance => balance.asset);
export const balanceFor = (id: string, asset: string) => swapizDemoData.walletBalances.find(balance => balance.walletId === id && balance.asset === asset)?.amount ?? 0;
export const money = (amount: number, asset: string) => `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${asset}`;
export const newDemoId = () => `demo-${crypto.randomUUID()}`;
export const positiveAmountError = (amount: string, balance?: number) => !Number.isFinite(Number(amount)) || Number(amount) <= 0 ? "Enter an amount greater than zero." : balance !== undefined && Number(amount) > balance ? "Amount exceeds the available demo wallet balance." : undefined;

// Structural validation only: this demo does not perform blockchain or AML checks.
export function addressValid(address: string, network: string) {
  if (network.startsWith("TRON")) return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim());
  if (network.startsWith("Ethereum")) return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  if (network.startsWith("Solana")) return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
  if (network === "Bitcoin") return /^(bc1[a-z0-9]{25,87}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/.test(address.trim());
  return false;
}
