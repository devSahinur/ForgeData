# v0.2.0 — Zod Schema Generation

Ready-to-paste description for the GitHub Release / npm publish announcement.
Reflects the current release; see [CHANGELOG.md](./CHANGELOG.md) for the full
version-by-version history.

---

**ForgeData** is a modern, modular, tree-shakable, zero-runtime-dependency
fake data generator for TypeScript and JavaScript — a production-ready
alternative to Faker.js with schema-based generation, React integration, and
a CLI built in.

## What's new in 0.2.0

- **Zod schema generation** at the `@sahinur/forgedata/zod` subpath:
  ```ts
  import { z } from "zod";
  import { fromZodSchema } from "@sahinur/forgedata/zod";

  const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number().int().min(18).max(99),
  });

  const user = fromZodSchema(forge, UserSchema); // fully typed as z.infer<typeof UserSchema>
  ```
  Covers primitives (format-aware strings, number min/max/int),
  object/array/tuple/record/map/set, enum/native enum, literal,
  union/discriminated union, optional/nullable/default/catch, and recursive
  schemas via `z.lazy()`. `zod` is an optional peer dependency — the main
  entry point never imports it, exactly like the React integration.

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
- **Zod schema generation** at `@sahinur/forgedata/zod`: `fromZodSchema()`.
- **React integration** at `@sahinur/forgedata/react`: `ForgeDataProvider`,
  `useForgeData()`, `useGenerator()`.
- **CLI** (`forgedata`): `forgedata generate person.fullName --seed 42`,
  `forgedata list --module internet --json`, and more.
- **100% test coverage** (statements/branches/functions/lines), enforced in CI.
- **Live demo site** at https://devsahinur.github.io/ForgeData/ — an
  interactive playground that runs the real published package in-browser.

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
for the full guide, API reference, Zod guide, React guide, CLI reference, and
migration notes from Faker.js.

## Links

- npm: https://www.npmjs.com/package/@sahinur/forgedata
- Website: https://devsahinur.github.io/ForgeData/
- Docs: https://devsahinur.github.io/ForgeData/docs.html
- Changelog: [CHANGELOG.md](./CHANGELOG.md)
