"use client";
import React, { useState } from "react";
import CustomBotTestPreview from "./CustomBotTestPreview";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#242526] border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-3 text-center">
          {customBot ? 'Edit Your Custom Bot' : 'Create Your Custom Bot'}
        </h2>
        {customBot && (
          <div className="mb-3 p-2 rounded-lg bg-[#18191A] border border-cyan-500/40 text-white shadow flex flex-col gap-1">
            <div className="font-bold text-cyan-400 text-base">{customBot.name}</div>
            <div className="text-xs text-white/80"><span className="font-semibold">Persona:</span> {customBot.persona}</div>
            <div className="text-xs text-white/80"><span className="font-semibold">Knowledge:</span> {customBot.knowledge}</div>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, persona, knowledge });
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-white/80 font-semibold mb-1 text-xs">
              Bot Name
            </label>
            <input
              className="w-full rounded-lg px-3 py-1.5 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-inner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Space Navigator"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 font-semibold mb-1 text-xs">
              Persona / Style
            </label>
            <input
              className="w-full rounded-lg px-3 py-1.5 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-inner"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="E.g. Futuristic, witty, helpful..."
              required
            />
          </div>
          <div>
            <label className="block text-white/80 font-semibold mb-1 text-xs">
              Knowledge Base
            </label>
            <textarea
              className="w-full rounded-lg px-3 py-1.5 bg-[#18191A] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-inner min-h-[60px]"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Paste facts, FAQ, or info here..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base shadow transition"
          >
            Save Bot
          </button>
        </form>
      </div>
    </div>
  );
}