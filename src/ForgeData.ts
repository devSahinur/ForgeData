import { Random, type WeightedEntry } from "./helpers/random.js";
import { UniqueGenerator, type UniqueOptions } from "./helpers/unique.js";
import { LocaleRegistry, type LocaleData } from "./locales/index.js";

import { PersonModule } from "./person/index.js";
import { InternetModule } from "./internet/index.js";
import { CompanyModule } from "./company/index.js";
import { FinanceModule } from "./finance/index.js";
import { LocationModule } from "./location/index.js";
import { CommerceModule } from "./commerce/index.js";
import { PhoneModule } from "./phone/index.js";
import { DateModule } from "./date/index.js";
import { ImageModule } from "./image/index.js";
import { LoremModule } from "./lorem/index.js";
import { ColorModule } from "./color/index.js";
import { VehicleModule } from "./vehicle/index.js";
import { AnimalModule } from "./animal/index.js";
import { ScienceModule } from "./science/index.js";
import { AiModule } from "./ai/index.js";
import { MiscModule } from "./misc/index.js";

export interface ForgeDataOptions {
  /** Numeric or string seed. Same seed => identical output across runs. */
  seed?: number | string;
  /** Locale code to start with (built-in: en, bn, hi, ar, ja, fr, de, es, zh). Defaults to "en". */
  locale?: string;
}

type CustomGenerator<T = unknown> = (forge: ForgeData, ...args: never[]) => T;

export interface UniqueApi {
  email(): string;
  username(): string;
  uuid(): string;
  /** Wraps any generator function so repeated calls of the returned function never repeat a value. */
  wrap<Args extends unknown[], R>(fn: (...args: Args) => R, options?: UniqueOptions): (...args: Args) => R;
  /** Forgets every value produced so far, allowing repeats again. */
  clear(): void;
}

export interface GeneratorDescriptor {
  module: string;
  method: string;
  /** Dot-path used by the CLI, e.g. "person.fullName". */
  id: string;
}

/**
 * The single entry point of ForgeData. Instantiate it directly for isolated,
 * independently-seedable generators, or import the shared `forge` default
 * export for quick scripts.
 *
 * @example
 * const forge = new ForgeData({ seed: 42 });
 * forge.person.fullName();
 * forge.internet.email();
 */
export class ForgeData {
  readonly random: Random;
  readonly locales: LocaleRegistry;

  readonly person: PersonModule;
  readonly internet: InternetModule;
  readonly company: CompanyModule;
  readonly finance: FinanceModule;
  readonly location: LocationModule;
  readonly commerce: CommerceModule;
  readonly phone: PhoneModule;
  readonly date: DateModule;
  readonly image: ImageModule;
  readonly lorem: LoremModule;
  readonly color: ColorModule;
  readonly vehicle: VehicleModule;
  readonly animal: AnimalModule;
  readonly science: ScienceModule;
  readonly ai: AiModule;
  readonly misc: MiscModule;

  readonly unique: UniqueApi;
  /** Dynamically dispatches to generators registered via `define()`, e.g. `forge.custom.pokemon()`. */
  readonly custom: Record<string, (...args: never[]) => unknown>;

  private customGenerators = new Map<string, CustomGenerator>();
  private modules: Record<string, object>;

