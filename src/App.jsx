import Feedback from "./components/Feedback";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Chat from "./components/Chat";
import PrivateChat from "./components/PrivateChat";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav>
          <div className="brand">FeedbackPro</div>
          <div className="nav-links">
            <Link to="/">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/private-chat">Private Chat</Link>
            <button
              style={{
                marginLeft: "1.5rem",
                padding: "0.3rem 1rem",
                borderRadius: "6px",
                border: "none",
                background: "#e0e7ff",
                cursor: "pointer",
              }}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route path="/chat" element={<Chat />} />
            <Route path="/private-chat" element={<PrivateChat />} />
          </Routes>
        </main>
        <footer>
          &copy; {new Date().getFullYear()} FeedbackPro. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}
