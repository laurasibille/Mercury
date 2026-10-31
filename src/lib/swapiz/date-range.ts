import type { DatePreset, DateRange } from "@/types/swapiz";
import { getDemoNow } from "./demo-clock";

const iso = (date: Date) => date.toISOString().slice(0, 10);

export function getPresetRange(preset: DatePreset, today = getDemoNow()): DateRange {
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  const labels: Record<DatePreset, string> = { today: "Today", "last-7-days": "Last 7 days", "last-30-days": "Last 30 days", "this-month": "This month", "last-90-days": "Last 90 days", "this-year": "This year", custom: "Custom range" };
  if (preset === "last-7-days") start.setUTCDate(start.getUTCDate() - 6);
  if (preset === "last-30-days") start.setUTCDate(start.getUTCDate() - 29);
  if (preset === "last-90-days") start.setUTCDate(start.getUTCDate() - 89);
  if (preset === "this-month") start.setUTCDate(1);
  if (preset === "this-year") start.setUTCMonth(0, 1);
  return { preset, from: iso(start), to: iso(end), label: labels[preset] };
}

export function validateDateRange(from: string, to: string): { valid: boolean; message?: string } {
  const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && iso(new Date(value)) === value;
  if (!isDate(from) || !isDate(to)) return { valid: false, message: "Enter valid start and end dates." };
  if (to < from) return { valid: false, message: "End date must be on or after start date." };
  return { valid: true };
}
