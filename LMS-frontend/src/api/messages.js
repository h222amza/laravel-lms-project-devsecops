// src/api/messages.js
import http from "./http";

// Inbox: son konuşmalar listesi
export async function getInbox() {
  const res = await http.get("/user/getInbox");
  // backend: { status: "success", data: [...] }
  return res.data.data || [];
}

// Belirli bir konuşmanın mesajları
export async function getConversationMessages(conversationId, page = 1) {
  const res = await http.get(`/user/getMessages/${conversationId}`, {
    params: { page },
  });
  // backend: { status, data: { data: [...], ...pagination } }
  return res.data.data;
}

// Mesaj gönderme (text + optional attachment)
export async function sendMessage(payload) {
  // payload: FormData olursa ek dosya da atabiliriz
  const res = await http.post("/user/sendMessage", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
