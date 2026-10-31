# Swapiz × Mercury Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public Mercury demo dashboard with a route-based Swapiz treasury prototype that keeps Mercury's shell and design language, adds dynamic dashboard filtering, and preserves Swapiz's payment, approval, company, wallet, compliance, and transaction workflows.

**Architecture:** A shared `/dashboard` App Router layout hosts a collapsible sidebar, persistent top navigation, user menu, and global full-screen move-money layer. Typed demo entities and pure selectors drive every KPI, chart, badge, and table so organization and date filters stay consistent. Route-level client components consume a single reducer-backed provider for filters and demo mutations while static export remains compatible with Cloudflare Pages.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, Tailwind CSS v4, shadcn sidebar-08, Base UI Menu/Popover/Dialog, Lucide React, Vitest, Testing Library, agent-browser, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-10-31-swapiz-mercury-dashboard-redesign-design.md`

## Global Constraints

- Preserve the existing Next.js application and deploy at `https://mercury-cux.pages.dev/dashboard`.
- Use Inter Variable, 14 px / 20 px body and navigation, and 12 px / 18 px metadata.
- Keep the sidebar at 240 px expanded and 56 px collapsed; light background is tokenized `#fbfcfd`.
- Use Mercury indigo `#5266eb`, ink `#1e1e2a`, 8 px control radii, and 12 px card/panel radii.
- Glassmorphism is limited to KPI cards, analytical widgets, major popovers, and movement-form surfaces.
- Do not add runtime dependencies unless existing project primitives cannot meet accessibility requirements.
- All meaningful text is at least 12 px; statuses use text or icon in addition to color.
- The product remains an explicit client-side demo; no copy may claim a real bank or blockchain execution.
- Only theme and sidebar state persist in local storage.
- Every primary route, user-menu route, filter, theme, and movement entry point must work with static export.
- Preserve unrelated untracked files already present in the working tree.

## File map

### Core data and state

- Create `src/types/swapiz.ts`: shared entity, filter, operation, and application-state types.
- Create `src/data/swapiz-demo.ts`: normalized organizations, wallets, observations, alerts, approvals, transactions, obligations, users, roles, and movement options.
- Create `src/lib/swapiz/date-range.ts`: preset and custom date-range helpers.
- Create `src/lib/swapiz/selectors.ts`: pure scope/date filtering and dashboard aggregation.
- Create `src/lib/swapiz/reducer.ts`: pure demo mutation reducer.
- Create `src/components/swapiz/providers/SwapizProvider.tsx`: React context around the reducer and theme preference.

### Shared shell and primitives

- Create `src/components/swapiz/layout/SwapizShell.tsx`: dashboard provider, sidebar, topbar, and main inset.
- Create `src/components/swapiz/layout/SwapizSidebar.tsx`: Home, Alerts, Companies, Transactions.
- Create `src/components/swapiz/layout/SwapizTopbar.tsx`: trigger, page context, Move money, and user menu.
- Create `src/components/swapiz/layout/UserMenu.tsx`: email, Settings, Theme, Users, Roles.
- Create `src/components/swapiz/primitives/GlassCard.tsx`: tokenized glass surface.
- Create `src/components/swapiz/primitives/StatusBadge.tsx`: semantic accessible statuses.
- Modify `src/styles/mercury-tokens.css`: Swapiz light/dark semantic tokens and glass tokens.
- Modify `src/app/globals.css`: theme selectors, glass utilities, reduced motion, and page canvas.
- Modify `src/app/dashboard/layout.tsx`: shared shell.

### Dashboard

- Replace `src/components/mercury/dashboard/DashboardClient.tsx` with `src/components/swapiz/dashboard/OverviewPage.tsx` usage.
- Create `src/components/swapiz/dashboard/OverviewPage.tsx`: dashboard composition.
- Create `src/components/swapiz/dashboard/DashboardControls.tsx`: movement shortcuts, scope selector, date range.
- Create `src/components/swapiz/dashboard/ScopeSelect.tsx`.
- Create `src/components/swapiz/dashboard/DateRangePopover.tsx`.
- Create `src/components/swapiz/dashboard/KpiGrid.tsx`.
- Create `src/components/swapiz/dashboard/BalanceTrend.tsx`.
- Create `src/components/swapiz/dashboard/AssetAllocation.tsx`.
- Create `src/components/swapiz/dashboard/FlowComparison.tsx`.
- Create `src/components/swapiz/dashboard/AttentionQueue.tsx`.
- Create `src/components/swapiz/dashboard/RecentTransactions.tsx`.
- Modify `src/app/dashboard/page.tsx`.

### Move money

- Create `src/components/swapiz/move-money/MoveMoneyLayer.tsx`: full-screen accessible Dialog.
- Create `src/components/swapiz/move-money/OperationChooser.tsx`.
- Create `src/components/swapiz/move-money/FlowFrame.tsx`.
- Create `src/components/swapiz/move-money/SendFlow.tsx`.
- Create `src/components/swapiz/move-money/ReceiveFlow.tsx`.
- Create `src/components/swapiz/move-money/TransferFlow.tsx`.
- Create `src/components/swapiz/move-money/SwapFlow.tsx`.
- Create `src/components/swapiz/move-money/MassPayFlow.tsx`.
- Create `src/components/swapiz/move-money/PaymentLinkFlow.tsx`.

### Routes

- Create `src/app/dashboard/alerts/page.tsx` and `src/components/swapiz/alerts/AlertsPage.tsx`.
- Create `src/app/dashboard/companies/page.tsx` and `src/components/swapiz/companies/CompaniesPage.tsx`.
- Create `src/app/dashboard/companies/[companyId]/page.tsx` and `src/components/swapiz/companies/CompanyDetailPage.tsx`.
- Create `src/app/dashboard/transactions/page.tsx` and `src/components/swapiz/transactions/TransactionsPage.tsx`.
- Create `src/app/dashboard/settings/page.tsx` and `src/components/swapiz/settings/SettingsPage.tsx`.
- Create `src/app/dashboard/users/page.tsx` and `src/components/swapiz/settings/UsersPage.tsx`.
- Create `src/app/dashboard/roles/page.tsx` and `src/components/swapiz/settings/RolesPage.tsx`.

