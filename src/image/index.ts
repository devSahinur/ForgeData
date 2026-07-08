import type { Random } from "../helpers/random.js";

const CATEGORIES = ["nature", "people", "technology", "animals", "food", "architecture", "travel", "business"];

export class ImageModule {
  constructor(private random: Random) {}

  avatar(): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.random.alphaNumeric(10)}`;
  }

  url(width = 640, height = 480, category?: string): string {
    const cat = category ?? this.random.arrayElement(CATEGORIES);
    return `https://picsum.photos/seed/${this.random.alphaNumeric(8)}-${cat}/${width}/${height}`;
  }

  category(): string {
    return this.random.arrayElement(CATEGORIES);
  }

  dataUri(width = 1, height = 1, color = "cccccc"): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#${color}"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
