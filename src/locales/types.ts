export interface LocaleData {
  /** BCP-47-ish short code, e.g. "en", "bn", "zh". */
  code: string;
  /** Human readable, English name of the locale (for docs/tooling). */
  name: string;
  person: {
    firstNamesMale: string[];
    firstNamesFemale: string[];
    lastNames: string[];
    jobTitles: string[];
    professions: string[];
  };
  location: {
    cities: string[];
    states: string[];
    countries: string[];
  };
  company: {
    suffixes: string[];
    catchPhraseAdjectives: string[];
    catchPhraseNouns: string[];
  };
  lorem: {
    words: string[];
  };
}

/** Fields a consumer must supply to register a custom locale via `forge.defineLocale()`. */
export type CustomLocaleData = LocaleData;
