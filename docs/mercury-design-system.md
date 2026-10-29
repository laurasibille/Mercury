# Mercury Product Design System

Reusable product UI lives under `src/components/mercury`.

## Token layers

`src/styles/mercury-tokens.css` uses primitive, semantic and component layers. Components consume semantic or component variables; raw values are limited to extracted one-off geometry documented in specs.

## Typography

The source uses Arcadia Text. Inter Variable substitutes it because licensed Arcadia files are not supplied.

- Page title: 28/36
- Section title: 19/28
- Minor title: 17/28
- Body: 15/24
- Metadata: 13/18

## Primitives

- `Button`: primary, quiet and ghost variants.
- `Card`: 12px product surface with subtle border.
- `MercuryMark`: reusable inline mark for navigation and accounts.

## Layout and interaction

- Desktop: 219px sidebar and 968px content column.
- Tablet: compact topbar and no permanent sidebar.
- Mobile: stacked cards with 16px gutter.
- Controls require visible focus. Monetary values support shared private mode.

