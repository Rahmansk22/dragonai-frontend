import { UserButton, useUser } from "../lib/clerk";

export default function UserProfileDisplay() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <a href="/profile" className="flex items-center gap-3 mb-2 hover:bg-white/10 rounded-lg px-2 py-1 transition cursor-pointer group">
      {user.imageUrl && (
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border border-white/20 bg-white/10 group-hover:border-cyan-400"
        />
      )}
      <span className="text-white font-medium truncate max-w-[140px] group-hover:text-cyan-400">{user.fullName || user.username || user.emailAddresses[0]?.emailAddress}</span>
    </a>
  );
}