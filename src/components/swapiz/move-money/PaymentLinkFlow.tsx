"use client";

import { useId, useState } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { Asset } from "@/types/swapiz";
import { initialOrganization, money, newDemoId, positiveAmountError } from "./flow-utils";
import { AmountField, AssetField, controlClass, Field, FlowFrame, organizationSummary, OrganizationField, useCreateApproval, useFlow } from "./FlowFrame";

export function PaymentLinkFlow() {
  const { state } = useSwapiz();
  const [organization, setOrganization] = useState(initialOrganization(state.scopeId));
  const [kind, setKind] = useState("Business");
  const [payer, setPayer] = useState("");
  const [invoice, setInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Asset>("USDT");
  const [expiration, setExpiration] = useState("7 days");
  const [appearance, setAppearance] = useState("Light");
  const [channels, setChannels] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const id = useId();
  const flow = useFlow();
  const createApproval = useCreateApproval();
  return <FlowFrame title="Payment Link" description="Prepare an invoice-style demo link with your preferred delivery channels." flow={flow} confirmLabel="Create demo link"
    onReview={() => flow.review({ payer: payer.trim() ? undefined : "Enter the payer name.", invoice: invoice.trim() ? undefined : "Enter an invoice title.", amount: positiveAmountError(amount), channels: channels.length ? undefined : "Choose at least one delivery channel." })}
    onConfirm={() => { const demoLink = `https://demo.swapiz.local/pay/${newDemoId()}`; setLink(demoLink); createApproval("payment-link", organization, `Payment Link · ${invoice.trim()} · ${money(Number(amount), currency)} · ${payer.trim()} · ${channels.join(", ")} · ${expiration} · ${appearance} · ${demoLink}`, [{ amount: Number(amount), asset: currency }]); }}
    summary={[["Payer type", kind], ["Payer name", payer.trim()], ["Invoice title", invoice.trim()], ["Amount", money(Number(amount), currency)], ["Expiration", expiration], organizationSummary(organization), ["Delivery channels", channels.join(", ")], ["Appearance", appearance]]}
    confirmation={<div className="space-y-3"><output aria-label="Demo payment link" className="block break-all rounded-lg bg-[var(--color-surface)] p-3 font-mono text-xs">{link}</output><p className="text-sm text-[var(--color-ink-muted)]">No message has been sent. This demo link cannot collect a real payment.</p></div>}>
    <fieldset className="space-y-2"><legend className="text-sm font-medium">Payer type</legend><div className="flex gap-6">{["Business", "Personal"].map(value => <label key={value} className="flex items-center gap-2 text-sm"><input type="radio" name={`${id}-kind`} checked={kind === value} onChange={() => setKind(value)} className="size-4 accent-[var(--color-primary)]" />{value}</label>)}</div></fieldset>
    <Field label="Payer name" error={flow.errors.payer}>{props => <input {...props} className={controlClass} value={payer} maxLength={120} onChange={event => setPayer(event.target.value)} />}</Field>
    <Field label="Invoice title" error={flow.errors.invoice}>{props => <input {...props} className={controlClass} value={invoice} maxLength={160} onChange={event => setInvoice(event.target.value)} />}</Field>
    <div className="grid gap-5 sm:grid-cols-2"><AmountField value={amount} onChange={setAmount} error={flow.errors.amount} /><AssetField label="Currency" value={currency} options={["USDT", "USDC", "ETH", "BTC", "SOL", "TRX", "XRP"]} onChange={setCurrency} /></div>
    <Field label="Expiration">{props => <select {...props} className={controlClass} value={expiration} onChange={event => setExpiration(event.target.value)}>{["24 hours", "7 days", "30 days"].map(value => <option key={value}>{value}</option>)}</select>}</Field>
    <OrganizationField label="Receiving organization" value={organization} onChange={setOrganization} />
    <fieldset aria-describedby={flow.errors.channels ? `${id}-channel-error` : undefined} aria-invalid={Boolean(flow.errors.channels)} className="space-y-3"><legend className="text-sm font-medium">Delivery channels</legend><div className="flex flex-wrap gap-5">{["WhatsApp", "SMS", "Email"].map(channel => <label key={channel} className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[var(--color-primary)]" checked={channels.includes(channel)} onChange={event => setChannels(event.target.checked ? [...channels, channel] : channels.filter(value => value !== channel))} />{channel}</label>)}</div>{flow.errors.channels && <p id={`${id}-channel-error`} role="alert" className="text-xs text-[var(--color-negative)]">{flow.errors.channels}</p>}<p className="text-xs text-[var(--color-ink-muted)]">Preferences only. The demo does not send messages.</p></fieldset>
    <Field label="Appearance">{props => <select {...props} className={controlClass} value={appearance} onChange={event => setAppearance(event.target.value)}>{["Light", "Dark", "Organization branding"].map(value => <option key={value}>{value}</option>)}</select>}</Field>
  </FlowFrame>;
}
