import type { Random } from "../helpers/random.js";
import type { LocaleRegistry } from "../locales/index.js";
import type { PersonModule } from "../person/index.js";

export class CompanyModule {
  constructor(
    private random: Random,
    private locales: LocaleRegistry,
    private person: PersonModule,
  ) {}

  name(): string {
    const locale = this.locales.current();
    const surname = this.person.lastName();
    const suffix = this.random.arrayElement(locale.company.suffixes);
    return this.random.boolean(0.5) ? `${surname} ${suffix}` : `${surname} & ${this.person.lastName()}`;
  }

  catchPhrase(): string {
    const locale = this.locales.current();
    const adjective = this.random.arrayElement(locale.company.catchPhraseAdjectives);
    const noun = this.random.arrayElement(locale.company.catchPhraseNouns);
    const noun2 = this.random.arrayElement(locale.company.catchPhraseNouns);
    return `${adjective} ${noun} for modern ${noun2}`;
  }

  logo(seed?: string): string {
    const identifier = seed ?? this.random.alphaNumeric(8);
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${identifier}`;
  }
}
