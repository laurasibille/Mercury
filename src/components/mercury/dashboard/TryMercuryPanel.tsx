"use client";

import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Command, Lightbulb } from "lucide-react";
import { tryTasks } from "@/data/mercury-dashboard";

type Category = keyof typeof tryTasks;

const categories = Object.keys(tryTasks) as Category[];

function PanelContent() {
  const [category, setCategory] = useState<Category>("Startup");

  return (
    <>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => {
          const selected = category === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(item)}
              className={`h-8 shrink-0 rounded-[var(--radius-pill)] px-3 text-[13px] leading-[18px] transition-colors duration-[var(--duration-fast)] ${
                selected
                  ? "bg-[var(--color-ink)] text-[var(--color-white)]"
                  : "bg-[var(--color-surface)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <ul className="m-0 flex-1 list-none p-0 pt-3">
        {tryTasks[category].map((task, index) => (
          <li
            key={task}
            className="flex min-h-[52px] items-center gap-3 border-b border-[var(--color-border)] text-[13px] leading-[18px] text-[var(--color-ink-secondary)] last:border-b-0"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-gray-200)] bg-[var(--color-canvas)] text-[var(--color-gray-400)]">
              {index === 0 ? <Check aria-hidden="true" size={13} strokeWidth={2} /> : <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gray-300)]" />}
            </span>
            <span>{task}</span>
          </li>
        ))}
      </ul>

      <footer className="mt-auto grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-4">
        <button
          type="button"
          className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] p-2 text-left text-[12px] leading-[18px] text-[var(--color-ink-secondary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)]"
        >
          <Lightbulb aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" size={16} strokeWidth={1.8} />
          <span>Understand your data</span>
        </button>
        <button
          type="button"
          className="flex min-w-0 items-center justify-end gap-2 rounded-[var(--radius-md)] p-2 text-right text-[12px] leading-[18px] text-[var(--color-ink-secondary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)]"
        >
          <Command aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" size={16} strokeWidth={1.8} />
          <span>Try Command</span>
        </button>
      </footer>
    </>
  );
}

export function TryMercuryPanel() {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside
        aria-label="Try Mercury"
        className={`fixed right-7 bottom-20 z-40 hidden overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-white)] shadow-[var(--shadow-popover)] transition-[width,height] duration-[var(--duration-panel)] min-[961px]:flex ${
          desktopOpen ? "h-[516px] w-[463px] flex-col p-6" : "h-14 w-[260px] items-center px-5"
        }`}
      >
        <header className={`flex w-full items-center justify-between gap-4 ${desktopOpen ? "mb-5" : ""}`}>
          <div className="min-w-0">
            <h2 className="m-0 truncate text-[17px] leading-6 font-normal text-[var(--color-ink)]">
              Try out Mercury for yourself
            </h2>
            {desktopOpen && (
              <p className="mt-1 mb-0 text-[13px] leading-[18px] text-[var(--color-ink-muted)]">
                Explore a few ways Mercury helps your business.
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={desktopOpen ? "Collapse Try Mercury" : "Expand Try Mercury"}
            aria-expanded={desktopOpen}
            onClick={() => setDesktopOpen((open) => !open)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          >
            {desktopOpen ? <ChevronDown aria-hidden="true" size={18} /> : <ChevronUp aria-hidden="true" size={18} />}
          </button>
        </header>
        {desktopOpen && <PanelContent />}
      </aside>

      <aside
        aria-label="Learn more about Mercury"
        className={`fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-white)] shadow-[var(--shadow-popover)] transition-[height] duration-[var(--duration-panel)] min-[961px]:hidden ${
          mobileOpen ? "h-[min(516px,calc(100dvh-24px))] flex-col p-5" : "h-14 items-center px-5"
        }`}
      >
        <header className={`flex w-full items-center justify-between gap-4 ${mobileOpen ? "mb-4" : ""}`}>
          <div className="flex min-w-0 items-center gap-2">
            {!mobileOpen && <Lightbulb aria-hidden="true" size={17} className="shrink-0 text-[var(--color-primary)]" />}
            <h2 className="m-0 truncate text-[14px] leading-5 font-normal text-[var(--color-ink)]">
              {mobileOpen ? "Try out Mercury for yourself" : "Learn more about Mercury"}
            </h2>
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? "Collapse Mercury tips" : "Expand Mercury tips"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-8 shrink-0 items-center gap-1 rounded-full px-2 text-[13px] text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)]"
          >
            {mobileOpen ? "Close" : "Explore"}
            {mobileOpen ? <ChevronDown aria-hidden="true" size={16} /> : <ArrowUpRight aria-hidden="true" size={15} />}
          </button>
        </header>
        {mobileOpen && <PanelContent />}
      </aside>
    </>
  );
}
