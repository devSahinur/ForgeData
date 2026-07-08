# CLI Reference

```bash
npx --package=@sahinur/forgedata forgedata --help
```

(The package is published as `@sahinur/forgedata`, but its bin command is the shorter `forgedata` — `npx` needs `--package` whenever the command name doesn't match the package name. Once installed — globally or as a project dependency — just run `forgedata ...` directly, as in every example below.)

```
forgedata v0.1.0 — fake data from the command line

Usage:
  forgedata list [--module <name>] [--json]
  forgedata generate <module.method> [--count <n>] [--seed <seed>] [--locale <code>] [--json]
  forgedata --help
  forgedata --version
```

## `forgedata list`

Lists every `<module>.<method>` generator id (100+), discovered by walking the real module classes — never a hand-maintained, driftable list.

```bash
forgedata list                      # every generator
forgedata list --module person      # only the person module
forgedata list --json               # JSON array of ids instead of one per line
```

## `forgedata generate <id>`

```bash
forgedata generate person.fullName
forgedata generate internet.email --count 5
forgedata generate location.country --locale ja
forgedata generate finance.creditCardNumber --seed 42 --json
```

Flags:

| Flag | Description |
|------|--------------|
| `--count <n>` | Generate `n` values (default `1`). Must be a positive integer. |
| `--seed <seed>` | Seed the underlying `ForgeData` instance for reproducible output. |
| `--locale <code>` | Use a built-in locale (`en`, `bn`, `hi`, `ar`, `ja`, `fr`, `de`, `es`, `zh`). |
| `--json` | Print JSON instead of plain lines (a single value when `--count 1`, an array otherwise). |

Non-string results (objects, e.g. `location.airport`) are printed as JSON even without `--json`.

## Exit codes

`0` on success, `1` on any usage error (missing/invalid id, invalid `--count`, unknown module/method, unknown command) — the error message goes to stderr.

## Installing globally

```bash
npm install -g @sahinur/forgedata
forgedata list
```

Or invoke it without installing:

```bash
npx --package=@sahinur/forgedata forgedata generate person.fullName
```

## Scripting example

```bash
# 10 fake emails, one per line, piped into a file
forgedata generate internet.email --count 10 > emails.txt

# Structured JSON for use in another tool
forgedata generate person.fullName --count 3 --json | jq '.[]'
```
