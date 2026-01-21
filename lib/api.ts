// Mark onboarding as complete
export async function completeOnboarding(token: string) {
    console.log('[API] completeOnboarding token:', token);
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

export async function createChat(userId?: string) {
  const url = `${API_BASE_URL}/api/chats`;
  const id = userId || "demo-user";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-user-id": id,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}

export async function getChats(userId?: string) {
  const url = `${API_BASE_URL}/api/chats`;
  const id = userId || "demo-user";
  const res = await fetch(url, {
    headers: { "x-user-id": id },
  });
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
}

export async function getMessages(chatId: string, userId?: string) {
  const url = `${API_BASE_URL}/api/chats/${chatId}/messages`;
  const id = userId || "demo-user";
  const res = await fetch(url, {
    headers: { "x-user-id": id },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessageToChat(chatId: string, content: string, type: "text" | "image" = "text", model: string = "groq", userId?: string) {
  const url = `${API_BASE_URL}/api/chats/${chatId}/messages`;
  const id = userId || "demo-user";
  const body: any = type === "image"
    ? { image: content, model }
    : { text: content, model };
  console.log("[sendMessageToChat] Sending body:", body);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-user-id": id,
  };
  const publicGroqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (publicGroqKey) {
    headers["x-groq-api-key"] = publicGroqKey.trim();
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to send message: ${res.status} ${text}`);
  }
  return res.json();
}

export async function getCustomBot(userId?: string) {
  const id = userId || "demo-user";
  const url = `${API_BASE_URL}/api/custom-bot`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-user-id": id,
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load custom bot: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data?.customBot ?? null;
}

export async function saveCustomBot(bot: { name: string; persona: string; knowledge: string }, userId?: string) {
  const id = userId || "demo-user";
  const url = `${API_BASE_URL}/api/custom-bot`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": id,
    },
    body: JSON.stringify(bot),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to save custom bot: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data?.customBot ?? null;
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
