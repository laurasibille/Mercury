"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Bell, Building2, Home, X } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { useSwapiz } from "../providers/SwapizProvider";

const links = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
];

export function SwapizSidebar() {
  const pathname = usePathname();
  const { snapshot } = useSwapiz();
  const { setOpenMobile } = useSidebar();
  const attentionCount = snapshot.attentionCount + snapshot.pendingApprovalCount;

  return <Sidebar collapsible="icon" role="complementary" aria-label="Workspace sidebar">
    <SidebarHeader className="relative h-16 justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--color-primary)] text-base font-semibold text-white">S</span>
        <span className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">swapiz</span>
      </div>
      <button type="button" aria-label="Close navigation" onClick={() => setOpenMobile(false)} className="absolute right-3 rounded-md p-1 hover:bg-sidebar-accent md:hidden"><X className="size-4" /></button>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup className="p-3">
        <nav aria-label="Main navigation">
          <SidebarMenu>
            {links.map(({ label, href, icon: Icon }) => {
              const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
              return <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={active}
                  aria-current={active ? "page" : undefined}
                  aria-label={label === "Alerts" ? `Alerts ${attentionCount}` : label}
                  tooltip={label}
                  onClick={() => setOpenMobile(false)}
                  className="h-9 gap-3 text-[var(--font-size-navigation)] font-normal leading-[var(--line-height-navigation)] data-active:bg-[var(--sidebar-item-active)]"
                >
                  <Icon strokeWidth={1.7} aria-hidden="true" />
                  <span>{label}</span>
                  {label === "Alerts" && <span className="sr-only">{attentionCount}</span>}
                </SidebarMenuButton>
                {label === "Alerts" && <SidebarMenuBadge aria-hidden="true" className="font-normal">{attentionCount}</SidebarMenuBadge>}
              </SidebarMenuItem>;
            })}
          </SidebarMenu>
        </nav>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>;
}
