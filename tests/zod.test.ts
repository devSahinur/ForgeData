import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ForgeData } from "../src/ForgeData.js";
import { fromZodSchema } from "../src/zod/index.js";

const forge = new ForgeData({ seed: 1 });

describe("fromZodSchema: string formats", () => {
  it("email", () => expect(fromZodSchema(forge, z.string().email())).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
  it("url", () => expect(fromZodSchema(forge, z.string().url())).toMatch(/^https?:\/\//));
  it("uuid", () => expect(fromZodSchema(forge, z.string().uuid())).toMatch(/^[0-9a-f-]{36}$/));
  it("guid", () => expect(fromZodSchema(forge, z.guid())).toMatch(/^[0-9a-f-]{36}$/));
  it("cuid-family (cuid/cuid2/ulid/nanoid)", () => {
    for (const schema of [z.cuid(), z.cuid2(), z.ulid(), z.nanoid()]) {
      expect(fromZodSchema(forge, schema)).toMatch(/^[a-z0-9]{21}$/);
    }
  });
  it("datetime", () => expect(() => new Date(fromZodSchema(forge, z.string().datetime()) as string)).not.toThrow());
  it("date", () => expect(fromZodSchema(forge, z.string().date())).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  it("time", () => expect(fromZodSchema(forge, z.string().time())).toMatch(/^\d{2}:\d{2}:\d{2}$/));
  it("ipv4", () => expect(fromZodSchema(forge, z.string().ipv4()).split(".")).toHaveLength(4));
  it("ipv6", () => expect(fromZodSchema(forge, z.string().ipv6()).split(":")).toHaveLength(8));
  it("emoji", () => expect(fromZodSchema(forge, z.string().emoji()).length).toBeGreaterThan(0));
  it("jwt", () => expect(fromZodSchema(forge, z.jwt()).split(".")).toHaveLength(3));
  it("e164", () => expect(fromZodSchema(forge, z.e164()).length).toBeGreaterThan(0));

  it("plain string with no format falls back to lorem words", () => {
    const value = fromZodSchema(forge, z.string());
    expect(typeof value).toBe("string");
    expect((value as string).length).toBeGreaterThan(0);
  });

  it("respects min/max length", () => {
    for (let i = 0; i < 20; i++) {
      const value = fromZodSchema(forge, z.string().min(5).max(12)) as string;
      expect(value.length).toBeGreaterThanOrEqual(5);
      expect(value.length).toBeLessThanOrEqual(12);
    }
  });

  it("respects a min() with no max()", () => {
    const value = fromZodSchema(forge, z.string().min(8)) as string;
    expect(value.length).toBeGreaterThanOrEqual(8);
  });

  it("respects a max() with no min()", () => {
    const value = fromZodSchema(forge, z.string().max(4)) as string;
    expect(value.length).toBeLessThanOrEqual(4);
  });

  it("respects an exact length()", () => {
    expect((fromZodSchema(forge, z.string().length(5)) as string)).toHaveLength(5);
  });
});

describe("fromZodSchema: number", () => {
  it("unconstrained defaults to a sane finite range", () => {
    const value = fromZodSchema(forge, z.number()) as number;
    expect(Number.isFinite(value)).toBe(true);
  });

  it("int() with min/max stays in range and is an integer", () => {
    for (let i = 0; i < 20; i++) {
      const value = fromZodSchema(forge, z.number().int().min(1).max(10)) as number;
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it("float (non-int) with only a min stays above it", () => {
    const value = fromZodSchema(forge, z.number().min(100)) as number;
    expect(value).toBeGreaterThanOrEqual(100);
  });

  it("float with only a max stays below it", () => {
    const value = fromZodSchema(forge, z.number().max(-100)) as number;
    expect(value).toBeLessThanOrEqual(-100);
  });
});

describe("fromZodSchema: other primitives", () => {
  it("bigint", () => expect(typeof fromZodSchema(forge, z.bigint())).toBe("bigint"));
  it("boolean", () => expect(typeof fromZodSchema(forge, z.boolean())).toBe("boolean"));
  it("date", () => expect(fromZodSchema(forge, z.date())).toBeInstanceOf(Date));
  it("null", () => expect(fromZodSchema(forge, z.null())).toBeNull());
  it("undefined / void", () => {
    expect(fromZodSchema(forge, z.undefined())).toBeUndefined();
    expect(fromZodSchema(forge, z.void())).toBeUndefined();
  });
  it("any / unknown", () => {
    expect(typeof fromZodSchema(forge, z.any())).toBe("string");
    expect(typeof fromZodSchema(forge, z.unknown())).toBe("string");
  });
  it("never throws", () => {
    expect(() => fromZodSchema(forge, z.never())).toThrow(/z\.never\(\)/);
  });
  it("an unsupported real Zod type throws a clear error", () => {
    expect(() => fromZodSchema(forge, z.symbol())).toThrow(/unsupported Zod schema type "symbol"/);
  });
});

describe("fromZodSchema: enums and literals", () => {
  it("array-based enum", () => {
    const value = fromZodSchema(forge, z.enum(["a", "b", "c"]));
    expect(["a", "b", "c"]).toContain(value);
  });

  it("nativeEnum with a real compiled reverse-mapped numeric enum", () => {
    enum Suit {
      Hearts,
      Spades,
      Clubs,
      Diamonds,
    }
    for (let i = 0; i < 20; i++) {
      const value = fromZodSchema(forge, z.nativeEnum(Suit));
      expect([Suit.Hearts, Suit.Spades, Suit.Clubs, Suit.Diamonds]).toContain(value);
    }
  });

  it("literal", () => expect(fromZodSchema(forge, z.literal("fixed"))).toBe("fixed"));
});

describe("fromZodSchema: collections", () => {
  it("array respects min/max", () => {
    for (let i = 0; i < 20; i++) {
      const value = fromZodSchema(forge, z.array(z.string()).min(2).max(4)) as unknown[];
      expect(value.length).toBeGreaterThanOrEqual(2);
      expect(value.length).toBeLessThanOrEqual(4);
    }
  });

  it("unconstrained array uses sane defaults", () => {
    const value = fromZodSchema(forge, z.array(z.number())) as unknown[];
    expect(value.length).toBeGreaterThanOrEqual(1);
  });

  it("tuple generates one value per position, matching each type", () => {
    const value = fromZodSchema(forge, z.tuple([z.string(), z.number(), z.boolean()])) as unknown[];
    expect(typeof value[0]).toBe("string");
    expect(typeof value[1]).toBe("number");
    expect(typeof value[2]).toBe("boolean");
  });

  it("object generates every key", () => {
    const value = fromZodSchema(
      forge,
      z.object({ name: z.string(), age: z.number() }),
    ) as { name: string; age: number };
    expect(typeof value.name).toBe("string");
    expect(typeof value.age).toBe("number");
  });

  it("record generates a plain object of the value type", () => {
    const value = fromZodSchema(forge, z.record(z.string(), z.number())) as Record<string, number>;
    expect(Object.keys(value).length).toBeGreaterThan(0);
    for (const v of Object.values(value)) expect(typeof v).toBe("number");
  });

  it("set generates a Set of the value type", () => {
    const value = fromZodSchema(forge, z.set(z.string())) as Set<string>;
    expect(value).toBeInstanceOf(Set);
    expect(value.size).toBeGreaterThan(0);
  });

  it("map generates a Map of key/value types", () => {
    const value = fromZodSchema(forge, z.map(z.string(), z.number())) as Map<string, number>;
    expect(value).toBeInstanceOf(Map);
    expect(value.size).toBeGreaterThan(0);
  });
});

describe("fromZodSchema: wrappers", () => {
  it("optional() produces both present and absent values", () => {
    const values = Array.from({ length: 60 }, () => fromZodSchema(forge, z.string().optional()));
    expect(values.some((v) => v === undefined)).toBe(true);
    expect(values.some((v) => typeof v === "string")).toBe(true);
  });

  it("nullable() produces both present and null values", () => {
    const values = Array.from({ length: 60 }, () => fromZodSchema(forge, z.string().nullable()));
    expect(values.some((v) => v === null)).toBe(true);
    expect(values.some((v) => typeof v === "string")).toBe(true);
  });

  it("default() sometimes yields the default, sometimes a fresh value", () => {
    const values = Array.from({ length: 60 }, () => fromZodSchema(forge, z.string().default("fallback")));
    expect(values.some((v) => v === "fallback")).toBe(true);
    expect(values.some((v) => typeof v === "string" && v !== "fallback")).toBe(true);
  });

  it("catch() always yields a valid inner value", () => {
    expect(typeof fromZodSchema(forge, z.string().catch("fallback"))).toBe("string");
  });

  it("readonly()", () => {
    expect(typeof fromZodSchema(forge, z.string().readonly())).toBe("string");
  });

  it("brand() is transparent to generation", () => {
    expect(typeof fromZodSchema(forge, z.string().brand("UserId"))).toBe("string");
  });
});

describe("fromZodSchema: union", () => {
  it("regular union picks one of the member types", () => {
    for (let i = 0; i < 20; i++) {
      const value = fromZodSchema(forge, z.union([z.string(), z.number()]));
      expect(["string", "number"]).toContain(typeof value);
    }
  });

  it("discriminated union produces an internally-consistent variant", () => {
    const Shape = z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("circle"), radius: z.number() }),
      z.object({ kind: z.literal("square"), side: z.number() }),
    ]);
    for (let i = 0; i < 10; i++) {
      const value = fromZodSchema(forge, Shape) as { kind: string; radius?: number; side?: number };
      if (value.kind === "circle") expect(typeof value.radius).toBe("number");
      else expect(typeof value.side).toBe("number");
    }
  });
});

describe("fromZodSchema: lazy/recursive schemas", () => {
  it("recurses up to the depth cap and then stops instead of overflowing the stack", () => {
    // Unconditional (non-optional) recursive array: every level generates at
    // least one child, so depth grows deterministically instead of depending
    // on the optional/nullable coin-flip terminating early. A schema with no
    // concrete base case at all (e.g. `const Rec = z.lazy(() => Rec)`) would
    // make even Zod's own validator recurse forever, so this needs a real
    // object at each level for `safeParse` to bottom out on, same as any
    // realistic recursive schema (e.g. a comment/reply tree) would have.
    interface Node {
      children: Node[];
    }
    const NodeSchema: z.ZodType<Node> = z.lazy(() =>
      z.object({
        children: z.array(NodeSchema),
      }),
    );
    expect(() => fromZodSchema(forge, NodeSchema)).not.toThrow();
  });

  it("generates through a realistic recursive tree shape", () => {
    interface Comment {
      text: string;
      replies?: Comment[];
    }
    const CommentSchema: z.ZodType<Comment> = z.lazy(() =>
      z.object({
        text: z.string(),
        replies: z.array(CommentSchema).optional(),
      }),
    );
    const value = fromZodSchema(forge, CommentSchema) as Comment;
    expect(typeof value.text).toBe("string");
  });
});

describe("fromZodSchema: transform/pipe and refine fallback", () => {
  it("pipe()/transform() runs the real transform via safeParse", () => {
    const YesNo = z.enum(["yes", "no"]).transform((v) => v === "yes");
    for (let i = 0; i < 10; i++) {
      expect(typeof fromZodSchema(forge, YesNo)).toBe("boolean");
    }
  });

  it("falls back to the raw structural value when a custom refine() always fails", () => {
    const AlwaysInvalid = z.string().refine(() => false, "always invalid");
    const value = fromZodSchema(forge, AlwaysInvalid);
    expect(typeof value).toBe("string");
  });
});

describe("fromZodSchema: end-to-end realistic schema", () => {
  it("generates a fully-typed object matching a realistic user schema", () => {
    const UserSchema = z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      age: z.number().int().min(18).max(99),
      role: z.enum(["admin", "user", "guest"]),
      tags: z.array(z.string()).min(1).max(3),
    });

    const user = fromZodSchema(forge, UserSchema);
    expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(user.email).toMatch(/@/);
    expect(user.age).toBeGreaterThanOrEqual(18);
    expect(user.age).toBeLessThanOrEqual(99);
    expect(["admin", "user", "guest"]).toContain(user.role);
    expect(user.tags.length).toBeGreaterThanOrEqual(1);
  });
});
