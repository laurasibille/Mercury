"use client";

import { useId, useRef, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { getPresetRange, validateDateRange } from "@/lib/swapiz/date-range";
import type { DatePreset, DateRange } from "@/types/swapiz";

const presets: Exclude<DatePreset, "custom">[] = ["today", "last-7-days", "last-30-days", "this-month", "last-90-days", "this-year"];
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (value: string) => dateFormat.format(new Date(`${value}T12:00:00Z`));
const intervalLabel = (from: string, to: string) => `${formatDate(from)} – ${formatDate(to)}`;

export function DateRangePopover({ value, onChange }: { value: DateRange; onChange: (range: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string>();
  const errorId = useId();
  const fromRef = useRef<HTMLInputElement>(null);

  function changeOpen(next: boolean) {
    setDraft(value);
    setError(undefined);
    setOpen(next);
  }

  function applyCustom() {
    const validation = validateDateRange(draft.from, draft.to);
    if (!validation.valid) {
      setError(validation.message);
      fromRef.current?.focus();
      return;
    }
    onChange({ preset: "custom", from: draft.from, to: draft.to, label: intervalLabel(draft.from, draft.to) });
    setOpen(false);
  }

  return <Popover.Root open={open} onOpenChange={changeOpen}>
    <Popover.Trigger className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm leading-5 text-[var(--color-ink)] hover:bg-[var(--color-surface)]">
      <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-[var(--color-ink-muted)]" /><span className="truncate">{value.label}</span><ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-[var(--color-ink-muted)]" />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner align="end" sideOffset={8} collisionPadding={12} className="z-50">
        <Popover.Popup aria-label="Date range" className="swapiz-glass-strong w-[540px] max-w-[calc(100vw-24px)] max-h-[calc(100dvh-24px)] overflow-y-auto text-[var(--color-ink)] outline-none">
          <Popover.Title className="sr-only">Date range</Popover.Title>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-[168px_1fr]">
            <div aria-label="Date presets" className="flex flex-col gap-1 border-b border-[var(--color-border)] p-3 min-[480px]:border-b-0 min-[480px]:border-r">
              {presets.map(preset => {
                const range = getPresetRange(preset);
                return <button key={preset} type="button" aria-pressed={draft.preset === preset} onClick={() => { onChange(range); setOpen(false); }} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 hover:bg-[var(--color-surface)] aria-pressed:bg-[var(--color-primary-soft)] aria-pressed:text-[var(--color-primary)]">
                  {range.label}{draft.preset === preset && <Check aria-hidden="true" className="size-3.5 shrink-0" />}
                </button>;
              })}
              <button type="button" aria-pressed={draft.preset === "custom"} onClick={() => { setDraft({ ...draft, preset: "custom" }); fromRef.current?.focus(); }} className="rounded-lg px-3 py-2 text-left text-sm leading-5 hover:bg-[var(--color-surface)] aria-pressed:bg-[var(--color-primary-soft)] aria-pressed:text-[var(--color-primary)]">Custom range</button>
            </div>
            <div className="min-w-0 p-5">
              <h2 className="mb-4 text-sm font-medium leading-5">Custom range</h2>
              <div className="grid gap-4">
                {(["from", "to"] as const).map(field => <label key={field} className="grid gap-1.5 text-xs leading-[18px] text-[var(--color-ink-secondary)]">
                  {field === "from" ? "From" : "To"}
                  <input ref={field === "from" ? fromRef : undefined} type="date" value={draft[field]} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} onChange={event => { setDraft({ ...draft, preset: "custom", [field]: event.target.value }); setError(undefined); }} className="h-10 min-w-0 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm leading-5 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]" />
                </label>)}
              </div>
              {error && <p id={errorId} role="alert" className="mt-3 text-xs leading-[18px] text-[var(--swapiz-critical-ink)]">{error}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--color-border)] p-3">
            <button type="button" onClick={() => { setDraft({ ...getPresetRange("last-30-days"), preset: "custom" }); setError(undefined); }} className="mr-auto rounded-lg px-3 py-2 text-sm leading-5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)]">Reset</button>
            <Popover.Close className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2 text-sm leading-5 hover:bg-[var(--color-surface)]">Cancel</Popover.Close>
            <button type="button" onClick={applyCustom} className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-[var(--color-primary-hover)]">Apply</button>
          </div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
}
