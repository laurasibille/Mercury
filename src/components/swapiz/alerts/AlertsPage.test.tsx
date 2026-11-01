import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";
import { SwapizShell } from "../layout/SwapizShell";
import { KpiGrid } from "../dashboard/KpiGrid";
import { AlertsPage } from "./AlertsPage";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/alerts" }));
beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);

function Metrics() {
  const { snapshot } = useSwapiz();
  return <KpiGrid snapshot={snapshot} />;
}
function NewSendApproval() {
  const { dispatch } = useSwapiz();
  return <button type="button" onClick={() => dispatch({ type: "move/open", operation: "send" })}>Create demo Send</button>;
}
function renderPage() {
  return render(<SwapizProvider><SwapizShell><AlertsPage /><Metrics /><NewSendApproval /></SwapizShell></SwapizProvider>);
}

describe("Alerts route", () => {
  it("resolves an alert through review and updates tabs, sidebar, KPIs, and frozen availability", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("tab", { name: "Pending approval 7" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Needs attention 7" }));
    const availableBefore = Number(within(screen.getByRole("article", { name: "Available to move" })).getByText(/\$/).textContent?.replace(/[^\d]/g, ""));
    const review = screen.getByRole("button", { name: "Review Amazon · DarkMatter Link" });
    await user.click(review);
    const dialog = screen.getByRole("dialog", { name: "Sanctions" });
    expect(within(dialog).getByText("Sanctions match · score 0.97 · limit 0.80")).toBeVisible();
    expect(within(dialog).getByText(/No real funds/)).toBeVisible();
    await user.click(within(dialog).getByRole("button", { name: "Resolve alert" }));
    expect(screen.getByRole("tab", { name: "Needs attention 6" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Alerts 13" })).toBeVisible();
    expect(within(screen.getByRole("article", { name: "Needs attention" })).getByText("6")).toBeVisible();
    const availableAfter = Number(within(screen.getByRole("article", { name: "Available to move" })).getByText(/\$/).textContent?.replace(/[^\d]/g, ""));
    expect(availableAfter - availableBefore).toBe(48_200);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Resolved / OK" }));
    expect(screen.getByRole("button", { name: "Review Amazon · DarkMatter Link" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Review Amazon · DarkMatter Link" }));
    expect(screen.queryByRole("button", { name: "Resolve alert" })).not.toBeInTheDocument();
    expect(within(screen.getByRole("dialog")).getByText("Resolved")).toBeVisible();
  });

  it("filters critical, warning, and recoverable alerts and explains an empty filtered scope", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("tab", { name: "Needs attention 7" }));
    await user.click(screen.getByRole("button", { name: "Critical" }));
    expect(screen.getAllByRole("button", { name: /^Review / })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Warning" }));
    expect(screen.getAllByRole("button", { name: /^Review / })).toHaveLength(5);
    expect(screen.getByText("AML velocity")).toBeVisible();
    expect(screen.getByText("Low balance")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Resolved / OK" }));
    expect(screen.getByText("Unfreeze")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "All companies" }));
    await user.click(screen.getByRole("option", { name: "Support" }));
    expect(screen.getByRole("tab", { name: "Needs attention 0" })).toBeVisible();
    expect(screen.getByText("No alerts match these filters.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("tab", { name: "Needs attention 7" })).toBeVisible();
  });

  it("filters approval types and resolves an approval without claiming execution", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.selectOptions(screen.getByLabelText("Request type"), "Transfer");
    expect(screen.getAllByRole("button", { name: /^Review / })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Review Company wallet (cold) → Master · Amazon · USDT" }));
    const dialog = screen.getByRole("dialog", { name: "Transfer request" });
    expect(within(dialog).getByText("1 of 2 approvals")).toBeVisible();
    expect(within(dialog).getByText("Julia Park")).toBeVisible();
    await user.click(within(dialog).getByRole("button", { name: "Resolve approval" }));
    expect(screen.getByRole("tab", { name: "Pending approval 6" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Alerts 13" })).toBeVisible();
    expect(within(screen.getByRole("article", { name: "Pending approvals" })).getByText("6")).toBeVisible();
    expect(screen.getByText("No approval requests match these filters.")).toBeVisible();
    await user.selectOptions(screen.getByLabelText("Approval status"), "resolved");
    expect(screen.getByRole("button", { name: "Review Company wallet (cold) → Master · Amazon · USDT" })).toBeVisible();
  });

  it("shows a new requested crypto amount in the queue, detail, and KPI breakdown", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Create demo Send" }));
    await user.type(screen.getAllByLabelText("Amount")[0], "125");
    await user.type(screen.getAllByLabelText("Recipient address")[0], "TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: "Create demo approval" }));
    await user.click(screen.getByRole("button", { name: "Return to dashboard" }));
    const request = screen.getByRole("button", { name: /^Review Send 125/ });
    expect(request.parentElement).toHaveTextContent("125 USDT");
    expect(screen.getByRole("article", { name: "Pending approvals" })).toHaveTextContent("125 USDT");
    expect(screen.getByRole("article", { name: "Pending approvals" })).toHaveTextContent("EUR");
    await user.click(request);
    expect(screen.getByRole("dialog")).toHaveTextContent("125 USDT");
  });

  it("supports keyboard tabs and restores detail-trigger focus after Escape", async () => {
    const user = userEvent.setup();
    renderPage();
    screen.getByRole("tab", { name: "Pending approval 7" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Needs attention 7" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Needs attention 7" })).toBeVisible();
    const review = screen.getByRole("button", { name: "Review Amazon · DarkMatter Link" });
    await user.click(review);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(review).toHaveFocus();
  });
});
