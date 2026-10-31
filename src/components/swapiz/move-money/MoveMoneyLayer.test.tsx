import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";
import type { MoveOperation } from "@/types/swapiz";
import { MoveMoneyLayer } from "./MoveMoneyLayer";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

function Harness({ operation = null }: { operation?: MoveOperation | null }) {
  const { state, dispatch, snapshot } = useSwapiz();
  return <><button onClick={() => dispatch({ type: "move/open", operation })}>Open movement</button><output aria-label="Demo records">{JSON.stringify({ approvals: state.approvals, transactions: state.transactions, snapshot: { approvals: snapshot.approvals, transactions: snapshot.transactions } })}</output><MoveMoneyLayer /></>;
}
async function open(operation: MoveOperation | null = null) {
  const user = userEvent.setup();
  render(<SwapizProvider><Harness operation={operation} /></SwapizProvider>);
  await user.click(screen.getByRole("button", { name: "Open movement" }));
  return user;
}
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const records = () => JSON.parse(screen.getByLabelText("Demo records").textContent!);
const tron = "TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa";

describe("global Move money", () => {
  it.each(["send", "receive"] as const)("keeps a new %s request in the default snapshot when the wall clock is outside the demo period", async operation => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-01-15T09:30:00Z"));
    const user = await open(operation);
    change("Amount", "50");
    if (operation === "send") change("Recipient address", tron);
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: operation === "send" ? "Create demo approval" : "Create demo request" }));
    const key = operation === "send" ? "approvals" : "transactions";
    const created = records()[key][0];
    expect(records().snapshot[key].some((record: { id: string }) => record.id === created.id)).toBe(true);
    expect(created.date).toBe("2026-10-31");
  });

  it("shows every operation in an accessible modal and moves focus inside", async () => {
    const user = await open();
    const dialog = screen.getByRole("dialog", { name: "Move money" });
    for (const name of ["Send", "Receive", "Internal transfer", "Swap", "Mass Pay", "Payment Link"]) expect(within(dialog).getByRole("button", { name })).toBeVisible();
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await user.keyboard("{Tab}");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it.each(["Escape", "Close"])("closes with %s and restores the originating control", async dismissal => {
    const user = await open("send");
    if (dismissal === "Escape") await user.keyboard("{Escape}");
    else await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open movement" })).toHaveFocus();
  });

  it.each([["send", "Send"], ["receive", "Receive"], ["transfer", "Internal transfer"], ["swap", "Swap"], ["mass-pay", "Mass Pay"], ["payment-link", "Payment Link"]] as const)("opens the %s shortcut directly and returns to the chooser", async (operation, title) => {
    const user = await open(operation);
    expect(screen.getByRole("heading", { name: title })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "How would you like to move money?" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All operations" }));
    expect(screen.getByRole("heading", { name: "How would you like to move money?" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: title }));
    expect(screen.getByRole("heading", { name: title })).toBeVisible();
  });

  it("blocks an invalid Send address with an associated error", async () => {
    const user = await open("send");
    change("Amount", "100"); change("Recipient address", "bad-address");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(screen.getByLabelText("Recipient address")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Recipient address")).toHaveAccessibleDescription(/valid.*TRON/i);
    expect(screen.queryByRole("heading", { name: "Review Send" })).not.toBeInTheDocument();
    expect(records().approvals).toHaveLength(7);
  });

  it("reviews, edits, and creates one local Send approval without claiming settlement", async () => {
    const user = await open("send");
    change("Amount", "125"); change("Recipient address", tron); change("Comment", "Supplier invoice");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(screen.getByRole("heading", { name: "Review Send" })).toHaveFocus();
    expect(screen.getByText(tron)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Edit details" }));
    expect(screen.getByLabelText("Amount")).toHaveValue(125);
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: "Create demo approval" }));
    expect(screen.getByRole("heading", { name: "Demo request created" })).toBeVisible();
    expect(screen.getByText(/No funds have moved/)).toBeVisible();
    expect(records().approvals).toHaveLength(8);
    expect(records().approvals[0]).toMatchObject({ organizationId: "amazon", type: "send", resolved: false, approvals: 0 });
  });

  it("blocks nonpositive amounts and amounts above the source balance", async () => {
    const user = await open("send");
    change("Recipient address", tron);
    for (const value of ["0", "999999999"]) {
      change("Amount", value);
      await user.click(screen.getByRole("button", { name: "Review request" }));
      expect(screen.getByLabelText("Amount")).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("shows the Mid Master AML path and creates a pending Receive demo request", async () => {
    const user = await open("receive");
    await user.click(screen.getByLabelText("Use Mid Master AML path"));
    expect(screen.getByText(/Mid Master.*AML.*destination/i)).toBeVisible();
    change("Amount", "50");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: "Create demo request" }));
    expect(screen.getByRole("heading", { name: "Demo request created" })).toBeVisible();
    expect(records().transactions[0]).toMatchObject({ type: "receive", status: "pending", usdValue: 50 });
    expect(screen.getByLabelText("Request address")).toHaveTextContent(tron);
  });

  it("disables different-network and source wallets as transfer destinations", async () => {
    await open("transfer");
    const destination = screen.getByLabelText("Destination wallet");
    expect(within(destination).getByRole("option", { name: /Master · Amazon · Ethereum/ })).toBeDisabled();
    expect(within(destination).getByRole("option", { name: /Master · Amazon · TRON/ })).toBeDisabled();
    expect(within(destination).getByRole("option", { name: /Sub Master · Marketing/ })).not.toBeDisabled();
  });

  it("creates an Internal transfer approval after reviewing a compatible destination", async () => {
    const user = await open("transfer");
    change("Destination wallet", "mk-tron"); change("Amount", "75");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: "Create demo approval" }));
    expect(records().approvals[0]).toMatchObject({ type: "transfer", organizationId: "amazon" });
  });

  it("updates a demo Swap quote with the amount and creates an approval", async () => {
    const user = await open("swap");
    change("Pay amount", "100");
    expect(screen.getByLabelText("Demo quote")).toHaveTextContent("99.50 USDC");
    change("Pay amount", "200");
    expect(screen.getByLabelText("Demo quote")).toHaveTextContent("199.00 USDC");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    await user.click(screen.getByRole("button", { name: "Create demo approval" }));
    expect(records().approvals[0]).toMatchObject({ type: "swap" });
  });

  it("explains when the wallet network has no second asset available for Swap", async () => {
    const user = await open("swap");
    change("Wallet", "am-m-btc"); change("Pay amount", "0.01");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(screen.getByLabelText("Receive asset")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Receive asset")).toHaveAccessibleDescription("Choose two different assets supported on this network.");
    expect(screen.queryByRole("heading", { name: "Review Swap" })).not.toBeInTheDocument();
  });

  it("imports CSV, marks invalid rows Check, and excludes them from the batch", async () => {
    const user = await open("mass-pay");
    const file = new File([`company,currency,network,amount,address\nAmazon,USDT,TRON,25,${tron}\nAmazon,USDT,Ethereum,90,bad-address`], "batch.csv", { type: "text/csv" });
    await user.upload(screen.getByLabelText("Upload CSV"), file);
    expect(await screen.findByText("Check")).toBeVisible();
    expect(screen.getByLabelText("Select recipient 2")).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Review batch" }));
    expect(screen.getByText("1 recipient")).toBeVisible();
    expect(screen.getByText("25.00 USDT")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Create demo approval" }));
    expect(records().approvals[0].title).toContain("1 recipient");
    expect(records().approvals[0].title).not.toContain("90");
  });

  it("requires selection and lets an edited invalid CSV row join the batch", async () => {
    const user = await open("mass-pay");
    await user.upload(screen.getByLabelText("Upload CSV"), new File(["company,currency,network,amount,address\nAmazon,USDT,TRON,12,bad"], "batch.csv", { type: "text/csv" }));
    expect(await screen.findByText("Check")).toBeVisible();
    change("Recipient 1 address", tron);
    await user.click(screen.getByLabelText("Select recipient 1"));
    await user.click(screen.getByRole("button", { name: "Review batch" }));
    expect(screen.getByText("1 recipient")).toBeVisible();
  });

  it("rejects CSV files over 200 recipients without silently truncating", async () => {
    const user = await open("mass-pay");
    const csv = "company,currency,network,amount,address\n" + Array.from({ length: 201 }, () => `Amazon,USDT,TRON,1,${tron}`).join("\n");
    await user.upload(screen.getByLabelText("Upload CSV"), new File([csv], "large.csv", { type: "text/csv" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("200");
    expect(screen.queryByLabelText("Recipient 201 address")).not.toBeInTheDocument();
  });

  it("requires at least one Payment Link channel before review", async () => {
    const user = await open("payment-link");
    change("Payer name", "Acme"); change("Invoice title", "Services"); change("Amount", "250");
    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Choose at least one delivery channel.");
    expect(screen.getByRole("group", { name: "Delivery channels" })).toHaveAccessibleDescription("Choose at least one delivery channel.");
    await user.click(screen.getByLabelText("Email"));
    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(screen.getByRole("heading", { name: "Review Payment Link" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Create demo link" }));
    expect(screen.getByLabelText("Demo payment link")).toHaveTextContent("demo.swapiz.local");
    expect(screen.getByText(/No message has been sent/)).toBeVisible();
    expect(records().approvals[0]).toMatchObject({ type: "payment-link" });
  });
});
