import type { Random } from "../helpers/random.js";
import type { LoremModule } from "../lorem/index.js";

const PROMPT_TEMPLATES = [
  "Explain {topic} to a beginner in simple terms.",
  "Write a short story about {topic}.",
  "Summarize the key ideas behind {topic}.",
  "Compare {topic} with a similar concept and highlight the differences.",
  "Generate five creative use cases for {topic}.",
];
const TOPICS = [
  "quantum computing", "climate change", "machine learning", "the stock market",
  "ancient Rome", "black holes", "renewable energy", "blockchain technology",
];

const LOG_LEVELS = ["INFO", "WARN", "ERROR", "DEBUG"];
const LOG_MESSAGES = [
  "Request completed successfully", "Connection timed out", "Cache miss for key",
  "Retrying operation", "Failed to parse response", "Rate limit exceeded",
  "Background job finished", "Database connection established",
];

const COMMIT_TYPES = ["feat", "fix", "chore", "refactor", "docs", "test", "perf"];
const COMMIT_SUBJECTS = [
  "add input validation", "resolve race condition in worker pool",
  "improve error messages", "update dependencies", "simplify config loader",
  "fix flaky test", "optimize database query", "add missing types",
];

const ISSUE_TITLES = [
  "Unexpected crash when loading large files",
  "Add support for dark mode",
  "Improve performance of the search index",
  "Memory leak in the background sync worker",
  "CLI flag --verbose is ignored",
  "Add TypeScript types for the public API",
];

const HTTP_STATUS: Record<number, string> = {
  200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request",
  401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error",
};

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  body: unknown;
}

export class AiModule {
  constructor(
    private random: Random,
    private lorem: LoremModule,
  ) {}

  prompt(): string {
    const template = this.random.arrayElement(PROMPT_TEMPLATES);
    return template.replace("{topic}", this.random.arrayElement(TOPICS));
  }

  chatConversation(turns = 4): ChatTurn[] {
    return Array.from({ length: turns }, (_, i) => ({
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: i % 2 === 0 ? this.prompt() : this.lorem.paragraph(2),
    }));
  }

  codeSnippet(): string {
    const fn = this.random.alphaNumeric(6, "abcdefghijklmnopqrstuvwxyz");
    return [
      `function ${fn}(input) {`,
      `  if (!input) throw new Error("input is required");`,
      `  return input.map((item) => item * 2).filter(Boolean);`,
      `}`,
    ].join("\n");
  }

  sqlQuery(): string {
    const table = this.random.arrayElement(["users", "orders", "products", "sessions"]);
    const column = this.random.arrayElement(["id", "created_at", "status", "email"]);
    return `SELECT * FROM ${table} WHERE ${column} = '${this.random.alphaNumeric(8)}' ORDER BY created_at DESC LIMIT 10;`;
  }

  json(): string {
    return JSON.stringify(
      {
        id: this.random.int(1, 100000),
        name: this.lorem.words(2),
        active: this.random.boolean(),
        tags: this.lorem.words(3).split(" "),
      },
      null,
      2,
    );
  }

  markdown(): string {
    return this.lorem.markdown();
  }

  apiResponse(): ApiResponse {
    const status = this.random.arrayElement(Object.keys(HTTP_STATUS).map(Number));
    return {
      status,
      statusText: HTTP_STATUS[status] as string,
      body: status < 300 ? { data: { id: this.random.int(1, 1000) } } : { error: this.lorem.sentence() },
    };
  }

  logLine(): string {
    const timestamp = new Date(Date.now() - this.random.int(0, 86_400_000)).toISOString();
    const level = this.random.arrayElement(LOG_LEVELS);
    const message = this.random.arrayElement(LOG_MESSAGES);
    return `[${timestamp}] ${level} ${message}`;
  }

  commitMessage(): string {
    const type = this.random.arrayElement(COMMIT_TYPES);
    const subject = this.random.arrayElement(COMMIT_SUBJECTS);
    return `${type}: ${subject}`;
  }

  issueTitle(): string {
    return this.random.arrayElement(ISSUE_TITLES);
  }

  prDescription(): string {
    return [
      `## Summary`,
      `- ${this.lorem.sentence()}`,
      `- ${this.lorem.sentence()}`,
      ``,
      `## Test plan`,
      `- [ ] ${this.lorem.sentence(6)}`,
      `- [ ] ${this.lorem.sentence(6)}`,
    ].join("\n");
  }
}
