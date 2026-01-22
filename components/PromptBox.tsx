
"use client";
import React, { useState, useRef, useEffect } from "react";

import { Paperclip, Image as ImageIcon, Plus, Mic, BotMessageSquare, BotOff } from 'lucide-react';


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
  // Use deployed API base URL; default to public Railway backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dragonai-backend-production.up.railway.app";
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("groq");
  const [showDropdown, setShowDropdown] = useState(false); // For + menu
  const [showModelDropdown, setShowModelDropdown] = useState(false); // For model selector
  const [showSetBotDialog, setShowSetBotDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [showImageGenModal, setShowImageGenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [imageGenPrompt, setImageGenPrompt] = useState("");
  const [imageGenLoading, setImageGenLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast notification utility
  const showToast = (message: string) => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "16px";
    container.style.right = "16px";
    container.style.zIndex = "9999";
    container.style.background = "#1f2937";
    container.style.color = "white";
    container.style.padding = "12px 14px";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
    container.style.fontSize = "14px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";
    const icon = document.createElement("span");
    icon.textContent = "⚠️";
    const msg = document.createElement("span");
    msg.textContent = message;
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => container.remove();
    container.append(icon, msg, closeBtn);
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4000);
  };

  // Speech Recognition
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
    if (!recognitionRef.current) return;
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

  useEffect(() => {
    if (showModelDropdown) {
      const handleClick = (e: MouseEvent) => {
        const dropdown = document.getElementById('promptbox-model-dropup');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setShowModelDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showModelDropdown]);

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
      {/* Model selection above prompt box, aligned left */}
      {/* Model selection removed: always Groq/Llama */}
      {showImageGenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#242526] border border-white/20 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">AI Image Generation</h2>
              <button onClick={() => setShowImageGenModal(false)} className="text-white/60 hover:text-white active:text-white text-2xl p-1">✕</button>
            </div>
            <div className="space-y-4">
              <label htmlFor="image-gen-input" className="sr-only">Describe your image</label>
              <input
                id="image-gen-input"
                type="text"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-400 text-sm mb-2"
                placeholder="Describe your image..."
                value={imageGenPrompt}
                onChange={e => setImageGenPrompt(e.target.value)}
                disabled={imageGenLoading}
                aria-label="Describe your image"
              />
              <button
                className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white font-medium text-sm"
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
                      console.log("[Image Gen] Response:", data);
                      // Backend returns { url: "..." }
                      const imageUrl = data.url || data.imageUrl || data.image;
                      if (imageUrl) {
                        setGeneratedImage(imageUrl);
                      } else {
                        showToast("No image URL in response. Check backend logs.");
                      }
                    } else {
                      setGeneratedImage("");
                      const errText = await res.text().catch(() => "");
                      console.error("[Image Gen] Error response:", res.status, errText);
                      showToast(`Image generation failed (${res.status}). Check backend logs.`);
                    }
                  } catch (err) {
                    setGeneratedImage("");
                    console.error("[Image Gen] Catch error:", err);
                    const msg = err instanceof Error ? err.message : "Error generating image. Try again.";
                    showToast(msg);
                  } finally {
                    setImageGenLoading(false);
                  }
                }}
                disabled={imageGenLoading}
              >{imageGenLoading ? "Generating..." : "Generate Image"}</button>
              {generatedImage && (
                <div className="w-full flex flex-col items-center mt-4">
                  <img src={generatedImage} alt="Generated" className="rounded-lg max-h-64 object-contain mx-auto border border-white/20" />
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow transition-colors"
                    title="Download image"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {selectedImage && (
        <div className="w-full flex flex-col items-center mb-2 gap-2">
          <div className="relative max-w-xs w-full bg-black rounded-xl border border-white/20 shadow-lg p-2 flex items-center">
            <img src={selectedImage} alt="Preview" className="rounded-lg max-h-32 object-contain mx-auto" />
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
              onClick={() => setSelectedImage("")}
              type="button"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="relative mx-auto w-full max-w-xl flex items-end gap-2 border border-gray-700 bg-[#242526] rounded-xl shadow-lg px-3 py-2 mt-2">
        {/* Dropdown */}
        <button
          className="p-2 rounded-full bg-gray-600 hover:bg-gray-800 active:bg-gray-900 transition flex items-center justify-center"
          type="button"
          onClick={() => setShowDropdown((v) => !v)}
          aria-label="More options"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
        {showDropdown && (
          <div
            id="promptbox-dropup"
            className="absolute left-0 bottom-full mb-2 flex flex-row gap-2 items-center z-50 shadow-lg bg-[#242526] rounded-xl px-2 py-2 border border-gray-700 min-w-[120px]"
          >
            <button
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 active:bg-blue-300 transition flex items-center justify-center border border-blue-400"
              onClick={() => {
                setShowDropdown(false);
                setShowComingSoon(true);
              }}
              type="button"
              aria-label="Attach Image"
            >
              <Paperclip className="w-5 h-5 text-blue-700" />
            </button>
                  {/* Coming Soon Dialog */}
                  {showComingSoon && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" style={{ overscrollBehavior: 'none' }}>
                      <div className="bg-gradient-to-br from-[#232324] via-[#232324] to-cyan-900 border-2 border-cyan-400 rounded-3xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-bounce-in relative" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                        <svg className="w-16 h-16 text-cyan-400 mb-4 animate-pop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#0ff2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                        <div className="text-2xl font-extrabold text-cyan-300 mb-2 drop-shadow-lg">Coming Soon</div>
                        <div className="text-white/80 mb-4 text-center text-base">This feature is under construction.<br/>Stay tuned for updates!</div>
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition" onClick={() => setShowComingSoon(false)}>OK</button>
                        <div className="absolute top-2 right-2">
                          <button className="text-white/60 hover:text-white text-2xl p-1" onClick={() => setShowComingSoon(false)} title="Close">✕</button>
                        </div>
                      </div>
                    </div>
                  )}
            <button
              className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-300 transition flex items-center justify-center border border-indigo-400"
              onClick={() => {
                setShowDropdown(false);
                setShowImageGenModal(true);
              }}
              type="button"
              aria-label="Generate Image"
            >
              <ImageIcon className="w-5 h-5 text-indigo-700" />
            </button>
          </div>
        )}
        {/* Textarea */}
        <textarea
          className="flex-1 min-w-0 resize-none bg-transparent text-white placeholder-gray-300 text-base border-none px-0 py-2 focus:outline-none focus:ring-0 transition leading-relaxed max-h-40 overflow-y-auto hide-scrollbar font-medium"
          placeholder="Type your message..."
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
              if (!value.trim() && !selectedImage) {
                alert("Cannot send empty message. Please enter text or upload an image.");
                return;
              }
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
          inputMode="text"
          style={{ minHeight: 40 }}
        />
        {/* Controls */}
        <div className="flex gap-2 items-end flex-shrink-0">
          {/* Custom bot ON/OFF toggle and icon */}
          <button
            className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-black shadow hover:from-cyan-300 hover:to-indigo-400 transition"
            type="button"
            onClick={() => {
              if (!customBot) {
                setShowSetBotDialog(true);
              } else {
                onToggleCustomMode();
              }
            }}
            title={customBot ? (customMode ? "Bot Mode On" : "Bot Mode Off") : "No Custom Bot Set"}
            aria-label="Custom Bot Mode"
          >
            {customBot ? (
              customMode ? (
                <span title="Bot Mode On">
                  <BotMessageSquare className="w-4 h-4 text-cyan-400" aria-label="Bot Mode On" />
                </span>
              ) : (
                <span title="Bot Mode Off">
                  <BotOff className="w-4 h-4 text-gray-400" />
                </span>
              )
            ) : (
              <span title="No Custom Bot">
                <BotOff className="w-4 h-4 text-gray-400" />
              </span>
            )}
          </button>
          {/* Small dialog for setting custom bot */}
          {showSetBotDialog && (
            <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
              <div className="mb-24 sm:mb-32 bg-[#232324] border border-cyan-400/60 rounded-xl shadow-xl px-6 py-4 flex items-center gap-3 animate-fade-in pointer-events-auto" style={{ minWidth: 260, maxWidth: 340 }}>
                <BotOff className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-cyan-300 text-base mb-1">Set Custom Bot</div>
                  <div className="text-white/80 text-sm">To use custom bot mode, please set up your custom bot first.</div>
                </div>
                <button
                  className="ml-2 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow transition"
                  onClick={() => {
                    setShowSetBotDialog(false);
                    onOpenCustomBotModal();
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  Set Now
                </button>
                <button
                  className="ml-1 px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-xs shadow transition"
                  onClick={() => setShowSetBotDialog(false)}
                  style={{ pointerEvents: 'auto' }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleMicClick}
            className={`p-2 rounded-full transition flex items-center justify-center ${isListening ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-gray-800 active:bg-gray-900'}`}
            type="button"
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMicClick();
              }
            }}
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
          {isGenerating ? (
            <button
              onClick={() => {
                if (abortController) abortController.abort();
                setIsGenerating(false);
              }}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 transition flex items-center justify-center shadow-lg"
              type="button"
              aria-label="Stop generating"
              tabIndex={0}
            >
              <svg className="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="ml-2 text-xs text-white">Stop</span>
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!value.trim() && !selectedImage) {
                  alert("Cannot send empty message. Please enter text or upload an image.");
                  return;
                }
                setIsGenerating(true);
                const controller = new AbortController();
                setAbortController(controller);
                let ok = false;
                try {
                  if (selectedImage && selectedImage.trim()) {
                    ok = await onSend(selectedImage.trim(), selectedModel === "groq" ? "groq" : "gemini");
                    if (ok) setSelectedImage("");
                  } else if (value.trim()) {
                    ok = await onSend(value.trim(), selectedModel === "groq" ? "groq" : "gemini");
                    if (ok) setValue("");
                  }
                } catch (e) {
                  // handle abort or error
                } finally {
                  setIsGenerating(false);
                }
              }}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition flex items-center justify-center shadow-lg"
              type="button"
              aria-label="Send message"
              tabIndex={0}
              onKeyDown={async e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsGenerating(true);
                  const controller = new AbortController();
                  setAbortController(controller);
                  try {
                    if (selectedImage && selectedImage.trim()) {
                      const ok = await onSend(selectedImage.trim(), selectedModel === "groq" ? "groq" : "gemini");
                      if (ok) setSelectedImage("");
                    } else if (value.trim()) {
                      const ok = await onSend(value.trim(), selectedModel === "groq" ? "groq" : "gemini");
                      if (ok) setValue("");
                    }
                  } catch (e) {
                    // handle abort or error
                  } finally {
                    setIsGenerating(false);
                  }
                }
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
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