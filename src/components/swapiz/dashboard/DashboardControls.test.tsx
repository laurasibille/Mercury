import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "@/app/dashboard/page";
import DashboardLayout from "@/app/dashboard/layout";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";
import { DashboardControls } from "./DashboardControls";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: (query: string) => ({
    matches: false, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }) });
});
afterEach(cleanup);

function StateProbe() {
  const { state } = useSwapiz();
  return <output aria-label="Dashboard state">{JSON.stringify({ scopeId: state.scopeId, range: state.dateRange, movement: state.moveMoney })}</output>;
}

function renderControls() {
  return render(<SwapizProvider><DashboardControls /><button>Outside</button><StateProbe /></SwapizProvider>);
}

function state() { return JSON.parse(screen.getByLabelText("Dashboard state").textContent!); }
function changeDates(from: string, to: string) {
  fireEvent.change(screen.getByLabelText("From"), { target: { value: from } });
  fireEvent.change(screen.getByLabelText("To"), { target: { value: to } });
}

describe("dashboard controls", () => {
  it.each([["Send", "send"], ["Receive", "receive"], ["Transfer", "transfer"], ["Swap", "swap"], ["Mass Pay", "mass-pay"]])("opens %s directly while preserving filters", async (label, operation) => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: "All companies" }));
    await user.click(screen.getByRole("option", { name: "Marketing" }));
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Last 7 days" }));
    await user.click(screen.getByRole("button", { name: label }));
    expect(state()).toMatchObject({ scopeId: "marketing", range: { from: "2026-10-25", to: "2026-10-31" }, movement: { open: true, operation } });
  });

  it("offers all secondary shortcuts through More", async () => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: "More" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getAllByRole("menuitem").map(item => item.textContent)).toEqual(["Receive", "Transfer", "Swap", "Mass Pay"]);
    await user.click(within(menu).getByRole("menuitem", { name: "Swap" }));
    expect(state().movement).toEqual({ open: true, operation: "swap" });
  });

  it("orders companies before contextual departments and supports keyboard scope selection", async () => {
    const user = userEvent.setup();
    renderControls();
    const trigger = screen.getByRole("button", { name: "All companies" });
    trigger.focus();
    await user.keyboard("{Enter}");
    const options = await screen.findAllByRole("option");
    expect(options.map(option => option.getAttribute("aria-label") ?? option.textContent)).toEqual(["All companies", "Amazon", "OpenAI", "Hooli", "Marketing", "Development", "Operations", "Support"]);
    expect(screen.getByRole("option", { name: "Marketing" })).toHaveAccessibleDescription("Department · Amazon");
    expect(options[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(state().scopeId).toBe("openai");
    expect(trigger).toHaveTextContent("OpenAI");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it.each([
    ["Today", "today", "2026-10-31"], ["Last 7 days", "last-7-days", "2026-10-25"],
    ["Last 30 days", "last-30-days", "2026-10-02"], ["This month", "this-month", "2026-10-01"],
    ["Last 90 days", "last-90-days", "2026-08-03"], ["This year", "this-year", "2026-01-01"],
  ])("applies %s immediately and closes the date popup", async (label, preset, from) => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(within(screen.getByRole("dialog", { name: "Date range" })).getByRole("button", { name: label }));
    expect(state().range).toEqual({ preset, from, to: "2026-10-31", label });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Date range" })).not.toBeInTheDocument());
  });

  it("keeps custom dates as drafts until Apply and displays the applied interval", async () => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Custom range" }));
    changeDates("2026-09-15", "2026-10-15");
    expect(state().range.preset).toBe("last-30-days");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(state().range).toMatchObject({ preset: "custom", from: "2026-09-15", to: "2026-10-15" });
    expect(screen.getByRole("button", { name: /Sep 15, 2026.*Oct 15, 2026/ })).toBeVisible();
  });

  it.each([
    ["2026-10-31", "2026-10-01", "End date must be on or after start date."],
    ["", "2026-10-01", "Enter valid start and end dates."],
  ])("rejects invalid custom dates %s to %s without committing", async (from, to, message) => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Custom range" }));
    changeDates(from, to);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(screen.getByLabelText("From")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("To")).toHaveAccessibleDescription(message);
    expect(state().range.preset).toBe("last-30-days");
  });

  it.each(["Cancel", "Escape", "Outside"])("discards custom edits on %s and restores applied values on reopen", async (dismissal) => {
    const user = userEvent.setup();
    renderControls();
    const trigger = screen.getByRole("button", { name: /Last 30 days/ });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Custom range" }));
    changeDates("2026-09-01", "2026-09-30");
    if (dismissal === "Escape") await user.keyboard("{Escape}");
    else await user.click(screen.getByRole("button", { name: dismissal }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Date range" })).not.toBeInTheDocument());
    expect(state().range.preset).toBe("last-30-days");
    if (dismissal !== "Outside") expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(screen.getByLabelText("From")).toHaveValue("2026-10-02");
    expect(screen.getByLabelText("To")).toHaveValue("2026-10-31");
  });

  it("resets the custom draft without changing the applied range until Apply", async () => {
    const user = userEvent.setup();
    renderControls();
    await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
    await user.click(screen.getByRole("button", { name: "Today" }));
    await user.click(screen.getByRole("button", { name: /Today/ }));
    await user.click(screen.getByRole("button", { name: "Custom range" }));
    changeDates("2026-09-01", "2026-09-30");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("From")).toHaveValue("2026-10-02");
    expect(screen.getByLabelText("To")).toHaveValue("2026-10-31");
    expect(state().range.preset).toBe("today");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(state().range).toMatchObject({ preset: "custom", from: "2026-10-02", to: "2026-10-31" });
  });

  it("renders the overview inside one shared shell", () => {
    render(<DashboardLayout><DashboardPage /></DashboardLayout>);
    expect(screen.getByRole("heading", { name: "Overview" })).toBeVisible();
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("navigation", { name: "Main navigation" })).toHaveLength(1);
    expect(screen.queryByText("Welcome, Jane")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeVisible();
  });
});
