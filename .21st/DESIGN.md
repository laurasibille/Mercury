# Swapiz Treasury Prototype Design Context

Generated and reviewed against the approved implementation on 2026-10-31.

## Product

- Name: Swapiz treasury prototype using the Mercury design system.
- Type: Client-side treasury product prototype.
- Stack: Next.js App Router, React, TypeScript, and Tailwind CSS v4.
- Deployment target: static export for Cloudflare Pages.
- Color modes: light and dark, with a system theme option.

## Sources

- Tokens: `src/styles/mercury-tokens.css` and `src/app/globals.css`.
- Shared shell: `src/components/swapiz/layout/` and `src/components/ui/sidebar.tsx`.
- Product components: `src/components/swapiz/`.
- Product data and state: `src/data/swapiz-demo.ts`, `src/types/swapiz.ts`, and `src/lib/swapiz/`.
- Approved design: `docs/superpowers/specs/2026-10-31-swapiz-mercury-dashboard-redesign-design.md`.
- Project instructions: `AGENTS.md`.

## Visual system

- Typography: Inter Variable; body and navigation 14px / 20px; metadata 12px / 18px; meaningful text does not fall below 12px.
- Core colors: primary `#5266eb`, ink `#1e1e2a`, light sidebar `#fbfcfd`.
- Geometry: 4px spacing base, 8px control radius, 12px card and panel radius.
- Light and dark themes use semantic tokens. Dark mode uses deep cool neutrals and indigo accents rather than simple inversion.
- Glass is restricted to KPI cards, analytical widgets, major popovers, and movement-flow surfaces. Navigation, tables, and basic inputs stay structurally Mercury-like.
- Avoid beige or orange page backgrounds.

## Shell and behavior

- The `sidebar-08` shell has a 240px expanded sidebar and a 56px collapsed rail, with a responsive mobile sheet.
- Primary navigation is Home, Alerts, Companies, and Transactions. Alerts shows unresolved approvals plus unresolved attention items.
- The topbar and its Move money action and user menu remain visible on all dashboard routes.
- The user menu offers Settings, Users, Roles, and Light, Dark, or System theme selection.
- Organization and date-range filters feed all dashboard widgets.
- Send, Receive, Transfer, Swap, Mass Pay, and Payment Link open in the full-screen movement layer.
- Only theme (`swapiz-theme`) and sidebar (`mercury_sidebar_open`) state persist in local storage.
- Status meaning is conveyed with text or iconography as well as color; visible focus and reduced-motion behavior are supported.

## Demo boundary

This is a client-side prototype using local demo data and session-only operations. It has no authentication, database, server API, custody, bank rails, live blockchain execution, or connected compliance provider. Creating a movement makes a local demo request or approval; it does not move real funds or perform a live AML or sanctions check. Fiat values are for display, invoicing, and limits; crypto assets and networks are the demonstrated settlement rails.

## Recorded decisions

- 2026-10-30: retain the `sidebar-08` pattern at 240px expanded and 56px collapsed.
- 2026-10-31: use the four-item Home, Alerts, Companies, and Transactions sidebar.
- 2026-10-31: keep Move money and the user menu in the persistent topbar.
- 2026-10-31: limit glass to data, analytical, popover, and movement-flow surfaces.
- 2026-10-31: apply shared organization and date filters across dashboard widgets.
- 2026-10-31: present all six movement operations in the full-screen layer.
- 2026-10-31: keep navigation at 14px / 20px.