### Testing and documentation

- Modify `package.json` and `package-lock.json`: Vitest and Testing Library dev dependencies and test scripts.
- Create `vitest.config.ts` and `src/test/setup.ts`.
- Create colocated `*.test.ts` and `*.test.tsx` files listed in each task.
- Modify `.21st/design.json`, `.21st/DESIGN.md`, and `docs/mercury-design-system.md`.
- Modify `/Users/laurasibille/Obsidian/Projets/Mercury/00 - Project Overview.md`.
- Modify `/Users/laurasibille/Obsidian/Projets/Mercury/01 - Design System.md`.
- Create `/Users/laurasibille/Obsidian/Projets/Mercury/02 - Swapiz Product Architecture.md`.

---

### Task 1: Add the test harness and normalized Swapiz domain model

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/types/swapiz.ts`
- Create: `src/data/swapiz-demo.ts`
- Create: `src/lib/swapiz/date-range.ts`
- Create: `src/lib/swapiz/selectors.ts`
- Test: `src/lib/swapiz/date-range.test.ts`
- Test: `src/lib/swapiz/selectors.test.ts`

**Interfaces:**
- Produces: `DateRange`, `ScopeId`, `MoveOperation`, all domain entity types, `getPresetRange`, `validateDateRange`, `filterTransactions`, `selectDashboardSnapshot`, and normalized `swapizDemoData`.
- Consumes: no application interfaces.

- [ ] **Step 1: Install the test-only dependencies and add scripts**

Run:

```bash
npm install --save-dev vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add these scripts to `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write failing date-range tests**

Create `src/lib/swapiz/date-range.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getPresetRange, validateDateRange } from "./date-range";

describe("date ranges", () => {
  const today = new Date("2026-10-31T12:00:00Z");

  it("builds an inclusive last-30-days range", () => {
    expect(getPresetRange("last-30-days", today)).toEqual({
      preset: "last-30-days",
      from: "2026-10-02",
      to: "2026-10-31",
      label: "Last 30 days",
    });
  });

  it("rejects a custom range whose end precedes its start", () => {
    expect(validateDateRange("2026-10-31", "2026-10-01")).toEqual({
      valid: false,
      message: "End date must be on or after start date.",
    });
  });
});
```

- [ ] **Step 4: Run the date tests to verify they fail**

Run: `npm test -- src/lib/swapiz/date-range.test.ts`

Expected: FAIL because `date-range.ts` does not exist.

- [ ] **Step 5: Define the shared types and date helpers**

In `src/types/swapiz.ts`, define exact unions and records:

```ts
export type ScopeId = "all" | "amazon" | "openai" | "hooli" | "marketing" | "development" | "operations" | "support";
export type DatePreset = "today" | "last-7-days" | "last-30-days" | "this-month" | "last-90-days" | "this-year" | "custom";
export type MoveOperation = "send" | "receive" | "transfer" | "swap" | "mass-pay" | "payment-link";
export type TransactionType = "send" | "receive" | "transfer" | "swap" | "mass-pay";
export type TransactionStatus = "processing" | "completed" | "failed" | "pending" | "quarantine";
export type Severity = "critical" | "warning" | "ok";

export interface DateRange { preset: DatePreset; from: string; to: string; label: string }
export interface Organization { id: Exclude<ScopeId, "all">; name: string; kind: "company" | "department"; parentId?: "amazon" | "openai" | "hooli" }
export interface BalanceObservation { date: string; organizationId: Organization["id"]; usd: number; inflow: number; outflow: number }
export interface AssetBalance { organizationId: Organization["id"]; asset: "USDT" | "USDC" | "ETH" | "BTC" | "SOL" | "TRX" | "XRP"; network: string; usd: number }
export interface Approval { id: string; date: string; organizationId: Organization["id"]; type: string; title: string; amountEur?: number; initiator: string; approvals: number; requiredApprovals: number; resolved: boolean }
export interface Alert { id: string; date: string; organizationId: Organization["id"]; severity: Severity; title: string; detail: string; amount?: string; action: string; resolved: boolean }
export interface Transaction { id: string; date: string; time: string; organizationId: Organization["id"]; type: TransactionType; amountLabel: string; usdValue: number; asset: string; network: string; wallet: string; source: string; status: TransactionStatus }
export interface Obligation { id: string; date: string; organizationId: Organization["id"]; kind: "payroll" | "supplier" | "batch"; label: string; usd: number }
```

Implement `getPresetRange(preset, today)` with UTC-safe helpers and `validateDateRange(from, to)` using ISO date comparisons.

- [ ] **Step 6: Run the date tests to verify they pass**

Run: `npm test -- src/lib/swapiz/date-range.test.ts`

Expected: 2 tests PASS.

- [ ] **Step 7: Write failing selector tests**

Create fixture-driven tests in `src/lib/swapiz/selectors.test.ts` that assert:

```ts
it("includes department records when Amazon is selected", () => {
  const result = filterTransactions(fixture.transactions, "amazon", range);
  expect(result.map((item) => item.id)).toEqual(["amazon-1", "marketing-1"]);
});

