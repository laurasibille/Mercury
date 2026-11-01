import { CircleCheck, CircleX, Clock3, LoaderCircle, ShieldAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity, TransactionStatus } from "@/types/swapiz";

type Status = TransactionStatus | Severity;
type Tone = "info" | "success" | "warning" | "critical";

const statuses: Record<Status, { label: string; icon: LucideIcon; tone: Tone }> = {
  processing: { label: "Processing", icon: LoaderCircle, tone: "info" },
  completed: { label: "Completed", icon: CircleCheck, tone: "success" },
  failed: { label: "Failed", icon: CircleX, tone: "critical" },
  pending: { label: "Pending", icon: Clock3, tone: "warning" },
  quarantine: { label: "Quarantine", icon: ShieldAlert, tone: "critical" },
  critical: { label: "Critical", icon: ShieldAlert, tone: "critical" },
  warning: { label: "Warning", icon: TriangleAlert, tone: "warning" },
  ok: { label: "OK", icon: CircleCheck, tone: "success" },
};

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, icon: Icon, tone } = statuses[status];

  return (
    <span className={cn("swapiz-status-badge", `swapiz-status-${tone}`, className)}>
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  );
}
