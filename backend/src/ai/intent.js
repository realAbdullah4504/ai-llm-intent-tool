export async function getIntent(message) {
  // SIMPLE MOCK INTENT LOGIC (replace with real LLM later)

  const msg = message.toLowerCase();

  if (msg.includes("deal")) {
    return {
      tool: "get_deals",
      arguments: {
        stage: "pipeline",
      },
    };
  }

  if (msg.includes("contact")) {
    return {
      tool: "get_contacts",
      arguments: {},
    };
  }

  return {
    tool: "unknown",
    arguments: {},
  };
}