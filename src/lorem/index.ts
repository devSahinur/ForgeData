import type { Random } from "../helpers/random.js";
import type { LocaleRegistry } from "../locales/index.js";
import { capitalize, slugify } from "../helpers/format.js";

export class LoremModule {
  constructor(
    private random: Random,
    private locales: LocaleRegistry,
  ) {}

  word(): string {
    return this.random.arrayElement(this.locales.current().lorem.words);
  }

  words(count = 3): string {
    return Array.from({ length: count }, () => this.word()).join(" ");
  }

  sentence(wordCount?: number): string {
    const n = wordCount ?? this.random.int(6, 12);
    const text = this.words(n);
    return `${capitalize(text)}.`;
  }

  sentences(count = 3): string {
    return Array.from({ length: count }, () => this.sentence()).join(" ");
  }

  paragraph(sentenceCount = 4): string {
    return Array.from({ length: sentenceCount }, () => this.sentence()).join(" ");
  }

  paragraphs(count = 3, separator = "\n\n"): string {
    return Array.from({ length: count }, () => this.paragraph()).join(separator);
  }

  slug(wordCount = 3): string {
    return slugify(this.words(wordCount));
  }

  markdown(): string {
    const heading = capitalize(this.words(3));
    const list = Array.from({ length: 3 }, () => `- ${this.sentence(5)}`).join("\n");
    return `# ${heading}\n\n${this.paragraph()}\n\n${list}\n\n> ${this.sentence()}`;
  }

  html(): string {
    const heading = capitalize(this.words(3));
    const items = Array.from({ length: 3 }, () => `  <li>${this.sentence(4)}</li>`).join("\n");
    return `<article>\n  <h1>${heading}</h1>\n  <p>${this.paragraph()}</p>\n  <ul>\n${items}\n  </ul>\n</article>`;
  }
}
