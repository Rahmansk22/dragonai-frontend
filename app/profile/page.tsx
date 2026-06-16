"use client";
export const dynamic = "force-dynamic";
import { useUser, useClerk } from "../../lib/clerk";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "../../lib/profileApi";
import { API_BASE_URL } from "../../lib/api";
import EmberParticles from "../../components/landing/components/EmberParticles";

export default function ProfilePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMsg, setComingSoonMsg] = useState("");
  const { user } = useUser();
  const { signOut } = useClerk();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("India");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showSavedDialog, setShowSavedDialog] = useState(false);

  // Track original values for change detection
  const [original, setOriginal] = useState({
    name: "",
    avatar: "",
    username: "",
    language: "English",
    region: "India",
  });

  // Fetch profile from backend on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { "x-user-id": user?.id || "demo-user" },
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setAvatar(data.avatar || "");
          setUsername(data.username || "");
          setLanguage(data.language || "English");
          setRegion(data.region || "India");
          setOriginal({
            name: data.name || "",
            avatar: data.avatar || "",
            username: data.username || "",
            language: data.language || "English",
            region: data.region || "India",
          });
        }
      } catch (e) {
        // fallback to Clerk if backend fails
        setName(user?.fullName || "");
        setAvatar(user?.imageUrl || "");
        setUsername(user?.username || "");
        setLanguage("English");
        setRegion("India");
        setOriginal({
          name: user?.fullName || "",
          avatar: user?.imageUrl || "",
          username: user?.username || "",
          language: "English",
          region: "India",
        });
      }
    }
    if (user?.id) fetchProfile();
  }, [user?.id]);

  // Detect if any field has changed
  const isChanged =
    name !== original.name ||
    avatar !== original.avatar ||
    username !== original.username ||
    language !== original.language ||
    region !== original.region;

  // Handle avatar file input change
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result);
          // If user is available, upload immediately for preview
          if (user) {
            try {
              await user.setProfileImage({ file });
              await user.reload();
              setAvatar(user.imageUrl);
            } catch (err) {
              // fallback to preview only
            }
          }
        }
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle save form submission
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      // Update Clerk user profile (name and image)
      let newImageUrl = avatar;
      if (user) {
        if (user.fullName !== name) await user.update({ firstName: name });
        if (avatar && user.imageUrl !== avatar) {
          await user.setProfileImage({ file: avatar });
          await user.reload();
          newImageUrl = user.imageUrl;
        } else {
          newImageUrl = user.imageUrl;
        }
      }
      // Persist profile to backend with the real image URL
      const token = await getToken();
      await updateProfile({
        userId: user?.id || "demo-user",
        name,
        email: user?.emailAddresses?.[0]?.emailAddress || "",
        avatar: newImageUrl,
        username,
        language,
        region,
        token: token || "",
      });
      setSaveStatus("Saved!");
      setEditing(false);
      setShowSavedDialog(true);
      setTimeout(() => {
        setShowSavedDialog(false);
        setSaveStatus("");
      }, 3000);
    } catch (err: any) {
      setSaveStatus("Failed to save");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1113] relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212, 162, 79, 0.08) 0%, transparent 70%)"
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EmberParticles />
      </div>

      <div className="w-full max-w-md bg-[#14171B]/90 rounded-2xl shadow-2xl border border-[#D4A24F]/20 p-6 mx-auto relative z-10 backdrop-blur-md"
        style={{ maxHeight: '90vh', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div className="flex flex-col items-start pb-4 border-b border-white/5 bg-[#14171B]/0 gap-2 w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#A3A69A] hover:text-[#D4A24F] transition bg-transparent border-none p-0 mb-1"
            title="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">Back</span>
          </button>
          <div className="text-xl sm:text-2xl font-bold text-[#D4A24F] text-left w-full truncate font-display uppercase tracking-wide">Profile & Settings</div>
        </div>
        <div
          className="py-4 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(90vh - 120px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Personal Information */}
          <div className="mb-6">
            <div className="text-sm font-bold text-[#D4A24F]/80 uppercase tracking-widest pl-1 mb-4">Personal Information</div>
            <div className="flex flex-row items-center gap-4 mb-6">
              <label htmlFor="avatar-upload" className="cursor-pointer group">
                <div className="relative w-16 h-16">
                  <img
                    src={user?.imageUrl || avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border border-[#D4A24F]/35 bg-white/10 group-hover:border-[#D4A24F] transition"
                  />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <svg className="animate-spin h-6 w-6 text-[#D4A24F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={!editing}
                />
                {editing && <div className="text-[10px] text-[#D4A24F] mt-1 text-center">Change</div>}
              </label>
              <div>
                <div className="text-base font-bold text-[#F4EFE6]">{name}</div>
                <div className="text-[#D4A24F] text-xs">
                  {user?.emailAddresses?.[0]?.emailAddress ?? ""}
                </div>
                <div className="text-[10px] text-[#A3A69A]/75 mt-0.5">Account: Free</div>
              </div>
              <button className="ml-auto bg-white/5 hover:bg-white/10 text-[#F4EFE6] hover:text-[#D4A24F] px-3.5 py-1.5 rounded-xl border border-white/5 hover:border-[#D4A24F]/25 text-xs font-bold transition-all" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 w-full">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A3A69A]/85 mb-1.5">Display Name</label>
                <input
                  className="bg-[#0F1113] border border-white/5 focus:border-[#D4A24F]/40 focus:ring-1 focus:ring-[#D4A24F]/40 rounded-xl px-3.5 py-2.5 text-[#F4EFE6] w-full text-xs font-medium focus:outline-none transition-all duration-200"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A3A69A]/85 mb-1.5">Username</label>
                <input
                  className="bg-[#0F1113] border border-white/5 focus:border-[#D4A24F]/40 focus:ring-1 focus:ring-[#D4A24F]/40 rounded-xl px-3.5 py-2.5 text-[#F4EFE6] w-full text-xs font-medium focus:outline-none transition-all duration-200"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A3A69A]/85 mb-1.5">Preferred Language</label>
                <select
                  className="bg-[#0F1113] border border-white/5 focus:border-[#D4A24F]/40 focus:ring-1 focus:ring-[#D4A24F]/40 rounded-xl px-3.5 py-2.5 text-[#F4EFE6] w-full text-xs font-medium focus:outline-none transition-all duration-200"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  disabled={!editing}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A3A69A]/85 mb-1.5">Region / Timezone</label>
                <input
                  className="bg-[#0F1113] border border-white/5 focus:border-[#D4A24F]/40 focus:ring-1 focus:ring-[#D4A24F]/40 rounded-xl px-3.5 py-2.5 text-[#F4EFE6] w-full text-xs font-medium focus:outline-none transition-all duration-200"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <div className="flex justify-end w-full">
                  <button
                    type="submit"
                    className="mt-2 bg-[#D4A24F] hover:bg-[#D4A24F]/85 text-[#14171B] px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-[#D4A24F]/10 w-full transition-all uppercase tracking-wider active:scale-[0.98]"
                    disabled={!isChanged}
                  >
                    {saveStatus ? saveStatus : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
            <div className="text-[10px] text-[#A3A69A]/40 pl-1 mt-3">Email addresses are verified and cannot be edited.</div>
          </div>

          {/* Account Actions */}
          <div className="mb-2 border-t border-white/5 pt-5">
            <div className="text-sm font-bold text-[#D4A24F]/80 uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
              Account Actions
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#F4EFE6] border border-white/5 hover:border-[#D4A24F]/25 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
                onClick={() => { setComingSoonMsg('Change Password is coming soon!'); setShowComingSoon(true); }}
                type="button"
              >
                <span className="text-[#D4A24F]">🔑</span>
                <span>Change Password</span>
              </button>
              <button
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#F4EFE6] border border-white/5 hover:border-[#D4A24F]/25 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
                onClick={() => { setComingSoonMsg('Manage Subscription is coming soon!'); setShowComingSoon(true); }}
                type="button"
              >
                <span className="text-[#D4A24F]">✨</span>
                <span>Manage Subscription</span>
              </button>
              <button 
                className="flex items-center gap-2 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/35 text-red-400 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all active:scale-[0.98]" 
                onClick={() => signOut()} 
                type="button"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
              <div className="border-b border-white/5 my-1.5"></div>
              <button 
                className="flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-[0.98]" 
                onClick={() => setShowDeleteConfirm(true)} 
                type="button"
              >
                <span>⚠️</span>
                <span>Delete Account</span>
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-950/60 rounded-xl border border-red-500/20 text-center animate-slide-in">
                <div className="mb-3 font-semibold text-red-300 text-xs leading-relaxed">Are you sure you want to permanently delete your account? This is irreversible.</div>
                <div className="flex gap-2 justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow" onClick={() => alert('Account deleted!')}>Delete</button>
                  <button className="bg-white/5 hover:bg-white/10 text-[#F4EFE6] px-4 py-1.5 rounded-lg text-xs font-medium" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Dialog (animated, overlay) */}
      {showSavedDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style={{ overscrollBehavior: 'none' }}>
          <div className="bg-[#14171B] border border-[#D4A24F] rounded-2xl shadow-2xl p-6 max-w-xs w-full flex flex-col items-center animate-bounce-in">
            <svg className="w-12 h-12 text-[#D4A24F] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#D4A24F1A" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <div className="text-base font-bold text-[#D4A24F] mb-1">Settings Saved</div>
            <div className="text-xs text-[#A3A69A] text-center leading-relaxed">Your profile settings and avatar have been updated.</div>
          </div>
        </div>
      )}

      {/* Coming Soon Dialog (overlay, outside scrollable content) */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style={{ overscrollBehavior: 'none' }}>
          <div className="bg-[#14171B] border border-[#D4A24F]/30 rounded-2xl shadow-2xl p-6 max-w-xs w-full flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#D4A24F]/10 border border-[#D4A24F]/20 flex items-center justify-center text-[#D4A24F] text-lg font-bold mb-3">i</div>
            <div className="text-sm font-bold text-[#F4EFE6] mb-1">Coming Soon</div>
            <div className="text-xs text-[#A3A69A] text-center mb-5 leading-relaxed">{comingSoonMsg}</div>
            <button className="bg-[#D4A24F] hover:bg-[#D4A24F]/85 text-[#14171B] px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md w-full" onClick={() => setShowComingSoon(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
