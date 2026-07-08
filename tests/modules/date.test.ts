import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { DateModule } from "../../src/date/index.js";

describe("DateModule", () => {
  const date = new DateModule(new Random(1));

  it("past() returns a date before the reference date, with and without an explicit refDate", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(date.past(5, now).getTime()).toBeLessThanOrEqual(now.getTime());
    expect(date.past().getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("future() returns a date after the reference date, with and without an explicit refDate", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(date.future(5, now).getTime()).toBeGreaterThanOrEqual(now.getTime());
    expect(date.future().getTime()).toBeGreaterThanOrEqual(Date.now());
  });

  it("recent() returns a date within the last N days", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const recent = date.recent(3, now);
    expect(recent.getTime()).toBeLessThanOrEqual(now.getTime());
    expect(recent.getTime()).toBeGreaterThanOrEqual(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  });

  it("birthdate() respects the age bounds, with defaults and explicit args", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const dob = date.birthdate(18, 65, now);
    const age = (now.getTime() - dob.getTime()) / (365 * 24 * 60 * 60 * 1000);
    expect(age).toBeGreaterThanOrEqual(18);
    expect(age).toBeLessThanOrEqual(65);
    expect(date.birthdate() instanceof Date).toBe(true);
  });

  it("month() and weekday() return known values", () => {
    expect(typeof date.month()).toBe("string");
    expect(typeof date.weekday()).toBe("string");
  });

  it("between() returns a date within the given range", () => {
    const start = new Date("2020-01-01");
    const end = new Date("2020-12-31");
    const value = date.between(start, end);
    expect(value.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(value.getTime()).toBeLessThanOrEqual(end.getTime());
  });
});
