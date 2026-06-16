import React, { useEffect, useState, useRef } from "react";
import { UserButton, useUser, useClerk, SignedIn, SignedOut } from "../lib/clerk";
import CustomBotModal from "./CustomBotModal";
import UserProfileDisplay from "./UserProfileDisplay";
import { Search, Plus, Edit2, Trash2, X, Menu, LogOut, MessageSquare, Bot } from 'lucide-react';

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
}) {
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  const [renameDialog, setRenameDialog] = useState<{ id: string; title: string } | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapsed) return;
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Only trigger collapse on smaller viewports
        if (window.innerWidth < 1024 && onToggleSidebar) {
          onToggleSidebar();
        }
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
        className="fixed top-4 left-4 z-[100] p-2.5 rounded-xl bg-[#14171B]/85 hover:bg-[#D4A24F]/10 text-[#F4EFE6] border border-[#D4A24F]/20 hover:text-[#D4A24F] transition-all flex items-center justify-center shadow-lg backdrop-blur-md"
        aria-label="Expand sidebar"
        onClick={onToggleSidebar}
        style={{ touchAction: 'manipulation' }}
      >
        <Menu className="w-6 h-6" />
      </button>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      className="flex flex-col flex-1 w-full sm:w-60 p-4 rounded-2xl bg-[#14171B]/55 border-r border-[#D4A24F]/15 fixed lg:relative z-50 h-[calc(100vh-2rem)] transition-all duration-300 premium-glass"
      style={{ minWidth: 0, top: 0, left: 0 }}
    >
      {/* Collapse (close) button for all devices */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition focus:outline-none"
          aria-label="Collapse sidebar"
          onClick={onToggleSidebar}
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Custom Bot Action Block */}
        <div className="mb-5 flex flex-col gap-2">
          <button
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4A24F] to-[#EAD0A3] hover:brightness-110 active:scale-[0.98] text-[#14171B] font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#D4A24F]/10 transition-all flex items-center justify-center gap-2 btn-lift"
            onClick={onOpenCustomBotModal}
          >
            <Bot className="w-4 h-4" />
            <span>{customBot ? 'Edit Custom Bot' : 'Create Custom Bot'}</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center mb-5 group">
          <Search className="w-4 h-4 absolute left-3 text-white/40 group-focus-within:text-[#D4A24F] transition-colors" />
          <input
            type="text"
            className="w-full bg-[#0B0D0F]/70 border border-white/5 focus:border-[#D4A24F]/30 focus:bg-[#0B0D0F] rounded-xl pl-9 pr-3 py-2 text-[#F4EFE6] placeholder-[#A3A69A]/50 text-xs focus:outline-none transition-all"
            placeholder="Search chat history..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[10px] font-bold text-[#A3A69A] uppercase tracking-widest pl-1">Chats</span>
          <span className="text-[10px] font-semibold text-white/30">{chats.length} active</span>
        </div>

        {/* Start New Chat Action */}
        <button
          className="mb-4 rounded-xl border border-[#D4A24F]/35 bg-[#D4A24F]/5 text-[#D4A24F] hover:bg-[#D4A24F]/15 active:scale-[0.98] transition-all p-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Scrollable Chat log list */}
        <div className="flex-1 space-y-1.5 overflow-y-auto text-xs text-white/60 hide-scrollbar min-h-0 pr-0.5">
          {(() => {
            const filtered = (chats || []).filter(chat => {
              const title = typeof chat.title === 'string' ? chat.title : `Chat ${chat.id}`;
              return title.toLowerCase().includes(search.toLowerCase());
            });
            if (filtered.length === 0) {
              return <div className="text-center py-6 text-white/30 italic">No chats found</div>;
            }
            return filtered.map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between rounded-xl p-2.5 transition-all duration-200 border ${
                    isActive 
                      ? "bg-[#D4A24F] border-[#D4A24F] text-[#14171B] font-bold shadow-md shadow-[#D4A24F]/10 scale-[1.01]" 
                      : "bg-[#0F1113]/30 border-transparent hover:bg-white/5 hover:border-white/5 hover:text-white"
                  }`}
                >
                  <button 
                    className="flex-1 text-left truncate pr-2 flex items-center gap-2 focus:outline-none" 
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#14171B]" : "text-white/40"}`} />
                    <span className="truncate">{chat.title || `Chat`}</span>
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className={`p-1 rounded transition-colors ${isActive ? "hover:bg-black/15 text-[#14171B]" : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"}`}
                      aria-label="Rename chat"
                      onClick={() => {
                        setRenameDialog({ id: chat.id, title: chat.title || "" });
                        setRenameInput(chat.title || "");
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      className={`p-1 rounded transition-colors ${isActive ? "hover:bg-red-950/20 text-[#14171B]" : "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"}`}
                      aria-label="Delete chat"
                      onClick={() => {
                        setConfirmDeleteId(chat.id);
                        setConfirmDeleteTitle(chat.title || `Chat`);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Profile/Auth Foot block */}
      <div className="border-t border-white/5 pt-3.5 flex flex-col gap-2 relative z-20">
        <SignedIn>
          <UserProfileDisplay />
          <LogoutButton />
        </SignedIn>
        <SignedOut>
          <div className="mt-1 p-2 rounded-xl bg-[#D4A24F]/10 border border-[#D4A24F]/25 text-[#D4A24F] text-[10px] text-center font-medium leading-relaxed">
            Authentication required to persist sessions.
          </div>
        </SignedOut>
      </div>

      {/* Custom Rename Dialog */}
      {renameDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-2xl bg-[#14171B] border border-[#D4A24F]/30 text-white shadow-2xl premium-glass animate-slide-in">
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-[#D4A24F] uppercase tracking-wider">Rename Chat</h3>
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
              <div className="p-4 flex flex-col gap-3">
                <input
                  className="w-full border border-white/10 bg-[#0F1113] text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4A24F] transition-all"
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                  autoFocus
                  placeholder="Chat name"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition"
                    onClick={() => setRenameDialog(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#D4A24F] text-[#14171B] hover:bg-[#D4A24F]/85 font-bold text-xs shadow-md transition"
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

      {/* Custom Confirm Delete Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-2xl bg-[#14171B] border border-red-500/20 text-white shadow-2xl premium-glass animate-slide-in">
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Delete Chat</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <p className="text-xs text-[#A3A69A] leading-relaxed">
                Are you sure you want to permanently delete <span className="text-[#F4EFE6] font-semibold">"{confirmDeleteTitle}"</span>? This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
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
        </div>
      )}
    </aside>
  );
}

function LogoutButton() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  if (!isSignedIn) return null;
  return (
    <button
      className="border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/35 text-red-400 rounded-xl p-2.5 w-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 focus:outline-none"
      onClick={() => signOut()}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Logout</span>
    </button>
  );
}
