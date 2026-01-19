import React from "react";
import Link from "next/link";

export default function UserPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18191A] p-4">
      <h1 className="text-3xl font-extrabold text-cyan-300 mb-8">User Settings</h1>
      <Link
        href="/user/profile"
        className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg shadow-lg transition"
      >
        View/Edit Profile
      </Link>
    </div>
  );
}
