import type { LocaleData } from "./types.js";

export const fr: LocaleData = {
  code: "fr",
  name: "French",
  person: {
    firstNamesMale: [
      "Lucas", "Gabriel", "Louis", "Arthur", "Hugo", "Jules", "Adam", "Raphael",
      "Leo", "Nathan", "Antoine", "Julien", "Nicolas", "Thomas", "Mathieu", "Pierre",
    ],
    firstNamesFemale: [
      "Emma", "Jade", "Louise", "Alice", "Chloe", "Lina", "Rose", "Anna",
      "Camille", "Manon", "Sarah", "Julie", "Claire", "Charlotte", "Margaux", "Ines",
    ],
    lastNames: [
      "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit",
      "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
    ],
    jobTitles: [
      "Ingenieur Logiciel", "Chef de Projet", "Enseignant", "Medecin", "Ingenieur",
      "Journaliste", "Avocat", "Comptable", "Banquier", "Entrepreneur",
    ],
    professions: [
      "Agriculteur", "Medecin", "Enseignant", "Ingenieur", "Avocat", "Commercant",
      "Journaliste", "Artisan", "Chauffeur", "Policier",
    ],
  },
  location: {
    cities: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg",
      "Montpellier", "Bordeaux", "Lille",
    ],
    states: [
      "Ile-de-France", "Provence-Alpes-Cote d'Azur", "Auvergne-Rhone-Alpes",
      "Occitanie", "Nouvelle-Aquitaine", "Hauts-de-France",
    ],
    countries: ["France", "Belgium", "Switzerland", "Canada", "Luxembourg", "Monaco"],
  },
  company: {
    suffixes: ["SA", "SARL", "Groupe", "et Fils", "Industries"],
    catchPhraseAdjectives: ["Innovant", "Dynamique", "Fiable", "Moderne", "Durable"],
    catchPhraseNouns: ["solutions", "technologie", "reseau", "infrastructure", "service"],
  },
  lorem: {
    words: [
      "lumiere", "eau", "terre", "ciel", "vent", "riviere", "montagne", "mer",
      "arbre", "fleur", "oiseau", "humain", "temps", "reve", "amour", "vie",
      "verite", "paix", "joie", "parole",
    ],
  },
};
