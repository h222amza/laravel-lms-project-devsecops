// src/admin/pages/AdminConversationPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getConversationMessages,
  getInbox,
  sendMessage,
} from "../../api/messages";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

export default function AdminConversationPage() {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [receiverId, setReceiverId] = useState(
    location.state?.receiverId || null
  );
  const [receiverName, setReceiverName] = useState(
    location.state?.receiverName || "User"
  );

  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // 1) Messages
        const data = await getConversationMessages(conversationId);
        // user tarafında data.data kullanıyordun, admin API aynıysa:
        const msgs = data.data || data || [];
        setMessages(msgs);

        // 2) Fallback for receiver (if not passed via state)
        if (!receiverId) {
          const inbox = await getInbox();
          const conv = inbox.find(
            (c) => String(c.conversation_id) === String(conversationId)
          );
          if (conv?.other_user_id) {
            setReceiverId(conv.other_user_id);
          }
          if (conv?.other_user_name) {
            setReceiverName(conv.other_user_name);
          }
        }
      } catch (err) {
        console.error("Failed to load admin conversation:", err);
        setError("Failed to load conversation.");
      } finally {
        setLoading(false);
      }
    }

    load();
    // receiverId dependency'ye girerse loop'a girer, o yüzden koymuyoruz
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage && !attachment) return;

    if (!receiverId) {
      alert("Receiver not found for this conversation.");
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
      setError("");

      const res = await sendMessage(formData);
      const created = res.data || res.message || null;

      // Sadece UI'ı güncellemek için basit bir "fake" mesaj objesi oluşturuyoruz
      const adminName =
        JSON.parse(localStorage.getItem("adminUser") || "null")?.name ||
        "Admin";

      const newMsgForUI = {
        id: Date.now(),
        message: newMessage,
        created_at: new Date().toISOString(),
        sender: { name: adminName },
        attachment: attachment ? created?.attachment || null : null,
      };

      setMessages((prev) => [...prev, newMsgForUI]);
      setNewMessage("");
      setAttachment(null);
    } catch (err) {
      console.error("Failed to send admin message:", err);
      setError("Failed to send message. Please try again.");
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
    <div className="max-w-3xl mx-auto px-6 py-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conversation</h1>
          <p className="text-sm text-slate-600">
            Chat with: <span className="font-semibold">{receiverName}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/messages")}
          className="text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
        >
          Back to Messages
        </button>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex-1 overflow-y-auto">
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
                {msg.created_at
                  ? msg.created_at.slice(0, 16).replace("T", " ")
                  : ""}
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

      {/* Send box */}
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
            onChange={(e) => setAttachment(e.target.files[0] || null)}
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
