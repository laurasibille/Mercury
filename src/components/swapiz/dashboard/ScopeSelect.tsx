"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { Building2, Check, ChevronDown } from "lucide-react";
import { swapizDemoData } from "@/data/swapiz-demo";
import type { ScopeId } from "@/types/swapiz";

export function ScopeSelect({ value, onChange }: { value: ScopeId; onChange: (scopeId: ScopeId) => void }) {
  const [open, setOpen] = useState(false);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const contextId = useId();
  const companies = swapizDemoData.organizations.filter(item => item.kind === "company");
  const departments = swapizDemoData.organizations.filter(item => item.kind === "department" && companies.some(company => company.id === item.parentId));
  const options = [
    { id: "all" as ScopeId, name: "All companies", parent: undefined },
    ...companies.map(item => ({ id: item.id, name: item.name, parent: undefined })),
    ...departments.map(item => ({ id: item.id, name: item.name, parent: companies.find(company => company.id === item.parentId)?.name })),
  ];
  const selected = options.find(item => item.id === value) ?? options[0];

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    let next: number | undefined;
    if (event.key === "ArrowDown") next = (current + 1) % items.length;
    if (event.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (event.key.length === 1 && /\S/.test(event.key)) {
      next = options.findIndex((item, index) => index > current && item.name.toLowerCase().startsWith(event.key.toLowerCase()));
      if (next === -1) next = options.findIndex(item => item.name.toLowerCase().startsWith(event.key.toLowerCase()));
    }
    if (next !== undefined && next >= 0) {
      event.preventDefault();
      items[next]?.focus();
    }
  }

  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Trigger className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm leading-5 text-[var(--color-ink)] hover:bg-[var(--color-surface)]">
      <Building2 aria-hidden="true" className="size-4 shrink-0 text-[var(--color-ink-muted)]" />
      <span className="truncate">{selected.name}</span><ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-[var(--color-ink-muted)]" />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner align="end" sideOffset={8} collisionPadding={12} className="z-50">
        <Popover.Popup aria-label="Organization scope" initialFocus={selectedRef} className="swapiz-glass-strong w-72 max-w-[calc(100vw-24px)] p-1.5 text-[var(--color-ink)] outline-none">
          <div role="listbox" aria-label="Organization scope" onKeyDown={navigate} className="max-h-[min(480px,70dvh)] overflow-y-auto">
            {options.map(item => <button
              key={item.id} ref={value === item.id ? selectedRef : undefined} type="button" role="option"
              aria-label={item.name} aria-selected={value === item.id} aria-describedby={item.parent ? `${contextId}-${item.id}` : undefined}
              tabIndex={value === item.id ? 0 : -1}
              onClick={() => { onChange(item.id); setOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg py-2 pr-3 text-left text-sm leading-5 hover:bg-[var(--color-surface)] focus-visible:bg-[var(--color-surface)] ${item.parent ? "pl-7" : "pl-3"}`}
            >
              <span className="flex-1"><span className="block">{item.name}</span>{item.parent && <span id={`${contextId}-${item.id}`} className="block text-xs leading-[18px] text-[var(--color-ink-muted)]">Department · {item.parent}</span>}</span>
              {value === item.id && <Check aria-hidden="true" className="size-4 text-[var(--color-primary)]" />}
            </button>)}
          </div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
}
