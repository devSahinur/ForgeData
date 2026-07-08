# ForgeData

A modern, modular, tree-shakable, zero-runtime-dependency fake data generator for TypeScript and JavaScript. A production-ready alternative to Faker.js — with React integration and a CLI built in.

- **100+ generators** across 16 modules (`forge.listGenerators()` to see every one)
- **Zero runtime dependencies**
- **ESM + CommonJS**, one package
- **Works in Node.js, Bun, Deno, and browsers** — no runtime-specific APIs, only web-standard globals (`btoa`, `crypto`-free PRNG)
- **100% typed**, every generator has a precise return type
- **Tree-shakable** — import only the modules/functions you use
- **Seedable** — deterministic output for tests and snapshots
- **9 built-in locales**, plus a custom locale API
- **Custom generators** via `forge.define(...)`
- **React integration** (`@sahinur/forgedata/react`): a provider + two hooks
- **CLI** (`forgedata`): generate fake data from your terminal or scripts
- **100% test coverage** (statements/branches/functions/lines)

## Install

```bash
npm install @sahinur/forgedata
```

## Quick start

```ts
import { ForgeData } from "@sahinur/forgedata";

const forge = new ForgeData();

forge.person.fullName();          // "Ava Thompson"
forge.internet.email();           // "ava.thompson@example.com"
forge.location.country();         // "Canada"
forge.finance.creditCardNumber(); // "4539123456781234"
forge.phone.number();             // "+1-555-123-4567"
forge.ai.prompt();                // "Explain quantum computing to a beginner..."
```

Or use the ready-made default instance for quick scripts:

```ts
import { forge } from "@sahinur/forgedata";

console.log(forge.person.fullName());
```

## Deterministic output (seeding)

```ts
const forge = new ForgeData({ seed: 42 });
forge.person.fullName(); // always the same value for seed 42

forge.seed(42);          // reseed an existing instance
```

Seeds accept a `number` or a `string` (strings are hashed into a seed), so you can seed with something readable like a test name.

## Locales

```ts
const forge = new ForgeData({ locale: "ja" });
forge.person.fullName(); // Japanese name pool

forge.locale("fr");      // switch at runtime
forge.locale();          // "fr" — read the current locale
```

Built-in locales: `en`, `bn` (Bangla), `hi` (Hindi), `ar` (Arabic), `ja` (Japanese), `fr` (French), `de` (German), `es` (Spanish), `zh` (Chinese).

### Custom locales

```ts
forge.defineLocale({
  code: "pirate",
  name: "Pirate",
  person: {
    firstNamesMale: ["Blackbeard", "Redbeard"],
    firstNamesFemale: ["Anne", "Mary"],
    lastNames: ["Silver", "Flint"],
    jobTitles: ["First Mate"],
    professions: ["Sailor"],
  },
  location: { cities: ["Tortuga"], states: ["Caribbean"], countries: ["Never Land"] },
  company: { suffixes: ["& Co"], catchPhraseAdjectives: ["Salty"], catchPhraseNouns: ["treasure"] },
  lorem: { words: ["arr", "matey", "doubloon"] },
});

forge.locale("pirate");
```

## Custom generators

```ts
forge.define("pokemon", (f) => f.pick(["Pikachu", "Bulbasaur", "Charmander"]));

forge.custom.pokemon(); // "Pikachu"
```

## Unique values

```ts
forge.unique.email();    // never repeats for this ForgeData instance
forge.unique.username();
forge.unique.uuid();

const uniqueCity = forge.unique.wrap(() => forge.location.city());
uniqueCity();

forge.unique.clear(); // forget everything generated so far
```

## Helpers & randomness utilities

```ts
forge.uuid();
forge.shuffle([1, 2, 3]);
forge.pick(["a", "b", "c"]);
forge.pickMultiple(["a", "b", "c", "d"], 2);
forge.randomEnum(MyEnum);
forge.probability(0.3);
forge.weighted([
  { weight: 9, value: "common" },
  { weight: 1, value: "rare" },
]);
forge.randomArray(() => forge.person.fullName(), 5);
```

## Introspection: `listGenerators()` / `invoke()`

Every module is walked via prototype introspection rather than a hand-maintained registry, so this never drifts from the real API:

```ts
forge.listGenerators();
// [{ module: "person", method: "fullName", id: "person.fullName" }, ...]  (100+ entries)

forge.invoke("person", "fullName"); // same as forge.person.fullName()
```

This is what the CLI is built on.

## React integration

```tsx
import { ForgeDataProvider, useForgeData, useGenerator } from "@sahinur/forgedata/react";

function App() {
  return (
    <ForgeDataProvider seed={42} locale="en">
      <UserCard />
    </ForgeDataProvider>
  );
}

function UserCard() {
  // Regenerated only when `deps` changes — stable across re-renders otherwise.
  const user = useGenerator(
    (forge) => ({ name: forge.person.fullName(), email: forge.internet.email() }),
    [],
  );
  return <div>{user.name} — {user.email}</div>;
}
```

