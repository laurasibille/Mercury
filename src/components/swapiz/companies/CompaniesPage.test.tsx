import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { swapizDemoData } from "@/data/swapiz-demo";
import { SwapizProvider } from "../providers/SwapizProvider";
import { CompaniesPage } from "./CompaniesPage";
import { CompanyDetailPage } from "./CompanyDetailPage";
import { dynamicParams, generateStaticParams } from "@/app/dashboard/companies/[companyId]/page";

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);

function renderDetail(companyId = "amazon") {
  const company = swapizDemoData.organizations.find(item => item.id === companyId && item.kind === "company")!;
  return render(<SwapizProvider><CompanyDetailPage company={company} /></SwapizProvider>);
}

describe("Companies", () => {
  it("uses the 13 recorded wallets and only the four wallet types present in the source data", () => {
    expect(swapizDemoData.wallets).toHaveLength(13);
    expect(new Set(swapizDemoData.wallets.map(wallet => wallet.type))).toEqual(new Set([
      "Master", "Sub Master", "Company wallet (cold)", "Fee wallet",
    ]));
  });

  it("links only parent companies and totals their actual wallets including departments", () => {
    render(<SwapizProvider><CompaniesPage /></SwapizProvider>);
    expect(screen.getByRole("link", { name: "Amazon" })).toHaveAttribute("href", "/dashboard/companies/amazon");
    expect(screen.getByRole("link", { name: "OpenAI" })).toHaveAttribute("href", "/dashboard/companies/openai");
    expect(screen.getByRole("link", { name: "Hooli" })).toHaveAttribute("href", "/dashboard/companies/hooli");
    const amazon = screen.getByRole("article", { name: "Amazon" });
    expect(within(amazon).getByText("4 departments")).toBeVisible();
    expect(within(amazon).getByText("9 wallets")).toBeVisible();
    expect(within(amazon).getByText("$4,053,070.50")).toBeVisible();
    const hooli = screen.getByRole("article", { name: "Hooli" });
    expect(within(screen.getByRole("article", { name: "OpenAI" })).getByText("3 wallets")).toBeVisible();
    expect(within(hooli).getByText("1 wallet")).toBeVisible();
    expect(within(hooli).queryByText("1 wallets")).not.toBeInTheDocument();
    expect(within(amazon).getByRole("link", { name: "5 pending approvals" })).toHaveAttribute("href", "/dashboard/alerts");
    expect(screen.getByText("Onboarding 5 / 8")).toBeVisible();
    expect(screen.queryByRole("link", { name: "Marketing" })).not.toBeInTheDocument();
    expect(screen.queryByText(/sub companies/i)).not.toBeInTheDocument();
  });

  it("shows department accounts and wallet-derived assets without inventing a Support wallet", () => {
    renderDetail();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Wallets" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Money flow" })).toBeVisible();
    const departments = screen.getByRole("region", { name: "Departments" });
    expect(within(departments).getByText("Marketing")).toBeVisible();
    const support = within(departments).getByRole("article", { name: "Support" });
    expect(within(support).getByText("No wallet recorded")).toBeVisible();
    expect(within(support).getByText("Not ready")).toBeVisible();
    const assets = screen.getByRole("region", { name: "Wallet assets" });
    expect(within(assets).getByText("3,402,806 USDT")).toBeVisible();
    expect(within(assets).getByText("3.25 BTC")).toBeVisible();
    expect(screen.getByText(/Operational wallet balances.*observations/)).toBeVisible();
  });

  it("groups explicit wallet types and copies the complete address with feedback", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole("tab", { name: "Wallets" }));
    expect(screen.getByRole("region", { name: "Master" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Sub Master" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Company wallet (cold)" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Fee wallet" })).toBeVisible();
    expect(screen.queryByRole("region", { name: "Exchange" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy address for Master · Amazon · TRON · TRC-20" }));
    expect(await navigator.clipboard.readText()).toBe("TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa");
    expect(screen.getByRole("status")).toHaveTextContent("Address copied");
  });

  it("retains selectable addresses and explains clipboard failure", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("denied"));
    renderDetail();
    await user.click(screen.getByRole("tab", { name: "Wallets" }));
    await user.click(screen.getByRole("button", { name: "Copy address for Master · Amazon · TRON · TRC-20" }));
    expect(screen.getByRole("status")).toHaveTextContent("Copy unavailable. Select the address to copy it manually.");
    expect(screen.getByText("TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa")).toBeVisible();
  });

  it("retains receive and exchange rule parameters, organization scope, and all source statuses", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole("tab", { name: "Money flow" }));
    const receive = screen.getByRole("region", { name: "Receive rules" });
    expect(within(receive).getAllByRole("article")).toHaveLength(5);
    const gas = within(receive).getByRole("article", { name: "Gas top-up" });
    expect(within(gas).getByText("Pending")).toBeVisible();
    expect(within(gas).getByText("2%")).toBeVisible();
    expect(within(gas).getByText("1,000 TRX")).toBeVisible();
    expect(within(receive).getByText("Rejected")).toBeVisible();
    expect(within(receive).getByText("Draft")).toBeVisible();
    expect(within(receive).getAllByText("Active")).toHaveLength(2);
    expect(within(receive).getByText("A. Stone")).toBeVisible();
    const exchange = screen.getByRole("region", { name: "Exchange rules" });
    expect(within(exchange).getAllByRole("article")).toHaveLength(3);
    expect(within(exchange).getByText("Keep 0.05 on exchange")).toBeVisible();
    expect(within(exchange).getByText("balance ≥ 5 ETH")).toBeVisible();
  });

  it("confirms sweep and auto-sweep as session-only demos without altering balances", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole("tab", { name: "Wallets" }));
    const fee = screen.getByRole("region", { name: "Fee wallet" });
    await user.click(within(fee).getByRole("button", { name: /Sweep / }));
    let dialog = screen.getByRole("dialog", { name: "Preview sweep" });
    expect(within(dialog).getByText(/No funds will move/)).toBeVisible();
    await user.click(within(dialog).getByRole("button", { name: "Confirm demo sweep" }));
    expect(screen.getByRole("status")).toHaveTextContent("Demo sweep confirmed");
    expect(within(fee).getByText("$1,488.00")).toBeVisible();
    const auto = within(fee).getByRole("switch", { name: /Auto-sweep/ });
    expect(auto).not.toBeChecked();
    await user.click(auto);
    dialog = screen.getByRole("dialog", { name: "Enable auto-sweep demo?" });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(auto).not.toBeChecked();
    await user.click(auto);
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Confirm demo auto-sweep" }));
    expect(auto).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Auto-sweep enabled in this demo session");
    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.click(screen.getByRole("tab", { name: "Wallets" }));
    expect(auto).toBeChecked();
  });

  it("supports keyboard tabs, Escape, and focus return from a sweep confirmation", async () => {
    const user = userEvent.setup();
    renderDetail();
    screen.getByRole("tab", { name: "Overview" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Wallets" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Wallets" })).toBeVisible();
    const trigger = within(screen.getByRole("region", { name: "Fee wallet" })).getByRole("button", { name: /Sweep / });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    await user.keyboard("{Home}");
  });

  it("keeps other company accounts isolated and explains their missing rules", async () => {
    const user = userEvent.setup();
    renderDetail("openai");
    expect(screen.getByRole("article", { name: "Operational wallet balance" })).toHaveTextContent("$858,228.00");
    expect(screen.queryByText("Marketing")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Money flow" }));
    expect(screen.getByText("No receive rules recorded for OpenAI.")).toBeVisible();
    expect(screen.getByText("No exchange rules recorded for OpenAI.")).toBeVisible();
  });

  it("exports only known companies and disables unknown company routes", () => {
    expect(dynamicParams).toBe(false);
    expect(generateStaticParams()).toEqual([{ companyId: "amazon" }, { companyId: "openai" }, { companyId: "hooli" }]);
  });
});
