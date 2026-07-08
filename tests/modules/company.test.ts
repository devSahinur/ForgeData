import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { PersonModule } from "../../src/person/index.js";
import { CompanyModule } from "../../src/company/index.js";

describe("CompanyModule", () => {
  it("name() covers both the '<surname> <suffix>' and '<surname> & <surname>' branches", () => {
    const random = new Random(5);
    const locales = new LocaleRegistry("en");
    const person = new PersonModule(random, locales);
    const company = new CompanyModule(random, locales, person);

    const names = Array.from({ length: 60 }, () => company.name());
    expect(names.some((n) => n.includes("&"))).toBe(true);
    expect(names.some((n) => !n.includes("&"))).toBe(true);
  });

  it("catchPhrase() returns a non-empty string", () => {
    const random = new Random(1);
    const locales = new LocaleRegistry("en");
    const person = new PersonModule(random, locales);
    const company = new CompanyModule(random, locales, person);
    expect(company.catchPhrase().length).toBeGreaterThan(0);
  });

  it("logo() accepts a seed and defaults to a random one", () => {
    const random = new Random(1);
    const locales = new LocaleRegistry("en");
    const person = new PersonModule(random, locales);
    const company = new CompanyModule(random, locales, person);
    expect(company.logo("fixed-seed")).toContain("seed=fixed-seed");
    expect(company.logo()).toMatch(/seed=/);
  });
});
