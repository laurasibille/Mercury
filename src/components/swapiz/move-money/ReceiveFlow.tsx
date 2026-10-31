"use client";

import { useState } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { Asset } from "@/types/swapiz";
import { initialOrganization, money, networkAssets, newDemoId, organizationWallets, positiveAmountError, prices, walletName, wallets } from "./flow-utils";
import { AmountField, AssetField, CommentField, FlowFrame, organizationSummary, OrganizationField, useFlow, WalletField } from "./FlowFrame";

export function ReceiveFlow() {
  const { state, dispatch } = useSwapiz();
  const [organization, setOrganization] = useState(initialOrganization(state.scopeId));
  const [walletId, setWalletId] = useState(organizationWallets(organization)[0]?.id ?? "");
  const [asset, setAsset] = useState<Asset>("USDT");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [midMaster, setMidMaster] = useState(false);
  const flow = useFlow();
  const wallet = wallets.find(item => item.id === walletId);
  function changeWallet(id: string) { setWalletId(id); setAsset(networkAssets(wallets.find(item => item.id === id)?.network ?? "")[0] ?? "USDT"); }
  return <FlowFrame title="Receive" description="Create a demo request for funds to arrive in a company wallet." flow={flow} confirmLabel="Create demo request"
    onReview={() => flow.review({ wallet: !wallet ? "Choose a destination wallet." : undefined, amount: positiveAmountError(amount) })}
    onConfirm={() => { if (!wallet) return; const now = new Date(); dispatch({ type: "transaction/added", transaction: { id: newDemoId(), date: now.toISOString().slice(0, 10), time: now.toISOString().slice(11, 16), organizationId: organization, type: "receive", amountLabel: money(Number(amount), asset), usdValue: Number(amount) * prices[asset], asset, network: wallet.network, wallet: wallet.name, source: `Demo receive request${midMaster ? " · Mid Master AML path" : ""}${comment ? ` · ${comment}` : ""}`, status: "pending", address: wallet.address } }); }}
    summary={[organizationSummary(organization), ["Destination wallet", walletName(walletId)], ["Requested amount", money(Number(amount), asset)], ["Routing", midMaster ? "Mid Master → AML review → destination wallet (demo)" : "Direct to destination wallet"], ["Comment", comment]]}
    confirmation={<div className="space-y-2 text-sm"><p>Demo request address · {wallet?.network}</p><output aria-label="Request address" className="block break-all rounded-lg bg-[var(--color-surface)] p-3 font-mono text-xs">{wallet?.address}</output><p className="text-xs text-[var(--color-ink-muted)]">No new blockchain address was generated. This request uses the selected demo wallet.</p></div>}>
    <OrganizationField value={organization} onChange={id => { setOrganization(id); changeWallet(organizationWallets(id)[0]?.id ?? ""); }} />
    <WalletField label="Destination wallet" value={walletId} options={organizationWallets(organization)} onChange={changeWallet} error={flow.errors.wallet} />
    <AssetField label="Currency" value={asset} options={networkAssets(wallet?.network ?? "")} onChange={setAsset} />
    <AmountField value={amount} onChange={setAmount} error={flow.errors.amount} />
    <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-4"><label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 size-4 accent-[var(--color-primary)]" checked={midMaster} onChange={event => setMidMaster(event.target.checked)} />Use Mid Master AML path</label>{midMaster && <p className="text-xs leading-[18px] text-[var(--color-ink-muted)]">Mid Master → AML review → destination wallet. This is a demo routing preference; no AML screening is performed.</p>}</div>
    <CommentField value={comment} onChange={setComment} />
  </FlowFrame>;
}