  constructor(options: ForgeDataOptions = {}) {
    this.random = new Random(options.seed);
    this.locales = new LocaleRegistry(options.locale ?? "en");

    this.person = new PersonModule(this.random, this.locales);
    this.internet = new InternetModule(this.random, this.person);
    this.company = new CompanyModule(this.random, this.locales, this.person);
    this.finance = new FinanceModule(this.random);
    this.location = new LocationModule(this.random, this.locales);
    this.commerce = new CommerceModule(this.random);
    this.phone = new PhoneModule(this.random);
    this.date = new DateModule(this.random);
    this.image = new ImageModule(this.random);
    this.lorem = new LoremModule(this.random, this.locales);
    this.color = new ColorModule(this.random);
    this.vehicle = new VehicleModule(this.random);
    this.animal = new AnimalModule(this.random);
    this.science = new ScienceModule(this.random);
    this.ai = new AiModule(this.random, this.lorem);
    this.misc = new MiscModule(this.random);

    this.modules = {
      person: this.person,
      internet: this.internet,
      company: this.company,
      finance: this.finance,
      location: this.location,
      commerce: this.commerce,
      phone: this.phone,
      date: this.date,
      image: this.image,
      lorem: this.lorem,
      color: this.color,
      vehicle: this.vehicle,
      animal: this.animal,
      science: this.science,
      ai: this.ai,
      misc: this.misc,
    };

    const uniqueGenerator = new UniqueGenerator();
    this.unique = {
      email: uniqueGenerator.wrap(() => this.internet.email()),
      username: uniqueGenerator.wrap(() => this.internet.username()),
      uuid: uniqueGenerator.wrap(() => this.random.uuid()),
      wrap: uniqueGenerator.wrap.bind(uniqueGenerator),
      clear: uniqueGenerator.clear.bind(uniqueGenerator),
    };

    this.custom = new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          return (...args: never[]) => {
            const generator = this.customGenerators.get(prop);
            if (!generator) {
              throw new Error(
                `No custom generator named "${prop}". Register one first with forge.define("${prop}", (forge) => ...).`,
              );
            }
            return generator(this, ...args);
          };
        },
      },
    );
  }

  /** Reseeds every generator on this instance. Returns the normalized numeric seed applied. */
  seed(seed?: number | string): number {
    return this.random.seed(seed);
  }

  /** Gets or switches the active locale. Pass no argument to read the current code. */
  locale(code?: string): string {
    if (code !== undefined) this.locales.use(code);
    return this.locales.currentCode();
  }

  /** Registers a custom locale (or overrides a built-in one) so it can be selected with `locale()`. */
  defineLocale(data: LocaleData): void {
    this.locales.define(data);
  }

  /** Registers a custom generator, callable afterwards as `forge.custom.<name>()`. */
  define<T>(name: string, generator: CustomGenerator<T>): void {
    this.customGenerators.set(name, generator as CustomGenerator);
  }

  uuid(): string {
    return this.random.uuid();
  }

  shuffle<T>(array: readonly T[]): T[] {
    return this.random.shuffle(array);
  }

  pick<T>(array: readonly T[]): T {
    return this.random.arrayElement(array);
  }

  pickMultiple<T>(array: readonly T[], count?: number): T[] {
    return this.random.arrayElements(array, count);
  }

  randomEnum<T extends Record<string, string | number>>(enumObject: T): T[keyof T] {
    return this.random.enum(enumObject);
  }

  weighted<T>(entries: readonly WeightedEntry<T>[]): T {
    return this.random.weightedArrayElement(entries);
  }

  probability(p: number): boolean {
    return this.random.probability(p);
  }

  /** Builds an array of `count` items using `generator()`. Defaults to a random length between 1 and 10. */
  randomArray<T>(generator: (index: number) => T, count?: number): T[] {
    const length = count ?? this.random.int(1, 10);
    return Array.from({ length }, (_, i) => generator(i));
  }

  randomObjectKey<T extends object>(obj: T): keyof T {
    return this.random.objectKey(obj);
  }

  randomObjectValue<T extends object>(obj: T): T[keyof T] {
    return this.random.objectValue(obj);
  }

  /**
   * Lists every built-in `<module>.<method>()` generator via prototype
   * introspection, so the CLI (and anything else) never needs a hand-maintained
   * registry that drifts from the actual module classes.
   */
  listGenerators(): GeneratorDescriptor[] {
    const descriptors: GeneratorDescriptor[] = [];
    for (const [moduleName, instance] of Object.entries(this.modules)) {
      const proto = Object.getPrototypeOf(instance) as object;
      for (const method of Object.getOwnPropertyNames(proto)) {
        if (method === "constructor") continue;
        descriptors.push({ module: moduleName, method, id: `${moduleName}.${method}` });
      }
    }
    return descriptors.sort((a, b) => a.id.localeCompare(b.id));
  }

  /** Dynamically invokes `<module>.<method>(...args)`, e.g. invoke("person", "fullName"). */
  invoke(moduleName: string, methodName: string, ...args: unknown[]): unknown {
    const moduleInstance = this.modules[moduleName];
    if (!moduleInstance) {
      throw new Error(
        `Unknown module "${moduleName}". Available modules: ${Object.keys(this.modules).join(", ")}.`,
      );
    }
    const fn = (moduleInstance as Record<string, unknown>)[methodName];
    if (typeof fn !== "function") {
      throw new Error(
        `Unknown generator "${moduleName}.${methodName}". Call listGenerators() to see every available id.`,
      );
    }
    return (fn as (...fnArgs: unknown[]) => unknown).apply(moduleInstance, args);
  }
}
