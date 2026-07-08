// Reports raw and gzipped size of every built bundle. Run via `npm run size`.
import { readFileSync, statSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const files = ["index.js", "index.cjs", "react/index.js", "react/index.cjs", "cli.js"];

console.log("Bundle size report\n");
for (const file of files) {
  const fullPath = path.join(distDir, file);
  if (!existsSync(fullPath)) {
    console.log(`${file.padEnd(20)} not found — run "npm run build" first`);
    continue;
  }
  const raw = readFileSync(fullPath);
  const gzipped = gzipSync(raw);
  const rawKb = (statSync(fullPath).size / 1024).toFixed(2);
  const gzipKb = (gzipped.length / 1024).toFixed(2);
  console.log(`${file.padEnd(20)} raw: ${rawKb.padStart(8)} KB   gzip: ${gzipKb.padStart(8)} KB`);
}
