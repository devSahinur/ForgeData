import { describe, expect, it } from "vitest";
import { mulberry32, hashStringToSeed, normalizeSeed } from "../../src/helpers/prng.js";

describe("prng", () => {
  it("mulberry32 produces deterministic sequences for the same seed", () => {
    const a = mulberry32(1);
    const b = mulberry32(1);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("mulberry32 produces values in [0, 1)", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 200; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("hashStringToSeed is deterministic for the same string", () => {
    expect(hashStringToSeed("hello")).toBe(hashStringToSeed("hello"));
  });

  it("hashStringToSeed differs for different strings", () => {
    expect(hashStringToSeed("hello")).not.toBe(hashStringToSeed("world"));
  });

  it("normalizeSeed passes numeric seeds through", () => {
    expect(normalizeSeed(42)).toBe(42);
  });

  it("normalizeSeed hashes string seeds", () => {
    expect(normalizeSeed("abc")).toBe(hashStringToSeed("abc"));
  });

  it("normalizeSeed generates a seed when undefined", () => {
    const a = normalizeSeed(undefined);
    const b = normalizeSeed(undefined);
    expect(typeof a).toBe("number");
    expect(typeof b).toBe("number");
    expect(a).not.toBe(b);
  });
});
