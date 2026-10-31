import { describe, expect, it } from "vitest";
import { getPresetRange, validateDateRange } from "./date-range";

describe("date ranges", () => {
  const today = new Date("2026-10-31T12:00:00Z");
  it("builds an inclusive last-30-days range", () => {
    expect(getPresetRange("last-30-days", today)).toEqual({ preset: "last-30-days", from: "2026-10-02", to: "2026-10-31", label: "Last 30 days" });
  });
  it("rejects a custom range whose end precedes its start", () => {
    expect(validateDateRange("2026-10-31", "2026-10-01")).toEqual({ valid: false, message: "End date must be on or after start date." });
  });
  it.each([
    ["today", "2026-10-31", "Today"],
    ["last-7-days", "2026-10-25", "Last 7 days"],
    ["this-month", "2026-10-01", "This month"],
    ["last-90-days", "2026-08-03", "Last 90 days"],
    ["this-year", "2026-01-01", "This year"],
  ] as const)("builds %s with UTC dates", (preset, from, label) => {
    expect(getPresetRange(preset, today)).toEqual({ preset, from, to: "2026-10-31", label });
  });
  it("handles month boundaries using UTC", () => {
    expect(getPresetRange("last-7-days", new Date("2026-01-02T00:30:00+02:00")).from).toBe("2025-12-26");
  });
  it("accepts inclusive ranges and rejects invalid calendar dates", () => {
    expect(validateDateRange("2026-10-31", "2026-10-31")).toEqual({ valid: true });
    expect(validateDateRange("2026-02-30", "2026-10-31").valid).toBe(false);
    expect(validateDateRange("", "2026-10-31").valid).toBe(false);
  });
});
