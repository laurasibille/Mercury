"use client";

import { useState } from "react";
import { BarChart3, ChevronDown, LineChart, MoreHorizontal } from "lucide-react";
import { Card } from "../primitives/Card";

type BalanceCardProps = {
  privateMode: boolean;
};

const periods = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Last 365 days",
  "Week to date",
  "Month to date",
  "Quarter to date",
  "Year to date",
] as const;

const chartDates = ["Oct 4", "Oct 9", "Oct 14", "Oct 19", "Oct 24"];

function Amount({ privateMode, children }: { privateMode: boolean; children: string }) {
  return <span>{privateMode ? "••••••" : children}</span>;
}

export function BalanceCard({ privateMode }: BalanceCardProps) {
  const [view, setView] = useState<"graph" | "table">("graph");
  const [period, setPeriod] = useState<(typeof periods)[number]>("Last 30 days");
  const [periodOpen, setPeriodOpen] = useState(false);

  return (
    <Card className="relative flex h-[348px] w-full min-w-0 flex-col overflow-visible sm:max-w-[470px]">
      <header className="flex shrink-0 items-start justify-between px-6 pb-0.5 pt-5 max-[479px]:px-5">
        <div className="min-w-0">
          <p className="text-[14px] leading-5 text-[var(--color-ink-muted)]">Mercury balance</p>
          <p className="mt-0.5 truncate text-[28px] font-normal leading-9 tracking-[-0.025em] text-[var(--color-ink)]">
            <Amount privateMode={privateMode}>$5,216,471.18</Amount>
          </p>
        </div>

        <div className="ml-4 flex shrink-0 rounded-full bg-[var(--color-surface)] p-0.5" aria-label="Balance view">
          <button
            type="button"
            aria-label="Show graph"
            aria-pressed={view === "graph"}
            onClick={() => setView("graph")}
            className={`grid h-7 w-8 place-items-center rounded-full transition-colors ${
              view === "graph" ? "bg-white text-[var(--color-ink)] shadow-sm" : "text-[var(--color-gray-600)]"
            }`}
          >
            <LineChart size={14} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            aria-label="Show table"
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
            className={`grid h-7 w-8 place-items-center rounded-full transition-colors ${
              view === "table" ? "bg-white text-[var(--color-ink)] shadow-sm" : "text-[var(--color-gray-600)]"
            }`}
          >
            <BarChart3 size={14} strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <div className="flex shrink-0 items-center justify-between px-5 pt-1">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-expanded={periodOpen}
            aria-haspopup="menu"
            onClick={() => setPeriodOpen((open) => !open)}
            className="flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] leading-[18px] text-[var(--color-ink-secondary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <span className="max-[390px]:hidden">{period}</span>
            <span className="min-[391px]:hidden">Period</span>
            <ChevronDown size={13} strokeWidth={1.8} />
          </button>

          {periodOpen ? (
            <div
              role="menu"
              aria-label="Balance period"
              className="absolute left-0 top-10 z-20 w-44 overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-white py-1 shadow-[var(--shadow-popover)]"
            >
              {periods.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={period === option}
                  onClick={() => {
                    setPeriod(option);
                    setPeriodOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-[var(--color-surface)] ${
                    period === option ? "text-[var(--color-primary)]" : "text-[var(--color-ink-secondary)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-[11px] leading-4 max-[390px]:gap-2">
          <span className="text-[#2d7d64]">↗ $1.8M</span>
          <span className="text-[var(--color-ink-muted)]">↘ −$488K</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 px-6 max-[479px]:px-5">
        {view === "graph" ? (
          <div className="flex h-full flex-col justify-end pb-2" aria-label={`Balance graph for ${period}`}>
            <svg className="min-h-0 w-full flex-1" viewBox="0 0 420 145" preserveAspectRatio="none" role="img" aria-label="Balance trend">
              <defs>
                <linearGradient id="balance-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-indigo-100)" stopOpacity="0.9" />
                  <stop offset="1" stopColor="var(--color-indigo-100)" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d="M0 112 C31 108 51 91 82 94 S129 104 160 76 S205 53 239 67 S285 78 319 47 S371 26 420 31 L420 145 L0 145 Z" fill="url(#balance-area)" />
              <path d="M0 112 C31 108 51 91 82 94 S129 104 160 76 S205 53 239 67 S285 78 319 47 S371 26 420 31" fill="none" stroke="var(--color-indigo-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="420" cy="31" r="3" fill="white" stroke="var(--color-indigo-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="flex justify-between pt-2 text-[11px] leading-4 text-[var(--color-gray-600)]">
              {chartDates.map((date) => <span key={date}>{date}</span>)}
            </div>
          </div>
        ) : (
          <dl className="grid h-full content-center gap-2 pb-2 text-[13px] leading-[18px]">
            {[
              ["Total current", "$5,144,707.08"],
              ["Total available", "$5,144,707.08"],
              ["Pending transfers", "$71,764.10"],
              ["Pending deposits", "$1,000.00"],
            ].map(([label, amount]) => (
              <div key={label} className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 last:border-0">
                <dt className="text-[var(--color-ink-muted)]">{label}</dt>
                <dd className="text-[var(--color-ink)]"><Amount privateMode={privateMode}>{amount}</Amount></dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-[var(--color-border)] px-6 text-[13px] leading-[18px] text-[var(--color-ink-muted)] max-[479px]:px-5">
        <span>Across 4 accounts</span>
        <button type="button" aria-label="More balance options" className="grid h-7 w-7 place-items-center rounded-full hover:bg-[var(--color-surface)]">
          <MoreHorizontal size={16} />
        </button>
      </footer>
    </Card>
  );
}
