// export async function getDeals(args) {
//   // mock data
//   const deals = [
//     { name: "Company A", stage: "pipeline", value: 5000 },
//     { name: "Company B", stage: "closed", value: 12000 },
//     { name: "Company C", stage: "pipeline", value: 8000 },
//   ];

//   if (args?.stage) {
//     return deals.filter(d => d.stage === args.stage);
//   }

//   return deals;
// }

// export async function getContacts() {
//   return [
//     { name: "Ali", email: "ali@test.com" },
//     { name: "Sara", email: "sara@test.com" },
//   ];
// }

import { getDeals } from "../crm/hubspot.js";
import { getContacts } from "../crm/hubspot.js";

export { getDeals, getContacts };