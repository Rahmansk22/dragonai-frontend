"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Message from "./Message";
import PromptBox from "./PromptBox";
import { getMessages, sendMessageToChat } from "../lib/api";
import { ArrowDown } from "lucide-react";


export default function ChatWindow({
  chatId,
  onFirstPrompt,
  customBot,
  setCustomBot,
  onOpenCustomBotModal,
}: {
  chatId: string | null;
  onFirstPrompt?: (prompt: string) => void;
  customBot: { name: string; persona: string; knowledge: string } | null;
  setCustomBot: (bot: { name: string; persona: string; knowledge: string } | null) => void;
  onOpenCustomBotModal: () => void;
}) {
  // Message state
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string; image?: string }>>([]);
  // Store the just-entered user message before backend response
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [hasSentFirstPrompt, setHasSentFirstPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const firstLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Custom bot mode state (ON/OFF only)
  const [customMode, setCustomMode] = useState(false);
  const [showCustomBotModal, setShowCustomBotModal] = useState(false);

  // Fetch messages when chatId changes
  useEffect(() => {
    if (chatId) {
      getMessages(chatId)
        .then((msgs) => {
          setMessages(msgs);
          setPendingUserMessage(null); // Clear pending user message when backend messages arrive
        })
        .catch(() => {
          setMessages([]);
          setPendingUserMessage(null);
        });
    } else {
      setMessages([]);
      setPendingUserMessage(null);
    }
  }, [chatId]);

  // Auto-scroll to bottom ONLY when a new assistant message is added (like ChatGPT)
  const prevMessagesLength = useRef(0);
  useLayoutEffect(() => {
    if (messages.length === 0) {
      prevMessagesLength.current = 0;
      return;
    }
    const last = messages[messages.length - 1];
    // Only scroll if a new assistant message is added
    if (
      messages.length > prevMessagesLength.current &&
      last.role === "assistant"
    ) {
      if (firstLineRef.current) {
        firstLineRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Show scroll-to-bottom arrow if not at bottom
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 40);
    };
    const el = scrollContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    // Recalculate on mount and when messages change
    handleScroll();
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  // Send message
  async function handleSend(content: string, model: string = "gemini") {
    // Prevent sending empty messages or images
    if (!content || (typeof content === "string" && content.trim().length === 0)) {
      setIsLoading(false);
      setPendingUserMessage(null);
      return false;
    }
    console.log("[handleSend] Sending to backend:", content, model);
    let finalContent = content;
    if (customMode && customBot) {
      finalContent = `SYSTEM: You are ${customBot.name}. Persona: ${customBot.persona}. Only answer using this knowledge base:\n${customBot.knowledge}\nUSER: ${content}`;
      setPendingUserMessage(content);
    } else if (customMode && !customBot) {
      setMessages((prev) => prev.concat({ id: crypto.randomUUID(), role: "assistant", content: "Custom bot mode is ON but no custom bot is set. Please set a custom bot in the sidebar." }));
      setPendingUserMessage(null);
      setIsLoading(false);
      return;
    } else {
      setPendingUserMessage(content);
    }
    setIsLoading(true);
    try {
      if (!chatId) {
        if (onFirstPrompt) {
          await onFirstPrompt(content);
          setTimeout(async () => {
            if (chatId) {
              const msgs = await getMessages(chatId);
              setMessages(msgs);
              setPendingUserMessage(null);
              setIsLoading(false);
            }
          }, 400);
        }
        return;
      }
      if (finalContent.startsWith("data:image")) {
        await sendMessageToChat(chatId, finalContent, "image", model);
      } else {
        await sendMessageToChat(chatId, finalContent, "text", model);
      }
      const msgs = await getMessages(chatId);
      setMessages(msgs);
      setPendingUserMessage(null);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      let errorMsg = "Error: Failed to send message.";
      if (err?.message?.includes("Invalid message input") && content.trim().length === 0) {
        errorMsg = "Cannot send empty message. Please enter some text or upload an image.";
      }
      setMessages(prev => prev.concat({ id: crypto.randomUUID(), role: "assistant", content: errorMsg }));
      setPendingUserMessage(null);
      setIsLoading(false);
      return false;
    }
  }

  // Edit user message and regenerate assistant response
  async function handleEditUserMessage(index: number, newContent: string, model: string = "gemini") {
    if (!chatId) return;
    setMessages((prev) => {
      const newMessages = prev.slice(0, index).concat({ id: crypto.randomUUID(), role: "user" as "user", content: newContent });
      return newMessages;
    });
    try {
      const res = await sendMessageToChat(chatId, newContent, "text", model);
      const assistantContent = res.assistant?.content || res.message?.content || res.content || "";
      const assistantMsg = { id: crypto.randomUUID(), role: "assistant" as "assistant", content: assistantContent };
      setMessages((prev) => prev.concat(assistantMsg));
    } catch (err) {
      const errorMsg = { id: crypto.randomUUID(), role: "assistant" as "assistant", content: "Error: Failed to get response" };
      setMessages((prev) => prev.concat(errorMsg));
    }
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Highlight search matches in message content
  function highlightMatch(content: string, search: string) {
    if (!search) return content;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = content.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: "#facc15",
            color: "#232324",
            padding: "0 2px",
            borderRadius: "3px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <div className="h-full flex flex-col pb-safe">
      {!chatId ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#242526] w-full min-h-[100vh] px-4">
          <div className="flex flex-col items-center justify-center w-full max-w-[480px] animate-fade-in">
            <div className="text-white/80 text-2xl font-extrabold mb-6 text-center">Welcome to Dragon AI!</div>
            <button
              className="mb-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg transition-colors text-lg"
              onClick={() => onFirstPrompt && onFirstPrompt("")}
            >
              Start New Chat
            </button>
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-base">💡 Tip: Try asking anything!</span>
              <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-base">✨ Or upload an image with +</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 p-3 sm:p-4 lg:p-6 pt-14 sm:pt-0 overflow-y-auto space-y-4 sm:space-y-6 pb-6 relative bg-[#242526] hide-scrollbar"
          ref={scrollContainerRef}
        >
          {/* Show greeting only if there are no messages in the chat */}
          {messages.length === 0 && (
            <>
              <div className="block sm:hidden mb-2 mt-16">
                <Message
                  key="greeting-mobile"
                  role="assistant"
                  content="Hello! 👋 I’m your AI assistant. How can I help you today? You can ask me anything or try uploading an image using the + button below."
                />
              </div>
              <div className="hidden sm:block mt-16">
                <Message
                  key="greeting-desktop"
                  role="assistant"
                  content="Hello! 👋 I’m your AI assistant. How can I help you today? You can ask me anything or try uploading an image using the + button below."
                />
              </div>
            </>
          )}
          {/* Filtered chat messages */}
          {/* Show the just-entered user message at the very top if present */}
          {pendingUserMessage && isLoading && (
            <Message
              key="pending-user-msg"
              role="user"
              content={pendingUserMessage}
            />
          )}
          {messages
            .map((m, i) => ({ ...m, index: i }))
            .filter(m => !search || (m.content && m.content.toLowerCase().includes(search.toLowerCase())))
            .map((m, idx, arr) => {
              const isUser = m.role === "user";
              const onEdit = isUser ? (newContent: string) => handleEditUserMessage(m.index, newContent) : undefined;
              // Attach ref to the first line of the last assistant message
              if (idx === arr.length - 1 && m.role === "assistant") {
                return (
                  <div ref={firstLineRef} key={m.id}>
                    <Message
                      role={m.role}
                      content={search ? highlightMatch(m.content, search) : m.content}
                      image={m.image}
                      onEdit={onEdit}
                    />
                  </div>
                );
              }
              return (
                <Message
                  key={m.id}
                  role={m.role}
                  content={search ? highlightMatch(m.content, search) : m.content}
                  image={m.image}
                  onEdit={onEdit}
                />
              );
            })}
          {isLoading && (
            <div className="flex items-start gap-3 mt-12 mb-6 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/dragon.jpg" alt="Dragon" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-gray-300 text-sm font-medium">
                  <span>Generating</span>
                  <span className="inline-block ml-1">
                    <span className="animate-[bounce_1s_infinite_0ms]">.</span>
                    <span className="animate-[bounce_1s_infinite_150ms]">.</span>
                    <span className="animate-[bounce_1s_infinite_300ms]">.</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          {showScrollDown && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 bg-white/80 hover:bg-white text-indigo-600 shadow-lg rounded-full p-2 transition-colors border border-indigo-200"
              title="Scroll to bottom"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
      <PromptBox
        onSend={handleSend}
        customBot={customBot}
        customMode={customMode}
        onToggleCustomMode={() => setCustomMode((prev) => !prev)}
        onOpenCustomBotModal={onOpenCustomBotModal}
      />
    </div>
  );
}
