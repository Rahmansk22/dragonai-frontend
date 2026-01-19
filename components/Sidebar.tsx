import React, { useEffect, useState, useRef } from "react";
import { UserButton, useUser, useClerk, SignedIn, SignedOut } from "../lib/clerk";
import CustomBotModal from "./CustomBotModal";
import UserProfileDisplay from "./UserProfileDisplay";


export default function Sidebar({
  chats = [],
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  activeChatId,
  collapsed = false,
  onToggleSidebar,
  customBot,
  setCustomBot,
  onOpenCustomBotModal,
  // ...existing code...
}: {
  chats: Array<{ id: string; title?: string }>;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  activeChatId: string | null;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
  customBot: { name: string; persona: string; knowledge: string } | null;
  setCustomBot: (bot: { name: string; persona: string; knowledge: string } | null) => void;
  onOpenCustomBotModal: () => void;
  // ...existing code...
}) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  // TODO: Integrate Clerk authentication for user profile
  // Removed unused chatList state. Use only chats prop.
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [renameDialog, setRenameDialog] = useState<{ id: string; title: string } | null>(null);
  const [renameInput, setRenameInput] = useState("");

  // Removed chat fetching logic. Parent should provide up-to-date chats prop.

  // No signOut or handleLogout needed

  function handleDeleteAllChats() {
    setConfirmDeleteAll(true);
  }
  // When collapsed, render only a floating hamburger button to reopen
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside (only when expanded)
  useEffect(() => {
    if (collapsed) return;
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (onToggleSidebar) onToggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed, onToggleSidebar]);

  if (collapsed) {
    return (
      <button
        className="fixed top-4 left-4 z-[100] p-3 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center shadow-lg"
        aria-label="Expand sidebar"
        onClick={onToggleSidebar}
        style={{ touchAction: 'manipulation' }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }
  // Expanded sidebar
  return (
    <aside
      ref={sidebarRef}
      className="flex flex-col flex-1 w-60 p-4 rounded-2xl bg-[#242526] backdrop-blur-xl border-r border-white/10 fixed lg:relative z-50 h-full transition-all duration-300"
      style={{ minWidth: 0, height: '100vh', top: 0, left: 0 }}
    >
      {/* ...existing code... */}
      {/* Collapse (close) button, always visible in expanded sidebar */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          aria-label="Collapse sidebar"
          onClick={onToggleSidebar}
          style={{ touchAction: 'manipulation' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {!collapsed && (
        <>
          <div className="flex flex-col flex-1 min-h-0">
            {/* Custom Bot Edit/Create Button Only */}
            <div className="mb-4 flex flex-col gap-2">
              <button
                className="w-full py-2 rounded-xl bg-blue-700 hover:bg-[#242526] text-white font-bold text-sm shadow-lg transition"
                onClick={onOpenCustomBotModal}
              >
                {customBot ? 'Edit Custom Bot' : 'Create Custom Bot 🤖✨'}
              </button>
          
            </div>
            <div className="flex items-center gap-2 mb-4">
              {/* Replace with a valid icon, e.g. Heroicons */}
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="flex-1 bg-[#232324] border border-white/10 rounded-lg px-3 py-1 text-white placeholder-gray-400 text-sm focus:outline-none"
                placeholder="Search chats..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">Chats</h2>
            <button
              className="mb-3 sm:mb-4 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 transition p-2.5 sm:p-3 text-left text-sm sm:text-base"
              onClick={onNewChat}
            >
              + New Chat
            </button>
            <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto text-xs sm:text-sm text-white/60 hide-scrollbar min-h-0">
              {/* Filtered chat list rendering */}
              {(() => {
                const filtered = (chats || []).filter(chat => {
                  const title = typeof chat.title === 'string' ? chat.title : `Chat ${chat.id}`;
                  return title.toLowerCase().includes(search.toLowerCase());
                });
                if (filtered.length === 0) {
                  return <div className="text-center py-4">No saved chats</div>;
                }
                return filtered.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center justify-between rounded-lg p-2 transition ${
                      activeChatId === chat.id ? "bg-indigo-600 text-white" : "hover:bg-white/10 active:bg-white/20"
                    }`}
                  >
                    <button className="flex-1 text-left truncate pr-2" onClick={() => onSelectChat(chat.id)}>
                      {chat.title || `Chat ${chat.id}`}
                    </button>
                    <div className="flex gap-1.5 sm:gap-2 ml-2">
                      <button
                        className="text-xs px-1.5 sm:px-2 py-1 rounded bg-white/20 hover:bg-white/30 active:bg-white/40 transition"
                        aria-label="Rename chat"
                        title="Rename"
                        onClick={() => {
                          setRenameDialog({ id: chat.id, title: chat.title || "" });
                          setRenameInput(chat.title || "");
                        }}
                      >
                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 13.5v2.5h2.5l7-7a1.77 1.77 0 0 0-2.5-2.5l-7 7Z" />
                        </svg>
                      </button>
                      <button
                        className="text-xs px-1.5 sm:px-2 py-1 rounded bg-red-500/60 text-white hover:bg-red-600 active:bg-red-700 transition"
                        aria-label="Delete chat"
                        title="Delete"
                        onClick={() => {
                          setConfirmDeleteId(chat.id);
                          setConfirmDeleteTitle(chat.title || `Chat ${chat.id}`);
                        }}
                      >
                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
                          <rect x="5" y="6" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 sm:pt-4 flex flex-col gap-2">
            {/* Clerk user profile and logout button, only when signed in */}
            <SignedIn>
              <UserProfileDisplay />
              <LogoutButton />
            </SignedIn>
            <SignedOut>
              <div className="mt-2 p-2 bg-yellow-200 text-black rounded text-center">
                Please sign in to access your profile and chats.
              </div>
            </SignedOut>
          </div>
        </>
      )}
      {renameDialog && !collapsed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242526]/50 p-0 m-0">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-[#23272f] text-white shadow-xl">
            <div className="px-3 py-4 sm:px-5 border-b border-gray-700">
              <h3 className="text-base font-semibold text-white">Rename chat</h3>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (renameDialog && renameInput.trim()) {
                  onRenameChat(renameDialog.id, renameInput.trim());
                  setRenameDialog(null);
                }
              }}
            >
              <div className="px-3 py-4 sm:px-5 flex flex-col gap-3">
                <input
                  className="w-full border border-gray-700 bg-[#181a20] text-white rounded-lg px-3 py-2 text-base placeholder-gray-400"
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                  autoFocus
                  placeholder="Chat name"
                />
                <div className="flex justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="px-3 py-2 sm:px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
                    onClick={() => setRenameDialog(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 sm:px-4 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 text-sm"
                    disabled={!renameInput.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmDeleteId && !collapsed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242526]/50 p-0 m-0">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-[#23272f] text-white shadow-xl">
            <div className="px-3 py-4 sm:px-5 border-b border-gray-700">
              <h3 className="text-base font-semibold text-white">Delete chat</h3>
              <p className="text-sm text-gray-300 mt-1">{confirmDeleteTitle}</p>
            </div>
            <div className="px-3 py-4 sm:px-5 flex justify-end gap-2 sm:gap-3">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 sm:px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                onClick={() => {
                  if (confirmDeleteId) onDeleteChat(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// Add LogoutButton component at the end of the file
function LogoutButton() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  if (!isSignedIn) return null;
  return (
    <button
      className="bg-red-600 text-white rounded p-2 mt-2 w-full"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}
