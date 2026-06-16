import React, { useState } from "react";

export default function ProfileSetupForm({ onSubmit, loading }: { onSubmit: (name: string) => void, loading: boolean }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Display name is required");
      return;
    }
    setError("");
    onSubmit(name.trim());
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1113] via-zinc-950 to-black">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm sm:max-w-md p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-[#14171B] via-[#0F1113] to-black border border-[#D4A24F]/25 backdrop-blur-lg"
        style={{ boxShadow: "0 8px 40px 0 rgba(212, 162, 79, 0.15), 0 1.5px 8px 0 rgba(212, 162, 79, 0.2), 0 0 0 1.5px #222 inset" }}
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-amber-500 via-[#D4A24F] to-[#D4A24F] rounded-full shadow-2xl p-2" style={{ boxShadow: "0 0 40px 10px rgba(212, 162, 79, 0.45)" }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="32" fill="#0F1113" /><text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize="2.2rem" fontWeight="bold" dy=".3em">👤</text></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-[#D4A24F] to-amber-300 text-center mb-6 mt-6 drop-shadow-lg tracking-wide">Welcome!<br />Set up your profile</h2>
        <label className="block mb-2 text-lg font-semibold text-zinc-200 tracking-wide">Display Name</label>
        <input
          className="w-full px-4 py-3 mb-3 rounded-xl bg-[#0F1113] text-white border border-[#F4EFE6]/10 focus:border-[#D4A24F] focus:ring-2 focus:ring-[#D4A24F]/30 outline-none shadow-inner transition-all duration-200 text-lg placeholder-zinc-500"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          disabled={loading}
          autoFocus
        />
        {error && <div className="text-red-400 text-sm mb-2 text-center animate-pulse">{error}</div>}
        <button
          type="submit"
          className="w-full mt-2 py-3 rounded-xl bg-[#D4A24F] text-[#14171B] text-lg font-bold shadow-lg hover:bg-[#D4A24F]/85 transition-all duration-200 active:scale-95 disabled:opacity-60 border-none outline-none"
          disabled={loading}
          style={{ boxShadow: "0 2px 16px 0 rgba(212, 162, 79, 0.25)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#14171B]"></span>
              Saving...
            </span>
          ) : (
            <>
              <span className="drop-shadow">Continue</span>
              <svg className="inline ml-2 -mt-1 animate-bounce-x" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 12h14" stroke="#14171B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </>
          )}
        </button>
        <div className="mt-6 text-center text-zinc-500 text-xs select-none">
          Your display name will be visible to you in the app.<br />
          <span className="text-[#D4A24F]">Dragon GPT</span> respects your privacy.
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-[#D4A24F]/10 shadow-[0_0_60px_10px_rgba(212,162,79,0.08)_inset]" />
      </form>
    </div>
  );
}
