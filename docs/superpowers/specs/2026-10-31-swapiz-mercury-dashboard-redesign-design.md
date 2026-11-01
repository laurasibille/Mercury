# Swapiz × Mercury dashboard redesign

Date: 2026-10-31
Status: Approved design, awaiting implementation plan

## Objective

Replace the current Mercury demo content at `/dashboard` with the Swapiz corporate treasury product while preserving the maintainable Next.js application, the Mercury navigation shell, and the existing Cloudflare Pages URL.

The redesign must retain Swapiz's treasury, crypto, approval, compliance, company, wallet, and payment workflows. It must apply Mercury's information hierarchy, typography, navigation density, spacing, and interaction patterns while keeping glassmorphism as a restrained surface treatment.

## Product boundary

This iteration is a client-side product prototype. It does not introduce authentication, bank rails, blockchain execution, custody, AML providers, databases, or server APIs. Demo operations update client state only. The interface must not imply that a real transfer has been executed.

Fiat currencies remain display, invoicing, and limit currencies. Crypto assets and networks remain the demonstrated settlement rails.

## Information architecture

The main application lives under `/dashboard` and uses a shared shell for every primary screen.

Primary routes:

- `/dashboard`: consolidated overview.
- `/dashboard/alerts`: approvals and operational/compliance alerts.
- `/dashboard/companies`: companies, departments, wallets, and money-flow rules.
- `/dashboard/transactions`: unified transaction history.

Secondary screens are opened from the user menu while retaining the same shell:

- Settings.
- Users.
- Roles.

Secondary routes:

- `/dashboard/settings`.
- `/dashboard/users`.
- `/dashboard/roles`.

Browser history and direct linking must remain functional.

## Shared application shell

### Sidebar

Reuse the existing shadcn `sidebar-08` implementation and its responsive sheet behavior.

- Expanded width: 240 px.
- Collapsed icon rail: 56 px.
- Light background: `#fbfcfd` through a semantic token.
- Navigation labels: 14 px / 20 px.
- Items, in order: Home, Alerts, Companies, Transactions.
- Home is active on `/dashboard`.
- Alerts displays a numeric badge equal to unresolved pending approvals plus unresolved attention items.
- The expanded/collapsed state is available on all primary and secondary screens.

The old Mercury Tasks, Command, Accounts, Cards, Team Spend, Payments, Invoicing, Accounting, Bookmarks, and Banking/Payroll/Books switcher are removed.

### Top navigation

The top navigation is visible on every screen rendered inside the dashboard shell.

Left side:

- Sidebar trigger.
- Current page title. Company details use a compact `Companies / {name}` breadcrumb.

Right side:

- `Move money` action.
- User avatar and dropdown.

The user dropdown contains:

- Signed-in email: `kramer@starclick.co`.
- Settings.
- Theme with Light, Dark, and System choices.
- Users.
- Roles.

Theme selection is persisted locally. Keyboard navigation, visible focus, Escape-to-close, and outside-click behavior are required for menus and popovers.

## Dashboard composition

### Header and controls

The page heading is `Overview`.

Below it, a single responsive control row contains:

- Left: Send, Receive, Transfer, Swap, and Mass Pay actions.
- Right: organization scope selector and date-range selector.

Below 640 px the controls wrap without horizontal page overflow. Send remains visible and Receive, Transfer, Swap, and Mass Pay collapse into a `More` menu.

### Organization scope

The selector supports:

- All companies.
- Amazon, OpenAI, and Hooli.
- Marketing, Development, Operations, and Support departments under Amazon.

Every KPI, chart, alert list, asset breakdown, and transaction list receives the same selected scope. A department appears only when its parent company is represented in the demo dataset.

### Date range

The selector supports:

- Today.
- Last 7 days.
- Last 30 days.
- This month.
- Last 90 days.
- This year.
- Custom range.

Custom range contains start and end date inputs, Reset, Cancel, and Apply actions. The end date cannot precede the start date. The selected range is displayed beside or inside the trigger and is applied consistently to all time-sensitive widgets.

