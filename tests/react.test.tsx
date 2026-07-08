// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { ForgeData } from "../src/ForgeData.js";
import { ForgeDataProvider, useForgeData, useGenerator } from "../src/react/index.js";

describe("react integration", () => {
  it("useForgeData() without a provider falls back to a shared default instance", () => {
    const { result: resultA } = renderHook(() => useForgeData());
    const { result: resultB } = renderHook(() => useForgeData());
    expect(resultA.current).toBeInstanceOf(ForgeData);
    expect(resultA.current).toBe(resultB.current);
  });

  it("ForgeDataProvider with seed/locale creates a fresh, isolated instance", () => {
    const { result } = renderHook(() => useForgeData(), {
      wrapper: ({ children }) => (
        <ForgeDataProvider seed={42} locale="de">
          {children}
        </ForgeDataProvider>
      ),
    });
    expect(result.current.locale()).toBe("de");
  });

  it("ForgeDataProvider with an explicit instance reuses it exactly", () => {
    const instance = new ForgeData({ seed: 1 });
    const { result } = renderHook(() => useForgeData(), {
      wrapper: ({ children }) => <ForgeDataProvider instance={instance}>{children}</ForgeDataProvider>,
    });
    expect(result.current).toBe(instance);
  });

  it("useGenerator() memoizes its value across re-renders when deps don't change", () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: number }) => useGenerator((forge) => forge.uuid(), [id]),
      {
        initialProps: { id: 1 },
        wrapper: ({ children }) => (
          <ForgeDataProvider seed={1}>{children}</ForgeDataProvider>
        ),
      },
    );
    const first = result.current;
    rerender({ id: 1 });
    expect(result.current).toBe(first);
  });

  it("useGenerator() recomputes when deps change", () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: number }) => useGenerator((forge) => `${id}-${forge.uuid()}`, [id]),
      {
        initialProps: { id: 1 },
        wrapper: ({ children }) => (
          <ForgeDataProvider seed={1}>{children}</ForgeDataProvider>
        ),
      },
    );
    const first = result.current;
    rerender({ id: 2 });
    expect(result.current).not.toBe(first);
  });
});
