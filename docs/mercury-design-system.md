# Mercury Product Design System

Reusable product UI lives under `src/components/mercury`.

## Token layers

`src/styles/mercury-tokens.css` uses primitive, semantic and component layers. Components consume semantic or component variables; raw values are limited to extracted one-off geometry documented in specs.

## Typography

The source uses Arcadia Text. Inter Variable substitutes it because licensed Arcadia files are not supplied.

- Page title: 28/36
- Section title: 19/28
- Minor title: 16/24
- Body: 14/20
- Navigation: 14/20
- Metadata: 13/18
- Compact metadata and badges: 12/18

The previous 15px navigation size was reduced to 14px to improve hierarchy and density. Navigation labels use regular weight; active state is communicated through background, icon and contrast rather than heavier type alone.

## Primitives

- `Button`: primary, quiet and ghost variants.
- `Card`: 12px product surface with subtle border.
- `MercuryMark`: reusable inline mark for navigation and accounts.
- shadcn `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger` and `SidebarRail`: responsive shell, icon rail, mobile drawer and accessible tooltips.

## Layout and interaction

- Desktop: 240px sidebar, collapsible to a 56px icon rail, and 968px content column.
- Tablet: collapsible rail from 768px upward; drawer below 768px.
- Mobile: stacked cards with 16px gutter.
- Sidebar surface: `#fbfcfd` (`--sidebar-background`).
- Sidebar state persists in `localStorage`; `⌘/Ctrl+B` toggles the rail.
- Controls require visible focus. Monetary values support shared private mode.

