import type { Random } from "../helpers/random.js";
import type { PersonModule } from "../person/index.js";
import { base64Url, transliterate } from "../helpers/format.js";

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com", "protonmail.com"];
const TLDS = ["com", "net", "org", "io", "dev", "co", "app"];
const DOMAIN_WORDS = ["nova", "pixel", "cloud", "byte", "logic", "spark", "forge", "vertex", "quantum", "orbit"];
const BROWSERS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

export interface PasswordOptions {
  length?: number;
  symbols?: boolean;
  numbers?: boolean;
  uppercase?: boolean;
}

export class InternetModule {
  constructor(
    private random: Random,
    private person: PersonModule,
  ) {}

  /**
   * Transliterates a name to ASCII for use in emails/usernames. Non-Latin
   * locales (ja, ar, bn, hi, zh, ...) strip to an empty string under ASCII-only
   * transliteration, so we fall back to a random alphanumeric token rather than
   * re-transliterating another localized name (which would just as often also
   * come back empty).
   */
  private safeName(name: string): string {
    const transliterated = transliterate(name);
    return transliterated.length > 0 ? transliterated : this.random.alphaNumeric(6, "abcdefghijklmnopqrstuvwxyz");
  }

  username(firstName?: string, lastName?: string): string {
    const first = this.safeName(firstName ?? this.person.firstName());
    const last = this.safeName(lastName ?? this.person.lastName());
    const separator = this.random.arrayElement(["_", ".", ""]);
    const suffix = this.random.boolean(0.4) ? this.random.int(1, 999).toString() : "";
    return `${first}${separator}${last}${suffix}`;
  }

  email(firstName?: string, lastName?: string, domain?: string): string {
    const first = this.safeName(firstName ?? this.person.firstName());
    const last = this.safeName(lastName ?? this.person.lastName());
    const separator = this.random.arrayElement([".", "_", ""]);
    const host = domain ?? this.random.arrayElement(EMAIL_DOMAINS);
    return `${first}${separator}${last}@${host}`;
  }

  password(options: PasswordOptions = {}): string {
    const { length = 12, symbols = true, numbers = true, uppercase = true } = options;
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()-_=+";
    return this.random.alphaNumeric(length, charset);
  }

  domain(): string {
    return `${this.random.arrayElement(DOMAIN_WORDS)}${this.random.int(1, 999)}.${this.random.arrayElement(TLDS)}`;
  }

  url(): string {
    return `https://${this.domain()}`;
  }

  ipv4(): string {
    return `${this.random.int(1, 255)}.${this.random.int(0, 255)}.${this.random.int(0, 255)}.${this.random.int(0, 255)}`;
  }

  ipv6(): string {
    const groups: string[] = [];
    for (let i = 0; i < 8; i++) groups.push(this.random.hex(4));
    return groups.join(":");
  }

  mac(): string {
    const groups: string[] = [];
    for (let i = 0; i < 6; i++) groups.push(this.random.hex(2));
    return groups.join(":");
  }

  userAgent(): string {
    return this.random.arrayElement(BROWSERS);
  }

  apiKey(): string {
    return `sk_${this.random.arrayElement(["live", "test"])}_${this.random.alphaNumeric(32)}`;
  }

  jwtSecret(): string {
    return this.random.hex(64);
  }

  jwt(payload: Record<string, unknown> = { sub: "1234567890", name: "John Doe", iat: 1516239022 }): string {
    const header = { alg: "HS256", typ: "JWT" };
    const headerPart = base64Url(JSON.stringify(header));
    const payloadPart = base64Url(JSON.stringify(payload));
    const signaturePart = this.random.alphaNumeric(
      43,
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    );
    return `${headerPart}.${payloadPart}.${signaturePart}`;
  }
}
