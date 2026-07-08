import { describe, expect, it } from "vitest";
import { UniqueGenerator } from "../../src/helpers/unique.js";

describe("UniqueGenerator", () => {
  it("never returns the same value twice from the wrapped function", () => {
    const unique = new UniqueGenerator();
    let counter = 0;
    const pool = [1, 2, 3, 4, 5];
    const next = unique.wrap(() => pool[counter++ % pool.length] as number);

    const seen = new Set<number>();
    for (let i = 0; i < pool.length; i++) {
      const value = next();
      expect(seen.has(value)).toBe(false);
      seen.add(value);
    }
  });

  it("throws once the pool is exhausted", () => {
    const unique = new UniqueGenerator();
    let counter = 0;
    const next = unique.wrap(() => counter++ % 2, { maxRetries: 10 });
    next();
    next();
    expect(() => next()).toThrow(/could not find a new unique value/);
  });

  it("keeps independent state per wrapped function", () => {
    const unique = new UniqueGenerator();
    let a = 0;
    let b = 0;
    const nextA = unique.wrap(() => a++);
    const nextB = unique.wrap(() => b++);
    expect(nextA()).toBe(0);
    expect(nextB()).toBe(0);
  });

  it("passes arguments through to the wrapped function", () => {
    const unique = new UniqueGenerator();
    const next = unique.wrap((n: number) => n * 2);
    expect(next(3)).toBe(6);
  });

  it("clear() forgets previously seen values", () => {
    const unique = new UniqueGenerator();
    let counter = 0;
    const next = unique.wrap(() => counter++ % 1, { maxRetries: 5 });
    expect(next()).toBe(0);
    unique.clear();
    expect(next()).toBe(0);
  });
});
