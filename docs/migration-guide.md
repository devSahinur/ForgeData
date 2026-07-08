# Migrating from Faker.js

ForgeData follows a similar module-and-method shape to `@faker-js/faker`, but with a smaller instance-based API surface. Common translations:

| Faker.js | ForgeData |
|----------|-----------|
| `faker.person.firstName()` | `forge.person.firstName()` |
| `faker.person.lastName()` | `forge.person.lastName()` |
| `faker.person.fullName()` | `forge.person.fullName()` |
| `faker.internet.email()` | `forge.internet.email()` |
| `faker.internet.userName()` | `forge.internet.username()` |
| `faker.internet.password()` | `forge.internet.password()` |
| `faker.location.country()` | `forge.location.country()` |
| `faker.location.city()` | `forge.location.city()` |
| `faker.finance.creditCardNumber()` | `forge.finance.creditCardNumber()` |
| `faker.phone.number()` | `forge.phone.number()` |
| `faker.date.past()` | `forge.date.past()` |
| `faker.lorem.sentence()` | `forge.lorem.sentence()` |
| `faker.helpers.arrayElement(arr)` | `forge.pick(arr)` |
| `faker.helpers.shuffle(arr)` | `forge.shuffle(arr)` |
| `faker.seed(42)` | `new ForgeData({ seed: 42 })` or `forge.seed(42)` |
| `faker.setLocale("de")` | `forge.locale("de")` or `new ForgeData({ locale: "de" })` |

## Key differences

1. **Instance-based, not a global singleton.** `new ForgeData()` gives you an isolated random stream. ForgeData also exports a ready-made singleton (`import { forge } from "forgedata"`), but construct your own per test file/suite when you need isolation.
2. **Seeding is constructor-first.** Prefer `new ForgeData({ seed })` over calling `.seed()` after the fact, though both work.
3. **Locale data shape is simpler.** ForgeData locales cover names, places, lorem words, and company phrasing — not every Faker.js locale category. Extend via `forge.defineLocale(...)`.
4. **No module-specific singletons** like `faker.fakerEN`, `faker.fakerDE`, etc. — pass `locale` to the constructor or call `forge.locale(code)`.
5. **Unique generator is per-instance and explicit** (`forge.unique.email()`), not a global unique-tracking layer.
6. **Built-in React integration and CLI** — Faker.js has neither out of the box; ForgeData ships `forgedata/react` and the `forgedata` CLI.
7. **Generator discovery is programmatic.** `forge.listGenerators()` walks the real classes instead of requiring a hand-maintained catalogue — useful for building your own tooling (it's what the CLI is built on).

## Things ForgeData intentionally does not replicate

- Faker.js's exhaustive per-country locale datasets (ForgeData ships a compact-but-real dataset per locale; extend with `defineLocale` for anything domain specific).
- Deprecated Faker.js v7 APIs (`faker.random.*`) — use `forge.pick`/`forge.shuffle`/`forge.randomEnum` instead.
