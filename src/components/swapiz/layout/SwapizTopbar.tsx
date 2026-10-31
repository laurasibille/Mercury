"use client";

import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { swapizDemoData } from "@/data/swapiz-demo";
import { useSwapiz } from "../providers/SwapizProvider";
import { UserMenu } from "./UserMenu";

function pageTitle(pathname: string) {
  const [, , section, companyId] = pathname.split("/");
  if (section === "companies" && companyId) {
    const company = swapizDemoData.organizations.find(item => item.id === companyId);
    return `Companies / ${company?.name ?? "Company"}`;
  }
  const titles: Record<string, string> = { alerts: "Alerts", companies: "Companies", transactions: "Transactions", settings: "Settings", users: "Users", roles: "Roles" };
  return titles[section] ?? "Home";
}

export function SwapizTopbar() {
  const pathname = usePathname();
  const { dispatch } = useSwapiz();
  return <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-canvas)] px-4 md:px-6">
    <div className="flex min-w-0 items-center gap-3">
      <SidebarTrigger />
      <span className="truncate text-sm leading-5 text-[var(--color-ink-secondary)]">{pageTitle(pathname)}</span>
    </div>
    <div className="flex shrink-0 items-center gap-3">
      <button type="button" onClick={() => dispatch({ type: "move/open", operation: null })} className="flex h-9 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]">
        Move money<ArrowUpRight className="size-4" aria-hidden="true" />
      </button>
      <UserMenu />
    </div>
  </header>;
}
