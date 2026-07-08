import { describe, expect, it } from "vitest";
import * as mainBarrel from "../src/index.js";
import * as helpersBarrel from "../src/helpers/index.js";

describe("package entry barrels", () => {
  it("src/index.ts exports ForgeData, every module class, and a ready-to-use default instance", () => {
    expect(mainBarrel.ForgeData).toBeTypeOf("function");
    expect(mainBarrel.PersonModule).toBeTypeOf("function");
    expect(mainBarrel.forge).toBeInstanceOf(mainBarrel.ForgeData);
    expect(typeof mainBarrel.forge.person.fullName()).toBe("string");
    expect(mainBarrel.en.code).toBe("en");
  });

  it("src/helpers/index.ts re-exports the helper utilities", () => {
    expect(helpersBarrel.Random).toBeTypeOf("function");
    expect(helpersBarrel.UniqueGenerator).toBeTypeOf("function");
    expect(helpersBarrel.mulberry32).toBeTypeOf("function");
    expect(helpersBarrel.slugify("Hello World")).toBe("hello-world");
  });
});
