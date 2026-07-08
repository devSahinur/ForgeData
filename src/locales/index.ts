import type { LocaleData } from "./types.js";
import { en } from "./en.js";
import { bn } from "./bn.js";
import { hi } from "./hi.js";
import { ar } from "./ar.js";
import { ja } from "./ja.js";
import { fr } from "./fr.js";
import { de } from "./de.js";
import { es } from "./es.js";
import { zh } from "./zh.js";

export type { LocaleData, CustomLocaleData } from "./types.js";
export { en, bn, hi, ar, ja, fr, de, es, zh };

export const builtInLocales: Record<string, LocaleData> = {
  en, bn, hi, ar, ja, fr, de, es, zh,
};

export type BuiltInLocaleCode = keyof typeof builtInLocales;

/**
 * Registry of every locale (built-in + user-defined via `forge.defineLocale`)
 * available to a given ForgeData instance.
 */
export class LocaleRegistry {
  private locales = new Map<string, LocaleData>(Object.entries(builtInLocales));
  private activeCode: string;

  constructor(initial: string = "en") {
    if (!this.locales.has(initial)) {
      throw new Error(`Unknown locale "${initial}". Register it first with locales.define().`);
    }
    this.activeCode = initial;
  }

  /** Registers (or overrides) a locale so it can be selected with `use()`. */
  define(locale: LocaleData): void {
    this.locales.set(locale.code, locale);
  }

  use(code: string): void {
    if (!this.locales.has(code)) {
      throw new Error(
        `Unknown locale "${code}". Available: ${Array.from(this.locales.keys()).join(", ")}. ` +
          `Register custom locales with forge.defineLocale(...) first.`,
      );
    }
    this.activeCode = code;
  }

  current(): LocaleData {
    return this.locales.get(this.activeCode) as LocaleData;
  }

  currentCode(): string {
    return this.activeCode;
  }

  available(): string[] {
    return Array.from(this.locales.keys());
  }
}
