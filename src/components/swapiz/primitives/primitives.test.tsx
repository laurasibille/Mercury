import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";

afterEach(cleanup);

describe("Swapiz primitives", () => {
  it("renders a semantic glass article", () => {
    render(<GlassCard as="article">Balance</GlassCard>);
    expect(screen.getByRole("article", { name: "Balance" })).toHaveClass("swapiz-glass");
  });

  it("preserves an explicit accessible label and custom classes", () => {
    render(<GlassCard as="section" aria-label="Treasury balance" className="tnum">$25</GlassCard>);
    expect(screen.getByRole("region", { name: "Treasury balance" })).toHaveClass("swapiz-glass", "tnum");
  });

  it("allows a heading to provide the accessible name", () => {
    render(<GlassCard aria-labelledby="balance-heading"><h2 id="balance-heading">Balance history</h2></GlassCard>);
    expect(screen.getByRole("region", { name: "Balance history" })).toBeVisible();
  });

  it.each([
    ["processing", "Processing"],
    ["completed", "Completed"],
    ["failed", "Failed"],
    ["pending", "Pending"],
    ["quarantine", "Quarantine"],
    ["critical", "Critical"],
    ["warning", "Warning"],
    ["ok", "OK"],
  ] as const)("renders %s status text in addition to a decorative icon", (status, label) => {
    render(<StatusBadge status={status} />);
    const badge = screen.getByText(label);
    expect(badge).toBeVisible();
    expect(badge.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("preserves custom classes for alert severity", () => {
    render(<StatusBadge status="critical" className="alert-severity" />);
    expect(screen.getByText("Critical")).toHaveClass("alert-severity");
  });
});
