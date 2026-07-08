import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { FinanceModule } from "../../src/finance/index.js";

function luhnValid(number: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let d = number.charCodeAt(i) - 48;
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

describe("FinanceModule", () => {
  it("currency()/currencyCode() return known shapes", () => {
    const finance = new FinanceModule(new Random(1));
    const currency = finance.currency();
    expect(currency).toHaveProperty("code");
    expect(currency).toHaveProperty("symbol");
    expect(typeof finance.currencyCode()).toBe("string");
  });

  it("amount() respects bounds, custom decimals, and defaults", () => {
    const finance = new FinanceModule(new Random(1));
    expect(Number(finance.amount(10, 20, 3))).toBeGreaterThanOrEqual(10);
    expect(finance.amount(10, 20, 3).split(".")[1]).toHaveLength(3);
    expect(typeof finance.amount()).toBe("string");
  });

  it("creditCardNumber() passes the Luhn check for every explicit scheme and the random default", () => {
    const finance = new FinanceModule(new Random(1));
    for (const scheme of ["visa", "mastercard", "amex", "discover"] as const) {
      const number = finance.creditCardNumber(scheme);
      expect(luhnValid(number)).toBe(true);
      expect(number).toMatch(scheme === "amex" ? /^\d{15}$/ : /^\d{16}$/);
    }
    expect(luhnValid(finance.creditCardNumber())).toBe(true);
  });

  it("creditCardCVV() is three digits", () => {
    const finance = new FinanceModule(new Random(1));
    expect(finance.creditCardCVV()).toMatch(/^\d{3}$/);
  });

  it("iban() uses the default and a custom country code", () => {
    const finance = new FinanceModule(new Random(1));
    expect(finance.iban()).toMatch(/^GB\d{2}[A-Z]{4}\d{14}$/);
    expect(finance.iban("DE")).toMatch(/^DE\d{2}[A-Z]{4}\d{14}$/);
  });

  it("bitcoinAddress() covers both the bc1 and legacy prefix branches", () => {
    const finance = new FinanceModule(new Random(2));
    const addresses = Array.from({ length: 60 }, () => finance.bitcoinAddress());
    expect(addresses.some((a) => a.startsWith("bc1"))).toBe(true);
    expect(addresses.some((a) => a.startsWith("1") || a.startsWith("3"))).toBe(true);
  });

  it("ethereumAddress() matches 0x + 40 hex chars", () => {
    const finance = new FinanceModule(new Random(1));
    expect(finance.ethereumAddress()).toMatch(/^0x[0-9a-f]{40}$/);
  });

  it("cryptoCoin() and stockSymbol() return known shapes", () => {
    const finance = new FinanceModule(new Random(1));
    expect(finance.cryptoCoin()).toHaveProperty("symbol");
    expect(typeof finance.stockSymbol()).toBe("string");
  });
});
