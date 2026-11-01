"use client";

import { useState } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { Asset } from "@/types/swapiz";
import { balanceFor, initialOrganization, money, networkAssets, organizationWallets, positiveAmountError, prices, walletAssets, walletName, wallets } from "./flow-utils";
import { AmountField, AssetField, CommentField, controlClass, Field, FlowFrame, organizationSummary, OrganizationField, useCreateApproval, useFlow, WalletField } from "./FlowFrame";

export function SwapFlow() {
  const { state } = useSwapiz();
  const [organization, setOrganization] = useState(initialOrganization(state.scopeId));
  const [walletId, setWalletId] = useState(organizationWallets(organization)[0]?.id ?? "");
  const [pay, setPay] = useState<Asset>(walletAssets(walletId)[0] ?? "USDT");
  const [receive, setReceive] = useState<Asset>("USDC");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const flow = useFlow();
  const createApproval = useCreateApproval();
  const wallet = wallets.find(item => item.id === walletId);
  const supported = networkAssets(wallet?.network ?? "");
  const available = balanceFor(walletId, pay);
  const quote = Number(amount || 0) * prices[pay] / prices[receive] * 0.995;
  function changeWallet(id: string) { setWalletId(id); const first = walletAssets(id)[0] ?? "USDT"; setPay(first); setReceive(networkAssets(wallets.find(item => item.id === id)?.network ?? "").find(item => item !== first) ?? first); }
  return <FlowFrame title="Swap" description="Preview an illustrative exchange quote before requesting approval." flow={flow}
    onReview={() => flow.review({ wallet: !wallet ? "Choose a wallet." : undefined, amount: positiveAmountError(amount, available), quote: pay === receive || !supported.includes(receive) ? "Choose two different assets supported on this network." : undefined })}
    onConfirm={() => createApproval("swap", organization, `Swap ${money(Number(amount), pay)} → ${money(quote, receive)} · ${walletName(walletId)}${comment ? ` · ${comment}` : ""}`, [{ amount: Number(amount), asset: pay }])}
    summary={[organizationSummary(organization), ["Wallet", walletName(walletId)], ["Pay", money(Number(amount), pay)], ["Estimated receive", money(quote, receive)], ["Demo fee", "0.5% included in quote"], ["Comment", comment]]}>
    <OrganizationField value={organization} onChange={id => { setOrganization(id); changeWallet(organizationWallets(id)[0]?.id ?? ""); }} />
    <WalletField label="Wallet" value={walletId} options={organizationWallets(organization)} onChange={changeWallet} error={flow.errors.wallet} />
    <Field label="Network" hint="The network is determined by the selected wallet.">{props => <select {...props} className={controlClass} value={wallet?.network ?? ""} onChange={() => {}}><option value={wallet?.network ?? ""}>{wallet?.network ?? "Choose a wallet first"}</option></select>}</Field>
    <div className="grid gap-5 sm:grid-cols-2"><AssetField label="Pay asset" value={pay} options={walletAssets(walletId)} onChange={asset => { setPay(asset); if (receive === asset) setReceive(supported.find(item => item !== asset) ?? asset); }} /><AssetField label="Receive asset" value={receive} options={supported.filter(item => item !== pay)} onChange={setReceive} error={flow.errors.quote} /></div>
    <AmountField label="Pay amount" value={amount} onChange={setAmount} error={flow.errors.amount} hint={`Available: ${money(available, pay)}`} />
    <div className="space-y-1 rounded-lg bg-[var(--swapiz-info-soft)] p-4 text-[var(--swapiz-info-ink)]"><p className="text-xs">Estimated receive</p><output aria-label="Demo quote" aria-live="polite" className="tnum block text-xl">{money(Number.isFinite(quote) ? quote : 0, receive)}</output><p className="text-xs leading-[18px]">Illustrative fixed rates · 0.5% demo fee included · not a live quote.</p>{flow.errors.quote && <p role="alert" className="text-xs">{flow.errors.quote}</p>}</div>
    <CommentField value={comment} onChange={setComment} />
  </FlowFrame>;
}
