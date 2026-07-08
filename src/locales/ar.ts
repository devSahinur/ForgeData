import type { LocaleData } from "./types.js";

export const ar: LocaleData = {
  code: "ar",
  name: "Arabic",
  person: {
    firstNamesMale: [
      "Ahmed", "Mohammed", "Ali", "Omar", "Khalid", "Youssef", "Hassan", "Hussein",
      "Ibrahim", "Tariq", "Sami", "Fahad", "Karim", "Adel", "Nabil", "Waleed",
    ],
    firstNamesFemale: [
      "Fatima", "Aisha", "Maryam", "Zainab", "Layla", "Noor", "Huda", "Salma",
      "Amina", "Rania", "Yasmin", "Dalia", "Hana", "Reem", "Sara", "Lina",
    ],
    lastNames: [
      "Al-Sayed", "Al-Amin", "Hassan", "Hussein", "Abdullah", "Mahmoud",
      "Ibrahim", "Khalil", "Mansour", "Nasser", "Saleh", "Farouk", "Aziz",
    ],
    jobTitles: [
      "مهندس برمجيات", "مدير", "معلم", "طبيب", "مهندس", "صحفي", "محامٍ",
      "محاسب", "مصرفي", "رجل أعمال",
    ],
    professions: [
      "مزارع", "طبيب", "معلم", "مهندس", "محامٍ", "تاجر", "صحفي", "حرفي",
      "سائق", "شرطي",
    ],
  },
  location: {
    cities: [
      "Cairo", "Dubai", "Riyadh", "Doha", "Amman", "Beirut", "Baghdad",
      "Casablanca", "Tunis", "Muscat",
    ],
    states: [
      "Cairo Governorate", "Dubai Emirate", "Riyadh Province", "Doha Municipality",
      "Amman Governorate", "Beirut Governorate",
    ],
    countries: [
      "Egypt", "United Arab Emirates", "Saudi Arabia", "Qatar", "Jordan",
      "Lebanon", "Iraq", "Morocco", "Tunisia", "Oman",
    ],
  },
  company: {
    suffixes: ["Group", "Holding", "Trading", "Est", "Corporation"],
    catchPhraseAdjectives: ["مبتكر", "ديناميكي", "موثوق", "حديث", "مستدام"],
    catchPhraseNouns: ["حلول", "تقنية", "شبكة", "بنية", "خدمة"],
  },
  lorem: {
    words: [
      "نور", "ماء", "تراب", "سماء", "هواء", "نهر", "جبل", "بحر", "شجرة",
      "زهرة", "طائر", "إنسان", "وقت", "حلم", "حب", "حياة", "حقيقة", "سلام",
      "فرح", "كلام",
    ],
  },
};
