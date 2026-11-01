"use client";

import { useState } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { Asset } from "@/types/swapiz";
import { balanceFor, initialOrganization, money, organizationWallets, positiveAmountError, walletAssets, walletName, wallets } from "./flow-utils";
import { AmountField, AssetField, CommentField, FlowFrame, organizationSummary, OrganizationField, useCreateApproval, useFlow, WalletField } from "./FlowFrame";

export function TransferFlow() {
  const { state } = useSwapiz();
  const [organization, setOrganization] = useState(initialOrganization(state.scopeId));
  const [source, setSource] = useState(organizationWallets(organization)[0]?.id ?? "");
  const [destination, setDestination] = useState("");
  const [asset, setAsset] = useState<Asset>(walletAssets(source)[0] ?? "USDT");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const flow = useFlow();
  const createApproval = useCreateApproval();
  const sourceWallet = wallets.find(item => item.id === source);
  const destinationWallet = wallets.find(item => item.id === destination);
  const available = balanceFor(source, asset);
  const disabledIds = wallets.filter(item => item.id === source || item.network !== sourceWallet?.network).map(item => item.id);
  function changeSource(id: string) { setSource(id); setDestination(""); setAsset(walletAssets(id)[0] ?? "USDT"); }
  return <FlowFrame title="Internal transfer" description="Prepare a transfer between wallets on the same network." flow={flow}
    onReview={() => flow.review({ source: !sourceWallet ? "Choose a source wallet." : undefined, destination: !destinationWallet || disabledIds.includes(destination) ? "Choose a different wallet on the same network." : undefined, amount: positiveAmountError(amount, available) })}
    onConfirm={() => createApproval("transfer", organization, `Transfer ${money(Number(amount), asset)} · ${walletName(source)} → ${walletName(destination)}${comment ? ` · ${comment}` : ""}`, [{ amount: Number(amount), asset }])}
    summary={[organizationSummary(organization), ["Source wallet", walletName(source)], ["Destination wallet", walletName(destination)], ["Amount", money(Number(amount), asset)], ["Network", sourceWallet?.network], ["Comment", comment]]}>
    <OrganizationField value={organization} onChange={id => { setOrganization(id); changeSource(organizationWallets(id)[0]?.id ?? ""); }} />
    <WalletField label="Source wallet" value={source} options={organizationWallets(organization)} onChange={changeSource} error={flow.errors.source} />
    <WalletField label="Destination wallet" value={destination} options={wallets} onChange={setDestination} disabledIds={disabledIds} error={flow.errors.destination} />
    <p className="text-xs leading-[18px] text-[var(--color-ink-muted)]">Only a different wallet on {sourceWallet?.network || "the source network"} can receive this transfer.</p>
    <AssetField label="Currency" value={asset} options={walletAssets(source)} onChange={setAsset} />
    <AmountField value={amount} onChange={setAmount} error={flow.errors.amount} hint={`Available: ${money(available, asset)}`} />
    <CommentField value={comment} onChange={setComment} />
  </FlowFrame>;
}
