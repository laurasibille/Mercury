# Mercury Design System for the Swapiz Treasury Prototype

This prototype uses the Mercury navigation shell and visual system for Swapiz treasury workflows. The live interface is implemented under `src/components/swapiz`; the shared semantic token layer remains in `src/styles/mercury-tokens.css` and `src/app/globals.css`.

## Typography and density

Inter Variable is used because the licensed Arcadia Text files are not supplied. Page titles use 28px / 36px, section titles 19px / 28px, minor titles 16px / 24px, body and navigation 14px / 20px, and metadata 12px / 18px. Meaningful text is at least 12px. Numeric values use tabular figures where appropriate.

## Semantic tokens

Components consume semantic variables from `mercury-tokens.css`; the utility layer and theme selectors live in `globals.css`.

| Token or role | Light | Dark |
|---|---|---|
| Canvas | `#ffffff` | `#11131a` |
| Subtle canvas | `#fbfcfd` | `#171a23` |
| Surface | `#f4f5f9` | `#20242f` |
| Hover surface | `#dddde5` | `#292e3b` |
| Border | `#ededf3` | `#2d3240` |
| Primary ink | `#1e1e2a` | `#f4f5f8` |
| Secondary ink | `#363644` | `#d2d5df` |
| Muted ink | `#535461` | `#9da3b2` |
| Primary action | `#5266eb` | `#5266eb` |
| Sidebar | `#fbfcfd` | `#151820` |

The dark theme also uses semantic success `#71d9b5`, negative `#ff9dbd`, and softer indigo `#292f58`. Do not use a beige or orange page background: the light canvas and analytical surfaces stay neutral and cool.

### Glass surfaces

Glass uses translucent semantic fills, a 20px backdrop blur, a one-pixel inner highlight, and a theme-appropriate soft shadow. The exact implementation tokens are:

| Token | Light | Dark |
|---|---|---|
| `--swapiz-canvas` | `#f7f8fb` | `#11131a` |
| `--swapiz-glass` | `rgba(255, 255, 255, 0.72)` | `rgba(31, 35, 47, 0.72)` |
| `--swapiz-glass-strong` | `rgba(255, 255, 255, 0.9)` | `rgba(31, 35, 47, 0.92)` |
| `--swapiz-glass-border` | `rgba(255, 255, 255, 0.82)` | `rgba(255, 255, 255, 0.08)` |
| `--swapiz-glass-shadow` | `0 18px 50px rgba(47, 52, 86, 0.1), inset 0 1px rgba(255, 255, 255, 0.92)` | `0 18px 50px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.06)` |

Use glass only for KPI cards, analytical widgets, major popovers, and movement-flow surfaces. `GlassCard` provides the shared surface for data cards. Navigation, tables, basic inputs, and ordinary panels use the standard Mercury surface and border tokens. The stronger glass variant is for major popovers.

## Components and layout

- Reuse the shadcn `sidebar-08` primitives through `src/components/ui/sidebar.tsx`.
- The sidebar is 240px expanded and 56px collapsed; below 768px it uses a sheet. Its background is the semantic `--sidebar-background` token, not a hardcoded component color.
- The primary sidebar has Home, Alerts, Companies, and Transactions. The Alerts count combines unresolved approvals and attention items.
- A persistent topbar contains the current page context, Move money, and the user menu on every dashboard route.
- The desktop content column is 968px. Narrow layouts stack cards, wrap dashboard controls, and keep wide tables in their own scrolling container.
- Theme options are Light, Dark, and System. Theme preference and sidebar open state persist locally; filters and demo mutations are session state.
- Focus remains visible, dialogs and menus manage focus, and reduced-motion preferences disable nonessential transitions.

## Full-screen movement flows

The global Move money action opens an operation chooser; dashboard shortcuts open the selected flow directly. Send, Receive, Transfer, Swap, Mass Pay, and Payment Link render inside a full-viewport dialog. Closing returns to the originating route and retains its filters. Review and completion copy label local mutations as demo requests. Glass may be used for the movement form surfaces; the surrounding shell retains the neutral Swapiz canvas.

## Status semantics

`StatusBadge` combines status wording with an icon or other visual cue and color. Warning, critical, success, and informational tints are semantic tokens with separate light and dark values. Never rely on color alone to distinguish a status. Keep all badge and status text at least 12px / 18px.

## Product boundary

This is a client-side product prototype. Local demo interactions can create or resolve displayed requests, approvals, and alerts, but they do not execute a bank payment or blockchain transaction, move or unfreeze funds, deliver a payment link, send messages, or make a live AML or sanctions decision. Authentication, server APIs, persistent business data, custody, banking and blockchain execution, and external compliance or messaging providers are future production integrations, not current capabilities. Fiat is used for display, invoicing, and limits; crypto assets and networks are the demonstrated settlement rails.

## Related implementation

- Approved design: `docs/superpowers/specs/2026-10-31-swapiz-mercury-dashboard-redesign-design.md`.
- Routes: `/dashboard`, `/dashboard/alerts`, `/dashboard/companies`, `/dashboard/companies/[companyId]`, `/dashboard/transactions`, `/dashboard/settings`, `/dashboard/users`, and `/dashboard/roles`.
- Shared shell: `src/components/swapiz/layout/`.
- Status and glass primitives: `src/components/swapiz/primitives/`.
- Theme tokens: `src/styles/mercury-tokens.css` and `src/app/globals.css`.
