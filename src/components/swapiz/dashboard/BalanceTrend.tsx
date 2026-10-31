import { useId } from "react";
import type { DashboardSnapshot } from "@/types/swapiz";
import { GlassCard } from "../primitives/GlassCard";
import { chartColors, compactUsd, fullDate, headingClass, metadataClass, organizationName, panelClass, ResetFilters, shortDate, usd } from "./overview-format";

const dashes = [undefined, "8 4", "3 4", "12 3 3 3", "2 3", "10 5", "6 3 2 3"];

export function BalanceTrend({ snapshot, onReset }: { snapshot: DashboardSnapshot; onReset: () => void }) {
  const descriptionId = useId();
  const fillId = useId();
  const observations = snapshot.observations;
  const ids = [...new Set(observations.map(item => item.organizationId))];
  const dates = [...new Set(observations.map(item => item.date))];
  const max = Math.max(1, ...observations.map(item => item.usd));
  const start = Date.parse(`${dates[0]}T00:00:00Z`);
  const duration = Math.max(1, Date.parse(`${dates.at(-1)}T00:00:00Z`) - start);
  const x = (date: string) => dates.length === 1 ? 300 : 12 + (Date.parse(`${date}T00:00:00Z`) - start) / duration * 576;
  const y = (value: number) => 190 - value / max * 174;
  const series = ids.map((id, index) => ({ id, color: chartColors[index % chartColors.length], points: observations.filter(item => item.organizationId === id) }));

  return <GlassCard aria-label="Balance trend" className={panelClass}>
    <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className={headingClass}>Balance trend</h2><p className={`${metadataClass} mt-1`}>Daily observations by company or department</p></div><span className={`${metadataClass} tnum`}>USD</span></div>
    {observations.length ? <>
      <div aria-hidden="true" className={`mt-6 flex justify-between ${metadataClass} tnum`}><span>{compactUsd.format(max)}</span><span>Latest: {fullDate.format(new Date(`${dates.at(-1)}T00:00:00Z`))}</span></div>
      <svg role="img" aria-label="Balance trend by company or department" aria-describedby={descriptionId} viewBox="0 0 600 204" className="mt-1 h-[204px] w-full" preserveAspectRatio="none">
        <defs><linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.13" /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" /></linearGradient></defs>
        {[16, 74, 132, 190].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="3 5" />)}
        {series.map(({ id, color, points }, index) => {
          const coordinates = points.map(point => `${x(point.date)},${y(point.usd)}`).join(" ");
          return <g key={id}>{series.length === 1 && points.length > 1 && <polygon points={`${x(points[0].date)},190 ${coordinates} ${x(points.at(-1)!.date)},190`} fill={`url(#${fillId})`} />}
            <polyline points={coordinates} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashes[index % dashes.length]} vectorEffect="non-scaling-stroke" />
            {points.map((point, pointIndex) => pointIndex === points.length - 1 || points.length === 1 ? <circle key={point.date} cx={x(point.date)} cy={y(point.usd)} r="3.5" fill={color} stroke="var(--color-canvas)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /> : null)}
          </g>;
        })}
      </svg>
      <p id={descriptionId} className="sr-only">{series.map(({ id, points }) => `${organizationName(id)}: ${usd.format(points[0].usd)} on ${fullDate.format(new Date(`${points[0].date}T00:00:00Z`))} to ${usd.format(points.at(-1)!.usd)} on ${fullDate.format(new Date(`${points.at(-1)!.date}T00:00:00Z`))}.`).join(" ")}</p>
      <div aria-hidden="true" className={`flex justify-between ${metadataClass} tnum`}><span>{shortDate.format(new Date(`${dates[0]}T00:00:00Z`))}</span><span>{shortDate.format(new Date(`${dates.at(-1)}T00:00:00Z`))}</span></div>
      <ul aria-label="Balance series" className="mt-5 flex flex-wrap gap-x-5 gap-y-2">{series.map(({ id, color }, index) => <li key={id} className={`flex items-center gap-2 ${metadataClass}`}><svg width="22" height="12" aria-hidden="true"><line x1="0" x2="22" y1="6" y2="6" stroke={color} strokeWidth="2.5" strokeDasharray={dashes[index % dashes.length]} /></svg>{organizationName(id)}</li>)}</ul>
    </> : <div className="flex min-h-[280px] flex-col items-center justify-center text-center"><p className="text-sm leading-5 text-[var(--color-ink-secondary)]">No balance observations for this scope and date range.</p><ResetFilters onReset={onReset} /></div>}
  </GlassCard>;
}
