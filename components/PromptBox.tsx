"use client";

import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Image as ImageIcon, Plus, Mic, BotMessageSquare, BotOff, Sparkles, Send, X } from 'lucide-react';

export default function PromptBox({
  onSend,
  customBot,
  customMode,
  onToggleCustomMode,
  onOpenCustomBotModal
}: {
  onSend: (msg: string, model: string) => Promise<boolean>,
  customBot: { name: string; persona: string; knowledge: string } | null,
  customMode: boolean,
  onToggleCustomMode: () => void,
  onOpenCustomBotModal: () => void
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dragonai-backend-production.up.railway.app";
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("groq");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showSetBotDialog, setShowSetBotDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [showImageGenModal, setShowImageGenModal] = useState(false);
  const [imageGenPrompt, setImageGenPrompt] = useState("");
  const [imageGenLoading, setImageGenLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    const container = document.createElement("div");
    container.className = "fixed top-4 right-4 z-[9999] bg-[#14171B]/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-[#D4A24F]/30 flex items-center gap-3 text-sm animate-slide-in backdrop-blur-md";
    
    const icon = document.createElement("span");
    icon.textContent = "✨";
    icon.className = "text-[#D4A24F] font-bold";
    
    const msg = document.createElement("span");
    msg.textContent = message;
    msg.className = "text-[#F4EFE6]/90 font-medium";
    
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.className = "ml-2 text-white/50 hover:text-white text-lg font-bold focus:outline-none";
    closeBtn.onclick = () => container.remove();
    
    container.append(icon, msg, closeBtn);
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          onSend(transcript, selectedModel);
        }
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [onSend, selectedModel]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      const handleClick = (e: MouseEvent) => {
        const dropdown = document.getElementById('promptbox-dropup');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showDropdown]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setShowImagePreview(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/image/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        if (res.ok) {
          const data = await res.json();
          setImageAnalysis(data.analysis);
          if (data.analysis && typeof onSend === 'function') {
            onSend(data.analysis, selectedModel);
          }
        } else {
          setImageAnalysis("Unable to analyze image. Please try again.");
        }
      } catch (err) {
        setImageAnalysis("Error analyzing image. Please try again.");
        console.error("Image analysis error:", err);
      } finally {
        setIsImageLoading(false);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {showImageGenModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#14171B]/95 border border-[#D4A24F]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl premium-glass animate-slide-in">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A24F] animate-pulse" />
                <h2 className="text-lg font-bold text-[#D4A24F] tracking-wide">Generate AI Image</h2>
              </div>
              <button 
                onClick={() => setShowImageGenModal(false)} 
                className="text-[#F4EFE6]/60 hover:text-white transition text-xl p-1 focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                id="image-gen-input"
                type="text"
                className="w-full rounded-xl border border-white/10 bg-[#0F1113]/80 px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24F]/50 transition-all"
                placeholder="Describe your mythic creation..."
                value={imageGenPrompt}
                onChange={e => setImageGenPrompt(e.target.value)}
                disabled={imageGenLoading}
                autoFocus
              />
              <button
                className="w-full px-4 py-3 rounded-xl bg-[#D4A24F] hover:bg-[#D4A24F]/85 active:scale-95 text-[#14171B] font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-[#D4A24F]/10 btn-lift"
                onClick={async () => {
                  if (!imageGenPrompt.trim()) return;
                  setImageGenLoading(true);
                  setGeneratedImage("");
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/image/generate`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ prompt: imageGenPrompt, width: 512, height: 512 }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      const imageUrl = data.url || data.imageUrl || data.image;
                      if (imageUrl) {
                        setGeneratedImage(imageUrl);
                      } else {
                        showToast("Failed to retrieve image URL.");
                      }
                    } else {
                      showToast("Image generation failed. Try again.");
                    }
                  } catch (err) {
                    showToast("Error generating image.");
                  } finally {
                    setImageGenLoading(false);
                  }
                }}
                disabled={imageGenLoading}
              >
                {imageGenLoading ? "Forging image..." : "Forge Image"}
              </button>
              {generatedImage && (
                <div className="w-full flex flex-col items-center mt-5 pt-4 border-t border-white/5">
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4A24F]/20 shadow-lg">
                    <img src={generatedImage} alt="Generated asset" className="max-h-60 object-contain mx-auto" />
                  </div>
                  <a
                    href={generatedImage}
                    download="dragon-gpt-image.png"
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#D4A24F]/10 hover:bg-[#D4A24F]/20 text-[#D4A24F] border border-[#D4A24F]/30 text-xs font-bold tracking-wider uppercase shadow transition-all duration-200"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showComingSoon && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative bg-[#14171B]/95 border border-[#D4A24F]/25 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center premium-glass shadow-2xl animate-slide-in text-center">
            <button
              className="absolute top-5 right-5 text-[#F4EFE6]/50 hover:text-white transition p-1.5 rounded-xl hover:bg-white/5 focus:outline-none"
              onClick={() => setShowComingSoon(false)}
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-14 h-14 rounded-2xl bg-[#D4A24F]/10 border border-[#D4A24F]/20 flex items-center justify-center text-[#D4A24F] mb-5 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-extrabold text-[#F4EFE6] tracking-wide mb-2">Document Analysis</h3>
            <p className="text-xs text-[#A3A69A] leading-relaxed mb-6 max-w-[28ch]">We are training this feature on mythic texts. Leave your email to get notified when it goes live!</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Added to waitlist!");
                setShowComingSoon(false);
              }}
              className="w-full flex flex-col gap-3"
            >
              <input 
                type="email" 
                required
                placeholder="Enter your email address..."
                className="w-full rounded-xl px-4 py-2.5 bg-[#0F1113]/85 border border-white/5 focus:border-[#D4A24F]/35 text-[#F4EFE6] placeholder-[#A3A69A]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A24F] text-xs shadow-inner transition-all duration-200"
              />
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A24F] to-[#EAD0A3] hover:brightness-110 active:scale-[0.98] text-[#14171B] font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#D4A24F]/10 btn-lift"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="w-full flex flex-col items-center mb-3">
          <div className="relative max-w-xs w-full bg-[#14171B]/80 rounded-2xl border border-[#D4A24F]/25 shadow-2xl p-2 flex items-center premium-glass-gold animate-slide-in">
            <img src={selectedImage} alt="Preview" className="rounded-xl max-h-32 object-contain mx-auto" />
            <button
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition focus:outline-none"
              onClick={() => setSelectedImage("")}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-2xl flex items-end gap-1.5 sm:gap-3 border border-[#D4A24F]/20 bg-[#14171B]/55 rounded-2xl shadow-deep p-2 sm:p-3 transition-all duration-300 focus-within:border-[#D4A24F]/40 focus-within:shadow-[0_0_25px_rgba(212,162,79,0.15)] premium-glass animate-slide-in">
        {/* Dropdown Options */}
        <div className="relative flex items-center">
          <button
            className="p-2 sm:p-2.5 rounded-xl bg-[#0F1113] hover:bg-[#D4A24F]/10 border border-white/5 hover:border-[#D4A24F]/30 transition-all duration-200 flex items-center justify-center text-[#F4EFE6]/75 hover:text-[#D4A24F] focus:outline-none"
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            aria-label="Actions menu"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          {showDropdown && (
            <div
              id="promptbox-dropup"
              className="absolute left-0 bottom-full mb-3 flex flex-row gap-2.5 items-center z-50 shadow-2xl bg-[#14171B]/95 rounded-2xl px-3 py-2 border border-[#D4A24F]/25 premium-glass animate-slide-in"
            >
              <button
                className="p-2.5 rounded-xl bg-[#0F1113] hover:bg-[#D4A24F]/15 border border-white/5 hover:border-[#D4A24F]/30 transition-all flex items-center justify-center group"
                onClick={() => {
                  setShowDropdown(false);
                  setShowComingSoon(true);
                }}
                type="button"
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5 text-[#F4EFE6]/70 group-hover:text-[#D4A24F]" />
              </button>

              <button
                className="p-2.5 rounded-xl bg-[#0F1113] hover:bg-[#D4A24F]/15 border border-white/5 hover:border-[#D4A24F]/30 transition-all flex items-center justify-center group"
                onClick={() => {
                  setShowDropdown(false);
                  setShowImageGenModal(true);
                }}
                type="button"
                title="Generate Image"
              >
                <ImageIcon className="w-5 h-5 text-[#F4EFE6]/70 group-hover:text-[#D4A24F]" />
              </button>
            </div>
          )}
        </div>

        {/* Input Text Area */}
        <textarea
          className="flex-1 min-w-0 resize-none bg-transparent text-[#F4EFE6] placeholder-[#A3A69A]/60 text-sm border-none px-1 py-2 focus:outline-none focus:ring-0 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar font-medium font-body"
          placeholder="Send a message to Dragon GPT..."
          value={value}
          rows={1}
          onInput={e => {
            const ta = e.currentTarget;
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
          }}
          onChange={e => setValue(e.target.value)}
          onKeyDown={async e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (isGenerating || imageGenLoading || isImageLoading) return;
              if (!value.trim() && !selectedImage) return;
              if (selectedImage && selectedImage.trim()) {
                const ok = await onSend(selectedImage, selectedModel);
                if (ok) setSelectedImage("");
              } else if (value.trim()) {
                const ok = await onSend(value, selectedModel);
                if (ok) setValue("");
              }
            }
          }}
          autoComplete="off"
          spellCheck={false}
          style={{ minHeight: 40 }}
        />

        {/* Chat Control Tray */}
        <div className="flex gap-2 items-center flex-shrink-0">
          {/* Custom Bot Toggle */}
          <div className="relative">
            <button
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 border flex items-center justify-center ${
                customBot 
                  ? customMode 
                    ? "bg-[#D4A24F] border-[#D4A24F] text-[#14171B] shadow-md shadow-[#D4A24F]/15" 
                    : "bg-[#0F1113] border-white/5 text-[#F4EFE6]/60 hover:text-[#D4A24F] hover:border-[#D4A24F]/30"
                  : "bg-[#0F1113]/50 border-white/5 text-white/30 cursor-not-allowed"
              }`}
              type="button"
              onClick={() => {
                if (!customBot) {
                  setShowSetBotDialog(true);
                } else {
                  onToggleCustomMode();
                }
              }}
              title={customBot ? (customMode ? "Custom Bot Active" : "Custom Bot Disabled") : "No Custom Bot Set"}
            >
              <BotMessageSquare className="w-5 h-5" />
            </button>

            {showSetBotDialog && (
              <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                <div className="mb-28 bg-[#14171B]/95 border border-[#D4A24F]/30 rounded-2xl shadow-2xl p-5 flex items-start gap-3.5 animate-slide-in pointer-events-auto premium-glass max-w-sm">
                  <div className="p-2 rounded-xl bg-[#D4A24F]/10 text-[#D4A24F] border border-[#D4A24F]/20">
                    <BotOff className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#D4A24F] text-sm mb-1">Create Custom Bot</h4>
                    <p className="text-[#A3A69A] text-xs leading-relaxed mb-4">To use this, please set up your custom bot first.</p>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="px-3.5 py-1.5 rounded-lg bg-[#D4A24F] hover:bg-[#D4A24F]/85 active:scale-95 text-[#14171B] font-bold text-xs tracking-wider uppercase transition shadow-md"
                        onClick={() => {
                          setShowSetBotDialog(false);
                          onOpenCustomBotModal();
                        }}
                      >
                        Set Up
                      </button>
                      <button
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F4EFE6] text-xs transition"
                        onClick={() => setShowSetBotDialog(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Input */}
          <button
            onClick={handleMicClick}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
              isListening 
                ? 'bg-red-600 border-red-600 text-white animate-pulse shadow-lg shadow-red-600/10' 
                : 'bg-[#0F1113] border-white/5 text-[#F4EFE6]/60 hover:text-[#D4A24F] hover:border-[#D4A24F]/30'
            }`}
            type="button"
            title={isListening ? "Listening... click to pause" : "Voice Input"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Action Trigger */}
          {isGenerating ? (
            <button
              onClick={() => {
                if (abortController) abortController.abort();
                setIsGenerating(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center justify-center shadow-lg"
              type="button"
              title="Stop generating"
            >
              <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!value.trim() && !selectedImage) return;
                setIsGenerating(true);
                const controller = new AbortController();
                setAbortController(controller);
                try {
                  if (selectedImage && selectedImage.trim()) {
                     const ok = await onSend(selectedImage.trim(), selectedModel);
                     if (ok) setSelectedImage("");
                  } else if (value.trim()) {
                     const ok = await onSend(value.trim(), selectedModel);
                     if (ok) setValue("");
                  }
                } catch (e) {
                } finally {
                  setIsGenerating(false);
                }
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-[#D4A24F] hover:bg-[#D4A24F]/85 active:scale-95 text-[#14171B] transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#D4A24F]/10 btn-lift"
              type="button"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </>
  );
}