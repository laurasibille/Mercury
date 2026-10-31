import { describe, expect, it } from "vitest";
import { positiveAmountError } from "./flow-utils";

describe("movement amount validation", () => {
  it.each(["0x10", "0b10", "0o10", "1e2", "+10", "1.", "Infinity", "NaN", ""])("rejects non-decimal syntax %s", amount => {
    expect(positiveAmountError(amount)).toBeDefined();
  });
  it.each(["25", "25.50", ".5", "0.000001", "025.00"])("accepts a positive decimal %s", amount => {
    expect(positiveAmountError(amount)).toBeUndefined();
  });
  it("still rejects zero, negative values and amounts over the wallet balance", () => {
    expect(positiveAmountError("0")).toBeDefined();
    expect(positiveAmountError("-5")).toBeDefined();
    expect(positiveAmountError("25.01", 25)).toMatch(/balance/);
  });
});
