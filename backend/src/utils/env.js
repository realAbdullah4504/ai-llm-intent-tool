import dotenv from "dotenv";
dotenv.config();

export const env = {
  HUBSPOT_TOKEN: process.env.HUBSPOT_TOKEN,
  GROK_API_KEY: process.env.GROK_API_KEY,
};
