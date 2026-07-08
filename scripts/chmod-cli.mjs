// Ensures the built CLI entry is executable on POSIX systems (no-op on Windows).
import { chmodSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, "..", "dist", "cli.js");

if (existsSync(cliPath) && process.platform !== "win32") {
  chmodSync(cliPath, 0o755);
}
