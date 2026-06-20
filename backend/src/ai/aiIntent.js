import OpenAI from "openai";
import { env } from "../utils/env.js";

const client = new OpenAI({
  apiKey: env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getIntent(message) {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant", // fast + good for routing
    messages: [
      {
        role: "system",
        content: `
You are a CRM assistant inside Vink.

Your job:
- Convert user messages into tool calls
- Only output valid tool + arguments
- No explanations

Available tools:

1. get_deals
- description: fetch CRM deals
- args:
  - stage (optional string: Contract Sent, Presentation Scheduled, Closed Won, Closed Lost)

2. get_contacts
- description: fetch CRM contacts
- args: none

Rules:
- Always choose the best tool
- If unsure, default to get_deals
        `,
      },
      {
        role: "user",
        content: message,
      },
    ],

    tools: [
      {
        type: "function",
        function: {
          name: "get_deals",
          description: "Fetch CRM deals",
          parameters: {
            type: "object",
            properties: {
              stage: {
                type: "string",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_contacts",
          description: "Fetch CRM contacts",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ],

    tool_choice: "auto",
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];

  if (!toolCall) {
    return {
      tool: "unknown",
      arguments: {},
    };
  }
  console.log("TOOL CALL:", toolCall, "ARGUMENTS:", toolCall.function.arguments);

  return {
    tool: toolCall.function.name,
    arguments: JSON.parse(toolCall.function.arguments || "{}"),
  };
}