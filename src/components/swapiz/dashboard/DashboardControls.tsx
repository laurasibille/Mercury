"use client";

import { Menu } from "@base-ui/react/menu";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronDown, Layers, Repeat2 } from "lucide-react";
import type { MoveOperation } from "@/types/swapiz";
import { useSwapiz } from "../providers/SwapizProvider";
import { ScopeSelect } from "./ScopeSelect";
import { DateRangePopover } from "./DateRangePopover";

const actions: { label: string; operation: MoveOperation; icon: typeof ArrowUpRight }[] = [
  { label: "Send", operation: "send", icon: ArrowUpRight },
  { label: "Receive", operation: "receive", icon: ArrowDownLeft },
  { label: "Transfer", operation: "transfer", icon: ArrowLeftRight },
  { label: "Swap", operation: "swap", icon: Repeat2 },
  { label: "Mass Pay", operation: "mass-pay", icon: Layers },
];
const actionClass = "flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm font-medium leading-5 text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]";

export function DashboardControls() {
  const { state, dispatch } = useSwapiz();
  const openMovement = (operation: MoveOperation) => dispatch({ type: "move/open", operation });
  return <section aria-label="Dashboard controls" className="flex flex-wrap items-start justify-between gap-4">
    <div aria-label="Movement shortcuts" className="flex flex-wrap items-center gap-2">
      {actions.map(({ label, operation, icon: Icon }, index) => <button key={operation} type="button" onClick={() => openMovement(operation)} className={`${actionClass} ${index > 0 ? "hidden sm:flex" : ""}`}><Icon aria-hidden="true" className="size-4" />{label}</button>)}
      <div className="sm:hidden">
        <Menu.Root>
          <Menu.Trigger className={actionClass}>More<ChevronDown aria-hidden="true" className="size-3.5" /></Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8} align="start" className="z-50">
              <Menu.Popup className="w-44 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-1.5 text-[var(--color-ink)] shadow-lg outline-none">
                {actions.slice(1).map(({ label, operation, icon: Icon }) => <Menu.Item key={operation} onClick={() => openMovement(operation)} className="flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm leading-5 outline-none data-highlighted:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Icon aria-hidden="true" className="size-4" />{label}</Menu.Item>)}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </div>
    <div aria-label="Dashboard filters" className="flex min-w-0 flex-wrap items-center gap-2">
      <ScopeSelect value={state.scopeId} onChange={scopeId => dispatch({ type: "scope/changed", scopeId })} />
      <DateRangePopover value={state.dateRange} onChange={dateRange => dispatch({ type: "date/changed", dateRange })} />
    </div>
  </section>;
}
