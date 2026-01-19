import { getToken } from "@clerk/nextjs/server";
// Mark onboarding as complete
export async function completeOnboarding() {
  const token = await getToken();
  const url = `${API_BASE_URL}/api/auth/profile/onboarding`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to complete onboarding: ${res.status} ${text}`);
  }
  return res.json();
}

// Deprecated: sendMessage (single prompt, not chat history)
// Use sendMessageToChat instead for chat functionality

export async function createChat() {
  const token = await getToken();
  const url = `${API_BASE_URL}/api/chats`;
  const userId = localStorage.getItem("userId") || "demo-user";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-user-id": userId,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}

export async function getChats() {
  const token = await getToken();
  const url = `${API_BASE_URL}/api/chats`;
  const userId = localStorage.getItem("userId") || "demo-user";
  const res = await fetch(url, {
    headers: {
      "x-user-id": userId,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
}

export async function getMessages(chatId: string) {
  const token = await getToken();
  const url = `${API_BASE_URL}/api/chats/${chatId}/messages`;
  const userId = localStorage.getItem("userId") || "demo-user";
  const res = await fetch(url, {
    headers: {
      "x-user-id": userId,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessageToChat(chatId: string, content: string, type: "text" | "image" = "text", model: string = "gemini") {
  const token = await getToken();
  const url = `${API_BASE_URL}/api/chats/${chatId}/messages`;
  const userId = localStorage.getItem("userId") || "demo-user";
  const body: any = type === "image"
    ? { image: content, model }
    : { text: content, model };
  console.log("[sendMessageToChat] Sending body:", body);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to send message: ${res.status} ${text}`);
  }
  return res.json();
}

// Get current user profile

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getProfile(token: string) {
    console.log('[API] getProfile token:', token);
  const url = `${API_BASE_URL}/api/auth/profile`;
  console.log("[getProfile] Endpoint:", url);
  console.log("[getProfile] Token:", token);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    let errorMsg = `Failed to fetch profile`;
    let errorBody = await res.text().catch(() => "");
    try {
      const json = JSON.parse(errorBody);
      errorMsg = json?.error || errorMsg;
    } catch {}
    console.error(`[getProfile] Failed: ${res.status} ${errorBody}`);
    const error = new Error(errorMsg);
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

// Delete all chats for the user (requires auth token)
export async function deleteAllChats(token: string) {
    console.log('[API] deleteAllChats token:', token);
  const url = `${API_BASE_URL}/api/chats`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete chats");
  return res.json();
}
