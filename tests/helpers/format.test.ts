import { describe, expect, it } from "vitest";
import {
  slugify,
  capitalize,
  titleCase,
  padNumber,
  transliterate,
  base64Url,
} from "../../src/helpers/format.js";

describe("format helpers", () => {
  it("slugify lowercases, strips diacritics, and dashes non-alnum runs", () => {
    expect(slugify("Héllo World!!")).toBe("hello-world");
    expect(slugify("  --Leading and trailing--  ")).toBe("leading-and-trailing");
  });

  it("capitalize uppercases the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("capitalize returns empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("titleCase capitalizes every word", () => {
    expect(titleCase("the quick brown fox")).toBe("The Quick Brown Fox");
  });

  it("padNumber pads with leading zeros", () => {
    expect(padNumber(7, 3)).toBe("007");
    expect(padNumber(12345, 3)).toBe("12345");
  });

  it("transliterate strips to lowercase ascii", () => {
    expect(transliterate("Café Münster!")).toBe("cafemunster");
  });

  it("transliterate returns empty string for non-Latin scripts", () => {
    expect(transliterate("日本語")).toBe("");
  });

  it("base64Url encodes without padding or unsafe characters", () => {
    const encoded = base64Url("hello world");
    expect(encoded).not.toMatch(/[+/=]/);
    expect(encoded).toBe(Buffer.from("hello world", "utf-8").toString("base64url"));
  });
});
