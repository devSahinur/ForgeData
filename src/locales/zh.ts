import type { LocaleData } from "./types.js";

export const zh: LocaleData = {
  code: "zh",
  name: "Chinese",
  person: {
    firstNamesMale: [
      "Wei", "Jun", "Hao", "Lei", "Yang", "Tao", "Ming", "Qiang",
      "Jian", "Peng", "Chao", "Bin", "Feng", "Long", "Gang", "Kai",
    ],
    firstNamesFemale: [
      "Li", "Na", "Fang", "Ying", "Yan", "Jing", "Hui", "Mei",
      "Xia", "Qing", "Xin", "Ping", "Yun", "Rui", "Lan", "Xue",
    ],
    lastNames: [
      "Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Huang", "Zhao",
      "Wu", "Zhou", "Xu", "Sun", "Ma", "Zhu", "Hu", "Guo",
    ],
    jobTitles: [
      "软件工程师", "项目经理", "教师", "医生", "工程师",
      "记者", "律师", "会计师", "银行家", "企业家",
    ],
    professions: [
      "农民", "医生", "教师", "工程师", "律师", "商人",
      "记者", "工匠", "司机", "警察",
    ],
  },
  location: {
    cities: [
      "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou",
      "Wuhan", "Xi'an", "Nanjing", "Chongqing",
    ],
    states: [
      "Guangdong", "Zhejiang", "Jiangsu", "Sichuan", "Hubei", "Shaanxi",
    ],
    countries: ["China", "Taiwan", "Hong Kong", "Singapore", "Japan", "South Korea"],
  },
  company: {
    suffixes: ["有限公司", "集团", "科技", "股份公司", "控股"],
    catchPhraseAdjectives: ["创新的", "动态的", "可靠的", "现代的", "可持续的"],
    catchPhraseNouns: ["解决方案", "技术", "网络", "基础设施", "服务"],
  },
  lorem: {
    words: [
      "光", "水", "土", "天空", "风", "河流", "山", "海", "树", "花",
      "鸟", "人", "时间", "梦想", "爱", "生命", "真理", "和平", "喜悦", "言语",
    ],
  },
};
