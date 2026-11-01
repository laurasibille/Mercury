"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, Monitor, Moon, Settings, ShieldCheck, Sun, Users } from "lucide-react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { SwapizState } from "@/lib/swapiz/reducer";

const itemClass = "flex cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] data-highlighted:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]";
const themes: { value: SwapizState["theme"]; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function UserMenu() {
  const { state, dispatch } = useSwapiz();
  return <Menu.Root>
    <Menu.Trigger aria-label="Open user menu" className="flex h-9 items-center gap-2 rounded-lg px-1.5 hover:bg-[var(--color-surface)]">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-medium text-[var(--color-ink-secondary)]">KK</span>
      <ChevronDown aria-hidden="true" className="size-3.5 text-[var(--color-ink-muted)]" />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
        <Menu.Popup className="swapiz-glass-strong w-60 p-1.5 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">
          <div className="border-b border-[var(--color-border)] px-3 pb-3 pt-2 text-[13px] text-[var(--color-ink-muted)]">kramer@starclick.co</div>
          <Menu.Item render={<Link href="/dashboard/settings" />} className={itemClass}><Settings className="size-4" aria-hidden="true" />Settings</Menu.Item>
          <Menu.Group>
            <Menu.GroupLabel className="px-3 pb-1 pt-2 text-xs text-[var(--color-ink-muted)]">Theme</Menu.GroupLabel>
            <Menu.RadioGroup value={state.theme} onValueChange={(theme: SwapizState["theme"]) => dispatch({ type: "theme/changed", theme })}>
              {themes.map(({ value, label, icon: Icon }) => <Menu.RadioItem key={value} value={value} className={`${itemClass} data-checked:bg-[var(--color-primary-soft)]`}><Icon className="size-4" aria-hidden="true" />{label}<Menu.RadioItemIndicator className="ml-auto" aria-hidden="true">✓</Menu.RadioItemIndicator></Menu.RadioItem>)}
            </Menu.RadioGroup>
          </Menu.Group>
          <div className="my-1 border-t border-[var(--color-border)]" />
          <Menu.Item render={<Link href="/dashboard/users" />} className={itemClass}><Users className="size-4" aria-hidden="true" />Users</Menu.Item>
          <Menu.Item render={<Link href="/dashboard/roles" />} className={itemClass}><ShieldCheck className="size-4" aria-hidden="true" />Roles</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>;
}
