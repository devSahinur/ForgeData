# Getting Started

## Install

```bash
npm install forgedata
```

## Your first generator

```ts
import { ForgeData } from "forgedata";

const forge = new ForgeData();

console.log(forge.person.fullName());
console.log(forge.internet.email());
```

`ForgeData` is a plain class — create as many independent instances as you like. Each instance owns its own random stream, so seeding one never affects another.

## Seeding for deterministic tests

```ts
import { ForgeData } from "forgedata";

const forge = new ForgeData({ seed: "my-test-suite" });

test("user fixture is stable", () => {
  expect(forge.person.fullName()).toMatchSnapshot();
});
```

String seeds are hashed into a numeric seed, so a readable seed like a test name works exactly like a number.

## Choosing a locale

```ts
const forge = new ForgeData({ locale: "es" });
forge.person.fullName(); // Spanish name pool

forge.locale("de"); // switch later
```

## Discovering what's available

```ts
forge.listGenerators().length;       // 100+
forge.listGenerators().map((g) => g.id); // ["ai.apiResponse", "ai.chatConversation", ...]
```

## Where to go next

- [API Reference](./api-reference.md) — every module and method
- [React Guide](./react.md) — provider + hooks for React apps
- [CLI Reference](./cli.md) — generating data from the terminal
- [Migration Guide](./migration-guide.md) — coming from Faker.js
- [Contributing](./contributing.md) — how to add generators or locales
