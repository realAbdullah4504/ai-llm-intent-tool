import { useState } from "react";
import axios from "axios";

export default function App() {
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
    </div>
  );
}