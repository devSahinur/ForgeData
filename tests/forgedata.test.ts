import { describe, expect, it } from "vitest";
import { ForgeData } from "../src/ForgeData.js";

describe("ForgeData", () => {
  it("is deterministic end-to-end when seeded", () => {
    const a = new ForgeData({ seed: 1234 });
    const b = new ForgeData({ seed: 1234 });

    expect(a.person.fullName()).toBe(b.person.fullName());
    expect(a.internet.email()).toBe(b.internet.email());
    expect(a.finance.creditCardNumber()).toBe(b.finance.creditCardNumber());
    expect(a.location.country()).toBe(b.location.country());
    expect(a.uuid()).toBe(b.uuid());
  });

  it("accepts a string seed", () => {
    const a = new ForgeData({ seed: "my-test" });
    const b = new ForgeData({ seed: "my-test" });
    expect(a.person.fullName()).toBe(b.person.fullName());
  });

  it("produces different output for different seeds", () => {
    const a = new ForgeData({ seed: 1 });
    const b = new ForgeData({ seed: 2 });
    const namesA = Array.from({ length: 5 }, () => a.person.fullName());
    const namesB = Array.from({ length: 5 }, () => b.person.fullName());
    expect(namesA).not.toEqual(namesB);
  });

  it("reseeding mid-stream resets subsequent output", () => {
    const forge = new ForgeData({ seed: 99 });
    const first = forge.person.fullName();
    forge.seed(99);
    expect(forge.person.fullName()).toBe(first);
  });

  it("switches locales and changes name pools accordingly", () => {
    const forge = new ForgeData({ seed: 5, locale: "ja" });
    expect(forge.locale()).toBe("ja");
    const jaNames = new Set(Array.from({ length: 20 }, () => forge.person.firstName("male")));
    forge.locale("en");
    const enNames = new Set(Array.from({ length: 20 }, () => forge.person.firstName("male")));
    const overlap = [...jaNames].filter((n) => enNames.has(n));
    expect(overlap).toHaveLength(0);
  });

  it("supports registering a custom locale", () => {
    const forge = new ForgeData({ seed: 1 });
    forge.defineLocale({
      code: "xx",
      name: "Test Locale",
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
    forge.locale("xx");
    expect(forge.person.firstName("male")).toBe("Zeeb");
    expect(forge.location.city()).toBe("Zed City");
  });

  it("throws when switching to an unregistered locale", () => {
    const forge = new ForgeData();
    expect(() => forge.locale("unknown-locale")).toThrow();
  });

  it("supports custom generators via define()/custom", () => {
    const forge = new ForgeData({ seed: 1 });
    forge.define("pokemon", (f) => f.pick(["Pikachu", "Bulbasaur", "Charmander"]));
    const value = forge.custom.pokemon();
    expect(["Pikachu", "Bulbasaur", "Charmander"]).toContain(value);
  });

  it("throws a helpful error for an undefined custom generator", () => {
    const forge = new ForgeData();
    expect(() => forge.custom.doesNotExist()).toThrow(/No custom generator/);
  });

  it("unique.email()/username()/uuid() never repeat", () => {
    const forge = new ForgeData({ seed: 1 });
    const emails = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const email = forge.unique.email();
      expect(emails.has(email)).toBe(false);
      emails.add(email);
    }
    const usernames = new Set<string>();
    for (let i = 0; i < 30; i++) usernames.add(forge.unique.username());
    expect(usernames.size).toBe(30);
    const uuids = new Set<string>();
    for (let i = 0; i < 30; i++) uuids.add(forge.unique.uuid());
    expect(uuids.size).toBe(30);
  });

  it("unique.wrap()/clear() work for arbitrary generators", () => {
    const forge = new ForgeData({ seed: 1 });
    const uniqueCity = forge.unique.wrap(() => forge.location.city());
    const seen = new Set<string>();
    for (let i = 0; i < 5; i++) seen.add(uniqueCity());
    expect(seen.size).toBe(5);
    forge.unique.clear();
  });

  it("weighted() respects relative weights over many draws", () => {
    const forge = new ForgeData({ seed: 1 });
    const counts = { common: 0, rare: 0 };
    for (let i = 0; i < 1000; i++) {
      const value = forge.weighted([
        { weight: 95, value: "common" as const },
        { weight: 5, value: "rare" as const },
      ]);
      counts[value]++;
    }
    expect(counts.common).toBeGreaterThan(counts.rare * 5);
  });

  it("shuffle()/pick()/pickMultiple()/probability() delegate to Random", () => {
    const forge = new ForgeData({ seed: 1 });
    expect(forge.shuffle([1, 2, 3]).sort()).toEqual([1, 2, 3]);
    expect([1, 2, 3]).toContain(forge.pick([1, 2, 3]));
    expect(forge.pickMultiple([1, 2, 3, 4], 2)).toHaveLength(2);
    expect(typeof forge.probability(0.5)).toBe("boolean");
  });

  it("randomEnum() works with a TS enum", () => {
    enum Suit {
      Hearts,
      Spades,
      Clubs,
      Diamonds,
    }
    const forge = new ForgeData({ seed: 1 });
    for (let i = 0; i < 20; i++) {
      expect(Object.values(Suit)).toContain(forge.randomEnum(Suit));
    }
  });

  it("randomArray() builds arrays of the requested (or a random) length", () => {
    const forge = new ForgeData({ seed: 1 });
    const arr = forge.randomArray(() => forge.uuid(), 7);
    expect(arr).toHaveLength(7);
    const randomLength = forge.randomArray(() => 1);
    expect(randomLength.length).toBeGreaterThanOrEqual(1);
    expect(randomLength.length).toBeLessThanOrEqual(10);
  });

  it("randomObjectKey()/randomObjectValue() pick a real entry", () => {
    const forge = new ForgeData({ seed: 1 });
    const obj = { a: 1, b: 2 };
    expect(Object.keys(obj)).toContain(forge.randomObjectKey(obj));
    expect(Object.values(obj)).toContain(forge.randomObjectValue(obj));
  });

  it("listGenerators() surfaces 100+ built-in generators across every module", () => {
    const forge = new ForgeData();
    const descriptors = forge.listGenerators();
    expect(descriptors.length).toBeGreaterThanOrEqual(100);
    const moduleNames = new Set(descriptors.map((d) => d.module));
    for (const name of [
      "person", "internet", "company", "finance", "location", "commerce",
      "phone", "date", "image", "lorem", "color", "vehicle", "animal",
      "science", "ai", "misc",
    ]) {
      expect(moduleNames).toContain(name);
    }
    expect(descriptors[0]?.id).toBe(`${descriptors[0]?.module}.${descriptors[0]?.method}`);
  });

  it("invoke() dynamically calls a <module>.<method>()", () => {
    const forge = new ForgeData({ seed: 1 });
    expect(typeof forge.invoke("person", "fullName")).toBe("string");
  });

  it("invoke() throws for an unknown module", () => {
    const forge = new ForgeData();
    expect(() => forge.invoke("nope", "fullName")).toThrow(/Unknown module/);
  });

  it("invoke() throws for an unknown method on a known module", () => {
    const forge = new ForgeData();
    expect(() => forge.invoke("person", "nope")).toThrow(/Unknown generator/);
  });
});
