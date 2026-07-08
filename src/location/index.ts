import type { Random } from "../helpers/random.js";
import type { LocaleRegistry } from "../locales/index.js";

const TIMEZONES = [
  "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo",
  "Asia/Shanghai", "Asia/Dhaka", "Asia/Kolkata", "Asia/Dubai",
  "Australia/Sydney", "Pacific/Auckland", "Africa/Cairo", "Africa/Johannesburg",
];

const AIRPORTS = [
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "HND", name: "Tokyo Haneda Airport" },
  { code: "CDG", name: "Charles de Gaulle Airport" },
  { code: "SIN", name: "Singapore Changi Airport" },
  { code: "DAC", name: "Hazrat Shahjalal International Airport" },
  { code: "DEL", name: "Indira Gandhi International Airport" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport" },
  { code: "FRA", name: "Frankfurt Airport" },
];

export class LocationModule {
  constructor(
    private random: Random,
    private locales: LocaleRegistry,
  ) {}

  country(): string {
    return this.random.arrayElement(this.locales.current().location.countries);
  }

  state(): string {
    return this.random.arrayElement(this.locales.current().location.states);
  }

  city(): string {
    return this.random.arrayElement(this.locales.current().location.cities);
  }

  zipCode(format = "#####"): string {
    return format.replace(/#/g, () => this.random.int(0, 9).toString());
  }

  latitude(): number {
    return this.random.float(-90, 90, 6);
  }

  longitude(): number {
    return this.random.float(-180, 180, 6);
  }

  timezone(): string {
    return this.random.arrayElement(TIMEZONES);
  }

  airport(): { code: string; name: string } {
    return this.random.arrayElement(AIRPORTS);
  }
}
