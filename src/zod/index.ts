import type { z } from "zod";
import type { ForgeData } from "../ForgeData.js";

const MAX_LAZY_DEPTH = 8;
const ID_CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Zod v4 schemas expose their shape through public, non-underscored
 * properties (`.type`, `.def`, `.minLength`, `.format`, ...) rather than a
 * documented public type API. This is the same "introspect the real shape"
 * approach the rest of the library uses (see ForgeData.listGenerators()), and
 * is what lets this module avoid importing `zod` as a runtime dependency at
 * all — only its types are imported (erased at compile time), so `zod` stays
 * an optional peer dependency exactly like `react` does for the /react entry.
 */
interface IntrospectableSchema {
  type: string;
  def: Record<string, unknown>;
  format?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  safeParse: (input: unknown) => { success: boolean; data?: unknown };
}

interface RawCheckDef {
  check?: string;
  value?: number;
  minimum?: number;
  maximum?: number;
  format?: string;
}

function asIntrospectable(schema: object): IntrospectableSchema {
  return schema as unknown as IntrospectableSchema;
}

/**
 * The convenience getters Zod v4 exposes for constraints (`.minLength`,
 * `.maxValue`, etc.) turn out to be unreliable for some schema types and
 * chaining orders in practice (empirically: `z.array().min().max()` and
 * `z.number().min().max().int()` both silently ignore the constraint via the
 * getter). The raw `def.checks` entries are the reliable source of truth —
 * each check exposes its own kind/value one level down, at `_zod.def`.
 */
function scanCheckDefs(schema: IntrospectableSchema): RawCheckDef[] {
  const checks = (schema.def.checks as { _zod?: { def?: RawCheckDef } }[] | undefined) ?? [];
  return checks.map((c) => c._zod?.def).filter((d): d is RawCheckDef => d != null);
}

function getLengthBounds(schema: IntrospectableSchema): { min?: number; max?: number } {
  if (schema.minLength != null || schema.maxLength != null) {
    return { min: schema.minLength ?? undefined, max: schema.maxLength ?? undefined };
  }
  let min: number | undefined;
  let max: number | undefined;
  for (const def of scanCheckDefs(schema)) {
    if (def.check === "min_length" && typeof def.minimum === "number") min = def.minimum;
    if (def.check === "max_length" && typeof def.maximum === "number") max = def.maximum;
  }
  return { min, max };
}

function getNumberBounds(schema: IntrospectableSchema): { min?: number; max?: number; isInt: boolean } {
  let min: number | undefined;
  let max: number | undefined;
  let isInt = false;
  for (const def of scanCheckDefs(schema)) {
    if (def.check === "greater_than" && typeof def.value === "number") min = def.value;
    if (def.check === "less_than" && typeof def.value === "number") max = def.value;
    if (def.check === "number_format" && def.format?.includes("int")) isInt = true;
  }
  return { min, max, isInt };
}

