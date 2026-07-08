# API Reference

## `new ForgeData(options?)`

| Option   | Type                 | Default | Description |
|----------|----------------------|---------|--------------|
| `seed`   | `number \| string`   | random  | Makes every generator on this instance deterministic. |
| `locale` | `string`             | `"en"`  | Starting locale code. |

## Instance-level utilities

| Method | Description |
|--------|--------------|
| `seed(seed?)` | Reseeds the instance. Returns the normalized numeric seed. |
| `locale(code?)` | Gets or sets the active locale code. |
| `defineLocale(data)` | Registers a custom locale (see `LocaleData` in `src/locales/types.ts`). |
| `define(name, fn)` | Registers a custom generator, called later as `forge.custom.<name>()`. |
| `uuid()` | Random v4 UUID. |
| `shuffle(array)` | Fisher-Yates shuffle; returns a new array. |
| `pick(array)` | One random element. |
| `pickMultiple(array, count?)` | `count` distinct-by-position elements (defaults to a random subset size). |
| `randomEnum(enumObject)` | Random value from a TS string or numeric enum. |
| `weighted(entries)` | Weighted random pick from `{ weight, value }[]`. |
| `probability(p)` | `true` with probability `p` (0–1). |
| `randomArray(fn, count?)` | Builds an array by calling `fn(index)` `count` times. |
| `randomObjectKey(obj)` / `randomObjectValue(obj)` | Random key/value from a plain object. |
| `listGenerators()` | Every `<module>.<method>` generator, discovered via prototype introspection. |
| `invoke(module, method, ...args)` | Dynamically calls `forge[module][method](...args)`. |

## `forge.unique`

| Method | Description |
|--------|--------------|
| `email()` / `username()` / `uuid()` | Pre-wrapped unique generators. |
| `wrap(fn, options?)` | Wraps any generator; the returned function never repeats a value. `options.maxRetries` defaults to 5000. |
| `clear()` | Forgets everything generated so far. |

## Modules

Every module below is a plain class instantiated once per `ForgeData`. Full method signatures live next to each implementation in `src/<module>/index.ts` with JSDoc.

- `person` — names, gender, job titles, professions
- `internet` — email, username, password, url, domain, ipv4/ipv6, mac, user agent, jwt, api key
- `company` — name, catch phrase, logo
- `finance` — currency, amount, credit card, IBAN, bitcoin/ethereum address, crypto coin, stock symbol
- `location` — country, state, city, zip code, lat/long, timezone, airport
- `commerce` — product name, price, department, isbn, barcode
- `phone` — number, imei
- `date` — past, future, recent, birthdate, month, weekday, between
- `image` — avatar, url, category, data URI
- `lorem` — word(s), sentence(s), paragraph(s), slug, markdown, html
- `color` — hex, rgb, rgba, hsl, css color name, tailwind color, material color, svg pattern
- `vehicle` — manufacturer, model, type, vin
- `animal` — type, name
- `science` — unit, chemical element
- `ai` — prompt, chat conversation, code snippet, sql query, json, markdown, api response, log line, commit message, issue title, PR description
- `misc` — emoji, hashtag, programming language, github username, git commit hash, semver, docker image name, npm package name, otp, license key, qr data, movie, book, music, food, holiday, university

## Locales

Built-in codes: `en`, `bn`, `hi`, `ar`, `ja`, `fr`, `de`, `es`, `zh`. Register additional ones with `forge.defineLocale(data)`.

## React (`forgedata/react`)

See [react.md](./react.md).

## CLI (`forgedata`)

See [cli.md](./cli.md).
