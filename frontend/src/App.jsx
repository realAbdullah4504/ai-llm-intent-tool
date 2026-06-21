import { useState } from "react";
import axios from "axios";

export default function App() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const status = urlSearchParams.get("status");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:3001/chat", {
      message,
    });

    setResponse(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vink AI Starter</h2>

      <input
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something like: show deals"
      />

      <button onClick={sendMessage}>Send</button>

      <pre>{JSON.stringify(response, null, 2)}</pre>
      {status === "success" && (
        <div style={{ color: "green" }}>HubSpot connected successfully!</div>
      )}
    <button
      onClick={() => {
        window.location.href = "http://localhost:3001/auth/hubspot";
      }}
    >
      Connect HubSpot
    </button>
    </div>
  );
}