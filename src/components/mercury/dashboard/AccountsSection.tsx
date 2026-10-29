"use client";

import { useState } from "react";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { accounts } from "@/data/mercury-dashboard";
import { Card } from "../primitives/Card";
import { MercuryMark } from "../primitives/MercuryMark";

type AccountsSectionProps = {
  privateMode: boolean;
};

export function AccountsSection({ privateMode }: AccountsSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="relative h-[348px] w-full min-w-0 overflow-visible sm:max-w-[470px]">
      <header className="flex h-[72px] items-center px-6 max-[479px]:px-5">
        <h2 className="text-[19px] font-normal leading-7 tracking-[-0.01em] text-[var(--color-ink)]">Accounts</h2>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Add account"
            className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <Plus size={16} strokeWidth={1.7} />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Account options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-surface)]"
            >
              <MoreHorizontal size={17} />
            </button>
            {menuOpen ? (
              <div role="menu" className="absolute right-0 top-10 z-20 w-40 rounded-[8px] border border-[var(--color-border)] bg-white py-1 shadow-[var(--shadow-popover)]">
                <button type="button" role="menuitem" className="block w-full px-3 py-2 text-left text-[13px] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]">Manage accounts</button>
                <button type="button" role="menuitem" className="block w-full px-3 py-2 text-left text-[13px] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]">Account settings</button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div>
        {accounts.map((account) => (
          <button
            key={account.name}
            type="button"
            className="flex h-11 w-full items-center px-6 text-left transition-colors hover:bg-[var(--color-canvas-subtle)] max-[479px]:px-5"
          >
            <MercuryMark className="mr-3 h-6 w-6 shrink-0 text-[var(--color-indigo-500)]" />
            <span className="min-w-0 flex-1 truncate text-[15px] leading-6 text-[var(--color-ink-secondary)]">{account.name}</span>
            <span className="ml-4 shrink-0 text-[15px] leading-6 tabular-nums text-[var(--color-ink)]">
              {privateMode ? "••••••" : account.amount}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="flex h-14 w-full items-center border-t border-[var(--color-border)] px-6 text-[13px] leading-[18px] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-canvas-subtle)] max-[479px]:px-5"
      >
        <span>View 2 more accounts</span>
        <ChevronRight className="ml-auto" size={15} strokeWidth={1.8} />
      </button>
    </Card>
  );
}
