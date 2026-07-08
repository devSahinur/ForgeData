import type { Random } from "../helpers/random.js";

const EMOJIS = ["😀", "😂", "😍", "🤔", "😎", "🚀", "🔥", "✨", "🎉", "👍", "❤️", "🙌", "💡", "🐛", "⚡"];
const PROGRAMMING_LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java", "C#", "C++",
  "Ruby", "Swift", "Kotlin", "PHP", "Elixir", "Haskell", "Scala",
];
const GITHUB_ADJECTIVES = ["swift", "brave", "quiet", "clever", "bold", "calm", "eager", "gentle"];
const GITHUB_NOUNS = ["falcon", "otter", "panda", "comet", "maple", "cipher", "ember", "harbor"];
const DOCKER_NAMESPACES = ["library", "bitnami", "myorg", "acme", "opensource"];
const DOCKER_IMAGES = ["nginx", "postgres", "redis", "node", "python", "alpine", "ubuntu", "mongo"];
const NPM_SCOPES = ["", "@acme/", "@myorg/", "@opensource/"];
const NPM_WORDS = ["fast", "tiny", "smart", "auto", "core", "utils", "kit", "toolbox"];
const MOVIES = ["The Great Escape", "Silent Horizon", "Beyond the Stars", "Midnight Protocol", "Echoes of Tomorrow"];
const BOOKS = ["The Silent Path", "Whispers of the Sea", "The Last Algorithm", "Shadows of Time", "A Quiet Revolution"];
const MUSIC_TRACKS = ["Midnight Drive", "Golden Hour", "Neon Dreams", "Ocean Static", "Paper Skies"];
const FOODS = ["Sushi", "Pizza", "Tacos", "Ramen", "Paella", "Biryani", "Croissant", "Dumplings", "Curry", "Pho"];
const HOLIDAYS = ["New Year's Day", "Independence Day", "Thanksgiving", "Diwali", "Eid al-Fitr", "Christmas", "Lunar New Year"];
const UNIVERSITIES = [
  "University of Oxford", "Harvard University", "Stanford University",
  "University of Tokyo", "ETH Zurich", "National University of Singapore",
  "University of Dhaka", "Indian Institute of Technology",
];

export class MiscModule {
  constructor(private random: Random) {}

  emoji(): string {
    return this.random.arrayElement(EMOJIS);
  }

  hashtag(): string {
    return `#${this.random.alphaNumeric(8, "abcdefghijklmnopqrstuvwxyz")}`;
  }

  programmingLanguage(): string {
    return this.random.arrayElement(PROGRAMMING_LANGUAGES);
  }

  githubUsername(): string {
    return `${this.random.arrayElement(GITHUB_ADJECTIVES)}-${this.random.arrayElement(GITHUB_NOUNS)}${this.random.int(1, 999)}`;
  }

  gitCommitHash(short = false): string {
    return this.random.hex(short ? 7 : 40);
  }

  semver(): string {
    return `${this.random.int(0, 5)}.${this.random.int(0, 20)}.${this.random.int(0, 20)}`;
  }

  dockerImageName(): string {
    const namespace = this.random.arrayElement(DOCKER_NAMESPACES);
    const image = this.random.arrayElement(DOCKER_IMAGES);
    const tag = this.random.arrayElement(["latest", "alpine", this.semver()]);
    return `${namespace}/${image}:${tag}`;
  }

  npmPackageName(): string {
    const scope = this.random.arrayElement(NPM_SCOPES);
    const word1 = this.random.arrayElement(NPM_WORDS);
    const word2 = this.random.arrayElement(NPM_WORDS);
    return `${scope}${word1}-${word2}`;
  }

  otp(length = 6): string {
    return this.random.alphaNumeric(length, "0123456789");
  }

  licenseKey(): string {
    const groups = Array.from({ length: 4 }, () =>
      this.random.alphaNumeric(4, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"),
    );
    return groups.join("-");
  }

  qrData(): string {
    return `https://forgedata.dev/qr/${this.random.alphaNumeric(12)}`;
  }

  movie(): string {
    return this.random.arrayElement(MOVIES);
  }

  book(): string {
    return this.random.arrayElement(BOOKS);
  }

  music(): string {
    return this.random.arrayElement(MUSIC_TRACKS);
  }

  food(): string {
    return this.random.arrayElement(FOODS);
  }

  holiday(): string {
    return this.random.arrayElement(HOLIDAYS);
  }

  university(): string {
    return this.random.arrayElement(UNIVERSITIES);
  }
}