it("filters every dashboard metric by the same scope and range", () => {
  const snapshot = selectDashboardSnapshot(fixture, "marketing", range);
  expect(snapshot.totalBalance).toBe(200_000);
  expect(snapshot.availableToMove).toBe(150_000);
  expect(snapshot.netFlow).toBe(25_000);
  expect(snapshot.upcomingObligations).toBe(40_000);
  expect(snapshot.pendingApprovalCount).toBe(1);
  expect(snapshot.attentionCount).toBe(1);
  expect(snapshot.transactions.every((item) => item.organizationId === "marketing")).toBe(true);
});
```

Define the fixture in the test with Amazon, Marketing, and OpenAI records so parent/department inclusion is proven rather than mocked away.

- [ ] **Step 8: Run selector tests to verify they fail**

Run: `npm test -- src/lib/swapiz/selectors.test.ts`

Expected: FAIL because selectors and demo dataset are not implemented.

- [ ] **Step 9: Implement normalized demo data and selectors**

Populate `swapizDemoData` with the values and labels from the analyzed Swapiz HTML: Amazon/OpenAI/Hooli, Amazon departments, wallet balances, daily observations, seven approvals, seven alerts, twelve transactions, asset balances, and obligations. Give every record an ISO date and organization identifier.

Implement:

```ts
export function scopeOrganizationIds(scopeId: ScopeId, organizations: Organization[]): Organization["id"][];
export function filterTransactions(items: Transaction[], scopeId: ScopeId, range: DateRange): Transaction[];
export function selectDashboardSnapshot(data: SwapizDemoData, scopeId: ScopeId, range: DateRange): DashboardSnapshot;
```

`availableToMove = totalBalance - unresolvedFrozenUsd - unresolvedPendingOutboundUsd`, clamped at zero. `netFlow` sums observations in range. `upcomingObligations` sums obligations in range.

- [ ] **Step 10: Run domain tests and static checks**

Run:

```bash
npm test -- src/lib/swapiz/date-range.test.ts src/lib/swapiz/selectors.test.ts
npx tsc --noEmit
```

Expected: all tests PASS and TypeScript exits 0.

- [ ] **Step 11: Commit the domain foundation**

```bash
git add package.json package-lock.json vitest.config.ts src/test src/types src/data/swapiz-demo.ts src/lib/swapiz
git commit -m "feat: add Swapiz dashboard domain model"
```

---

### Task 2: Extend Mercury tokens and add reusable Swapiz surfaces

**Files:**
- Modify: `src/styles/mercury-tokens.css`
- Modify: `src/app/globals.css`
- Create: `src/components/swapiz/primitives/GlassCard.tsx`
- Create: `src/components/swapiz/primitives/StatusBadge.tsx`
- Test: `src/components/swapiz/primitives/primitives.test.tsx`

**Interfaces:**
- Consumes: `TransactionStatus` and `Severity` from `src/types/swapiz.ts`.
- Produces: `GlassCard` and `StatusBadge` for every subsequent UI task.

- [ ] **Step 1: Write failing primitive tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";

describe("Swapiz primitives", () => {
  it("renders a semantic glass article", () => {
    render(<GlassCard as="article">Balance</GlassCard>);
    expect(screen.getByRole("article", { name: "Balance" })).toHaveClass("swapiz-glass");
  });

  it("renders status text in addition to color", () => {
    render(<StatusBadge status="quarantine" />);
    expect(screen.getByText("Quarantine")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the primitive tests to verify they fail**

Run: `npm test -- src/components/swapiz/primitives/primitives.test.tsx`

Expected: FAIL because both components are missing.

- [ ] **Step 3: Add exact semantic tokens**

Extend `mercury-tokens.css` with semantic light tokens and a `.dark` override. Include:

```css
:root {
  --swapiz-canvas: #f7f8fb;
  --swapiz-glass: rgba(255, 255, 255, 0.72);
  --swapiz-glass-strong: rgba(255, 255, 255, 0.9);
  --swapiz-glass-border: rgba(255, 255, 255, 0.82);
  --swapiz-glass-shadow: 0 18px 50px rgba(47, 52, 86, 0.1), inset 0 1px rgba(255, 255, 255, 0.92);
  --swapiz-warning-soft: #fff7e8;
  --swapiz-critical-soft: #fff0f3;
}

.dark {
  --color-canvas: #11131a;
  --color-canvas-subtle: #171a23;
  --color-surface: #20242f;
  --color-surface-hover: #292e3b;
  --color-border: #2d3240;
  --color-ink: #f4f5f8;
  --color-ink-secondary: #d2d5df;
  --color-ink-muted: #9da3b2;
  --sidebar-background: #151820;
  --swapiz-canvas: #11131a;
  --swapiz-glass: rgba(31, 35, 47, 0.72);
  --swapiz-glass-strong: rgba(31, 35, 47, 0.92);
  --swapiz-glass-border: rgba(255, 255, 255, 0.08);
  --swapiz-glass-shadow: 0 18px 50px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.06);
  --swapiz-warning-soft: #2b2518;
  --swapiz-critical-soft: #2d1d24;
}
```

Add `.swapiz-glass`, `.swapiz-glass-strong`, `.tnum`, and reduced-motion rules to `globals.css`. Do not introduce beige/orange page backgrounds.

- [ ] **Step 4: Implement the primitives**

`GlassCard` accepts `as`, `className`, `children`, and accessible label props. `StatusBadge` maps every transaction status and severity to stable text, icon, and tokenized tone.

- [ ] **Step 5: Run tests and checks**

Run:

```bash
npm test -- src/components/swapiz/primitives/primitives.test.tsx
npm run lint
npx tsc --noEmit
```

Expected: tests PASS; lint and TypeScript exit 0.

- [ ] **Step 6: Commit the visual foundation**

```bash
git add src/styles/mercury-tokens.css src/app/globals.css src/components/swapiz/primitives
git commit -m "feat: add Swapiz Mercury visual tokens"
```

---

### Task 3: Build shared state, route shell, sidebar, and user menu

**Files:**
- Create: `src/lib/swapiz/reducer.ts`
- Create: `src/components/swapiz/providers/SwapizProvider.tsx`
- Create: `src/components/swapiz/layout/SwapizShell.tsx`
- Create: `src/components/swapiz/layout/SwapizSidebar.tsx`
- Create: `src/components/swapiz/layout/SwapizTopbar.tsx`
- Create: `src/components/swapiz/layout/UserMenu.tsx`
- Create: `src/app/dashboard/layout.tsx`
- Test: `src/lib/swapiz/reducer.test.ts`
- Test: `src/components/swapiz/layout/SwapizShell.test.tsx`

**Interfaces:**
- Consumes: domain types, `swapizDemoData`, existing shadcn sidebar components, Base UI `Menu`.
- Produces: `useSwapiz()`, `SwapizState`, and `SwapizAction`; every route and movement flow depends on them.

- [ ] **Step 1: Read the local Next.js 16 layout and client-boundary guides**

Run:

```bash
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
sed -n '1,240p' node_modules/next/dist/docs/01-app/02-guides/server-and-client-boundary.md
sed -n '1,220p' node_modules/next/dist/docs/01-app/02-guides/static-exports.md
```

Use these local docs as the API source of truth.

- [ ] **Step 2: Write failing reducer tests**

Cover scope/date changes, overlay open/close, approval resolution, alert resolution, and reset-on-invalid identifiers:

```ts
it("resolving an alert reduces the unresolved count", () => {
  const next = swapizReducer(initialSwapizState, { type: "alert/resolved", alertId: "n1" });
  expect(next.alerts.find((item) => item.id === "n1")?.resolved).toBe(true);
});

