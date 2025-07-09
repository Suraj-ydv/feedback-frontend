import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://feedback-backend-zwut.onrender.com";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (input.trim() === "") return;
    socketRef.current.emit("chat message", input);
    setInput("");
  }

  return (
    <div className="form-box" style={{ maxWidth: 600 }}>
      <h2>Real-Time Chat</h2>
      <div style={{height: 250, overflowY: "auto", background: "#f3f4f6", borderRadius: 8, padding: 8, marginBottom: 12}}>
        {messages.map((msg, i) => (
          <div key={i} style={{margin: "6px 0"}}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{display: "flex", gap: 8}}>
        <input
          style={{flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: 8}}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
