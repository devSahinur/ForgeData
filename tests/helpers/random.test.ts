import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";

describe("Random", () => {
  it("produces identical sequences for the same numeric seed", () => {
    const a = new Random(42);
    const b = new Random(42);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("produces identical sequences for the same string seed", () => {
    const a = new Random("hello-world");
    const b = new Random("hello-world");
    expect(a.int(0, 1000)).toBe(b.int(0, 1000));
  });

  it("produces different sequences for different seeds", () => {
    const a = new Random(1);
    const b = new Random(2);
    expect(a.next()).not.toBe(b.next());
  });

  it("supports construction with no seed at all", () => {
    const r = new Random();
    expect(typeof r.next()).toBe("number");
  });

  it("reseeding resets the stream", () => {
    const r = new Random(7);
    const first = r.int(0, 1000);
    r.seed(7);
    expect(r.int(0, 1000)).toBe(first);
  });

  it("reseeding with no argument still returns a numeric seed", () => {
    const r = new Random(1);
    expect(typeof r.seed()).toBe("number");
  });

  it("getSeed returns the normalized active seed", () => {
    const r = new Random(99);
    expect(r.getSeed()).toBe(99);
  });

  it("int() stays within [min, max] inclusive", () => {
    const r = new Random(1);
    for (let i = 0; i < 500; i++) {
      const value = r.int(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it("int() uses sane defaults when called with no arguments", () => {
    const r = new Random(1);
    expect(Number.isInteger(r.int())).toBe(true);
  });

  it("int() throws when min > max", () => {
    const r = new Random(1);
    expect(() => r.int(10, 5)).toThrow(RangeError);
  });

  it("float() stays within [min, max)", () => {
    const r = new Random(1);
    for (let i = 0; i < 500; i++) {
      const value = r.float(0, 1);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("float() rounds to the requested precision when given", () => {
    const r = new Random(1);
    const value = r.float(0, 100, 2);
    expect(value).toBe(Math.round(value * 100) / 100);
  });

  it("boolean() and probability() return booleans", () => {
    const r = new Random(1);
    expect(typeof r.boolean()).toBe("boolean");
    expect(typeof r.probability(0.5)).toBe("boolean");
  });

  it("boolean() respects extreme probabilities", () => {
    const r = new Random(1);
    for (let i = 0; i < 50; i++) expect(r.boolean(1)).toBe(true);
    for (let i = 0; i < 50; i++) expect(r.boolean(0)).toBe(false);
  });

  it("arrayElement throws on empty array", () => {
    const r = new Random(1);
    expect(() => r.arrayElement([])).toThrow(RangeError);
  });

  it("arrayElement returns a member of the array", () => {
    const r = new Random(1);
    const pool = [1, 2, 3];
    expect(pool).toContain(r.arrayElement(pool));
  });

  it("arrayElements returns a subset without duplicating positions", () => {
    const r = new Random(1);
    const pool = [1, 2, 3, 4, 5];
    const picked = r.arrayElements(pool, 3);
    expect(picked).toHaveLength(3);
    for (const value of picked) expect(pool).toContain(value);
  });

  it("arrayElements defaults to a random subset size when count is omitted", () => {
    const r = new Random(1);
    const picked = r.arrayElements([1, 2, 3, 4, 5]);
    expect(picked.length).toBeGreaterThanOrEqual(1);
    expect(picked.length).toBeLessThanOrEqual(5);
  });

  it("shuffle returns a permutation without mutating the input", () => {
    const r = new Random(1);
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const shuffled = r.shuffle(input);
    expect(input).toEqual(copy);
    expect(shuffled.slice().sort()).toEqual(copy.slice().sort());
  });

  it("weightedArrayElement throws on an empty list", () => {
    const r = new Random(1);
    expect(() => r.weightedArrayElement([])).toThrow(RangeError);
  });

  it("weightedArrayElement can select every entry, including the last", () => {
    const r = new Random(123);
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(
        r.weightedArrayElement([
          { weight: 1, value: "a" },
          { weight: 1, value: "b" },
          { weight: 1, value: "c" },
        ]),
      );
    }
    expect(seen).toEqual(new Set(["a", "b", "c"]));
  });

  it("weightedArrayElement favors higher-weight entries", () => {
    const r = new Random(123);
    const counts = { a: 0, b: 0 };
    for (let i = 0; i < 2000; i++) {
      const value = r.weightedArrayElement([
        { weight: 9, value: "a" as const },
        { weight: 1, value: "b" as const },
      ]);
      counts[value]++;
    }
    expect(counts.a).toBeGreaterThan(counts.b * 3);
  });

  it("weightedArrayElement works with a single entry", () => {
    const r = new Random(1);
    expect(r.weightedArrayElement([{ weight: 1, value: "only" }])).toBe("only");
  });

  it("objectKey/objectValue return a real key/value pair", () => {
    const r = new Random(1);
    const obj = { a: 1, b: 2, c: 3 };
    const key = r.objectKey(obj);
    expect(Object.keys(obj)).toContain(key);
    expect(Object.values(obj)).toContain(r.objectValue(obj));
  });

  it("uuid() returns a valid v4 UUID", () => {
    const r = new Random(1);
    const uuid = r.uuid();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("hex() returns lowercase hex of the requested length", () => {
    const r = new Random(1);
    expect(r.hex(10)).toMatch(/^[0-9a-f]{10}$/);
  });

  it("alphaNumeric() uses the default charset when none is given", () => {
    const r = new Random(1);
    expect(r.alphaNumeric(20)).toMatch(/^[A-Za-z0-9]{20}$/);
  });

  it("alphaNumeric() honors a custom charset", () => {
    const r = new Random(1);
    expect(r.alphaNumeric(20, "ab")).toMatch(/^[ab]{20}$/);
  });

  it("enum() picks only real values for numeric TS enums, not reverse-mapping keys", () => {
    enum Numeric {
      A,
      B,
      C,
    }
    const r = new Random(1);
    for (let i = 0; i < 100; i++) {
      const value = r.enum(Numeric);
      expect([Numeric.A, Numeric.B, Numeric.C]).toContain(value);
      expect(typeof value).toBe("number");
    }
  });

  it("enum() works with string TS enums", () => {
    enum Stringy {
      A = "a",
      B = "b",
      C = "c",
    }
    const r = new Random(1);
    for (let i = 0; i < 100; i++) {
      const value = r.enum(Stringy);
      expect(["a", "b", "c"]).toContain(value);
    }
  });
});
