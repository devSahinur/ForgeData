import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { CommerceModule } from "../../src/commerce/index.js";

describe("CommerceModule", () => {
  const commerce = new CommerceModule(new Random(1));

  it("productName() combines adjective/material/product", () => {
    expect(commerce.productName().split(" ")).toHaveLength(3);
  });

  it("price() respects bounds and defaults", () => {
    expect(Number(commerce.price(10, 20))).toBeGreaterThanOrEqual(10);
    expect(typeof commerce.price()).toBe("string");
  });

  it("department() returns a non-empty string", () => {
    expect(commerce.department().length).toBeGreaterThan(0);
  });

  it("isbn() matches the expected format", () => {
    expect(commerce.isbn()).toMatch(/^978-\d-\d{4}-\d{7}-\d$/);
  });

  it("barcode() is 12 digits", () => {
    expect(commerce.barcode()).toMatch(/^\d{12}$/);
  });
});
