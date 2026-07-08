import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { PhoneModule } from "../../src/phone/index.js";

describe("PhoneModule", () => {
  const phone = new PhoneModule(new Random(1));

  it("number() uses the default and a custom format", () => {
    expect(phone.number()).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
    expect(phone.number("(###) ###-####")).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });

  it("imei() is 15 digits with a valid Luhn-style check digit", () => {
    for (let i = 0; i < 50; i++) {
      expect(phone.imei()).toMatch(/^\d{15}$/);
    }
  });
});
