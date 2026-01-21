"use client";

import React from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import CustomBotModal from "../../components/CustomBotModal";
import { ToastProvider, useToast } from "../../components/ToastProvider";
import Spinner from "../../components/Spinner";
import { useState, useEffect } from "react";
import { createChat, getChats, getProfile, sendMessageToChat, getMessages } from "../../lib/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function ChatPageClient() {
  const { getToken } = useAuth();
  const router = useRouter();
  // No authentication needed
  const [profileChecked, setProfileChecked] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Array<{ id: string; title?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  // signOut removed
  // Custom bot state (shared, persisted to localStorage)
  const [customBot, setCustomBot] = useState<null | { name: string; persona: string; knowledge: string }>(null);

  // Load customBot from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('customBot');
    if (stored) {
      try {
        setCustomBot(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save customBot to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (customBot) {
      localStorage.setItem('customBot', JSON.stringify(customBot));
    } else {
      localStorage.removeItem('customBot');
    }
  }, [customBot]);

  // Load chats on mount
  useEffect(() => {
    async function loadChats() {
      try {
        const token = await getToken();
        const chats = await getChats();
        setChats(chats);
      } catch (e) {
        setError("Failed to load chats");
      } finally {
        setLoadingChats(false);
      }
    }
    loadChats();
  }, [getToken]);

  // Custom bot modal open state (shared)
  const [showCustomBotModal, setShowCustomBotModal] = useState(false);

  // Handlers for chat actions
  const { showToast } = useToast();
  async function handleNewChat(firstMessage?: string) {
    try {
      const token = await getToken();
      const chat = await createChat();
      setChats((prev) => [chat, ...prev]);
      showToast("New chat created!", "success");
      if (typeof firstMessage === "string" && firstMessage.trim()) {
        if (firstMessage.startsWith("data:image")) {
          await sendMessageToChat(chat.id, firstMessage, "image", token);
        } else {
          await sendMessageToChat(chat.id, firstMessage, "text", token);
        }
        if (chat.id) {
          await getMessages(chat.id);
        }
      }
      setActiveChatId(chat.id);
    } catch (e) {
      showToast("Failed to create chat", "error");
    }
  }

  async function handleFirstPrompt(prompt: string) {
    if (!activeChatId) return;
    setTimeout(async () => {
      try {
        const updatedChats = await getChats();
        setChats(updatedChats);
      } catch (err) {
        console.error("Failed to refresh chats:", err);
      }
    }, 500);
  }

  function handleSelectChat(id: string) {
    setActiveChatId(id);
  }

  const { user } = useUser();
  async function handleRenameChat(id: string, newTitle: string) {
    await fetch(`/api/chats/${id}/title`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id || "demo-user",
      },
      body: JSON.stringify({ title: newTitle }),
    });
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
  }

  async function handleDeleteChat(id: string) {
    try {
      await fetch(`/api/chats/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "demo-user" },
      });
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
      showToast("Chat deleted", "success");
    } catch {
      showToast("Failed to delete chat", "error");
    }
  }

  // Always render

  // Wrap async handlers for Sidebar to match expected sync signature
  const handleNewChatSync = () => { handleNewChat(); };
  const handleRenameChatSync = (id: string, newTitle: string) => { handleRenameChat(id, newTitle); };
  const handleDeleteChatSync = (id: string) => { handleDeleteChat(id); };

  return (
    <ToastProvider>
      <ErrorBoundary>
        <div style={{ height: '100dvh' }} className="flex overflow-hidden bg-[#242526]">
          {/* Sidebar overlay for mobile/tablet */}
          {sidebarOpen && windowWidth !== null && windowWidth < 1024 && (
            <div
              className="fixed inset-0 bg-[#242526]/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Sidebar and main chat area in a flex row, with shared bottom border for alignment */}
          <div className="flex flex-row w-full h-full">
            <div
              className={`z-50 transition-transform duration-300 h-full flex flex-col ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } fixed lg:relative inset-y-0 left-0 lg:translate-x-0 lg:p-3 lg:py-6 lg:pl-6 border-b border-white/10 h-full`}
              style={{
                width: sidebarOpen
                  ? windowWidth !== null && windowWidth >= 1024
                    ? 240
                    : 210 // wider on mobile
                  : 0,
                minWidth: 0,
                marginBottom: '32px'
              }}
            >
              <Sidebar
                chats={chats}
                onNewChat={handleNewChatSync}
                onSelectChat={(id) => {
                  handleSelectChat(id);
                  if (windowWidth !== null && windowWidth < 1024) setSidebarOpen(false);
                }}
                onRenameChat={handleRenameChatSync}
                onDeleteChat={handleDeleteChatSync}
                activeChatId={activeChatId}
                collapsed={!sidebarOpen}
                onToggleSidebar={() => setSidebarOpen((open) => !open)}
                customBot={customBot}
                setCustomBot={setCustomBot}
                onOpenCustomBotModal={() => setShowCustomBotModal(true)}
                // ...existing code...
              />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden border-b border-white/10">
              {/* Dragon title overlay, does not disturb layout */}
              <div
                className="pointer-events-none select-none fixed left-0 right-0 z-30 flex justify-center"
                style={{ top: '1.25rem', height: 0 }}
              >
                <span
                  className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide bg-[#242526]/80 px-6 py-2 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 drop-shadow-lg"
                  style={{ minHeight: '2.75rem', letterSpacing: '0.08em' }}
                >
                  Dragon <span className="ml-2 font-light text-white/70">AI</span>
                </span>
              </div>
              <div className="flex-1 overflow-hidden p-3 lg:p-6" style={{ paddingBottom: windowWidth !== null && windowWidth < 640 ? 80 : undefined }}>
                {loadingChats ? (
                  <div className="flex items-center justify-center h-full">
                    <Spinner size={48} />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-red-900/80 text-red-200 p-6 rounded-xl text-center max-w-md mx-auto shadow-lg">
                      <div className="text-lg font-bold mb-2">{error}</div>
                      <div className="text-sm">If this keeps happening, please try logging out and back in, or contact support.</div>
                    </div>
                  </div>
                ) : (
                  <ChatWindow
                    chatId={activeChatId}
                    onFirstPrompt={activeChatId ? handleFirstPrompt : handleNewChat}
                    customBot={customBot}
                    setCustomBot={setCustomBot}
                    onOpenCustomBotModal={() => setShowCustomBotModal(true)}
                  />
                )}
                {/* CustomBotModal is always rendered in the chat panel, never in the sidebar */}
                <CustomBotModal
                  open={showCustomBotModal}
                  onClose={() => setShowCustomBotModal(false)}
                  onSave={(bot: { name: string; persona: string; knowledge: string }) => {
                    setCustomBot(bot);
                    setShowCustomBotModal(false);
                  }}
                  customBot={customBot}
                />
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ToastProvider>
  );
}

export default ChatPageClient;