/**
 * Deterministic pseudo-random number generator (mulberry32).
 * Chosen over Math.random() because it accepts an explicit seed, which is
 * required to make `forge.seed(n)` reproduce identical output across runs,
 * processes, and runtimes (Node, Bun, Deno, browsers).
 */
export type PRNG = () => number;

export function mulberry32(seed: number): PRNG {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hashes a string seed into a 32-bit integer (FNV-1a variant). */
export function hashStringToSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

let autoSeedCounter = 0;

export function normalizeSeed(seed: number | string | undefined): number {
  if (seed === undefined) {
    autoSeedCounter = (autoSeedCounter + 0x9e3779b9) >>> 0;
    return (Date.now() ^ autoSeedCounter ^ (Math.random() * 0xffffffff)) >>> 0;
  }
  return typeof seed === "string" ? hashStringToSeed(seed) : seed >>> 0;
}
