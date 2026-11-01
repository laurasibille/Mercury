# Swapiz treasury prototype

Swapiz treasury workflows using the Mercury design system, built with Next.js, TypeScript, and Tailwind CSS. The dashboard shares organization/date filters, light and dark themes, a responsive sidebar, and six movement flows: Send, Receive, Transfer, Swap, Mass Pay, and Payment Link.

This is a client-side demo. Payments, wallet operations, approvals, compliance changes, users, roles, and settings simulate product behavior; no funds move and no bank or blockchain execution occurs. Only theme and sidebar preferences persist; demo changes reset on reload.

## Local development and checks

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npx tsc --noEmit
```

Build before the standalone TypeScript check in a fresh checkout so Next.js generates its route types. Run `npx @21st-dev/cli review src/app src/components/swapiz src/styles/mercury-tokens.css` for the design-context review.

## Routes

- `/dashboard` — Overview and shared filters
- `/dashboard/alerts` — Approvals and operational alerts
- `/dashboard/companies` — Companies and department wallets
- `/dashboard/companies/amazon`, `/dashboard/companies/openai`, `/dashboard/companies/hooli` — Company details, wallets, and money-flow rules
- `/dashboard/transactions` — Searchable ledger, local filters, details, and CSV export
- `/dashboard/settings`, `/dashboard/users`, `/dashboard/roles` — Demo administration

## Static export and deployment

`npm run build` exports to `out/`. The default `trailingSlash: false` emits `out/dashboard.html`, `out/dashboard/alerts.html`, and corresponding `.html` files for secondary routes. Preview with `npx serve out -l 4173`.

The existing Cloudflare Pages project is `mercury`; its assigned production domain is [mercury-cux.pages.dev/dashboard](https://mercury-cux.pages.dev/dashboard). After verification, deploy with:

```bash
npx wrangler pages project list
npx wrangler pages deploy out --project-name mercury --branch main
```

Design and architecture documentation lives in `.21st/`, `docs/mercury-design-system.md`, and the approved specification and plan in `docs/superpowers/`. Related Obsidian notes live at `/Users/laurasibille/Obsidian/Projets/Mercury/` (project overview, design system, and Swapiz product architecture).
