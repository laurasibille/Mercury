"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Copy, Snowflake, WalletCards } from "lucide-react";
import { useRef, useState } from "react";
import type { Wallet, WalletBalance } from "@/types/swapiz";
import { controlClass, money, mutedClass, panelClass, tokens } from "./company-data";

export function WalletList({ wallets, balances }: { wallets: Wallet[]; balances: WalletBalance[] }) {
  const [message, setMessage] = useState("");
  const [autoSweep, setAutoSweep] = useState<Record<string, boolean>>({});
  const [confirmation, setConfirmation] = useState<{ wallet: Wallet; action: "sweep" | "auto" } | null>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const groups = [...new Set(wallets.map(wallet => wallet.type))];

  async function copyAddress(wallet: Wallet) {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setMessage(`Address copied for ${wallet.name} · ${wallet.network}.`);
    } catch {
      setMessage("Copy unavailable. Select the address to copy it manually.");
    }
  }
  function preview(wallet: Wallet, action: "sweep" | "auto", trigger: HTMLButtonElement) {
    origin.current = trigger;
    setConfirmation({ wallet, action });
  }
  const enabled = confirmation ? autoSweep[confirmation.wallet.id] ?? confirmation.wallet.autoSweep : false;
  function confirm() {
    if (!confirmation) return;
    if (confirmation.action === "auto") {
      setAutoSweep(previous => ({ ...previous, [confirmation.wallet.id]: !enabled }));
      setMessage(`Auto-sweep ${enabled ? "disabled" : "enabled"} in this demo session. No automated transfers are scheduled.`);
    } else setMessage(`Demo sweep confirmed for ${confirmation.wallet.name}. Wallet balances are unchanged; no funds moved.`);
    setConfirmation(null);
  }

  return <div className="min-w-0 space-y-5">
    <p className={mutedClass}>Recorded wallet accounts, networks, and native asset holdings. USD values are demo equivalents.</p>
    <div role="status" className={message ? `${panelClass} px-4 py-3 text-sm` : "sr-only"}>{message}</div>
    {groups.map(type => <section key={type} aria-label={type} className="min-w-0 space-y-3">
      <div className="flex items-center gap-2"><WalletCards className="size-4 text-[var(--color-ink-muted)]" aria-hidden="true" /><h2 className="text-base font-medium">{type}</h2><span className={mutedClass}>{wallets.filter(wallet => wallet.type === type).length}</span></div>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2">{wallets.filter(wallet => wallet.type === type).map(wallet => {
        const holdings = balances.filter(item => item.walletId === wallet.id);
        const total = holdings.reduce((sum, item) => sum + item.usd, 0);
        const auto = autoSweep[wallet.id] ?? wallet.autoSweep;
        return <article key={wallet.id} aria-label={`${wallet.name} · ${wallet.network}`} className={`${panelClass} p-4 sm:p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><h3 className="text-sm font-medium">{wallet.name}</h3><p className={`${mutedClass} mt-1`}>{wallet.network}</p></div>{wallet.cold && <span className="swapiz-status-badge swapiz-status-info"><Snowflake size={14} aria-hidden="true" />Cold storage</span>}</div>
          <p className="tnum mt-4 text-xl font-medium">{money.format(total)}</p>
          <ul aria-label={`Assets in ${wallet.name} · ${wallet.network}`} className="mt-3 flex flex-wrap gap-2">{holdings.map(item => <li key={item.id} className="rounded-lg bg-[var(--color-surface)] px-2.5 py-1.5 text-xs leading-[18px]"><span className="tnum font-medium">{tokens.format(item.amount)} {item.asset}</span><span className="tnum ml-2 text-[var(--color-ink-muted)]">≈ {money.format(item.usd)}</span></li>)}</ul>
          {!holdings.length && <p className={`${mutedClass} mt-3`}>No asset balance recorded.</p>}
          <div className="mt-4 border-t border-[var(--color-border)] pt-4"><p className={mutedClass}>Address</p><div className="mt-1 flex min-w-0 items-start gap-2"><code className="min-w-0 flex-1 select-all break-all text-xs leading-[18px] text-[var(--color-ink-secondary)]">{wallet.address}</code><button type="button" aria-label={`Copy address for ${wallet.name} · ${wallet.network}`} onClick={() => void copyAddress(wallet)} className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"><Copy className="size-4" aria-hidden="true" /></button></div></div>
          {wallet.type === "Fee wallet" && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4"><button type="button" role="switch" aria-checked={auto} aria-label={`Auto-sweep ${wallet.name} · ${wallet.network}`} onClick={event => preview(wallet, "auto", event.currentTarget)} className={`${controlClass} flex items-center gap-2`}><span aria-hidden="true" className={`relative h-5 w-8 rounded-full ${auto ? "bg-[var(--color-primary)]" : "bg-[var(--color-ink-muted)]"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white ${auto ? "left-3.5" : "left-0.5"}`} /></span>Auto-sweep <span className={mutedClass}>Demo</span></button><button type="button" aria-label={`Sweep ${wallet.name} · ${wallet.network}`} onClick={event => preview(wallet, "sweep", event.currentTarget)} className={controlClass}>Sweep</button></div>}
        </article>;
      })}</div>
    </section>)}
    {!wallets.length && <p className={`${panelClass} p-6 text-sm`}>No wallets recorded for this company.</p>}
    <Dialog.Root open={Boolean(confirmation)} onOpenChange={open => { if (!open) setConfirmation(null); }}>
      <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35" /><Dialog.Popup finalFocus={() => origin.current ?? true} className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 text-[var(--color-ink)] shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:p-6">
        <Dialog.Title className="text-xl font-medium">{confirmation?.action === "auto" ? `${enabled ? "Disable" : "Enable"} auto-sweep demo?` : "Preview sweep"}</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-5 text-[var(--color-ink-secondary)]">{confirmation?.wallet.name} · {confirmation?.wallet.network}. {confirmation?.action === "auto" ? "This switch changes only the current demo session. No automated transfers are scheduled." : "This confirms a sweep preview in the demo. No funds will move and wallet balances will stay unchanged."}</Dialog.Description>
        <div className="mt-6 flex flex-wrap justify-end gap-2"><Dialog.Close className={controlClass}>Cancel</Dialog.Close><button type="button" onClick={confirm} className="min-h-9 rounded-lg bg-[var(--color-primary)] px-3 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]">{confirmation?.action === "auto" ? "Confirm demo auto-sweep" : "Confirm demo sweep"}</button></div>
      </Dialog.Popup></Dialog.Portal>
    </Dialog.Root>
  </div>;
}
