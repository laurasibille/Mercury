export const accounts = [
  { name: "Credit Card", amount: "$12,505.87" },
  { name: "Treasury", amount: "$200,000.00" },
  { name: "Ops / Payroll", amount: "$2,023,267.12" },
  { name: "AP", amount: "$226,767.82" },
  { name: "AR", amount: "$0.00" },
];

export const transactions = [
  ["Oct 29", "Mercury Working Capital", "−$2,200.00", "Ops / Payroll", "Working Capital Loan Payment"],
  ["Oct 29", "Payment from NASA", "$419.00", "AR", "Request or Invoice Payment"],
  ["Oct 29", "Payment from Acme Corp", "$200.00", "AR", "Request or Invoice Payment"],
  ["Oct 29", "To Ops / Payroll", "−$55,810.16", "AR", "Transfer"],
  ["Oct 29", "From AR", "$55,810.16", "Ops / Payroll", "Transfer"],
  ["Oct 29", "Lily's Eatery", "$0.93", "Ops / Payroll", "Alice C. ••1234"],
  ["Oct 29", "Deli 77", "$63.53", "Credit account", "Mary M. ••0332"],
  ["Oct 29", "Deli 77", "$214.06", "Ops / Payroll", "Jane B. ••6112"],
  ["Oct 29", "Office Stop Co.", "−$287.89", "Ops / Payroll", "Jessica A. ••9914"],
  ["Oct 29", "Domestic Ads", "−$82.75", "Ops / Payroll", "Real-Time Payment"],
] as const;

export const transactionTabs = ["Recent", "My transactions", "Monthly money in", "Monthly money out", "Operating expenses"];

export const moneyIn = [["Venture Debt Loan", "$1,000,000.00"], ["GenPro", "$415,133.44"], ["Google", "$69,774.47"], ["Milgram Brokerage", "$60,499.95"]] as const;
export const moneyOut = [["Jordi O'Donnell", "−$90,797.16"], ["Gusto (Payroll)", "−$90,122.53"], ["Google", "−$71,055.95"], ["Milgram Brokerage", "−$58,210.78"]] as const;

export const tryTasks = {
  Startup: ["Send money to contractors", "Invite your team members", "Create cards for your team", "Request vendor payment details", "Issue SAFE to investors"],
  Ecommerce: ["Review store deposits", "Create cards for buyers", "Pay an international vendor", "Track inventory spend", "Automate monthly books"],
  Agency: ["Invoice a client", "Pay your contractors", "Create project cards", "Review operating spend", "Export client activity"],
  More: ["Explore Treasury", "Set team spend limits", "Create a recurring payment", "Connect accounting", "View financial insights"],
} as const;

