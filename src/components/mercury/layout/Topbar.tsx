"use client";

import Image from "next/image";
import { Bell, Eye, EyeOff, MoveHorizontal, Search, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MercuryMark } from "../primitives/MercuryMark";

export function Topbar({ privateMode, onPrivateMode }: { privateMode: boolean; onPrivateMode: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-[var(--color-border)] bg-white/95 px-3 backdrop-blur md:top-14 md:h-16 md:px-5">
      <SidebarTrigger className="mr-2" aria-label="Afficher ou réduire la navigation" />
      <span className="mr-4 hidden h-5 w-px bg-[var(--color-border)] md:block" />
      <div className="flex min-w-0 items-center gap-2 md:hidden"><MercuryMark className="h-5 w-5 shrink-0" /><span className="truncate text-[14px]">Mercury Demo</span></div>
      <button className="hidden items-center gap-2 text-[14px] text-[var(--color-ink-secondary)] md:flex"><Search size={15} />Search for anything</button>
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

