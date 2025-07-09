import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://feedback-backend-zwut.onrender.com";

export default function PrivateChat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    // Get my email from token
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setMyEmail(payload.email);
    } catch {
      setMyEmail("");
    }
  }, []);

  useEffect(() => {
    if (!myEmail) return;
    // Fetch user list
    const token = localStorage.getItem("token");
    axios.get(`${SOCKET_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data.filter(u => u !== myEmail)))
      .catch(() => setUsers([]));
  }, [myEmail]);

  useEffect(() => {
    if (!myEmail) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("register", myEmail);
    socketRef.current.on("private message", (msg) => {
      if (
        (msg.from === myEmail && msg.to === selectedUser) ||
        (msg.from === selectedUser && msg.to === myEmail)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [myEmail, selectedUser]);

  useEffect(() => {
    if (!selectedUser || !myEmail) return;
    // Fetch message history
    const token = localStorage.getItem("token");
    axios.get(`${SOCKET_URL}/messages/${selectedUser}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [selectedUser, myEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (input.trim() === "" || !selectedUser) return;
    socketRef.current.emit("private message", { to: selectedUser, content: input });
    setInput("");
  }

  return (
    <div className="form-box" style={{ maxWidth: 700 }}>
      <h2>Private Chat</h2>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ minWidth: 180 }}>
          <h4>Users</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((u) => (
              <li key={u}>
                <button
                  style={{
                    background: selectedUser === u ? "#a5b4fc" : "#f3f4f6",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    margin: "4px 0",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedUser(u)}
                >
                  {u}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          {selectedUser ? (
            <>
              <div style={{height: 250, overflowY: "auto", background: "#f3f4f6", borderRadius: 8, padding: 8, marginBottom: 12}}>
                {messages.map((msg, i) => (
                  <div key={i} style={{margin: "6px 0", textAlign: msg.from === myEmail ? "right" : "left"}}>
                    <span style={{fontWeight: msg.from === myEmail ? "bold" : "normal"}}>
                      {msg.from === myEmail ? "You" : msg.from}
                    </span>: {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} style={{display: "flex", gap: 8}}>
                <input
                  style={{flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: 8}}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Message to ${selectedUser}`}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
}
