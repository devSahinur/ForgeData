import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { ImageModule } from "../../src/image/index.js";

describe("ImageModule", () => {
  const image = new ImageModule(new Random(1));

  it("avatar() returns a URL", () => {
    expect(image.avatar()).toMatch(/^https:\/\//);
  });

  it("url() uses defaults and custom width/height/category", () => {
    expect(image.url()).toContain("/640/480");
    expect(image.url(100, 200, "space")).toContain("/100/200");
    expect(image.url(100, 200, "space")).toContain("-space/");
  });

  it("category() returns a known category", () => {
    expect(typeof image.category()).toBe("string");
  });

  it("dataUri() embeds valid base64 SVG, with defaults and custom args", () => {
    const uri = image.dataUri(10, 20, "ff0000");
    expect(uri).toMatch(/^data:image\/svg\+xml;base64,/);
    const decoded = Buffer.from(uri.split(",")[1] as string, "base64").toString("utf-8");
    expect(decoded).toContain("width=\"10\"");
    expect(image.dataUri()).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