function generateStructural(forge: ForgeData, schemaObj: object, depth: number): unknown {
  const schema = asIntrospectable(schemaObj);

  switch (schema.type) {
    case "string": {
      switch (schema.format) {
        case "email":
          return forge.internet.email();
        case "url":
          return forge.internet.url();
        case "uuid":
        case "guid":
          return forge.uuid();
        case "cuid":
        case "cuid2":
        case "ulid":
        case "nanoid":
        case "xid":
        case "ksuid":
          return forge.random.alphaNumeric(21, ID_CHARSET);
        case "datetime":
          return forge.date.recent().toISOString();
        case "date":
          return forge.date.recent().toISOString().slice(0, 10);
        case "time":
          return forge.date.recent().toISOString().slice(11, 19);
        case "ipv4":
          return forge.internet.ipv4();
        case "ipv6":
          return forge.internet.ipv6();
        case "emoji":
          return forge.misc.emoji();
        case "jwt":
          return forge.internet.jwt();
        case "e164":
          return forge.phone.number("+###########");
        default:
          break;
      }
      const { min, max } = getLengthBounds(schema);
      if (min != null || max != null) {
        const lo = min ?? 3;
        const hi = Math.max(max ?? lo + 10, lo);
        return forge.random.alphaNumeric(forge.random.int(lo, hi));
      }
      return forge.lorem.words(3);
    }

    case "number": {
      const { min, max, isInt } = getNumberBounds(schema);
      const lo = min ?? (max !== undefined ? max - 1000 : 0);
      const hi = max ?? (min !== undefined ? min + 1000 : lo + 1000);
      return isInt ? forge.random.int(Math.ceil(lo), Math.floor(hi)) : forge.random.float(lo, hi, 2);
    }

    case "bigint":
      return BigInt(forge.random.int(0, 1_000_000));

    case "boolean":
      return forge.random.boolean();

    case "date":
      return forge.date.recent(30);

    case "enum":
      return forge.random.enum(schema.def.entries as Record<string, string | number>);

    case "literal":
      return forge.random.arrayElement(schema.def.values as unknown[]);

    case "array": {
      const element = schema.def.element as object;
      const { min, max } = getLengthBounds(schema);
      const lo = min ?? 1;
      const hi = max ?? Math.max(lo, 3);
      const length = forge.random.int(lo, hi);
      return Array.from({ length }, () => generateStructural(forge, element, depth + 1));
    }

    case "tuple": {
      const items = schema.def.items as object[];
      return items.map((item) => generateStructural(forge, item, depth + 1));
    }

    case "object": {
      const shape = schema.def.shape as Record<string, object>;
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(shape)) {
        result[key] = generateStructural(forge, value, depth + 1);
      }
      return result;
    }

    case "record": {
      const valueType = schema.def.valueType as object;
      const count = forge.random.int(1, 4);
      const result: Record<string, unknown> = {};
      for (let i = 0; i < count; i++) {
        result[forge.lorem.word()] = generateStructural(forge, valueType, depth + 1);
      }
      return result;
    }

    case "set": {
      const valueType = schema.def.valueType as object;
      const count = forge.random.int(1, 4);
      const values = new Set<unknown>();
      for (let i = 0; i < count; i++) values.add(generateStructural(forge, valueType, depth + 1));
      return values;
    }

    case "map": {
      const keyType = schema.def.keyType as object;
      const valueType = schema.def.valueType as object;
      const count = forge.random.int(1, 4);
      const map = new Map<unknown, unknown>();
      for (let i = 0; i < count; i++) {
        map.set(generateStructural(forge, keyType, depth + 1), generateStructural(forge, valueType, depth + 1));
      }
      return map;
    }

    case "optional":
      return forge.random.boolean(0.8)
        ? generateStructural(forge, schema.def.innerType as object, depth)
        : undefined;

    case "nullable":
      return forge.random.boolean(0.9) ? generateStructural(forge, schema.def.innerType as object, depth) : null;

    case "default":
      return forge.random.boolean(0.7)
        ? generateStructural(forge, schema.def.innerType as object, depth)
        : undefined;

    case "catch":
    case "readonly":
      return generateStructural(forge, schema.def.innerType as object, depth);

    case "pipe":
      return generateStructural(forge, schema.def.in as object, depth);

    case "union": {
      const options = schema.def.options as object[];
      return generateStructural(forge, forge.random.arrayElement(options), depth + 1);
    }

    case "lazy": {
      if (depth >= MAX_LAZY_DEPTH) return undefined;
      const inner = (schema.def.getter as () => object)();
      return generateStructural(forge, inner, depth + 1);
    }

    case "any":
    case "unknown":
      return forge.lorem.word();

    case "undefined":
    case "void":
      return undefined;

    case "null":
      return null;

    case "never":
      throw new Error("fromZodSchema: cannot generate a value for z.never().");

    default:
      throw new Error(
        `fromZodSchema: unsupported Zod schema type "${schema.type}". Generate this field manually and merge it in.`,
      );
  }
}

/**
 * Generates a fake value matching a Zod v4 schema — primitives, objects,
 * arrays, tuples, unions, enums, records, maps/sets, and optional/nullable/
 * default wrappers, recursively.
 *
 * The structurally-generated candidate is run through the schema's own
 * `safeParse()` before being returned, so `.transform()`/`.pipe()` produce
 * their real (post-transform) shape rather than the pre-transform structure.
 *
 * Best-effort: arbitrary `.refine()` predicates aren't evaluated ahead of
 * time, so a generated value can occasionally fail one. When that happens
 * the raw structurally-generated value is returned rather than throwing —
 * still shape-correct, just not guaranteed to satisfy custom validation.
 *
 * @example
 * import { z } from "zod";
 * import { fromZodSchema } from "@sahinur/forgedata/zod";
 *
 * const UserSchema = z.object({
 *   name: z.string(),
 *   email: z.string().email(),
 *   age: z.number().int().min(18).max(99),
 * });
 *
 * const user = fromZodSchema(forge, UserSchema); // fully typed as z.infer<typeof UserSchema>
 */
export function fromZodSchema<T extends z.ZodType>(forge: ForgeData, schema: T): z.infer<T> {
  const candidate = generateStructural(forge, schema, 0);
  const result = asIntrospectable(schema).safeParse(candidate);
  return (result.success ? result.data : candidate) as z.infer<T>;
}
