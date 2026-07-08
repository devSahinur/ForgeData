// Run after `npm run build`: node examples/node-cjs.cjs
const { ForgeData } = require("../dist/index.cjs");

const forge = new ForgeData({ locale: "de" });

console.log("German name:", forge.person.fullName());
console.log("German city:", forge.location.city());
console.log("Job title:", forge.person.jobTitle());
