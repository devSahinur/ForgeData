import { ForgeData } from "./ForgeData.js";

// Kept as a plain constant rather than read from package.json at runtime:
// JSON import assertions are still inconsistent across Node/Bun/Deno/bundlers,
// and this is purely cosmetic output for `--version`. Bump it alongside the
// version field in package.json on release.
export const CLI_VERSION = "0.2.0";

export interface ParsedArgs {
  command?: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

/** Minimal, dependency-free argv parser: supports `--flag value`, `--flag=value`, `--flag` (boolean), and `-x` short boolean flags. */
export function parseArgs(argv: readonly string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};
  let command: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] as string;

    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      if (eqIndex !== -1) {
        flags[arg.slice(2, eqIndex)] = arg.slice(eqIndex + 1);
        continue;
      }
      const name = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        flags[name] = next;
        i++;
      } else {
        flags[name] = true;
      }
      continue;
    }

    if (arg.startsWith("-") && arg.length > 1) {
      flags[arg.slice(1)] = true;
      continue;
    }

    if (command === undefined) {
      command = arg;
    } else {
      positionals.push(arg);
    }
  }

  return { command, positionals, flags };
}

export const HELP_TEXT = `forgedata v${CLI_VERSION} — fake data from the command line

Usage:
  forgedata list [--module <name>] [--json]
  forgedata generate <module.method> [--count <n>] [--seed <seed>] [--locale <code>] [--json]
  forgedata --help
  forgedata --version

Examples:
  forgedata list --module person
  forgedata generate person.fullName
  forgedata generate internet.email --count 5 --seed 42
  forgedata generate location.country --locale ja --json
`;

export interface CliIO {
  log: (line: string) => void;
  error: (line: string) => void;
}

const defaultIO: CliIO = {
  log: (line) => console.log(line),
  error: (line) => console.error(line),
};

function flagString(value: string | boolean | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Parses, dispatches, and executes a CLI invocation. Returns a process exit code. */
export function runCli(argv: readonly string[], io: CliIO = defaultIO): number {
  const parsed = parseArgs(argv);

  const wantsVersion = parsed.flags.version === true || parsed.flags.v === true || parsed.command === "version";
  if (wantsVersion) {
    io.log(CLI_VERSION);
    return 0;
  }

  const wantsHelp =
    parsed.flags.help === true || parsed.flags.h === true || parsed.command === "help" || parsed.command === undefined;
  if (wantsHelp) {
    io.log(HELP_TEXT);
    return 0;
  }

  const forge = new ForgeData({
    seed: flagString(parsed.flags.seed),
    locale: flagString(parsed.flags.locale),
  });

  try {
    if (parsed.command === "list") {
      const moduleFilter = flagString(parsed.flags.module);
      const generators = forge
        .listGenerators()
        .filter((g) => moduleFilter === undefined || g.module === moduleFilter);
      if (parsed.flags.json) {
        io.log(JSON.stringify(generators.map((g) => g.id), null, 2));
      } else {
        for (const g of generators) io.log(g.id);
      }
      return 0;
    }

    if (parsed.command === "generate") {
      const id = parsed.positionals[0];
      if (!id) {
        io.error('Error: "generate" requires an id, e.g. forgedata generate person.fullName');
        return 1;
      }

      const dotIndex = id.indexOf(".");
      const moduleName = dotIndex === -1 ? "" : id.slice(0, dotIndex);
      const methodName = dotIndex === -1 ? "" : id.slice(dotIndex + 1);
      if (!moduleName || !methodName) {
        io.error(`Error: invalid generator id "${id}". Expected "<module>.<method>", e.g. "person.fullName".`);
        return 1;
      }

      let count = 1;
      if ("count" in parsed.flags) {
        const raw = parsed.flags.count;
        const parsedCount = typeof raw === "string" ? Number(raw) : NaN;
        if (!Number.isInteger(parsedCount) || parsedCount < 1) {
          io.error(`Error: --count must be a positive integer, got "${String(raw)}".`);
          return 1;
        }
        count = parsedCount;
      }

      const results = Array.from({ length: count }, () => forge.invoke(moduleName, methodName));
      if (parsed.flags.json) {
        io.log(JSON.stringify(count === 1 ? results[0] : results, null, 2));
      } else {
        for (const result of results) {
          io.log(typeof result === "string" ? result : JSON.stringify(result));
        }
      }
      return 0;
    }

    io.error(`Error: unknown command "${parsed.command}". Run "forgedata --help" for usage.`);
    return 1;
  } catch (error) {
    // Every throw reachable from here (ForgeData.invoke, Random) is a real
    // Error/RangeError, so there's no non-Error case to branch on.
    io.error(`Error: ${(error as Error).message}`);
    return 1;
  }
}
