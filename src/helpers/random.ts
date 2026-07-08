import { mulberry32, normalizeSeed, type PRNG } from "./prng.js";

export interface WeightedEntry<T> {
  weight: number;
  value: T;
}

/**
 * Central randomness source for the whole library. Every generator pulls
 * entropy through a single `Random` instance so that seeding one ForgeData
 * instance makes ALL of its output deterministic, not just a subset.
 */
export class Random {
  private prng: PRNG;
  private currentSeed: number;

  constructor(seed?: number | string) {
    this.currentSeed = normalizeSeed(seed);
    this.prng = mulberry32(this.currentSeed);
  }

  /** Reseeds the generator. Returns the normalized numeric seed that was applied. */
  seed(seed?: number | string): number {
    this.currentSeed = normalizeSeed(seed);
    this.prng = mulberry32(this.currentSeed);
    return this.currentSeed;
  }

  getSeed(): number {
    return this.currentSeed;
  }

  /** Next float in [0, 1). */
  next(): number {
    return this.prng();
  }

  /** Random integer in [min, max], inclusive on both ends. */
  int(min = 0, max = Number.MAX_SAFE_INTEGER): number {
    if (min > max) throw new RangeError(`min (${min}) must be <= max (${max})`);
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Random float in [min, max), optionally rounded to `precision` decimal places. */
  float(min = 0, max = 1, precision?: number): number {
    const value = this.next() * (max - min) + min;
    if (precision === undefined) return value;
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }

  boolean(probability = 0.5): boolean {
    return this.next() < probability;
  }

  /** True with probability `p` (0..1). Alias of boolean() kept for readability at call sites. */
  probability(p: number): boolean {
    return this.boolean(p);
  }

  arrayElement<T>(array: readonly T[]): T {
    if (array.length === 0) throw new RangeError("Cannot pick an element from an empty array");
    return array[this.int(0, array.length - 1)] as T;
  }

  /** Picks `count` distinct-by-position elements (without replacement). Defaults to a random subset size. */
  arrayElements<T>(array: readonly T[], count?: number): T[] {
    const n = count ?? this.int(1, array.length);
    const size = Math.max(0, Math.min(n, array.length));
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, size);
  }

  /** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
  shuffle<T>(array: readonly T[]): T[] {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const tmp = result[i] as T;
      result[i] = result[j] as T;
      result[j] = tmp;
    }
    return result;
  }

  weightedArrayElement<T>(entries: readonly WeightedEntry<T>[]): T {
    if (entries.length === 0) throw new RangeError("Cannot pick from an empty weighted list");
    const total = entries.reduce((sum, e) => sum + e.weight, 0);
    let threshold = this.next() * total;
    for (let i = 0; i < entries.length - 1; i++) {
      threshold -= (entries[i] as WeightedEntry<T>).weight;
      if (threshold <= 0) return (entries[i] as WeightedEntry<T>).value;
    }
    return (entries[entries.length - 1] as WeightedEntry<T>).value;
  }

  objectKey<T extends object>(obj: T): keyof T {
    const keys = Object.keys(obj) as (keyof T)[];
    return this.arrayElement(keys);
  }

  objectValue<T extends object>(obj: T): T[keyof T] {
    return obj[this.objectKey(obj)];
  }

  /** Random enum member value (works with both string and numeric TS enums). */
  enum<T extends Record<string, string | number>>(enumObject: T): T[keyof T] {
    const values = Object.values(enumObject) as (string | number)[];
    const numericValues = values.filter((v) => typeof v === "number");
    // Numeric TS enums carry a reverse mapping (number -> key) alongside the
    // forward one, doubling Object.values(); string enums don't, so this
    // ratio is how we tell which flavor we're dealing with.
    const isReverseMappedNumericEnum = numericValues.length > 0 && numericValues.length * 2 === values.length;
    const pool = isReverseMappedNumericEnum ? numericValues : values;
    return this.arrayElement(pool) as T[keyof T];
  }

  uuid(): string {
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) bytes[i] = this.int(0, 255);
    bytes[6] = ((bytes[6] as number) & 0x0f) | 0x40; // version 4
    bytes[8] = ((bytes[8] as number) & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  hex(length: number): string {
    let out = "";
    for (let i = 0; i < length; i++) out += this.int(0, 15).toString(16);
    return out;
  }

  alphaNumeric(
    length: number,
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  ): string {
    let out = "";
    for (let i = 0; i < length; i++) out += charset[this.int(0, charset.length - 1)];
    return out;
  }
}
