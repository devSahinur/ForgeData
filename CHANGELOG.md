# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

From this point forward, entries in this file are generated automatically by
[semantic-release](https://semantic-release.gitbook.io/) from
[Conventional Commits](https://www.conventionalcommits.org/) on `main` — see
`.releaserc.json` and the docs site's [Contributing](https://devsahinur.github.io/ForgeData/docs.html#contributing)
section. New entries are prepended above this line by CI; do not hand-edit past releases.

## [0.2.0] - 2026-07-09

### Added

- Zod v4 schema-based generation at the `@sahinur/forgedata/zod` subpath:
  `fromZodSchema(forge, schema)` generates a fake value matching any Zod
  schema, fully typed via `z.infer<T>`. Covers primitives (format-aware
  strings, number min/max/int), `object`/`array`/`tuple`/`record`/`map`/`set`,
  `enum`/native enum, `literal`, `union`/discriminated union,
  `optional`/`nullable`/`default`/`catch`, and recursive schemas via
  `z.lazy()` (depth-capped). `.transform()`/`.pipe()` are run through the
  schema's real `safeParse()` so output reflects the actual post-transform
  shape. `zod` is an optional peer dependency (`^4.0.0`); the main entry
  point never imports it, exactly like the React integration.

## [0.1.1] - 2026-07-09

### Fixed

- `bin` path and `typesVersions` formatting cleaned up per `npm pkg fix`.
- Bumped `@typescript-eslint` to v8 to clear a TypeScript-version support
  warning under TS 5.9+.

## [0.1.0] - 2026-07-09

Initial release. Published as the scoped package `@sahinur/forgedata` — the
unscoped `forgedata` name is blocked by npm's anti-typosquatting policy
(flagged as too similar to the popular `form-data` package). The CLI command
itself is still the short `forgedata` regardless of package scope.

### Added

- Core `ForgeData` class with a shared, seedable PRNG (`mulberry32`) so seeding
  one instance makes all of its output deterministic.
- 16 generator modules, 111+ generators total: `person`, `internet`, `company`,
  `finance`, `location`, `commerce`, `phone`, `date`, `image`, `lorem`, `color`,
  `vehicle`, `animal`, `science`, `ai`, `misc`.
- 9 built-in locales (`en`, `bn`, `hi`, `ar`, `ja`, `fr`, `de`, `es`, `zh`) and a
  custom locale API (`forge.defineLocale()`).
- Custom generator API (`forge.define()` / `forge.custom.<name>()`).
- Unique-value generator (`forge.unique.email()/username()/uuid()/wrap()/clear()`).
- Randomness helpers: `shuffle`, `pick`, `pickMultiple`, `randomEnum`,
  `weighted`, `probability`, `randomArray`, `randomObjectKey/Value`.
- Generator introspection: `forge.listGenerators()` / `forge.invoke()`, built
  by walking the real module classes rather than a hand-maintained registry.
- React integration at the `@sahinur/forgedata/react` subpath: `ForgeDataProvider`,
  `useForgeData()`, `useGenerator()`. `react` is an optional peer dependency.
- CLI (`forgedata` bin): `list` and `generate` commands with
  `--seed`/`--locale`/`--count`/`--json` flags.
- ESM + CommonJS builds with full TypeScript declarations for the main entry,
  `@sahinur/forgedata/react`, and the CLI.
- 100% statement/branch/function/line test coverage (enforced in CI).
- Zero runtime dependencies; only web-standard APIs (`btoa`, etc.) so the
  package runs unmodified on Node.js 18+, Bun, Deno, and in browsers.

[0.2.0]: https://github.com/devSahinur/ForgeData/releases/tag/v0.2.0
[0.1.1]: https://github.com/devSahinur/ForgeData/releases/tag/v0.1.1
[0.1.0]: https://github.com/devSahinur/ForgeData/releases/tag/v0.1.0
