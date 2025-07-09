import { useState, useEffect } from "react";
import axios from "axios";

export default function MyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("https://feedback-backend-zwut.onrender.com/my-feedbacks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setFeedbacks(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to load feedbacks"));
  }, []);

  const startEdit = (id, message) => {
    setEditingId(id);
    setEditMessage(message);
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://feedback-backend-zwut.onrender.com/feedbacks/${id}`,
        { message: editMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(feedbacks.map(fb => fb._id === id ? { ...fb, message: editMessage } : fb));
      setEditingId(null);
      setEditMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update feedback");
    }
  };

  if (error) return <div className="form-box">{error}</div>;
  return (
    <div className="feedback-list">
      <h2>My Feedbacks</h2>
      <ul>
        {feedbacks.map(fb => (
          <li key={fb._id}>
            <span className="name">{fb.name}</span>
            {editingId === fb._id ? (
              <>
                <textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} />
                <button onClick={() => saveEdit(fb._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="message">{fb.message}</div>
                <button onClick={() => startEdit(fb._id, fb.message)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
