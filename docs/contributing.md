# Contributing

Thanks for considering a contribution to ForgeData!

## Setup

```bash
git clone <your-fork-url>
cd ForgeData
npm install
npm run build
npm run test:coverage
```

CI enforces 100% statement/branch/function/line coverage (excluding the two-line `src/cli.ts` shebang shim — see `vitest.config.ts`). Write tests alongside any change; a PR that drops coverage below 100% will fail CI.

## Adding a generator to an existing module

1. Add the method to the module class in `src/<module>/index.ts`.
2. Keep it dependency-free and pull randomness only through the `Random` instance passed into the constructor — never `Math.random()` directly, or seeding breaks.
3. Add a focused unit test in `tests/modules/<module>.test.ts` (format/shape assertions, not exact-value assertions, since output depends on the shared seed). Cover every branch — if the method has an `if`/ternary/`??`, write a test that exercises both sides.
4. Update `docs/api-reference.md` and the table in `README.md`.
5. It'll automatically show up in `forge.listGenerators()` and the CLI — no registry to update.

## Adding a new module

1. Create `src/<module>/index.ts` exporting a class that takes `(random: Random, ...)` in its constructor.
2. Wire it into `src/ForgeData.ts` (constructor property, instantiation, and the `this.modules` map) and re-export it from `src/index.ts`.
3. Add tests and docs as above.

## Adding a locale

1. Create `src/locales/<code>.ts` implementing the `LocaleData` interface from `src/locales/types.ts`.
2. Register it in `src/locales/index.ts` (`builtInLocales`).
3. Aim for real, correct data — no placeholder/lorem-ipsum text standing in for names or places. Note: person names in the existing locales are romanized (Latin-script) by design, for pronounceability and to keep `internet.email()`/`username()` producing sensible ASCII local-parts.

## Working on the CLI

Core argument parsing/dispatch logic lives in `src/cli-core.ts` (fully unit tested — see `tests/cli.test.ts`). `src/cli.ts` is only the `process.argv`/shebang shim and is excluded from coverage; keep it that thin.

## Working on the React integration

`src/react/index.tsx` is a separate tsup entry (`forgedata/react`) with `react` as an external peer dependency — never import it from `src/index.ts`. Test with `@testing-library/react` + jsdom (`// @vitest-environment jsdom` at the top of the test file).

## Code style

- No comments explaining *what* code does — only *why*, when the reason isn't obvious from the code itself.
- No added dependencies without discussion — this project targets zero runtime dependencies.
- Run `npm run lint`, `npm run typecheck`, and `npm run test:coverage` before opening a PR.

## Commit messages

This project uses [semantic-release](https://semantic-release.gitbook.io/), which derives the next version and `CHANGELOG.md` entry from your commit messages — so they need to follow [Conventional Commits](https://www.conventionalcommits.org/):

- `fix: ...` → patch release
- `feat: ...` → minor release
- `feat!: ...` or a `BREAKING CHANGE:` footer → major release
- `chore:`, `docs:`, `test:`, `refactor:`, `perf:` → no release on their own

## Releasing

Releases are handled by [semantic-release](https://semantic-release.gitbook.io/), configured in `.releaserc.json`:

1. On every push to `main`, `.github/workflows/release.yml` runs the full preflight (lint, typecheck, 100%-coverage tests, build) and then `semantic-release`.
2. semantic-release inspects commits since the last release, decides the next version from Conventional Commits, updates `CHANGELOG.md`, creates a git tag and GitHub Release, and publishes to npm — but only once the `NPM_TOKEN` repo secret is configured (`GITHUB_TOKEN` is provided automatically by Actions).
3. Until `NPM_TOKEN` is set, the workflow runs everything except the actual publish step and simply fails there — nothing gets published by accident.
4. To preview what the next release would contain without touching npm or GitHub, run `npm run release:dry-run` locally.
5. Publishing can also always be done manually — see `scripts/publish.sh` and the root `RELEASE_NOTES.md`.