it("closing move money retains dashboard filters", () => {
  const open = swapizReducer({ ...initialSwapizState, scopeId: "marketing" }, { type: "move/open", operation: "send" });
  const closed = swapizReducer(open, { type: "move/close" });
  expect(closed.scopeId).toBe("marketing");
  expect(closed.moveMoney).toEqual({ open: false, operation: null });
});
```

- [ ] **Step 3: Run reducer tests to verify they fail**

Run: `npm test -- src/lib/swapiz/reducer.test.ts`

Expected: FAIL because reducer exports are missing.

- [ ] **Step 4: Implement reducer and provider**

State shape:

```ts
export interface SwapizState {
  scopeId: ScopeId;
  dateRange: DateRange;
  theme: "light" | "dark" | "system";
  moveMoney: { open: boolean; operation: MoveOperation | null };
  alerts: Alert[];
  approvals: Approval[];
  transactions: Transaction[];
}
```

The provider initializes from demo data, applies `document.documentElement.classList`, observes system theme, stores only `swapiz-theme`, and exposes memoized `snapshot = selectDashboardSnapshot(...)`.

- [ ] **Step 5: Run reducer tests to verify they pass**

Run: `npm test -- src/lib/swapiz/reducer.test.ts`

Expected: all reducer tests PASS.

- [ ] **Step 6: Write failing shell tests**

Mock `next/navigation` pathname and assert:

```tsx
expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/dashboard");
expect(screen.getByRole("link", { name: /Alerts/ })).toHaveTextContent("14");
expect(screen.getByRole("button", { name: "Move money" })).toBeVisible();
await user.click(screen.getByRole("button", { name: "Open user menu" }));
expect(screen.getByText("kramer@starclick.co")).toBeVisible();
expect(screen.getByRole("menuitem", { name: "Users" })).toBeVisible();
```

- [ ] **Step 7: Run shell tests to verify they fail**

Run: `npm test -- src/components/swapiz/layout/SwapizShell.test.tsx`

Expected: FAIL because shell components are missing.

- [ ] **Step 8: Implement shell components and dashboard layout**

Use `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, `SidebarRail`, `SidebarMenuBadge`, and `SidebarMenuButton`. Use Base UI `Menu.Root`, `Menu.Trigger`, `Menu.Portal`, `Menu.Positioner`, `Menu.Popup`, `Menu.Item`, `Menu.RadioGroup`, and `Menu.RadioItem` for the user menu.

The sidebar contains only four links. The topbar appears inside the shared layout. `Move money` dispatches `{ type: "move/open", operation: null }`. User-menu route items are Next links.

- [ ] **Step 9: Run shell tests and build checks**

Run:

```bash
npm test -- src/lib/swapiz/reducer.test.ts src/components/swapiz/layout/SwapizShell.test.tsx
npm run lint
npx tsc --noEmit
npm run build
```

Expected: tests PASS and the static export builds all dashboard routes currently present.

- [ ] **Step 10: Commit the shared shell**

```bash
git add src/lib/swapiz/reducer.ts src/components/swapiz/providers src/components/swapiz/layout src/app/dashboard/layout.tsx
git commit -m "feat: add shared Swapiz application shell"
```

---

### Task 4: Implement dynamic dashboard controls

**Files:**
- Create: `src/components/swapiz/dashboard/DashboardControls.tsx`
- Create: `src/components/swapiz/dashboard/ScopeSelect.tsx`
- Create: `src/components/swapiz/dashboard/DateRangePopover.tsx`
- Test: `src/components/swapiz/dashboard/DashboardControls.test.tsx`

**Interfaces:**
- Consumes: `useSwapiz`, `getPresetRange`, `validateDateRange`, organization list.
- Produces: shared dashboard scope/date controls and direct movement shortcuts.

- [ ] **Step 1: Write failing interaction tests**

Test these user-visible behaviors:

```tsx
it("opens Send directly from the shortcut", async () => {
  await user.click(screen.getByRole("button", { name: "Send" }));
  expect(dispatch).toHaveBeenCalledWith({ type: "move/open", operation: "send" });
});

it("applies an organization scope", async () => {
  await user.click(screen.getByRole("button", { name: /All companies/ }));
  await user.click(screen.getByRole("option", { name: "Marketing" }));
  expect(dispatch).toHaveBeenCalledWith({ type: "filters/scope", scopeId: "marketing" });
});

it("blocks an invalid custom range", async () => {
  await user.click(screen.getByRole("button", { name: /Last 30 days/ }));
  await user.click(screen.getByRole("button", { name: "Custom range" }));
  await user.clear(screen.getByLabelText("From"));
  await user.type(screen.getByLabelText("From"), "2026-10-31");
  await user.clear(screen.getByLabelText("To"));
  await user.type(screen.getByLabelText("To"), "2026-10-01");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(screen.getByText("End date must be on or after start date.")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/dashboard/DashboardControls.test.tsx`

Expected: FAIL because control components are missing.

- [ ] **Step 3: Implement scope selection and responsive actions**

Use Base UI Popover or Menu. Show company choices first and indented department choices with parent context. At widths below 640 px keep Send visible and move Receive, Transfer, Swap, and Mass Pay into a `More` menu.

- [ ] **Step 4: Implement the date-range popover**

Match the supplied layout: presets in the left column; custom range in the right column; Reset, Cancel, Apply. Keep draft dates inside the component until Apply. Cancel restores the applied state. Presets apply immediately and close the popover.

- [ ] **Step 5: Run tests and checks**

Run:

```bash
npm test -- src/components/swapiz/dashboard/DashboardControls.test.tsx
npm run lint
npx tsc --noEmit
```

Expected: all control tests PASS; lint and TypeScript exit 0.

