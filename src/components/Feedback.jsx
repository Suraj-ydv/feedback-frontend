import React from 'react'
import { useState } from "react";
import axios from "axios";
import "../App.css";

export default function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  async function onFormSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://feedback-backend-zwut.onrender.com/feedback",
        { name, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message || "Feedback submitted!");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to submit feedback. Please login."
      );
    }
  }
  function onNameChange(e) {
    setName(e.target.value);
  }

  function onMessageChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div className="form-box">
      <h2>Submit Your Feedback</h2>
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={onNameChange}
        />
        <textarea
          placeholder="Enter your message..."
          onChange={onMessageChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
