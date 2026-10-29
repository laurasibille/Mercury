"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { transactionTabs, transactions } from "@/data/mercury-dashboard";

type TransactionsTableProps = {
  privateMode: boolean;
};

const columnLabels = ["Date", "To / From", "Amount", "Account", "Method"];

function displayedAmount(amount: string, privateMode: boolean) {
  return privateMode ? "••••••" : amount;
}

export function TransactionsTable({ privateMode }: TransactionsTableProps) {
  const [activeTab, setActiveTab] = useState<(typeof transactionTabs)[number]>(transactionTabs[0]);

  return (
    <section aria-labelledby="transactions-title" className="w-full min-w-0 py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2
          id="transactions-title"
          className="text-[19px] leading-7 font-normal text-[var(--color-ink)]"
        >
          Transactions
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[13px] leading-[18px] text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-primary-hover)]"
        >
          View all
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Transaction filters"
        className="mb-2 flex max-w-full gap-1 overflow-x-auto border-b border-[var(--color-border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {transactionTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`relative h-10 shrink-0 px-3 text-[13px] leading-[18px] transition-colors duration-[var(--duration-fast)] first:pl-0 ${
                isActive
                  ? "text-[var(--color-ink)] after:absolute after:inset-x-3 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-[var(--color-primary)] first:after:left-0"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-hidden sm:block">
        <table className="w-full table-fixed border-collapse text-left text-[13px] leading-[18px]">
          <thead>
            <tr className="h-10 text-[var(--color-ink-muted)]">
              {columnLabels.map((label, index) => (
                <th
                  key={label}
                  scope="col"
                  className={`border-b border-[var(--color-border)] px-3 font-normal first:w-[86px] first:pl-0 last:pr-0 ${
                    index === 1 ? "w-[26%]" : index === 2 ? "w-[17%] text-right" : ""
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(([date, party, amount, account, method], index) => (
              <tr
                key={`${date}-${party}-${index}`}
                className="h-[52px] border-b border-[var(--color-border)] text-[var(--color-ink-secondary)] transition-colors duration-[var(--duration-fast)] last:border-b-0 hover:bg-[var(--color-canvas-subtle)]"
              >
                <td className="px-3 pl-0 text-[var(--color-ink-muted)]">{date}</td>
                <td className="truncate px-3 text-[var(--color-ink)]">{party}</td>
                <td className="px-3 text-right tabular-nums text-[var(--color-ink)]">
                  {displayedAmount(amount, privateMode)}
                </td>
                <td className="truncate px-3">{account}</td>
                <td className="truncate px-3 pr-0">{method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        {transactions.map(([date, party, amount, account, method], index) => (
          <article
            key={`${date}-${party}-${index}`}
            className="border-b border-[var(--color-border)] py-3 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 truncate text-[13px] leading-[18px] text-[var(--color-ink)]">{party}</p>
                <p className="m-0 truncate text-[12px] leading-[18px] text-[var(--color-ink-muted)]">
                  {date} · {account}
                </p>
              </div>
              <span className="shrink-0 text-[13px] leading-[18px] tabular-nums text-[var(--color-ink)]">
                {displayedAmount(amount, privateMode)}
              </span>
            </div>
            <p className="mt-1 mb-0 truncate text-[12px] leading-[18px] text-[var(--color-ink-muted)]">{method}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
