"use client";

import type { CSSProperties, ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SwapizSidebar } from "./SwapizSidebar";
import { SwapizTopbar } from "./SwapizTopbar";
import { MoveMoneyLayer } from "../move-money/MoveMoneyLayer";

export function SwapizShell({ children }: { children: ReactNode }) {
  return <SidebarProvider style={{ "--sidebar-width": "240px", "--sidebar-width-icon": "56px" } as CSSProperties}>
    <SwapizSidebar />
    <SidebarInset className="min-w-0 bg-[var(--swapiz-canvas)]">
      <SwapizTopbar />
      <div className="min-w-0 flex-1">{children}</div>
    </SidebarInset>
    <MoveMoneyLayer />
  </SidebarProvider>;
}