`useForgeData()` works even without a `ForgeDataProvider` (it falls back to a shared default instance) — wrap your tree in a provider whenever you need a specific seed/locale or per-instance isolation. `react` is an optional peer dependency; the main `@sahinur/forgedata` entry point never imports it.

## CLI

```bash
npx --package=@sahinur/forgedata forgedata list                     # every generator id
npx --package=@sahinur/forgedata forgedata list --module person     # filtered to one module
npx --package=@sahinur/forgedata forgedata generate person.fullName # one value
npx --package=@sahinur/forgedata forgedata generate internet.email --count 5 --seed 42
npx --package=@sahinur/forgedata forgedata generate location.country --locale ja --json
```

Install it globally (`npm install -g @sahinur/forgedata`) to just run `forgedata ...` directly; see [docs/cli.md](./docs/cli.md) for the full flag reference.

## Modules

| Module      | Examples |
|-------------|----------|
| `person`    | `firstName()`, `lastName()`, `fullName()`, `gender()`, `jobTitle()`, `profession()` |
| `internet`  | `email()`, `username()`, `password()`, `url()`, `domain()`, `ipv4()`, `ipv6()`, `mac()`, `userAgent()`, `jwt()`, `apiKey()`, `jwtSecret()` |
| `company`   | `name()`, `catchPhrase()`, `logo()` |
| `finance`   | `currency()`, `amount()`, `creditCardNumber()`, `creditCardCVV()`, `iban()`, `bitcoinAddress()`, `ethereumAddress()`, `cryptoCoin()`, `stockSymbol()` |
| `location`  | `country()`, `state()`, `city()`, `zipCode()`, `latitude()`, `longitude()`, `timezone()`, `airport()` |
| `commerce`  | `productName()`, `price()`, `department()`, `isbn()`, `barcode()` |
| `phone`     | `number()`, `imei()` |
| `date`      | `past()`, `future()`, `recent()`, `birthdate()`, `month()`, `weekday()`, `between()` |
| `image`     | `avatar()`, `url()`, `category()`, `dataUri()` |
| `lorem`     | `word()`, `words()`, `sentence()`, `paragraph()`, `slug()`, `markdown()`, `html()` |
| `color`     | `hex()`, `rgb()`, `rgba()`, `hsl()`, `cssColorName()`, `tailwindColor()`, `materialColor()`, `svgPattern()` |
| `vehicle`   | `manufacturer()`, `model()`, `type()`, `vin()` |
| `animal`    | `type()`, `name()` |
| `science`   | `unit()`, `chemicalElement()` |
| `ai`        | `prompt()`, `chatConversation()`, `codeSnippet()`, `sqlQuery()`, `json()`, `markdown()`, `apiResponse()`, `logLine()`, `commitMessage()`, `issueTitle()`, `prDescription()` |
| `misc`      | `emoji()`, `hashtag()`, `programmingLanguage()`, `githubUsername()`, `gitCommitHash()`, `semver()`, `dockerImageName()`, `npmPackageName()`, `otp()`, `licenseKey()`, `qrData()`, `movie()`, `book()`, `music()`, `food()`, `holiday()`, `university()` |

Run `forge.listGenerators().length` to see the exact live count (100+).

## Runtime support

ForgeData avoids Node-only APIs in `src/` — it uses only `btoa`, `Math`/`Date`, and standard JS, all of which exist in Node 18+, Bun, Deno, and every modern browser. It's published as ESM + CJS so:

- **Node.js**: `import`/`require` both work out of the box.
- **Bun**: works via the same ESM/CJS builds.
- **Deno**: `import { ForgeData } from "npm:@sahinur/forgedata";`
- **Browsers**: `import { ForgeData } from "@sahinur/forgedata";` through any bundler, or `examples/browser.html` for a zero-bundler example.

## Development

```bash
npm install
npm run build            # tsup -> dist (ESM + CJS + .d.ts, for index/react/cli)
npm run test:coverage    # vitest, enforces 100% coverage thresholds
npm run lint
npm run bench            # micro-benchmark, compares against faker if installed
npm run cli -- list      # run the CLI from source during development
```

See [docs/](./docs) for the getting-started guide, full API reference, React guide, CLI reference, migration guide from Faker.js, and contributing guide. See [examples/](./examples) for runnable Node, browser, React, and CLI samples.

## Publishing

This repo is fully set up to publish, but nothing publishes itself:

```bash
npm run preflight   # lint + typecheck + 100%-coverage tests + build
npm login
npm publish --access public
```

`scripts/publish.sh` wraps that sequence with a confirmation prompt, and `RELEASE_NOTES.md` has a ready-to-paste description for the GitHub Release / npm announcement.

For every release after the first, `.github/workflows/release.yml` runs [semantic-release](https://semantic-release.gitbook.io/) on pushes to `main` — it derives the next version from [Conventional Commits](https://www.conventionalcommits.org/), updates `CHANGELOG.md`, tags, and publishes, but only once you add an `NPM_TOKEN` repository secret. Until then it's a no-op (see `docs/contributing.md#releasing`); it never requires a token to just sit there ready.

## License

MIT
