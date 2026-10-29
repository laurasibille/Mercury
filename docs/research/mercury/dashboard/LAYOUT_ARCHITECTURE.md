# Layout Architecture

- Desktop shell columns: 219px sidebar + fluid work area.
- Desktop content max-width: 968px; centered inside work area.
- Overview grid: `repeat(2, minmax(0, 1fr))`, 24px gap.
- Operational grid: `repeat(3, minmax(0, 1fr))`, 24px gap.
- Money movement grid: two equal columns, 24px gap.
- Breakpoint near 960px removes banner/sidebar and uses compact topbar.
- Breakpoint near 640px changes dashboard grids to one column.
- Cards remain white with subtle borders; page background white.

