import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { ScienceModule } from "../../src/science/index.js";

describe("ScienceModule", () => {
  const science = new ScienceModule(new Random(1));

  it("unit() returns a name/symbol pair", () => {
    const unit = science.unit();
    expect(unit).toHaveProperty("name");
    expect(unit).toHaveProperty("symbol");
  });

  it("chemicalElement() returns a name/symbol/atomicNumber triple", () => {
    const element = science.chemicalElement();
    expect(element).toHaveProperty("atomicNumber");
    expect(typeof element.atomicNumber).toBe("number");
  });
});
