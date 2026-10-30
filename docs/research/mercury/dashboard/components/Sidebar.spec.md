# Sidebar

## Revised shell — 2026-10-30

- Pattern: shadcn `sidebar-08`, adapted to Mercury content.
- Expanded width: 240px.
- Collapsed rail: 56px.
- Background: `#fbfcfd`.
- Navigation labels: 14/20 regular; metadata: 12/18.
- Desktop/tablet: icon-collapse with tooltips and clickable rail.
- Mobile: left sheet controlled by the shared trigger.
- Persistence: `mercury_sidebar_open` in local storage.
- Keyboard: `⌘/Ctrl+B` toggles the sidebar.

- Target: `src/components/mercury/layout/Sidebar.tsx`
- Desktop: 219px fixed column below banner, white, right border `#ededf3`.
- Product row 56px; segmented product switcher; selected Banking surface.
- Links: 30–36px rows, 8px radius, 15/24 type; Home selected.
- Bookmarks separated by top border.
- Mobile/tablet: hidden; compact drawer opened by topbar menu.