### KPI layer

The first data layer contains six responsive KPI cards:

- Total balance.
- Available to move.
- Net flow.
- Upcoming obligations.
- Pending approvals.
- Needs attention.

Definitions:

- Total balance is the aggregate USD value in the selected scope.
- Available to move excludes frozen funds and funds committed to pending outbound operations.
- Net flow is inflow minus outflow over the selected date range.
- Upcoming obligations aggregates scheduled payroll, supplier, and batch commitments in the selected date range.
- Pending approvals counts and totals unresolved approval requests.
- Needs attention counts unresolved critical, warning, and recoverable operational alerts.

Pending approvals uses a restrained warning tint and Needs attention uses a restrained critical tint. The remaining KPI cards use neutral Mercury surfaces.

### Analytical and operational widgets

Retain and adapt the current Swapiz content:

- Balance trend by company or department.
- Asset allocation.
- Inflow versus outflow.
- Priority attention queue.
- Recent transactions.

The balance trend and inflow/outflow widgets respond to the date range. All widgets respond to organization scope. Empty filtered states explain that no data exists for the selected scope and range and provide a reset action.

Charts use tabular number formatting and accessible text summaries. Color cannot be the only method of distinguishing series.

## Move money experience

### Entry points

The full-screen movement experience opens from:

- The global `Move money` button.
- Dashboard action buttons.
- Contextual actions elsewhere in the application.

The global button opens an operation chooser. Dashboard shortcuts open the selected operation directly.

### Full-screen shell

The experience replaces the application canvas with a full-viewport layer inspired by Mercury's payment flow.

- Swapiz mark and product name at the top left.
- Close action at the top right.
- Centered content column with generous whitespace.
- Operation title and progress context.
- Back action returns to the operation chooser or previous step.
- Close returns to the originating route without losing dashboard filters.

Supported operations:

- Send to an external address.
- Receive funds.
- Internal transfer.
- Swap.
- Mass Pay.
- Payment Link.

Existing Swapiz form content, validation, summaries, and approval semantics are preserved. The UI is rebuilt with project components rather than embedding the original bundled HTML.

Completing a demo flow creates or updates a local approval, transaction, or request record and visibly labels the result as a demo state.

## Alerts

The Alerts route has two primary tabs:

- Pending approval.
- Needs attention.

Pending approval supports payout, transfer, company wallet, money-flow rule, and mass-payment requests. Requests show initiator, amount when applicable, approval progress, creation time, and Review/View action.

Needs attention supports sanctions, AML velocity, frozen funds, gas, low balance, and unfreeze cases. Filters include All, Critical, Warning, and Resolved/OK when relevant.

Resolving or approving a demo item updates the sidebar badge and dashboard widgets immediately in client state.

## Companies

The Companies route preserves:

- Parent companies and departments.
- Status and pending-action counts.
- Master, Sub Master, Company cold, Fee, Exchange, Client, Mid Master, and Mid Send wallet types. Each type is displayed only for records that carry that explicit type.
- Network, asset, balance, and address information.
- Receive and exchange money-flow rules.
- Manual sweep and auto-sweep controls.

Company detail remains route-addressable. The hierarchy uses `department` in user-facing copy unless the entity is explicitly a legal subsidiary. Existing demo records currently named Marketing, Development, Operations, and Support are treated as departments.

## Transactions

The Transactions route presents the unified activity ledger with:

- Search.
- Type filter: All, Send, Receive, Swap, Transfer, Mass Pay.
- Company/department filter.
- Status filter.
- Date range.

Rows contain ID/time, operation type, amount, asset/network, company and wallet, source, and status. Selecting a row opens an accessible detail panel without losing filters.

## Settings, users, and roles

Preserve the existing Swapiz prototype content:

- Preferences, display currency, language, and timezone.
- Branding.
- Password and 2FA presentation.
- Second-approver threshold.
- Messaging channels.
- User scope, role, limit, 2FA, invitation status, and last activity.
- Owner, Admin, Finance, Compliance, and Viewer roles with granular permissions.

