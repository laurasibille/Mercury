"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { moneyIn, moneyOut } from "../../../data/mercury-dashboard";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";

type MoneyMovementProps = {
  privateMode: boolean;
};

type MovementCardProps = {
  direction: "in" | "out";
  total: string;
  average: string;
  items: readonly (readonly [string, string])[];
  privateMode: boolean;
};

const CURRENT_MONTH = new Date(2026, 9, 1);

function hiddenAmount(amount: string, privateMode: boolean) {
  return privateMode ? "••••••" : amount;
}

function MovementCard({ direction, total, average, items, privateMode }: MovementCardProps) {
  const incoming = direction === "in";

  return (
    <Card className="min-w-0 overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${incoming ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-[var(--color-gray-100)] text-[var(--color-ink-secondary)]"}`}>
              {incoming ? <ArrowDownLeft aria-hidden="true" size={15} /> : <ArrowUpRight aria-hidden="true" size={15} />}
            </span>
            Money {direction}
          </div>
          <p className="mt-3 text-[24px] leading-8 tracking-[-0.025em] text-[var(--color-ink)]" aria-label={privateMode ? "Amount hidden" : total}>
            {hiddenAmount(total, privateMode)}
          </p>
        </div>
        <div className="pt-1 text-right text-[12px] leading-[18px] text-[var(--color-ink-muted)]">
          <p>Daily average</p>
          <p className="text-[13px] text-[var(--color-ink-secondary)]" aria-label={privateMode ? "Amount hidden" : average}>
            {hiddenAmount(average, privateMode)}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-border)] pt-2">
        {items.map(([name, amount]) => (
          <div key={`${direction}-${name}`} className="flex min-h-9 items-center justify-between gap-4 text-[13px] leading-[18px]">
            <span className="truncate text-[var(--color-ink-secondary)]">{name}</span>
            <span className="shrink-0 tabular-nums text-[var(--color-ink)]" aria-label={privateMode ? "Amount hidden" : amount}>
              {hiddenAmount(amount, privateMode)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MoneyMovement({ privateMode }: MoneyMovementProps) {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const isCurrentMonth = month.getFullYear() === CURRENT_MONTH.getFullYear() && month.getMonth() === CURRENT_MONTH.getMonth();
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(month);

  function moveMonth(offset: number) {
    setMonth((selectedMonth) => new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + offset, 1));
  }

  return (
    <section className="mt-10" aria-labelledby="money-movement-title">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="money-movement-title" className="text-[19px] leading-7 font-normal text-[var(--color-ink)]">Money movement</h2>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" aria-label="Previous month" onClick={() => moveMonth(-1)}>
            <ChevronLeft aria-hidden="true" size={16} />
          </Button>
          <span className="min-w-[76px] text-center text-[13px] text-[var(--color-ink-secondary)]" aria-live="polite">{monthLabel}</span>
          <Button size="icon" variant="ghost" aria-label="Next month" disabled={isCurrentMonth} onClick={() => moveMonth(1)}>
            <ChevronRight aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MovementCard direction="in" total="$1,769,353.65" average="$58,978.46" items={moneyIn} privateMode={privateMode} />
        <MovementCard direction="out" total="−$474,698.09" average="−$15,823.27" items={moneyOut} privateMode={privateMode} />
      </div>
    </section>
  );
}