- [ ] **Step 6: Commit the controls**

```bash
git add src/components/swapiz/dashboard/DashboardControls.tsx src/components/swapiz/dashboard/ScopeSelect.tsx src/components/swapiz/dashboard/DateRangePopover.tsx src/components/swapiz/dashboard/DashboardControls.test.tsx
git commit -m "feat: add dynamic Swapiz dashboard filters"
```

---

### Task 5: Rebuild the overview KPIs and widgets from shared selectors

**Files:**
- Create: `src/components/swapiz/dashboard/OverviewPage.tsx`
- Create: `src/components/swapiz/dashboard/KpiGrid.tsx`
- Create: `src/components/swapiz/dashboard/BalanceTrend.tsx`
- Create: `src/components/swapiz/dashboard/AssetAllocation.tsx`
- Create: `src/components/swapiz/dashboard/FlowComparison.tsx`
- Create: `src/components/swapiz/dashboard/AttentionQueue.tsx`
- Create: `src/components/swapiz/dashboard/RecentTransactions.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Test: `src/components/swapiz/dashboard/OverviewPage.test.tsx`

**Interfaces:**
- Consumes: `useSwapiz().snapshot`, `GlassCard`, `StatusBadge`, `DashboardControls`.
- Produces: finished `/dashboard` overview.

- [ ] **Step 1: Write failing overview tests**

Render the page with a provider fixture and verify all six KPIs and empty-state behavior:

```tsx
expect(screen.getByText("Total balance")).toBeVisible();
expect(screen.getByText("Available to move")).toBeVisible();
expect(screen.getByText("Net flow")).toBeVisible();
expect(screen.getByText("Upcoming obligations")).toBeVisible();
expect(screen.getByText("Pending approvals")).toBeVisible();
expect(screen.getByText("Needs attention")).toBeVisible();
expect(screen.getByRole("heading", { name: "Balance trend" })).toBeVisible();
expect(screen.getByRole("heading", { name: "Recent transactions" })).toBeVisible();
```

Add a fixture with no matching observations and assert the reset action dispatches scope `all` and preset `last-30-days`.

- [ ] **Step 2: Run the overview test to verify it fails**

Run: `npm test -- src/components/swapiz/dashboard/OverviewPage.test.tsx`

Expected: FAIL because overview components are missing.

- [ ] **Step 3: Implement the six-card KPI layer**

Use CSS grid: 2 columns on small tablets, 3 columns on medium desktop, 6 columns on wide desktop only when card width remains at least 150 px. Pending approval and Needs attention use the specified restrained semantic surfaces. Monetary values use `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })` and `.tnum`.

- [ ] **Step 4: Implement accessible chart widgets without a new runtime dependency**

Build SVG line/area and bar charts from shared observations. Each SVG has `role="img"`, an accessible label, and an adjacent visually-hidden summary. The asset widget uses a CSS conic-gradient plus a textual legend. Series have different dash or marker treatments in addition to color.

- [ ] **Step 5: Implement attention and transaction widgets**

Show the first four unresolved alerts and six newest filtered transactions. Link headings/actions to `/dashboard/alerts` and `/dashboard/transactions`. Render actionable empty states.

- [ ] **Step 6: Replace the dashboard page entry**

`src/app/dashboard/page.tsx` renders `OverviewPage`. Stop importing the old `DashboardClient`. Do not delete old Mercury dashboard files until Task 12 confirms no remaining imports.

- [ ] **Step 7: Run tests, lint, typecheck, and build**

```bash
npm test -- src/components/swapiz/dashboard/OverviewPage.test.tsx
npm run lint
npx tsc --noEmit
npm run build
```

Expected: test PASS and `/dashboard` exports successfully.

- [ ] **Step 8: Commit the overview**

```bash
git add src/components/swapiz/dashboard src/app/dashboard/page.tsx
git commit -m "feat: rebuild Swapiz overview dashboard"
```

---

### Task 6: Add the global full-screen Move money experience

**Files:**
- Create: `src/components/swapiz/move-money/MoveMoneyLayer.tsx`
- Create: `src/components/swapiz/move-money/OperationChooser.tsx`
- Create: `src/components/swapiz/move-money/FlowFrame.tsx`
- Create: `src/components/swapiz/move-money/SendFlow.tsx`
- Create: `src/components/swapiz/move-money/ReceiveFlow.tsx`
- Create: `src/components/swapiz/move-money/TransferFlow.tsx`
- Create: `src/components/swapiz/move-money/SwapFlow.tsx`
- Create: `src/components/swapiz/move-money/MassPayFlow.tsx`
- Create: `src/components/swapiz/move-money/PaymentLinkFlow.tsx`
- Modify: `src/components/swapiz/layout/SwapizShell.tsx`
- Test: `src/components/swapiz/move-money/MoveMoneyLayer.test.tsx`

**Interfaces:**
- Consumes: `useSwapiz`, wallet/organization data, movement options, `GlassCard`.
- Produces: global operation chooser and six step-based demo flows.

- [ ] **Step 1: Write failing chooser and close tests**

```tsx
it("shows all operations when global Move money opens", () => {
  renderLayer({ open: true, operation: null });
  for (const name of ["Send", "Receive", "Internal transfer", "Swap", "Mass Pay", "Payment Link"]) {
    expect(screen.getByRole("button", { name })).toBeVisible();
  }
});

it("closes with Escape and restores the originating screen", async () => {
  renderLayer({ open: true, operation: "send" });
  await user.keyboard("{Escape}");
  expect(dispatch).toHaveBeenCalledWith({ type: "move/close" });
});

