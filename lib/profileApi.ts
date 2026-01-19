import { API_BASE_URL } from "./api";
// Usage: In your component, use useAuth() from '@clerk/nextjs' to get the token, then pass it to this function.
// Example:
// import { useAuth } from "@clerk/nextjs";
// const { getToken } = useAuth();
// const token = await getToken();
// await updateProfile({ ...fields, token });

export async function updateProfile({ userId, name, email, avatar, username, language, region, token }: {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  language?: string;
  region?: string;
  token: string;
}) {
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
