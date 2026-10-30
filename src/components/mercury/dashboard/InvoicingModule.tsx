import { ReceiptText } from "lucide-react";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";

type InvoicingModuleProps = {
  privateMode: boolean;
};

function PrivateAmount({ children, privateMode }: { children: string; privateMode: boolean }) {
  return <span aria-label={privateMode ? "Amount hidden" : children}>{privateMode ? "••••" : children}</span>;
}

export function InvoicingModule({ privateMode }: InvoicingModuleProps) {
  return (
    <Card className="flex h-[232px] min-w-0 flex-col overflow-hidden p-5">
      <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
        <ReceiptText aria-hidden="true" size={16} strokeWidth={1.7} />
        <span>Invoicing</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <p className="text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-negative)]">4</p>
          <p className="mt-1 text-[12px] leading-4 text-[var(--color-ink-muted)]">Overdue · <PrivateAmount privateMode={privateMode}>$950</PrivateAmount></p>
        </div>
        <div>
          <p className="text-[22px] leading-7 tracking-[-0.02em] text-[var(--color-ink)]">12</p>
          <p className="mt-1 text-[12px] leading-4 text-[var(--color-ink-muted)]">Paid · <PrivateAmount privateMode={privateMode}>$6K</PrivateAmount></p>
        </div>
      </div>

      <div className="my-4 h-px bg-[var(--color-border)]" />

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] leading-[18px] text-[var(--color-ink-muted)]">Open</p>
          <p className="truncate text-[14px] leading-5 text-[var(--color-ink-secondary)]">
            12 items · <PrivateAmount privateMode={privateMode}>$12.3K</PrivateAmount>
          </p>
        </div>
        <Button size="sm">View</Button>
      </div>
    </Card>
  );
}
