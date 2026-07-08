import type { Random } from "../helpers/random.js";
import type { LocaleRegistry } from "../locales/index.js";

export type Gender = "male" | "female";

export class PersonModule {
  constructor(
    private random: Random,
    private locales: LocaleRegistry,
  ) {}

  gender(): Gender {
    return this.random.arrayElement<Gender>(["male", "female"]);
  }

  firstName(gender?: Gender): string {
    const locale = this.locales.current();
    const g = gender ?? this.gender();
    const pool = g === "male" ? locale.person.firstNamesMale : locale.person.firstNamesFemale;
    return this.random.arrayElement(pool);
  }

  lastName(): string {
    return this.random.arrayElement(this.locales.current().person.lastNames);
  }

  fullName(gender?: Gender): string {
    return `${this.firstName(gender)} ${this.lastName()}`;
  }

  jobTitle(): string {
    return this.random.arrayElement(this.locales.current().person.jobTitles);
  }

  profession(): string {
    return this.random.arrayElement(this.locales.current().person.professions);
  }
}
