import type { Random } from "../helpers/random.js";

const CSS_COLOR_NAMES = [
  "aliceblue", "antiquewhite", "aqua", "azure", "beige", "bisque", "black",
  "blue", "brown", "chartreuse", "chocolate", "coral", "crimson", "cyan",
  "gold", "gray", "green", "indigo", "ivory", "khaki", "lavender", "lime",
  "magenta", "maroon", "navy", "olive", "orange", "orchid", "pink", "plum",
  "purple", "red", "salmon", "sienna", "silver", "tan", "teal", "tomato",
  "turquoise", "violet", "wheat", "white", "yellow",
];

const TAILWIND_COLORS = [
  "slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber",
  "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue",
  "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];
const TAILWIND_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const MATERIAL_COLORS: Record<string, string> = {
  Red: "#F44336", Pink: "#E91E63", Purple: "#9C27B0", DeepPurple: "#673AB7",
  Indigo: "#3F51B5", Blue: "#2196F3", LightBlue: "#03A9F4", Cyan: "#00BCD4",
  Teal: "#009688", Green: "#4CAF50", LightGreen: "#8BC34A", Lime: "#CDDC39",
  Yellow: "#FFEB3B", Amber: "#FFC107", Orange: "#FF9800", DeepOrange: "#FF5722",
  Brown: "#795548", Grey: "#9E9E9E", BlueGrey: "#607D8B",
};

export class ColorModule {
  constructor(private random: Random) {}

  hex(): string {
    return `#${this.random.hex(6)}`;
  }

  rgb(): string {
    return `rgb(${this.random.int(0, 255)}, ${this.random.int(0, 255)}, ${this.random.int(0, 255)})`;
  }

  rgba(): string {
    return `rgba(${this.random.int(0, 255)}, ${this.random.int(0, 255)}, ${this.random.int(0, 255)}, ${this.random.float(0, 1, 2)})`;
  }

  hsl(): string {
    return `hsl(${this.random.int(0, 360)}, ${this.random.int(20, 100)}%, ${this.random.int(20, 90)}%)`;
  }

  cssColorName(): string {
    return this.random.arrayElement(CSS_COLOR_NAMES);
  }

  tailwindColor(): string {
    return `${this.random.arrayElement(TAILWIND_COLORS)}-${this.random.arrayElement(TAILWIND_SHADES)}`;
  }

  materialColor(): { name: string; hex: string } {
    const name = this.random.objectKey(MATERIAL_COLORS) as string;
    return { name, hex: MATERIAL_COLORS[name] as string };
  }

  svgPattern(size = 40): string {
    const bg = this.hex();
    const fg = this.hex();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="${bg}"/><circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${fg}"/></svg>`;
  }
}