it("opens a shortcut directly on its form", () => {
  renderLayer({ open: true, operation: "swap" });
  expect(screen.getByRole("heading", { name: "Swap" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "How would you like to move money?" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/move-money/MoveMoneyLayer.test.tsx`

Expected: FAIL because the layer is missing.

- [ ] **Step 3: Implement the accessible full-screen shell and chooser**

Use Base UI `Dialog.Root` controlled by provider state. `Dialog.Popup` fills the viewport with `min-h-[100dvh]`. Include Swapiz mark/name, Close button, centered content, and operation cards. Back from a form dispatches `move/choose` with `operation: null`; Close dispatches `move/close`.

- [ ] **Step 4: Implement Send, Receive, Transfer, and Swap flows**

Preserve the analyzed prototype fields and validation:

- Send: organization, source wallet, amount, pay asset, receive asset, network, recipient address, comment, summary, create approval.
- Receive: organization, destination wallet, optional Mid Master AML path, amount, comment, generated request.
- Transfer: organization, source wallet, same-network destination wallet, amount, comment, summary.
- Swap: organization, wallet, network, pay asset/amount, receive asset, quote, summary.

Each form uses real labels, `aria-describedby` for errors, and a review step. Submit dispatches a demo approval or transaction action and displays `Demo request created` rather than claiming settlement.

- [ ] **Step 5: Implement Mass Pay and Payment Link flows**

Mass Pay includes editable recipient rows, CSV upload parsing for `company,currency,network,amount,address`, 200-row limit, address/network validation, row selection, batch summary, and demo approval creation.

Payment Link includes Business/Personal, payer name, invoice title, amount, currency, expiration, receiving organization, WhatsApp/SMS/Email choices, appearance choice, and demo link confirmation.

- [ ] **Step 6: Add flow-specific tests**

Extend the test file to assert:

- invalid Send address prevents review;
- Transfer disables different-network destinations;
- Receive Mid Master copy is visible when checked;
- Swap quote updates when amount changes;
- invalid CSV row displays `Check` and is excluded from batch creation;
- Payment Link requires at least one delivery channel.

- [ ] **Step 7: Mount the layer once in `SwapizShell`**

Render `MoveMoneyLayer` after the shared page inset so every route opens the same controlled layer.

- [ ] **Step 8: Run movement tests and checks**

```bash
npm test -- src/components/swapiz/move-money/MoveMoneyLayer.test.tsx
npm run lint
npx tsc --noEmit
npm run build
```

Expected: movement tests PASS and static export succeeds.

- [ ] **Step 9: Commit the movement experience**

```bash
git add src/components/swapiz/move-money src/components/swapiz/layout/SwapizShell.tsx
git commit -m "feat: add full-screen Swapiz money flows"
```

---

### Task 7: Build the Alerts route and live badge updates

**Files:**
- Create: `src/app/dashboard/alerts/page.tsx`
- Create: `src/components/swapiz/alerts/AlertsPage.tsx`
- Create: `src/components/swapiz/alerts/ApprovalList.tsx`
- Create: `src/components/swapiz/alerts/AttentionList.tsx`
- Test: `src/components/swapiz/alerts/AlertsPage.test.tsx`

**Interfaces:**
- Consumes: provider approvals/alerts and reducer resolution actions.
- Produces: route UI and mutations reflected by sidebar/dashboard selectors.

- [ ] **Step 1: Write failing Alerts tests**

```tsx
expect(screen.getByRole("tab", { name: /Pending approval/ })).toHaveTextContent("7");
expect(screen.getByRole("tab", { name: /Needs attention/ })).toHaveTextContent("7");
await user.click(screen.getByRole("tab", { name: /Needs attention/ }));
await user.click(screen.getByRole("button", { name: "Review Amazon · DarkMatter Link" }));
await user.click(screen.getByRole("button", { name: "Resolve alert" }));
expect(dispatch).toHaveBeenCalledWith({ type: "alert/resolved", alertId: "n1" });
```

Also assert Critical and Warning filters and empty resolved states.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/alerts/AlertsPage.test.tsx`

Expected: FAIL because Alerts components are missing.

- [ ] **Step 3: Implement tabs, filters, detail panel, and resolution actions**

Use semantic tabs and a Base UI Dialog or in-page detail panel. Approval actions update approval progress or resolution. Alert actions update resolution. Preserve sanctions, AML velocity, gas, low-balance, and unfreeze demo content.

- [ ] **Step 4: Run tests and checks**

```bash
npm test -- src/components/swapiz/alerts/AlertsPage.test.tsx src/components/swapiz/layout/SwapizShell.test.tsx
npm run lint
npx tsc --noEmit
```

Expected: route tests PASS and the shell badge test reflects provider state.

- [ ] **Step 5: Commit Alerts**

```bash
git add src/app/dashboard/alerts src/components/swapiz/alerts
git commit -m "feat: add Swapiz approvals and alerts"
```

---

### Task 8: Build Companies, wallet detail, and money-flow rules

**Files:**
- Create: `src/app/dashboard/companies/page.tsx`
- Create: `src/app/dashboard/companies/[companyId]/page.tsx`
- Create: `src/components/swapiz/companies/CompaniesPage.tsx`
- Create: `src/components/swapiz/companies/CompanyDetailPage.tsx`
- Create: `src/components/swapiz/companies/WalletList.tsx`
- Create: `src/components/swapiz/companies/MoneyFlowRules.tsx`
- Test: `src/components/swapiz/companies/CompaniesPage.test.tsx`

**Interfaces:**
- Consumes: normalized organizations, wallets, asset balances, approvals.
- Produces: company list and route-addressable detail screens.

- [ ] **Step 1: Write failing company tests**

Assert parent/department terminology, wallet totals, and direct links:

```tsx
expect(screen.getByRole("link", { name: /Amazon/ })).toHaveAttribute("href", "/dashboard/companies/amazon");
expect(screen.getByText("4 departments")).toBeVisible();
expect(screen.queryByText("4 sub companies")).not.toBeInTheDocument();
```

For detail, assert Overview, Wallets, Money flow tabs; Master/Sub Master/Company wallet/Fee wallet groups; and five receive rules with their statuses.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/companies/CompaniesPage.test.tsx`

Expected: FAIL because company components are missing.

- [ ] **Step 3: Implement company list and static detail routes**

Use `generateStaticParams` for `amazon`, `openai`, and `hooli` in the dynamic page so static export succeeds. Unknown company IDs render `notFound()` only if the local Next static-export docs support it; otherwise render an explicit in-shell not-found state.

- [ ] **Step 4: Implement wallet and money-flow tabs**

Wallet groups expose network, asset chips, balance, and copyable address. Money Flow includes Receive rules and Exchange rules, with share, target, minimum, cap, status, and approver. Sweep and Auto-sweep remain demo actions with explicit confirmation copy.

- [ ] **Step 5: Run tests and build**

```bash
npm test -- src/components/swapiz/companies/CompaniesPage.test.tsx
npm run lint
npx tsc --noEmit
npm run build
```

Expected: tests PASS and all three company detail routes export.

- [ ] **Step 6: Commit Companies**

```bash
git add src/app/dashboard/companies src/components/swapiz/companies
git commit -m "feat: add Swapiz companies and wallets"
```

---

### Task 9: Build the unified Transactions route

**Files:**
- Create: `src/app/dashboard/transactions/page.tsx`
- Create: `src/components/swapiz/transactions/TransactionsPage.tsx`
- Create: `src/components/swapiz/transactions/TransactionFilters.tsx`
- Create: `src/components/swapiz/transactions/TransactionDetail.tsx`
- Test: `src/components/swapiz/transactions/TransactionsPage.test.tsx`

**Interfaces:**
- Consumes: provider transactions, organizations, date helpers, `StatusBadge`.
- Produces: filterable ledger and accessible detail panel.

- [ ] **Step 1: Write failing ledger tests**

Test search, type, organization, status, date, and detail persistence:

```tsx
await user.click(screen.getByRole("tab", { name: "Send" }));
expect(screen.getAllByRole("row").slice(1).every((row) => row.textContent?.includes("Send"))).toBe(true);
await user.type(screen.getByRole("searchbox", { name: "Search transactions" }), "183796");
expect(screen.getByText("#183796")).toBeVisible();
await user.click(screen.getByRole("button", { name: "View transaction 183796" }));
expect(screen.getByRole("dialog", { name: "Transaction 183796" })).toBeVisible();
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/transactions/TransactionsPage.test.tsx`

Expected: FAIL because transaction components are missing.

- [ ] **Step 3: Implement filters, responsive table, and detail panel**

Use the shared date component logic without coupling to dashboard state unless the user explicitly changes the Transactions filters. Preserve ID/time, type, amount, network, company/wallet, source, and status. On small screens render the same records as stacked rows; do not remove columns from the accessible name.

- [ ] **Step 4: Run tests and checks**

```bash
npm test -- src/components/swapiz/transactions/TransactionsPage.test.tsx
npm run lint
npx tsc --noEmit
```

Expected: transaction tests PASS; lint and TypeScript exit 0.

- [ ] **Step 5: Commit Transactions**

```bash
git add src/app/dashboard/transactions src/components/swapiz/transactions
git commit -m "feat: add unified Swapiz transactions"
```

---

### Task 10: Add Settings, Users, and Roles routes

**Files:**
- Create: `src/app/dashboard/settings/page.tsx`
- Create: `src/app/dashboard/users/page.tsx`
- Create: `src/app/dashboard/roles/page.tsx`
- Create: `src/components/swapiz/settings/SettingsPage.tsx`
- Create: `src/components/swapiz/settings/UsersPage.tsx`
- Create: `src/components/swapiz/settings/RolesPage.tsx`
- Test: `src/components/swapiz/settings/SettingsRoutes.test.tsx`

**Interfaces:**
- Consumes: provider theme, demo users/roles, Mercury form primitives.
- Produces: all user-menu destinations.

- [ ] **Step 1: Write failing settings-route tests**

Assert Settings exposes language, currency, timezone, branding, 2FA, approver threshold, and channels. Assert Users lists nine demo users with role/scope/limit/2FA. Assert Roles lists five roles and locks Owner-only fee permissions for Finance.

```tsx
expect(screen.getByLabelText("Two-factor authentication")).toBeChecked();
expect(screen.getByRole("cell", { name: /Anna Kovalenko/ })).toBeVisible();
expect(screen.getByLabelText("Fee income & Sweep")).toBeDisabled();
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/swapiz/settings/SettingsRoutes.test.tsx`

Expected: FAIL because route components are missing.

- [ ] **Step 3: Implement Settings**

Use controlled demo forms. Saving displays a toast or inline confirmation that settings were updated in the demo. Theme changes dispatch the shared provider action. Messaging tokens are never rendered.

- [ ] **Step 4: Implement Users and Roles**

Users supports search and role filtering plus add/edit/delete demo dialogs. Roles supports expansion and permission editing. Owner-only permission inputs remain disabled for all non-Owner roles.

- [ ] **Step 5: Run tests and checks**

```bash
npm test -- src/components/swapiz/settings/SettingsRoutes.test.tsx
npm run lint
npx tsc --noEmit
npm run build
```

Expected: settings tests PASS and all three routes export.

- [ ] **Step 6: Commit user-menu routes**

```bash
git add src/app/dashboard/settings src/app/dashboard/users src/app/dashboard/roles src/components/swapiz/settings
git commit -m "feat: add Swapiz settings users and roles"
```

---

### Task 11: Record the approved visual system and update Obsidian

**Files:**
- Modify: `.21st/design.json`
- Modify: `.21st/DESIGN.md`
- Modify: `docs/mercury-design-system.md`
- Modify: `/Users/laurasibille/Obsidian/Projets/Mercury/00 - Project Overview.md`
- Modify: `/Users/laurasibille/Obsidian/Projets/Mercury/01 - Design System.md`
- Create: `/Users/laurasibille/Obsidian/Projets/Mercury/02 - Swapiz Product Architecture.md`

**Interfaces:**
- Consumes: implemented routes, final tokens, approved spec.
- Produces: repository and Obsidian documentation aligned with production behavior.

- [ ] **Step 1: Update 21st design context**

Change project name/product type to Swapiz treasury prototype. Set `colorMode` to `light-dark`. Add decisions dated `2026-10-31` for:

- four-item sidebar;
- persistent Move money/user topbar;
- glass limited to data and flow surfaces;
- organization/date filters drive all widgets;
- full-screen movement flows;
- navigation remains 14 px.

Keep the existing sidebar-08 decision. Do not edit the unrelated duplicate files with ` 2` in their names.

- [ ] **Step 2: Update repository design-system documentation**

Document exact light/dark/glass tokens, component usage, forbidden beige background, responsive shell, full-screen flows, status semantics, and minimum type size.

- [ ] **Step 3: Update Obsidian overview and design system**

Update the existing links and replace “Mercury dashboard reconstruction” with “Swapiz treasury prototype using the Mercury design system.” Record the routes, demo-only boundary, Cloudflare URL, GitHub repository, sidebar behavior, theme behavior, and verification date.

- [ ] **Step 4: Create the product architecture note**

`02 - Swapiz Product Architecture.md` must contain:

- product positioning;
- companies versus departments decision;
- wallet hierarchy;
- Send, Receive, Transfer, Swap, Mass Pay, and Payment Link flows;
- approval/compliance model;
- dashboard KPI definitions;
- V1 crypto-first and fiat-display assumption;
- payroll-execution-not-payroll-calculation boundary;
- unresolved production integrations listed as future work, not implied capabilities.

- [ ] **Step 5: Verify documentation consistency**

Run:

```bash
rg -n "15px|beige|sub companies|real transfer|real payment" .21st docs/mercury-design-system.md '/Users/laurasibille/Obsidian/Projets/Mercury'
```

Expected: no stale 15 px navigation, beige direction, department mislabeled as sub-company, or claims of real transfer execution. Review legitimate contextual matches manually.

- [ ] **Step 6: Commit repository documentation**

Obsidian is outside the Git repository and is not included in this commit.

```bash
git add .21st/design.json .21st/DESIGN.md docs/mercury-design-system.md
git commit -m "docs: record Swapiz Mercury design system"
```

---

### Task 12: Remove superseded demo UI, run full QA, and deploy Cloudflare Pages

**Files:**
- Delete only after import audit: old files under `src/components/mercury/dashboard/` that are no longer referenced.
- Delete only after import audit: `src/components/mercury/layout/DemoBanner.tsx`, old `Sidebar.tsx`, old `Topbar.tsx`, and `TryMercuryPanel.tsx` when unreferenced.
- Modify: `README.md`
- Generated: `out/`

**Interfaces:**
- Consumes: all completed application tasks.
- Produces: verified static export and deployed Cloudflare Pages revision.

- [ ] **Step 1: Audit imports before deleting old UI**

Run:

```bash
rg -n "components/mercury/dashboard|DemoBanner|TryMercuryPanel|layout/Sidebar|layout/Topbar" src
```

Delete only files with zero remaining imports outside the deletion set. Preserve Mercury primitives, `src/components/ui/sidebar.tsx`, and the intentional untracked duplicate files.

- [ ] **Step 2: Update README**

Document product scope, local commands, route list, demo boundary, static export, Cloudflare project, and Obsidian location. Keep commands exact:

```bash
npm install
npm test
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 3: Run the complete automated verification**

Run fresh:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npx 21st review src/app src/components/swapiz src/styles/mercury-tokens.css
```

Expected: zero test failures, zero lint errors, TypeScript exit 0, static export exit 0, and no unresolved blocking 21st findings. Apply only deterministic fixes, then rerun the affected command and the full suite.

- [ ] **Step 4: Start the static export locally**

Run:

```bash
npx serve out -l 4173
```

Keep the returned process/session active for browser QA.

- [ ] **Step 5: Verify desktop light mode with agent-browser**

At 1440×1000, verify:

- `/dashboard` renders all six KPI labels and five movement shortcuts;
- sidebar collapses and expands;
- Alerts badge is visible;
- scope Marketing changes displayed metrics;
- Last 7 days and a valid custom range update the range label;
- user menu exposes email, Settings, Theme, Users, Roles;
- Move money opens the chooser; Send shortcut opens Send directly; Close returns to Overview;
- no console errors.

Capture `artifacts/swapiz-dashboard-light.png`.

- [ ] **Step 6: Verify dark mode and secondary routes**

Switch theme to Dark and visit:

- `/dashboard/alerts`;
- `/dashboard/companies` and `/dashboard/companies/amazon`;
- `/dashboard/transactions`;
- `/dashboard/settings`;
- `/dashboard/users`;
- `/dashboard/roles`.

Verify shared top navigation on every route, readable glass contrast, active sidebar item, filters, details, and no console errors. Capture `artifacts/swapiz-dashboard-dark.png`.

- [ ] **Step 7: Verify mobile behavior**

At 390×844, verify mobile sidebar sheet, Send + More action layout, non-overflowing KPI grid, date popover fit, scrollable transaction content, full-screen money flow, and 100dvh Close access. Capture `artifacts/swapiz-dashboard-mobile.png`.

- [ ] **Step 8: Verify production route files**

Run:

```bash
test -f out/dashboard/index.html
test -f out/dashboard/alerts/index.html
test -f out/dashboard/companies/index.html
test -f out/dashboard/companies/amazon/index.html
test -f out/dashboard/transactions/index.html
test -f out/dashboard/settings/index.html
test -f out/dashboard/users/index.html
test -f out/dashboard/roles/index.html
```

Expected: every command exits 0.

- [ ] **Step 9: Commit the verified cleanup**

```bash
git add README.md src/components/mercury/dashboard src/components/mercury/layout
git commit -m "chore: remove superseded Mercury demo UI"
```

If no tracked files changed after the import audit, skip this commit rather than creating an empty commit.

- [ ] **Step 10: Deploy the verified export**

First inspect the authenticated Cloudflare account and existing project without mutation:

```bash
npx wrangler pages project list
```

Confirm the exact existing project name is `mercury-cux`. Then deploy:

```bash
npx wrangler pages deploy out --project-name mercury-cux --branch main
```

Expected: Wrangler reports a successful deployment URL for the existing `mercury-cux` project.

- [ ] **Step 11: Verify the live deployment**

Open `https://mercury-cux.pages.dev/dashboard` in a fresh agent-browser session. Verify page title, Home/Alerts/Companies/Transactions navigation, Move money chooser, user dropdown, scope/date controls, and browser console. Capture a final production screenshot.

- [ ] **Step 12: Push commits only after live verification**

Run:

```bash
git status --short
git log --oneline --decorate -12
git push origin main
```

Do not add or delete the pre-existing unrelated untracked duplicate files. Report the live URL, commit range, automated checks, manual route checks, screenshots, and Obsidian files updated.
