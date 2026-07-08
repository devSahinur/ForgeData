import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { ColorModule } from "../../src/color/index.js";

describe("ColorModule", () => {
  const color = new ColorModule(new Random(1));

  it("hex() is a valid hex color", () => {
    expect(color.hex()).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("rgb()/rgba()/hsl() are well-formed", () => {
    expect(color.rgb()).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
    expect(color.rgba()).toMatch(/^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [\d.]+\)$/);
    expect(color.hsl()).toMatch(/^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/);
  });

  it("cssColorName() and tailwindColor() return known shapes", () => {
    expect(typeof color.cssColorName()).toBe("string");
    expect(color.tailwindColor()).toMatch(/^[a-z]+-\d+$/);
  });

  it("materialColor() returns a name/hex pair from the palette", () => {
    const material = color.materialColor();
    expect(material.hex).toMatch(/^#[0-9A-F]{6}$/);
    expect(material.name.length).toBeGreaterThan(0);
  });

  it("svgPattern() embeds the requested size, with default and custom values", () => {
    expect(color.svgPattern()).toContain('width="40"');
    expect(color.svgPattern(80)).toContain('width="80"');
  });
});
