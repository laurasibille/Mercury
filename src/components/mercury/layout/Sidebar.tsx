"use client";

import { BookOpen, Building2, Calculator, CheckCircle2, ChevronRight, Command, CreditCard, Home, Landmark, Lightbulb, ListChecks, ReceiptText, Send, Sparkles, UsersRound, X } from "lucide-react";
import { MercuryMark } from "../primitives/MercuryMark";

const primary = [
  [Home, "Home"], [CheckCircle2, "Tasks", "10"], [Command, "Command", "New"],
] as const;
const finance = [
  [Landmark, "Accounts"], [ReceiptText, "Transactions"], [CreditCard, "Cards"], [UsersRound, "Team Spend"], [Send, "Payments"], [ListChecks, "Invoicing"], [BookOpen, "Accounting"],
] as const;
const bookmarks = ["Ops / Payroll", "Credit Card", "Bill Pay", "Insights"];

function NavItem({ icon: Icon, label, badge, active = false }: { icon: typeof Home; label: string; badge?: string; active?: boolean }) {
  return <button className={`flex h-9 w-full items-center gap-3 rounded-lg px-2 text-left text-[15px] transition-colors ${active ? "bg-[var(--color-gray-150)] text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:bg-[var(--color-gray-100)]"}`}><Icon size={14} strokeWidth={1.7} /><span className="flex-1">{label}</span>{badge && <span className={`text-xs ${badge === "New" ? "rounded bg-[#e1eef1] px-2 py-0.5" : ""}`}>{badge}</span>}</button>;
}

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-black/20 min-[961px]:hidden" onClick={onClose} />}
      <aside className={`fixed bottom-0 left-0 z-40 w-[219px] overflow-y-auto border-r border-[var(--color-border)] bg-white transition-transform min-[961px]:top-14 min-[961px]:translate-x-0 max-[960px]:top-0 max-[960px]:z-50 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-14 items-center gap-2 px-3">
          <MercuryMark className="h-6 w-6" /><span className="flex-1 text-[14px]">Mercury Demo</span><span className="rounded bg-[var(--color-night-700)] px-2 text-[12px] text-white">Pro</span>
          <button aria-label="Close navigation" onClick={onClose} className="ml-1 min-[961px]:hidden"><X size={18} /></button>
        </div>
        <div className="mx-2 mb-3 grid h-8 grid-cols-3 rounded-lg bg-[var(--color-gray-100)] p-0.5 text-[13px] text-[var(--color-ink-muted)]">
          <button className="rounded-md border border-[var(--color-border)] bg-white text-[var(--color-ink)]"><Landmark className="mr-1 inline" size={13} />Banking</button><button>Payroll</button><button>Books</button>
        </div>
        <nav className="space-y-0.5 px-2">
          {primary.map(([icon, label, badge]) => <NavItem key={label} icon={icon} label={label} badge={badge} active={label === "Home"} />)}
        </nav>
        <div className="my-3 border-t border-[var(--color-border)]" />
        <nav className="space-y-0.5 px-2">{finance.map(([icon, label]) => <NavItem key={label} icon={icon} label={label} />)}</nav>
        <div className="mt-3 border-t border-[var(--color-border)] px-4 pt-4">
          <div className="mb-2 flex items-center text-[12px] text-[var(--color-ink-muted)]"><span className="flex-1">Bookmarks</span><Sparkles size={14} /></div>
          {bookmarks.map((item, index) => <button key={item} className="flex w-full items-start gap-3 py-2 text-left text-[14px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"><span className="mt-1 h-3 w-2 border border-current" /><span className="flex-1">{item}{index === 0 && <small className="block text-[13px]">$2,023,267.12</small>}</span>{index === 3 && <ChevronRight size={14} />}</button>)}
        </div>
        <div className="hidden"><Building2 /><Calculator /><Lightbulb /></div>
      </aside>
    </>
  );
}

