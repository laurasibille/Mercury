import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SwapizProvider } from "../providers/SwapizProvider";
import { SwapizShell } from "../layout/SwapizShell";
import { SettingsPage } from "./SettingsPage";
import { UsersPage } from "./UsersPage";
import { RolesPage } from "./RolesPage";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/settings" }));
beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});
afterEach(cleanup);

function renderPage(page: React.ReactNode) {
  return render(<SwapizProvider><SwapizShell>{page}</SwapizShell></SwapizProvider>);
}

describe("Settings, Users, and Roles routes", () => {
  it("shows editable settings and applies theme changes through the shared provider", async () => {
    const user = userEvent.setup();
    renderPage(<SettingsPage />);
    expect(screen.getByLabelText("Two-factor authentication")).toBeChecked();
    expect(screen.getByLabelText("Language")).toBeVisible();
    expect(screen.getByLabelText("Display currency")).toBeVisible();
    expect(screen.getByLabelText("Timezone")).toBeVisible();
    expect(screen.getByLabelText("Company name")).toHaveValue("Starclick");
    expect(screen.getByLabelText("Second approver threshold")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Messaging channels" })).toBeVisible();
    expect(screen.queryByLabelText(/token|secret/i)).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Theme"), "dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("swapiz-theme")).toBe("dark");
    await user.click(screen.getByRole("button", { name: "Save settings" }));
    expect(screen.getByRole("status")).toHaveTextContent("Settings updated in this demo.");
  });

  it("lists nine users and supports search, role filters, add, edit, and delete demo actions", async () => {
    const user = userEvent.setup();
    renderPage(<UsersPage />);
    const table = screen.getByRole("table", { name: "Users" });
    expect(within(table).getAllByRole("row")).toHaveLength(10);
    expect(screen.getByRole("cell", { name: /Anna Kovalenko/ })).toBeVisible();
    expect(within(screen.getByRole("row", { name: /Anna Kovalenko/ })).getByRole("cell", { name: "Finance" })).toBeVisible();
    expect(screen.getByRole("cell", { name: /Amazon, Marketing, Development/ })).toBeVisible();
    const annaRow = screen.getByRole("row", { name: /Anna Kovalenko/ });
    expect(within(annaRow).getByRole("cell", { name: "€25,000" })).toBeVisible();
    expect(within(annaRow).getByRole("cell", { name: "Enabled" })).toBeVisible();

    await user.type(screen.getByRole("searchbox", { name: "Search users" }), "Anna");
    expect(within(screen.getByRole("table", { name: "Users" })).getAllByRole("row")).toHaveLength(2);
    await user.clear(screen.getByRole("searchbox", { name: "Search users" }));
    await user.selectOptions(screen.getByLabelText("Filter by role"), "finance");
    expect(within(screen.getByRole("table", { name: "Users" })).getAllByRole("row")).toHaveLength(5);
    await user.selectOptions(screen.getByLabelText("Filter by role"), "all");

    await user.click(screen.getByRole("button", { name: "Add user" }));
    const addDialog = screen.getByRole("dialog", { name: "Add user" });
    await user.type(within(addDialog).getByLabelText("Name"), "Morgan Lee");
    await user.type(within(addDialog).getByLabelText("Email"), "morgan@starclick.co");
    await user.selectOptions(within(addDialog).getByLabelText("Role"), "viewer");
    await user.click(within(addDialog).getByRole("button", { name: "Save user" }));
    expect(screen.getByRole("cell", { name: /Morgan Lee/ })).toBeVisible();

    await user.click(within(screen.getByRole("table", { name: "Users" })).getByRole("button", { name: "Edit Morgan Lee" }));
    const editDialog = screen.getByRole("dialog", { name: "Edit user" });
    await user.clear(within(editDialog).getByLabelText("Name"));
    await user.type(within(editDialog).getByLabelText("Name"), "Morgan L.");
    await user.click(within(editDialog).getByRole("button", { name: "Save user" }));
    expect(screen.getByRole("cell", { name: /Morgan L\./ })).toBeVisible();

    await user.click(within(screen.getByRole("table", { name: "Users" })).getByRole("button", { name: "Delete Morgan L." }));
    const deleteDialog = screen.getByRole("dialog", { name: "Delete user" });
    await user.click(within(deleteDialog).getByRole("button", { name: "Delete user" }));
    expect(screen.queryByRole("cell", { name: /Morgan L\./ })).not.toBeInTheDocument();
  });

  it("shows five roles with expandable editable permissions and locks finance fee permissions", async () => {
    const user = userEvent.setup();
    renderPage(<RolesPage />);
    expect(screen.getByRole("table", { name: "Roles" })).toBeVisible();
    expect(screen.getAllByRole("row")).toHaveLength(6);
    await user.click(within(screen.getByRole("table", { name: "Roles" })).getByRole("button", { name: "Expand Finance permissions" }));
    expect(screen.getByLabelText("Fee income & Sweep")).toBeDisabled();
    expect(screen.getByLabelText("View fee settings")).toBeDisabled();
    expect(screen.getByLabelText("Change fees")).toBeDisabled();
    await user.click(within(screen.getByRole("table", { name: "Roles" })).getByRole("button", { name: "Expand Owner permissions" }));
    expect(screen.getByLabelText("Owner: Fee income & Sweep")).toBeEnabled();
    expect(screen.getByLabelText("Owner: Fee income & Sweep")).toBeChecked();
    await user.click(screen.getByLabelText("Owner: Fee income & Sweep"));
    expect(screen.getByRole("status")).toHaveTextContent("Owner permissions updated in this demo.");
  });
});
