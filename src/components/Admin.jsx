import axios from "axios";
import { useState, useEffect } from "react";
import "../App.css";

export default function Admin() {
  const [feedbacks, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getFeedback() {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(
        "https://feedback-backend-zwut.onrender.com/feedbacks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedback(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Access denied or failed to fetch feedbacks.");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteFeedback(id) {
    const token = localStorage.getItem("token");
    if (!id) {
      alert("Invalid feedback ID");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://feedback-backend-zwut.onrender.com/feedbacks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Feedback deleted") {
        setFeedback(feedbacks.filter(fb => fb._id !== id));
      } else {
        alert(response.data.message || "Failed to delete feedback.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete feedback.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFeedback();
    // eslint-disable-next-line
  }, []);

  if (error) {
    return (
      <div className="feedback-list">
        <h2>Admin Access Required</h2>
        <p style={{ color: "#b91c1c", textAlign: "center", marginTop: "1.5rem" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <h2>All Feedbacks</h2>
      {loading && <p style={{textAlign:'center'}}>Loading...</p>}
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback._id}>
            <span className="name">{feedback.name}</span>
            <div className="message">{feedback.message}</div>
            <button style={{marginTop:'0.5rem',background:'#b91c1c',color:'#fff',border:'none',borderRadius:'6px',padding:'0.4rem 1rem',cursor:'pointer'}} onClick={() => deleteFeedback(feedback._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
