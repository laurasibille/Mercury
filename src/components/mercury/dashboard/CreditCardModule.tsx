import { CreditCard } from "lucide-react";
import { Button } from "../primitives/Button";
import { Card } from "../primitives/Card";

type CreditCardModuleProps = {
  privateMode: boolean;
};

function Amount({ children, privateMode }: { children: string; privateMode: boolean }) {
  return <span aria-label={privateMode ? "Amount hidden" : children}>{privateMode ? "••••••" : children}</span>;
}

export function CreditCardModule({ privateMode }: CreditCardModuleProps) {
  return (
    <Card className="flex h-[232px] min-w-0 flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] text-[var(--color-ink-secondary)]">
          <CreditCard aria-hidden="true" size={16} strokeWidth={1.7} />
          <span>Credit Card</span>
        </div>
        <span className="text-[13px] text-[var(--color-ink-muted)]">November</span>
      </div>

      <p className="mt-4 text-[24px] leading-8 tracking-[-0.02em] text-[var(--color-ink)]">
        <Amount privateMode={privateMode}>$12,505.87</Amount>
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-gray-150)]" aria-label="Credit used">
        <div className="h-full w-[37%] rounded-full bg-[var(--color-primary)]" />
      </div>
      <div className="mt-2 flex items-center gap-4 text-[12px] leading-4 text-[var(--color-ink-muted)]">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />Balance</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[var(--color-gray-300)]" />Pending</span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="min-w-0 text-[13px] leading-[18px] text-[var(--color-ink-muted)]">
          <p><strong className="font-normal text-[var(--color-ink-secondary)]"><Amount privateMode={privateMode}>$21,249</Amount></strong> available</p>
          <p>Autopay Nov 3</p>
        </div>
        <Button size="sm">Pay</Button>
      </div>
    </Card>
  );
}
