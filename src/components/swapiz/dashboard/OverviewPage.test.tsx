import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";
import { OverviewPage } from "./OverviewPage";

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: (media: string) => ({
    matches: false, media, addEventListener: () => {}, removeEventListener: () => {},
  }) });
});
afterEach(cleanup);

function MutationControls() {
  const { dispatch, state } = useSwapiz();
  return <>
    <button onClick={() => { dispatch({ type: "approval/resolved", approvalId: "a1" }); dispatch({ type: "alert/resolved", alertId: "n1" }); }}>Resolve demo items</button>
    <button onClick={() => {
      dispatch({ type: "scope/changed", scopeId: "marketing" });
      dispatch({ type: "date/changed", dateRange: { preset: "custom", from: "2025-01-01", to: "2025-01-31", label: "January 2025" } });
    }}>Select empty period</button>
    <button onClick={() => dispatch({ type: "transaction/added", transaction: { id: "older-demo", organizationId: "amazon", date: "2026-10-03", time: "23:59", type: "receive", amountLabel: "+10 USDT", usdValue: 10, asset: "USDT", network: "TRON", wallet: "Master", source: "demo", status: "completed" } })}>Add older demo transaction</button>
    <output aria-label="Applied filters">{state.scopeId} {state.dateRange.preset}</output>
  </>;
}

function renderOverview() {
  render(<SwapizProvider><OverviewPage /><MutationControls /></SwapizProvider>);
  return userEvent.setup();
}

describe("overview dashboard", () => {
  it("shows the six shared metrics, accessible charts, and source context", () => {
    renderOverview();
    for (const label of ["Total balance", "Available to move", "Net flow", "Upcoming obligations", "Pending approvals", "Needs attention"]) {
      expect(screen.getByRole("article", { name: label })).toBeVisible();
    }
    expect(screen.getByRole("article", { name: "Total balance" })).toHaveTextContent("$3,283,099");
    expect(screen.getByRole("article", { name: "Upcoming obligations" })).toHaveTextContent("$528,832");
    expect(screen.getByRole("article", { name: "Upcoming obligations" })).toHaveTextContent(/demo commitments/i);
    expect(screen.getByRole("img", { name: /Balance trend/ })).toHaveAccessibleDescription(/Amazon.*Marketing/);
    expect(screen.getByRole("img", { name: /Inflow versus outflow/ })).toHaveAccessibleDescription(/Inflow.*Outflow/);
    expect(screen.getByRole("heading", { name: "Asset allocation" })).toBeVisible();
    expect(screen.getByText(/allocation.*may differ.*balance/i)).toBeVisible();
  });

  it("updates metrics and every widget through the shared scope and date controls", async () => {
    const user = renderOverview();
    await user.click(screen.getByRole("button", { name: "All companies" }));
    await user.click(screen.getByRole("option", { name: "Marketing" }));
    expect(screen.getByRole("article", { name: "Total balance" })).toHaveTextContent("$635,242");
    expect(screen.getByRole("article", { name: "Upcoming obligations" })).toHaveTextContent("$75,000");
    expect(screen.getByRole("article", { name: "Pending approvals" })).toHaveTextContent("0");
    expect(screen.getByRole("region", { name: "Priority attention" })).toHaveTextContent("TechFund LLC");
    expect(screen.getByRole("region", { name: "Priority attention" })).not.toHaveTextContent("DarkMatter");
    expect(screen.getByRole("img", { name: /Balance trend/ })).toHaveAccessibleDescription(/Marketing/);
    expect(screen.getByRole("region", { name: "Asset allocation" })).toHaveTextContent("$230,900");
    const transactions = screen.getByRole("region", { name: "Recent transactions" });
    expect(within(transactions).getAllByRole("row")).toHaveLength(4);
    expect(transactions).not.toHaveTextContent("#183796");
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Last 7 days" }));
    expect(screen.getByRole("article", { name: "Total balance" })).toHaveTextContent("$0");
    expect(screen.queryByRole("img", { name: /Balance trend/ })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Asset allocation" })).toHaveTextContent(/No asset balances/);
    expect(transactions).toHaveTextContent("#183795");
  });

  it("reflects provider resolutions in counts and the attention queue", async () => {
    const user = renderOverview();
    expect(screen.getByRole("article", { name: "Pending approvals" })).toHaveTextContent("7");
    expect(screen.getByRole("article", { name: "Needs attention" })).toHaveTextContent("7");
    await user.click(screen.getByRole("button", { name: "Resolve demo items" }));
    expect(screen.getByRole("article", { name: "Pending approvals" })).toHaveTextContent("6");
    expect(screen.getByRole("article", { name: "Needs attention" })).toHaveTextContent("6");
    expect(screen.getByRole("region", { name: "Priority attention" })).not.toHaveTextContent("DarkMatter");
  });

  it("limits the attention queue and newest transactions and links to their routes", () => {
    renderOverview();
    expect(within(screen.getByRole("region", { name: "Priority attention" })).getAllByRole("listitem")).toHaveLength(4);
    const table = screen.getByRole("table", { name: "Recent transactions" });
    expect(within(table).getAllByRole("row")).toHaveLength(7);
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("#183796");
    expect(within(table).getAllByRole("row")[6]).toHaveTextContent("#183791");
    expect(screen.getByRole("link", { name: "View all alerts" })).toHaveAttribute("href", "/dashboard/alerts");
    expect(screen.getByRole("link", { name: "View all transactions" })).toHaveAttribute("href", "/dashboard/transactions");
  });

  it("explains empty filters and resets both scope and date to the default view", async () => {
    const user = renderOverview();
    await user.click(screen.getByRole("button", { name: "Select empty period" }));
    expect(screen.getByText("No balance observations for this scope and date range.")).toBeVisible();
    expect(screen.getByRole("region", { name: "Recent transactions" })).toHaveTextContent(/No transactions/);
    expect(screen.getByRole("region", { name: "Priority attention" })).toHaveTextContent(/No unresolved alerts/);
    await user.click(screen.getAllByRole("button", { name: "Reset filters" })[0]);
    expect(screen.getByLabelText("Applied filters")).toHaveTextContent("all last-30-days");
    expect(screen.getByRole("article", { name: "Total balance" })).toHaveTextContent("$3,283,099");
  });

  it("keeps only the six newest transactions when a backdated demo record is added", async () => {
    const user = renderOverview();
    await user.click(screen.getByRole("button", { name: "Add older demo transaction" }));
    const table = screen.getByRole("table", { name: "Recent transactions" });
    expect(within(table).getAllByRole("row")).toHaveLength(7);
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("#183796");
    expect(table).not.toHaveTextContent("older-demo");
  });
});
