// src/admin/pages/AdminMessagesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox } from "../../api/messages";

export default function AdminMessagesPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const inbox = await getInbox(); // [{ conversation_id, other_user_name, last_message, time }]
        setConversations(inbox || []);
      } catch (err) {
        console.error("Failed to load admin inbox:", err);
        setError("Failed to load inbox. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleOpenConversation = (conv) => {
    const conversationId =
      conv.conversation_id || conv.id || conv.conversationId;

    if (!conversationId) return;

    navigate(`/admin/messages/${conversationId}`, {
      state: {
        receiverId: conv.other_user_id,
        receiverName: conv.other_user_name,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Messages</h1>
      <p className="text-sm text-slate-600 mb-4">
        See all conversations between users and admin.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-slate-600">Loading inbox...</p>
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-sm text-slate-500">No conversations found.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Last message</th>
                  <th className="py-2 px-4">Time</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr
                    key={conv.conversation_id || conv.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-2 px-4 font-medium">
                      {conv.other_user_name || "User"}
                    </td>
                    <td className="py-2 px-4 text-slate-700">
                      {conv.last_message || "-"}
                    </td>
                    <td className="py-2 px-4 text-xs text-slate-500">
                      {conv.time || ""}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => handleOpenConversation(conv)}
                        className="text-xs px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100"
                      >
                        View conversation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
