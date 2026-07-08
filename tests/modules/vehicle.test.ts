import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { VehicleModule } from "../../src/vehicle/index.js";

describe("VehicleModule", () => {
  const vehicle = new VehicleModule(new Random(1));

  it("manufacturer()/model()/type() return non-empty strings", () => {
    expect(vehicle.manufacturer().length).toBeGreaterThan(0);
    expect(vehicle.model().length).toBeGreaterThan(0);
    expect(vehicle.type().length).toBeGreaterThan(0);
  });

  it("vin() is 17 alphanumeric characters", () => {
    expect(vehicle.vin()).toMatch(/^[A-Z0-9]{17}$/);
  });
});
