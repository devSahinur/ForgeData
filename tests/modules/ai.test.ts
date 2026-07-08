import { describe, expect, it } from "vitest";
import { Random } from "../../src/helpers/random.js";
import { LocaleRegistry } from "../../src/locales/index.js";
import { LoremModule } from "../../src/lorem/index.js";
import { AiModule } from "../../src/ai/index.js";

function makeAi(seed: number | string = 1) {
  const random = new Random(seed);
  const lorem = new LoremModule(random, new LocaleRegistry("en"));
  return new AiModule(random, lorem);
}

describe("AiModule", () => {
  it("prompt() fills in a topic", () => {
    const ai = makeAi();
    expect(ai.prompt().length).toBeGreaterThan(0);
  });

  it("chatConversation() alternates user/assistant roles, with default and custom turn counts", () => {
    const ai = makeAi();
    const turns = ai.chatConversation(4);
    expect(turns[0]?.role).toBe("user");
    expect(turns[1]?.role).toBe("assistant");
    expect(ai.chatConversation()).toHaveLength(4);
  });

  it("codeSnippet() and sqlQuery() return non-empty strings", () => {
    const ai = makeAi();
    expect(ai.codeSnippet().length).toBeGreaterThan(0);
    expect(ai.sqlQuery()).toMatch(/^SELECT/);
  });

  it("json() produces parseable JSON", () => {
    const ai = makeAi();
    expect(() => JSON.parse(ai.json())).not.toThrow();
  });

  it("markdown() delegates to lorem.markdown()", () => {
    const ai = makeAi();
    expect(ai.markdown()).toContain("# ");
  });

  it("apiResponse() covers both success and error status branches", () => {
    const ai = makeAi(7);
    const responses = Array.from({ length: 100 }, () => ai.apiResponse());
    expect(responses.some((r) => r.status < 300)).toBe(true);
    expect(responses.some((r) => r.status >= 300)).toBe(true);
    for (const r of responses) expect(r).toHaveProperty("body");
  });

  it("logLine()/commitMessage()/issueTitle()/prDescription() return non-empty strings", () => {
    const ai = makeAi();
    expect(ai.logLine()).toMatch(/^\[.+\] (INFO|WARN|ERROR|DEBUG) /);
    expect(ai.commitMessage()).toMatch(/^(feat|fix|chore|refactor|docs|test|perf): /);
    expect(ai.issueTitle().length).toBeGreaterThan(0);
    expect(ai.prDescription()).toContain("## Summary");
  });
});
