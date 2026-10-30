"use client";

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Command,
  CreditCard,
  Home,
  Landmark,
  ListChecks,
  ReceiptText,
  Send,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { MercuryMark } from "../primitives/MercuryMark";

const primary = [
  { icon: Home, label: "Home", active: true },
  { icon: CheckCircle2, label: "Tasks", badge: "10" },
  { icon: Command, label: "Command", badge: "New" },
];

const finance = [
  { icon: Landmark, label: "Accounts" },
  { icon: ReceiptText, label: "Transactions" },
  { icon: CreditCard, label: "Cards" },
  { icon: UsersRound, label: "Team Spend" },
  { icon: Send, label: "Payments" },
  { icon: ListChecks, label: "Invoicing" },
  { icon: BookOpen, label: "Accounting" },
];

const bookmarks = [
  { label: "Ops / Payroll", detail: "$2,023,267.12" },
  { label: "Credit Card" },
  { label: "Bill Pay" },
  { label: "Insights", trailing: true },
];

function NavigationItem({
  icon: Icon,
  label,
  badge,
  active = false,
}: {
  icon: typeof Home;
  label: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={label}
        className="h-9 gap-3 rounded-lg px-2 text-[var(--font-size-navigation)] font-normal leading-[var(--line-height-navigation)] data-active:bg-[var(--sidebar-item-active)]"
      >
        <Icon className="size-[15px]" strokeWidth={1.7} />
        <span>{label}</span>
      </SidebarMenuButton>
      {badge ? (
        <SidebarMenuBadge className={badge === "New" ? "bg-[var(--sidebar-badge-new)] px-2 font-normal" : "font-normal"}>
          {badge}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}

export function Sidebar() {
  const { setOpenMobile } = useSidebar();

  return (
    <ShadcnSidebar collapsible="icon" className="md:!top-14 md:!h-[calc(100svh-3.5rem)]">
      <SidebarHeader className="relative gap-2 border-b border-[var(--sidebar-border)] px-2 py-2">
        <button
          type="button"
          aria-label="Fermer la navigation"
          onClick={() => setOpenMobile(false)}
          className="absolute right-2 top-3 z-10 grid size-7 place-items-center rounded-md hover:bg-[var(--sidebar-item-hover)] md:hidden"
        >
          <X className="size-4" />
        </button>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Mercury Demo"
              className="h-10 rounded-lg px-2 font-normal group-data-[collapsible=icon]:p-1!"
            >
              <MercuryMark className="size-6 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-[14px] text-[var(--color-ink)]">Mercury Demo</span>
              <span className="mr-8 rounded bg-[var(--color-night-700)] px-2 py-0.5 text-[11px] leading-4 text-white md:mr-0">Pro</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="grid h-8 grid-cols-3 rounded-lg bg-[var(--color-gray-100)] p-0.5 text-[12px] text-[var(--color-ink-muted)] group-data-[collapsible=icon]:hidden">
          <button className="rounded-md border border-[var(--color-border)] bg-white text-[var(--color-ink)]">
            <Landmark className="mr-1 inline size-3" />Banking
          </button>
          <button>Payroll</button>
          <button>Books</button>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-1">
        <SidebarGroup className="py-1">
          <SidebarMenu>
            {primary.map((item) => <NavigationItem key={item.label} {...item} />)}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="py-1">
          <SidebarMenu>
            {finance.map((item) => <NavigationItem key={item.label} {...item} />)}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-7 px-2 text-[11px] font-normal uppercase tracking-[0.04em]">
            <span className="flex-1">Bookmarks</span>
            <Sparkles className="size-3.5" />
          </SidebarGroupLabel>
          <SidebarMenu>
            {bookmarks.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  className="h-auto min-h-9 items-start gap-3 rounded-lg px-2 py-2 text-[13px] font-normal leading-[18px]"
                >
                  <span className="mt-1 size-3 shrink-0 rounded-[2px] border border-current" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                    {item.detail ? <span className="block truncate text-[12px] text-[var(--color-ink-muted)]">{item.detail}</span> : null}
                  </span>
                  {item.trailing ? <ChevronRight className="mt-0.5 size-3.5" /> : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[var(--sidebar-border)] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Jane" className="h-10 rounded-lg px-2 text-[13px] font-normal">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-night-700)] text-[12px] text-white">N</span>
              <span className="truncate">Jane</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
