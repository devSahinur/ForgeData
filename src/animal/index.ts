import type { Random } from "../helpers/random.js";

const TYPES = [
  "Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Panda", "Kangaroo",
  "Dolphin", "Eagle", "Owl", "Fox", "Wolf", "Bear", "Rabbit", "Horse",
];
const PET_NAMES = ["Bella", "Max", "Charlie", "Luna", "Cooper", "Milo", "Rocky", "Daisy", "Buddy", "Coco"];

export class AnimalModule {
  constructor(private random: Random) {}

  type(): string {
    return this.random.arrayElement(TYPES);
  }

  name(): string {
    return this.random.arrayElement(PET_NAMES);
  }
}
