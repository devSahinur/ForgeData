// Run after `npm run build`: node examples/custom-generator.mjs
import { ForgeData } from "../dist/index.js";

const forge = new ForgeData({ seed: "pokemon-demo" });

const POKEMON = ["Pikachu", "Bulbasaur", "Charmander", "Squirtle", "Eevee", "Snorlax"];

forge.define("pokemon", (f) => f.pick(POKEMON));
forge.define("trainerCard", (f) => ({
  trainer: f.person.fullName(),
  pokemon: f.custom.pokemon(),
  level: f.random.int(1, 100),
}));

console.log(forge.custom.trainerCard());
