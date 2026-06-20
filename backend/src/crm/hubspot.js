import axios from "axios";
import { env } from "../utils/env.js";

const BASE_URL = "https://api.hubapi.com";

const hubspot = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ----------------------
// GET DEALS
// ----------------------
export async function getDeals({ stage }) {
  const url = "/crm/v3/objects/deals";

  const res = await hubspot.get(url, {
    params: {
      limit: 10,
      properties: "dealname,amount,dealstage",
    },
  });

  const deals = res.data.results;

  // normalize (VERY important concept)
  let formatted = deals.map((d) => ({
    id: d.id,
    name: d.properties.dealname,
    amount: d.properties.amount,
    stage: d.properties.dealstage,
  }));

  // optional filtering
  if (stage) {
    formatted = formatted.filter((d) => d.stage === stage);
  }

  return formatted;
}

// ----------------------
// GET CONTACTS
// ----------------------
export async function getContacts() {
  const res = await hubspot.get(
    "/crm/v3/objects/contacts",
    {
      params: {
        limit: 10,
        properties: "firstname,lastname,email",
      },
    }
  );

  return res.data.results.map((c) => ({
    id: c.id,
    name: `${c.properties.firstname || ""} ${c.properties.lastname || ""}`.trim(),
    email: c.properties.email,
  }));
}
