import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { AnimalModule } from "../../src/animal/index.js";

describe("AnimalModule", () => {
  const animal = new AnimalModule(new Random(1));

  it("type() and name() return non-empty strings", () => {
    expect(animal.type().length).toBeGreaterThan(0);
    expect(animal.name().length).toBeGreaterThan(0);
  });
});
