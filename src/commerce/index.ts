import type { Random } from "../helpers/random.js";

const ADJECTIVES = ["Sleek", "Rustic", "Ergonomic", "Handcrafted", "Compact", "Premium", "Portable", "Smart"];
const MATERIALS = ["Steel", "Wooden", "Leather", "Cotton", "Plastic", "Ceramic", "Aluminum", "Glass"];
const PRODUCTS = ["Chair", "Table", "Lamp", "Backpack", "Watch", "Keyboard", "Speaker", "Bottle", "Jacket", "Headphones"];
const DEPARTMENTS = ["Electronics", "Home & Garden", "Sports", "Toys", "Books", "Beauty", "Automotive", "Grocery"];

export class CommerceModule {
  constructor(private random: Random) {}

  productName(): string {
    return `${this.random.arrayElement(ADJECTIVES)} ${this.random.arrayElement(MATERIALS)} ${this.random.arrayElement(PRODUCTS)}`;
  }

  price(min = 1, max = 1000): string {
    return this.random.float(min, max, 2).toFixed(2);
  }

  department(): string {
    return this.random.arrayElement(DEPARTMENTS);
  }

  isbn(): string {
    const digits = Array.from({ length: 12 }, () => this.random.int(0, 9));
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += (digits[i] as number) * (i % 2 === 0 ? 1 : 3);
    const check = (10 - (sum % 10)) % 10;
    return `978-${digits.slice(0, 1).join("")}-${digits.slice(1, 5).join("")}-${digits.slice(5, 12).join("")}-${check}`;
  }

  barcode(): string {
    return Array.from({ length: 12 }, () => this.random.int(0, 9)).join("");
  }
}
