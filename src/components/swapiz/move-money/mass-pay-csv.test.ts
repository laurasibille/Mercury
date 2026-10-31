import { describe, expect, it } from "vitest";
import { parseMassPayCsv, recipientError } from "./mass-pay-csv";

const address = "TQ7mo1hP5P3hZuDsHFB3B3ZPVF9D7D4kPa";
describe("Mass Pay CSV boundary", () => {
  it("handles BOM, CRLF, quotes, and whitespace without losing a recipient", () => {
    const result = parseMassPayCsv(`\uFEFFcompany,currency,network,amount,address\r\n"Amazon",USDT, TRON ,25,${address}\r\n`);
    expect(result.rows).toEqual([{ company: "Amazon", currency: "USDT", network: "TRON · TRC-20", amount: "25", address }]);
    expect(result.error).toBeUndefined();
    expect(recipientError(result.rows[0])).toBeUndefined();
  });
  it.each([
    ["company,currency,amount,address\nAmazon,USDT,25,foo", /headers/i],
    ['company,currency,network,amount,address\n"Amazon,USDT,TRON,25,foo', /quote/i],
    ["company,currency,network,amount,address", /recipient/i],
    ["company,currency,network,amount,address\nAmazon,USDT,TRON,25,foo,extra", /five/i],
  ])("rejects malformed input", (csv, message) => {
    expect(parseMassPayCsv(csv).error).toMatch(message);
    expect(parseMassPayCsv(csv).rows).toEqual([]);
  });
  it("accepts exactly 200 rows and rejects 201", () => {
    const row = `Amazon,USDT,TRON,1,${address}`;
    const header = "company,currency,network,amount,address\n";
    expect(parseMassPayCsv(header + Array(200).fill(row).join("\n")).rows).toHaveLength(200);
    expect(parseMassPayCsv(header + Array(201).fill(row).join("\n")).error).toMatch(/200/);
  });
  it.each(['"2"5', '"2" 5', '"2"x', '"2" "5"'])("rejects content after a closed CSV quote: %s", amount => {
    const result = parseMassPayCsv(`company,currency,network,amount,address\nAmazon,USDT,TRON,${amount},${address}`);
    expect(result.rows).toEqual([]);
    expect(result.error).toMatch(/quote/i);
  });
  it("allows whitespace between a closing quote and a delimiter", () => {
    const result = parseMassPayCsv(`company,currency,network,amount,address\n"Amazon" \t,USDT,TRON,"25" \t,${address}`);
    expect(result.error).toBeUndefined();
    expect(result.rows[0].amount).toBe("25");
    expect(recipientError(result.rows[0])).toBeUndefined();
  });
  it.each(["0x10", "0b10", "0o10", "1e2", "+10"])("marks a non-decimal amount Check: %s", amount => {
    expect(recipientError({ company: "Amazon", currency: "USDT", network: "TRON · TRC-20", amount, address })).toMatch(/decimal/i);
  });
  it.each([
    [{ company: "Missing" }, /company/i], [{ currency: "DOGE" }, /currency/i], [{ currency: "ETH" }, /network/i],
    [{ network: "unknown" }, /network/i], [{ amount: "0" }, /greater than zero/i], [{ address: "bad" }, /address/i],
  ])("excludes invalid recipients", (patch, error) => {
    expect(recipientError({ company: "Amazon", currency: "USDT", network: "TRON · TRC-20", amount: "25", address, ...patch })).toMatch(error);
  });
});
