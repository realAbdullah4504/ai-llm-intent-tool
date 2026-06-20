import express from "express";
import cors from "cors";
import { getIntent } from "./src/ai/aiIntent.js";
import { toolRouter } from "./src/router/toolRouter.js";


const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    // 1. Get intent from AI
    const intent = await getIntent(message);

    // 2. Route to tool
    const result = await toolRouter(intent);

    res.json({
      intent,
      result,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: err.message || "something went wrong" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});