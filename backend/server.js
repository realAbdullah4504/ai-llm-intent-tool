import express from "express";
import cors from "cors";
import { getIntent } from "./src/ai/aiIntent.js";
import { toolRouter } from "./src/router/toolRouter.js";


const app = express();
app.use(cors());
app.use(express.json());


let accessToken = null;


import crypto from "crypto";

function base64url(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const code_verifier = base64url(crypto.randomBytes(32));

const code_challenge = base64url(
  crypto.createHash("sha256").update(code_verifier).digest()
);

app.get('/auth/salesforce', (req, res) => {
 const authUrl =
  `https://login.salesforce.com/services/oauth2/authorize` +
  `?response_type=code` +
  `&client_id=${process.env.SF_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(process.env.SF_REDIRECT_URI)}` +
  `&code_challenge=${code_challenge}` +
  `&code_challenge_method=S256`;

  res.redirect(authUrl);
});




app.get('/auth/salesforce/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.SF_CLIENT_ID,
      client_secret: process.env.SF_CLIENT_SECRET,
      redirect_uri: process.env.SF_REDIRECT_URI,
    });

    const tokenResponse = await fetch(
      'https://login.salesforce.com/services/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(JSON.stringify(tokenData));
    }

    const { access_token, refresh_token, instance_url } = tokenData;

    console.log('Access Token:', access_token);

    // Example API call (Salesforce uses instance_url!)
    const userResponse = await fetch(
      `${instance_url}/services/oauth2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    res.json({
      success: true,
      token: {
        access_token,
        refresh_token,
        instance_url,
      },
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});






app.get("/auth/close", (req, res) => {
  const url =
    `https://app.close.com/oauth2/authorize/` +
    `?client_id=${process.env.CLOSE_CLIENT_ID}` +
    `&response_type=code`;

  return res.redirect(url);
});



let closeAccessToken = null;

app.get("/auth/close/callback", async (req, res) => {
  const { code } = req.query;

  const response = await fetch(
    "https://api.close.com/oauth2/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLOSE_CLIENT_ID,
        client_secret: process.env.CLOSE_CLIENT_SECRET,
        code,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return res.status(400).json({
      error: "Failed to exchange token",
      details: data,
    });
  }

  closeAccessToken = data.access_token;

  return res.redirect(
    `http://localhost:5173/?status=close_success`
  );
});


















const {
  PIPEDRIVE_CLIENT_ID,
  PIPEDRIVE_CLIENT_SECRET,
  PIPEDRIVE_REDIRECT_URI,
} = process.env;

/**
 * Step 1: Redirect user to Pipedrive OAuth
 */
app.get('/auth/pipedrive', (req, res) => {
  const state = 'random_state_value';

  const authUrl =
    `https://oauth.pipedrive.com/oauth/authorize` +
    `?client_id=${PIPEDRIVE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(PIPEDRIVE_REDIRECT_URI)}` +
    `&response_type=code` +
    `&state=${state}`;

  res.redirect(authUrl);
});

/**
 * Step 2: OAuth Callback
 */
app.get('/auth/pipedrive/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    const basicAuth = Buffer.from(
      `${PIPEDRIVE_CLIENT_ID}:${PIPEDRIVE_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch(
      'https://oauth.pipedrive.com/oauth/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: PIPEDRIVE_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(errorText);
    }

    const tokenData = await tokenResponse.json();

    const {
      access_token,
      refresh_token,
      expires_in,
    } = tokenData;

    console.log('Access Token:', access_token);

    // Get current user
    const userResponse = await fetch(
      'https://api.pipedrive.com/v1/users/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    res.json({
      success: true,
      token_info: {
        access_token,
        refresh_token,
        expires_in,
      },
      user: userData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});





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

  return res.redirect(
      `http://localhost:5173/?status=success`
    );
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