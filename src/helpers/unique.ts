export interface UniqueOptions {
  maxRetries?: number;
}

/**
 * Wraps generator functions so repeated calls never return a value already
 * produced by this instance, e.g. `forge.unique.wrap(() => forge.internet.email())`.
 * State is scoped to the UniqueGenerator instance (one lives per ForgeData
 * instance) so resetting/reseeding a forge doesn't leak into other instances.
 */
export class UniqueGenerator {
  private seen = new Map<number, Set<unknown>>();
  private nextKey = 0;

  /**
   * Wraps a generator function so every call of the RETURNED function yields
   * a value distinct from all previous calls of that same returned function.
   * The tracking key is assigned once here, at wrap-time, so it stays stable
   * across every subsequent invocation of the closure this returns.
   */
  wrap<Args extends unknown[], R>(
    fn: (...args: Args) => R,
    options: UniqueOptions = {},
  ): (...args: Args) => R {
    const maxRetries = options.maxRetries ?? 5000;
    const key = this.nextKey++;
    return (...args: Args): R => {
      let bucket = this.seen.get(key);
      if (!bucket) {
        bucket = new Set();
        this.seen.set(key, bucket);
      }
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const value = fn(...args);
        if (!bucket.has(value)) {
          bucket.add(value);
          return value;
        }
      }
      throw new Error(
        `forge.unique: could not find a new unique value after ${maxRetries} attempts.`,
      );
    };
  }

  clear(): void {
    this.seen.clear();
  }
}
