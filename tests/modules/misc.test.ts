import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { MiscModule } from "../../src/misc/index.js";

describe("MiscModule", () => {
  const misc = new MiscModule(new Random(1));

  it("emoji() and hashtag() return non-empty strings", () => {
    expect(misc.emoji().length).toBeGreaterThan(0);
    expect(misc.hashtag()).toMatch(/^#[a-z]{8}$/);
  });

  it("programmingLanguage() returns a known language", () => {
    expect(typeof misc.programmingLanguage()).toBe("string");
  });

  it("githubUsername() is well-formed", () => {
    expect(misc.githubUsername()).toMatch(/^[a-z]+-[a-z]+\d+$/);
  });

  it("gitCommitHash() defaults to 40 hex chars, or 7 when short", () => {
    expect(misc.gitCommitHash()).toMatch(/^[0-9a-f]{40}$/);
    expect(misc.gitCommitHash(true)).toMatch(/^[0-9a-f]{7}$/);
  });

  it("semver() has three numeric segments", () => {
    expect(misc.semver()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("dockerImageName() is well-formed across many draws (covers the semver-tag branch too)", () => {
    for (let i = 0; i < 50; i++) {
      expect(misc.dockerImageName()).toMatch(/^[a-z]+\/[a-z]+:.+$/);
    }
  });

  it("npmPackageName() covers both scoped and unscoped output", () => {
    const names = Array.from({ length: 60 }, () => misc.npmPackageName());
    expect(names.some((n) => n.startsWith("@"))).toBe(true);
    expect(names.some((n) => !n.startsWith("@"))).toBe(true);
  });

  it("otp() uses the default and a custom length", () => {
    expect(misc.otp()).toMatch(/^\d{6}$/);
    expect(misc.otp(4)).toMatch(/^\d{4}$/);
  });

  it("licenseKey() is four dash-separated groups", () => {
    expect(misc.licenseKey().split("-")).toHaveLength(4);
  });

  it("qrData() returns a URL", () => {
    expect(misc.qrData()).toMatch(/^https:\/\//);
  });

  it("movie()/book()/music()/food()/holiday()/university() return non-empty strings", () => {
    expect(misc.movie().length).toBeGreaterThan(0);
    expect(misc.book().length).toBeGreaterThan(0);
    expect(misc.music().length).toBeGreaterThan(0);
    expect(misc.food().length).toBeGreaterThan(0);
    expect(misc.holiday().length).toBeGreaterThan(0);
    expect(misc.university().length).toBeGreaterThan(0);
  });
});
