import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        // Thin process-argv shim: the actual argument parsing/dispatch logic it
        // calls into (parseArgs, runCli) is fully unit tested; this file only
        // wires process.argv/exit, which isn't meaningfully testable in-process.
        "src/cli.ts",
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
