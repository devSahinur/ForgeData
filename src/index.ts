export {
  ForgeData,
  type ForgeDataOptions,
  type UniqueApi,
  type GeneratorDescriptor,
} from "./ForgeData.js";

export { Random, type WeightedEntry } from "./helpers/random.js";
export { UniqueGenerator, type UniqueOptions } from "./helpers/unique.js";
export {
  slugify,
  capitalize,
  titleCase,
  padNumber,
  transliterate,
  base64Url,
} from "./helpers/format.js";

export {
  LocaleRegistry,
  builtInLocales,
  en, bn, hi, ar, ja, fr, de, es, zh,
  type LocaleData,
  type CustomLocaleData,
  type BuiltInLocaleCode,
} from "./locales/index.js";

export { PersonModule, type Gender } from "./person/index.js";
export { InternetModule, type PasswordOptions } from "./internet/index.js";
export { CompanyModule } from "./company/index.js";
export { FinanceModule, type Currency } from "./finance/index.js";
export { LocationModule } from "./location/index.js";
export { CommerceModule } from "./commerce/index.js";
export { PhoneModule } from "./phone/index.js";
export { DateModule } from "./date/index.js";
export { ImageModule } from "./image/index.js";
export { LoremModule } from "./lorem/index.js";
export { ColorModule } from "./color/index.js";
export { VehicleModule } from "./vehicle/index.js";
export { AnimalModule } from "./animal/index.js";
export { ScienceModule } from "./science/index.js";
export { AiModule, type ChatTurn, type ApiResponse } from "./ai/index.js";
export { MiscModule } from "./misc/index.js";

import { ForgeData } from "./ForgeData.js";

/**
 * Ready-to-use default instance, seeded randomly at import time.
 * Create your own `new ForgeData({ seed })` when you need deterministic
 * or isolated output (e.g. per-test-file).
 */
export const forge = new ForgeData();
