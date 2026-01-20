"use client";
export const dynamic = "force-dynamic";
import { useUser, useClerk } from "../../lib/clerk";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "../../lib/profileApi";
import { API_BASE_URL } from "../../lib/api";

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
    <div className="flex justify-center items-center min-h-screen bg-black/80 relative">
      <div className="w-full max-w-2xl bg-[#232324] rounded-3xl shadow-2xl border border-white/10 p-0 mx-2 sm:mx-4 md:mx-auto"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', maxHeight: '90vh', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div className="flex flex-col items-start px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 bg-[#232324] gap-1 sm:gap-2 w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 active:text-white/80 transition bg-transparent border-none p-0 mb-1 sm:mb-2"
            title="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <div className="text-xl sm:text-2xl font-bold text-white text-left w-full truncate">Profile & Settings</div>
        </div>
        <div
          className="px-4 sm:px-8 py-4 sm:py-6 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(90vh - 80px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Personal Information */}
          <div className="mb-8">
            <div className="text-lg font-semibold text-white/90 mb-4">Personal Information</div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <label htmlFor="avatar-upload" className="cursor-pointer group">
                <div className="relative w-20 h-20 sm:w-20 sm:h-20">
                  <img
                    src={user?.imageUrl || avatar}
                    alt="Profile"
                    className="w-20 h-20 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-cyan-400 bg-white/10 group-hover:border-cyan-300 transition"
                  />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <svg className="animate-spin h-8 w-8 text-cyan-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                {editing && <div className="text-xs text-cyan-300 mt-1">Change avatar</div>}
              </label>
              <div>
                <div className="text-xl font-bold">{name}</div>
                <div className="text-cyan-400 text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress ?? ""}
                </div>
                <div className="text-xs text-white/40 mt-1">Account: Free</div>
              </div>
              <button className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded-lg font-semibold" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-sm text-white/70 mb-1">Display Name</label>
                <input
                  className="bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm sm:text-base"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Username</label>
                <input
                  className="bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm sm:text-base"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Preferred Language</label>
                <select
                  className="bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm sm:text-base"
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
                <label className="block text-sm text-white/70 mb-1">Region / Timezone</label>
                <input
                  className="bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white w-full text-sm sm:text-base"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <div className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end">
                  <button
                    type="submit"
                    className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold w-full sm:w-auto"
                    disabled={!isChanged}
                  >
                    {saveStatus ? saveStatus : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
            <div className="text-xs text-white/40 mt-2">Email is not editable.</div>
          </div>
          {/* Account Actions */}
          <div className="mb-4">
            <div className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Account Actions
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto sm:mx-0">
              <button
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                onClick={() => { setComingSoonMsg('Change Password is coming soon!'); setShowComingSoon(true); }}
                type="button"
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V7a3 3 0 10-6 0v1c0 1.657 1.343 3 3 3zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6" /></svg>
                Change Password
              </button>
              <button
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                onClick={() => { setComingSoonMsg('Manage Subscription is coming soon!'); setShowComingSoon(true); }}
                type="button"
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" /></svg>
                Manage Subscription
              </button>
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition" onClick={() => signOut()} type="button">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                Sign Out
              </button>
              <div className="border-t border-white/10 my-2"></div>
              <button className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold border border-red-700 transition" onClick={() => setShowDeleteConfirm(true)} type="button">
                <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2" /></svg>
                Delete Account
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-900/80 rounded-lg border border-red-700 text-center">
                <div className="mb-2 font-bold text-red-200">Are you sure you want to delete your account?</div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg font-semibold mr-2" onClick={() => alert('Account deleted!')}>Yes, Delete</button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 rounded-lg font-semibold" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Saved Dialog (animated, overlay) */}
      {showSavedDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" style={{ overscrollBehavior: 'none' }}>
          <div className="bg-[#232324] border border-cyan-400 rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center animate-bounce-in">
            <svg className="w-12 h-12 text-cyan-400 mb-2 animate-pop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#0ff2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <div className="text-lg font-bold text-cyan-300 mb-2">Image Saved!</div>
            <div className="text-white/80 mb-2 text-center">Your profile image and settings have been updated successfully.</div>
          </div>
        </div>
      )}
      {/* Coming Soon Dialog (overlay, outside scrollable content) */}
      {showComingSoon && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60" style={{ overscrollBehavior: 'none' }}>
          <div className="bg-[#232324] border border-white/10 rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center">
            <svg className="w-10 h-10 text-cyan-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <div className="text-lg font-semibold text-white mb-2">Coming Soon</div>
            <div className="text-white/80 mb-4 text-center">{comingSoonMsg}</div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setShowComingSoon(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
