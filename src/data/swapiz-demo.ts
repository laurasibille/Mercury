import type { SwapizDemoData } from "@/types/swapiz";

// Normalized from Swapiz GlassSend (5).html. Chart dates retain their 2026 labels;
// relative operational timestamps are anchored to 2026-10-31. Wallet token balances
// are operational records; daily observations are the dashboard balance authority.
// Obligations are explicit prototype commitments, not an existing source ledger.
export const swapizDemoData: SwapizDemoData = {
  "organizations": [
    {
      "id": "amazon",
      "name": "Amazon",
      "kind": "company",
      "status": "Active",
      "displayId": "CO-1001"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "kind": "company",
      "status": "Active",
      "displayId": "CO-1002"
    },
    {
      "id": "hooli",
      "name": "Hooli",
      "kind": "company",
      "status": "Onboarding 5 / 8",
      "displayId": "CO-1003"
    },
    {
      "id": "marketing",
      "name": "Marketing",
      "kind": "department",
      "parentId": "amazon",
      "status": "Active",
      "displayId": "CO-1001-1"
    },
    {
      "id": "development",
      "name": "Development",
      "kind": "department",
      "parentId": "amazon",
      "status": "Active",
      "displayId": "CO-1001-2"
    },
    {
      "id": "operations",
      "name": "Operations",
      "kind": "department",
      "parentId": "amazon",
      "status": "Active",
      "displayId": "CO-1001-3"
    },
    {
      "id": "support",
      "name": "Support",
      "kind": "department",
      "parentId": "amazon",
      "status": "Not ready",
      "displayId": "CO-1001-4"
    }
  ],
  "wallets": [
    {
      "id": "am-m-tron",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Master",
      "name": "Master · Amazon",
      "network": "TRON · TRC-20",
      "address": "TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "am-m-eth",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Master",
      "name": "Master · Amazon",
      "network": "Ethereum · ERC-20",
      "address": "0x1C4e8B2f6a9D3c71E0b5A4f2C8d9E3a61B7c8d3B",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "am-m-sol",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Master",
      "name": "Master · Amazon",
      "network": "Solana · SPL",
      "address": "7AmaZn4Pq9WzRk2LmXv8sTd3cFhJ5bN1eQsQ3n",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "am-m-btc",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Master",
      "name": "Master · Amazon",
      "network": "Bitcoin",
      "address": "bc1qa7m2x8k4r9t6w3p5s2d7f9g4h8j3k6l2a7m2",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "mk-tron",
      "date": "2026-10-31",
      "organizationId": "marketing",
      "type": "Sub Master",
      "name": "Sub Master · Marketing",
      "network": "TRON · TRC-20",
      "address": "TMk38sWqR4vK2nQ8sL5wY7cH3jF6dB1g8sWq",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "dv-tron",
      "date": "2026-10-31",
      "organizationId": "development",
      "type": "Sub Master",
      "name": "Sub Master · Development",
      "network": "TRON · TRC-20",
      "address": "TDv9pLkR4vK2nQ8sL5wY7cH3jF6dB1gX9pLk",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "op-tron",
      "date": "2026-10-31",
      "organizationId": "operations",
      "type": "Sub Master",
      "name": "Sub Master · Operations",
      "network": "TRON · TRC-20",
      "address": "TOp42nVxR4vK2nQ8sL5wY7cH3jF6dB12nVx",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "am-cold",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Company wallet (cold)",
      "name": "Company wallet (cold) · Amazon",
      "network": "Ethereum · ERC-20",
      "address": "0x9fA2c8B71E0d4a5F3c18E6a4D90b7C2e15f371cE",
      "cold": true,
      "autoSweep": false
    },
    {
      "id": "am-fee",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Fee wallet",
      "name": "Fee wallet · Amazon",
      "network": "TRON · TRC-20",
      "address": "TFeAm1kQhR4vK2nQ8sL5wY7cH3jF6dB2kQh",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "oa-m-tron",
      "date": "2026-10-31",
      "organizationId": "openai",
      "type": "Master",
      "name": "Master · OpenAI",
      "network": "TRON · TRC-20",
      "address": "TOp39kQeR4vK2nQ8sL5wY7cH3jF6dB19kQe",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "oa-m-btc",
      "date": "2026-10-31",
      "organizationId": "openai",
      "type": "Master",
      "name": "Master · OpenAI",
      "network": "Bitcoin",
      "address": "bc1qoa2m2rx8k4r9t6w3p5s2d7f9g4h8j3km2rx",
      "cold": false,
      "autoSweep": false
    },
    {
      "id": "oa-cold",
      "date": "2026-10-31",
      "organizationId": "openai",
      "type": "Company wallet (cold)",
      "name": "Company wallet (cold) · OpenAI",
      "network": "Ethereum · ERC-20",
      "address": "0x77a8f2C4e6B1d9A3c5E7f0B2d4A6c8E0f2B402F1",
      "cold": true,
      "autoSweep": false
    },
    {
      "id": "ho-m-tron",
      "date": "2026-10-31",
      "organizationId": "hooli",
      "type": "Master",
      "name": "Master · Hooli",
      "network": "TRON · TRC-20",
      "address": "TQm84xLdR4vK2nQ8sL5wY7cH3jF6dB14xLd",
      "cold": false,
      "autoSweep": false
    }
  ],
  "walletBalances": [
    {
      "id": "am-m-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-tron",
      "asset": "USDT",
      "amount": 820400,
      "usd": 820400
    },
    {
      "id": "am-m-tron-TRX",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-tron",
      "asset": "TRX",
      "amount": 41200,
      "usd": 4944
    },
    {
      "id": "am-m-eth-USDT",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-eth",
      "asset": "USDT",
      "amount": 412000,
      "usd": 412000
    },
    {
      "id": "am-m-eth-USDC",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-eth",
      "asset": "USDC",
      "amount": 236000,
      "usd": 236000
    },
    {
      "id": "am-m-eth-ETH",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-eth",
      "asset": "ETH",
      "amount": 34.4,
      "usd": 113520
    },
    {
      "id": "am-m-sol-USDC",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-sol",
      "asset": "USDC",
      "amount": 69900,
      "usd": 69900
    },
    {
      "id": "am-m-btc-BTC",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-m-btc",
      "asset": "BTC",
      "amount": 3.25,
      "usd": 224412.5
    },
    {
      "id": "mk-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "marketing",
      "walletId": "mk-tron",
      "asset": "USDT",
      "amount": 228700,
      "usd": 228700
    },
    {
      "id": "dv-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "development",
      "walletId": "dv-tron",
      "asset": "USDT",
      "amount": 388900,
      "usd": 388900
    },
    {
      "id": "op-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "operations",
      "walletId": "op-tron",
      "asset": "USDT",
      "amount": 142556,
      "usd": 142556
    },
    {
      "id": "am-cold-USDT",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-cold",
      "asset": "USDT",
      "amount": 1410250,
      "usd": 1410250
    },
    {
      "id": "am-fee-TRX",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "walletId": "am-fee",
      "asset": "TRX",
      "amount": 12400,
      "usd": 1488
    },
    {
      "id": "oa-m-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "openai",
      "walletId": "oa-m-tron",
      "asset": "USDT",
      "amount": 330000,
      "usd": 330000
    },
    {
      "id": "oa-m-tron-TRX",
      "date": "2026-10-31",
      "organizationId": "openai",
      "walletId": "oa-m-tron",
      "asset": "TRX",
      "amount": 9800,
      "usd": 1176
    },
    {
      "id": "oa-m-btc-BTC",
      "date": "2026-10-31",
      "organizationId": "openai",
      "walletId": "oa-m-btc",
      "asset": "BTC",
      "amount": 1.84,
      "usd": 127052
    },
    {
      "id": "oa-cold-USDT",
      "date": "2026-10-31",
      "organizationId": "openai",
      "walletId": "oa-cold",
      "asset": "USDT",
      "amount": 400000,
      "usd": 400000
    },
    {
      "id": "ho-m-tron-USDT",
      "date": "2026-10-31",
      "organizationId": "hooli",
      "walletId": "ho-m-tron",
      "asset": "USDT",
      "amount": 41800,
      "usd": 41800
    },
    {
      "id": "ho-m-tron-TRX",
      "date": "2026-10-31",
      "organizationId": "hooli",
      "walletId": "ho-m-tron",
      "asset": "TRX",
      "amount": 4120,
      "usd": 494.4
    }
  ],
  "moneyFlowRules": [
    {
      "id": "receive-1",
      "date": "2026-10-31",
      "organizationId": "development",
      "kind": "receive",
      "name": "Dev payouts reserve",
      "source": "Development · Client",
      "target": "Master · Amazon · USDT",
      "status": "active",
      "sharePercent": 20,
      "minimum": "€50",
      "maximum": "€500k",
      "approvedBy": "A. Stone"
    },
    {
      "id": "receive-2",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "receive",
      "name": "Exchange to BTC",
      "source": "Amazon · Client",
      "target": "Exchange · Binance → BTC",
      "status": "active",
      "sharePercent": 10,
      "minimum": "€100",
      "maximum": "—",
      "approvedBy": "J. Park"
    },
    {
      "id": "receive-3",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "receive",
      "name": "Gas top-up",
      "source": "Amazon · Client",
      "target": "Fee wallet · TRX",
      "status": "pending",
      "sharePercent": 2,
      "minimum": "€5",
      "maximum": "1,000 TRX",
      "approvedBy": "—"
    },
    {
      "id": "receive-4",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "receive",
      "name": "Partner share",
      "source": "Amazon · Supplier",
      "target": "Sub Master · Marketing · USDT",
      "status": "rejected",
      "sharePercent": 5,
      "minimum": "€20",
      "maximum": "—",
      "approvedBy": "O. Bakr"
    },
    {
      "id": "receive-5",
      "date": "2026-10-31",
      "organizationId": "marketing",
      "kind": "receive",
      "name": "Marketing budget",
      "source": "Marketing · Client",
      "target": "Master · Marketing · USDT",
      "status": "draft",
      "sharePercent": 15,
      "minimum": "€10",
      "maximum": "—",
      "approvedBy": "—"
    },
    {
      "id": "exchange-1",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "exchange",
      "name": "USDT → USDC → Company wallet (cold)",
      "source": "Binance · USDT",
      "target": "Company wallet (cold) · USDC",
      "status": "active",
      "trigger": "balance ≥ 10,000 USDT",
      "action": "Swap then send",
      "amount": "Full balance"
    },
    {
      "id": "exchange-2",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "exchange",
      "name": "BTC sweep",
      "source": "Binance · BTC",
      "target": "Company wallet (cold) · BTC",
      "status": "active",
      "trigger": "balance ≥ 0.5 BTC",
      "action": "Send without swap",
      "amount": "Keep 0.05 on exchange"
    },
    {
      "id": "exchange-3",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "exchange",
      "name": "ETH → USDT",
      "source": "Binance · ETH",
      "target": "Company wallet (cold) · USDT · TRON",
      "status": "pending",
      "trigger": "balance ≥ 5 ETH",
      "action": "Swap then send",
      "amount": "Fixed 4 ETH"
    }
  ],
  "observations": [
    {
      "date": "2026-09-08",
      "organizationId": "amazon",
      "usd": 1023576,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-08",
      "organizationId": "marketing",
      "usd": 590103,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-08",
      "organizationId": "development",
      "usd": 472469,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-08",
      "organizationId": "operations",
      "usd": 416044,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-08",
      "organizationId": "support",
      "usd": 117809,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-09",
      "organizationId": "amazon",
      "usd": 1022048,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-09",
      "organizationId": "marketing",
      "usd": 585012,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-09",
      "organizationId": "development",
      "usd": 464980,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-09",
      "organizationId": "operations",
      "usd": 410721,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-09",
      "organizationId": "support",
      "usd": 117239,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-10",
      "organizationId": "amazon",
      "usd": 1014547,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-10",
      "organizationId": "marketing",
      "usd": 574900,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-10",
      "organizationId": "development",
      "usd": 456694,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-10",
      "organizationId": "operations",
      "usd": 407395,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-10",
      "organizationId": "support",
      "usd": 116464,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-11",
      "organizationId": "amazon",
      "usd": 995156,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-11",
      "organizationId": "marketing",
      "usd": 559230,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-11",
      "organizationId": "development",
      "usd": 447188,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-11",
      "organizationId": "operations",
      "usd": 403680,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-11",
      "organizationId": "support",
      "usd": 114745,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-12",
      "organizationId": "amazon",
      "usd": 971793,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-12",
      "organizationId": "marketing",
      "usd": 544636,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-12",
      "organizationId": "development",
      "usd": 440200,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-12",
      "organizationId": "operations",
      "usd": 400636,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-12",
      "organizationId": "support",
      "usd": 112735,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-13",
      "organizationId": "amazon",
      "usd": 954178,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-13",
      "organizationId": "marketing",
      "usd": 537087,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-13",
      "organizationId": "development",
      "usd": 438308,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-13",
      "organizationId": "operations",
      "usd": 399191,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-13",
      "organizationId": "support",
      "usd": 111236,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-14",
      "organizationId": "amazon",
      "usd": 956651,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-14",
      "organizationId": "marketing",
      "usd": 543541,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-14",
      "organizationId": "development",
      "usd": 445346,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-14",
      "organizationId": "operations",
      "usd": 402779,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-14",
      "organizationId": "support",
      "usd": 111683,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-15",
      "organizationId": "amazon",
      "usd": 977618,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-15",
      "organizationId": "marketing",
      "usd": 560971,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-15",
      "organizationId": "development",
      "usd": 458029,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-15",
      "organizationId": "operations",
      "usd": 409569,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-15",
      "organizationId": "support",
      "usd": 113813,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-16",
      "organizationId": "amazon",
      "usd": 1010565,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-16",
      "organizationId": "marketing",
      "usd": 583184,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-16",
      "organizationId": "development",
      "usd": 471807,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-16",
      "organizationId": "operations",
      "usd": 417462,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-16",
      "organizationId": "support",
      "usd": 116982,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-17",
      "organizationId": "amazon",
      "usd": 1051080,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-17",
      "organizationId": "marketing",
      "usd": 605894,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-17",
      "organizationId": "development",
      "usd": 484999,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-17",
      "organizationId": "operations",
      "usd": 427067,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-17",
      "organizationId": "support",
      "usd": 120960,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-18",
      "organizationId": "amazon",
      "usd": 1096884,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-18",
      "organizationId": "marketing",
      "usd": 627706,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-18",
      "organizationId": "development",
      "usd": 498864,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-18",
      "organizationId": "operations",
      "usd": 440726,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-18",
      "organizationId": "support",
      "usd": 125820,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-19",
      "organizationId": "amazon",
      "usd": 1140939,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-19",
      "organizationId": "marketing",
      "usd": 646366,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-19",
      "organizationId": "development",
      "usd": 513508,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-19",
      "organizationId": "operations",
      "usd": 458206,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-19",
      "organizationId": "support",
      "usd": 130982,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-20",
      "organizationId": "amazon",
      "usd": 1176759,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-20",
      "organizationId": "marketing",
      "usd": 661188,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-20",
      "organizationId": "development",
      "usd": 528839,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-20",
      "organizationId": "operations",
      "usd": 477511,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-20",
      "organizationId": "support",
      "usd": 135704,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-21",
      "organizationId": "amazon",
      "usd": 1203768,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-21",
      "organizationId": "marketing",
      "usd": 674660,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-21",
      "organizationId": "development",
      "usd": 545437,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-21",
      "organizationId": "operations",
      "usd": 496470,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-21",
      "organizationId": "support",
      "usd": 139666,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-22",
      "organizationId": "amazon",
      "usd": 1223821,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-22",
      "organizationId": "marketing",
      "usd": 688988,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-22",
      "organizationId": "development",
      "usd": 562371,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-22",
      "organizationId": "operations",
      "usd": 512138,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-22",
      "organizationId": "support",
      "usd": 142682,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-23",
      "organizationId": "amazon",
      "usd": 1236518,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-23",
      "organizationId": "marketing",
      "usd": 702731,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-23",
      "organizationId": "development",
      "usd": 575778,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-23",
      "organizationId": "operations",
      "usd": 520620,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-23",
      "organizationId": "support",
      "usd": 144353,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-09-24",
      "organizationId": "amazon",
      "usd": 1244750,
      "inflow": 14877,
      "outflow": 8613
    },
    {
      "date": "2026-09-24",
      "organizationId": "marketing",
      "usd": 714399,
      "inflow": 8463,
      "outflow": 4899
    },
    {
      "date": "2026-09-24",
      "organizationId": "development",
      "usd": 583204,
      "inflow": 6825,
      "outflow": 3951
    },
    {
      "date": "2026-09-24",
      "organizationId": "operations",
      "usd": 521352,
      "inflow": 6114,
      "outflow": 3540
    },
    {
      "date": "2026-09-24",
      "organizationId": "support",
      "usd": 144896,
      "inflow": 1721,
      "outflow": 997
    },
    {
      "date": "2026-09-25",
      "organizationId": "amazon",
      "usd": 1240004,
      "inflow": 20358,
      "outflow": 12137
    },
    {
      "date": "2026-09-25",
      "organizationId": "marketing",
      "usd": 715631,
      "inflow": 11580,
      "outflow": 6904
    },
    {
      "date": "2026-09-25",
      "organizationId": "development",
      "usd": 578809,
      "inflow": 9339,
      "outflow": 5568
    },
    {
      "date": "2026-09-25",
      "organizationId": "operations",
      "usd": 512037,
      "inflow": 8367,
      "outflow": 4988
    },
    {
      "date": "2026-09-25",
      "organizationId": "support",
      "usd": 143519,
      "inflow": 2356,
      "outflow": 1404
    },
    {
      "date": "2026-09-26",
      "organizationId": "amazon",
      "usd": 1227095,
      "inflow": 16052,
      "outflow": 18401
    },
    {
      "date": "2026-09-26",
      "organizationId": "marketing",
      "usd": 707279,
      "inflow": 9131,
      "outflow": 10467
    },
    {
      "date": "2026-09-26",
      "organizationId": "development",
      "usd": 566023,
      "inflow": 7364,
      "outflow": 8441
    },
    {
      "date": "2026-09-26",
      "organizationId": "operations",
      "usd": 498404,
      "inflow": 6597,
      "outflow": 7562
    },
    {
      "date": "2026-09-26",
      "organizationId": "support",
      "usd": 141199,
      "inflow": 1857,
      "outflow": 2129
    },
    {
      "date": "2026-09-27",
      "organizationId": "amazon",
      "usd": 1207128,
      "inflow": 25839,
      "outflow": 10962
    },
    {
      "date": "2026-09-27",
      "organizationId": "marketing",
      "usd": 690637,
      "inflow": 14698,
      "outflow": 6236
    },
    {
      "date": "2026-09-27",
      "organizationId": "development",
      "usd": 548825,
      "inflow": 11854,
      "outflow": 5029
    },
    {
      "date": "2026-09-27",
      "organizationId": "operations",
      "usd": 484949,
      "inflow": 10619,
      "outflow": 4505
    },
    {
      "date": "2026-09-27",
      "organizationId": "support",
      "usd": 138461,
      "inflow": 2990,
      "outflow": 1268
    },
    {
      "date": "2026-09-28",
      "organizationId": "amazon",
      "usd": 1184432,
      "inflow": 28188,
      "outflow": 15660
    },
    {
      "date": "2026-09-28",
      "organizationId": "marketing",
      "usd": 670846,
      "inflow": 16034,
      "outflow": 8908
    },
    {
      "date": "2026-09-28",
      "organizationId": "development",
      "usd": 533001,
      "inflow": 12931,
      "outflow": 7184
    },
    {
      "date": "2026-09-28",
      "organizationId": "operations",
      "usd": 475736,
      "inflow": 11585,
      "outflow": 6436
    },
    {
      "date": "2026-09-28",
      "organizationId": "support",
      "usd": 135984,
      "inflow": 3262,
      "outflow": 1812
    },
    {
      "date": "2026-09-29",
      "organizationId": "amazon",
      "usd": 1160909,
      "inflow": 18792,
      "outflow": 21533
    },
    {
      "date": "2026-09-29",
      "organizationId": "marketing",
      "usd": 652191,
      "inflow": 10690,
      "outflow": 12249
    },
    {
      "date": "2026-09-29",
      "organizationId": "development",
      "usd": 521763,
      "inflow": 8621,
      "outflow": 9878
    },
    {
      "date": "2026-09-29",
      "organizationId": "operations",
      "usd": 471243,
      "inflow": 7723,
      "outflow": 8850
    },
    {
      "date": "2026-09-29",
      "organizationId": "support",
      "usd": 133894,
      "inflow": 2174,
      "outflow": 2492
    },
    {
      "date": "2026-09-30",
      "organizationId": "amazon",
      "usd": 1140678,
      "inflow": 13703,
      "outflow": 7439
    },
    {
      "date": "2026-09-30",
      "organizationId": "marketing",
      "usd": 639318,
      "inflow": 7795,
      "outflow": 4231
    },
    {
      "date": "2026-09-30",
      "organizationId": "development",
      "usd": 517001,
      "inflow": 6286,
      "outflow": 3412
    },
    {
      "date": "2026-09-30",
      "organizationId": "operations",
      "usd": 470639,
      "inflow": 5632,
      "outflow": 3057
    },
    {
      "date": "2026-09-30",
      "organizationId": "support",
      "usd": 132364,
      "inflow": 1586,
      "outflow": 861
    },
    {
      "date": "2026-10-01",
      "organizationId": "amazon",
      "usd": 1121992,
      "inflow": 22707,
      "outflow": 17226
    },
    {
      "date": "2026-10-01",
      "organizationId": "marketing",
      "usd": 631775,
      "inflow": 12917,
      "outflow": 9799
    },
    {
      "date": "2026-10-01",
      "organizationId": "development",
      "usd": 515762,
      "inflow": 10417,
      "outflow": 7902
    },
    {
      "date": "2026-10-01",
      "organizationId": "operations",
      "usd": 469650,
      "inflow": 9332,
      "outflow": 7080
    },
    {
      "date": "2026-10-01",
      "organizationId": "support",
      "usd": 130821,
      "inflow": 2627,
      "outflow": 1993
    },
    {
      "date": "2026-10-02",
      "organizationId": "amazon",
      "usd": 1108088,
      "inflow": 31712,
      "outflow": 15269
    },
    {
      "date": "2026-10-02",
      "organizationId": "marketing",
      "usd": 629901,
      "inflow": 18039,
      "outflow": 8685
    },
    {
      "date": "2026-10-02",
      "organizationId": "development",
      "usd": 516105,
      "inflow": 14548,
      "outflow": 7004
    },
    {
      "date": "2026-10-02",
      "organizationId": "operations",
      "usd": 466550,
      "inflow": 13033,
      "outflow": 6275
    },
    {
      "date": "2026-10-02",
      "organizationId": "support",
      "usd": 129357,
      "inflow": 3669,
      "outflow": 1767
    },
    {
      "date": "2026-10-03",
      "organizationId": "amazon",
      "usd": 1101751,
      "inflow": 25056,
      "outflow": 27405
    },
    {
      "date": "2026-10-03",
      "organizationId": "marketing",
      "usd": 632454,
      "inflow": 14253,
      "outflow": 15589
    },
    {
      "date": "2026-10-03",
      "organizationId": "development",
      "usd": 516220,
      "inflow": 11494,
      "outflow": 12572
    },
    {
      "date": "2026-10-03",
      "organizationId": "operations",
      "usd": 461340,
      "inflow": 10298,
      "outflow": 11263
    },
    {
      "date": "2026-10-03",
      "organizationId": "support",
      "usd": 128236,
      "inflow": 2899,
      "outflow": 3171
    },
    {
      "date": "2026-10-04",
      "organizationId": "amazon",
      "usd": 1100172,
      "inflow": 19184,
      "outflow": 12920
    },
    {
      "date": "2026-10-04",
      "organizationId": "marketing",
      "usd": 634966,
      "inflow": 10912,
      "outflow": 7349
    },
    {
      "date": "2026-10-04",
      "organizationId": "development",
      "usd": 513433,
      "inflow": 8800,
      "outflow": 5927
    },
    {
      "date": "2026-10-04",
      "organizationId": "operations",
      "usd": 454113,
      "inflow": 7884,
      "outflow": 5310
    },
    {
      "date": "2026-10-04",
      "organizationId": "support",
      "usd": 127316,
      "inflow": 2220,
      "outflow": 1495
    },
    {
      "date": "2026-10-05",
      "organizationId": "amazon",
      "usd": 1110023,
      "inflow": 35235,
      "outflow": 20358
    },
    {
      "date": "2026-10-05",
      "organizationId": "marketing",
      "usd": 639726,
      "inflow": 20043,
      "outflow": 11580
    },
    {
      "date": "2026-10-05",
      "organizationId": "development",
      "usd": 511845,
      "inflow": 16164,
      "outflow": 9339
    },
    {
      "date": "2026-10-05",
      "organizationId": "operations",
      "usd": 450693,
      "inflow": 14481,
      "outflow": 8367
    },
    {
      "date": "2026-10-05",
      "organizationId": "support",
      "usd": 127713,
      "inflow": 4077,
      "outflow": 2356
    },
    {
      "date": "2026-10-06",
      "organizationId": "amazon",
      "usd": 1116839,
      "inflow": 30146,
      "outflow": 23882
    },
    {
      "date": "2026-10-06",
      "organizationId": "marketing",
      "usd": 638834,
      "inflow": 17148,
      "outflow": 13585
    },
    {
      "date": "2026-10-06",
      "organizationId": "development",
      "usd": 507612,
      "inflow": 13829,
      "outflow": 10956
    },
    {
      "date": "2026-10-06",
      "organizationId": "operations",
      "usd": 448613,
      "inflow": 12389,
      "outflow": 9815
    },
    {
      "date": "2026-10-06",
      "organizationId": "support",
      "usd": 128101,
      "inflow": 3488,
      "outflow": 2763
    },
    {
      "date": "2026-10-07",
      "organizationId": "amazon",
      "usd": 1121836,
      "inflow": 27014,
      "outflow": 18792
    },
    {
      "date": "2026-10-07",
      "organizationId": "marketing",
      "usd": 635242,
      "inflow": 15366,
      "outflow": 10690
    },
    {
      "date": "2026-10-07",
      "organizationId": "development",
      "usd": 504758,
      "inflow": 12392,
      "outflow": 8621
    },
    {
      "date": "2026-10-07",
      "organizationId": "operations",
      "usd": 450656,
      "inflow": 11102,
      "outflow": 7723
    },
    {
      "date": "2026-10-07",
      "organizationId": "support",
      "usd": 128807,
      "inflow": 3126,
      "outflow": 2174
    },
    {
      "date": "2026-10-01",
      "organizationId": "openai",
      "usd": 460000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-02",
      "organizationId": "openai",
      "usd": 440000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-03",
      "organizationId": "openai",
      "usd": 430000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-04",
      "organizationId": "openai",
      "usd": 410000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-05",
      "organizationId": "openai",
      "usd": 420000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-06",
      "organizationId": "openai",
      "usd": 400000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-07",
      "organizationId": "openai",
      "usd": 400000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-01",
      "organizationId": "hooli",
      "usd": 20000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-02",
      "organizationId": "hooli",
      "usd": 25000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-03",
      "organizationId": "hooli",
      "usd": 30000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-04",
      "organizationId": "hooli",
      "usd": 33000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-05",
      "organizationId": "hooli",
      "usd": 36000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-06",
      "organizationId": "hooli",
      "usd": 40000,
      "inflow": 0,
      "outflow": 0
    },
    {
      "date": "2026-10-07",
      "organizationId": "hooli",
      "usd": 41800,
      "inflow": 0,
      "outflow": 0
    }
  ],
  "assetBalances": [
    {
      "date": "2026-10-07",
      "organizationId": "amazon",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 407769
    },
    {
      "date": "2026-10-07",
      "organizationId": "marketing",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 230900
    },
    {
      "date": "2026-10-07",
      "organizationId": "development",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 183471
    },
    {
      "date": "2026-10-07",
      "organizationId": "operations",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 163806
    },
    {
      "date": "2026-10-07",
      "organizationId": "support",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 46819
    },
    {
      "date": "2026-10-07",
      "organizationId": "openai",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 145394
    },
    {
      "date": "2026-10-07",
      "organizationId": "hooli",
      "asset": "BTC",
      "network": "Bitcoin",
      "usd": 15195
    },
    {
      "date": "2026-10-07",
      "organizationId": "amazon",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 271847
    },
    {
      "date": "2026-10-07",
      "organizationId": "marketing",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 153934
    },
    {
      "date": "2026-10-07",
      "organizationId": "development",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 122314
    },
    {
      "date": "2026-10-07",
      "organizationId": "operations",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 109204
    },
    {
      "date": "2026-10-07",
      "organizationId": "support",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 31213
    },
    {
      "date": "2026-10-07",
      "organizationId": "openai",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 96929
    },
    {
      "date": "2026-10-07",
      "organizationId": "hooli",
      "asset": "ETH",
      "network": "ERC-20",
      "usd": 10129
    },
    {
      "date": "2026-10-07",
      "organizationId": "amazon",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 174759
    },
    {
      "date": "2026-10-07",
      "organizationId": "marketing",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 98957
    },
    {
      "date": "2026-10-07",
      "organizationId": "development",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 78631
    },
    {
      "date": "2026-10-07",
      "organizationId": "operations",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 70203
    },
    {
      "date": "2026-10-07",
      "organizationId": "support",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 20065
    },
    {
      "date": "2026-10-07",
      "organizationId": "openai",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 62312
    },
    {
      "date": "2026-10-07",
      "organizationId": "hooli",
      "asset": "USDT",
      "network": "TRC-20",
      "usd": 6511
    },
    {
      "date": "2026-10-07",
      "organizationId": "amazon",
      "asset": "SOL",
      "network": "SPL",
      "usd": 116505
    },
    {
      "date": "2026-10-07",
      "organizationId": "marketing",
      "asset": "SOL",
      "network": "SPL",
      "usd": 65971
    },
    {
      "date": "2026-10-07",
      "organizationId": "development",
      "asset": "SOL",
      "network": "SPL",
      "usd": 52420
    },
    {
      "date": "2026-10-07",
      "organizationId": "operations",
      "asset": "SOL",
      "network": "SPL",
      "usd": 46802
    },
    {
      "date": "2026-10-07",
      "organizationId": "support",
      "asset": "SOL",
      "network": "SPL",
      "usd": 13377
    },
    {
      "date": "2026-10-07",
      "organizationId": "openai",
      "asset": "SOL",
      "network": "SPL",
      "usd": 41541
    },
    {
      "date": "2026-10-07",
      "organizationId": "hooli",
      "asset": "SOL",
      "network": "SPL",
      "usd": 4342
    }
  ],
  "approvals": [
    {
      "id": "a1",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Payout",
      "title": "Master · Amazon · USDT → TGf2…Lm8q",
      "amountEur": 48200,
      "initiator": "Max Rivera",
      "approvals": 0,
      "requiredApprovals": 2,
      "resolved": false
    },
    {
      "id": "a2",
      "date": "2026-10-31",
      "organizationId": "openai",
      "type": "Payout",
      "title": "Master · OpenAI · BTC → bc1q…m2rx",
      "amountEur": 12400,
      "initiator": "Kramer (you)",
      "approvals": 0,
      "requiredApprovals": 1,
      "resolved": false
    },
    {
      "id": "a3",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Transfer",
      "title": "Company wallet (cold) → Master · Amazon · USDT",
      "amountEur": 150000,
      "initiator": "Julia Park",
      "approvals": 1,
      "requiredApprovals": 2,
      "resolved": false
    },
    {
      "id": "a4",
      "date": "2026-10-31",
      "organizationId": "hooli",
      "type": "Company wallet",
      "title": "Hooli · USDT · TRON · TLk9…Qe3v",
      "initiator": "Omar Bakr",
      "approvals": 0,
      "requiredApprovals": 1,
      "resolved": false
    },
    {
      "id": "a7",
      "date": "2026-10-31",
      "organizationId": "development",
      "type": "Payout",
      "title": "Sub Master · Development · USDT → TXr4…9pLk",
      "amountEur": 8400,
      "initiator": "Max Rivera",
      "approvals": 0,
      "requiredApprovals": 1,
      "resolved": false
    },
    {
      "id": "a5",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "type": "Money flow rule",
      "title": "Amazon · USDT · Client → 2% Fee wallet",
      "initiator": "Max Rivera",
      "approvals": 0,
      "requiredApprovals": 1,
      "resolved": false
    },
    {
      "id": "a6",
      "date": "2026-10-30",
      "organizationId": "amazon",
      "type": "Mass payment",
      "title": "Batch #2041 · 168 recipients · Amazon",
      "amountEur": 412880,
      "initiator": "Kramer (you)",
      "approvals": 0,
      "requiredApprovals": 2,
      "resolved": false
    }
  ],
  "alerts": [
    {
      "id": "n1",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "severity": "critical",
      "title": "Sanctions",
      "detail": "Funds frozen — review required",
      "amount": "$48,200",
      "action": "Review",
      "resolved": false,
      "wallet": "Amazon · DarkMatter Link",
      "check": "Sanctions match · score 0.97 · limit 0.80",
      "frozenUsd": 48200
    },
    {
      "id": "n2",
      "date": "2026-10-31",
      "organizationId": "hooli",
      "severity": "warning",
      "title": "Low gas",
      "detail": "Low gas · top-up waits for approval",
      "amount": "3.2 TRX",
      "action": "Approve top-up",
      "resolved": false,
      "wallet": "Hooli · Fee wallet TRC-20",
      "check": "0 payouts left · alert below 100"
    },
    {
      "id": "n3",
      "date": "2026-10-31",
      "organizationId": "openai",
      "severity": "warning",
      "title": "Low gas",
      "detail": "Low gas · top-up waits for approval",
      "amount": "0.002 BTC",
      "action": "Approve top-up",
      "resolved": false,
      "wallet": "OpenAI · Fee wallet Bitcoin",
      "check": "66 payouts left · alert below 100"
    },
    {
      "id": "n4",
      "date": "2026-10-31",
      "organizationId": "openai",
      "severity": "warning",
      "title": "Low gas",
      "detail": "Low gas · top-up waits for approval",
      "amount": "310 TRX",
      "action": "Approve top-up",
      "resolved": false,
      "wallet": "OpenAI · Fee wallet TRC-20",
      "check": "51 payouts left · alert below 100"
    },
    {
      "id": "n5",
      "date": "2026-10-31",
      "organizationId": "marketing",
      "severity": "warning",
      "title": "AML velocity",
      "detail": "AML flag · high-risk pattern",
      "amount": "$96,410",
      "action": "Review",
      "resolved": false,
      "wallet": "Marketing · TechFund LLC",
      "check": "Velocity $96K / 24h · limit $75K"
    },
    {
      "id": "n6",
      "date": "2026-10-30",
      "organizationId": "operations",
      "severity": "warning",
      "title": "Low balance",
      "detail": "Low balance · top-up suggested",
      "amount": "—",
      "action": "Top up",
      "resolved": false,
      "wallet": "Operations",
      "check": "Balance $142,556 · min $150,000"
    },
    {
      "id": "n7",
      "date": "2026-10-30",
      "organizationId": "development",
      "severity": "ok",
      "title": "Unfreeze",
      "detail": "Unfreeze available",
      "amount": "$12,000",
      "action": "Unfreeze",
      "resolved": false,
      "wallet": "Development · J. Martin",
      "check": "KYC refreshed · cleared",
      "frozenUsd": 12000
    }
  ],
  "transactions": [
    {
      "id": "183796",
      "date": "2026-10-31",
      "time": "14:52",
      "organizationId": "amazon",
      "type": "send",
      "amountLabel": "−8,000.00 USDT",
      "usdValue": 8000,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Master",
      "source": "payout · Mid Send Wallet",
      "status": "processing",
      "address": "TKp3…8wQz"
    },
    {
      "id": "183795",
      "date": "2026-10-31",
      "time": "14:31",
      "organizationId": "marketing",
      "type": "receive",
      "amountLabel": "+25,000.00 USDT",
      "usdValue": 25000,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Sub Master",
      "source": "top up · Mid Master Wallet",
      "status": "completed",
      "address": "TPa7…2nVx"
    },
    {
      "id": "183794",
      "date": "2026-10-31",
      "time": "13:58",
      "organizationId": "hooli",
      "type": "swap",
      "amountLabel": "2,500.00 USDT → USDC",
      "usdValue": 2500,
      "asset": "USDT",
      "network": "Binance",
      "wallet": "Exchange",
      "source": "exchange rule",
      "status": "failed",
      "address": "—"
    },
    {
      "id": "183793",
      "date": "2026-10-31",
      "time": "13:40",
      "organizationId": "marketing",
      "type": "receive",
      "amountLabel": "+47,994.00 USDC",
      "usdValue": 47994,
      "asset": "USDC",
      "network": "Ethereum · ERC-20",
      "wallet": "Company wallet (cold)",
      "source": "via payment link",
      "status": "quarantine",
      "address": "0xC0ff…ee21"
    },
    {
      "id": "183792",
      "date": "2026-10-31",
      "time": "12:17",
      "organizationId": "development",
      "type": "receive",
      "amountLabel": "+9,996.00 USDT",
      "usdValue": 9996,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Client wallet",
      "source": "client in the bot · @john_doe",
      "status": "completed",
      "address": "TJx1…7hQa"
    },
    {
      "id": "183791",
      "date": "2026-10-31",
      "time": "11:46",
      "organizationId": "amazon",
      "type": "send",
      "amountLabel": "−3,200.00 USDC",
      "usdValue": 3200,
      "asset": "USDC",
      "network": "Ethereum · ERC-20",
      "wallet": "Master",
      "source": "payout from Master",
      "status": "pending",
      "address": "0x7a1B…c903"
    },
    {
      "id": "183790",
      "date": "2026-10-31",
      "time": "11:02",
      "organizationId": "amazon",
      "type": "swap",
      "amountLabel": "10,000 USDT → USDC",
      "usdValue": 10000,
      "asset": "USDT",
      "network": "Binance",
      "wallet": "Exchange",
      "source": "exchange rule “USDT → USDC”",
      "status": "completed",
      "address": "—"
    },
    {
      "id": "183789",
      "date": "2026-10-31",
      "time": "10:20",
      "organizationId": "hooli",
      "type": "send",
      "amountLabel": "−955.00 USDT",
      "usdValue": 955,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Master",
      "source": "API · hooli-backend",
      "status": "failed",
      "address": "TJr5…9vWe"
    },
    {
      "id": "183788",
      "date": "2026-10-31",
      "time": "09:48",
      "organizationId": "amazon",
      "type": "receive",
      "amountLabel": "+1,248.00 USDT",
      "usdValue": 1248,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Client wallet",
      "source": "API · ext-77102",
      "status": "completed",
      "address": "TQe8…1mPz"
    },
    {
      "id": "183787",
      "date": "2026-10-31",
      "time": "09:15",
      "organizationId": "openai",
      "type": "send",
      "amountLabel": "−12,400.00 USDT",
      "usdValue": 12400,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Master",
      "source": "mass payment #2040",
      "status": "completed",
      "address": "TGf2…Lm8q"
    },
    {
      "id": "183786",
      "date": "2026-10-31",
      "time": "08:51",
      "organizationId": "marketing",
      "type": "swap",
      "amountLabel": "0.5000 ETH → 1,742 USDT",
      "usdValue": 1742,
      "asset": "ETH",
      "network": "Binance",
      "wallet": "Exchange",
      "source": "client swap in the bot · @alex_trader",
      "status": "completed",
      "address": "0x9fA2…71cE"
    },
    {
      "id": "183785",
      "date": "2026-10-31",
      "time": "08:03",
      "organizationId": "development",
      "type": "send",
      "amountLabel": "−4,200.00 USDT",
      "usdValue": 4200,
      "asset": "USDT",
      "network": "TRON · TRC-20",
      "wallet": "Master",
      "source": "payout from Sub Master · Development",
      "status": "completed",
      "address": "TXr4…9pLk"
    }
  ],
  "obligations": [
    {
      "id": "demo-payroll",
      "date": "2026-10-31",
      "organizationId": "development",
      "kind": "payroll",
      "label": "October payroll · demo commitment",
      "usd": 8400
    },
    {
      "id": "demo-supplier",
      "date": "2026-10-31",
      "organizationId": "marketing",
      "kind": "supplier",
      "label": "October supplier settlement · demo commitment",
      "usd": 75000
    },
    {
      "id": "demo-batch",
      "date": "2026-10-31",
      "organizationId": "amazon",
      "kind": "batch",
      "label": "Batch #2041 · 168 recipients · demo commitment",
      "usd": 445432.18
    }
  ],
  "users": [
    {
      "id": "user-1",
      "date": "2026-01-10",
      "initials": "AS",
      "name": "Alex Stone",
      "email": "alex@starclick.co",
      "roleId": "owner",
      "scopeIds": [
        "all"
      ],
      "limitEur": null,
      "twoFactorEnabled": true,
      "invitationStatus": "active",
      "lastActivity": "Active now"
    },
    {
      "id": "user-2",
      "date": "2026-01-10",
      "initials": "KR",
      "name": "Kramer",
      "email": "kramer@starclick.co",
      "roleId": "owner",
      "scopeIds": [
        "all"
      ],
      "limitEur": null,
      "twoFactorEnabled": true,
      "invitationStatus": "active",
      "lastActivity": "Active 1 min ago"
    },
    {
      "id": "user-3",
      "date": "2026-03-02",
      "initials": "AK",
      "name": "Anna Kovalenko",
      "email": "anna.k@starclick.co",
      "roleId": "finance",
      "scopeIds": [
        "amazon",
        "marketing",
        "development"
      ],
      "limitEur": 25000,
      "twoFactorEnabled": true,
      "invitationStatus": "active",
      "lastActivity": "Active 5 min ago"
    },
    {
      "id": "user-4",
      "date": "2026-06-14",
      "initials": "MR",
      "name": "Max Rivera",
      "email": "max.r@starclick.co",
      "roleId": "finance",
      "scopeIds": [
        "all"
      ],
      "limitEur": 10000,
      "twoFactorEnabled": false,
      "invitationStatus": "active",
      "lastActivity": "Active 2 h ago"
    },
    {
      "id": "user-5",
      "date": "2026-02-20",
      "initials": "JP",
      "name": "Julia Park",
      "email": "julia.p@starclick.co",
      "roleId": "admin",
      "scopeIds": [
        "all"
      ],
      "limitEur": 50000,
      "twoFactorEnabled": true,
      "invitationStatus": "active",
      "lastActivity": "Active today"
    },
    {
      "id": "user-6",
      "date": "2026-04-08",
      "initials": "OB",
      "name": "Omar Bakr",
      "email": "omar.b@starclick.co",
      "roleId": "compliance",
      "scopeIds": [
        "all"
      ],
      "limitEur": null,
      "twoFactorEnabled": true,
      "invitationStatus": "active",
      "lastActivity": "Active yesterday"
    },
    {
      "id": "user-7",
      "date": "2026-07-01",
      "initials": "LS",
      "name": "Lena Smirnova",
      "email": "lena.s@starclick.co",
      "roleId": "finance",
      "scopeIds": [
        "operations"
      ],
      "limitEur": 5000,
      "twoFactorEnabled": false,
      "invitationStatus": "active",
      "lastActivity": "Active yesterday"
    },
    {
      "id": "user-8",
      "date": "2026-08-19",
      "initials": "TW",
      "name": "Tom Walsh",
      "email": "tom.w@starclick.co",
      "roleId": "viewer",
      "scopeIds": [
        "all"
      ],
      "limitEur": null,
      "twoFactorEnabled": false,
      "invitationStatus": "active",
      "lastActivity": "Active 3 days ago"
    },
    {
      "id": "user-9",
      "date": "2026-10-18",
      "initials": "DO",
      "name": "David Okafor",
      "email": "david.o@starclick.co",
      "roleId": "finance",
      "scopeIds": [
        "development"
      ],
      "limitEur": 2000,
      "twoFactorEnabled": false,
      "invitationStatus": "pending",
      "lastActivity": "Invited · pending"
    }
  ],
  "roles": [
    {
      "id": "owner",
      "name": "Owner",
      "description": "Full access incl. settings, roles, fees and fee income (Sweep)",
      "system": true,
      "permissions": [
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
        "Fee income & Sweep"
      ]
    },
    {
      "id": "admin",
      "name": "Admin",
      "description": "Everything except roles and security",
      "system": false,
      "permissions": [
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
        "Retry failed operations"
      ]
    },
    {
      "id": "finance",
      "name": "Finance",
      "description": "Payments, mass payments, swap, payment links",
      "system": false,
      "permissions": [
        "Send payments",
        "Mass payments",
        "View balances",
        "Transfer between wallets",
        "Swap",
        "Create payment links",
        "Resend links",
        "View activity",
        "Export CSV",
        "Retry failed operations"
      ]
    },
    {
      "id": "compliance",
      "name": "Compliance",
      "description": "AML / KYT review, quarantine, read-only activity",
      "system": false,
      "permissions": [
        "View balances",
        "Approve Company wallets",
        "View activity",
        "Export CSV",
        "Approve money flow rules"
      ]
    },
    {
      "id": "viewer",
      "name": "Viewer",
      "description": "Read-only access to balances and activity",
      "system": false,
      "permissions": [
        "View balances",
        "View activity"
      ]
    }
  ]
};
