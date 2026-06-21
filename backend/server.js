import express from "express";
import cors from "cors";
import { getIntent } from "./src/ai/aiIntent.js";
import { toolRouter } from "./src/router/toolRouter.js";


const app = express();
app.use(cors());
app.use(express.json());


let accessToken = null;


app.get("/auth/hubspot", (req, res) => {
  const url =
    `https://app.hubspot.com/oauth/authorize` +
    `?client_id=${process.env.HUBSPOT_CLIENT_ID}` +
    `&redirect_uri=${process.env.REDIRECT_URI}` +
    `&scope=crm.objects.contacts.read crm.objects.contacts.write`;

  res.redirect(url);
});

app.get("/auth/hubspot/callback", async (req, res) => {
  const { code } = req.query;

  const response = await fetch(
    "https://api.hubapi.com/oauth/v1/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code,
      }),
    }
  );

  const data = await response.json();
  accessToken = data.access_token;

  res.send("HubSpot Connected ✅ You can go back to React app");
});


app.get("/contacts", async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: "Not connected" });
  }

  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  res.json(data);
});

async function getContacts(accessToken) {
  const response = await axios.get(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

app.get("/contacts", async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: "Not connected" });
  }

  const contacts = await getContacts(accessToken);
  res.json(contacts);
});

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

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request received:', { mode, token });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!');
    res.status(200).send(challenge);   // ← Must return challenge as plain text
  } else {
    console.log('Webhook verification failed');
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  // Log incoming message
  console.log('Received WhatsApp message:', JSON.stringify(body, null, 2));

  // TODO: Add logic here to process message and forward to Vink AI agent

  // Always respond with 200 quickly
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});