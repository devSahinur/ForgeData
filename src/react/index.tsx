import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type DependencyList,
  type ReactNode,
} from "react";
import { ForgeData, type ForgeDataOptions } from "../ForgeData.js";

const ForgeDataContext = createContext<ForgeData | null>(null);

export interface ForgeDataProviderProps extends ForgeDataOptions {
  /** Reuse an existing ForgeData instance instead of letting the provider create one. */
  instance?: ForgeData;
  children?: ReactNode;
}

let sharedDefaultInstance: ForgeData | null = null;

/**
 * Lazily-created singleton used by `useForgeData()` when no `ForgeDataProvider`
 * is present, so the hook works out of the box in quick prototypes. Wrap your
 * tree in a `ForgeDataProvider` whenever you need a specific seed/locale, or
 * per-request isolation (e.g. in SSR, where this module-level singleton would
 * otherwise be shared across requests on the server).
 */
function getSharedDefaultInstance(): ForgeData {
  if (!sharedDefaultInstance) sharedDefaultInstance = new ForgeData();
  return sharedDefaultInstance;
}

/**
 * Provides a single ForgeData instance to every `useForgeData()`/`useGenerator()`
 * call in the tree below it. Pass `seed`/`locale` to create a fresh deterministic
 * instance, or `instance` to reuse one you already constructed.
 */
export function ForgeDataProvider(props: ForgeDataProviderProps) {
  const { instance, seed, locale, children } = props;
  const forgeRef = useRef<ForgeData | null>(null);
  if (!forgeRef.current) {
    forgeRef.current = instance ?? new ForgeData({ seed, locale });
  }
  return <ForgeDataContext.Provider value={forgeRef.current}>{children}</ForgeDataContext.Provider>;
}

/** Returns the ForgeData instance from the nearest `ForgeDataProvider`, or a shared default. */
export function useForgeData(): ForgeData {
  const contextValue = useContext(ForgeDataContext);
  return contextValue ?? getSharedDefaultInstance();
}

/**
 * Runs `selector(forge)` once per unique `deps` array (via `useMemo`), so
 * generated fixtures stay stable across re-renders instead of changing on
 * every render.
 *
 * @example
 * const user = useGenerator((forge) => ({
 *   name: forge.person.fullName(),
 *   email: forge.internet.email(),
 * }), []);
 */
export function useGenerator<T>(selector: (forge: ForgeData) => T, deps: DependencyList = []): T {
  const forge = useForgeData();
  // selector is expected to be re-created every render (it closes over
  // fresh deps); only `deps` should decide when regeneration happens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => selector(forge), [forge, ...deps]);
}

export { ForgeData, type ForgeDataOptions } from "../ForgeData.js";
