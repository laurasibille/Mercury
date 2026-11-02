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

Build before the standalone TypeScript check in a fresh checkout so Next.js generates its route types.

## Routes

- `/dashboard` — Overview and shared filters
- `/dashboard/alerts` — Approvals and operational alerts
- `/dashboard/companies` — Companies and department wallets
- `/dashboard/companies/amazon`, `/dashboard/companies/openai`, `/dashboard/companies/hooli` — Company details, wallets, and money-flow rules
- `/dashboard/transactions` — Searchable ledger, local filters, details, and CSV export
- `/dashboard/settings`, `/dashboard/users`, `/dashboard/roles` — Demo administration

## Deployment and documentation

The current Cloudflare Pages demo is available at [mercury-cux.pages.dev/dashboard](https://mercury-cux.pages.dev/dashboard). Design and architecture documentation lives in `.21st/`, `docs/mercury-design-system.md`, and `docs/superpowers/`. Related Obsidian notes live under `/Users/laurasibille/Obsidian/Projets/Swapiz/`.
