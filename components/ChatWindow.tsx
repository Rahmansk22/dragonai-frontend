"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Message from "./Message";
import PromptBox from "./PromptBox";
import { getMessages, sendMessageToChat } from "../lib/api";
import { ArrowDown } from "lucide-react";
import EmberParticles from "./landing/components/EmberParticles";
import Spinner from "./Spinner";

export default function ChatWindow({
  chatId,
  onFirstPrompt,
  userId,
  customBot,
  setCustomBot,
  onOpenCustomBotModal,
}: {
  chatId: string | null;
  onFirstPrompt?: (prompt: string) => void;
  userId?: string;
  customBot: { name: string; persona: string; knowledge: string } | null;
  setCustomBot: (bot: { name: string; persona: string; knowledge: string } | null) => void;
  onOpenCustomBotModal: () => void;
}) {
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string; image?: string }>>([]);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [hasSentFirstPrompt, setHasSentFirstPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const firstLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [customMode, setCustomMode] = useState(false);
  const [showCustomBotModal, setShowCustomBotModal] = useState(false);

  useEffect(() => {
    if (chatId) {
      getMessages(chatId, userId)
        .then((msgs) => {
          setMessages(msgs);
          setPendingUserMessage(null);
        })
        .catch(() => {
          setMessages([]);
          setPendingUserMessage(null);
        });
    } else {
      setMessages([]);
      setPendingUserMessage(null);
    }
  }, [chatId, userId]);

  const prevMessagesLength = useRef(0);
  useLayoutEffect(() => {
    if (messages.length === 0) {
      prevMessagesLength.current = 0;
      return;
    }
    const last = messages[messages.length - 1];
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

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 40);
    };
    const el = scrollContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  async function handleSend(content: string, model: string = "gemini") {
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
        }
        return true;
      }
      if (finalContent.startsWith("data:image")) {
        await sendMessageToChat(chatId, finalContent, "image", model, userId);
      } else {
        await sendMessageToChat(chatId, finalContent, "text", model, userId);
      }
      const msgs = await getMessages(chatId, userId);
      setMessages(msgs);
      setPendingUserMessage(null);
      setIsLoading(false);
      
      if (onFirstPrompt && msgs.length <= 2) {
        await onFirstPrompt(content);
      }
      
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

  async function handleEditUserMessage(index: number, newContent: string, model: string = "gemini") {
    if (!chatId) return;
    setMessages((prev) => {
      const newMessages = prev.slice(0, index).concat({ id: crypto.randomUUID(), role: "user" as "user", content: newContent });
      return newMessages;
    });
    try {
      const res = await sendMessageToChat(chatId, newContent, "text", model, userId);
      const assistantContent = res.assistant?.content || res.message?.content || res.content || "";
      const assistantMsg = { id: crypto.randomUUID(), role: "assistant" as "assistant", content: assistantContent };
      setMessages((prev) => prev.concat(assistantMsg));
    } catch (err) {
      const errorMsg = { id: crypto.randomUUID(), role: "assistant" as "assistant", content: "Error: Failed to get response" };
      setMessages((prev) => prev.concat(errorMsg));
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <div className="h-full flex flex-col relative bg-[#0F1113] overflow-hidden">
      {/* Background glowing gradient & rising ember particles */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212, 162, 79, 0.08) 0%, transparent 70%)"
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EmberParticles />
      </div>

      {!chatId ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 relative z-10 text-center animate-slide-in">
          {/* Logo Emblem */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4A24F]/30 bg-[#14171B] flex items-center justify-center shadow-lg mb-6 animate-pulse mx-auto overflow-hidden isolate">
            <img src="/hero_dragon.jpg" alt="Dragon GPT" className="w-full h-full object-cover scale-[1.15] object-center relative z-10" />
          </div>
          <div className="text-[#F4EFE6] text-2xl sm:text-3xl font-extrabold mb-3 tracking-wide drop-shadow-md">Welcome to Dragon GPT</div>
          <p className="text-[#A3A69A] text-xs sm:text-sm mb-6 leading-relaxed max-w-[52ch] mx-auto">A generative academy where myth meets craft—train creatures, forge stories, and bring worlds to life.</p>
          <button
            className="px-6 py-3 rounded-xl bg-[#D4A24F] hover:bg-[#D4A24F]/85 active:scale-95 text-[#14171B] font-bold shadow-lg shadow-[#D4A24F]/10 transition-all text-xs tracking-wider uppercase btn-lift mb-6 mx-auto"
            onClick={() => onFirstPrompt && onFirstPrompt("")}
          >
            Start New Chat
          </button>
          <div className="flex flex-col items-center gap-2.5 mt-2 w-full">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#D4A24F]/10 border border-[#D4A24F]/20 text-[#D4A24F] text-xs font-semibold backdrop-blur-md">💡 Tip: Try asking for code or custom prompt guidelines!</span>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#D4A24F]/10 border border-[#D4A24F]/20 text-[#D4A24F] text-xs font-semibold backdrop-blur-md">✨ Or upload/generate an image with +</span>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 min-h-0 p-3 sm:p-4 lg:p-6 pt-16 sm:pt-4 overflow-y-auto space-y-4 sm:space-y-6 pb-28 relative z-10 hide-scrollbar"
          ref={scrollContainerRef}
        >
          {messages.length === 0 && (
            <div className="space-y-4 max-w-2xl mt-12">
              <Message
                key="greeting"
                role="assistant"
                content="Hello! 👋 I’m your AI assistant. How can I help you today? You can ask me anything, request custom code, or try uploading/generating an image using the + button below."
              />
            </div>
          )}
          
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
            <div className="flex items-start gap-3 sm:gap-4 mt-8 mb-4 animate-slide-in">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4A24F]/30 bg-[#14171B] flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5 overflow-hidden isolate">
                <img src="/hero_dragon.jpg" alt="Dragon" className="w-full h-full object-cover scale-[1.15] object-center relative z-10" />
              </div>
              <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-[#14171B]/35 border border-white/5 premium-glass w-fit shadow-2xl">
                <Spinner size={24} />
                <div className="flex flex-col gap-0.5 select-none">
                  <span className="text-[11px] sm:text-xs font-bold text-[#D4A24F] tracking-wide">Dragon GPT</span>
                  <span className="text-[9px] sm:text-[11px] text-[#A3A69A]/85 italic animate-pulse">Forging response...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 bg-[#14171B]/95 hover:bg-[#14171B] text-[#D4A24F] shadow-2xl rounded-full p-2.5 transition-all border border-[#D4A24F]/30 hover:scale-105 active:scale-95"
          title="Scroll to bottom"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
      <div className="p-3 lg:p-6 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/90 to-transparent relative z-20 pb-safe">
        <PromptBox
          onSend={handleSend}
          customBot={customBot}
          customMode={customMode}
          onToggleCustomMode={() => setCustomMode((prev) => !prev)}
          onOpenCustomBotModal={onOpenCustomBotModal}
        />
      </div>
    </div>
  );
}
