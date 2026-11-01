import { CircleCheck, CircleX, Clock3, FilePenLine } from "lucide-react";
import type { MoneyFlowRule } from "@/types/swapiz";
import { organizationName } from "../dashboard/overview-format";
import { mutedClass, panelClass } from "./company-data";

const statuses = {
  active: { label: "Active", icon: CircleCheck, tone: "success" },
  pending: { label: "Pending", icon: Clock3, tone: "warning" },
  rejected: { label: "Rejected", icon: CircleX, tone: "critical" },
  draft: { label: "Draft", icon: FilePenLine, tone: "info" },
};

export function MoneyFlowRules({ rules, companyName }: { rules: MoneyFlowRule[]; companyName: string }) {
  return <div className="space-y-6">
    <p className={mutedClass}>Routing instructions from the demo. Only active rules are approved; pending, rejected, and draft rules remain visible for review.</p>
    {(["receive", "exchange"] as const).map(kind => {
      const items = rules.filter(item => item.kind === kind);
      const title = kind === "receive" ? "Receive rules" : "Exchange rules";
      return <section aria-label={title} key={kind} className="min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-3"><h2 className="text-base font-medium">{title}</h2><span className={mutedClass}>{items.length} rules</span></div>
        {items.length ? <div className="grid min-w-0 gap-3 lg:grid-cols-2">{items.map(rule => {
          const status = statuses[rule.status];
          const Icon = status.icon;
          const fields = kind === "receive" ? [["Share", rule.sharePercent === undefined ? "—" : `${rule.sharePercent}%`], ["Minimum", rule.minimum ?? "—"], ["Cap", rule.maximum ?? "—"], ["Approver", rule.approvedBy ?? "—"]] : [["Trigger", rule.trigger ?? "—"], ["Action", rule.action ?? "—"], ["Amount", rule.amount ?? "—"], ["Approver", rule.approvedBy ?? "Not recorded"]];
          return <article key={rule.id} aria-label={rule.name} className={`${panelClass} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><h3 className="break-words text-sm font-medium">{rule.name}</h3><p className={`${mutedClass} mt-1`}>{organizationName(rule.organizationId)}</p></div><span className={`swapiz-status-badge swapiz-status-${status.tone}`}><Icon size={14} aria-hidden="true" />{status.label}</span></div>
            <dl className="mt-4 space-y-3 text-sm"><div><dt className={mutedClass}>Source</dt><dd className="mt-0.5 break-words">{rule.source}</dd></div><div><dt className={mutedClass}>Target</dt><dd className="mt-0.5 break-words">{rule.target}</dd></div></dl>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-4 text-sm">{fields.map(([label, value]) => <div key={label} className="min-w-0"><dt className={mutedClass}>{label}</dt><dd className="tnum mt-0.5 break-words">{value}</dd></div>)}</dl>
          </article>;
        })}</div> : <div className={`${panelClass} p-6 text-sm text-[var(--color-ink-secondary)]`}>No {kind} rules recorded for {companyName}.</div>}
      </section>;
    })}
  </div>;
}
