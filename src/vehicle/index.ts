import type { Random } from "../helpers/random.js";

const MANUFACTURERS = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi",
  "Volkswagen", "Nissan", "Hyundai", "Kia", "Tesla", "Mazda", "Subaru",
];
const MODELS = ["Corolla", "Civic", "F-150", "Silverado", "3 Series", "C-Class", "A4", "Golf", "Altima", "Elantra"];
const TYPES = ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Convertible", "Van", "Wagon"];

export class VehicleModule {
  constructor(private random: Random) {}

  manufacturer(): string {
    return this.random.arrayElement(MANUFACTURERS);
  }

  model(): string {
    return this.random.arrayElement(MODELS);
  }

  type(): string {
    return this.random.arrayElement(TYPES);
  }

  vin(): string {
    const charset = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
    return this.random.alphaNumeric(17, charset);
  }
}
