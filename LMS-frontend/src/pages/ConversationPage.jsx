// src/pages/ConversationPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getConversationMessages, getInbox } from "../api/messages";
import http from "../api/http";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "") + "/";

function ConversationPage() {
  const { conversationId } = useParams();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 receiverId hem Header'dan, hem de fallback olarak getInbox'tan gelebilir
  const [receiverId, setReceiverId] = useState(
    location.state?.receiverId || null
  );

  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // 1) Mesajları çek
        const data = await getConversationMessages(conversationId);
        setMessages(data.data || []);

        // 2) Eğer receiverId yoksa, inbox'tan bul
        if (!receiverId) {
          const inbox = await getInbox(); // [{ conversation_id, other_user_id, ... }]
          const conv = inbox.find(
            (c) => String(c.conversation_id) === String(conversationId)
          );
          if (conv?.other_user_id) {
            setReceiverId(conv.other_user_id);
          }
        }
      } catch (err) {
        console.error("Failed to load conversation:", err);
        setError("Failed to load conversation.");
      } finally {
        setLoading(false);
      }
    }

    load();
    // receiverId is intentionally omitted to avoid rerunning the loader when it is set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage && !attachment) return;

    if (!receiverId) {
      alert("receiver_id hala bulunamadı (inbox'tan da alınamadı).");
      return;
    }

    const formData = new FormData();
    formData.append("receiver_id", receiverId);
    formData.append("message", newMessage);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      setSending(true);

      const res = await http.post("/user/sendMessage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res.data?.data;

      const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

      const newMsgForUI = {
        ...created,
        sender: authUser
          ? { id: authUser.id, name: authUser.name }
          : { id: created.sender_id, name: "You" },
      };

      setMessages((prev) => [...prev, newMsgForUI]);
      setNewMessage("");
      setAttachment(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Conversation</h1>

      {/* Mesajlar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                {msg.sender?.name || `User #${msg.sender_id}`}
              </span>
              <span className="text-[11px] text-slate-400">
                {msg.created_at?.slice(0, 16).replace("T", " ")}
              </span>
            </div>

            <p className="text-sm text-slate-700">{msg.message}</p>

            {msg.attachment && (
              <div className="mt-1">
                <img
                  src={`${IMAGE_BASE_URL}${msg.attachment}`}
                  alt="Attachment"
                  className="max-h-40 rounded-lg border border-slate-200 object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            No messages in this conversation yet.
          </p>
        )}
      </div>

      {/* Mesaj yazma alanı */}
      <form
        onSubmit={handleSendMessage}
        className="mt-4 bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2"
      >
        <textarea
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="2"
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3">
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="text-xs text-slate-500"
          />

          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConversationPage;
