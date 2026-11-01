"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { fullDate, organizationName } from "../dashboard/overview-format";
import { StatusBadge } from "../primitives/StatusBadge";
import type { Transaction } from "@/types/swapiz";

export function TransactionDetail({ transaction, onClose, finalFocus }: { transaction: Transaction | null; onClose: () => void; finalFocus: () => HTMLElement | true }) {
  return <Dialog.Root open={Boolean(transaction)} onOpenChange={open => { if (!open) onClose(); }}>
    <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35" /><Dialog.Popup finalFocus={finalFocus} className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 text-[var(--color-ink)] shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:p-6">
      {transaction && <>
        <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Transaction detail</p><Dialog.Title className="text-xl font-medium">Transaction {transaction.id}</Dialog.Title></div><Dialog.Close aria-label="Close details" className="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"><X className="size-4" aria-hidden="true" /></Dialog.Close></div>
        <Dialog.Description className="mt-3 break-words text-sm text-[var(--color-ink-secondary)]">{transaction.type.replace("-", " ")} · {transaction.amountLabel}</Dialog.Description>
        <dl className="mt-5 space-y-3 border-y border-[var(--color-border)] py-4 text-sm">
          <Detail label="Date and time"><time dateTime={`${transaction.date}T${transaction.time}:00Z`}>{fullDate.format(new Date(`${transaction.date}T00:00:00Z`))} · {transaction.time} UTC</time></Detail>
          <Detail label="Type">{transaction.type.replace("-", " ")}</Detail>
          <Detail label="Amount">{transaction.amountLabel}</Detail>
          <Detail label="USD value">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.usdValue)}</Detail>
          <Detail label="Asset">{transaction.asset}</Detail>
          <Detail label="Network">{transaction.network}</Detail>
          <Detail label="Company / wallet">{organizationName(transaction.organizationId)} · {transaction.wallet}</Detail>
          <Detail label="Source">{transaction.source}</Detail>
          <Detail label="Status"><StatusBadge status={transaction.status} /></Detail>
          {transaction.address && <Detail label="Address"><span className="break-all font-mono text-xs">{transaction.address}</span></Detail>}
        </dl>
        <p className="mt-4 text-xs leading-[18px] text-[var(--color-ink-muted)]">Demo transaction record. No real funds were moved.</p>
        <div className="mt-5 flex justify-end"><Dialog.Close className="min-h-10 rounded-lg border border-[var(--color-border)] px-4 text-sm hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">Close</Dialog.Close></div>
      </>}
    </Dialog.Popup></Dialog.Portal>
  </Dialog.Root>;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-[var(--color-ink-muted)]">{label}</dt><dd className="min-w-0 break-words text-right">{children}</dd></div>;
}
