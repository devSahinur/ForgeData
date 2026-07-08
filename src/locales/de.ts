import type { LocaleData } from "./types.js";

export const de: LocaleData = {
  code: "de",
  name: "German",
  person: {
    firstNamesMale: [
      "Ben", "Paul", "Leon", "Finn", "Noah", "Elias", "Felix", "Jonas",
      "Luca", "Maximilian", "Julian", "David", "Tim", "Niklas", "Simon", "Jan",
    ],
    firstNamesFemale: [
      "Emma", "Mia", "Hannah", "Emilia", "Sofia", "Anna", "Lea", "Lena",
      "Marie", "Lina", "Laura", "Sarah", "Julia", "Nina", "Clara", "Frieda",
    ],
    lastNames: [
      "Muller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner",
      "Becker", "Schulz", "Hoffmann", "Koch", "Bauer", "Richter", "Klein",
    ],
    jobTitles: [
      "Softwareingenieur", "Projektleiter", "Lehrer", "Arzt", "Ingenieur",
      "Journalist", "Anwalt", "Buchhalter", "Bankkaufmann", "Unternehmer",
    ],
    professions: [
      "Landwirt", "Arzt", "Lehrer", "Ingenieur", "Anwalt", "Kaufmann",
      "Journalist", "Handwerker", "Fahrer", "Polizist",
    ],
  },
  location: {
    cities: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
      "Dusseldorf", "Leipzig", "Dortmund", "Essen",
    ],
    states: [
      "Bavaria", "North Rhine-Westphalia", "Baden-Wurttemberg", "Lower Saxony",
      "Hesse", "Saxony",
    ],
    countries: ["Germany", "Austria", "Switzerland", "Netherlands", "Poland", "Denmark"],
  },
  company: {
    suffixes: ["GmbH", "AG", "KG", "Gruppe", "Holding"],
    catchPhraseAdjectives: ["Innovativ", "Dynamisch", "Zuverlassig", "Modern", "Nachhaltig"],
    catchPhraseNouns: ["Losungen", "Technologie", "Netzwerk", "Infrastruktur", "Dienstleistung"],
  },
  lorem: {
    words: [
      "Licht", "Wasser", "Erde", "Himmel", "Wind", "Fluss", "Berg", "Meer",
      "Baum", "Blume", "Vogel", "Mensch", "Zeit", "Traum", "Liebe", "Leben",
      "Wahrheit", "Frieden", "Freude", "Wort",
    ],
  },
};
