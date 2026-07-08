import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { PersonModule } from "../../src/person/index.js";
import { InternetModule } from "../../src/internet/index.js";

function makeInternet(locale = "en", seed: number | string = 1) {
  const random = new Random(seed);
  const locales = new LocaleRegistry(locale);
  const person = new PersonModule(random, locales);
  return new InternetModule(random, person);
}

describe("InternetModule", () => {
  it("email() looks like an email address for a Latin-script locale", () => {
    const internet = makeInternet("en");
    for (let i = 0; i < 20; i++) {
      expect(internet.email()).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  it("email() still produces a valid local-part for non-Latin-script locales", () => {
    for (const locale of ["ja", "ar", "bn", "hi", "zh"]) {
      const internet = makeInternet(locale, 2);
      for (let i = 0; i < 5; i++) {
        expect(internet.email()).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    }
  });

  it("email()/username() fall back to a random token when an explicit name has no ASCII transliteration", () => {
    const internet = makeInternet("en", 9);
    expect(internet.email("田中", "太郎")).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(internet.username("田中", "太郎").length).toBeGreaterThan(0);
  });

  it("email() accepts explicit first/last name and domain overrides", () => {
    const internet = makeInternet("en");
    expect(internet.email("Ada", "Lovelace", "example.org")).toMatch(/^ada.*lovelace.*@example\.org$/);
  });

  it("username() produces a non-empty string, with and without an explicit numeric suffix", () => {
    const internet = makeInternet("en", 3);
    const usernames = Array.from({ length: 60 }, () => internet.username());
    for (const name of usernames) expect(name.length).toBeGreaterThan(0);
    expect(usernames.some((n) => /\d/.test(n))).toBe(true);
    expect(usernames.some((n) => !/\d/.test(n))).toBe(true);
  });

  it("username() still produces a valid handle for non-Latin-script locales", () => {
    const internet = makeInternet("ja", 4);
    for (let i = 0; i < 10; i++) {
      expect(internet.username().length).toBeGreaterThan(0);
    }
  });

  it("username() accepts explicit names", () => {
    const internet = makeInternet("en");
    expect(internet.username("Ada", "Lovelace").length).toBeGreaterThan(0);
  });

  it("password() respects length and each toggle", () => {
    const internet = makeInternet("en");
    expect(internet.password({ length: 20 })).toHaveLength(20);
    expect(internet.password()).toHaveLength(12);
    expect(internet.password({ uppercase: false, numbers: false, symbols: false })).toMatch(/^[a-z]+$/);
    expect(internet.password({ uppercase: true, numbers: false, symbols: false })).toMatch(/^[A-Za-z]+$/);
  });

  it("domain() and url() are well-formed", () => {
    const internet = makeInternet("en");
    expect(internet.domain()).toMatch(/^[a-z]+\d+\.[a-z]+$/);
    expect(internet.url()).toMatch(/^https:\/\//);
  });

  it("ipv4() is well-formed", () => {
    const internet = makeInternet("en");
    const parts = internet.ipv4().split(".").map(Number);
    expect(parts).toHaveLength(4);
    for (const p of parts) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(255);
    }
  });

  it("ipv6() is well-formed", () => {
    const internet = makeInternet("en");
    expect(internet.ipv6().split(":")).toHaveLength(8);
  });

  it("mac() is well-formed", () => {
    const internet = makeInternet("en");
    expect(internet.mac()).toMatch(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/);
  });

  it("userAgent() returns a non-empty string", () => {
    const internet = makeInternet("en");
    expect(internet.userAgent().length).toBeGreaterThan(0);
  });

  it("apiKey() and jwtSecret() are well-formed", () => {
    const internet = makeInternet("en");
    expect(internet.apiKey()).toMatch(/^sk_(live|test)_[A-Za-z0-9]{32}$/);
    expect(internet.jwtSecret()).toMatch(/^[0-9a-f]{64}$/);
  });

  it("jwt() has three dot-separated segments, with defaults and a custom payload", () => {
    const internet = makeInternet("en");
    expect(internet.jwt().split(".")).toHaveLength(3);
    expect(internet.jwt({ sub: "1" }).split(".")).toHaveLength(3);
  });
});
