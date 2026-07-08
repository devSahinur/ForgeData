import { describe, expect, it } from "vitest";
import { parseArgs, runCli, CLI_VERSION, HELP_TEXT, type CliIO } from "../src/cli-core.js";

function makeIO(): CliIO & { logs: string[]; errors: string[] } {
  const logs: string[] = [];
  const errors: string[] = [];
  return {
    logs,
    errors,
    log: (line: string) => logs.push(line),
    error: (line: string) => errors.push(line),
  };
}

describe("parseArgs", () => {
  it("parses --flag=value", () => {
    expect(parseArgs(["--seed=42"]).flags.seed).toBe("42");
  });

  it("parses --flag value as a value pair", () => {
    expect(parseArgs(["--seed", "42"]).flags.seed).toBe("42");
  });

  it("treats a trailing --flag with no following value as boolean true", () => {
    expect(parseArgs(["--json"]).flags.json).toBe(true);
  });

  it("treats --flag followed by another flag as boolean true", () => {
    const parsed = parseArgs(["--json", "--seed", "1"]);
    expect(parsed.flags.json).toBe(true);
    expect(parsed.flags.seed).toBe("1");
  });

  it("parses short flags as booleans", () => {
    expect(parseArgs(["-h"]).flags.h).toBe(true);
  });

  it("captures the first bare token as the command and the rest as positionals", () => {
    const parsed = parseArgs(["generate", "person.fullName", "extra"]);
    expect(parsed.command).toBe("generate");
    expect(parsed.positionals).toEqual(["person.fullName", "extra"]);
  });
});

describe("runCli", () => {
  it("prints the version for --version, -v, or the version command", () => {
    for (const argv of [["--version"], ["-v"], ["version"]]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(0);
      expect(io.logs).toEqual([CLI_VERSION]);
    }
  });

  it("prints help for --help, -h, the help command, or no arguments", () => {
    for (const argv of [["--help"], ["-h"], ["help"], []]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(0);
      expect(io.logs).toEqual([HELP_TEXT]);
    }
  });

  it("list prints every generator id, one per line", () => {
    const io = makeIO();
    expect(runCli(["list"], io)).toBe(0);
    expect(io.logs.length).toBeGreaterThanOrEqual(100);
    expect(io.logs).toContain("person.fullName");
  });

  it("list --module filters to a single module", () => {
    const io = makeIO();
    runCli(["list", "--module", "person"], io);
    expect(io.logs.every((line) => line.startsWith("person."))).toBe(true);
  });

  it("list --module with an unknown module returns an empty list, not an error", () => {
    const io = makeIO();
    const code = runCli(["list", "--module", "does-not-exist"], io);
    expect(code).toBe(0);
    expect(io.logs).toEqual([]);
  });

  it("list --json prints a JSON array", () => {
    const io = makeIO();
    runCli(["list", "--json", "--module", "animal"], io);
    const parsed = JSON.parse(io.logs[0] as string);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toContain("animal.type");
  });

  it("generate requires an id", () => {
    const io = makeIO();
    expect(runCli(["generate"], io)).toBe(1);
    expect(io.errors[0]).toMatch(/requires an id/);
  });

  it("generate rejects an id with no module.method dot", () => {
    const io = makeIO();
    expect(runCli(["generate", "fullName"], io)).toBe(1);
    expect(io.errors[0]).toMatch(/invalid generator id/);
  });

  it("generate rejects an id with an empty module or method segment", () => {
    for (const id of [".fullName", "person."]) {
      const io = makeIO();
      expect(runCli(["generate", id], io)).toBe(1);
      expect(io.errors[0]).toMatch(/invalid generator id/);
    }
  });

  it("generate produces one string result by default", () => {
    const io = makeIO();
    expect(runCli(["generate", "person.fullName", "--seed", "1"], io)).toBe(0);
    expect(io.logs).toHaveLength(1);
    expect(typeof io.logs[0]).toBe("string");
  });

  it("generate stringifies non-string results", () => {
    const io = makeIO();
    runCli(["generate", "location.airport", "--seed", "1"], io);
    expect(() => JSON.parse(io.logs[0] as string)).not.toThrow();
  });

  it("generate --count repeats the generator N times", () => {
    const io = makeIO();
    runCli(["generate", "person.fullName", "--count", "3", "--seed", "1"], io);
    expect(io.logs).toHaveLength(3);
  });

  it("generate --count rejects non-numeric, zero, negative, and valueless counts", () => {
    for (const argv of [
      ["generate", "person.fullName", "--count", "abc"],
      ["generate", "person.fullName", "--count", "0"],
      ["generate", "person.fullName", "--count", "-1"],
      ["generate", "person.fullName", "--count"],
    ]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(1);
      expect(io.errors[0]).toMatch(/--count must be a positive integer/);
    }
  });

  it("generate --json with count 1 prints a single JSON value, not an array", () => {
    const io = makeIO();
    runCli(["generate", "person.fullName", "--json", "--seed", "1"], io);
    expect(Array.isArray(JSON.parse(io.logs[0] as string))).toBe(false);
  });

  it("generate --json with count > 1 prints a JSON array", () => {
    const io = makeIO();
    runCli(["generate", "person.fullName", "--count", "2", "--json", "--seed", "1"], io);
    expect(Array.isArray(JSON.parse(io.logs[0] as string))).toBe(true);
  });

  it("generate respects --seed and --locale for deterministic, localized output", () => {
    const ioA = makeIO();
    const ioB = makeIO();
    runCli(["generate", "person.fullName", "--seed", "77", "--locale", "de"], ioA);
    runCli(["generate", "person.fullName", "--seed", "77", "--locale", "de"], ioB);
    expect(ioA.logs).toEqual(ioB.logs);
  });

  it("generate surfaces invoke() errors (e.g. an unknown module) through the catch block", () => {
    const io = makeIO();
    expect(runCli(["generate", "nope.foo"], io)).toBe(1);
    expect(io.errors[0]).toMatch(/Unknown module/);
  });

  it("rejects unknown commands", () => {
    const io = makeIO();
    expect(runCli(["frobnicate"], io)).toBe(1);
    expect(io.errors[0]).toMatch(/unknown command/);
  });

  it("uses console.log/console.error by default when no io is supplied", () => {
    expect(runCli(["--version"])).toBe(0);
    expect(runCli(["frobnicate"])).toBe(1);
  });
});
