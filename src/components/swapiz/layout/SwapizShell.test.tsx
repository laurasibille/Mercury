import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SwapizShell } from "./SwapizShell";
import { SwapizProvider, useSwapiz } from "../providers/SwapizProvider";

const route = vi.hoisted(() => ({ pathname: "/dashboard" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

let mediaChange: ((event: { matches: boolean }) => void) | undefined;

beforeEach(() => {
  route.pathname = "/dashboard";
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  Object.defineProperty(window, "matchMedia", { configurable: true, value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: (_name: string, listener: (event: { matches: boolean }) => void) => { if (query.includes("prefers-color-scheme")) mediaChange = listener; },
    removeEventListener: () => {}, dispatchEvent: () => false,
  }) });
});
afterEach(cleanup);

function StateProbe() {
  const { state, dispatch, snapshot } = useSwapiz();
  return <>
    <output aria-label="Movement state">{JSON.stringify(state.moveMoney)}</output>
    <output aria-label="Alert count">{snapshot.attentionCount}</output>
    <output aria-label="Scope">{state.scopeId}</output>
    <button onClick={() => dispatch({ type: "alert/resolved", alertId: "n1" })}>Resolve alert</button>
    <button onClick={() => dispatch({ type: "scope/changed", scopeId: "marketing" })}>Scope marketing</button>
  </>;
}

function renderShell() {
  return render(<SwapizProvider><SwapizShell><h1>Route content</h1><StateProbe /></SwapizShell></SwapizProvider>);
}

describe("shared dashboard shell", () => {
  it("exposes only four primary links and opens movement without changing filters", async () => {
    const user = userEvent.setup();
    renderShell();
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /Alerts/ })).toHaveTextContent("14");
    expect(screen.getByRole("link", { name: "Companies" })).toHaveAttribute("href", "/dashboard/companies");
    expect(screen.getByRole("link", { name: "Transactions" })).toHaveAttribute("href", "/dashboard/transactions");
    await user.click(screen.getByRole("button", { name: "Scope marketing" }));
    await user.click(screen.getByRole("button", { name: "Move money" }));
    expect(screen.getByLabelText("Movement state")).toHaveTextContent('{"open":true,"operation":null}');
    expect(screen.getByLabelText("Scope")).toHaveTextContent("marketing");
  });

  it("derives the action badge and snapshot from shared resolved state", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Resolve alert" }));
    expect(screen.getByLabelText("Alert count")).toHaveTextContent("6");
    expect(screen.getByRole("link", { name: /Alerts/ })).toHaveTextContent("13");
  });

  it.each([
    ["/dashboard/alerts", "Alerts"], ["/dashboard/companies/amazon", "Companies / Amazon"],
    ["/dashboard/transactions", "Transactions"], ["/dashboard/settings", "Settings"],
    ["/dashboard/users", "Users"], ["/dashboard/roles", "Roles"],
  ])("retains the topbar on %s", (pathname, title) => {
    route.pathname = pathname;
    renderShell();
    expect(within(screen.getByRole("banner")).getByText(title)).toBeVisible();
    expect(screen.getByRole("button", { name: "Move money" })).toBeVisible();
    if (pathname.startsWith("/dashboard/companies")) expect(screen.getByRole("link", { name: "Companies" })).toHaveAttribute("aria-current", "page");
  });

  it("provides profile routes and keyboard dismissal that restores trigger focus", async () => {
    const user = userEvent.setup();
    renderShell();
    const trigger = screen.getByRole("button", { name: "Open user menu" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByText("kramer@starclick.co")).toBeVisible();
    for (const [label, href] of [["Settings", "/dashboard/settings"], ["Users", "/dashboard/users"], ["Roles", "/dashboard/roles"]]) {
      expect(screen.getByRole("menuitem", { name: label })).toHaveAttribute("href", href);
    }
    expect(screen.getByRole("menuitemradio", { name: "System" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("dismisses the user menu on an outside click", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Open user menu" }));
    expect(await screen.findByRole("menu")).toBeVisible();
    await user.click(screen.getByRole("heading", { name: "Route content" }));
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("persists only theme and sidebar preferences and restores them on a new mount", async () => {
    const user = userEvent.setup();
    const view = renderShell();
    await user.click(screen.getByRole("button", { name: "Open user menu" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Dark" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("swapiz-theme")).toBe("dark");
    await user.keyboard("{Escape}");
    await user.click(within(screen.getByRole("banner")).getByRole("button", { name: "Toggle Sidebar" }));
    await user.click(screen.getByRole("button", { name: "Resolve alert" }));
    await user.click(screen.getByRole("button", { name: "Scope marketing" }));
    expect(Object.keys(localStorage).sort()).toEqual(["mercury_sidebar_open", "swapiz-theme"]);
    view.unmount();
    renderShell();
    await waitFor(() => expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute("data-state", "collapsed"));
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByLabelText("Scope")).toHaveTextContent("all");
    expect(screen.getByLabelText("Alert count")).toHaveTextContent("7");
  });

  it("tracks system appearance and ignores corrupted stored theme values", async () => {
    localStorage.setItem("swapiz-theme", "invalid");
    renderShell();
    await act(async () => mediaChange?.({ matches: true }));
    expect(document.documentElement).toHaveClass("dark");
    await act(async () => mediaChange?.({ matches: false }));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("restores the saved appearance when React replays mount effects", async () => {
    localStorage.setItem("swapiz-theme", "dark");
    render(<StrictMode><SwapizProvider><SwapizShell><h1>Route content</h1></SwapizShell></SwapizProvider></StrictMode>);
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Open user menu" }));
    expect(await screen.findByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
  });
});
