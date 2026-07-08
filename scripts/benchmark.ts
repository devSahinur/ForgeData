// Micro-benchmark: npm run bench
// Compares ForgeData against @faker-js/faker when the latter is installed;
// otherwise just reports ForgeData's own throughput.
import { ForgeData } from "../src/index.js";

interface BenchCase {
  name: string;
  forgedata: (f: ForgeData) => unknown;
  faker?: (f: any) => unknown;
}

const CASES: BenchCase[] = [
  { name: "person.fullName", forgedata: (f) => f.person.fullName(), faker: (f) => f.person.fullName() },
  { name: "internet.email", forgedata: (f) => f.internet.email(), faker: (f) => f.internet.email() },
  { name: "location.city", forgedata: (f) => f.location.city(), faker: (f) => f.location.city() },
  { name: "lorem.sentence", forgedata: (f) => f.lorem.sentence(), faker: (f) => f.lorem.sentence() },
  { name: "uuid", forgedata: (f) => f.uuid(), faker: (f) => f.string.uuid() },
];

const ITERATIONS = 200_000;

function run(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const end = performance.now();
  return iterations / ((end - start) / 1000); // ops/sec
}

async function main() {
  const forge = new ForgeData({ seed: 1 });

  let faker: any = null;
  try {
    const mod = await import("@faker-js/faker");
    faker = mod.faker;
  } catch {
    // Not installed — that's fine, benchmark ForgeData only.
  }

  console.log(`Benchmarking ${ITERATIONS.toLocaleString()} iterations per case\n`);
  console.log(
    "case".padEnd(20),
    "forgedata (ops/s)".padEnd(20),
    faker ? "faker (ops/s)".padEnd(20) : "",
    faker ? "speedup" : "",
  );

  for (const testCase of CASES) {
    const ffOps = run(() => testCase.forgedata(forge), ITERATIONS);
    let line = `${testCase.name.padEnd(20)}${Math.round(ffOps).toLocaleString().padEnd(20)}`;

    if (faker && testCase.faker) {
      const fakerOps = run(() => testCase.faker!(faker), ITERATIONS);
      const speedup = ffOps / fakerOps;
      line += `${Math.round(fakerOps).toLocaleString().padEnd(20)}${speedup.toFixed(2)}x`;
    }

    console.log(line);
  }

  if (!faker) {
    console.log(
      "\n(Install @faker-js/faker as a devDependency to see a side-by-side comparison: npm i -D @faker-js/faker)",
    );
  }
}

main();
