import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user profile info (email from token)
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    } catch {
      setEmail("");
    }
    setLoading(false);
  }, []);

  // Add update profile logic here (future)

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-box">
      <h2>User Profile</h2>
      <p>Email: <b>{email}</b></p>
      {/* Add update form here if needed */}
      {message && <p>{message}</p>}
    </div>
  );
}
