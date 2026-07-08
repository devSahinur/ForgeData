# React Integration

Import from the `@sahinur/forgedata/react` subpath — it's a separate entry point so the main `@sahinur/forgedata` import never pulls in React.

```bash
npm install @sahinur/forgedata react
```

## `ForgeDataProvider`

Provides one `ForgeData` instance to everything below it in the tree.

```tsx
import { ForgeDataProvider } from "@sahinur/forgedata/react";

function App() {
  return (
    <ForgeDataProvider seed={42} locale="en">
      <Dashboard />
    </ForgeDataProvider>
  );
}
```

Props:

| Prop | Type | Description |
|------|------|--------------|
| `seed` | `number \| string` | Passed to `new ForgeData({ seed })`. |
| `locale` | `string` | Passed to `new ForgeData({ locale })`. |
| `instance` | `ForgeData` | Reuse an instance you already constructed instead of letting the provider create one. |

The instance is created once (on first render) and kept for the component's lifetime via `useRef` — it does not change if `seed`/`locale` props change on a later render. Unmount and remount (e.g. by changing a `key`) to force a fresh instance.

## `useForgeData()`

```tsx
import { useForgeData } from "@sahinur/forgedata/react";

function Greeting() {
  const forge = useForgeData();
  return <p>{forge.person.fullName()}</p>;
}
```

Returns the nearest `ForgeDataProvider`'s instance, or a shared module-level default instance if there's no provider in the tree — so the hook works in quick prototypes without any setup. Wrap in a provider whenever you need a specific seed/locale, or per-request isolation in SSR (the fallback singleton is shared across requests on a long-lived server, which is rarely what you want there).

## `useGenerator(selector, deps)`

Runs `selector(forge)` once per unique `deps` array via `useMemo`, so generated fixtures stay stable across re-renders instead of regenerating on every render.

```tsx
import { useGenerator } from "@sahinur/forgedata/react";

function UserCard({ userId }: { userId: string }) {
  const user = useGenerator(
    (forge) => ({
      name: forge.person.fullName(),
      email: forge.internet.email(),
      avatar: forge.image.avatar(),
    }),
    [userId], // regenerate only when userId changes
  );

  return (
    <div>
      <img src={user.avatar} alt="" />
      <p>{user.name} — {user.email}</p>
    </div>
  );
}
```

## Notes

- `react` is an optional peer dependency — only import `@sahinur/forgedata/react` in apps that already have React installed.
- Both hooks call `useForgeData()` internally, which follows the Rules of Hooks; call them at the top level of your component/hook, not conditionally.
