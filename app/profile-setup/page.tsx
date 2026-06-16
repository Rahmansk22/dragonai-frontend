"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSetupForm from "../../components/ProfileSetupForm";
import { getProfile, completeOnboarding } from "../../lib/api";
import { API_BASE_URL } from "../../lib/api";

export default function ProfileSetupPage() {
  // Clerk getToken and signOut removed
  const getToken = async () => null;
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    getToken().then(async t => {
      if (!t) {
        setError("Authentication failed: No Clerk JWT token found. Please sign in again.");
        setLoading(true);
        return;
      }
      setToken(t);
      try {
        const profile = await getProfile(t);
        if (profile && profile.onboardingDone) {
          router.push("/chat");
          return;
        }
      } catch (e: any) {
        // If unauthorized, show error but do not auto logout
        if (e?.status === 401) {
          setError("Session expired or unauthorized. Please try again or refresh the page.");
          setLoading(false);
          setProfileChecked(true);
          return;
        }
        // Allow setup if profile not found
      }
      setProfileChecked(true);
      setLoading(false);
    });
  }, [getToken, router]);

  async function handleSubmit(name: string) {
    if (!token) {
      setError("Authentication not ready. Please wait and try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = `${API_BASE_URL}/api/auth/profile`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save profile");
        setLoading(false);
        return;
      }
      // Mark onboarding as complete
      await completeOnboarding(token);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      setLoading(false);
    }
  }

  if (loading || !token || !profileChecked) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        {error ? <div style={{ color: 'red', marginBottom: 16 }}>{error}</div> : null}
        <div>Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>{error}</div>
    );
  }
  return <ProfileSetupForm onSubmit={handleSubmit} loading={loading} />;
}
