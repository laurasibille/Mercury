import { addressValid, assets, networkAssets, networks, organizations, positiveAmountError } from "./flow-utils";
import type { Asset } from "@/types/swapiz";

export interface Recipient { company: string; currency: string; network: string; amount: string; address: string }
export function recipientError(row: Recipient): string | undefined {
  if (!organizations.some(item => item.name.toLowerCase() === row.company.toLowerCase())) return "Choose a known company or department.";
  if (!assets.includes(row.currency as Asset)) return "Choose a supported currency.";
  if (!networks.includes(row.network) || !networkAssets(row.network).includes(row.currency as Asset)) return "Currency and network must be compatible.";
  const amountError = positiveAmountError(row.amount);
  if (amountError) return amountError;
  if (!addressValid(row.address, row.network)) return `Enter a valid ${row.network} address.`;
}

export function parseMassPayCsv(text: string): { rows: Recipient[]; error?: string } {
  const invalid = (error: string) => ({ rows: [], error });
  const records: string[][] = [];
  let row: string[] = [], field = "", quoted = false, closedQuote = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (closedQuote && char !== "," && char !== "\n" && char !== "\r") {
      if (/\s/.test(char)) continue;
      return invalid("Check CSV quote formatting: only whitespace may follow a closing quote.");
    }
    if (char === '"') {
      if (quoted && input[index + 1] === '"') { field += '"'; index++; }
      else if (quoted) { quoted = false; closedQuote = true; }
      else if (!field.trim()) quoted = true;
      else return invalid("Check CSV quote formatting.");
    } else if (char === "," && !quoted) { row.push(field.trim()); field = ""; closedQuote = false; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index++;
      row.push(field.trim()); if (row.some(Boolean)) records.push(row); row = []; field = ""; closedQuote = false;
    } else field += char;
  }
  if (quoted) return invalid("Check CSV quote formatting: a quoted field was not closed.");
  row.push(field.trim()); if (row.some(Boolean)) records.push(row);
  const header = records.shift();
  if (header?.map(value => value.toLowerCase()).join(",") !== "company,currency,network,amount,address") return invalid("CSV headers must be company,currency,network,amount,address in that order.");
  if (!records.length) return invalid("Add at least one recipient to the CSV.");
  if (records.length > 200) return invalid("The limit is 200 recipients. Split this file into smaller batches.");
  if (records.some(record => record.length !== 5)) return invalid("Each recipient must have exactly five CSV columns.");
  return { rows: records.map(([company, currency, network, amount, address]) => ({
    company, currency: currency.toUpperCase(), network: networks.find(value => value.toLowerCase() === network.toLowerCase() || value.split(" · ")[0].toLowerCase() === network.toLowerCase()) ?? network, amount, address,
  })) };
}
