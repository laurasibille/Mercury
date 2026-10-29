"use client";

import Image from "next/image";
import { Bell, Eye, EyeOff, Menu, MoveHorizontal, Search, Settings } from "lucide-react";
import { MercuryMark } from "../primitives/MercuryMark";

export function Topbar({ privateMode, onPrivateMode, onMenu }: { privateMode: boolean; onPrivateMode: () => void; onMenu: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-12 items-center border-b border-[var(--color-border)] bg-white px-4 min-[961px]:left-[219px] min-[961px]:top-14 min-[961px]:h-[72px] min-[961px]:px-6">
      <button aria-label="Open navigation" onClick={onMenu} className="mr-3 min-[961px]:hidden"><Menu size={17} /></button>
      <div className="flex min-w-0 items-center gap-2 min-[961px]:hidden"><MercuryMark className="h-5 w-5 shrink-0" /><span className="truncate text-[15px]">Mercury Demo</span></div>
      <button className="hidden items-center gap-2 text-[15px] text-[var(--color-ink-secondary)] min-[961px]:flex"><Search size={16} />Search for anything</button>
      <div className="ml-auto flex items-center gap-2 text-[var(--color-ink-secondary)]">
        <button className="hidden h-8 items-center gap-2 rounded-full px-3 hover:bg-[var(--color-surface)] min-[540px]:flex"><MoveHorizontal size={15} />Move money</button>
        <button aria-label="Search" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)] min-[961px]:hidden"><Search size={16} /></button>
        <button aria-label="Toggle private mode" onClick={onPrivateMode} className={`grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)] ${privateMode ? "bg-[var(--color-surface)]" : ""}`}>{privateMode ? <Eye size={16} /> : <EyeOff size={16} />}</button>
        <button aria-label="Settings" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)]"><Settings size={15} /></button>
        <button aria-label="Updates" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--color-surface)]"><Bell size={15} /></button>
        <Image src="/mercury/dashboard/user-avatar.jpg" width={32} height={32} alt="Jane" className="h-8 w-8 rounded-full object-cover" />
      </div>
    </header>
  );
}

