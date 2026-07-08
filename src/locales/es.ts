import type { LocaleData } from "./types.js";

export const es: LocaleData = {
  code: "es",
  name: "Spanish",
  person: {
    firstNamesMale: [
      "Santiago", "Mateo", "Sebastian", "Leonardo", "Diego", "Daniel", "Alejandro",
      "Samuel", "Martin", "Emiliano", "Angel", "Javier", "Miguel", "Carlos", "Jose",
    ],
    firstNamesFemale: [
      "Sofia", "Valentina", "Isabella", "Camila", "Valeria", "Mariana", "Victoria",
      "Ximena", "Regina", "Renata", "Elena", "Lucia", "Paula", "Andrea", "Carmen",
    ],
    lastNames: [
      "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
      "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz",
    ],
    jobTitles: [
      "Ingeniero de Software", "Gerente de Proyecto", "Profesor", "Medico",
      "Ingeniero", "Periodista", "Abogado", "Contador", "Banquero", "Empresario",
    ],
    professions: [
      "Agricultor", "Medico", "Profesor", "Ingeniero", "Abogado", "Comerciante",
      "Periodista", "Artesano", "Conductor", "Policia",
    ],
  },
  location: {
    cities: [
      "Madrid", "Barcelona", "Valencia", "Sevilla", "Mexico City", "Bogota",
      "Buenos Aires", "Lima", "Santiago", "Guadalajara",
    ],
    states: [
      "Madrid", "Catalonia", "Andalusia", "Jalisco", "Buenos Aires Province",
      "Cundinamarca",
    ],
    countries: [
      "Spain", "Mexico", "Argentina", "Colombia", "Peru", "Chile",
      "Venezuela", "Ecuador", "Guatemala", "Uruguay",
    ],
  },
  company: {
    suffixes: ["S.A.", "S.L.", "Grupo", "Hermanos", "Industrias"],
    catchPhraseAdjectives: ["Innovador", "Dinamico", "Confiable", "Moderno", "Sostenible"],
    catchPhraseNouns: ["soluciones", "tecnologia", "red", "infraestructura", "servicio"],
  },
  lorem: {
    words: [
      "luz", "agua", "tierra", "cielo", "viento", "rio", "montana", "mar",
      "arbol", "flor", "pajaro", "humano", "tiempo", "sueno", "amor", "vida",
      "verdad", "paz", "alegria", "palabra",
    ],
  },
};
