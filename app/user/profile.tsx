"use client";
import React, { useState } from "react";

export default function UserProfilePage() {
  // Simulate user profile state (replace with real data if available)
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@example.com",
    avatar: "/hero.jpg",
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function handleEdit() {
    setForm(profile);
    setEditing(true);
  }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18191A] p-4">
      <div className="bg-[#232324] border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-cyan-300 mb-6 text-center">User Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow mb-2"
          />
          <div className="text-lg font-bold text-white">{profile.name}</div>
          <div className="text-sm text-white/70">{profile.email}</div>
        </div>
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-white/80 font-semibold mb-1">Name</label>
              <input
                className="w-full rounded-lg px-4 py-2 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base shadow-inner"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 font-semibold mb-1">Email</label>
              <input
                className="w-full rounded-lg px-4 py-2 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base shadow-inner"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                type="email"
              />
            </div>
            <div>
              <label className="block text-white/80 font-semibold mb-1">Avatar URL</label>
              <input
                className="w-full rounded-lg px-4 py-2 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base shadow-inner"
                value={form.avatar}
                onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                required
                type="url"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base shadow-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold text-base shadow-lg transition"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg shadow-lg transition"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
