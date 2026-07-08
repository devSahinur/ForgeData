import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { LocationModule } from "../../src/location/index.js";

describe("LocationModule", () => {
  const location = new LocationModule(new Random(1), new LocaleRegistry("en"));

  it("country/state/city return non-empty strings", () => {
    expect(location.country().length).toBeGreaterThan(0);
    expect(location.state().length).toBeGreaterThan(0);
    expect(location.city().length).toBeGreaterThan(0);
  });

  it("zipCode() uses the default and a custom format", () => {
    expect(location.zipCode()).toMatch(/^\d{5}$/);
    expect(location.zipCode("##-###")).toMatch(/^\d{2}-\d{3}$/);
  });

  it("latitude/longitude are within valid ranges", () => {
    for (let i = 0; i < 50; i++) {
      expect(location.latitude()).toBeGreaterThanOrEqual(-90);
      expect(location.latitude()).toBeLessThanOrEqual(90);
      expect(location.longitude()).toBeGreaterThanOrEqual(-180);
      expect(location.longitude()).toBeLessThanOrEqual(180);
    }
  });

  it("timezone() and airport() return known shapes", () => {
    expect(typeof location.timezone()).toBe("string");
    expect(location.airport()).toHaveProperty("code");
  });
});
