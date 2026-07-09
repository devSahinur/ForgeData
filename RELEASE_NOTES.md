# v0.1.0 — Initial Release

Ready-to-paste description for the GitHub Release / npm publish announcement.
Future releases are generated automatically by semantic-release from
Conventional Commits — this file only covers the initial, manually-published
version.

---

**ForgeData** is a modern, modular, tree-shakable, zero-runtime-dependency
fake data generator for TypeScript and JavaScript — a production-ready
alternative to Faker.js with React integration and a CLI built in.

## Highlights

- **111+ generators** across 16 modules (`person`, `internet`, `company`,
  `finance`, `location`, `commerce`, `phone`, `date`, `image`, `lorem`,
  `color`, `vehicle`, `animal`, `science`, `ai`, `misc`) — discoverable at
  runtime via `forge.listGenerators()`.
- **Zero runtime dependencies.** Only web-standard APIs, so it runs unmodified
  on Node.js 18+, Bun, Deno, and in browsers.
- **ESM + CommonJS**, full TypeScript declarations, tree-shakable exports.
- **Deterministic seeding** (`new ForgeData({ seed })`) for reproducible tests
  and snapshots.
- **9 built-in locales** (`en`, `bn`, `hi`, `ar`, `ja`, `fr`, `de`, `es`, `zh`)
  plus a custom locale API.
- **Custom generators** (`forge.define()`) and a **unique-value generator**
  (`forge.unique.email()`, etc.).
- **React integration** at `@sahinur/forgedata/react`: `ForgeDataProvider`,
  `useForgeData()`, `useGenerator()`. `react` is an optional peer dependency —
  the main entry point never imports it.
- **CLI** (`forgedata`): `forgedata generate person.fullName --seed 42`,
  `forgedata list --module internet --json`, and more.
- **100% test coverage** (statements/branches/functions/lines), enforced in CI.

## Install

```bash
npm install @sahinur/forgedata
```

Published under the `@sahinur` scope because npm's anti-typosquatting policy
blocks the unscoped `forgedata` name (too similar to the popular `form-data`
package). The CLI command is still just `forgedata`.

## Quick start

```ts
import { ForgeData } from "@sahinur/forgedata";

const forge = new ForgeData({ seed: 42 });
forge.person.fullName();
forge.internet.email();
```

See [README.md](./README.md) and the [documentation site](https://devsahinur.github.io/ForgeData/docs.html)
for the full guide, API reference, React guide, CLI reference, and migration notes from Faker.js.

## Links

- npm: https://www.npmjs.com/package/@sahinur/forgedata
- Docs: https://devsahinur.github.io/ForgeData/docs.html
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
