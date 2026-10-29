import { FileText } from "lucide-react";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";

type BillPayModuleProps = {
  privateMode: boolean;
};

export function BillPayModule({ privateMode }: BillPayModuleProps) {
  return (
    <Card className="flex h-[232px] min-w-0 flex-col overflow-hidden p-5">
      <div className="flex items-center gap-2 text-[15px] text-[var(--color-ink-secondary)]">
        <FileText aria-hidden="true" size={16} strokeWidth={1.7} />
        <span>Bill Pay</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-ink)]">11</p>
          <p className="mt-1 text-[12px] leading-4 text-[var(--color-ink-muted)]">Outstanding</p>
        </div>
        <div>
          <p className="text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-negative)]">1</p>
          <p className="mt-1 text-[12px] leading-4 text-[var(--color-ink-muted)]">Overdue</p>
        </div>
        <div>
          <p className="text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-ink)]">–</p>
          <p className="mt-1 text-[12px] leading-4 text-[var(--color-ink-muted)]">Due soon</p>
        </div>
      </div>

      <div className="my-4 h-px bg-[var(--color-border)]" />

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-[var(--color-ink-muted)]">Inbox</p>
          <p className="truncate text-[15px] leading-5 text-[var(--color-ink-secondary)]">
            3 items · {privateMode ? <span aria-label="Amount hidden">••••</span> : "$10K"}
          </p>
        </div>
        <Button size="sm">View</Button>
      </div>
    </Card>
  );
}
