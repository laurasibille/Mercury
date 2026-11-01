import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";
import { TransactionsPage } from "./TransactionsPage";

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);

let addTransactionFromProvider = () => {};

function renderPage() {
  return render(<SwapizProvider><TransactionsPage /><MutationControls /></SwapizProvider>);
}

function MutationControls() {
  const { dispatch, state } = useSwapiz();
  useEffect(() => { addTransactionFromProvider = () => dispatch({ type: "transaction/added", transaction: { id: "live-demo-1", date: "2026-10-31", time: "16:00", organizationId: "amazon", type: "receive", amountLabel: "+12 USDT", usdValue: 12, asset: "USDT", network: "TRON · TRC-20", wallet: "Master", source: "Demo receive request", status: "pending" } }); }, [dispatch]);
  return <>
    <button type="button" onClick={addTransactionFromProvider}>Add transaction</button>
    <button type="button" onClick={() => dispatch({ type: "transaction/added", transaction: { id: "safe-csv", date: "2026-10-31", time: "16:01", organizationId: "amazon", type: "send", amountLabel: "1 USDT", usdValue: 1, asset: "USDT", network: "TRON · TRC-20", wallet: "=1+1", source: "=cmd|' /C calc'!A0", status: "completed" } })}>Add formula transaction</button>
    <output aria-label="Global filters">{state.scopeId} {state.dateRange.preset}</output>
  </>;
}

describe("Transactions page", () => {
  it("filters by type and searches transaction IDs before opening accessible details", async () => {
    const user = userEvent.setup();
    renderPage();
    screen.getByRole("tab", { name: "Send" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Receive" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Receive" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Send" }));
    const table = screen.getByRole("table", { name: "Transactions" });
    expect(within(table).getAllByRole("row").slice(1).every(row => row.textContent?.includes("Send"))).toBe(true);
    await user.type(screen.getByRole("searchbox", { name: "Search transactions" }), "183796");
    expect(screen.getByText("#183796")).toBeVisible();
    await user.click(screen.getAllByRole("button", { name: "View transaction 183796" })[0]);
    const dialog = screen.getByRole("dialog", { name: "Transaction 183796" });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("payout · Mid Send Wallet")).toBeVisible();
  });

  it("applies company, status, and date filters locally", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.selectOptions(screen.getByLabelText("Company"), "amazon");
    await user.selectOptions(screen.getByLabelText("Status"), "processing");
    expect(screen.getByText("#183796")).toBeVisible();
    expect(screen.queryByText("#183794")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Today" }));
    expect(screen.getByText("#183796")).toBeVisible();
    expect(screen.getByLabelText("Global filters")).toHaveTextContent("all last-30-days");
  });

  it("includes a company’s departments when filtering its ledger", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.selectOptions(screen.getByLabelText("Company"), "amazon");
    expect(screen.getByText("#183796")).toBeVisible();
    expect(screen.getByText("#183795")).toBeVisible();
    expect(screen.queryByText("#183794")).not.toBeInTheDocument();
  });

  it("keeps the selected transaction detail stable while live records update", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getAllByRole("button", { name: "View transaction 183796" })[0]);
    act(() => addTransactionFromProvider());
    expect(screen.getByRole("dialog", { name: "Transaction 183796" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close details" }));
    expect(screen.getByText("#live-demo-1")).toBeVisible();
    expect(screen.getByLabelText("Global filters")).toHaveTextContent("all last-30-days");
  });

  it("exports only the filtered records with safe CSV cells", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn((blob: Blob) => { expect(blob).toBeInstanceOf(Blob); return "blob:transactions"; });
    const revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    renderPage();
    await user.type(screen.getByRole("searchbox", { name: "Search transactions" }), "183796");
    await user.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: "text/csv;charset=utf-8" }));
    const csv = await (createObjectURL.mock.calls[0][0] as Blob).text();
    expect(csv).toContain('"183796","2026-10-31","14:52","Send","−8,000.00 USDT","8000.00"');
    expect(screen.getByText("Exported 1 transaction to CSV.")).toBeInTheDocument();
    expect(screen.queryByText("#183795")).not.toBeInTheDocument();
  });

  it("neutralizes formula-like cells in the exported CSV", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn((blob: Blob) => { expect(blob).toBeInstanceOf(Blob); return "blob:transactions"; });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    renderPage();
    await user.click(screen.getByRole("button", { name: "Add formula transaction" }));
    await user.type(screen.getByRole("searchbox", { name: "Search transactions" }), "safe-csv");
    await user.click(screen.getByRole("button", { name: "Export CSV" }));
    const csv = await (createObjectURL.mock.calls[0][0] as Blob).text();
    expect(csv).toContain('"safe-csv"');
    expect(csv).toContain("'=cmd");
    expect(csv).toContain("'=1+1");
  });

  it("offers the same transaction fields in responsive stacked records", () => {
    renderPage();
    expect(screen.getByRole("table", { name: "Transactions" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Transaction cards" })).toBeInTheDocument();
    expect(screen.getAllByText("Network").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Company / wallet").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Source").length).toBeGreaterThan(1);
  });
});
