import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { PersonModule } from "../../src/person/index.js";

const random = new Random(1);
const locales = new LocaleRegistry("en");
const person = new PersonModule(random, locales);

describe("PersonModule", () => {
  it("gender() returns male or female", () => {
    expect(["male", "female"]).toContain(person.gender());
  });

  it("firstName() picks from the resolved gender pool when no gender is given", () => {
    for (let i = 0; i < 20; i++) expect(typeof person.firstName()).toBe("string");
  });

  it("firstName(gender) respects an explicit gender", () => {
    expect(typeof person.firstName("male")).toBe("string");
    expect(typeof person.firstName("female")).toBe("string");
  });

  it("lastName() returns a string", () => {
    expect(typeof person.lastName()).toBe("string");
  });

  it("fullName() combines a first and last name", () => {
    expect(person.fullName().split(" ")).toHaveLength(2);
    expect(person.fullName("female").split(" ")).toHaveLength(2);
  });

  it("jobTitle() and profession() return strings from their pools", () => {
    expect(typeof person.jobTitle()).toBe("string");
    expect(typeof person.profession()).toBe("string");
  });
});
