"use client";
import React, { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";

export default function CustomBotModal({
  open,
  onClose,
  onSave,
  customBot,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (bot: { name: string; persona: string; knowledge: string }) => void;
  customBot?: { name: string; persona: string; knowledge: string } | null;
}) {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [knowledge, setKnowledge] = useState("");

  React.useEffect(() => {
    if (customBot) {
      setName(customBot.name);
      setPersona(customBot.persona);
      setKnowledge(customBot.knowledge);
    } else {
      setName("");
      setPersona("");
      setKnowledge("");
    }
  }, [customBot, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative bg-[#14171B]/95 border border-[#D4A24F]/25 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-slide-in premium-glass">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-[#F4EFE6]/50 hover:text-white transition-all p-1.5 rounded-xl hover:bg-white/5 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-white/5 pb-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4A24F]/10 border border-[#D4A24F]/20 flex items-center justify-center text-[#D4A24F] shadow-inner flex-shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#F4EFE6] tracking-wide">
              {customBot ? 'Modify Custom Bot' : 'Forge Custom Bot'}
            </h2>
            <p className="text-[10px] sm:text-xs text-[#A3A69A]">Define your AI's persona, behaviour, and knowledge.</p>
          </div>
        </div>

        {/* Existing Bot Preview Card */}
        {customBot && (
          <div className="mb-5 p-4 rounded-xl bg-[#0F1113]/60 border border-[#D4A24F]/15 shadow-inner flex flex-col gap-1.5 animate-slide-in">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#D4A24F] tracking-widest uppercase">Active Companion</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold uppercase">Live</span>
            </div>
            <div className="font-extrabold text-[#F4EFE6] text-sm">{customBot.name}</div>
            <div className="text-xs text-[#A3A69A] leading-relaxed"><span className="text-[#F4EFE6]/80 font-semibold">Style:</span> {customBot.persona}</div>
            <div className="text-xs text-[#A3A69A] leading-relaxed line-clamp-2"><span className="text-[#F4EFE6]/80 font-semibold">Knowledge:</span> {customBot.knowledge}</div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, persona, knowledge });
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="bot-name-input" className="block text-[#F4EFE6]/70 font-semibold mb-1.5 text-xs uppercase tracking-wider pl-1">
              Bot Name
            </label>
            <input
              id="bot-name-input"
              className="w-full rounded-xl px-4 py-2.5 bg-[#0F1113]/85 border border-white/5 focus:border-[#D4A24F]/35 text-[#F4EFE6] placeholder-[#A3A69A]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A24F] text-xs sm:text-sm shadow-inner transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Space Navigator, Code Sage..."
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="bot-persona-input" className="block text-[#F4EFE6]/70 font-semibold mb-1.5 text-xs uppercase tracking-wider pl-1">
              Persona / Style
            </label>
            <input
              id="bot-persona-input"
              className="w-full rounded-xl px-4 py-2.5 bg-[#0F1113]/85 border border-white/5 focus:border-[#D4A24F]/35 text-[#F4EFE6] placeholder-[#A3A69A]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A24F] text-xs sm:text-sm shadow-inner transition-all duration-200"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="E.g. Helpful, professional, witty..."
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="bot-knowledge-input" className="block text-[#F4EFE6]/70 font-semibold mb-1.5 text-xs uppercase tracking-wider pl-1">
              Knowledge Base
            </label>
            <textarea
              id="bot-knowledge-input"
              className="w-full rounded-xl px-4 py-2.5 bg-[#0F1113]/85 border border-white/5 focus:border-[#D4A24F]/35 text-[#F4EFE6] placeholder-[#A3A69A]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A24F] text-xs sm:text-sm shadow-inner transition-all duration-200 min-h-[80px] max-h-[140px] resize-y"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Paste specific facts, FAQ documents, or system instructions here..."
              required
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A24F] to-[#EAD0A3] hover:brightness-110 active:scale-[0.98] text-[#14171B] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-[#D4A24F]/10 btn-lift mt-2"
          >
            Save Bot Configuration
          </button>
        </form>
      </div>
    </div>
  );
}