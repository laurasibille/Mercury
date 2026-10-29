# Mercury Dashboard Topology

## Desktop, 1440 × 1000

1. Fixed demo banner, 56px tall, dark canvas.
2. Fixed product sidebar, 219px wide, beginning below banner.
3. Fixed top bar, 72px tall, beginning at x=219.
4. Scrollable dashboard content, 968px wide at x=346 with 32px outer margins.
5. Welcome header and quick actions.
6. Two-column overview: balance card 470px and accounts card 470px, 24px gap.
7. Three-column operational modules: Credit Card, Bill Pay, Invoicing.
8. Two-column Money movement cards.
9. Transactions tabs and table.
10. Raised Try Mercury panel, 463 × 516px, anchored at lower right.

## Tablet, 768 × 1024

- Demo banner and full sidebar disappear.
- Compact 48px top bar.
- Content uses 16px page gutters.
- Balance and Accounts form two columns.
- Operational cards remain horizontal and overflow to the right.
- Try Mercury becomes a collapsed bottom education bar.

## Mobile, 390 × 844

- Compact top bar with truncated brand and icon actions.
- Quick actions collapse to `Send money` and `More`.
- Single-column cards with 16px gutters.
- Accounts become a vertical list with amounts.
- Education panel stays collapsed and fixed at bottom.

## Layering

- Demo banner: topmost desktop chrome.
- Sidebar/topbar: persistent navigation chrome.
- Try Mercury: raised overlay above dashboard cards.
- Dropdowns: raised popovers above cards.

