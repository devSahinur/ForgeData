import type { LocaleData } from "./types.js";

export const ja: LocaleData = {
  code: "ja",
  name: "Japanese",
  person: {
    firstNamesMale: [
      "Haruto", "Yuto", "Sota", "Yuma", "Ren", "Riku", "Sora", "Kaito",
      "Hayato", "Daiki", "Takumi", "Kenta", "Shota", "Yusuke", "Ryo", "Kazuki",
    ],
    firstNamesFemale: [
      "Yui", "Aoi", "Yuna", "Hina", "Sakura", "Mio", "Rin", "Riko",
      "Akari", "Koharu", "Mei", "Ichika", "Nanami", "Yuzuki", "Ayaka", "Kokoro",
    ],
    lastNames: [
      "Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto",
      "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi",
    ],
    jobTitles: [
      "ソフトウェアエンジニア", "マネージャー", "教師", "医師", "エンジニア",
      "ジャーナリスト", "弁護士", "会計士", "銀行員", "実業家",
    ],
    professions: [
      "農家", "医師", "教師", "エンジニア", "弁護士", "商人", "ジャーナリスト",
      "職人", "運転手", "警察官",
    ],
  },
  location: {
    cities: [
      "Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Fukuoka",
      "Kobe", "Sendai", "Hiroshima",
    ],
    states: [
      "Tokyo Metropolis", "Osaka Prefecture", "Kyoto Prefecture",
      "Kanagawa Prefecture", "Aichi Prefecture", "Hokkaido",
    ],
    countries: ["Japan", "South Korea", "China", "Taiwan", "Vietnam", "Thailand"],
  },
  company: {
    suffixes: ["株式会社", "商事", "グループ", "工業", "ホールディングス"],
    catchPhraseAdjectives: ["革新的な", "動的な", "信頼できる", "最新の", "持続可能な"],
    catchPhraseNouns: ["ソリューション", "テクノロジー", "ネットワーク", "基盤", "サービス"],
  },
  lorem: {
    words: [
      "光", "水", "土", "空", "風", "川", "山", "海", "木", "花", "鳥", "人",
      "時間", "夢", "愛", "命", "真実", "平和", "喜び", "言葉",
    ],
  },
};
