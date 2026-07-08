import { describe, expect, it } from "vitest";
import { LocaleRegistry, builtInLocales } from "../../src/locales/index.js";

describe("LocaleRegistry", () => {
  it("defaults to English", () => {
    const registry = new LocaleRegistry();
    expect(registry.currentCode()).toBe("en");
    expect(registry.current().code).toBe("en");
  });

  it("throws when constructed with an unknown locale", () => {
    expect(() => new LocaleRegistry("does-not-exist")).toThrow(/Unknown locale/);
  });

  it("can start with any built-in locale", () => {
    const registry = new LocaleRegistry("ja");
    expect(registry.currentCode()).toBe("ja");
  });

  it("switches locales with use()", () => {
    const registry = new LocaleRegistry("en");
    registry.use("de");
    expect(registry.currentCode()).toBe("de");
    expect(registry.current().code).toBe("de");
  });

  it("throws when switching to an unregistered locale", () => {
    const registry = new LocaleRegistry("en");
    expect(() => registry.use("does-not-exist")).toThrow(/Unknown locale/);
  });

  it("supports registering a custom locale", () => {
    const registry = new LocaleRegistry("en");
    registry.define({
      code: "xx",
      name: "Test",
      person: {
        firstNamesMale: ["Zeeb"],
        firstNamesFemale: ["Zora"],
        lastNames: ["Zed"],
        jobTitles: ["Tester"],
        professions: ["Tester"],
      },
      location: { cities: ["Zed City"], states: ["Zed State"], countries: ["Zedland"] },
      company: { suffixes: ["Zorp"], catchPhraseAdjectives: ["Zesty"], catchPhraseNouns: ["zing"] },
      lorem: { words: ["zeta"] },
    });
    registry.use("xx");
    expect(registry.current().person.firstNamesMale).toEqual(["Zeeb"]);
  });

  it("available() lists every built-in locale code", () => {
    const registry = new LocaleRegistry("en");
    const available = registry.available();
    for (const code of Object.keys(builtInLocales)) {
      expect(available).toContain(code);
    }
  });
});