Owner-only fee and sweep permissions remain locked for other roles.

## Visual system

### Mercury identity

Retain the existing semantic Mercury token architecture and extend it for dark mode and glass surfaces.

- Typography: Inter Variable.
- Body and navigation: 14 px / 20 px.
- Metadata: 12 px / 18 px.
- Primary action: Mercury indigo `#5266eb`.
- Light sidebar: `#fbfcfd`.
- Primary ink: `#1e1e2a`.
- Standard radii: 8 px for controls, 12 px for cards and panels.
- Density: compact but with generous page-level whitespace.

### Glassmorphism

Glass is limited to KPI cards, analytical widgets, large popovers, and the full-screen movement form surfaces. Navigation, tables, and basic inputs remain structurally Mercury-like.

Glass surfaces use:

- Translucent semantic backgrounds.
- Backdrop blur.
- One-pixel inner highlight.
- Subtle tinted shadow consistent with the current theme.
- Sufficient opaque fallback and text contrast.

The light mode uses neutral/cool Mercury surfaces rather than the old beige/orange palette. The dark mode uses deep cool neutrals, indigo accents, and equivalent contrast relationships instead of simple color inversion.

## State and data model

Create typed client-side demo entities for:

- Organizations and departments.
- Wallets and balances.
- Daily balance and flow observations.
- Assets and networks.
- Approval requests.
- Alerts.
- Transactions.
- Upcoming obligations.
- Users and roles.

Every date-sensitive record has an ISO date. Every scoped record has organization and optional department identifiers. Dashboard selectors derive their values from this shared dataset rather than maintaining unrelated widget constants.

Shared client state owns theme, filters, demo mutations, overlay state, and unresolved counts. Only theme and sidebar state persist in local storage.

## Responsive and accessible behavior

- Desktop retains the collapsible sidebar and persistent top navigation.
- Tablet and mobile use the existing sidebar sheet.
- Wide tables scroll inside their own container.
- Full-screen flows use `min-height: 100dvh`.
- Dialogs and menus trap or manage focus appropriately.
- All controls have accessible names and visible focus states.
- Reduced-motion preferences disable nonessential transitions.
- Text never drops below 12 px for meaningful content.
- Statuses use text and iconography in addition to color.

## Implementation structure

The current monolithic `DashboardClient` is decomposed into focused units:

- Shared dashboard layout and top navigation.
- Simplified Swapiz sidebar.
- Dashboard filter state and controls.
- KPI and widget components.
- Move-money provider and full-screen flow shell.
- Route components for Alerts, Companies, Transactions, Settings, Users, and Roles.
- Typed Swapiz demo data and selectors.

Existing Mercury primitives and shadcn sidebar components are reused. New dependencies are avoided unless an existing primitive cannot satisfy accessibility requirements.

## Verification

Required before deployment:

- ESLint passes.
- TypeScript passes with no emit.
- Production static export succeeds.
- 21st review is run against changed UI paths.
- Browser verification at desktop and mobile widths.
- Light, dark, and system theme behavior is checked.
- Sidebar expanded, collapsed, and mobile-sheet states are checked.
- Organization and date filters update all dashboard widgets consistently.
- Custom range validation is checked.
- User menu navigation is checked.
- Each movement entry point opens full screen and Close returns correctly.
- Alerts badge updates after demo resolution.
- No browser console errors on the tested routes.

## Documentation and deployment

Update:

- `.21st/design.json` with the approved Swapiz × Mercury direction.
- `.21st/DESIGN.md` when generated context needs clarification.
- The Mercury design-system documentation with dark mode and glass tokens.
- The user's Swapiz Obsidian documentation with product understanding, information architecture, dashboard definitions, and provisional V1 assumptions.

After verification, export the Next.js application and deploy the `out/` directory to the existing Cloudflare Pages project serving `https://mercury-cux.pages.dev/dashboard`.

Deployment must not occur if the local build, browser smoke tests, or route checks fail.
