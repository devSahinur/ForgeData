import type { Random } from "../helpers/random.js";

const UNITS = [
  { name: "meter", symbol: "m" },
  { name: "kilogram", symbol: "kg" },
  { name: "second", symbol: "s" },
  { name: "ampere", symbol: "A" },
  { name: "kelvin", symbol: "K" },
  { name: "mole", symbol: "mol" },
  { name: "candela", symbol: "cd" },
  { name: "newton", symbol: "N" },
  { name: "joule", symbol: "J" },
  { name: "watt", symbol: "W" },
];

const ELEMENTS = [
  { name: "Hydrogen", symbol: "H", atomicNumber: 1 },
  { name: "Helium", symbol: "He", atomicNumber: 2 },
  { name: "Carbon", symbol: "C", atomicNumber: 6 },
  { name: "Nitrogen", symbol: "N", atomicNumber: 7 },
  { name: "Oxygen", symbol: "O", atomicNumber: 8 },
  { name: "Sodium", symbol: "Na", atomicNumber: 11 },
  { name: "Iron", symbol: "Fe", atomicNumber: 26 },
  { name: "Gold", symbol: "Au", atomicNumber: 79 },
  { name: "Silver", symbol: "Ag", atomicNumber: 47 },
  { name: "Uranium", symbol: "U", atomicNumber: 92 },
];

export class ScienceModule {
  constructor(private random: Random) {}

  unit(): { name: string; symbol: string } {
    return this.random.arrayElement(UNITS);
  }

  chemicalElement(): { name: string; symbol: string; atomicNumber: number } {
    return this.random.arrayElement(ELEMENTS);
  }
}
