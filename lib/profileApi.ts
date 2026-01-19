import { API_BASE_URL } from "./api";

import { getAuth } from "@clerk/nextjs/server";
export async function updateProfile({ userId, name, email, avatar, username, language, region, req }: {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  language?: string;
  region?: string;
  req: any;
}) {
  const { getToken } = getAuth(req);
  const token = await getToken();
  const url = `${API_BASE_URL}/api/auth/profile`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, avatar, username, language, region }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to update profile: ${res.status} ${text}`);
  }
  return res.json();
}
