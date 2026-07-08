// Run after `npm run build`: node examples/node-esm.mjs
import { ForgeData } from "../dist/index.js";

const forge = new ForgeData({ seed: 42 });

console.log("Name:", forge.person.fullName());
console.log("Email:", forge.internet.email());
console.log("Company:", forge.company.name());
console.log("Credit card:", forge.finance.creditCardNumber());
console.log("Country:", forge.location.country());
console.log("Avatar:", forge.image.avatar());
console.log("AI prompt:", forge.ai.prompt());

console.log("\n5 fake users:");
const users = forge.randomArray(
  () => ({
    id: forge.uuid(),
    name: forge.person.fullName(),
    email: forge.unique.email(),
    jobTitle: forge.person.jobTitle(),
  }),
  5,
);
console.table(users);

console.log(`\n${forge.listGenerators().length} generators available across ${new Set(forge.listGenerators().map((g) => g.module)).size} modules.`);
