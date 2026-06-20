import { getDeals, getContacts } from "../tools/crmTools.js";

export async function toolRouter(intent) {
  switch (intent.tool) {
    case "get_deals":
      return await getDeals(intent.arguments);

    case "get_contacts":
      return await getContacts();

    default:
      return { message: "Unknown tool" };
  }
}