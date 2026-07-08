import type { Random } from "../helpers/random.js";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

const CARD_PREFIXES: Record<"visa" | "mastercard" | "amex" | "discover", string> = {
  visa: "4",
  mastercard: "5",
  amex: "3",
  discover: "6011",
};

const CRYPTO_COINS = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "Solana", symbol: "SOL" },
  { name: "Cardano", symbol: "ADA" },
  { name: "Polkadot", symbol: "DOT" },
  { name: "Litecoin", symbol: "LTC" },
  { name: "Dogecoin", symbol: "DOGE" },
  { name: "Chainlink", symbol: "LINK" },
];

const STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "AMD", "INTC"];

/** Appends a valid Luhn check digit to a numeric string. */
function withLuhnCheckDigit(digits: string): string {
  let sum = 0;
  let shouldDouble = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return digits + checkDigit.toString();
}

export class FinanceModule {
  constructor(private random: Random) {}

  currency(): Currency {
    return this.random.arrayElement(CURRENCIES);
  }

  currencyCode(): string {
    return this.currency().code;
  }

  amount(min = 0, max = 10000, decimals = 2): string {
    return this.random.float(min, max, decimals).toFixed(decimals);
  }

  creditCardNumber(scheme?: keyof typeof CARD_PREFIXES): string {
    const cardScheme =
      scheme ??
      (this.random.arrayElement(["visa", "mastercard", "amex", "discover"]) as keyof typeof CARD_PREFIXES);
    const prefix = CARD_PREFIXES[cardScheme];
    const totalLength = cardScheme === "amex" ? 15 : 16;
    let digits = prefix;
    while (digits.length < totalLength - 1) digits += this.random.int(0, 9).toString();
    return withLuhnCheckDigit(digits);
  }

  creditCardCVV(): string {
    return this.random.alphaNumeric(3, "0123456789");
  }

  iban(countryCode = "GB"): string {
    const checkDigits = this.random.int(10, 99);
    const bankCode = this.random.alphaNumeric(4, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const accountNumber = this.random.alphaNumeric(14, "0123456789");
    return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
  }

  bitcoinAddress(): string {
    const prefix = this.random.arrayElement(["1", "3", "bc1"]);
    const charset = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return prefix + this.random.alphaNumeric(prefix === "bc1" ? 38 : 33, charset);
  }

  ethereumAddress(): string {
    return `0x${this.random.hex(40)}`;
  }

  cryptoCoin(): { name: string; symbol: string } {
    return this.random.arrayElement(CRYPTO_COINS);
  }

  stockSymbol(): string {
    return this.random.arrayElement(STOCK_SYMBOLS);
  }
}
