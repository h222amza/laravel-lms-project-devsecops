import { useState } from "react";
import http from "../api/http";
import { useParams } from "react-router-dom";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "") + "/";

function ChatPage() {
  const { instructorId } = useParams(); // /chat/:instructorId
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message && !attachment) return;

    const formData = new FormData();
    formData.append("receiver_id", instructorId);
    formData.append("message", message);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      setSending(true);

      const res = await http.post("/user/sendMessage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Message sent:", res.data);

      setMessage("");
      setAttachment(null);
      alert("Message sent!");
    } catch (err) {
      console.error("Message error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-6">
      <h1 className="text-2xl font-bold mb-4">Message Instructor</h1>

      <textarea
        className="w-full border border-slate-300 rounded-lg p-3 text-sm"
        rows="4"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <input
        type="file"
        className="mt-3"
        onChange={(e) => setAttachment(e.target.files[0])}
      />

      <button
        onClick={handleSend}
        disabled={sending}
        className="mt-4 w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}

export default ChatPage;
