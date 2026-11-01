/** Stable permission catalogue, independent of mutable role assignments. */
export const rolePermissionCatalog = Object.freeze([
  "Send payments",
  "Mass payments",
  "Approve payments",
  "View balances",
  "Transfer between wallets",
  "Approve Company wallets",
  "Swap",
  "Create payment links",
  "Resend links",
  "View activity",
  "Export CSV",
  "Approve money flow rules",
  "Retry failed operations",
  "View fee settings",
  "Change fees",
  "Fee income & Sweep",
] as const);

