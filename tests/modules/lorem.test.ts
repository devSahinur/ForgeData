import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { LoremModule } from "../../src/lorem/index.js";

describe("LoremModule", () => {
  const lorem = new LoremModule(new Random(1), new LocaleRegistry("en"));

  it("word()/words() return non-empty text, with default and custom counts", () => {
    expect(lorem.word().length).toBeGreaterThan(0);
    expect(lorem.words().split(" ")).toHaveLength(3);
    expect(lorem.words(5).split(" ")).toHaveLength(5);
  });

  it("sentence() ends with a period, with an implicit and explicit word count", () => {
    expect(lorem.sentence()).toMatch(/\.$/);
    expect(lorem.sentence(4)).toMatch(/\.$/);
  });

  it("sentences() joins multiple sentences", () => {
    expect(lorem.sentences(2).split(". ").length).toBeGreaterThanOrEqual(2);
  });

  it("paragraph()/paragraphs() use defaults and custom counts/separators", () => {
    expect(lorem.paragraph().length).toBeGreaterThan(0);
    expect(lorem.paragraphs()).toContain("\n\n");
    expect(lorem.paragraphs(2, " | ")).toContain(" | ");
  });

  it("slug() is url-safe, with default and custom word counts", () => {
    expect(lorem.slug()).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(lorem.slug(5)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("markdown() includes a heading and a quote", () => {
    const md = lorem.markdown();
    expect(md).toContain("# ");
    expect(md).toContain("> ");
  });

  it("html() includes a heading and a list", () => {
    const html = lorem.html();
    expect(html).toContain("<h1>");
    expect(html).toContain("<li>");
  });
});
