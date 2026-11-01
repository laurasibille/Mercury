"use client";

import { useState } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { Asset } from "@/types/swapiz";
import { addressValid, balanceFor, initialOrganization, money, networkAssets, organizationWallets, positiveAmountError, walletAssets, walletName, wallets } from "./flow-utils";
import { AmountField, AssetField, CommentField, controlClass, Field, FlowFrame, organizationSummary, OrganizationField, useCreateApproval, useFlow, WalletField } from "./FlowFrame";

export function SendFlow() {
  const { state } = useSwapiz();
  const [organization, setOrganization] = useState(initialOrganization(state.scopeId));
  const [walletId, setWalletId] = useState(organizationWallets(organization)[0]?.id ?? "");
  const [asset, setAsset] = useState<Asset>(walletAssets(walletId)[0] ?? "USDT");
  const [receiveAsset, setReceiveAsset] = useState<Asset>(asset);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const flow = useFlow();
  const createApproval = useCreateApproval();
  const wallet = wallets.find(item => item.id === walletId);
  const network = wallet?.network ?? "";
  const available = balanceFor(walletId, asset);
  function changeWallet(id: string) { setWalletId(id); const next = walletAssets(id)[0] ?? "USDT"; setAsset(next); setReceiveAsset(next); }
  return <FlowFrame title="Send" description="Prepare a payment to an external address for your approval team." flow={flow}
    onReview={() => flow.review({ wallet: !wallet ? "Choose a source wallet." : undefined, amount: positiveAmountError(amount, available), address: addressValid(address, network) ? undefined : `Enter a valid ${network || "network"} recipient address.` })}
    onConfirm={() => createApproval("send", organization, `Send ${money(Number(amount), asset)} → ${address.trim()} · ${receiveAsset} · ${network}${comment ? ` · ${comment}` : ""}`, [{ amount: Number(amount), asset }])}
    summary={[organizationSummary(organization), ["Source wallet", walletName(walletId)], ["Pay", money(Number(amount), asset)], ["Receive asset", receiveAsset], ["Network", network], ["Recipient address", address.trim()], ["Comment", comment]]}>
    <OrganizationField value={organization} onChange={id => { setOrganization(id); changeWallet(organizationWallets(id)[0]?.id ?? ""); }} />
    <WalletField label="Source wallet" value={walletId} options={organizationWallets(organization)} onChange={changeWallet} error={flow.errors.wallet} />
    <div className="grid gap-5 sm:grid-cols-2"><AssetField label="Pay asset" value={asset} options={walletAssets(walletId)} onChange={setAsset} /><AssetField label="Receive asset" value={receiveAsset} options={networkAssets(network)} onChange={setReceiveAsset} /></div>
    <Field label="Network" hint="The network is determined by the source wallet.">{props => <select {...props} className={controlClass} value={network} onChange={() => {}}><option value={network}>{network || "Choose a source wallet first"}</option></select>}</Field>
    <AmountField value={amount} onChange={setAmount} error={flow.errors.amount} hint={`Available: ${money(available, asset)}`} />
    <Field label="Recipient address" error={flow.errors.address} hint="Check the network carefully. Address format checks are demo-only.">{props => <input {...props} className={controlClass} value={address} onChange={event => setAddress(event.target.value)} autoComplete="off" spellCheck={false} />}</Field>
    <CommentField value={comment} onChange={setComment} />
  </FlowFrame>;
}
